// Generate random int between min and max (inclusives)
// that is not in the line yet
function generateRandomIntInLine(min, max, line) {
  const minValue = Math.ceil(min)
  const maxValue = Math.floor(max)
  const randomInt = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue

  if (!line.includes(randomInt)) {
    return randomInt
  }

  return generateRandomIntInLine(min, max, line)
}

// Generate a boolean with a X% chance to be true
function generateRandomBoolean(percentage) {
  return Math.random() < (percentage / 100);
}

function generateRandomLine() {
  let line = []
  while (line.length < 9) {
    line.push(generateRandomIntInLine(1, 9, line))
  }
  return line
}

function getBoxesToFill(grid) {
  let boxesTofill = []

  for (var i = 0; i < grid.length; i ++) {
    for (var j = 0; j < grid[i].length; j ++) {
      if (grid[i][j] === 0) {
        boxesTofill.push({ x: i, y: j })
      }
    }
  }

  return boxesTofill
}

function prettyPrint(grid) {
  console.log('')

  grid.forEach((line, indexL) => {
    lineToDisplay = ''

    line.forEach((number, indexN) => {
      if (number === 0) {
        lineToDisplay += '. '
      } else {
        lineToDisplay += `${number} `
      }
      if (((indexN + 1) % 3 == 0) && indexN !== 8) {
        lineToDisplay += '| '
      }
    })

    console.log(lineToDisplay)
    if ((indexL + 1) % 3 == 0 && indexL !== 8) {
      console.log('------+-------+------')
    }
  })
}

function isGridComplete(grid) {
  for (var i = 0; i < grid.length; i ++) {
    for (var j = 0; j < grid.length; j ++) {
      if (grid[i][j] === 0) {
        return false
      } 
    }
  }
  return true
}

function getColumn(grid, col) {
  let column = [];
  for (var i = 0; i < grid.length; i ++) {
    column.push(grid[i][col]);
  }
  return column;
}

// TODO: clean code to make it generic
function getSquares(grid) {
  let squares = []
  let topLeft = []
  let topCenter = []
  let topRight = []
  let middleLeft = []
  let middleCenter = []
  let middleRight = []
  let bottomLeft = []
  let bottomCenter = []
  let bottomRight = []

  grid.forEach((line, indexL) => {
    line.forEach((number, indexN) => {
      if (indexL <= 2) {
        if (indexN <= 2) {
          topLeft.push(number)
        }
        if (indexN > 2 && indexN <= 5) {
          topCenter.push(number)
        }
        if (indexN > 5) {
          topRight.push(number)
        }
      }
      if (indexL > 2 && indexL <= 5) {
        if (indexN <= 2) {
          middleLeft.push(number)
        }
        if (indexN > 2 && indexN <= 5) {
          middleCenter.push(number)
        }
        if (indexN > 5) {
          middleRight.push(number)
        }
      }
      if (indexL > 5) {
        if (indexN <= 2) {
          bottomLeft.push(number)
        }
        if (indexN > 2 && indexN <= 5) {
          bottomCenter.push(number)
        }
        if (indexN > 5) {
          bottomRight.push(number)
        }
      }
    })
  })

  squares.push(
    topLeft, topCenter, topRight,
    middleLeft, middleCenter, middleRight,
    bottomLeft, bottomCenter, bottomRight
  )

  return squares
}

function isGridValid(grid) {
  let isValid = true
  let errorMsg = ''
  let columns = [] // Create array of columns for later check
  const squares = getSquares(grid) // Create array of squares for later check

  // Check lines
  grid.forEach((line, indexL) => {
    let lineOccurences = []
    columns.push(getColumn(grid, indexL)) // Populating columns

    line.forEach((number) => {
      if (lineOccurences.includes(number)) {
        errorMsg += `- The ${indexL + 1}th line has more than one ${number}\n`
        isValid = false
      } else if (number !== 0) {
        lineOccurences.push(number)
      }
    })
  })

  // Check columns
  columns.forEach((column, indexC) => {
    let colOccurences = []

    column.forEach((number) => {
      if (colOccurences.includes(number)) {
        errorMsg += `- The ${indexC + 1}th column has more than one ${number}\n`
        isValid = false
      } else if (number !== 0) {
        colOccurences.push(number)
      }
    })
  })

  // Check squares
  squares.forEach((square, indexS) => {
    let squareOccurences = []

    square.forEach((number) => {
      if (squareOccurences.includes(number)) {
        errorMsg += `- The ${indexS + 1}th square has more than one ${number}\n`
        isValid = false
      } else if (number !== 0) {
        squareOccurences.push(number)
      }
    })
  })
  
  return isValid
}

function resolveGrid(grid, boxesTofill, index) {
  const randomLine = generateRandomLine()

  for (var i in randomLine) {
    grid[boxesTofill[index].x][boxesTofill[index].y] = randomLine[i];

    if (isGridValid(grid)) {
      if (isGridComplete(grid)) {
        return true
      } else {
        if (!resolveGrid(grid, boxesTofill, index + 1)) {
          grid[boxesTofill[index].x][boxesTofill[index].y] = 0
        } else {
          return true
        }
      }
    } else {
      grid[boxesTofill[index].x][boxesTofill[index].y] = 0
    }
  }
  
  return false
}

function drawGridForUser(grid, percentageOfEmptyBoxes) {
  for (var i in grid) {
    for (var j in grid[i]) {
      if (generateRandomBoolean(percentageOfEmptyBoxes)) {
        grid[i][j] = 0
      }
    }
  }
  return grid
}

// grid level: middle
const sudokuGrid = [
  [2, 0, 0, 8, 0, 4, 0, 0, 6],
  [0, 0, 6, 0, 0, 0, 5, 0, 0],
  [0, 7, 4, 0, 0, 0, 9, 2, 0],
  [3, 0, 0, 0, 4, 0, 0, 0, 7],
  [0, 0, 0, 3, 0, 5, 0, 0, 0],
  [4, 0, 0, 0, 6, 0, 0, 0, 9],
  [0, 1, 9, 0, 0, 0, 7, 4, 0],
  [0, 0, 8, 0, 0, 0, 2, 0, 0],
  [5, 0, 0, 6, 0, 8, 0, 0, 1]
]

function timeScript(script) {
  const start = new Date()
  script()
  return new Date() - start
}

time = timeScript(() => {
  // Display the model grid
  console.log('\nGrid:')
  prettyPrint(sudokuGrid)

  // Solve the grid
  const boxesToFill = getBoxesToFill(sudokuGrid)
  resolveGrid(sudokuGrid, boxesToFill, 0)
  console.log('\n\nSolved grid:')
  prettyPrint(sudokuGrid)

  // Display solved grid again but with a certain number (in percentage) of digits removed
  // The more the percentage is high, the less digits will appear in the grid
  console.log('\n\nNow solve the grid yourself!')
  drawGridForUser(sudokuGrid, 90)
  prettyPrint(sudokuGrid)
})

console.log(`\n\nExecuted in ${time} milliseconds`)

// TODO: optimisation
// 1. use possibilities of each box -> pass through boxes with few possibilities first
// 2. list boxes to fill 
// 3. check only boxes impacted by change instead of whole grid