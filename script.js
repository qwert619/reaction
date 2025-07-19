const howToText = document.querySelector('.start-text');
const background = document.getElementById('background');
const mainText = document.querySelector('.text');
const clickTime = document.querySelectorAll('.click-time');

let firstClickTime = -1;
let secondClickTime = -1;
let thirdClickTime = -1;

async function gameLoop() {
    // Show instructions
    howToText.style.display = 'block';
    background.style.backgroundColor = 'royalblue';
    mainText.textContent = 'Click anywhere to begin';
    await waitForClick(background);

    // Turn red
    howToText.style.display = 'none';
    background.style.backgroundColor = '#aa0000';
    mainText.textContent = 'Click as fast as you can when it turns green!';
    waitingForGreen();
}

function waitingForGreen() {
    let isRed = true;
    const delay = 1000 + Math.floor(Math.random() * 5000);
    const timerId = setTimeout(async() => {
        isRed = false;
        background.style.backgroundColor = '#00aa00';
        let time = performance.now();
        await waitForClick(background);
        let endTime = performance.now();
        let reaction = Math.round(endTime - time);

        // Show result
        mainText.textContent = `Your reaction time is ${reaction} milliseconds.`;
        if (firstClickTime === -1 || reaction < firstClickTime){
            clickTime[0].textContent = `Fastest click time: ${reaction} ms`;
            if (secondClickTime !== -1) {
            clickTime[2].textContent = `Third fastest click time: ${secondClickTime} ms`;
            thirdClickTime = secondClickTime;
        }
            if (firstClickTime !== -1) {
                clickTime[1].textContent = `Second fastest click time: ${firstClickTime} ms`;
                secondClickTime = firstClickTime;
            }

            firstClickTime = reaction;
        } else if (secondClickTime === -1 || reaction < secondClickTime) {
            clickTime[1].textContent = `Second fastest click time: ${reaction} ms`;
            if (secondClickTime !== -1) {
                clickTime[2].textContent = `Third fastest click time: ${secondClickTime} ms`;
                thirdClickTime = secondClickTime;
            }
            secondClickTime = reaction;
        } else if (thirdClickTime === -1 ||  reaction < thirdClickTime) {
            clickTime[2].textContent = `Third fastest click time: ${reaction} ms`;
            thirdClickTime = reaction;
        }

        await waitForClick(background); // short pause before restart
        gameLoop();
    }, delay); 
        background.addEventListener('click', async() => {if (isRed) {
        clearTimeout(timerId);
        mainText.textContent = 'You clicked too early! Wait for green.';
        await waitForClick(background);
        gameLoop();
    }}, { once: true });
}

function waitForClick(element) {
  return new Promise(resolve => element.addEventListener('click', resolve, { once: true }));
}

// Start the game
gameLoop();
