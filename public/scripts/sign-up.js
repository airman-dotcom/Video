let email_input = document.getElementById("email");
let psw1_input = document.getElementById("psw1");
let psw2_input = document.getElementById("psw2");
const sign_up_button = document.getElementById("sign-up");
const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const psw_num_regex = /\d/;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const psw_special_regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

function submit(){
    const data = {
        email: email_input.value,
        psw: psw1_input.value
    };
    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch("/create_acc", send_data)
    .then(response => response.json())
    .then(function(json){
        if (Object.values(json)[0]){
            alert("Account created succesfully.");
            window.location.href = "/login"
            
        } else if(!Object.values(json)[0]){
            alert(Object.values(json)[1])
        }
    })
}

sign_up_button.onclick = function(){
    if (email_input.value != "" || email_input.value != null || email_input.value != undefined){
        if (psw1_input.value != "" || psw1_input.value != null || psw1_input.value != undefined){
            if (psw2_input.value != "" || psw2_input.value != null || psw2_input.value != undefined){
                if (email_regex.test(email_input.value)){
                    if (psw_num_regex.test(psw1_input.value)){
                        if (psw_special_regex.test(psw1_input.value)){
                            if (psw1_input.value === psw2_input.value){
                                submit();
                            } else {
                                alert("Passwords do not match, please match their values.")
                            }
                        } else {
                            alert("Password does not include a special character, please include one.")
                        }
                    } else {
                        alert("Password does not include a number, please include one in password.")
                    }
                } else {
                    alert("Your Email address value is invalid, please enter a valid one.")
                }
            } else {
                alert("Password must be entered twice for re-evaluation, please do so.")
            }
        } else {
            alert("A Password Value is required, please enter one");
        }
    } else {
        alert("An Email Value is required, please enter one.")
    }
}

document.addEventListener("keydown", (e) => {
    if (e.keyCode == 13){
        sign_up_button.onclick();
    }
})