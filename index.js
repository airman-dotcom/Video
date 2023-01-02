const express = require("express")
const app = express();
const http = require("http");
const server = http.createServer(app);
const fs = require("fs");
const { Server } = require("socket.io");
const io = new Server(server);
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const { json } = require("express");
let MONGO_URI = "mongodb+srv://amathakbari:24l63AQs7kQ8D3hX@my-db.m8xjh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI)
let db = mongoose.connection
const kittySchema = new mongoose.Schema()
app.use(express.static("public"));
app.use(express.json());
let users = {};
const port = process.env.PORT || 8000;
let num = 1;
let info;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let user1;
server.listen(port, function(){
  console.log("Server Starting")
})
let credentials = db.collection("credentials")
mongoose.connection.on("connected", (err) => {
  if (err){
    console.log(err)
  }
  console.log("Connected to database")
})
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

app.get("/menu", (req, res) => {
  res.sendFile(__dirname + "/public/menu.html")
})

app.get("/video", (req, res) => {
  res.sendFile(__dirname + "/public/video.html")
})

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
})

app.get("/sign-up", (req, res) => {
  res.sendFile(__dirname + "/public/sign-up.html");
})

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/sign-up.html")
})
io.on("connection", (socket) => {
  socket.on("Connected", () => {
    socket.emit("Connected User", "A user has connected")
  });
  socket.on("Disconnected", () => {
    socket.emit("Disconnected User", "A user has disconnected")
  });
  socket.on("join_room", (room) => {
    socket.join(room);
  });
  socket.on("message", (data) => {
      console.log(data);
      io.emit("message2", data)
  });
  socket.on("join_video", (room_name) => {
    socket.join(room_name);
  });
  socket.on("data", (room, data) => {
    socket.to(room).emit("video", data)
  })
  socket.on("name", (nam, id) => {
    if (JSON.stringify(users) == "{}") {
      users = `{"${nam}": "${id}"}`;
      users = JSON.parse(users)
    } else {
      users = JSON.stringify(users);
      users = users.slice(0, -1) + `,"${nam}": "${id}"}`;
      users = JSON.parse(users)
    }
  });
  socket.on("get_id", (data) => {
    user1 = Object.values(data)[0]//User1 Id
    let user1_index = Object.values(users).indexOf(user1);
    let user1_name = Object.keys(users)[user1_index]
    let to = Object.values(data)[1];
    if (Object.keys(users).includes(to)) {
      let index = Object.keys(users).indexOf(to);
      let user2_id = Object.values(users)[index];

      socket.broadcast.to(user2_id).emit("join", (user1_name));
    }
  })
  socket.on("join2", (answer) => {
    if (answer == "y") {
      socket.broadcast.to(user1).emit("answer", "y")
    }
    else if (answer == "n") {
      socket.broadcast.to(user1).emit("answer", "n")
    } else {
      console.log("err");
    }
  });
})


app.post("/code", (req, res) => {
  const code = uuidv4();
  res.json({ code: code })
})

app.post("/stream", (req, res) => {
  let data = req.body.data;
  let send = Readable.from(data)
  res.json({ data: send })
})

app.post("/test", (req, res) => {
  console.log("disconnected")
})

app.post("/create_acc", (req, res) => {
  let email = req.body.email;
  let psw = req.body.psw;
  let uname = req.body.uname;
  credentials.findOne({email: email}, (err, doc) => {
    if (doc == null){
      const data2 = {
        email: email,
        password: psw,
        uname: uname,
        friends: [],
        recentCalls: [],
        requests: [],
      }
      credentials.insertOne(data2)
      res.json({status: true})
    } else {
      res.json({ status: false, message: "Email already exists in our database." })
    }
  })
})

app.post("/login", (req, res) => {
  let email = req.body.email;
  let psw = req.body.psw;
  credentials.findOne({email: email}, (err, doc) => {
    if (doc != null){
      if (doc.password == psw){
        res.json({status: true})
      } else {
        res.json({ status: false, message: "Incorrect Password" })
      }
    } else {
      res.json({ status: false, message: "Email doesn't exist in our database" });
    }
  })
})


app.post("/load", (req, res) => {
  let email = req.body.email;
  credentials.findOne({email: email}, (err, results) => {
    if (results != null){
      res.json({status: true, data: results})
    } else {
      res.json({status: false, data: null})
    }
  })
})

app.post("/addfriend", (req, res) => {
  let to = req.body.to;
  let from = req.body.from;
  credentials.updateOne({uname: to}, {$push: {'requests': from}}, (err, results) => {
    console.log(results);
  })
})

app.post("/friend", (req, res) => {
  let from = req.body.from;
  let to = req.body.to;
  let acc = req.body.a;
  credentials.findOne({uname: to}, (err, results) => {
    let nr = results.requests;
    nr.splice(nr.indexOf(from), 1);
    credentials.updateOne({uname: to}, {$set: {'requests': nr}})
    if (acc == true){
      credentials.updateOne({uname: to}, {$push: {friends: from}});
      credentials.updateOne({uname: from}, {$push: {friends: to}})
    }
  })
  return res.json({status: true})
})

app.post("/removefriend", (req, res) => {
  let friend = req.body.toremove;;
  let from = req.body.from;
  credentials.findOne({uname: from}, (err, results) => {
    let nr = results.friends;
    nr.splice(nr.indexOf(friend), 1);
    credentials.updateOne({uname: from}, {$set: {friends: nr}})
  })
  credentials.findOne({uname: friend}, (err, results) => {
    let nr = results.friends;
    nr.splice(nr.indexOf(from), 1);
    credentials.updateOne({uname: friend}, {$set: {friends: nr}})
  })
  res.json({status: true})
})

app.post("/nload", (req, res) => {
  let key = req.body.key;
  let value = req.body.value;
  let obj = {};
  obj[key] = value;
  credentials.findOne(obj, (err, results) => {
    if (results != null) res.json({status: true, data: results})
  })
})