/**
 * Plocka ut ett random ord
 * Skapa listitems för varje bokstav i det ordet
 * Starta en timer
 * När användaren klickar på en tangent:
 * 1. Kolla ifall det är en bokstav
 * 2. Gör om till lower case så att det inte spelar någon roll
 * 3. Pusha bokstaven till en array och skriv ut denna på skärmen
 * 3. Kolla ifall användaren redan har skrivit in bokstaven
 * 4. Jämför bokstaven med bokstäverna i det korrekta ordet
 * 5. Räkna antal fel och skriv ut på skärmen hur många gissningar användaren har kvar
 * 6. Visa ny klass på "gubben" varje gång en bokstav är fel
 * 7. Är bokstaven rätt skriv ut den på rätt ställe
 * 8. Kolla ifall ordet som bildas av bokstäverna användaren har haft rätt på = det korrekta ordet
 * 9. Visa isåfall slutbilden
 * 10. När 5 felaktiga gissningar är gjorda, visa slutbilden
 * 11. När 60 sekunder har gått utan att användaren gissat rätt, visa slutbilden
 * 12. Nollställ alla variabler och arrayer när spelet tagit slut.
 */

let letters = [];
let correctWord = '';
let correctWordArray = ['mellanmjölk', 'äpple', 'apelsin', 'banan', 'stjärna', 'vodka', 'kaffe', 'havregryn'];
let seconds = 60;
let correctWordElem = document.querySelector('#correct-word');
let wrongAnswer = 0;

randomizeWord();
createListOfCorrectLetters();

function randomizeWord() {
    var randomNumber = Math.floor(Math.random() * correctWordArray.length);
    correctWord = correctWordArray[randomNumber];
}

//Create an empty list with the same amount of list items as the correct word
function createListOfCorrectLetters() {
    for (letter of correctWord) {
        let listItem = document.createElement('li');
        correctWordElem.append(listItem);
    }
}

window.addEventListener('keyup', function(event) {
    //Look for only letters.
    const lastLetters = ['å', 'ä', 'ö'];
    //Put all letters to lower case.
    let letter = event.key.toLowerCase();

    if (event.keyCode > 64 && event.keyCode < 91) {
        checkIfGuessed(letter);
    } else if (lastLetters.includes(letter)) {
        checkIfGuessed(letter);
    } else {
        document.querySelector('#info-text').innerHTML = 'That wasn´t a letter. Try again.';
    }
});

//Check if the user already tried the letter
function checkIfGuessed(newLetter) {
    if (letters.includes(newLetter)) {
        document.querySelector('#info-text').innerHTML = 'You already tried that one';
    } else {
        letters.push(newLetter);
        checkLetter(newLetter);
    }
    showAllLetters();
}

function showAllLetters() {
    document.querySelector('#guessed-letters').innerHTML = '';
    //Display guessed letters
    for (letter of letters) {
        document.querySelector('#guessed-letters').innerHTML += letter;
    }
}

function checkLetter(letter) {
    //Check if the letter is included in the correct word and what position it has
    if (correctWord.includes(letter)) {
        //If the letter appears more than once display all instances of it
        for (var i = 0; i < correctWord.length; i++) {
            if (correctWord.charAt(i) == letter) {
                displayLetterOfWord(i, letter);
            }
        }
    } else {
        //Make sure number of wrong answers don´t exceed 5
        if (wrongAnswer != 5) {
            wrongAnswer++;
        }
        hangTheDude();
    }
    //Display number of guesses left
    let word = 'guesses';
    if (wrongAnswer == 4) {
        word = 'guess';
    }
    document.querySelector('#info-text').innerHTML = 5 - wrongAnswer + ' wrong ' + word + ' left';
}

function displayLetterOfWord(position, letter) {
    let listItem = correctWordElem.getElementsByTagName('li');
    //Put the letter in the correct position
    listItem[position].innerHTML = letter;
    let wordToCheck = '';

    //Go through the list items and add the letter to the control word
    for (var i = 0; i < listItem.length; i++) {
        wordToCheck += listItem[i].innerHTML;
    }
    checkIfCorrect(wordToCheck);
}

function checkIfCorrect(wordToCheck) {
    //Compare the control word with the correct word
    if (wordToCheck == correctWord) {
        setTimeout(function() {
            clearInterval(countDown);
            displayEnd(true);
        }, 1000);
    }
}

function hangTheDude() {
    if (wrongAnswer == 1) {
        document.querySelector('figure').classList.add('scaffold');
    } else if (wrongAnswer == 2) {
        document.querySelector('figure').classList.add('head');
    } else if (wrongAnswer == 3) {
        document.querySelector('figure').classList.add('body');
    } else if (wrongAnswer == 4) {
        document.querySelector('figure').classList.add('arms');
    } else {
        document.querySelector('figure').classList.add('legs');
        setTimeout(function() {
            clearInterval(countDown);
            displayEnd(false);
        }, 1000);
    }
}

function displayEnd(isWinner) {
    document.querySelector('.overlay').style.display = 'flex';

    if (isWinner) {
        document.querySelector('#result').innerHTML = 'Congrats! You won!';
    } else {
        document.querySelector('#result').innerHTML = 'Nooo! You lost.';
    }
    document.querySelector('.correct-word').innerHTML = 'The correct word was: ' + correctWord;
}

document.querySelector('#yes-btn').addEventListener('click', function() {
    document.querySelector('.overlay').style.display = 'none';
    resetGame();
});

document.querySelector('#no-btn').addEventListener('click', function() {
    document.querySelector('#question').innerHTML = 'Ok then bye bye!';
});

function resetGame() {
    seconds = 60;
    document.querySelector('#counter').innerHTML = '<b>' + seconds-- + '</b> seconds left';
    countDown = setInterval(counter, 1000);
    letters = [];
    wrongAnswer = 0;
    document.querySelector('#guessed-letters').innerHTML = '';
    document.querySelector('#counter').classList = '.';
    document.querySelector('figure').classList = '';
    correctWordElem.innerHTML = '';
    document.querySelector('#info-text').innerHTML = 'Start to play Hangman by pressing a letter';
    randomizeWord();
    createListOfCorrectLetters();
}

//Set a timer and a display. When it reaches 0 display the end
let countDown = setInterval(counter, 1000);

function counter() {
    if (seconds < 4) {
        document.querySelector('#counter').classList.add('warning');
    }
    if (seconds == 0) {
        clearInterval(countDown);
        displayEnd(false);
    }
    document.querySelector('#counter').innerHTML = '<b>' + seconds-- + '</b> seconds left';
}