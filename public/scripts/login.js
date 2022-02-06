let email_input = document.getElementById("email");
let psw_input = document.getElementById("psw");
const login_btn = document.getElementById("login");
let ip;
function send() {
    const data = {
        email: email_input.value,
        psw: psw_input.value
    };

    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch("/login", send_data)
        .then(response => response.json())
        .then(function (json) {
            if (Object.values(json)[0]) {
                const date = new Date();
                let day = date.getDate();
                let month = months[date.getMonth()];
                let year = date.getFullYear();
                let hour = date.getHours();
                if (date.getMinutes() > 30 || date.getMinutes() == 30) {
                    const minute = date.getMinutes() + 30 - 60
                    hour = hour + 1;
                    document.cookie = `email=${email_input.value};expires=${month} ${day}, ${year} ${hour}:${minute};path=/video;`
                } else {
                    minute = minute + 30;
                    document.cookie = `email=${email_input.value};expires=${month} ${day}, ${year} ${hour}:${minute};path=/video;`
                }
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

window.onload = function(){
    alert(1)
    $.getJSON("https://api.ipify.org?format=json", (data) => {
        ip = data.ip;
        const data = {
            ip: ip,
        };
        const send_data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        fetch("/logged-in", send_data)
    })
}