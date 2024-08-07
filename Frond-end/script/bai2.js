const overlay = document.getElementById('overlay');

const onlineNum = document.getElementById('online-num');

const loadingModal = document.getElementById('loadingModal');
const loginModal = document.getElementById('loginModal');
const content = document.getElementById('content');
const dashboard = document.getElementById('dashboard');
const resultModal = document.getElementById('resultModal');

const turnImg = document.getElementById('next-turn');

const leftChar = document.getElementById('left-char');
const rightChar = document.getElementById('right-char');

const enemyName = document.getElementById('enemy-name');

const states = document.getElementsByClassName('state');

const yourInfo = {}

/**************************************/

document.addEventListener('DOMContentLoaded', () => {
    
    // Start login state
    loginState();

    const loginForm = document.getElementById('loginForm');
    const playerName = document.getElementById('name');
    const avatarSelection = document.getElementById('avatar-selection');
    
    // Select avatar
    const avatarInDexList = generateRandomSelection();
    for (let avatarIndex of avatarInDexList) {
        var avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.id = avatarIndex;
        avatar.src = `./asset/avatar-icon/Avatars Set Flat Style-${avatarIndex}.png`;
        avatar.alt = `Avatar icon`;
        avatar.draggable = false;

        avatarSelection.appendChild(avatar);
    }
    const avatars = document.querySelectorAll('.avatar');
    avatars[0].classList.add('selected');
    yourInfo.avatar = avatars[0].id; // Default first avatar 
    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            avatars.forEach(av => av.classList.remove('selected'));
            avatar.classList.add('selected');
            yourInfo.avatar = avatar.id;
        });
    });

    // Start dashboard state
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        dashboardState();

        yourInfo.name = playerName.value;

        const request =  {
            action: 'login',
            data: {
                playerName : yourInfo.name,
                playerAvatar : yourInfo.avatar
            }
        }
  
        // Gửi thông tin login cho server
        ws.send(JSON.stringify(request));
        
        const avatar = document.getElementById('avatar');
        avatar.src = `./asset/avatar-icon/Avatars Set Flat Style-${yourInfo.avatar}.png`;
        avatar.alt = 'Avatar';
        
        const name = document.getElementById('your-name-dashboard');
        name.innerText = yourInfo.name;

        const findMatch = document.getElementById('find-match');
        
        // Find match
        findMatch.addEventListener('click', () => {
            loadingState();

            const exitFind = document.getElementById('exit-find')
            exitFind.addEventListener('click', () => {
                const request = {
                    action: 'exit-find',
                    data: {
                        playerId: yourInfo.id
                    }
                }
                ws.send(JSON.stringify(request));
                dashboardState()
            });

            const request = {
                action: 'find',
                data : yourInfo
            }

            ws.send(JSON.stringify(request));
        })
    });
});

/**************************************/



/**************************************/
function toggleTurn(turn, tick) {
    if (yourInfo.id == turn) {
        leftChar.classList.add('animate');
        rightChar.classList.remove('animate');
    } else {
        leftChar.classList.remove('animate');
        rightChar.classList.add('animate');
    }

    turnImg.src = `./asset/${tick}.png`;
}

function newTick(tick) {
    var img = document.createElement('img');
    img.className = 'tick';
    img.src = `./asset/${tick}.png`;
    img.alt = `${tick} mark`;
    img.draggable = false;
    return img;
}

function generateRandomSelection() {
    let selection = [];
    
    for (let i = 1; i <= 50; i++) {
        selection.push(i < 10 ? `0${i}` : `${i}`);
    }
    
    for (let i = selection.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selection[i], selection[j]] = [selection[j], selection[i]];
    }
  
    return selection.slice(0, 9);
}

function drawTable(matchStatus) {
    const tableElement = document.getElementById('table');
    tableElement.innerHTML = null;
    for (let row = 0; row < matchStatus.tableSize.m; row++) {
        const newRow = document.createElement('div');
        newRow.className = 'row';
        
        for (let cell = 0; cell < matchStatus.tableSize.n; cell++) {
            const newCell = document.createElement('div');
            newCell.className = 'cell';
            newCell.id = `${row}_${cell}`;
            let mark = ''
            matchStatus.moved.forEach((move)=>{if (move.position.x == row && move.position.y == cell) mark = move.mark});
            if (mark) newCell.appendChild(newTick(mark));
            newRow.appendChild(newCell);
        }

        tableElement.appendChild(newRow);
    }

    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.addEventListener('click', () => {
            if (cell.children.length) return;
            if (matchStatus.nextTurn != yourInfo.id) return;
            
            const [x, y] = cell.id.split('_').map(Number);
            const request = {
                action : 'move',
                data : {
                    matchId : yourInfo.matchId,
                    playerId : yourInfo.id,
                    position : {x, y}
                }
            }
            
            console.log(request)
            ws.send(JSON.stringify(request));
        })
    }
}

