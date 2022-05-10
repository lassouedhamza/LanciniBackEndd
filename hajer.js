'use strict';

require("dotenv").config({path: "./config.env"});
var QuestionRouter = require('./routes/routerquestions');
var CategoriesRouter = require('./routes/routercategories');
const connectDB = require('./config/db');
const errorHandler=require('./middleware/error')
const cors=require('cors')
const bankingRoutes =require('./routes/bankingpartners.js');
const eventsRouter = require('./routes/events.route');
const axios = require('axios');
const http = require('http');
const express = require("express");
const app = express();

var bodyParser = require('body-parser')
const projectRoutes = require( './routes/projectRoutes.js');
const path =require( 'path');

const uploadRoutes = require('./routes/uploadRoutes.js');
const banksuploadRoutes = require('./routes/banksuploadsRoutes.js');
const socket = require('socket.io');
const uploadImageEvent = require('./routes/uploadImageEvent.js');
//connect DB 
connectDB();
app.use('/banks/upload',banksuploadRoutes)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors({origin:"http://localhost:3000"}));
app.use('/api/events', eventsRouter);
app.use(express.json());
app.use(errorHandler);
app.use("/auth",require("./routes/auth"));
app.use("/api", require("./routes/routercategories"));
app.use("/api", require("./routes/routerquestions"));
app.use("/private",require("./routes/private"));
app.use('/bankingpartners', bankingRoutes);
app.use('/api/projects', projectRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use('/api/events/upload',uploadImageEvent)
/////////////////////const io = require("socket.io");

// const { ExpressPeerServer } = require("peer");
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";
const { ExpressPeerServer } = require("peer");
const server = app.listen(PORT, HOST, () => console.log(`server running on port ${PORT}`));
process.on("unhandledRejection",(err,promise)=>{
    console.log(`Logged Error : ${err}`);
    server.close(()=>process.exit(1));
})
app.use((req, res, next) => {
    req.io = io;
    next();
  });
  const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: "/kingaspx",
  });
  
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ApiFound", "index.html"));
});


// socket setup



const getApiAndEmit = async socket => {
    try {
        const res = await axios.get('http://127.0.0.1:5000/api/events');
        io.emit('events', res.data);
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

//chat process
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      credentials:true
    }
  });
  let interval;
io.on('connection', socket => {
    console.log(`socket connected, id = ${socket.id}`);
    if (interval) clearInterval(interval);
    interval = setInterval(() => getApiAndEmit(socket), 1000);
})
  
  io.on('connection',(socket)=> {
    console.log(socket.id);
  
    //recieving an event
    socket.on('join_room',(data)=> {
        socket.join(data)
        console.log("User Joined Room:" +data)
    })
   //create an event (2events exactly here )
    socket.on("send_message", (data)=> {
        console.log(data);
        socket.to(data.room).emit("recieve_message", data.content);
    })
  
    socket.on('disconnect',()=>{
        console.log('USER DISCONNECTED')
    })
    // socket setup
//const io = socket(server);

  }
  
  )






