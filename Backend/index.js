import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import {connectDB} from "./lib/db.js"
import authroute from "./routes/auth.routes.js"
import userroutes from "./routes/user.routes.js"
import friendroutes from "./routes/friendreq.routes.js"
import messageroute from "./routes/message.routes.js"
import http from "http"
import {Server} from "socket.io"
import { handleconnection } from "./utils/socket.js";
import path from "path";


dotenv.config();
const port=process.env.PORT ||5001;

const app=express();

 const _dirname=path.resolve();
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
)
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true}))
app.use(cookieparser());


app.use("/api/auth",authroute);
app.use("/api",userroutes);
app.use("/api/messroute",messageroute);
app.use("/api",friendroutes);

app.use(express.static(path.join(_dirname,"/frontened/dist")));

app.get('/*splat',(req,res)=>{
    res.sendFile(path.resolve(_dirname,"frontened","dist","index.html"));
})

const server=http.createServer(app);

export const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }

})

io.on("connection",(socket)=>{handleconnection(io,socket)});

server.listen(port,()=>{
     console.log("Server is listening on",port);
     connectDB();
})