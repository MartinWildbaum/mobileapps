window.onload = function() {
    const display = document.querySelector('.result');
    let currentInput = '';
    let equation = [];
    let activeOperatorButton = null;

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            handleInput(value, button);
        });
    });

    function handleInput(value, button) {
        if (value === 'AC') {
            resetCalculator();
        } else if (value === '+/-') {
            toggleSign();
        } else if (value === '%') {
            calculatePercentage();
        } else if (value === '=') {
            performCalculation();
        } else if (value === '.') {
            handleDecimal();
        } else if (['+', '-', 'x', '÷'].includes(value)) {
            handleOperator(value, button);
        } else {
            handleNumber(value);
        }
    }

    function resetCalculator() {
        currentInput = '';
        equation = [];
        updateDisplay('0');
        resetActiveOperatorButton();
    }

    function toggleSign() {
        if (!currentInput || currentInput === '0') return;
        currentInput = String(-parseFloat(currentInput));
        updateDisplay(currentInput);
    }

    function calculatePercentage() {
        if (!currentInput || currentInput === '0') return;
        currentInput = String(parseFloat(currentInput) / 100);
        updateDisplay(currentInput);
    }

    function handleDecimal() {
        resetActiveOperatorButton();
        if (!currentInput.includes('.')) {
            currentInput += currentInput ? '.' : '0.';
            updateDisplay(currentInput);
        }
    }

    function handleOperator(value, button) {
        resetActiveOperatorButton();
        if (currentInput) equation.push(currentInput);
        currentInput = '';
        if (['+', '-', 'x', '÷'].includes(equation.at(-1))) equation.pop();
        if (equation.length>1&&((value=='+'||value=='-')||!(equation.includes('+')||equation.includes('-')))) performCalculation(partial = true);
        equation.push(value);
        button.classList.add('operator-active');
        activeOperatorButton = button;
    }

    function handleNumber(value) {
        resetActiveOperatorButton();
        currentInput += value;
        updateDisplay(currentInput);
    }

    function performCalculation(partial = false) {
        resetActiveOperatorButton();
        if (currentInput) equation.push(currentInput);
        const calculationString = equation.join(' ')
            .replace(/÷/g, '/')
            .replace(/x/g, '*');
        try {
            const result = new Function('return ' + calculationString)();
            if (!isFinite(result)) throw new Error('Divide by zero error.');
            if (!partial) {
                currentInput = result.toString();
                equation = [];
            }
            updateDisplay(result);
        } catch (e) {
            updateDisplay('Error');
            currentInput = '';
            equation = [];
        }
    }

    function updateDisplay(value) {
        display.textContent = Intl.NumberFormat('en-US').format(value);
    }

    function resetActiveOperatorButton() {
        if (activeOperatorButton) {
            activeOperatorButton.classList.remove('operator-active');
            activeOperatorButton = null;
        }
    }
};
