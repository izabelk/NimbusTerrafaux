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


var layerOffset = 10;
var rows = 4;
var cols = 4;
var cardOffset = 10;
// if we want cards to be floated left
var initialXOffset = (cardOffset + layerOffset) * 2;
var initialYOffset = (cardOffset + layerOffset) * 2;
// if we want cards to be centered
// var initialXOffset = (layerOfGame.getWidth() - cols * Card.DIMENSION.width - cols * cardOffset) / 2;
// var initialYOffset = (layerOfGame.getHeight() - rows * Card.DIMENSION.height - rows * cardOffset) / 2;

//creating cards
var inGameMode = false;
var cards;
var currentScore = 0;
var win = false;

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
        visible : true,
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
    timer.positionX = 245;
    timer.positionY = 500;
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
        highscore.addUser(prompt('You just get ' + currentScore + ' scores. Enter your name:'), currentScore);
        layerOfGame.destroyChildren();
        layerOfMenu.visible(true);
        layerOfMenu.draw();
        return;
    }

    for (var i = 0; i < cards.length; i++) {

        cards[i].draw(layerOfGame);
    }

    win = isWin();

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
