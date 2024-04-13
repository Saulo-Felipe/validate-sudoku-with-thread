const { parentPort } = require("node:worker_threads");

parentPort.on("message", ({ sudokuGame }) => {
  for (let l in sudokuGame) {
    for (let i = 1; i <= 9; i++) {
      if (sudokuGame[l].filter(element => element === i).length > 1) {
        parentPort.postMessage({ error: `O número ${i} localizado na linha ${Number(l)+1} se repete mais de 1 vez.` });
        return;
      }
      else if (sudokuGame[l][i] < 0 || sudokuGame[l][i] > 9) {
        parentPort.postMessage({ error: `O número ${sudokuGame[l][i]} localizado na linha ${Number(l)+1} é inválido` });
        return;
      }
    }
  }

  parentPort.postMessage({ success: true });
});