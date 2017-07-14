var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

context.strokeStyle = '#9d9d9d';
// 绘制棋盘
var drawChessboard = function () {
    for (var i = 0; i < 15; i++) {
        // 竖线
        context.moveTo(i * 30 + 15, 15);
        context.lineTo(i * 30 + 15, 435);
        context.stroke();
        // 横线
        context.moveTo(15, i * 30 + 15);
        context.lineTo(435, i * 30 + 15);
        context.stroke();
    }
}
// 绘制棋子
var piece = function (i, j, me) {
    context.beginPath();
    context.arc(i * 30 + 15, j * 30 + 15, 13, 0, Math.PI * 2);
    context.closePath();
    // 径向渐变对象  开始，结束位置
    var gradient = context.createRadialGradient(i * 30 + 15 + 2, j * 30 + 15, 13, i * 30 + 15 + 2, j * 30 + 15, 0);
    if (me) {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#636767');
    } else {
        gradient.addColorStop(0, '#d1d1d1');
        gradient.addColorStop(1, '#f9f9f9');
    }
    context.fillStyle = gradient;
    context.fill();
}

// 棋盘数组
var chessBoard = [];
for (var i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; j++) {
        // 0代表没有棋子
        chessBoard[i][j] = 0;
    }
}

// 赢法数组
var wins = [];
var count = 0; // 赢法的索引
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}
// 横线赢
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}
// 竖线赢
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}
// 斜线赢
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}
// 反斜线赢
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

// 赢法数组统计
var myWins = [];
var comWins = [];
for (var i = 0; i < count; i++) {
    myWins[i] = 0;
    comWins[i] = 0;
}

// 绑定棋盘单击事件
var me = true;
canvas.onclick = function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    piece(i, j, me);
    me = !me;
};

drawChessboard();
