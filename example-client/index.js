let token = null;
async function calc(){
    let response = await fetch("http://localhost:3000/api/calc", {
        method: "GET",
        headers:{
            'Content-Type': 'application/json'
        }
    });
}

async function register(data){
    let response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data})
    });

    return response.json();
}

async function login(credentials){
    let response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...credentials})
    });
    return response.json();
}

async function logout(){
    let response = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}token

document.getElementById("registerForm").addEventListener("submit", function(e){
    e.preventDefault();
    let data = {};
    const formData = new FormData(this)
    for (const pair of formData.entries()) {
        data[pair[0]] = pair[1];
    }
    document.getElementById("close-register").click();
    register(data)    
        .then((response) => {
            if (response.ok) {
                document.getElementById("state").style.color = "red";
                document.getElementById("state").innerHTML = "An error ocurred on register";
            }else{
                token = response.token;
                document.getElementById("state").style.color = "green";
                document.getElementById("state").innerHTML = "Your have succesfully registered";

            }
        })
})

document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();
    let data = {};
    const formData = new FormData(this)
    for (const pair of formData.entries()) {
        data[pair[0]] = pair[1];
    }
    document.getElementById("close-login").click();
    login(data)
        .then((response) => {
            if (response.ok) {
                document.getElementById("state").style.color = "red";
                document.getElementById("state").innerHTML = "An error ocurred on login";
            }else{
                token = response.token;
                document.getElementById("state").style.color = "green";
                document.getElementById("state").innerHTML = "Your have succesfully logged in";
            }
        })
})

document.getElementById("calc").addEventListener("click", () =>{
    let input = document.getElementById("operation").value;
    const operation = encodeURIComponent(input);
    ws = new WebSocket("ws://localhost:3000/ws?token=" + token + "&operation=" + operation);
    
    ws.onmessage = message =>{
        let resultDom = document.getElementById("result");
        let data = JSON.parse(message.data)
        if(data.result){
            resultDom.style.color = "green";
            resultDom.innerHTML = data.result;
        }else if(data.error){
            resultDom.style.color = "red";
            resultDom.innerHTML = "Error";
        }else if(data.message){
            resultDom.style.color = "white";
            resultDom.innerHTML = data.message;
        }
    }
})