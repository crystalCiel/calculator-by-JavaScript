// 計算機狀態
let firstInput = '';
let operator = '';
let secondInput = '';
let current = '0';
let useEqual = false;
let methods = {
    '+': function add(firstInput, secondInput) {
        return parseFloat(firstInput) + parseFloat(secondInput);
    },
    '-': function min(firstInput, secondInput) {
        return firstInput - secondInput;
    },
    'x': function mul(firstInput, secondInput) {
        return firstInput * secondInput;
    },
    '÷': function unl(firstInput, secondInput) {
        return firstInput / secondInput;
    }
};
let calculatorKeyboard = [
    'C', 'CE', 'DEL', '÷',
    '7', '8', '9', 'x',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '-/+', '0', '.', '=',
];


function createDOM (elementType, { idName = undefined, className = undefined}) {
    let dom = document.createElement(elementType);

    if (!!idName) {
        dom.id = idName;
    }

    if (!!className) {
        dom.classList.add(className);
    }

    return dom;
};

function clickButton (inputValue) {

    if (current === 'NaN' || current === 'Infinity') { // 錯誤情況時
        if (inputValue === 'CE') {
            // not doing
        } else {
            return ;
        }
    }

    switch (inputValue) {
        case '.':

            if (current.indexOf(inputValue) === -1) {
                current += inputValue;
            }

            if (useEqual) {
                firstInput = '';
                secondInput = '';
                operator = '';
                // current = inputValue;
                useEqual = false;
            }

            break;

        case 'DEL': 
            if (current.length > 1) {
                current = current.substring(0, current.length - 1);
                if (current === '-') {
                    current = '0';
                }
            } else if ( current !== '0' ) {
                current = '0';
            }
            break;

        case 'CE': 
            current = '0';
            break;

        case 'C': 
            firstInput = '';
            secondInput = '';
            operator = '';
            current = '0';
            useEqual = false;

            break;

        case '-/+':
            if (current === '0') {
                // not action
            } else if (current.indexOf('-') === -1) {
                current = '-' + current;
            } else {
                current = current.substring(1);
            }
            break;

        case '+': case '-': case 'x': case '÷':
            if (firstInput.length === 0) {
                firstInput = current;
                operator = inputValue;
                current = '0';
            } else { // 計算連續加減

                if (useEqual) {
                    secondInput = '';
                    firstInput = current;
                    operator = inputValue;
                    current = '0';
                    useEqual = false;
                } else if (current === '0') {
                    // not doing
                    operator = inputValue;
                    // return;
                } else {
                    secondInput = current;
                    let count = methods[operator];
                    current = String(count(firstInput, secondInput));
                    firstInput = current;
                    current = '0';
                    operator = inputValue;
                    secondInput = '';
                }
            }
            
            break;

        case '=':
            if (operator.length === 0) {
                // not doing
                return;
            } else if (useEqual) {
                firstInput = current;
            } else {
                useEqual = true;
                secondInput = current;
            }
            
            let count = methods[operator];
            current = String(count(firstInput, secondInput));
            
            break;

        default : 
            if (useEqual) { // 等於以後沒歸零重新計算
                firstInput = '';
                secondInput = '';
                operator = '';
                current = inputValue;
                useEqual = false;
            // } else if (current === firstInput) { // 可能會更改運算子
            //     current = inputValue;
            } else if (current.length > 1 || current !== '0') {
                current += inputValue;
            } else {
                current = inputValue;
            }
            break;
    }

    if (current.length > 16) {
        current = current.substring(0, current.length - 1);
    };

    formula.innerText = firstInput + ' ' + operator + ' ' + secondInput + ' ' + ( secondInput !== '' ? '=' : '');
    
    if (current === 'NaN') {
        currentShow.innerText = '未定義結果';
    } else if (current === 'Infinity') {
        currentShow.innerText = '無法除以零';
    } else {
        currentShow.innerText = current;
    }
}

function buttonAction (inputValue) {
    let position = calculatorKeyboard.indexOf(inputValue);
    let targetBtn = document.getElementById(`btn_${position}`);

    targetBtn.classList.add('hovering');
    setTimeout(() => {
        targetBtn.classList.remove('hovering');
    }, 100);
}

// 計算機元件創建
let container = createDOM('div', { className: 'container' });
document.body.appendChild(container);

let calculator = createDOM('div', { idName: 'calculator' });
container.appendChild(calculator);

let displayPanel = createDOM('div', { idName: 'displayPanel' });
calculator.appendChild(displayPanel);

let formula = createDOM('div', { idName: 'formula' });
displayPanel.appendChild(formula);

let currentShow = createDOM('div', { idName: 'currentShow' });
displayPanel.appendChild(currentShow);
currentShow.innerText = current;

let calculatorKeyboardGroup = createDOM('div', { idName: 'keyBoardGroup' });
calculator.appendChild(calculatorKeyboardGroup);

for (let ii = 0, ll = calculatorKeyboard.length; ii < ll; ii++) {
    let button = createDOM('button', { className: 'calculatorBtn', idName: `btn_${ii}` });
    button.innerText = calculatorKeyboard[ii];
    calculatorKeyboardGroup.appendChild(button);

    button.addEventListener('click', () => {
        clickButton(button.innerText);
    });
}

let keyCodeList = {
    13: '=',
    187: '=',
    8: 'DEL',
    46: 'CE',
    27: 'C',
    191: '÷',
    111: '÷',
    106: 'x',
    107: '+',
    189: '-',
    109: '-',
    110: '.',
    190: '.',
    48: '0',
    96: '0',
    49: '1',
    97: '1',
    50: '2',
    98: '2',
    51: '3',
    99: '3',
    52: '4',
    100: '4',
    53: '5',
    101: '5',
    54: '6',
    102: '6',
    55: '7',
    103: '7',
    56: '8',
    104: '8',
    57: '9',
    105: '9'
};

document.body.addEventListener('keydown', (e) => {
    let keyValue = '';
    console.log('this push:', e.keyCode, e.shiftKey);
    if (e.keyCode === 187 && e.shiftKey) {
        keyValue = '+';
    } else if (e.keyCode === 56 && e.shiftKey ) {
        keyValue = 'x';
    } else if (!!keyCodeList[e.keyCode]) {
        keyValue = keyCodeList[e.keyCode];
    } else {
        console.log('this push:', e.keyCode);
    }

    if (keyValue.length !== 0) {
        clickButton(keyValue);
        buttonAction(keyValue);
    }

});