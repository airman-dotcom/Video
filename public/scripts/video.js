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
        
        //socket.emit("get_id", {"me": socket.id, "to": room_input.value})
        const call = peer.call(room_input.value, stream);
        call.on("stream", function(remoteStream){
          alert("Call accepted")
          //connected_users = {me: user, you: room_input.value}
          your_video.srcObject = remoteStream;
          
        })
      }
    })
    
    peer.on("call", function(call){
      window.focus();
      //setInterval(function(){
        //if (con){
          //text.innerHTML=`${call.peer} wants to call you. (y/n)`;
          /*const x = confirm(`${call.peer} wants to call you. Confirm?`)
          if (x){*/
            call.answer(stream2);
            room_input.value = call.peer;
          //}
        //}
      //})
      
      call.on("stream", function(otherStream){
        your_video.srcObject = otherStream;
      })
    })
    
    my_video.srcObject = stream2;
    
}


navigator.mediaDevices.getUserMedia({video: true, audio: true})
.then(handleSuccess)

/*socket.on("video", (data) => {
    const data1 = {
        data: data
    };
    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data1)
    };
    fetch("/stream", send_data)
    .then(response => response.json())
    .then(function(json){
        stream2 = Object.values(json)[0]
    })
    console.log(1)
    your_video.srcObject = stream2;
})


socket.on("connect", () => {
  testName();
})
*/
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
  
  /*if (keys.length < 3){
    keys.push(e.keyCode);
    console.log(keys)
  } if (keys.length == 3){
    console.log(keys)
    if (keys.includes(17) && keys.includes(16) && keys.includes(73)){
      localStorage.removeItem(user);
      alert("Hey hey hey! What are you trying to pull?");
      document.body.remove();
      window.location.href = "https://greater.armanakbari1.repl.co";
    } else if (keys.includes(17) && keys.includes(16) && keys.includes(74)){
      localStorage.removeItem(user);
      alert("Hey hey hey! What are you trying to pull?");
      document.body.remove();
      window.location.href = "https://greater.armanakbari1.repl.co";
    } else if (keys.includes(17) && keys.includes(16) && keys.includes(67)){
      localStorage.removeItem(user);
      alert("Hey hey hey! What are you trying to pull?");
      document.body.remove();
      window.location.href = "https://greater.armanakbari1.repl.co";
    } else {
      keys = [];
    }
  }
    if (keys.length == 1){
      if (keys[0] == 123){
      localStorage.removeItem(user);
      alert("Hey hey hey! What are you trying to pull?");
      document.body.remove();
      window.location.href = "https://greater.armanakbari1.repl.co";
      }
    }
    if (keys.length == 2){
      if (keys.includes(17) && keys.includes(85)){
        localStorage.removeItem(user);
      alert("Hey hey hey! What are you trying to pull?");
      document.body.remove();
      window.location.href = "https://greater.armanakbari1.repl.co";
      }
    }*/
    if (e.keyCode == 13){
      send_btn.click();
    }
})
/*
socket.on("join", (user2) => {
  text.innerHTML = "A user would like to call. Accept call? (y/n)";
  yes_no = true;
  console.log(user2)
  user_two = user2;
})
*/
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
    if (/*Object.values(connected_users)[1] != undefined*/room_input.value != "" || room_input.value != null || room_input.value != undefined){
      //socket.emit("message", {message: text_input.value, frome: user, to: Object.values(connected_users)[1]});
      socket.emit("message", {message: text_input.value, sender: user, receiver: room_input.value});
      text_input.value = "";
    }
  }
})
/*
socket.on("answer", (answer) => {
  if (answer == "y"){
    alert("Call accepted");
  } else if(answer == "n"){
    alert("Call declined")
  }
})
*/
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
  $.getJSON("https://api.ipify.org?format=json", (data) => {
      ip = data.ip;
      const data3 = {
          ip: ip,
      };
      const send_data = {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data3)
      };
      fetch("/logged-in", send_data)
      .then(response => response.json())
      .then(function(json){
          if (Object.values(json)[0]){
              alert("Logged in")
          } else {
            window.location.href="/"
          }
      })
  })
}