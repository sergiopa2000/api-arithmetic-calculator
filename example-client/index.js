let token = null;
async function calc(){
    let response = await fetch("https://localhost/api/calc", {
        method: "GET",
        headers:{
            'Content-Type': 'application/json'
        }
    });

    return response.json();
}

async function register(data){
    let response = await fetch("https://localhost/api/register", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data})
    });

    return response.json();
}

async function login(credentials){
    let response = await fetch("https://localhost/api/login", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...credentials})
    });
    return response.json();
}

async function logout(){
    let response = await fetch("https://localhost/api/logout", {
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
            if (response.error) {
                document.getElementById("state").style.color = "red";
                document.getElementById("state").innerHTML = response.error;
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
            if (response.error) {
                document.getElementById("state").style.color = "red";
                document.getElementById("state").innerHTML = response.error;
            }else{
                token = response.token;
                document.getElementById("state").style.color = "green";
                document.getElementById("state").innerHTML = "Your have succesfully logged in";
            }
        })
})

document.getElementById("calc").addEventListener("click", async () =>{
    calc()
        .then(response =>{
            let input = document.getElementById("operation").value;
            const operation = encodeURIComponent(input);
            ws = new WebSocket(`ws://${response.ip}:${response.port}/ws?token=${token}&operation=${operation}`);
            
            ws.onmessage = message =>{
                let resultDom = document.getElementById("result");
                let data = JSON.parse(message.data)
                if(data.result){
                    resultDom.style.color = "green";
                    resultDom.innerHTML = data.result;
                }else if(data.error){
                    let column = data.column;
                    operationError = data.operation.split('');
                    let errorPart = operationError.splice(column-1).join('');
                    operationError = operationError.join('') + `<span class="error-part">${errorPart}</span>`;
        
                    resultDom.style.color = "red";
                    resultDom.innerHTML = `Error: <span class="error-operation">${operationError}</span>`;
                }else if(data.message){
                    resultDom.style.color = "white";
                    resultDom.innerHTML = data.message;
                }
            }
        });
})