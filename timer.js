let time = 300;     // 5 minutes in seconds

const timerValue = document.getElementById("timerValue");
timerValue.value = convertToTimeString(time);

timerValue.addEventListener("blur", function() {
    time = convertToSeconds(timerValue.value);
    console.log(`Time set to: ${time} seconds`);
    timerValue.value = convertToTimeString(time);
})

timerValue.addEventListener("beforeinput", (e) => {
    let cursorStart = e.target.selectionStart;
    let cursorEnd = e.target.selectionEnd;
    const hasSelection = cursorStart !== cursorEnd;     // Multiple digits selected

    e.preventDefault();

    // If backspace
    if (e.inputType === "deleteContentBackward") {
        if (hasSelection) {
            replaceDigitsWithin(cursorStart, cursorEnd, 0);
            setCursor(cursorEnd);
        }
        else {
            cursorStart = getPreviousEditablePosition(cursorStart);
            replaceDigitAt(cursorStart, 0);
            setCursor(cursorStart);
        }
    }

    // If numeric key
    if (isNumeric(e.data)) {
        if (hasSelection) {
            replaceDigitsWithin(cursorStart, cursorEnd, e.data);
            setCursor(cursorEnd);
        }
        else {
            if (cursorStart != timerValue.value.length) {
                cursorStart = getNextEditablePosition(cursorStart);
                replaceDigitAt(cursorStart, e.data.toString());
                setCursor(cursorStart + 1);
            }
        }
    }
})

function convertToSeconds(timeString) {
    let timeParts = timeString.split(':');
    let minutes = parseInt(timeParts[0]);
    let seconds = parseInt(timeParts[1]);
    return minutes * 60 + seconds;
}

function convertToTimeString(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2,'0')}`;
}

function isNumeric(input) {
    return !isNaN(parseFloat(input)) && isFinite(input);
}

function getNextEditablePosition(position) {
    let colonIndex = timerValue.value.indexOf(":");

    if (colonIndex === position) {
        position++;
    }

    return position;
}

function getPreviousEditablePosition(position) {
    let colonIndex = timerValue.value.indexOf(":");

    if (colonIndex === position - 1) {
        position--;
    }
    
    if (position === 0) {
        return position;
    }
    else {
        return position - 1;   
    }
}

function setCursor(position) {
    timerValue.setSelectionRange(position, position);
}

function replaceDigitAt(position, digit) {
    timerValue.value = timerValue.value.slice(0, position) + digit + timerValue.value.slice(position + 1);
}

function replaceDigitsWithin(start, end, digit) {
    let colonIndex = timerValue.value.indexOf(":");

    for (let i = start; i < end; i++) {
        if (i === colonIndex) {
            continue;
        }
        replaceDigitAt(i, digit);
    }
}