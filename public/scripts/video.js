let text = document.querySelector("p");
const socket = io();
let screen = window.getComputedStyle(document.body)
let text_input = document.getElementById("message");
let send_btn = document.getElementById("send");
let screen_num = parseInt(screen.getPropertyValue("width").slice(0, -2))
let my_video = document.getElementById("v_1");
let your_video = document.getElementById("v_2");
let room_input = document.getElementById("code");
const join_room = document.getElementById("join");
let variable;
let sign_out_btn = document.getElementById("log-out")
let v;
let keys = [];
let user = prompt("What is your name");
while (user == "" || user == null || user == undefined){
  user = prompt("What is your name")
}
let connected_users;
let con;
let yes_no = false;
var peer;
let num = 0;
let stream2;
let user_two;


function testName(){
  if (localStorage.getItem(user) == null || localStorage.getItem(user) == undefined || localStorage.getItem(user) == ""){
    localStorage.setItem(user, socket.id);
    connected_users = {me: user, you: undefined};
    socket.emit("name", user, (socket.id))
  } else {
    alert("That name already exists, choose a different one");
    user = prompt("What is your name");
      while (user == "" || user == undefined || user == null){
        user = prompt("What is your name");
    }
    testName();
  }
}

let handleSuccess = function(stream){
    stream2 = stream;
    join_room.addEventListener("click", () =>{
      if (room_input.value != "" || room_input.value != null || room_input.value != undefined){
        const call = peer.call(room_input.value, stream);
        call.on("stream", function(remoteStream){
          alert("Call accepted")
          your_video.srcObject = remoteStream;
          
        })
      }
    })
    
    peer.on("call", function(call){
      window.focus();
      call.answer(stream2);
      room_input.value = call.peer;
      call.on("stream", function(otherStream){
        your_video.srcObject = otherStream;
      })
    })
    
    my_video.srcObject = stream2;
    
}


navigator.mediaDevices.getUserMedia({video: true, audio: true})
.then(handleSuccess)
window.oncontextmenu = function(){
   if (document.body != null){
    alert("Hey hey hey! What are you trying to pull?");
    localStorage.removeItem(user)
    document.body.remove();
    window.location.href = "https://greater.armanakbari1.repl.co"
  }
}


window.addEventListener("beforeunload", (e) => {
  e.returnValue = "Test";
  //localStorage.removeItem(user);
})
document.addEventListener("keydown", (e) => {
    if (e.keyCode == 13){
      send_btn.click();
    }
})
send_btn.addEventListener("click", () => {
  if (yes_no){
    if (text_input.value == "y"){
      con = true;
      connected_users = {me: user, you: user_two};
      user_two = undefined;
      socket.emit("join2", "y")
      text_input.value = "";
      text.innerHTML = "";
      yes_no = false;
    }
    if (text_input.value == "n"){
      con = false;
      usertwo = undefined;
      socket.emit("join2", "n")
      alert("Call declined");
      text_input.value = "";
      text.innerHTML = "";
      yes_no = false;
    }
  } else if (!yes_no){
    if (room_input.value != "" || room_input.value != null || room_input.value != undefined){
      socket.emit("message", {message: text_input.value, sender: user, receiver: room_input.value});
      text_input.value = "";
    }
  }
})
socket.on("message2", (data) => {
  let message = Object.values(data)[0];
  let sender = Object.values(data)[1];
  let receiver = Object.values(data)[2];
  if (user == sender){
    if (text.innerHTML == ""){
      text.innerHTML = `Me: ${message}`;
    } else {
      text.innerHTML += `<br>Me: ${message}`;
    }
  } else if (user == receiver){
    if (text.innerHTML == ""){
      text.innerHTML = `${sender}: ${message}`;
    } else {
      text.innerHTML += `<br>${sender}: ${message}`;
    }
  }
})
document.body.onload = function(){
  peer = new Peer(user, {metadata: {UserName: user}});
  if (document.cookie != ""){
      //logg=true
      let arr = document.cookie.split("=")
      if (arr[1] != "true"){
          window.location.href= "/"
      }
  }
}
sign_out_btn.addEventListener("click", () => {
  document.cookie = "logg=false;uname="
  window.location.href = "/"
})