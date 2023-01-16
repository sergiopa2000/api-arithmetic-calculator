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
    register(data).then((response) => console.log(response));
})

document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();
    let data = {};
    const formData = new FormData(this)
    for (const pair of formData.entries()) {
        data[pair[0]] = pair[1];
    }
    login(data)
    .then((response) => {
        if (response.ok) {
            console.log("error");
            console.log(response);
        }else{
            console.log(response.token);
            token = response.token;
            console.log(token);
        }
    })
})

document.getElementById("calc").addEventListener("click", () =>{
    ws = new WebSocket("ws://localhost:3000/ws?token=" + token);
    console.log(ws);
})