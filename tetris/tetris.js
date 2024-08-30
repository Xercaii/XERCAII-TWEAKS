const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scale = 30; // Adjusted scale to match the grid size
const rows = 20;
const cols = 12;
canvas.width = cols * scale;
canvas.height = rows * scale;
context.scale(scale, scale);

const moveSound = document.getElementById('move-sound');
const rotateSound = document.getElementById('rotate-sound');
const dropSound = document.getElementById('drop-sound');
const clearSound = document.getElementById('clear-sound');
const backgroundMusic = document.getElementById('background-music');
const gameOverSound = document.getElementById('game-over-sound');

let isPaused = false;
let isGameStarted = false;

function startGame() {
    // Start playing background music
    backgroundMusic.play().catch(error => {
        console.error('Error playing background music:', error);
    });

    // Hide start screen and start the game
    document.querySelector('.start-screen').style.display = 'none';

    // Initialize game state
    playerReset();
    updateScore();
    update();
    isGameStarted = true;
}

// Function to handle pausing and resuming game and music
function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-text').textContent = isPaused ? 'Paused' : 'Running';

    // Toggle button text
    const pauseButton = document.querySelector('button[onclick="togglePause()"]');
    pauseButton.textContent = isPaused ? 'Unpause' : 'Pause';

    // Control background music
    if (isPaused) {
        backgroundMusic.pause();
    } else if (isGameStarted) {
        backgroundMusic.play().catch(error => {
            console.error('Error resuming background music:', error);
        });
    }
}

// Add event listener to start button
document.getElementById('start-button').addEventListener('click', startGame);

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        player.lines++;
        rowCount *= 2;

        clearSound.play(); // Play clear sound
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] &&
                 arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'T') {
        return [
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ];
    } else if (type === 'O') {
        return [
            [2,2],
            [2,2],
        ];
    } else if (type === 'L') {
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3],
        ];
    } else if (type === 'J') {
        return [
            [0,4,0],
            [0,4,0],
            [4,4,0],
        ];
    } else if (type === 'I') {
        return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
        ];
    } else if (type === 'S') {
        return [
            [0,6,6],
            [6,6,0],
            [0,0,0],
        ];
    } else if (type === 'Z') {
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0],
        ];
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = '#'+((1<<24)*Math.random()|0).toString(16);
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerDrop() {
    if (isPaused) return;

    player.pos.y++;
    dropSound.play(); // Play drop sound
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    if (isPaused) return;

    player.pos.x += dir;
    moveSound.play(); // Play move sound
    if (collide(arena, player)) {
        player.pos

.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        player.lines = 0;
        updateScore();
        gameOver(); // Call gameOver when the game ends
    }
}

function playerRotate(dir) {
    if (isPaused) return;

    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

let dropInterval = 1000;
let dropCounter = 0;

let lastTime = 0;

function update(time = 0) {
    if (isPaused) {
        requestAnimationFrame(update);
        return;
    }

    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
    document.getElementById('lines').innerText = player.lines;
}

const arena = createMatrix(cols, rows);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
    lines: 0,
};

document.addEventListener('DOMContentLoaded', () => {
    // Set volume to 30%
    backgroundMusic.volume = 0.3;
    // Start playing background music
    backgroundMusic.play().catch(error => {
        console.error('Error playing background music:', error);
    });
});

function gameOver() {
    // Stop background music and play game over sound
    backgroundMusic.pause();
    gameOverSound.play().catch(error => {
        console.error('Error playing game over sound:', error);
    });
    // Show game over screen
    document.getElementById('game-over-screen').style.display = 'flex';
}

function playAgain() {
    // Hide game over screen and restart game
    document.getElementById('game-over-screen').style.display = 'none';
    startGame();
}

// Add event listener to play again button
document.getElementById('play-again-button').addEventListener('click', playAgain);

// Start the game initially
playerReset();
updateScore();