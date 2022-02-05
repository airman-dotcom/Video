const socket = io();
const create_code_btn = document.getElementById("create");
let room_input = document.getElementById("code");
const join_btn = document.getElementById("join");
let room_div = document.getElementById("room_div");
let join_div = document.getElementById("join_div");
let code;
let user;
let text = document.getElementById("text")
let message_input = document.getElementById("message");
const send_button = document.getElementById("send");
function create_code(bool){
    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch("/code", send_data)
    .then(response => response.json())
    .then(function(json){
        if (bool == "send"){
            room_input.value = Object.values(json)[0]
            send()
        } else {
            room_input.value = Object.values(json)[0]
        }
    })
}

function send(){
    if (room_input.value == "" || room_input.value == null || room_input.value == undefined){
        create_code("send")
    } else {
        code = room_input.value;
        join_div.style.display = "none";
        room_div.style.display = "block";
        socket.emit("join_room", room_input.value);
        user = prompt("What is your name?");
        while (user == "" || user == null || user == undefined){
            user = prompt("What is your name?")
        }
    }
}

document.addEventListener("keydown", (e) => {
    if (e.KeyCode == 13){
        send()
    }
})

join_btn.addEventListener("click", () => {
    send()
}) 

create_code_btn.addEventListener("click", () => {
    create_code();
})

send_button.addEventListener("click", () => {
    if (message_input.value != "" || message_input.value != null || message_input.value != undefined){
        socket.emit("message", code, message_input.value, (user));
        message_input.value = "";
    }
})

socket.on("message2", (message, user2) => {
    if (text.innerText == ""){
        text.innerText = user2 + ": " + message;
    } else {
        text.innerText = text.innerText + "\n" + user2 + ": " + message;
    }
})