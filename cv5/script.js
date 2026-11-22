const counterElement= document.getElementById("counter");
let count=0;
function start(){
    let intervalid = setInterval(()=>{
        count++;

        counterElement.innerText= count;
    }, 1000)

}
