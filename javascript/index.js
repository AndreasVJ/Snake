// Choose which canvas to draw on
const canvas = document.getElementById('game')
const ctx = canvas.getContext("2d")

const fps = 5

// Number of vertical and horizontal tiles
const gridSize = 15

// Prevent game from automatically starting
let play = false

// Colors
const tileColor = "#c7c7b7"
const lineColor = "#000000"
const snakeColor = "#ffbb00"
const appleColor = "#ff0000"

// Pixel width of lines and and tiles
const lineSize = canvas.height / (gridSize * 10)
const tileSize = (canvas.height - lineSize * (gridSize + 1)) / gridSize

// Create empty game grid
let grid = []
for (let i = 0; i < gridSize; i++) {
    grid.push([])
}
grid.forEach(value => {
    for (let i = 0; i < gridSize; i++) {
        value.push(0)
    }
})

// Add snake
let head = {x: 5, y: Math.floor(gridSize/2)}
let tail =  {x: 2, y: Math.floor(gridSize/2)}
let previousTail = {x: undefined, y: undefined}

for (let i = 0; i < 4; i++) {
    grid[tail.y][tail.x + i] = 2
}

// Add apple
let apple = {x: gridSize-3, y: Math.floor(gridSize/2)}
grid[apple.y][apple.x] = 5

// Move a snake part based on the value inside it's grid position
function moveSnakePart(snakePart) {
    if (grid[snakePart.y][[snakePart.x]] == 1) {
        snakePart.y -= 1
    }
    else if (grid[snakePart.y][[snakePart.x]] == 2) {
        snakePart.x += 1
    }
    else if (grid[snakePart.y][[snakePart.x]] == 3) {
        snakePart.y += 1
    }
    else if (grid[snakePart.y][[snakePart.x]] == 4) {
        snakePart.x -= 1
    }
}

// Create a queue where the next moves can be stored
// First element in the queue will be the direction of the snake
let moveQueue = [grid[head.y][head.x]]

// Check keypresses from the player
// Also prevent snake from moving backwards into itself 
document.addEventListener('keydown', (event) => {

    // Start game on first key press
    play = true

    if ((event.key.toLowerCase() == "w") || (event.key == "ArrowUp")) {
        if (moveQueue[moveQueue.length-1] != 3 && moveQueue[moveQueue.length-1] != 1) {
            moveQueue.push(1)
        }
    }
    else if ((event.key.toLowerCase() == "d") || (event.key == "ArrowRight")) {
        if (moveQueue[moveQueue.length-1] != 4 && moveQueue[moveQueue.length-1] != 2) {
            moveQueue.push(2)
        }
    }
    else if ((event.key.toLowerCase() == "s") || (event.key == "ArrowDown")) {
        if (moveQueue[moveQueue.length-1] != 1 && moveQueue[moveQueue.length-1] != 3) {
            moveQueue.push(3)
        }
    }
    else if ((event.key.toLowerCase() == "a") || (event.key == "ArrowLeft")) {
        if (moveQueue[moveQueue.length-1] != 2 && moveQueue[moveQueue.length-1] != 4) {
            moveQueue.push(4)
        }
    }
})


function drawGame() {

    // Clear canvas
    ctx.fillStyle = lineColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Fill tiles
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (grid[y][x] == 0) {
                ctx.fillStyle = tileColor
            }
            else if (grid[y][x] == 5) {
                ctx.fillStyle = appleColor
            }
            else {
                ctx.fillStyle = snakeColor
            }
            ctx.fillRect((tileSize+lineSize)*x + lineSize, (tileSize+lineSize)*y + lineSize, tileSize, tileSize)
        }
    }
}


function gameLoop() {

    if (play) {
        // Remove the first element in moveQueue if the player has given new commands
        if (moveQueue.length > 1) {
            moveQueue.shift()
        }

        // Update the direction of the head and move it
        grid[head.y][[head.x]] = moveQueue[0]
        moveSnakePart(head)

        // Check border collision
        if ((head.x >= gridSize) || (head.y >= gridSize) || (head.x < 0) || (head.y < 0)) {
            return
        }

        // Only move the tail when an apple has not been eaten
        if (grid[head.y][[head.x]] != 5) {
            previousTail.x = tail.x
            previousTail.y = tail.y
            moveSnakePart(tail)
            grid[previousTail.y][previousTail.x] = 0
        }
        // Add a new apple if the last one has been eaten
        else {
            while (grid[apple.y][apple.x] != 0) {
                apple.x = Math.floor(Math.random() * gridSize)
                apple.y = Math.floor(Math.random() * gridSize)
            }
            grid[apple.y][apple.x] = 5
        }

        // Check collision with itself
        if (grid[head.y][head.x] != 0 && grid[head.y][head.x] != 5) {
            return
        }

        // Update grid with new head position
        grid[head.y][head.x] = moveQueue[0]
    }

    drawGame()

    setTimeout(gameLoop, 1000/fps)
}


gameLoop()
