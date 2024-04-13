const { parentPort } = require("node:worker_threads");

parentPort.on("message", ({ sudokuGame }) => {
  const columnToRow = sudokuGame.reduce((newSudoku, _, i, e) => {
    return [
      ...newSudoku, 
      sudokuGame.map(row => row[i])
    ];
  }, []);

  for (let l in columnToRow) {
    for (let i = 1; i <= 9; i++) {
      if (columnToRow[l].filter(element => element === i).length > 1) {
        parentPort.postMessage({error: `O número ${i} localizado na coluna ${Number(l)+1} se repete mais de 1 vez.`});
        return;
      }
    }
  }

  parentPort.postMessage({success: true});
});
