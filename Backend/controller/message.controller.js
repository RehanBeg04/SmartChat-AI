import User from "../models/auth.model.js"
import cloudinary from "../lib/cloudinary.js"
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { io } from "../index.js"
import { getsocketId } from "../utils/socket.js";
import { getAnswerfromAI } from "../utils/geminiservice.js";


export const fetchfriends = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate({
            path: "friends",
            select: "_id Fullname bio profilepic"
        }).select("friends").sort({Fullname:1});


        if (!user) {
            return res.status(404).json({
                message: "User not found",
            })
        }
        const getallUser = user.friends;
        const Unseenmessages = {};
        const promise = getallUser.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
            if (messages.length > 0) {
                Unseenmessages[user._id] = messages.length;
            }
        })
        await Promise.all(promise);
        res.status(200).json({
            message: "User Found Successfully",
            user,
            Unseenmessages
        })
    } catch (err) {
        res.status(404).json({
            message: "Internal Server eror", err
        })
    }
}
export const getuser = async (req, res) => {
    try {
        const Loggedinuser = req.user._id;
        const user = await User.findById({ _id: Loggedinuser });

        return res.status(200).json({
            message: "User Found Successfully",
            user
        })
    } catch (err) {
        res.status(500).json({ message: "Internal Server error" });

    }
}

export const getMessage = async (req, res) => {
    try {
        const getmessageId = req.params.id;
        const myId = req.user._id;

        if (!getmessageId) {
            return null;
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [myId, getmessageId] },
        }).populate("messages");

        await Message.updateMany({ senderId: getmessageId, receiverId: myId }, { seen: true })

        if (!conversation) {
            await Conversation.create({
                participants: [myId, getmessageId]
            })
        }


        res.status(200).json(conversation);

    } catch (err) {
        res.status(500).json({ message: "Internal Server error" });
    }

}

export const sendMessage = async (req, res) => {
    try {
        const { message, image, receiverId } = req.body;
        const senderId = req.user._id;
        const sendersocketId = getsocketId(senderId);
        const receiversocketId = getsocketId(receiverId);

        let imageUrl;

        if (!message && !image) {
            return res.status(400).json({
                message: "Please Send valid data",
            })
        }

        if (message.startsWith("@ai")) {
            const prompt = message.replace("@ai", "");
            const res = await getAnswerfromAI(prompt);
            const conversation = await Conversation.findOne({
                participants: { $all: [senderId, senderId] }
            })
            if (!conversation) {
                await Conversation.create({
                    participants: [senderId, senderId],
                })
            }

            const newMessage = new Message({
                senderId: senderId,
                receiverId: senderId,
                message: res,
                isAi: true,
                visibleTo: senderId
            });

            await newMessage.save();
            conversation.messages.push(newMessage._id);

            await conversation.save();
            const sendersocketId = getsocketId(senderId);
            if (sendersocketId) {
                io.to(sendersocketId).emit("newMessage", newMessage);
            }
        } else {
            if (image) {
                const uploaderesponse = await cloudinary.uploader.upload(image, {
                    folder: "chatImages"
                });
                imageUrl = uploaderesponse.secure_url;
            }

            const conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] }
            })
            if (!conversation) {
                await Conversation.create({
                    participants: [senderId, receiverId],
                })
            }
            const newMessage = new Message({
                senderId,
                receiverId,
                message,
                image: imageUrl
            })

            await newMessage.save();
            conversation.messages.push(newMessage._id);


            await conversation.save();

            if (sendersocketId) {
                io.to(sendersocketId).emit("newMessage", newMessage);
            }
            if (receiversocketId) {
                io.to(receiversocketId).emit("newMessage", newMessage);
            }
        }

        res.status(200).json({
            message: "Sent Successfully"
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server error" });
    }
}
export const deleteMessage = async (req, res) => {
    try {
        let { id } = req.params;
        const msg = await Message.findById(id);
        if (!msg) {
            return res.status(404).json({
                message: "No Message Exist"
            })
        }

        if (msg.image) {
            const path = msg.image.split("/");
            const filewithext = path.pop();
            const folder = path.pop();
            const filename = filewithext.split(".")[0];
            await cloudinary.uploader.destroy(`${folder}/${filename}`);
        }
        const userId = req.user._id.toString();
        const otheruserId = (msg.senderId.toString() === userId) ? msg.receiverId.toString() : msg.senderId.toString();
        await Message.findByIdAndDelete(id);
        await Conversation.updateMany(
            { messages: id },
            { $pull: { messages: id } })


        const usersocketId = getsocketId(userId);
        const othersocketId = getsocketId(otheruserId);

        if (usersocketId) {
            io.to(usersocketId).emit("messagedeleted", msg._id);
        }
        if (otheruserId) {
            io.to(othersocketId).emit("messagedeleted", msg._id);
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const deleteforme = async (req, res) => {
    try {
        let { id } = req.params;
        const userId = req.user._id;

        const updatemsg = await Message.findByIdAndUpdate(id,
            { $addToSet: { deletedFor: userId } },
            { new: true }
        )

        if (updatemsg.deletedFor.includes(updatemsg.senderId)
            && updatemsg.deletedFor.includes(updatemsg.receiverId)) {
            await Message.findByIdAndDelete(updatemsg._id);
            await Conversation.updateMany(
                { messages: id },
                { $pull: { messages: updatemsg._id } })

            if (updatemsg.image) {
                const path = updatemsg.image.split("/");
                const filewithext = path.pop();
                const folder = path.pop();
                const filename = filewithext.split(".")[0];
                await cloudinary.uploader.destroy(`${folder}/${filename}`);
            }

        }


        const usersocketId = getsocketId(userId);



        if (usersocketId) {
            io.to(usersocketId).emit("deleteforme", updatemsg._id)
        }
        res.status(200).json({
            message: "Message Updated",
            updatemsg
        })
    } catch (err) {
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const Markasseen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {
            seen: true,
        })
        res.json({ success: true });

    } catch (err) {
        res.json({ success: false, message: error.message })
    }
}
