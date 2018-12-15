/*
 * Create a list that holds all of your cards
 */

/* Add flexbox attributes to the list of cards and based on the shuffle order
 * generate the html.
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * @description this logs the time and injects it into the html
 */
 let totalSeconds = 0;
function displayTime() {
	let totalTime = performance.now() - startTime;
	totalSeconds = Math.round(totalTime / 1000);
	document.querySelector('.time').innerHTML = `Time (s): &emsp;${totalSeconds}`;
	if (time == true) {
		setTimeout(displayTime, 1000);
	} else {
		startTime = 0;
		totalSeconds = 0;
		document.querySelector('.time').innerHTML = `Time (s): &emsp;${totalSeconds}`;
	}
}


let time = false;
let clicks = 0;
let startTime = 0;
let totalMoves = 0;
let card1;
let card2;
let winTime = 0;

/**
 * @description Shuffles all of the cards and changes the order of the elements being displayed.
 */
function generateNewPattern() {
	const numCards = [0, 1, 2, 3,
					  4, 5, 6, 7,
					  8, 9, 10, 11,
					  12, 13, 14, 15]
	let allCards = document.querySelectorAll('.card');
	const shuffledNums = shuffle(numCards);
	for (let card = 0; card < shuffledNums.length; card++) {
		allCards[card].style.order = String(shuffledNums[card]);
	}
}


function win() {
	window.location.href = "win.html";
}


/**
 * @description This function closes all of the cards if they are open.
 */
function closeAllCards() {
	let allCards = document.querySelectorAll('.card');
	for (let card of allCards) {
		if (card.classList.contains('open')) {
			card.classList.remove('open', 'show', 'match');
		}
	}
}


/**
 * @description This function determines if two cards are a pair, it does this by matching their classNames of the 'i' element.
 * @param {element} card1
 * @param {element} card2
 * @returns {boolean} true if they are a match and false if they are not a match
 */

function determineEquality(card1, card2) {
	// determines if two cards are a pair
	let firstCard = card1.querySelector('i');
	let secondCard = card2.querySelector('i');
	if (firstCard.className == secondCard.className) {
		return true;
	} else {
		return false;
	}
}


/**
 * @description Checks if the current board is a win, if it is not then return false,
 * else return true and the game lauches the wining message.
 * @return {boolean}
 */
function checkWin() {
	const allCards = document.querySelectorAll('.card');
	for (let card of allCards) {
		if (!card.classList.contains('match')) {
			return false;
		}
	}
	// console.log("you won!");
	return true;
}


/**
 * @description Resets the board as well as closes all of the cards.
 */
function resetAll() {
	let moves = document.querySelector('.moves');
	moves.textContent = 0;
	clicks = 0;
	totalMoves = 0;
	startTime = 0;
	time = false;
	totalSeconds = 0;
	totalTime = 0;
	document.querySelector('.time').innerHTML = 'Time (s): &emsp;0';
	// return the style of the stars back
	document.getElementById('star3').style.opacity = 1;
	document.getElementById('star2').style.opacity = 1;
	generateNewPattern();
	closeAllCards();
}


/**
 * @description "Opens" the card.
 * @param {event}
 * @return {number} 1 for opened, and 0 for already opened.
 */
function clickCard(event) {
	if (event.target.classList.contains('show')) {
		return 0;
	}
	event.target.classList.add('open', 'show');
	return 1;
}


/**
 * @description Adds an "incorrect" style on the card.
 * @param {element} card1
 * @param {element} card2
 */
function incorrectCard(card1, card2) {
	card1.classList.add('incorrect');
	card2.classList.add('incorrect');
	setTimeout(function () {
		card1.classList.remove('incorrect', 'show', 'open');
		card2.classList.remove('incorrect', 'show', 'open');
	}, 400)
}


/**
 * @description Adds a "correct" style on the card.
 * @param {element} card1
 * @param {element} card2
 */
function correctCard(card1, card2) {
	card1.classList.add('match');
	card2.classList.add('match');
}


/**
 * @description evaulates each move to test whether it is a match, and applies to correct style to it.
 * @param {event} event
 */
function move(event) {
	if (clicks === 0) {
		startTime = performance.now();
		time = true;
		displayTime();
	}
	console.log(event.target);
	if (clickCard(event) === 1) {
		clicks += 1;
		if (clicks % 2 === 0) {
			// update the total number of moves and updates the stars
			totalMoves += 1;
			document.querySelector('.moves').textContent = totalMoves;
			updateStars(totalMoves);

			card2 = event.target;
			if (!determineEquality(card1, card2)) {
				incorrectCard(card1, card2);
			} else {
				correctCard(card1, card2);
			}
		} else if (clicks % 2 === 1) {
			card1 = event.target;
			}
		}
	if (checkWin()) {
		console.log(totalSeconds);
		localStorage.setItem("moves", totalMoves);
		localStorage.setItem("winTime", totalSeconds);
		totalSeconds = 0;
		totalTime = 0;
		startTime = 0;
		win();
	}
}


/**
 * @description Updates the stars based on the amount of totalMoves made:
 * 3 stars: < 8 totalMoves
 * 2 stars: > 8 totalMoves, < 12 totalMoves
 * 1 star: > 20 totalMoves
 */
function updateStars(moves) {
	// console.log(totalMoves);
	if (moves <= 12 && moves > 8) {
		document.getElementById('star3').style.opacity = 0.3;
	} else if (moves >= 20) {
		document.getElementById('star3').style.opacity = 0.3;
		document.getElementById('star2').style.opacity = 0.3;
	}
}

let url = window.location.pathname;
let documentName = url.substring(url.lastIndexOf('/') + 1);
if (document.querySelector('.restart') != null) {
	const reset = document.querySelector('.restart');
	reset.addEventListener('click', resetAll)

	const allCards = document.querySelectorAll('.card');

	for (let i = 0; i < allCards.length; i++) {
		allCards[i].addEventListener('click', move);
	}
} else {
	let totalMoves = Number(localStorage.getItem("moves"));
	console.log(typeof totalMoves);
	console.log(totalMoves);
	updateStars(totalMoves);
	let timeElement = document.getElementById('time');
	timeElement.innerHTML = "Time Taken(s): &emsp;" + localStorage.getItem("winTime");
	let scoreElement = document.getElementById('score');
	scoreElement.innerHTML = "Moves: &emsp;" + localStorage.getItem("moves")

}



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
