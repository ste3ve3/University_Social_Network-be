
import bodyParser from "body-parser";
import express from "express";
const app = express();

import cors from "cors";
import mongoose from "mongoose";
import contactRoute from "./routes/contactRoute.js";
import registerRoute from "./routes/registerRoute.js";
import googleRoute from "./routes/googleRoute.js";
import facebookRoute from "./routes/facebookRoute.js";
import githubRoute from "./routes/githubRoute.js";
import loginRoute from "./routes/loginRoute.js";
import blogRoute from "./routes/blogRoute.js";
import passport from "passport";
import expressSession from "express-session";
import MemoryStore from "memorystore";
import cookieParser from "cookie-parser";
import socialMediaLoggedInUser from "./routes/socialMediaRoute.js";

//chats
import http from 'http';
import { Server } from 'socket.io';
import formatMessage from '../src/chat/messages.js';
import {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} from '../src/chat/users.js';
import path from 'path';
import {fileURLToPath} from 'url';


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const botName = 'University Social Network Bot';

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username }) => {
    const user = userJoin(socket.id, username);

    socket.join(user.room);

    // Welcome current user
    socket.emit(
      'message',
      formatMessage(botName, 'Welcome to the University Social Network Chat!')
    );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});




const ourMemoryStore = MemoryStore(expressSession);

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 
  }


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/chat', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('random'));

app.use(expressSession({
    secret: "random",
    resave: true,
    saveUninitialized: true,
    // setting the max age to longer duration
    maxAge: 24 * 60 * 60 * 1000,
    store: new ourMemoryStore(),
}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/contact", cors(corsOptions), contactRoute);
app.use("/register", cors(corsOptions), registerRoute);
app.use("/login", cors(corsOptions), loginRoute);
app.use("/", cors(corsOptions), blogRoute);
app.use("/", cors(corsOptions), googleRoute);
app.use("/", cors(corsOptions), facebookRoute);
app.use("/", cors(corsOptions), githubRoute);
app.use("/", cors(corsOptions), socialMediaLoggedInUser);
app.use('/images',express.static('src/images'))
app.use('/postImages',express.static('src/postImages'))
app.use('/transcriptImages',express.static('src/transcriptImages'))



mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true});

mongoose.connection.once("open", ()=>{
    console.log("connected to Mongo DB");
})



const port = process.env.PORT_NUMBER;
server.listen(port, ()=>{
    console.log(`The server is running on ${port}`);
})


