//Рисование
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

var xc =  200;

var yc = 200;
var R = 70;

context.beginPath();
//Рисуем линию x
context.moveTo(0,yc);
context.lineTo(2*xc,yc);

//Рисуем линию y
context.moveTo(xc,2*yc);
context.lineTo(xc,0);

context.closePath();
context.stroke();

//Рисуем четверь окружности
context.beginPath();
context.moveTo(xc,yc);
context.arc(xc,yc,R/2,Math.PI/2, Math.PI, false)
context.closePath();
context.fillStyle = "blue";
context.globalAlpha = 0.45;
context.fill();
context.stroke();

//Рисуем прямоугольник
context.beginPath();
context.moveTo(xc,yc);
context.rect(xc-R/2, yc-R, R/2, R);
context.closePath();
context.fillStyle = "blue";
context.globalAlpha = 0.45;
context.fill();
context.stroke();

//Рисуем треугольник
context.beginPath();
context.moveTo(xc,yc);
context.lineTo(xc, yc+R/2)
context.lineTo(xc+R,yc);
context.closePath();
context.fillStyle = "blue";
context.globalAlpha = 0.45;
context.fill();
context.stroke();



//Засечики на осях, стрелочки и подписи 

//Стрелочки
context.beginPath();
context.moveTo(2*xc, yc);
context.lineTo(2*xc-10, yc-5)
context.moveTo(2*xc, yc);
context.lineTo(2*xc-10, yc+5)

context.moveTo(xc, 0);
context.lineTo(xc-5, 0+10); 
context.moveTo(xc, 0);
context.lineTo(xc+5, 0+10); 
context.closePath();
context.stroke();

//Засчечки и подписи
const crossLength = 5;
const gapX = 5;
const gapY = 5;
context.beginPath();
context.strokeStyle = "black";
context.moveTo(xc-crossLength/2,yc-R/2);
context.lineTo(xc+crossLength/2,yc-R/2);
context.fillText("R/2", xc+gapX, yc-R/2+gapY);
context.moveTo(xc-crossLength/2,yc-R);
context.lineTo(xc+crossLength/2,yc-R);
context.fillText("R", xc+gapX, yc-R+gapY);

context.moveTo(xc+R/2,yc-crossLength/2);
context.lineTo(xc+R/2,yc+crossLength/2);
context.fillText("R/2",xc+R/2-gapX,yc-gapY);
context.moveTo(xc+R,yc-crossLength/2);
context.lineTo(xc+R,yc+crossLength/2);
context.fillText("R",xc+R-gapX,yc-gapY);

context.moveTo(xc-crossLength/2,yc+R/2);
context.lineTo(xc+crossLength/2,yc+R/2);
context.fillText("-R/2", xc+gapX, yc+R/2+gapY);
context.moveTo(xc-crossLength/2,yc+R);
context.lineTo(xc+crossLength/2,yc+R);
context.fillText("-R", xc+gapX, yc+R+gapY);

context.moveTo(xc-R/2,yc-crossLength/2);
context.lineTo(xc-R/2,yc+crossLength/2);
context.fillText("-R/2",xc-R/2-gapX,yc-gapY);
context.moveTo(xc-R,yc-crossLength/2);
context.lineTo(xc-R,yc+crossLength/2);

context.fillText("-R",xc-R-gapX,yc-gapY);



context.textBaseline = "bottom";
context.fillText("x",2*xc-gapX,yc-gapY);
context.textBaseline = "hanging";
context.fillText("y",xc+1.22*gapX,0);
context.closePath();
context.stroke();







//Подстановка точки и валидация
const form = document.forms["search"];
var tableRaws=[];
var x;
var y;
var r;

function checkPoint(){
    if (!validateForm()) {
        return; // Прерываем отправку, если форма заполнена с ошибками
    }
    
    playSound();
    //Отправляем GET с параметрами x, y, R. Сервер проверяет еще раз валидацию, определяет попадание, и возвращает ответ что валидация пройдена и попадание/промах
    
    $.ajax({
        url: '/fcgi-bin/',
        method: 'GET',
        dataType: 'json',
        data: {
            x: x,
            y: y,
            r: r
        },
        success: function(data) {
            if (!data.validatePoint) {
                return;
            }
            addRow(x, y, r, data.popadanie, data.currentTime, data.executionTime);
        },
    });   
}

function validateForm(){
    return validateAndSetX() && validateAndSetY() && validateAndSetR();
}

function validateAndSetX(){
    const checkedBoxesX = document.querySelectorAll('input[name="valueOfX"]:checked');
    const selectedValuesX = Array.from(checkedBoxesX).map(box => box.value);
    let errorElement = document.getElementById("x-error");
    
    function showError(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
        }
    }

    function hideError() {
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = "none";
        }
    }

    hideError();


    if (selectedValuesX.length!=1){
        showError("Для X должно быть выбрано только одно значение!");
        return false;
    }
    x = parseFloat(selectedValuesX[0]);
    return true;
}

function validateAndSetY() {
    let valY = form.elements["Y"].value;
    let trimmed = valY.trim().replace(',', '.');
    let errorElement = document.getElementById("y-error");


    function showError(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
        }
    }

    function hideError() {
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = "none";
        }
    }

    hideError();

    if (trimmed === "") {
        showError("Поле Y не должно быть пустым!");
        return false;
    }

    if (trimmed.length > 15) {
        showError("Длина ввода не должна превышать 15 символов!");
        return false;
    }

    if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
        showError("Поле Y должно быть числом!");
        return false;
    }

    y = parseFloat(trimmed);

    if (y <= -5 || y >= 5) {
        showError("Поле Y должно быть в диапазоне: (-5; 5)!");
        return false;
    }

    return true;
}