function loginState() {
    for (let i = 0; i < states.length; i++) 
        states[i].style.display = 'none';
    
    overlay.style.display = 'block';
    loginModal.style.display = 'block';
}

function loadingState() {
    for (let i = 0; i < states.length; i++) 
        states[i].style.display = 'none';
    
    overlay.style.display = 'block';
    loadingModal.style.display = 'flex';
}

function playingState() {
    for (let i = 0; i < states.length; i++) 
        states[i].style.display = 'none';

    content.style.display = 'flex';
}

function dashboardState() {
    for (let i = 0; i < states.length; i++) 
        states[i].style.display = 'none';

    overlay.style.display = 'block';
    dashboard.style.display = 'flex';
}

function resultState(result) {
    for (let i = 0; i < states.length; i++) 
        states[i].style.display = 'none';

    overlay.style.display = 'block';
    resultModal.style.display = 'flex';

    const resultImg = document.getElementById('result-img');
    resultImg.src = `./asset/${result}.png`;
}
/*********************************************** */

// Kết nối đến WebSocket server
const ws = new WebSocket('ws://localhost:8080');

// Lắng nghe sự kiện mở kết nối
ws.onopen = function(event) {
    console.log('Connected to the game server');
};

// Lắng nghe tin nhắn từ server
ws.onmessage = function(event) {
    const message = JSON.parse(event.data);
    console.log(`Server says:`, message);
    
    
    if (message.type == 'online_num') {
        onlineNum.innerText = message.data.num;
    }
    
    if (message.type == 'assign') {
        const playerInfo = message.data;
        
        yourInfo.id = playerInfo.id;
        yourInfo.starNum = playerInfo.starNum;
        const starNum = document.getElementById('star-num');
        starNum.innerText = yourInfo.starNum;
    }
    
    if (message.type == 'match_start') {
        playingState();

        // Set match status
        yourInfo.matchId = message.data.matchStatus.matchId;
        drawTable(message.data.matchStatus);
        
        // Set your status
        const leftCharImg = document.createElement('img');
        leftCharImg.src = `./asset/avatar-icon/Avatars Set Flat Style-${yourInfo.avatar}.png`
        leftCharImg.atl = 'Avatar'
        leftCharImg.draggable = false;
        leftChar.innerHTML = null;
        leftChar.appendChild(leftCharImg);
        const yourName = document.getElementById('your-name');        
        yourName.innerHTML = yourInfo.name;
        
        // Set enemy status
        enemyName.innerText = message.data.enemyInfor.name;
        const rightCharImg = document.createElement('img');
        rightCharImg.src = `./asset/avatar-icon/Avatars Set Flat Style-${message.data.enemyInfor.avatar}.png`
        rightCharImg.atl = 'Avatar'
        rightCharImg.draggable = false;
        rightChar.innerHTML = null;
        rightChar.appendChild(rightCharImg);

        toggleTurn(message.data.matchStatus.nextTurn, message.data.matchStatus.nextMark);
    }
    
    if (message.type == 'match_update') {
        const tableStatus = message.data;
        drawTable(tableStatus);

        toggleTurn(tableStatus.nextTurn, tableStatus.nextMark);

        if (tableStatus.winner) {
            if (tableStatus.winner.id == yourInfo.id) resultState('win');
            else resultState('lose');
        }
    }

    if (message.type == 'enemy_quit') {
        dashboardState();

        yourInfo.starNum = yourInfo.starNum + 1;
        const starNum = document.getElementById('star-num');
        starNum.innerText = yourInfo.starNum;
    }
};

// Lắng nghe sự kiện đóng kết nối
ws.onclose = function(event) {
    console.log('Disconnected from the WebSocket server');
};

// Lắng nghe sự kiện lỗi
ws.onerror = function(event) {
    console.error('WebSocket error:', event);
};

