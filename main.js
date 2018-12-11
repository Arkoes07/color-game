//Game output
const timeElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const colorElement = document.getElementById('colordiv');
const listElement = document.getElementById('list');
//Game input
const c1Element = document.getElementById('c1');
const c2Element = document.getElementById('c2');
const nameElement = document.querySelector('input');
const startBtn = document.getElementById('startBtn');
const sendBtn = document.getElementById('sendBtn');
//aditional
let timerShow = timeElement.querySelector('p');
let scoreShow = scoreElement.querySelector('p');
let status = 'stop';
//database definition
let database = firebase.database();

//game initialization
function gameInit(){
    timerShow.innerHTML = 10;
    scoreShow.innerHTML = 0;
    sendBtn.setAttribute('disabled','true');
    showColor();
}

function gameStop(){
    colorElement.style.backgroundColor = 'khaki';
    sendBtn.removeAttribute('disabled');
    scoreElement.style.backgroundColor = 'blanchedalmond';
    timeElement.style.backgroundColor = 'lightpink';
}

function getColor(){
    return colorElement.style.backgroundColor
}

function setColor(){
    let decider = Math.random();
    if(decider <= 0.5){
        return 'salmon';
    }else{
        return 'lightblue';
    }
}

function showColor(){
    let color = setColor();
    colorElement.style.backgroundColor = color;
}

function rightColor(){
    scoreElement.style.backgroundColor = 'lightgreen';
}

function wrongColor(){
    scoreElement.style.backgroundColor = '#FF6347';
}

function pushData(){
    let data = {
        playerName: 'Player',
        score: parseInt(scoreShow.innerHTML) 
    }
    if(nameElement.value != ""){
        data.playerName = nameElement.value;
    }
    database.ref().push(data);
}

//choice1 clicked
c1Element.addEventListener('click',function(){
    if(status === 'play'){
        let color = getColor();
        if(color == 'salmon'){
            let value = parseInt(scoreShow.innerHTML);
            value += 1;
            scoreShow.innerHTML = value;
            rightColor();
            showColor(); 
        }else{
            wrongColor();
        }
    }   
})

//choice2 clicked
c2Element.addEventListener('click',function(){
    if(status === 'play'){
        let color = getColor();
        if(color == 'lightblue'){
            let value = parseInt(scoreShow.innerHTML);
            value += 1;
            scoreShow.innerHTML = value;
            rightColor();
            showColor(); 
        }else{
            wrongColor();
        }
    }   
})

//start button clicked
startBtn.addEventListener('click',function(){
    startBtn.setAttribute('disabled','true');
    gameInit();
    status = 'play'
    let startDate = new Date();
    let startTime = startDate.getTime();
    let message = {
        start: startTime,
        finish: startTime + 15000
    };
    timeRemaining.postMessage(message);
})

//send Btn clickeds
sendBtn.addEventListener('click',function(){
    startBtn.removeAttribute('disabled');
    sendBtn.setAttribute('disabled','true');
    pushData();
})

//worker to make countdown timer
let timeRemaining = new Worker("timeremain.js");
timeRemaining.onmessage = function(e){
    timerShow.innerHTML = e.data.result;
    status = e.data.status;
    if(e.data.result <= 3){
        timeElement.style.backgroundColor = '#FF6347';
    }
    if(status == 'stop'){
        gameStop();
    }
}

database.ref().orderByChild('score').limitToLast(5).on('value',function(snapshot){
    let content = '';
    let leader = [];
    let count = 0;
    snapshot.forEach(elt => {
        leader[count] = "<li>" + elt.val().playerName + " - " + elt.val().score + "</li>";
        count++;
    });
    leader = leader.reverse();
    leader.forEach(data => {
        content += data;
    });
    listElement.innerHTML = content;
})
