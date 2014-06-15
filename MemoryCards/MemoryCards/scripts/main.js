/// <reference path="_references.js" />

var stage = new Kinetic.Stage({
    container: 'container',
    width: 800,
    height: 600
});

//creates the menu
var layerOfMenu = new Kinetic.Layer();
layerOfMenu.setWidth(800);
layerOfMenu.setHeight(600);

// creates the canvas
var layerOfGame = new Kinetic.Layer();
layerOfGame.setWidth(800);
layerOfGame.setHeight(600);

// When the time is out - game over
var layerEndGame = new Kinetic.Layer();
layerEndGame.setWidth(800);
layerEndGame.setHeight(600);
var endGameText = renderText('Timeout! Game over!', 'French Script MT', 80, 210, 50, 'red');
layerEndGame.add(endGameText);
layerEndGame.visible(false);

var layerOffset = 10,
    rows = 4,
    cols = 4,
    cardOffset = 10,
// if we want cards to be floated left
    initialXOffset = (cardOffset + layerOffset) * 2,
    initialYOffset = (cardOffset + layerOffset) * 2;
// if we want cards to be centered
// var initialXOffset = (layerOfGame.getWidth() - cols * Card.DIMENSION.width - cols * cardOffset) / 2;
// var initialYOffset = (layerOfGame.getHeight() - rows * Card.DIMENSION.height - rows * cardOffset) / 2;

//creating cards
var inGameMode = false,
    cards,
    currentScore = 0,
    win = false;

initializeMenu();

// draw field
function initializeField() {
    // if it is clicked new game without closing highscore
    highscore.removeFromDom();

    var rect = new Kinetic.Rect({
        x: layerOffset,
        y: layerOffset,
        width: layerOfGame.getWidth() - layerOffset * 2,
        height: layerOfGame.getHeight() - layerOffset * 2,
        visible: true,
        fill: 'transparent'
    });

    layerOfGame.add(rect);
    //layerOfGame.draw();

    inGameMode = true;
    currentScore = 0;
    win = false;

    cards = createCards(rows, cols);
    for (var i = 0; i < cards.length; i++) {
        cards[i].draw(layerOfGame);
    }

    timer.start();
}

var current = [];

layerOfGame.on('mousedown', function (ev) {
    if (inGameMode) {

        var fx = ev.evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        var fy = ev.evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;

        for (var i = 0; i < cards.length; i++) {

            if (!cards[i].isTurned &&
                !cards[i].isFinished &&
                cards[i].isInBounds(fx, fy)) {
                if (current.length < 2) { // We don't want to turn more than 2 cards at the same time
                    cards[i].setTurned();
                    current.push(cards[i]);
                }
                break;
            }
        }

        if (current.length == 2) {
            setTimeout(function () {

                if (current[0] && current[1] &&
                    current[0].id == current[1].id) {
                    current[0].finish();
                    current[1].finish();
                    currentScore += 2;

                    if (timer.elapsedTime >= 2) {
                        timer.elapsedTime -= 2;
                    }
                }

                for (var i = 0; i < cards.length; i++) {

                    if (cards[i].isTurned) {

                        cards[i].isTurned = false;
                        cards[i].animationStage.isAnim = true;
                    }
                }
                current = new Array();
            }, 750); // Additional 250ms added for animation
        }
    }
});

// animation frame
var anim = new Kinetic.Animation(function (frame) {

    if (win) {
        anim.stop();
        inGameMode = false;
        var bonusTimeScore = (60 - timer.elapsedTime) * 5;
        timer.stop();
        highscore.addUser(prompt('You just get ' + (currentScore + bonusTimeScore) + ' scores. Enter your name:'), currentScore + bonusTimeScore);
        layerOfGame.destroyChildren();
        layerOfMenu.visible(true);
        layerOfMenu.draw();
        return;
    }

    for (var i = 0; i < cards.length; i++) {

        cards[i].draw(layerOfGame);
    }

    win = isWin();
    if (timer.elapsedTime > 60) {
        anim.stop();
        inGameMode = false;
        layerOfGame.destroyChildren();

        layerEndGame.visible(true);
        layerEndGame.draw();
        layerOfGame.visible(false);
        setTimeout(function () {
                  layerOfMenu.visible(true);
            layerOfMenu.draw();
            layerEndGame.visible(false);
        }, 5000);

        return;
    }

}, layerOfGame);

var isWin = function () {

    for (var i = 0; i < cards.length; i++) {

        if (!cards[i].isFinished) {

            return false;
        }
    }

    return true;
}

stage.add(layerOfMenu);
stage.add(layerOfGame);
stage.add(layerEndGame)