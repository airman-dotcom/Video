let email_input = document.getElementById("email");
let psw_input = document.getElementById("psw");
const login_btn = document.getElementById("login");
let ip;
function send() {
    const data2 = {
        email: email_input.value,
        psw: psw_input.value
    };

    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data2)
    };

    fetch("/login", send_data)
        .then(response => response.json())
        .then(function (json) {
            if (Object.values(json)[0]) {
                document.cookie = `logg=true;uname=${email_input.value}`
                alert("Logged in.")
                window.location.href = "/video";
            } else {
                alert(Object.values(json)[1])
            }
        })
}

login_btn.addEventListener("click", () => {
    if (email_input.value != "" || email_input.value != null || email_input.value != undefined) {
        if (psw_input.value != "" || psw_input.value != null || psw_input.value != undefined) {
            send();
        } else {
            alert("Password value is required, please enter one");
        }
    } else {
        alert("Email or Username Value is required, please enter one");
    }
})

document.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
        if (email_input.value != "" || email_input.value != null || email_input.value != undefined) {
            if (psw_input.value != "" || psw_input.value != null || psw_input.value != undefined) {
                send();
            } else {
                alert("Password value is required, please enter one");
            }
        } else {
            alert("Email or Username Value is required, please enter one");
        }
    }
})

document.body.onload = function(){
    if (document.cookie != ""){
        //logg=true;uname=amathakbari@gmail.com
        let arr = document.cookie.split(";")
        let thing1 = arr[0].split("=")
        let thing2 = arr[1].split("=")
        console.log(thing2)
        if (thing2[1] == "true"){
            alert("Logged in")
            window.location.href= "/video"
        }
    }
}