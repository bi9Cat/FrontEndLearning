var imageUlr = "../images/生成图片.png"
var imagePieces = []; // 存储切片后的图片

var piecesWidth = 100;
var piecesHeight = 100;

var gameSize = 3;

var timer;



function start() {
    // 清空屏幕
    clearGamePannel();

    // 设置游戏难度
    setGameLevel();

    // 图片切片
    sliceImages();

    // 随机分布
    shuffleImage();

    stopTimer();
    // 开启定时器
    startTimer();

}

function uploadImage() {
    let filePath = document.getElementById("upladImage").value;
    document.getElementById("imagePath").value = filePath;
    let file = document.getElementById("upladImage").files[0];
    let url = getUrl(file);
    imageUlr = url;

    function getUrl(file) {
        let url = '';
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        }
        return url;
    }
}

function setGameLevel() {
    var levelSelect = document.getElementById("level");
    var index = levelSelect.selectedIndex;
    gameSize = Number(levelSelect.options[index].value);

    console.log("gameSize:" + gameSize);
}

function clearGamePannel() {
    const gamePannel = document.querySelector('.gamepannel');
    if (imagePieces != null && imagePieces.length > 0) {
        imagePieces.forEach(piece => {
            gamePannel.removeChild(piece);
        });
        imagePieces.length = 0;
    }

    document.querySelector(".gameSuccess").style.visibility = "hidden";
}

function sliceImages() {

    console.log(imageUlr);
    let imgNum = 0;
    for (let i = 0; i < gameSize; i++) {
        for (let j = 0; j < gameSize; j++) {
            const div = document.createElement('div');
            div.id = imgNum++;
            //div.textContent = div.id;
            div.classList.add('image-piece');
            div.style.backgroundSize = `${piecesWidth * gameSize}px ${piecesHeight * gameSize}px`
            div.style.backgroundImage = `url(${imageUlr})`;
            div.style.backgroundPosition = `-${j * piecesWidth}px -${i * piecesHeight}px`;
            imagePieces.push(div);
        }
    }
}

function shuffleImage() {
    const gamePannel = document.querySelector('.gamepannel');
    const maxX = gamePannel.getBoundingClientRect().width - piecesWidth;
    const maxY = gamePannel.getBoundingClientRect().height - piecesHeight;

    imagePieces.forEach(piece => {
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(gamePannel.getBoundingClientRect().top) + Math.floor(Math.random() * maxY);

        piece.style.left = randomX + "px";
        piece.style.top = randomY + "px";
        gamePannel.appendChild(piece);
    });
}

// 把按钮的click事件绑定为 inputFile的click
document.getElementById("imageSelect").addEventListener('click', () => {
    const inputFile = document.getElementById('upladImage');
    inputFile.click();
});

// 绑定点击鼠标事件，记录下点击位置和 元素位置的偏移量
let dx;
let dy;
let selectImage;
document.addEventListener('mousedown', (e => {
    if (e.target.classList.contains('image-piece')) {
        selectImage = e.target;
        selectImage.classList.add("selectImage");
        let eleft = selectImage.getBoundingClientRect().left;
        let etop = selectImage.getBoundingClientRect().top;

        dx = e.clientX - eleft;
        dy = e.clientY - etop;
    }
}));

// 绑定鼠标移动事件，根据点击时记录的偏移量计算出鼠标移动后 图片的位置
document.addEventListener('mousemove', (e) => {

    if (selectImage != null) {
        console.log("moveing");
        selectImage.style.left = (e.clientX - dx) + "px";
        selectImage.style.top = (e.clientY - dy) + "px";
    }
});

