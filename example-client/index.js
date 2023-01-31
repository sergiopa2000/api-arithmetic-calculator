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

async function login(){
    let response = await fetch("https://localhost/api/login", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
    });
    return response.json();
}

document.querySelector(".log-in").addEventListener("click", function(e){
    login()
        .then((response) => {
            if (response.error) {
                document.getElementById("state").style.color = "red";
                document.getElementById("state").innerHTML = response.error;
            }else{
                token = response.token;
                document.getElementById("state").style.color = "green";
                document.querySelector(".log-in").style.display = "none";
                document.querySelector(".attemps-left").style.display = "block";
                document.querySelector(".attemps-left").innerHTML = "Attemps left: " + response.attemps;
                document.getElementById("state").innerHTML = "Your have succesfully logged in";
            }
        })
})

document.querySelector(".calculator").addEventListener("submit", async (e) =>{
    e.preventDefault();
    calc()
        .then(response =>{
            let input = document.getElementById("operation").value;
            const operation = encodeURIComponent(input);
            ws = new WebSocket(`wss://${response.ip}:${response.port}/ws?token=${token}&operation=${operation}`);
            
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

                if(typeof data.attemps != "undefined"){
                    if(data.attemps == 0){
                        document.querySelector(".attemps-left").style.display = "none";
                        document.querySelector(".log-in").style.display = "block";
                    }else{
                        document.querySelector(".attemps-left").innerHTML = "Attemps left: " + data.attemps;
                    }
                    
                }
            }
        });
})