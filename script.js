// Fix:
// 1. Ошибка с кнопкой "меньше" (ошибка с операторами округления)
// 2. Обработчик ошибок - добавлено автоисправление ошибок нечисловых значений.
// 3. При выводе сообщения об ошибке дергалось модальное окно, устранено.
// 4. Ошибка в макете - задвоенный класс слоя, устранено.
// 5. Исправлено оформление страницы, сделан контрастный цвет для вывода чисел.

let minValue,
    maxValue,
    answerNumber,
    orderNumber,
    gameRun;

const orderNumberField = document.getElementById('orderNumberField'),
      answerField = document.getElementById('answerField'),
      modal = document.querySelector('.mymodal'),
      inputBox = modal.querySelector('.modal-footer'),
      minValueInput = inputBox.querySelector('.myInput1'),
      maxValueInput = inputBox.querySelector('.myInput2');

function answerPhrase() {
    const phraseRandom = Math.round( Math.random()*2);
    const answerPhrase = {
        0 : `Вы загадали неправильное число!\n\u{1F914}`,
        1 : `Вы пытаетесь меня обмануть?\n\u{1F914}`, 
        2 : `Такого числа нет!\n\u{1F914}`
    };
    return answerPhrase[phraseRandom];
}

function questionPhrase() {
    const phraseRandom = Math.round( Math.random()*3);
    const questionPhrase = {
        0 : `Вы загадали число `, 
        1 : `Да это легко! Значит вы загадали `,
        2 : `Наверное, это число `,
        3 : `Тогда это будет число `
    };
    return questionPhrase[phraseRandom];
}

function textAnswerField(number = '') {
    if (number == '') {   
        answerField.innerText = `${answerPhrase()}`;
        } else {
        answerField.innerHTML = `${questionPhrase()}\n<span class='number'>${number}</span>?`;
    }
}

openModal(); 

document.getElementById('btnRetry').addEventListener('click', () => {
    minValueInput.value = '',
    maxValueInput.value = '';
    openModal();
});

document.getElementById('btnOver').addEventListener('click', () => {
    if (gameRun){
        if (minValue === maxValue){
            textAnswerField();
            gameRun = false;
        } else {
            minValue = answerNumber  + 1;
            answerNumber = Math.floor((minValue + maxValue) / 2);
            orderNumber++;
            orderNumberField.innerText = orderNumber;
            textAnswerField(numberToString(answerNumber));
        }
    }
});

document.getElementById('btnEqual').addEventListener('click', () => {
    if (gameRun){
        answerField.innerText = `Я всегда угадываю\n\u{1F60E}`;
        gameRun = false;
    }
});

document.getElementById('btnLess').addEventListener('click', () => {
    if (gameRun){
        if (minValue === maxValue) {
            textAnswerField();
            gameRun = false;
        } else {
            maxValue = answerNumber - 1;
            answerNumber  = Math.ceil((minValue + maxValue) / 2);
            orderNumber++;
            orderNumberField.innerText = orderNumber;
            textAnswerField(numberToString(answerNumber));
        }
    }
});

// Modal

function openModal() {
    // Убираем возможность переноса фокуса в форму игры по таб
    const btnGame = document.querySelectorAll('.btn');
    btnGame.forEach(element => {
        element.setAttribute('tabindex', -1);
    });
    // Делаем модальное окно видимым
    modal.classList.add('show');
    modal.classList.remove('hide');
}

function errorValue(message) {
    // Формирование слоя вывода ошибки с динамической подстановкой сообщения
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error');
    errorMessage.style.cssText = `color: red;`;
    errorMessage.textContent = message;
    // Вставляем новый слой ниже формы ввода
    document.querySelector('.modal-body').append(errorMessage);
    setTimeout(() => {
        // Удаляем слой через 1000 мс
        errorMessage.remove();
    }, 1000);  
}

function closeModal() {
    // Автоограничение ввода данных в диапазоне -999 до 999
    minValueInput.value != '' ? minValue = parseInt(minValueInput.value) : minValue = -999;
    maxValueInput.value != '' ? maxValue = parseInt(maxValueInput.value) : maxValue = 999;
    if (minValue > maxValue) {
        errorValue(`Минимальное число не должно быть больше максимального!`);
    } else {
        // Отключение ограничения фокуса по таб 
        const btnGame = document.querySelectorAll('.btn');
            btnGame.forEach(element => {
                element.removeAttribute('tabindex', -1);
            });   
        // Модальное окно прячется
        modal.classList.add('hide');
        modal.classList.remove('show');
            // Формирование поля игры
        answerNumber  = Math.floor((minValue + maxValue) / 2);
        orderNumber = 1;
        gameRun = true;
        orderNumberField.innerText = orderNumber;
        textAnswerField(numberToString(answerNumber)); 
    }
}

