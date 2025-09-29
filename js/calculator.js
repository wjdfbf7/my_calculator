let display = document.getElementById('display');
let historyDisplay = document.getElementById('history');

let current = '';
let history = '';
let lastResult = null;
let justCalculated = false;

function press(key) {
  if (key === 'C') {
    current = '';
    history = '';
    lastResult = null;
    justCalculated = false;
    updateDisplay();
    updateHistory();
    return;
  }

  if (key === 'back') {
    current = current.slice(0, -1);
    updateDisplay();
    if (!justCalculated) updateHistory();
    return;
  }

  if (key === '+/-') {
    if (current !== '') current = (parseFloat(current) * -1).toString();
    updateDisplay();
    return;
  }

  if (key === '%') {
    if (current !== '') {
      current = (parseFloat(current) / 100).toString();
      updateDisplay();
    }
    return;
  }

  if (key === '=') {
    if (justCalculated) return;
    if (current !== '') history += current;
    if (history !== '') {
      try {
        lastResult = eval(history);
        current = lastResult.toString();
      } catch {
        current = 'Error';
        lastResult = null;
      }
      justCalculated = true;
      updateDisplay();
      historyDisplay.textContent = history + ' =';
      current = '';
    }
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    if (justCalculated) {
      history = lastResult + ' ' + key + ' ';
      justCalculated = false;
      lastResult = null;
    } else if (current !== '') {
      history += current + ' ' + key + ' ';
      current = '';
    } else if (history !== '' && '+-*/'.includes(history.slice(-2, -1))) {
      history = history.slice(0, -2) + key + ' ';
    }
    updateHistory();
    return;
  }

  if (justCalculated) {
    history = '';
    justCalculated = false;
  }
  current += key;
  updateDisplay();
}

function updateDisplay() {
  if (current === '') {
    display.value = '0';
  } else {
    let num = parseFloat(current.replace(/,/g, ''));
    display.value = isNaN(num) ? current : num.toLocaleString();
  }
}

function updateHistory() {
  historyDisplay.textContent = history;
}

updateDisplay();
updateHistory();

document.addEventListener('keydown', function (e) {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') press(e.key);
  if (['+', '-', '*', '/'].includes(e.key)) press(e.key);
  if (e.key === 'Enter') press('=');
  if (e.key.toLowerCase() === 'c') press('C');
  if (e.key === '%') press('%');
  if (e.key === 'Backspace') press('back');
});
