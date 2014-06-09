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

function createCards(rows, cols) {

    var cards = [],
        numberOfCouples = (rows * cols) / 2,
        cardFronts = getCurrentGameCardFronts(numberOfCouples);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var pos = {
                x: initialXOffset + j * Card.DIMENSION.width + cardOffset * j,
                y: initialYOffset + i * Card.DIMENSION.height + cardOffset * i
            }
            var cardNumber = i * cols + j,
                id = cardNumber % numberOfCouples;
            var faces = loadCardFaces(cardFronts[id], 'imgs/Nimbus_terrafaux_mk.jpg');
            cards.push(new Card(faces.frontFace, faces.backFace, pos, id));            
        }
    }
    shuffleFrontImages(cards);
    return cards;
}

function shuffleFrontImages(array) {
    var length = array.length;
    for (var i = 0; i < length; i++) {
        var pos = getRandomInt(0, length);
        swap(pos);
    }

    function swap(pos) {
        var img = array[0].frontFace;
        array[0].frontFace = array[pos].frontFace;
        array[pos].frontFace = img;
        var id = array[0].id;
        array[0].id = array[pos].id;
        array[pos].id = id;
    }
}

var cards = createCards(rows, cols);
var currentScore = 0;
var win = false;


function initializeMenu() {

    var rect = new Kinetic.Rect({
        x: layerOffset,
        y: layerOffset,
        width: layerOfMenu.getWidth() - layerOffset * 2,
        height: layerOfMenu.getHeight() - layerOffset * 2,
        visible: true,
        fill: '#B5FFDE',
        stroke: '#51A5FF',
        strokeWidth: 4,
        cornerRadius: 10
    });

    var title = new Kinetic.Text({
        text: 'Memory Cards',
        fontFamily: 'French Script MT',
        fontSize: 80,
        x: 240,
        y: 50,
        fill: '#3538FF'
    });

    var subTitle = new Kinetic.Text({
        text: 'by Nimbus Terrafaux',
        fontFamily: 'French Script MT',
        fontSize: 40,
        x: 400,
        y: 120,
        fill: '#3538FF'
    });

    var newGameRectVisible = new Kinetic.Rect({
        x: 250,
        y: 230,
        width: 200,
        height: 50,
        stroke: '#3538FF',
        fill: '',
        cornerRadius: 10
    });

    var invisibleRectNewGame = new Kinetic.Rect({
        x: 250,
        y: 230,
        width: 200,
        height: 50,
        opacity: 0,
        cornerRadius: 10
    });

    var newGameText = new Kinetic.Text({
        text: 'New Game',
        fontFamily: 'Arial',
        fontSize: 20,
        x: 300,
        y: 245,
        fill: '#3538FF'
    });

    invisibleRectNewGame.on('mouseover', function () {
        newGameRectVisible.fill('#CCFFFF');
        layerOfMenu.draw();
    });

    invisibleRectNewGame.on('mouseout', function () {
        newGameRectVisible.fill('#B5FFDE');
        layerOfMenu.draw();
    });

    invisibleRectNewGame.on('click', function () {
        layerOfGame.visible(true);
        layerOfMenu.visible(false);
        initializeField();
        anim.start();
    });

    var highScoresRectVisible = new Kinetic.Rect({
        x: 250,
        y: 290,
        width: 200,
        height: 50,
        stroke: '#3538FF',
        fill: '',
        cornerRadius: 10
    });

    var highScoresText = new Kinetic.Text({
        text: 'High Scores',
        fontFamily: 'Arial',
        fontSize: 20,
        x: 300,
        y: 305,
        fill: '#3538FF'
    });




    var invisibleRectScores = new Kinetic.Rect({
        x: 250,
        y: 290,
        width: 200,
        height: 50,
        opacity: 0,
        cornerRadius: 10
    });

    invisibleRectScores.on('click', function () {
        var ranking = document.querySelector('ol');

        if (ranking === null) {
            highscore.show();
        }
        else {
            ranking.parentNode.removeChild(ranking);
        }       
    });

    invisibleRectScores.on('mouseover', function () {
        highScoresRectVisible.fill('#CCFFFF');
        layerOfMenu.draw();
    });

    invisibleRectScores.on('mouseout', function () {
        highScoresRectVisible.fill('#B5FFDE');
        layerOfMenu.draw();
    });

    layerOfMenu.add(rect);
    layerOfMenu.add(title);
    layerOfMenu.add(subTitle);
    layerOfMenu.add(newGameRectVisible);
    layerOfMenu.add(newGameText);
    layerOfMenu.add(invisibleRectNewGame);
    layerOfMenu.add(highScoresRectVisible);
    layerOfMenu.add(highScoresText);
    layerOfMenu.add(invisibleRectScores);

};
initializeMenu();

// draw field
function initializeField() {
    var rect = new Kinetic.Rect({
        x: layerOffset,
        y: layerOffset,
        width: layerOfGame.getWidth() - layerOffset * 2,
        height: layerOfGame.getHeight() - layerOffset * 2,
        visible : true,
        fill: 'lightblue',
        stroke: 'black',
        strokeWidth: 4
    }); // Create table

    layerOfGame.add(rect);
    //layerOfGame.draw();

    currentScore = 0;
    win = false;

    for (var i = 0; i < cards.length; i++) {
        cards[i].draw(layerOfGame);
    }
}

var current = [];

layerOfGame.on('click', function (ev) {

    var fx = ev.evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    var fy = ev.evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;

    for (var i = 0; i < cards.length; i++) {

        if (!cards[i].isTurned &&
            !cards[i].isFinished &&
            cards[i].isInBounds(fx, fy)) {

            cards[i].setTurned();
            current.push(cards[i]);
            break;
        }
    }

    if (current.length == 2) {
        setTimeout(function () {

            if (current[0].id == current[1].id) {
                current[0].finish();
                current[1].finish();
                currentScore += 2;
            }

            for (var i = 0; i < cards.length; i++) {
                cards[i].isTurned = false;
            }

            current = new Array();
        }, 500);
    }
});

// animation frame
var anim = new Kinetic.Animation(function (frame) {

    if (win) {

        anim.stop();
        highscore.addUser(prompt('You just get ' + currentScore + ' scores. Enter your name:'), currentScore);
        layerOfGame.visible(false);
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
