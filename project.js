const canvas = document.getElementById("slotCanvas");
const ctx = canvas.getContext("2d");

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const symbolSize = 50;

const symbolImages = {
  A: new Image(),
  B: new Image(),
  C: new Image(),
  D: new Image(),
};

symbolImages.A.src = 'images/symbolA.jpg';
symbolImages.B.src = 'images/symbolB.jpg';
symbolImages.C.src = 'images/symbolC.jpg';
symbolImages.D.src = 'images/symbolD.jpg';

const depositAmountInput = document.getElementById("depositAmount");
const numberOfLinesInput = document.getElementById("numberOfLines");
const betPerLineInput = document.getElementById("betPerLine");

const drawSymbol = (symbol, x, y) => {
  ctx.drawImage(symbolImages[symbol], x, y, symbolSize, symbolSize);
};

const drawReels = (reels) => {
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      const x = i * symbolSize;
      const y = j * symbolSize;
      drawSymbol(reels[i][j], x, y);
    }
  }
};

const animateSpin = () => {
  return new Promise((resolve) => {
    const spinDuration = 2000;
    const startTime = performance.now();

    const spinFrame = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < COLS; i++) {
        const x = i * symbolSize;
        const y = canvas.height / 2 - symbolSize / 2;
        const yOffset = Math.sin(progress * Math.PI) * 50;
        drawSymbol("A", x, y + yOffset);
      }

      if (progress < 1) {
        requestAnimationFrame(spinFrame);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(spinFrame);
  });
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol !== symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

const startGame = async () => {
  const depositAmount = parseFloat(depositAmountInput.value);
  const numberOfLines = parseInt(numberOfLinesInput.value);
  const betPerLine = parseFloat(betPerLineInput.value);

  if (isNaN(depositAmount) || isNaN(numberOfLines) || isNaN(betPerLine)) {
    alert("Please enter valid numeric values.");
    return;
  }

  let balance = depositAmount;

  console.log("You have a balance of $" + balance);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  await animateSpin();

  const finalReels = spin();
  drawReels(transpose(finalReels));

  const winnings = getWinnings(transpose(finalReels), betPerLine, numberOfLines);
  alert("You won, $" + winnings.toString());

  balance += winnings;
  console.log("Your updated balance is $" + balance);

  if (balance <= 0) {
    console.log("You ran out of money!");
  } else {
    const playAgain = confirm("Do you want to play again?");
    if (playAgain) {
      startGame();
    } else {
      console.log("Thanks for playing!");
    }
  }
};

startGame();
