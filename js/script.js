// 棋盘数组
var chessBoard = [];
var me = true;3
var over = false;
// 赢法数组
var wins = [];
// 赢法统计数组
var myWin = [];
var computerWin = [];
// 赢法的索引
var count = 0;
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

// 初始化赢法数组
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

// 初始化赢法数组
for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');

// 棋盘初始化
for (var i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; j++) {
        chessBoard[i][j] = 0;// 0代表未落子
    }
}

context.strokeStyle = "#BFBFBF";

// 绘制背景图片
var logo = new Image();
logo.src = "images/logo.png";
logo.onload = function() {// 图片加载为异步，所以导致需要使用该回掉
    context.drawImage(logo, 0, 0, 450, 450);
    drawChessBoard();
}

// 绘制棋盘
var drawChessBoard = function () {
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
var oneStep = function(i, j, me) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, Math.PI * 2);
    context.closePath();
    // 渐变
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
    if (me) {
        gradient.addColorStop(0, '#0A0A0A');
        gradient.addColorStop(1, '#636766');
    } else {
        gradient.addColorStop(0, '#D1D1D1');
        gradient.addColorStop(1, '#F9F9F9');
    }
    context.fillStyle = gradient;
    context.fill();
}

// 绑定棋盘的单击事件
chess.onclick = function(e) {
    if (over) {
        return;
    }
    if (!me) {
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    if (chessBoard[i][j] == 0) {
        oneStep(i, j, me);
        chessBoard[i][j] = 1;

        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++;
                computerWin[k] = 6;
                if (myWin[k] == 5) {
                    alert("you win !!!");
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me;
            computerAI();
        }
    }
}

var computerAI = function () {
    var max = 0;
    var u = 0, v = 0;
    // 得分数组声明及初始化
    var myScore = [];
    var computerScore = [];
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }

    for (var i = 0; i < 15;i++) {
        for (var j = 0; j < 15;j++) {
            if(chessBoard[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if(wins[i][j][k]){
                        // 拦截分数确定
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000;
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000;
                        }
                        // 进攻分数确定
                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 220;
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 420;
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2100;
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    u = i;
                    v = j;
                } else if (myScore[i][j] == max) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
                if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                } else if (computerScore[i][j] == max) {
                    if (myScore[i][j] > myScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    // 已经得到最大分数的点
    oneStep(u, v, false);
    chessBoard[u][v] = 2;
    // 分数统计
    for (var k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            computerWin[k]++;
            myWin[k] = 6;
            if (computerWin[k] == 5) {
                alert("You lose !!!");
                over = true;
            }
        }
    }
    if (!over) {
        me = !me;
    }
}