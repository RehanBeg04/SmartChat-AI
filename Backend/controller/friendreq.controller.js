import User from "../models/auth.model.js";
import { Friendlistmodel } from "../models/friendrequest.model.js";
import { Conversation } from "../models/conversation.model.js";
import { io } from "../index.js"
import { Message } from "../models/message.model.js";

export const sendreq = async (req, res) => {
    try {
        const receiverid = req.params.id;
        const senderId = req.user._id;


        const user = await User.findById(receiverid).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            })
        }
         if (receiverid === senderId.toString()) {
            return res.status(404).json({
                message: "You Cannot send request"
            })
        }

        if (user.friends.includes(senderId)) {
            return res.status(400).json({
                message: "You are already Friend"
            })
        }

        const existing = await Friendlistmodel.findOne({
            sender: senderId,
            receiver: receiverid,
        })

        if (existing) {
            return res.status(401).json({
                message: "Friend Request Already Sent"
            })
        }
        const receive = new Friendlistmodel({
            sender: senderId,
            receiver: receiverid,
        })

        await receive.save()
        const Freindlist = await Friendlistmodel.findOne({
            sender: senderId,
            receiver: receiverid
        }).populate("sender", "Fullname profilepic").populate("receiver", "Fullname profilepic");

        return res.status(200).json({
            message: "Friend request sent Successfully",
            Freindlist
        })
    } catch (err) {
        return res.status(500).json({
            message:err.message,
        })

    }
}
export const Incomingreq=async(req,res)=>{
 try{
        const userId=req.user._id;
       

        const user=await User.findOne(userId);

        if(!user){
            return res.status(400).json({
                message:"User does not found",
            })
        }

        const incomingrequests=await  Friendlistmodel.find({receiver:user._id}).populate({path:"sender",
        select:"_id Fullname profilepic"
    }).select("sender");

        
        if(incomingrequests.length==0){
            return res.status(400).json({
                message:"No Incoming Requests are Found",
            })
        }

  return res.status(200).json(incomingrequests);

    }catch(err){
        return res.status(500).json({
            message:"Something went wrong",
        })

    }

}
export const Outgoingreq=async(req,res)=>{
 try{
        const userId=req.user._id;
       

        const user=await User.findOne(userId);
        if(!user){
            return res.status(400).json({
                message:"User does not found",
            })
        }

        const outgoingrequests=await Friendlistmodel.find({sender:user._id}).populate({path:"receiver",
            select:"_id Fullname profilepic"
        }).select("receiver");
        if(outgoingrequests.length==0){
            return res.status(400).json({
                message:"No Outgoing Requests are Found",
            })
        }

        return res.status(200).json(outgoingrequests)

    }catch(err){
        return res.status(500).json({
            message:"Something went wrong",
        })

    }
}
export const acceptreq=async(req,res)=>{
try{
     const {requestId}=req.body;
     const senderId=req.user._id;

     const request=await Friendlistmodel.findById(requestId);
    if(!request){
        return res.status(404).json({
            message:"Request are not Found"
        })
    }
    
       request.status="Accepted";
       await request.save();

       await User.findByIdAndUpdate(request.sender,{
        $addToSet:{friends:request.receiver}
       })

        await User.findByIdAndUpdate(request.receiver,{
        $addToSet:{friends:request.sender}
       })

       await Friendlistmodel.findByIdAndDelete(requestId);
       await Conversation.create({
         participants:[senderId,request.sender._id]
       })

       return res.status(200).json({
        message:"Friend request Accepted"
       })
    }catch(err){
        return res.status(500).json({
            message:"Something went wrong",
        })
    }

}
export const declinereq=async(req,res)=>{
try{
       const {receiverid}=req.body;

       const Friendreq=await Friendlistmodel.findById(receiverid);
       if(!Friendreq){
        return res.status(404).json({
            message:"No request Available "
        })
       }
     Friendreq.status="Declined";
     await Friendreq.save();
   const abFreindreq= await Friendlistmodel.findByIdAndDelete(receiverid);
   console.log(abFreindreq);

   return res.status(200).json({
        message:"Friend Request deleted Successfully",
    })
     }catch(err){
        return res.status(500).json({
            message:"Something went wrong",
        })

     }

}

export const deletefriend = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
       await User.findByIdAndUpdate(userId, {
            $pull: { friends: id }
        },
       { new: true });
        await User.findByIdAndUpdate(id, {
            $pull: { friends: userId }
        },
            { new: true });

     const userA=await User.findById(userId);
     const userB=await User.findById(id);

     const stillfreinds=userA.friends.includes(id)||userB.friends.includes(userId);

     if(!stillfreinds){
        const conversation=await Conversation.findOne({
          participants:{$all:[userId,id]}
        })

        if(conversation){
       await Message.deleteMany({_id:{$in:conversation.messages}})
       await Conversation.findByIdAndDelete(conversation._id);
        }
     }

     if(userId){
        io.to(userId).emit("deleterequest",id);
     }

     if(id){
        io.to(id).emit("deleterequest",userId);
     }
     
        return res.status(200).json({
            message: "User deleted Successfully",
        })

    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
        })
    }
}