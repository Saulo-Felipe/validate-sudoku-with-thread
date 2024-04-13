const { parentPort } = require("node:worker_threads");

function extractPositions(rowIndex, columnIndex, sudokuGame) {
  let newGrid = []
  for (let i = rowIndex; i < rowIndex+3; i++) {
    for (let j = columnIndex; j < columnIndex+3; j++) {
      newGrid.push(sudokuGame[i][j]);
    }
  }

  return newGrid;
}

parentPort.on("message", ({ sudokuGame }) => {
  const subgrids = [
    extractPositions(0, 0, sudokuGame), extractPositions(0, 3, sudokuGame), extractPositions(0, 6, sudokuGame),
    extractPositions(3, 0, sudokuGame), extractPositions(3, 3, sudokuGame), extractPositions(3, 6, sudokuGame),
    extractPositions(6, 0, sudokuGame), extractPositions(6, 3, sudokuGame), extractPositions(6, 6, sudokuGame),
  ];

  for (let l in subgrids) {
    for (let i = 1; i <= 9; i++) {
      if (subgrids[l].filter(element => element === i).length > 1) {
        parentPort.postMessage({error: `O número ${i} localizado na subgrid ${Number(l)+1} se repete mais de 1 vez.`});
        return;
      }
    }
  }

  parentPort.postMessage({success: true});
});