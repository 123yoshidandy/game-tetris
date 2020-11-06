document.getElementById("hello_text").textContent = "はじめてのJavaScript";

var tableElement = document.getElementById("data_table");

var count = 0;
var cells = [];
var isFalling = false;
var fallingBlockNum = 0;

// ブロックのパターン
var blocks = {
    i: {
        class: "i",
        pattern: [
            [1, 1, 1, 1]
        ]
    },
    o: {
        class: "o",
        pattern: [
            [1, 1],
            [1, 1]
        ]
    },
    t: {
        class: "t",
        pattern: [
            [0, 1, 0],
            [1, 1, 1]
        ]
    },
    s: {
        class: "s",
        pattern: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    },
    z: {
        class: "z",
        pattern: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    },
    j: {
        class: "j",
        pattern: [
            [1, 0, 0],
            [1, 1, 1]
        ]
    },
    l: {
        class: "l",
        pattern: [
            [0, 0, 1],
            [1, 1, 1]
        ]
    }
};

// キーボードイベントを監視する
document.addEventListener("keydown", onKeyDown);

init();
setInterval(function () {
    count++;
    document.getElementById("hello_text").textContent = "はじめてのJavaScript(" + count + ")";
    for (var row = 0; row < 2; row++) {
        for (var col = 0; col < 10; col++) {
            if (cells[row][col].className !== "" && cells[row][col].blockNum !== fallingBlockNum) { // ★サイト間違ってる
                alert("Game Over");
            }
        }
    }
    if (hasFallingBlock()) {
        fallBlocks();
    } else {
        deleteRow();
        generateBlock();
    }
}, 200);

/* -------------------- ここから関数宣言  -------------------- */

function init() {
    for (var row = 0; row < 20; row++) {
        var tr = document.createElement("tr");
        for (var col = 0; col < 10; col++) {
            var td = document.createElement("td");
            tr.appendChild(td);
        }
        tableElement.appendChild(tr);
    }

    var td_array = document.getElementsByTagName("td");
    var index = 0;
    for (var row = 0; row < 20; row++) {
        cells[row] = []; // 配列のそれぞれの要素を配列にする（2次元配列にする）
        for (var col = 0; col < 10; col++) {
            cells[row][col] = td_array[index];
            index++;
        }
    }
}

function fallBlocks() {
    for (var col = 0; col < 10; col++) {
        if (cells[19][col].blockNum === fallingBlockNum) {
            isFalling = false;
            return;
        }
    }
    for (var row = 18; row >= 0; row--) {
        for (var col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                if (cells[row + 1][col].className !== "" && cells[row + 1][col].blockNum !== fallingBlockNum) {
                    isFalling = false;
                    return;
                }
            }
        }
    }

    // 下から二番目の行から繰り返しクラスを下げていく
    for (var row = 18; row >= 0; row--) {
        for (var col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[row + 1][col].className = cells[row][col].className;
                cells[row + 1][col].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
    }
}

function hasFallingBlock() {
    return isFalling;
}

function deleteRow() {
    for (var row = 19; row >= 0; row--) {
        var canDelete = true;
        for (var col = 0; col < 10; col++) {
            if (cells[row][col].className === "") {
                canDelete = false;
            }
        }

        if (canDelete) {
            for (var col = 0; col < 10; col++) {
                cells[row][col].className = "";
            }

            for (var downRow = row - 1; downRow >= 0; downRow--) {  // ★サイト間違ってる
                for (var col = 0; col < 10; col++) {
                    cells[downRow + 1][col].className = cells[downRow][col].className;
                    cells[downRow + 1][col].blockNum = cells[downRow][col].blockNum;
                    cells[downRow][col].className = "";
                    cells[downRow][col].blockNum = null;
                }
            }
        }
    }
}

function generateBlock() {
    var keys = Object.keys(blocks);
    var nextBlockKey = keys[Math.floor(Math.random() * keys.length)];
    var nextBlock = blocks[nextBlockKey];
    var nextFallingBlockNum = fallingBlockNum + 1;

    var pattern = nextBlock.pattern;
    for (var row = 0; row < pattern.length; row++) {
        for (var col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col]) {
                cells[row][col + 3].className = nextBlock.class;
                cells[row][col + 3].blockNum = nextFallingBlockNum;
            }
        }
    }

    isFalling = true;
    fallingBlockNum = nextFallingBlockNum;
}

function onKeyDown(event) {
    if (event.keyCode === 37) {
        moveLeft();
    } else if (event.keyCode === 39) {
        moveRight();
    }
}

function moveRight() {
    for (var row = 0; row < 20; row++) {
        for (var col = 9; col >= 0; col--) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[row][col + 1].className = cells[row][col].className;
                cells[row][col + 1].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
    }
}

function moveLeft() {
    for (var row = 0; row < 20; row++) {
        for (var col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[row][col - 1].className = cells[row][col].className;
                cells[row][col - 1].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
    }
}