function testInput(target, selector) {
    // Обработчик ошибки ввода данных
    const inputLabel = inputBox.querySelector(selector);
    // Если в поле ввода не числа или не минус
    if (inputLabel.value.match(/[^-0123456789]/g) && target) {
        // Делаем подсветку поля с ошибкой
        inputLabel.style.border = '1px solid red';
        // Удаляем результат некорректного ввода
        inputLabel.value = inputLabel.value.slice(0, -1);
        // При вводе текста, который не может быть интерпретирован как число 
        // (NaN) присваивать значения по умолчанию
        if (inputLabel.value == '' && selector == '.myInput1') {
            inputLabel.value = '-999';
        }  
        if (inputLabel.value == '' && selector == '.myInput2') {
            inputLabel.value = '999';
        }  
        // Вызов динамического слоя с пояснением ошибки
        errorValue(`Пожалуйста, вводите только цифры или знак "минус"!`);
        setTimeout(() => {
            // Удаляем подсветку ошибки через 900 мс
            inputLabel.style.border = 'none';
        }, 900);  
    }
} 

modal.addEventListener('click', (e) => { 
    // Закрытие модального окна по клик на клавишу Поехали
    if (e.target.classList.contains('btn-primary')) {
        e.preventDefault(); 
        closeModal();
    }
});

modal.addEventListener('keyup', (e) => {
    if  (e.key != '-' && e.key != 'Tab') {
        // Проверка на корректность и переполнение ввода
        testInput(e.target.classList.contains('myInput1'), '.myInput1');
        testInput(e.target.classList.contains('myInput2'), '.myInput2');
        // Если выходим за диапазон -999 до 999 - ставим значения по умолчанию
        parseInt(minValueInput.value) > 999 ? minValueInput.value = 999 : parseInt(minValueInput.value) < -999 ? minValueInput.value = -999 : minValueInput.value = minValueInput.value;
        parseInt(maxValueInput.value) > 999 ? maxValueInput.value = 999 : parseInt(maxValueInput.value) < -999 ? maxValueInput.value = -999 : maxValueInput.value = maxValueInput.value;
    }
});

modal.addEventListener('keydown', (e) => {
    // Проверка на ввода знака
    if (e.target.classList.contains('myInput1')) {
        if (e.key === '-' && modal.classList.contains('show')) {
            e.preventDefault(); 
            minValueInput.value != '' ? minValueInput.value = -parseInt(minValueInput.value) : minValueInput.value = '-0' ;
        }
    }
    if (e.target.classList.contains('myInput2')) {
        if (e.key === '-' && modal.classList.contains('show')) {
            e.preventDefault(); 
            maxValueInput.value != '' ? maxValueInput.value = -parseInt(maxValueInput.value) : maxValueInput.value = '-0' ;
        } 
    }
    // Закрытие модального окна по Энтер
    if (e.key === 'Enter' && modal.classList.contains('show')) {
        e.preventDefault(); 
        closeModal();
    }
});

// Number to String

function numberToString(number) {
    //console.log(number);
    // Конвертация числа в строковое представление в диапазоне -999 до 999
    let i100,
        i10,
        i1,
        str = '';
    const toString = {
            1 : ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'],
            2 : ['двадцать ', 'тридцать ', 'сорок ', 'пятьдесят ', 'шестьдесят ', 'семьдесят ', 'восемьдесят ', 'девяносто '],
            3 : ['сто ', 'двести ', 'триста ', 'четыреста ', 'пятьсот ', 'шестьсот ', 'семьсот ', 'восемьсот ', 'девятьсот ']
            },    
            dec = {
            1 : ['десять ', 'одиннадцать ', 'двенадцать ', 'тринадцать ', 'четырнадцать ', 'пятнадцать ', 'шестнадцать ', 'семнадцать ', 'восемнадцать ', 'девятнадцать ']
            },
            // Превращаем число в массив
            arr = (Math.abs(number)).toString().split('');
    // И считаем число разрядов
    switch (arr.length) {
        case 3:
            i100 = parseInt(arr[0]);
            i10 = parseInt(arr[1]);
            i1 = parseInt(arr[2]);
            break;
        case 2:
            i100 = 0;
            i10 = parseInt(arr[0]);
            i1 = parseInt(arr[1]);
            break;
        case 1:
            i100 = 0;
            i10 = 0;
            i1 = parseInt(arr[0]);
    }
    
    // Преобразуем число согласно разрядом в строкое представление
    if (i100 > 0) {
        str += toString[3][i100 - 1];
    }
    if (i10 > 1 ) {
        str += toString[2][i10 - 2];
    } 
    if (i10 == 1) {
        str += dec[1][i1];
        } else {
        if (i1 > 0 ) {
            str += toString[1][i1 - 1];
        }
    }
    
    // Число выводится в текстовой форме, если на его запись в текстовой форме 
    // требуется меньше 20 символов, включая пробелы. 
    //if (str.length > 20) {
    //    return number;
    //}
    
    // Если на входе ноль - возвращаем 0, иначе строка знак числа + строкове представление    
    return str == '' ? '0' : (Math.sign(number) < 0 ) ? 'минус '+ str : str;
       
    
}

