let title = document.querySelector("h1");
let email = document.cookie.split(";")[1].split("=")[1];
let email2;
let cell;
let friends = document.getElementById("friends");
let calls = document.getElementById("friends2");
let friendBtn = document.getElementById("addfriend");
let friendInput = document.getElementById("fi");
let callBtn = document.getElementById("call");
let requests = document.getElementById("requests");
let modal = document.getElementById("myModal");
let modaltext = document.getElementById("modalt");
let modalaccbtn = document.getElementById("modala");
let modaldecbtn = document.getElementById("modalb")
function friend(acc, n) {
    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ from: n, to: email2, a: acc })
    };
    fetch("/friend", send_data).then(res => res.json())
        .then(function (json) {
            document.getElementById(n).parentElement.innerHTML = "";
            let child = document.createElement("div");
            child.id = "friend";
            child.innerHTML = `${n} <button id="${n}" onclick='removeFriend("${n}")'>❌</button>`
            friends.appendChild(child);
        })
}

function removeFriend(n) {
    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ toremove: n, from: email2 })
    }
    fetch("/removefriend", send_data)
        .then(res => res.json())
        .then(function (json) {
            console.log(json.status);
            document.getElementById(n).parentElement.innerHTML = "";
        })
}

function LE(info) {
    let peer = new Peer(cell);
    console.log(cell)
    peer.on("open", () => {
        alert(2)
    })
    peer.on("err", (err) => {
        alert(err)
    })
    peer.on("call", (c) => {
        modal.style.display = "block";
    })
    if (info.friends.length > 0) {
        for (let x = 0; x < info.friends.length; x++) {
            let child = document.createElement("div");
            child.id = "friend";
            child.innerHTML = `${info.friends[x]} <button id="${info.friends[x]}" onclick='removeFriend("${info.friends[x]}")'>❌</button>`
            friends.appendChild(child);
            //friends.innerHTML += `<div id="friend">${info.friends[x]}</div>`
        }
    } else {
        let child = document.createElement("div");
        child.id = "friend";
        child.innerText = "You have no friends";
        friends.appendChild(child);
    }
    if (info.recentCalls.length > 0) {
        for (let x = 0; x < info.recentCalls.length; x++) {
            let child = document.createElement("div");
            child.id = "friend";
            child.innerText = `Call with: ${info.recentCalls[x][0]}. From ${info.recentCalls[x][1]}, To ${info.recentCalls[x][2]}`;
            calls.appendChild(child)
        }
    } else {
        let child = document.createElement("div");
        child.id = "friend";
        child.innerText = "You called no one.";
        calls.appendChild(child);
    }
    if (info.requests.length > 0) {
        for (let x = 0; x < info.requests.length; x++) {
            let child = document.createElement("div");
            child.id = "friend";
            child.innerHTML = `Friend Request from: ${info.requests[x]} <button id='${info.requests[x]}' onclick="friend(true, '${info.requests[x]}')">Accept</button><button id='${info.requests[x]}' onclick="friend(false, '${info.requests[x]}')">Decline</button>`
            requests.appendChild(child)
        }
    } else {
        let child = document.createElement("div");
        child.id = "friend";
        child.innerText = "You have no friend requests.";
        requests.appendChild(child)
    }
}

function a(info) {
    console.log(1)
    if (friendInput.value != "") {
        const data = {
            to: friendInput.value,
            from: info.uname
        };
        const send_data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        fetch("/addfriend", send_data)
            .then(res => res.json())
            .then(function (json) {
                if (json.status) {
                    document.getElementById("f").style.color = "green";
                    document.getElementById("f").innerHTML = "Friend request sent."
                    document.getElementById("f").style.display = "block";
                    friendInput.value = "";
                } else {
                    document.getElementById("f").style.color = "red";
                    document.getElementById("f").innerHTML = "Username doesn't exist."
                    document.getElementById("f").style.display = "block";
                }
            })
    }
}

document.body.onload = function () {
    const data = {
        email: email,
    }
    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    fetch("/load", send_data)
        .then(res => res.json())
        .then(function (json) {
            if (json.status == false) {
                alert("This account does not exist.");
                document.cookie = "logg=false";
                document.cookie = "uname=null";
                window.location.href = "/";
                return;
            }

            email2 = json.data.uname;
            title.innerHTML += json.data.uname + " !"
            cell = json.data.cell;
            LE(json.data);
            friendBtn.addEventListener("click", () => {
                a(json.data)
            })
        })
}

function updateData(newinfo) {
    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ uname: newinfo.uname, data: newinfo })
    }
    fetch("/update", send_data)
        .then(res => res.json())
        .then(function (json) {
            console.log(json.status);
        })
}

function signout() {
    document.cookie = "logg=false";
    document.cookie = "uname=null";
    window.location.href = "/login";
    return;
}


