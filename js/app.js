/*
 * Create a list that holds all of your cards
 */

var listOfObjects, rObject;
var firstOpenedCard, clickCounter, moveCounter, moves;


function startGame(){
    initElements();
    activateClick();
}

function restartGame(){      
    var newGameHTML = "", cardName, i;
    var order = [];

    for (i = 0; i < listOfObjects.length; i++){
        order.push(i);
    }
    order = shuffle(order);

    for (i = 0; i < listOfObjects.length; i++) { 
        cardName = getCardName(listOfObjects[order[i]]);       
        newGameHTML += "<li class='card'> <i class='"+ cardName + "'></i> </li>";
    }
    var deck = document.getElementsByClassName("deck")[0];
    deck.innerHTML = newGameHTML;
    
    startGame();
}

function initElements(){
    firstOpenedCard = null;
    clickCounter = 2;
    moveCounter = 0;    
    listOfObjects = document.getElementsByClassName("card");
    moves = document.getElementsByClassName("moves")[0];
    rObject = document.getElementsByClassName("restart")[0];
    updateMoves();
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function updateMoves(){    
    moves.innerText = moveCounter;//moveCounter.toString();
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
function userClickedToCard(){    
    if ( beginCheckState() == false ){
        return;
    }

    if ( firstOpenedCard === this ){
        return;
    }

    clickCounter = clickCounter - 1;
    moveCounter++;
    updateMoves();
    var className = this.className;
    switch(className) {
        case "card":
            displayCard(this);                        
            if ( firstOpenedCard ){
                secondCardName = getCardName(this);
                if ( getCardName(firstOpenedCard) == secondCardName ){
                    matchStateFunc(firstOpenedCard, this);
                } else {
                    wrongMatchStateFunc(firstOpenedCard, this);
                }                
            } else {
                firstOpenedCard = this;
            }
               
            break;
        case "card show open":
            // do nothing
            break;
        default:
            // do nothing
    }
    
}


function displayCard(obj){
    obj.className = "card show open";
}

function getCardName(obj){
    return obj.getElementsByTagName("i")[0].className;
}

function setCardAsMatched(obj){
    obj.className = "card match";
}

function setCardDefault(obj){
    obj.className = "card";
}

function matchStateFunc(obj1, obj2){
    setCardAsMatched(obj1);
    setCardAsMatched(obj2);
    afterCheckState();
}

function wrongMatchStateFunc(obj1, obj2){
    setTimeout(function(){
        setCardDefault(obj1);
        setCardDefault(obj2);
        afterCheckState();
    }, 2000);
    
}

function beginCheckState(){
    var gameIsEnabled = true;

    if ( clickCounter <= 0 ){
        gameIsEnabled = false;
        deactivateClick();        
    } 
    return gameIsEnabled;
}
function afterCheckState(){
    firstOpenedCard = null;
    clickCounter = 2;
    activateClick();
}

function activateClick(){
    var i;
    for (i = 0; i < listOfObjects.length; i++) {
        listOfObjects[i].addEventListener("click", userClickedToCard);
    }
    if ( rObject )
        rObject.addEventListener("click", restartGame);
}

function deactivateClick(){
    var i;
    for (i = 0; i < listOfObjects.length; i++) {
        listOfObjects[i].removeEventListener("click", userClickedToCard);
    }
    if ( rObject)
        rObject.removeEventListener("click", restartGame);
}


function setCardDefaultAll(){
    var i;
    for (i = 0; i < listOfObjects.length; i++) {
        setCardDefault(listOfObjects[i]);
    }
}


startGame();