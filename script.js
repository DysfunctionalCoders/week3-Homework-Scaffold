const deckCards = ["Agility.png", "Agility.png", "Boat.png", "Boat.png", "Citizenship.png", "Citizenship.png", "Hack.png", "Hack.png", "Nerd-Rage.png", "Nerd-Rage.png", "Nuka-Cola.png", "Nuka-Cola.png", "Robotics.png", "Robotics.png", "Shock.png", "Shock.png"];

const deck = document.querySelector(".deck");
let opened = [];
let matched = [];
const modal = document.getElementById("modal");
const reset = document.querySelector(".reset-btn");
const playAgain = document.querySelector(".play-again-btn");
const movesCount = document.querySelector(".moves-counter");
let moves = 0;
const star = document.getElementById("star-rating").querySelectorAll(".star");
let starCount = 3;
const timeCounter = document.querySelector(".timer");
let time;
let minutes = 0;
let seconds = 0;
let timeStart = false;

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex --;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function startGame() {
  // Invoke shuffle function and store in variable
  const shuffledDeck = shuffle(deckCards);
  console.log(shuffledDeck);
  for (let i=0; i < shuffledDeck.length; i++) {
    let tdTag = document.createElement('td');
    tdTag.setAttribute('class', 'card');
    let addImage = document.createElement(`img`);
    tdTag.append(addImage);
    let fileName = `${shuffledDeck[i]}`;
    let imgAlt = fileName.split('.')[0];
    addImage.setAttribute('id', imgAlt);
    addImage.setAttribute('src', `./img/${fileName}`);
    addImage.setAttribute('alt', `Image of ${imgAlt}.`);
    deck.appendChild(tdTag)
  }
}

startGame();

function removeCard() {
  // As long as <ul> deck has a child node, remove it
  while (deck.hasChildNodes()) {
    deck.removeChild(deck.firstChild);
  }
}

function timer() {
  // Update the count every 1 second
  time = setInterval(function() {
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    // Update the timer in HTML with the time it takes the user to play the game
    timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Timer: " + minutes + " Mins " + seconds + " Secs" ;
  }, 1000);
}

function stopTime() {
  clearInterval(time);
}

function resetEverything() {
  // Stop time, reset the minutes and seconds update the time inner HTML
  stopTime();
  timeStart = false;
  seconds = 0;
  minutes = 0;
  timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Timer: 00:00";
  // Reset star count and the add the class back to show stars again
  star[1].firstElementChild.classList.add("fa-star");
  star[2].firstElementChild.classList.add("fa-star");
  starCount = 3;
  // Reset moves count and reset its inner HTML
  moves = 0;
  movesCount.innerHTML = 0;
  // Clear both arrays that hold the opened and matched cards
  matched = [];
  opened = [];
  // Clear the deck
  removeCard();
  // Create a new deck
  startGame();
}

function incrMovesCounter() {
  // Update the html for the moves counter
  movesCount.innerHTML ++;
  // Keep track of the number of moves for every pair checked
  moves ++;
}

function adjustStarRating() {
  if (moves === 14) {
    // First element child is the <i> within the <li>
    star[2].firstElementChild.classList.remove("fa-star");
    starCount--;
  }
  if (moves === 18) {
    star[1].firstElementChild.classList.remove("fa-star");
    starCount--;
  }
}

function compareTwo() {
  // When there are 2 cards in the opened array
  if (opened.length === 2) {
    // Disable any further mouse clicks on other cards
    if (opened[0].src === opened[1].src){
      console.log("It's a Match");
      displayMatchingCards();
    } else {
      console.log("No Match!");
      displayNotMatchingCards();
    }
  }
}

function displayMatchingCards() {
  /* Access the two cards in opened array and add
  the class of match to the imgages parent: the <li> tag
  */
  setTimeout(function() {
    // add the match class (Why are we adding it to the parentElement?)
      // the match class should make the img visible
    opened[0].parentElement.classList.add("match");
    opened[1].parentElement.classList.add("match");
    matched.push(opened[0]);
    matched.push(opened[1]);
    document.body.style.pointerEvents = "auto";
    checkIsGameFinished();
   
    // Clear the opened array
    opened = [];
  }, 600);
  // Call movesCounter to increment by one
  incrMovesCounter();
  adjustStarRating();
}

function displayNotMatchingCards() {
  /* After 700 miliseconds the two cards open will have
  the class of flip removed from the images parent element <li>*/
  setTimeout(function() {
    // Remove class flip on images parent element
    opened[0].parentElement.classList.remove("flip");
    opened[1].parentElement.classList.remove("flip");
    // Allow further mouse clicks on cards
    document.body.style.pointerEvents = "auto";
    // Remove the cards from opened array
    opened = [];
  }, 700);
  // Call movesCounter to increment by one
  incrMovesCounter();
  adjustStarRating();
}

function addStatsToModal() {
  // Access the modal content div
  const statsParent = document.querySelector(".modal-results");
  // Create three different paragraphs
  statsParent.getElementsByTagName('p');
  for (let i = 1; i <= 3; i++) {
    let statsElement = document.createElement('p');
    statsElement.setAttribute('class', 'stats');
    statsParent.appendChild(statsElement);
  }
  // Select all p tags with the class of stats and update the content
  let p = statsParent.querySelectorAll("p.stats");
  // Set the new <p> to have the content of stats (time, moves and star rating)
  let starDisplay = "";
  for (let s=0; s <= starCount; s++){
    starDisplay += `&#9733;`;
  }
  console.log(starDisplay);
  p[0].innerHTML = `Total Time: ${minutes} min ${seconds} sec`;
  p[1].innerHTML = `Total Moves: ${moves}`;
  p[2].innerHTML = `${starDisplay}`;
  p[2].setAttribute('style', 'color: gold');
}

// TODO: Implement the pseudocode
function displayModal() {
  let modalClose = document.getElementById("close");
  let modal = document.getElementById("modal");
  modal.setAttribute("style", "display:block");

// When the user clicks on the modalClose <span> (x), 
modalClose.onclick = function() {
    modal.style.display = "none";
    
};
// When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      
      if (event.target === modal) {
        // update modal style to display none
        modal.style.display = "none"
      }
  };
}

function checkIsGameFinished() {
  // there are 8 images total
  // if the matched array has 16 elements,
  console.log('Matched: ', matched.length);
  if (matched.length === 2) {
    stopTime();
    addStatsToModal();
    displayModal();
  }
}

// if a card is clicked
  // if timerStart is false
      // start timer
  // flip the card

deck.addEventListener("click", function(evt) {
  if (evt.target.nodeName === "TD") {
    // To console if I was clicking the correct element
    //console.log(evt.target.nodeName + " Was clicked");
    // Start the timer after the first click of one card
    // Executes the timer() function
    if (timeStart === false) {
      timeStart = true;
      timer();
    }
    // Call flipCard() function
    flipCard();
  }

  //Flip the card and display cards img
  function flipCard() {
    // When <li> is clicked add the class .flip to show img
    evt.target.classList.add("flip");
    // Call addToOpened() function
    addToOpened();
  }

  //Add the fliped cards to the empty array of opened
  function addToOpened() {
    /* If the opened array has zero or one other img push another
    img into the array so we can compare these two to be matched
    */
    if (opened.length === 0 || opened.length === 1) {
      // Push that img to opened array
      opened.push(evt.target.firstElementChild);
    }
    // Call compareTwo() function
    compareTwo();
  }
});

reset.addEventListener('click', resetEverything);

playAgain.addEventListener('click',function() {
  modal.style.display = "none";
  resetEverything();
});
