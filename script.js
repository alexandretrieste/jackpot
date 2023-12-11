const slotMachineColumns = document.querySelectorAll('.columnSlotMachine');

function spinSlotMachines() {
  const randomNumbers = [];
  for (let i = 0; i < slotMachineColumns.length; i++) {
    randomNumbers.push(Math.floor(Math.random() * 10));
  }

  slotMachineColumns.forEach((column, index) => {
    const animation = column.animate([
      { backgroundPosition: `0px -${randomNumbers[index] * 215}px` },
      { backgroundPosition: `0px 0px` }
    ], {
      duration: 1000,
      easing: 'ease-in-out'
    });

    animation.onfinish = function() {
      if (randomNumbers[0] === randomNumbers[1] && randomNumbers[1] === randomNumbers[2]) {
        console.log('Você ganhou!');
      } else {
        console.log('Você perdeu!');
      }
    };
  });
}
document.getElementById('startButton').addEventListener('click', spinSlotMachines);
