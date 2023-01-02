
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


function ca(number) {
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
  let sign_out_btn = document.getElementById("log-out")
  let modal = document.getElementById("modal");

  let user = document.cookie.split(";")[1].split("=")[1];
  let yes_no = false;
  function call2(mycell, theircell) {
    let peer = new Peer(mycell);
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function (stream) {
      my_video.srcObject = stream;
      console.log(theircell)
      let call = peer.call(theircell, stream)
      peer.on("err", (err) => {
        alert(err)
      })
      peer.on("call", (ms) => {
        alert(1)
        modal.style.display = "block";
      })
    })

  }
  const send_data = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ key: "email", value: user })
  };
  fetch("/nload", send_data)
    .then(res => res.json())
    .then(function (json) {
      console.log(json.data.cell)
      call2(json.data.cell, number)
    })
  let stream2;
  let user_two;
  document.getElementById("before").style.display = "none";
  document.getElementById("after").style.display = "block";
}


function formatnum() {
  let use = cellnum.innerText.replace("-", "");
  use = use.split("")
  let nuse = use;
  //nuse == [1,1,1,1,1,1,1]
  if (use.length > 3) /*123-4*/nuse.splice(3, 0, "-");
  if (use.length > 6) {
    if (nuse.lastIndexOf("-") == 3) {
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
    let c = cellnum.innerText;
    c = c.replace("-", "");
    while (c.includes("-")){
      c = c.replace("-", "");
    }
    ca(c)
  } else {
    if (interval != null) {
      clearInterval(interval);
      interval = null;
      cellnum.innerText = "";
      callbtn.style.cursor = "pointer";
    }
    let think = cellnum.innerText;
    think = think.replace("-", "");
    if (think.length > 10) {
      return;
    }
    cellnum.innerText += n;
    formatnum();
  }
}

document.body.addEventListener("keydown", (e) => {
  if (e.code.slice(0, -1) == "Digit" || e.code.slice(0, -1) == "Numpad" && e.key.length == 1) {
    buttonclicked(e.key)
  }
  else if (e.key == "Backspace") {
    buttonclicked("❌");
  } else if (e.key == "Enter") {
    buttonclicked("📞")
  }
})

for (let x = 0; x < buttondivs.length; x++) {
  eval(`let ${buttondivs[x]} = document.getElementById("${buttondivs[x]}")`);
  eval(`${buttondivs[x]}.onclick = function(){
    buttonclicked(${buttondivs[x]}.innerText)
  }`)
}
