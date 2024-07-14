const overlay = document.getElementById('overlay');

const loginModal = document.getElementById('loginModal');
const onlineNum = document.getElementById('online-num');
const loginForm = document.getElementById('loginForm');
const playerName = document.getElementById('name');
const avatarSelection = document.getElementById('avatar-selection');

const loadingModal = document.getElementById('loadingModal');

const content = document.getElementById('content');
const turnImg = document.getElementById('next-turn');
const cells = document.getElementsByClassName('cell');

const leftChar = document.getElementById('left-char');
const rightChar = document.getElementById('right-char');

const yourName = document.getElementById('your-name');
const enemyName = document.getElementById('enemy-name');

/**************************************/

document.addEventListener('DOMContentLoaded', () => {
    overlay.style.display = 'block';
    loginModal.style.display = 'block';

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
    var playerAvatar = avatars[0].id;

    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            avatars.forEach(av => av.classList.remove('selected'));
            avatar.classList.add('selected');
            playerAvatar = avatar.id;
        });
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        loginModal.style.display = 'none';
        loadingModal.style.display = 'flex';

        const playerInfo = {
            playerName: playerName.value,
            playerAvatar
        }

        console.log(playerInfo);
        const message =  {
            action: 'login',
            data: playerInfo
        }

        console.log(message);
        
        // Gửi thông tin login cho server
        ws.send(JSON.stringify(message));

        // Set avatar
        const leftCharImg = document.createElement('img');
        leftCharImg.src = `./asset/avatar-icon/Avatars Set Flat Style-${playerAvatar}.png`
        leftCharImg.atl = 'Avatar'
        leftCharImg.draggable = false;
        leftChar.appendChild(leftCharImg);

        // Set Name
        yourName.innerHTML = playerName.value;
    });
});

var mark = 'X';
var turn = false;

/**************************************/



/**************************************/
function enableTick() {
    if (turn) {
        for (let cell of cells) {
            cell.addEventListener('click',() => {
                if (cell.children.length) return;
                cell.appendChild(newTick());
            })
        }
    }
}

function setTurnAnimation() {
    if (turn) {
        leftChar.classList.add('animate');
        rightChar.classList.remove('animate');
    } else {
        leftChar.classList.remove('animate');
        rightChar.classList.add('animate');
    }
}

function newTick() {
    var img = document.createElement('img');
    img.className = 'tick';
    img.src = `./asset/${mark}.png`;
    img.alt = `${mark} mark`;
    img.draggable = false;
    return img;
}

function checkWin() {

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

/*********************************************** */

// Kết nối đến WebSocket server
const ws = new WebSocket('ws://192.168.1.223:8080');

// Lắng nghe sự kiện mở kết nối
ws.onopen = function(event) {
    console.log('Connected to the WebSocket server');
};

// Lắng nghe tin nhắn từ server
ws.onmessage = function(event) {
    console.log(`Server says: ${event.data}`);
    const data = JSON.parse(event.data);
    if (data.type == 'online_num') {
        onlineNum.innerText = data.num;
    }
    if (data.type == 'enemy_info') {
        content.style.display = 'flex';
        overlay.style.display = 'none';
        loadingModal.style.display = 'none';
        
        // Set enemy info
        enemyName.innerText = data.info.playerName;
        const rightCharImg = document.createElement('img');
        rightCharImg.src = `./asset/avatar-icon/Avatars Set Flat Style-${data.info.playerAvatar}.png`
        rightCharImg.atl = 'Avatar'
        rightCharImg.draggable = false;
        rightChar.appendChild(rightCharImg);

        // Set turn 
        turn = data.info.turn ? false : true;
        setTurnAnimation();
        enableTick();
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