function validateAndSetR(){
    const checkedBoxesR = document.querySelectorAll('input[name="valueOfR"]:checked');
    const selectedValuesR = Array.from(checkedBoxesR).map(box => box.value);
    let errorElement = document.getElementById("r-error");
    
    function showError(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
        }
    }

    function hideError() {
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = "none";
        }
    }

    hideError();


    if (selectedValuesR.length!=1){
        showError("Для R должно быть выбрано только одно значение!");
        return false;
    }
    r = parseFloat(selectedValuesR[0]);
    return true;
}



function addRow(valX, valY, valR, isHit, serverTime, executionTime) {
    let resText = isHit ? "Попадание" : "Промах";
    
    drawPoint(valX, valY, valR, isHit);
    
    tableRaws.push({ 
        x: valX, 
        y: valY, 
        r: valR, 
        popadanie: resText, 
        timeStamp: serverTime || new Date().toISOString(),
        executionTime: executionTime 
    });

    currentPage = Math.ceil(tableRaws.length / rowsPerPage);
    updateUI();
}


function drawPoint(x, y, r, isHit) {
    const scale = R / r; 
    const pixelX = xc + x * scale;
    const pixelY = yc - y * scale;

    context.beginPath();
    context.arc(pixelX, pixelY, 4, 0, 2 * Math.PI);
    context.fillStyle = isHit ? "green" : "red";
    context.globalAlpha = 1.0; 
    context.fill();
    context.closePath();
}

function formatDateTime(isoString) {
    const date = new Date(isoString);
    
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
}





function clearHistory(){
    localStorage.clear();
    location.reload();
}

function sortTableByTimeAsc() {
    tableRaws.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
    updateUI();
}

function sortTableByTimeDesc() {
    tableRaws.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
    updateUI();
}


function playSound() {
    const audio = new Audio('applepay.mp3');
    audio.play();
}

const rowsPerPage = 8;
let currentPage = 1;

let prevButton, nextButton, pageInfo, pageInput, goToPageBtn;

document.addEventListener("DOMContentLoaded", () => {
    prevButton = document.getElementById('prev');
    nextButton = document.getElementById('next');
    pageInfo = document.getElementById('page-info');
    pageInput = document.getElementById('page-input');
    goToPageBtn = document.getElementById('go-to-page');

    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                updateUI();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            const totalPages = Math.max(1, Math.ceil(tableRaws.length / rowsPerPage));
            if (currentPage < totalPages) {
                currentPage++;
                updateUI();
            }
        });
    }

    if (goToPageBtn) {
        goToPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToInputPage();
        });
    }

    if (pageInput) {
        pageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                goToInputPage();
            }
        });
    }

    initializeTable();
});

function showPageError(message) {
    const errorElement = document.getElementById("page-error");
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }
}

function hidePageError() {
    const errorElement = document.getElementById("page-error");
    if (errorElement) {
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }
}

function goToInputPage() {
    hidePageError();
    if (!validatePageNumber()){
        return;
    }
    const rawVal = pageInput ? pageInput.value.trim() : "";
    const pageNum = parseInt(rawVal, 10);
    currentPage = pageNum;
    updateUI(); // Убрали лишний initializeTable()
}

function validatePageNumber(){
    const rawVal = pageInput ? pageInput.value.trim() : "";
    const totalPages = Math.max(1, Math.ceil(tableRaws.length / rowsPerPage));
    
    if (rawVal === "") {
        showPageError("Номер страницы не должен быть пустым!");
        return false;
    }

    if (rawVal.length > 15) {
        showPageError("Длина ввода не должна превышать 15 символов!");
        return false;
    }

    if (!/^\d+$/.test(rawVal)) {
        showPageError("Номер страницы должен быть целым положительным числом!");
        return false;
    }

    const pageNum = parseInt(rawVal, 10);

    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
        showPageError(`Номер страницы должен быть в диапазоне от 1 до ${totalPages}!`);
        return false;
    }

    return true;
}

function updateUI() {
    hidePageError(); 

    localStorage.setItem("tableRaws", JSON.stringify(tableRaws));

    const tbody = document.getElementById("tableOfResults").querySelector("tbody");
    tbody.innerHTML = "";

    const totalRecords = tableRaws.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / rowsPerPage));

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = tableRaws.slice(startIndex, endIndex);

    for (let raw of pageData) {
        const newRow = tbody.insertRow();
        newRow.insertCell(0).textContent = raw.x;
        newRow.insertCell(1).textContent = raw.y;
        newRow.insertCell(2).textContent = raw.r;
        newRow.insertCell(3).textContent = raw.popadanie;
        newRow.insertCell(4).textContent = formatDateTime(raw.timeStamp);
    }

    if (pageInfo) {
        pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
    }
    if (pageInput) {
        pageInput.max = totalPages;
        pageInput.value = currentPage;
    }

    if (prevButton) prevButton.disabled = (currentPage === 1);
    if (nextButton) nextButton.disabled = (currentPage === totalPages || totalRecords === 0);
}

function initializeTable() {
    let saved = localStorage.getItem("tableRaws");
    if (saved) {
        tableRaws = JSON.parse(saved);
        for (let raw of tableRaws) {
            drawPoint(parseFloat(raw.x), parseFloat(raw.y), parseFloat(raw.r), raw.popadanie === "Попадание");
        }
    }
    updateUI(); 
}