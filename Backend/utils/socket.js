export const getsocketId=(receiverId)=>{
    return socketmap[receiverId];

}

const socketmap={};
export const handleconnection=(io,socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId){
        socket.join(userId);
    }
    if(userId && userId!=="undefined"){
    socketmap[userId]=socket.id;
    }
 io.emit("getOnlineuser",Object.keys(socketmap));

    socket.on("disconnect",()=>{
   delete socketmap[userId];


   io.emit("getOnlineuser",Object.keys(socketmap));
    })
}