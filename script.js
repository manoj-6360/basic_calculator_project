// Initialize elements
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const errorMessage = document.getElementById('error');
const memoryIndicator = document.getElementById('memoryIndicator');
const soundToggle = document.getElementById('soundToggle');
let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;
let memory = 0;

// Sound effects
const clickSoundNumber = new Audio('https://freesound.org/data/previews/171/171671_2437358-lq.mp3');
const clickSoundOperator = new Audio('https://freesound.org/data/previews/270/270301_5123851-lq.mp3');
const clickSoundError = new Audio('https://freesound.org/data/previews/395/395273_3232293-lq.mp3');

// Play sound with toggle
function playSound(sound) {
    if (soundToggle.checked) sound.play().catch(() => {});
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => errorMessage.classList.add('hidden'), 2000);
}

// Update memory indicator
function updateMemoryIndicator() {
    memoryIndicator.classList.toggle('hidden', memory === 0);
}

// Append number or decimal
function appendNumber(number) {
    playSound(clickSoundNumber);
    if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else if (number === '.' && currentInput.includes('.')) {
        return;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

// Append operator
function appendOperator(op) {
    playSound(clickSoundOperator);
    if (currentInput && (previousInput || operator)) calculate();
    previousInput = currentInput;
    operator = op;
    historyDisplay.textContent = `${previousInput} ${op}`;
    shouldResetDisplay = true;
    updateDisplay();
}

// Update display
function updateDisplay() {
    display.textContent = currentInput;
    if (!operator) historyDisplay.textContent = '';
}

// Clear all
function clearDisplay() {
    playSound(clickSoundOperator);
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    historyDisplay.textContent = '';
    errorMessage.classList.add('hidden');
    updateDisplay();
}

// Backspace
function backspace() {
    playSound(clickSoundOperator);
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    updateDisplay();
}

// Perform calculation
function calculate() {
    playSound(clickSoundOperator);
    if (!previousInput || !currentInput || !operator) return;

    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                playSound(clickSoundError);
                showError('Cannot divide by zero');
                clearDisplay();
                return;
            }
            result = num1 / num2;
            break;
    }

    currentInput = result.toString();
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
    historyDisplay.textContent = '';
    updateDisplay();
}

// Calculate percentage
function calculatePercentage() {
    playSound(clickSoundOperator);
    if (!currentInput) return;
    const num = parseFloat(currentInput);
    let result = num / 100;

    if (previousInput && operator) {
        const prevNum = parseFloat(previousInput);
        result = operator === '+' || operator === '-' ? prevNum * (num / 100) : num / 100;
    }

    currentInput = result.toString();
    historyDisplay.textContent = `${previousInput || ''} ${operator || ''} ${num}%`;
    shouldResetDisplay = true;
    updateDisplay();
}

// Memory functions
function memoryAdd() {
    playSound(clickSoundOperator);
    if (currentInput) memory += parseFloat(currentInput);
    updateMemoryIndicator();
}

function memorySubtract() {
    playSound(clickSoundOperator);
    if (currentInput) memory -= parseFloat(currentInput);
    updateMemoryIndicator();
}

function memoryRecall() {
    playSound(clickSoundOperator);
    currentInput = memory.toString();
    shouldResetDisplay = true;
    updateDisplay();
}

function memoryClear() {
    playSound(clickSoundOperator);
    memory = 0;
    updateMemoryIndicator();
}

// Calculate square root
function calculateSquareRoot() {
    playSound(clickSoundOperator);
    if (!currentInput) return;
    const num = parseFloat(currentInput);
    if (num < 0) {
        playSound(clickSoundError);
        showError('Invalid input for square root');
        return;
    }
    currentInput = Math.sqrt(num).toString();
    historyDisplay.textContent = `√(${num})`;
    shouldResetDisplay = true;
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    e.preventDefault();
    const key = e.key;
    if (/[0-9]/.test(key)) appendNumber(key);
    else if (key === '.') appendNumber('.');
    else if (['+', '-', '*', '/'].includes(key)) appendOperator(key);
    else if (key === 'Enter' || key === '=') calculate();
    else if (key === 'Escape') clearDisplay();
    else if (key === 'Backspace') backspace();
    else if (key.toLowerCase() === 'p') calculatePercentage();
    else if (key.toLowerCase() === 'm') memoryRecall();
});

// Initialize
updateMemoryIndicator();