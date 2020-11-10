document.getElementById("hello_text").textContent = "はじめてのJavaScript";

var tableElement = document.getElementById("data_table");

const HEIGHT = 20;
const WIDTH = 10;
const START_POINT = Math.floor((WIDTH - 1) / 2);

var count = 0;
var cells = [];
var activeBlock = null;
var isEnd = false;

// ブロックのパターン
var blocks = {
    i: {
        class: "i",
        pattern: [[0, -1], [0, 0], [0, 1], [0, 2]],
    },
    o: {
        class: "o",
        pattern: [[0, 0], [0, 1], [1, 0], [1, 1]],
    },
    t: {
        class: "t",
        pattern: [[0, 0], [1, -1], [1, 0], [1, 1]],
    },
    s: {
        class: "s",
        pattern: [[0, 1], [0, 0], [1, 0], [1, -1]],
    },
    z: {
        class: "z",
        pattern: [[0, -1], [0, 0], [1, 0], [1, 1]],
    },
    j: {
        class: "j",
        pattern: [[0, -1], [1, -1], [1, 0], [1, 1]],
    },
    l: {
        class: "l",
        pattern: [[0, 1], [1, 1], [1, 0], [1, -1]],
    }
};

// キーボードイベントを監視する
document.addEventListener("keydown", onKeyDown);

init();
var timer = setInterval(function () {
    count++;
    document.getElementById("hello_text").textContent = "はじめてのJavaScript(" + count + ")";
    if (isEnd) {
        clearInterval(timer);
        alert("Game Over");
        return;    
    }
    if (activeBlock !== null) {
        fallBlocks();
    } else {
        deleteRow();
        generateBlock();
    }
}, 200);

/* -------------------- ここから関数宣言  -------------------- */

function init() {
    for (var row = 0; row < HEIGHT; row++) {
        var tr = document.createElement("tr");
        for (var col = 0; col < WIDTH; col++) {
            var td = document.createElement("td");
            tr.appendChild(td);
        }
        tableElement.appendChild(tr);
    }

    var td_array = document.getElementsByTagName("td");
    var index = 0;
    for (var row = 0; row < HEIGHT; row++) {
        cells.push([]); // 配列のそれぞれの要素を配列にする（2次元配列にする）
        for (var col = 0; col < WIDTH; col++) {
            cells[row].push(td_array[index]);
            index++;
        }
    }
}

function fallBlocks() {
    var result = move(1, 0);
    if (!result) { // 移動できない≒接地したとき
        activeBlock = null;
    }
}

function deleteRow() {
    for (var row = HEIGHT - 1; row >= 0; row--) {
        var canDelete = true;
        for (var col = 0; col < WIDTH; col++) {
            if (cells[row][col].className === "") {
                canDelete = false;
            }
        }

        if (canDelete) {
            for (var downRow = row - 1; downRow >= 0; downRow--) {  // ★サイト間違ってる
                for (var col = 0; col < WIDTH; col++) {
                    cells[downRow + 1][col].className = cells[downRow][col].className;
                    cells[downRow][col].className = "";
                }
            }
            row++; // 複数行の削除のために同じ行をもう一度チェック
        }
    }
}

function generateBlock() {
    var keys = Object.keys(blocks);
    var nextBlockKey = keys[Math.floor(Math.random() * keys.length)];
    var nextBlock = blocks[nextBlockKey];

    for (var point of nextBlock.pattern) {
        if (cells[point[0]][point[1] + START_POINT].className != "") {
            isEnd = true;
        }
        cells[point[0]][point[1] + START_POINT].className = nextBlock.class;
    }
    activeBlock = {
        className: nextBlock.class,
        pattern: nextBlock.pattern,
        center: [0, START_POINT],
    };
}

function onKeyDown(event) {
    if (event.keyCode === 37) { // "←"
        move(0, -1);
    } else if (event.keyCode === 38) { // "↑"
        var result = true;
        while (result) { // 繰り返しによりハードドロップさせる
            result = move(1, 0);
        }
    } else if (event.keyCode === 39) { // "→"
        move(0, 1);
    } else if (event.keyCode === 40) { // "↓"
        move(1, 0);
    }
}

function move(dy, dx) {
    points = []
    for (point of activeBlock.pattern) {
        points.push([activeBlock.center[0] + point[0], activeBlock.center[1] + point[1]]);
    }

    for (point of points) {
        cells[point[0]][point[1]].className = ""; // 移動前のセルを初期化
    }

    for (point of points) {
        if (point[0] + dy < 0 || point[0] + dy >= HEIGHT || point[1] + dx < 0 || point[1] + dx >= WIDTH || cells[point[0] + dy][point[1] + dx].className != "") {
            for (point2 of points) {
                cells[point2[0]][point2[1]].className = activeBlock.className; // 移動先が範囲外もしくは、既に別のブロックがある場合、元に戻す
            }
            return false;
        }
    }

    for (var point of points) {
        cells[point[0] + dy][point[1] + dx].className = activeBlock.className;
    }
    activeBlock.center = [activeBlock.center[0] + dy, activeBlock.center[1] + dx];

    return true;
}
