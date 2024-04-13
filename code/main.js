// leia o arquivo README.txt

const { Worker: Thread } = require("node:worker_threads");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const absolutePath = (...paths) => path.resolve(path.join("../", ...paths));


const sudokuGame = JSON.parse(readFileSync(absolutePath("program", "sudoku_matriz.json")));

// Criação das threads
const threads = {
  isValid: true,
  validationsCompleted: 0,
  validateRows: new Thread(absolutePath("code", "./thread1-validate-rows.js")),
  validateColumns: new Thread(absolutePath("code", "./thread2-validate-columns.js")),
  validateGrids: new Thread(absolutePath("code", "./thread3-validate-subgrids.js"))
}


// A matriz é compartilhada entre as threads
threads.validateRows.postMessage({ sudokuGame });
threads.validateColumns.postMessage({ sudokuGame });
threads.validateGrids.postMessage({ sudokuGame });


// callback para verificar quando a validação de cada thread terminou
threads.validateRows.on("message", checkThreadResolution);
threads.validateColumns.on("message", checkThreadResolution);
threads.validateGrids.on("message", checkThreadResolution);


function checkThreadResolution(message) {
  threads.validationsCompleted++;

  if (message.error) {
    console.log(message.error);
    threads.isValid = false;
  }

  if (threads.validationsCompleted === 3) {
    stopAllThreads();

    if (threads.isValid) {
      return console.log("Sua solução SUDOKU é válida.");
    }

    console.log("Sua solução SUDOKU é inválida.");
  }
}


function stopAllThreads() {
  // threads.validateRows.terminate();
  // threads.validateColumns.terminate();
  // threads.validateGrids.terminate();
}