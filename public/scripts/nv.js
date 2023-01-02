
let cellnum = document.getElementById("text2");
let numclicked = false;
let callbtn = document.getElementById("call");
let beforediv = document.getElementById("before");
let buttondivs = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c0", "back"];
let interval = setInterval(function () {
  if (cellnum.innerHTML.includes("_")) cellnum.innerHTML = "Type Deskcord Cell";
  else {
    cellnum.innerHTML += "_"
  }
}, 600)

function formatnum(){
  let use = cellnum.innerText.replace("-", "");
  use = use.split("")
  let nuse = use;
  //nuse == [1,1,1,1,1,1,1]
  if (use.length > 3) /*123-4*/nuse.splice(3, 0, "-");
  if (use.length > 6){
    if (nuse.lastIndexOf("-") == 3){
      nuse.splice(8, 0, "-");
    }
  }
  use = nuse.join("");
  cellnum.innerText = use;
}

function buttonclicked(n) {
  if (n == "❌") {
    if (interval != null) {
      clearInterval(interval);
      interval = null;
      cellnum.innerText = "";
      callbtn.style.cursor = "pointer";
    } else {
      if (cellnum.innerText.length > 0) cellnum.innerText = cellnum.innerText.slice(0, -1)
    }
  }
  else if (n == "📞") {

  } else {
    if (interval != null) {
      clearInterval(interval);
      interval = null;
      cellnum.innerText = "";
      callbtn.style.cursor = "pointer";
    }
    let think = cellnum.innerText;
    think = think.replace("-", "");
    if (think.length > 10){
      return;
    }
    cellnum.innerText += n;
    formatnum();
  }
}

document.body.addEventListener("keydown", (e) => {
  if (e.code.slice(0, -1) == "Digit" || e.code.slice(0, -1) == "Numpad" && e.key.length == 1){
    buttonclicked(e.key)
  }
  else if (e.key == "Backspace") {
    buttonclicked("❌");
  }
})

for (let x = 0; x < buttondivs.length; x++) {
  eval(`let ${buttondivs[x]} = document.getElementById("${buttondivs[x]}")`);
  eval(`${buttondivs[x]}.onclick = function(){
    buttonclicked(${buttondivs[x]}.innerText)
  }`)
}

function call() {
  let text = document.getElementById("text3")
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
  let user = document.cookie.split(";")[1].split("=")[1];
  let con;
  let yes_no = false;
  var peer;
  let stream2;
  let user_two;
  let handleSuccess = function (stream) {
    stream2 = stream;
    join_room.addEventListener("click", () => {
      if (room_input.value != "" || room_input.value != null || room_input.value != undefined) {
        const call = peer.call(room_input.value, stream);
        call.on("stream", function (remoteStream) {
          alert("Call accepted")
          your_video.srcObject = remoteStream;

        })
      }
    })

    peer.on("call", function (call) {
      window.focus();
      call.answer(stream2);
      room_input.value = call.peer;
      call.on("stream", function (otherStream) {
        your_video.srcObject = otherStream;
      })
    })

    my_video.srcObject = stream2;

  }


  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(handleSuccess)
  window.oncontextmenu = function () {
    if (document.body != null) {
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
    if (e.keyCode == 13) {
      send_btn.click();
    }
  })
  send_btn.addEventListener("click", () => {
    if (yes_no) {
      if (text_input.value == "y") {
        con = true;
        connected_users = { me: user, you: user_two };
        user_two = undefined;
        socket.emit("join2", "y")
        text_input.value = "";
        text.innerHTML = "";
        yes_no = false;
      }
      if (text_input.value == "n") {
        con = false;
        usertwo = undefined;
        socket.emit("join2", "n")
        alert("Call declined");
        text_input.value = "";
        text.innerHTML = "";
        yes_no = false;
      }
    } else if (!yes_no) {
      if (room_input.value != "" || room_input.value != null || room_input.value != undefined) {
        socket.emit("message", { message: text_input.value, sender: user, receiver: room_input.value });
        text_input.value = "";
      }
    }
  })
  socket.on("message2", (data) => {
    let message = Object.values(data)[0];
    let sender = Object.values(data)[1];
    let receiver = Object.values(data)[2];
    if (user == sender) {
      if (text.innerHTML == "") {
        text.innerHTML = `Me: ${message}`;
      } else {
        text.innerHTML += `<br>Me: ${message}`;
      }
    } else if (user == receiver) {
      if (text.innerHTML == "") {
        text.innerHTML = `${sender}: ${message}`;
      } else {
        text.innerHTML += `<br>${sender}: ${message}`;
      }
    }
  })
  document.body.onload = function () {
    peer = new Peer(user, { metadata: { UserName: user } });
    if (document.cookie != "") {
      //logg=true;uname=amathakbari@gmail.com
      let arr;
      if (document.cookie.includes(";")) {
        arr = document.cookie.split(";");
        arr = arr[0].split("=")[1];
      } else {
        arr = document.cookie.split("=")[1];
      }
      //[ar]
      if (arr != "true") {
        window.location.href = "/"
      }
    }
  }

  sign_out_btn.addEventListener("click", () => {
    document.cookie = "logg=false;uname="
    window.location.href = "/"
  })
}