// 绑定鼠标抬起事件，
// 1.清除偏移量 、图片的样式、移除鼠标移动事件
// 2.判定是否吸附
// 3.判定游戏是否结束
document.addEventListener('mouseup', (e) => {
    if (selectImage != null) {
        dx = null;
        dy = null;

        // 判断吸附
        const [piece, dir] = needClingHere(selectImage, imagePieces);
        if (dir === "D") {
            selectImage.style.top = piece.style.top;
            selectImage.style.left = piece.getBoundingClientRect().left + piece.getBoundingClientRect().width + 2 + "px";
        } else if (dir === "A") {
            selectImage.style.top = piece.style.top;
            selectImage.style.left = piece.getBoundingClientRect().left - selectImage.getBoundingClientRect().width - 2 + "px";
        } else if (dir === "W") {
            selectImage.style.top = piece.getBoundingClientRect().top - selectImage.getBoundingClientRect().height - 2 + "px";
            selectImage.style.left = piece.style.left;
        } else if (dir === "S") {
            selectImage.style.top = piece.getBoundingClientRect().top + selectImage.getBoundingClientRect().height + 2 + "px";
            selectImage.style.left = piece.style.left;
        }

        selectImage.classList.remove('selectImage');
        selectImage = null;

        if (isSuccess(imagePieces)) {
            console.log("SUCCESS!");
            document.querySelector(".gameSuccess").style.visibility = 'visible';
            stopTimer();
        }

        // 能否吸附，可以吸附的话返回吸附的目标图片及方向
        function needClingHere(selectImage, pieces) {

            const selectImageCenterX = selectImage.getBoundingClientRect().left + selectImage.getBoundingClientRect().width / 2;
            const selectImageCenterY = selectImage.getBoundingClientRect().top + selectImage.getBoundingClientRect().height / 2
            console.log("selectImageCenterX:" + selectImageCenterX + ",selectImageCenterY:" + selectImageCenterY);

            let clingImage = null;
            let minDistance = Number.MAX_SAFE_INTEGER;
            pieces.forEach(piece => {
                if (piece.id != selectImage.id) {
                    const pieceCenterX = piece.getBoundingClientRect().left + piece.getBoundingClientRect().width / 2;
                    const pieceCenterY = piece.getBoundingClientRect().top + piece.getBoundingClientRect().height / 2;
                    const dx = Math.abs(selectImageCenterX - pieceCenterX);
                    const dy = Math.abs(selectImageCenterY - pieceCenterY);
                    if (dx <= 150 && dy <= 150) {
                        const distance = calculateDistance(selectImageCenterX, selectImageCenterY, pieceCenterX, pieceCenterY);
                        console.log(piece.id + ":" + distance)
                        if (distance < minDistance) {
                            minDistance = distance;
                            clingImage = piece;
                        }
                    }
                }
            });

            if (clingImage === null) {
                return [];
            }

            const pieceCenterX = clingImage.getBoundingClientRect().left + clingImage.getBoundingClientRect().width / 2;
            const pieceCenterY = clingImage.getBoundingClientRect().top + clingImage.getBoundingClientRect().height / 2;
            const dx = Math.abs(selectImageCenterX - pieceCenterX);
            const dy = Math.abs(selectImageCenterY - pieceCenterY);
            if (dx > dy) {
                dir = selectImageCenterX < pieceCenterX ? "A" : "D";
            } else {
                dir = selectImageCenterY < pieceCenterY ? "W" : "S";
            }

            console.log(dir);
            return [clingImage, dir]
        }

        function calculateDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        }


        // 判断游戏是否结束
        function isSuccess(piece) {
            if (isRightGrid(piece)) {
                return isRightOrder(piece);
            }
            return false;
        }

        function isRightGrid(piece) {
            const rowSet = new Set();
            const colSet = new Set();

            piece.forEach(piece => {
                rowSet.add(piece.style.top);
                colSet.add(piece.style.left);
            });
            console.log(typeof gameSize);
            console.log(typeof rowSet.size);
            console.log(rowSet.size === gameSize && colSet.size === gameSize);
            return rowSet.size === gameSize && colSet.size === gameSize;
        }

        function isRightOrder(piece) {
            piece.sort(function (a, b) {
                if (a.getBoundingClientRect().top === b.getBoundingClientRect().top) {
                    return a.getBoundingClientRect().left - b.getBoundingClientRect().left;
                }
                return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
            });

            console.log(piece);

            for (let i = 0; i < gameSize * gameSize; i++) {
                if (piece[i].id != i) {
                    return false;
                }
            }
            return true;
        }
    }
});


function startTimer() {
    let timeCost = 0;
    timer = setInterval(() => {
        timeCost++;
        let second = timeCost % 60;
        let minute = Math.floor(timeCost / 60) % 60;
        let hour = Math.floor(timeCost / 3600);

        document.getElementById("second").textContent = `${second}秒`;
        document.getElementById("minute").textContent = `${minute}分钟`;
        document.getElementById("hour").textContent = `${hour}小时`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}