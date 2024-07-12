const getMyInfo = () => {
    return {char : 'you'};
}

const getEnemyInfo = () => {
    return {char : 'enemy'};
}

const you = getMyInfo();
const enemy = getEnemyInfo();

const leftChar = document.getElementById('left-char');
const rightChar = document.getElementById('right-char');
const turnImg = document.getElementById('next-turn');
const cells = document.getElementsByClassName('cell');

const action = [];
/**************************************/


[you.mark, enemy.mark] = Math.random() < 0.5 ? ['X' , 'O'] : ['O' , 'X']

var turn= Math.random() < 0.5 ? you : enemy;

setTurn(turn);

for (let cell of cells) {
    cell.addEventListener('click',() => {
        if (cell.children.length) return;
        cell.appendChild(newTick());
        nextTurn();
    })
}

/**************************************/

function setTurn(target) {
    if (target == you) {
        leftChar.classList.add('animate');
        rightChar.classList.remove('animate');
    } else {
        leftChar.classList.remove('animate');
        rightChar.classList.add('animate');
    }
    turnImg.src = `./asset/${target.mark}.png`;
}

function nextTurn() {
    turn = turn == you ? enemy : you;
    setTurn(turn);
}

function newTick() {
    var img = document.createElement('img');
    img.className = 'tick';
    img.src = `./asset/${turn.mark}.png`;
    img.alt = `${turn.mark} mark`;
    img.draggable = false;
    return img;
}

function restart() {
    for (let cell of cells) {
        cell.innerHTML = '';
    }
}

function checkWin() {

}
