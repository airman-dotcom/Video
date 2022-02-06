const express = require("express")
const app = express();
const http = require("http");
const server = http.createServer(app);
const fs = require("fs");
const { Server } = require("socket.io");
const io = new Server(server);
const { v4: uuidv4 } = require("uuid")
app.use(express.static("public"));
app.use(express.json());
let users = {};
let num = 1;
let info;
let user1;
server.listen(3000, "localhost", () => {
    console.log("Listening on http://localhost:3000/")
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
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
    /*socket.on("message", (room, message, user) => {
        console.log(message);
        const data = fs.readFileSync("cred.txt", "utf-8");
        if (data == ""){
            let message2 = "In Room: " + `"${room}"` + ". User: " + `"${user}"` + ", texted this: " + `"${message}"` + ".";
            fs.writeFileSync("cred.txt", message2)
        } else {
            let message2 = data + "\nIn Room: " + `"${room}"` + ". User: " + `"${user}"` + ", texted this: " + `"${message}"` + ".";
            fs.writeFileSync("cred.txt", message2);
        }
        io.to(room).emit("message2", message, (user))
    });*/
    socket.on("join_video", (room_name) => {
        socket.join(room_name);
    });
    socket.on("data", (room, data) => {
        socket.to(room).emit("video", data)
    })
    socket.on("name", (nam, id) => {
      if (JSON.stringify(users) == "{}"){
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
      if (Object.keys(users).includes(to)){
        let index = Object.keys(users).indexOf(to);
        let user2_id = Object.values(users)[index];
        
        socket.broadcast.to(user2_id).emit("join", (user1_name));
      }
    })
    socket.on("join2", (answer) => {
      if (answer == "y"){
        socket.broadcast.to(user1).emit("answer", "y")
      }
       else if (answer == "n"){
        socket.broadcast.to(user1).emit("answer", "n")
      } else {
        console.log("err");
      }
    });
    
    socket.on("message", (data) => {
      let message = Object.values(data)[0]
      let sender = Object.values(data)[1];
      let sender_id;
      let receiver_id;
      let receiver = Object.values(data)[2];
      if (Object.keys(users).includes(sender) && Object.keys(users).includes(receiver)){
        sender_id = Object.values(users)[Object.keys(users).indexOf(sender)];
        receiver_id = Object.values(users)[Object.keys(users).indexOf(receiver)];
        io.to(sender_id).to(receiver_id).emit("message2", data);
      }
      
    })
})


app.post("/code", (req, res) => {
    const code = uuidv4();
    res.json({code: code})
})

app.post("/stream", (req, res) => {
    let data = req.body.data;
    let send = Readable.from(data)
    res.json({data: send})
})

app.post("/test", (req, res) => {
  console.log("disconnected")
})

