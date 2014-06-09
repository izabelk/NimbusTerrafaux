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

// create the canvas
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
    shuffle(cards);
    return cards;
}

function shuffle(array) {
    var length = array.length;
    for (var i = 0; i < length; i++) {
        var pos = getRandomInt(0, length);
        swap(pos);
    }

    function swap(pos) {
        var value = array[0];
        array[0] = array[pos];
        array[pos] = value;
    }
}

var cards = createCards(rows, cols);

(function initializeMenu() {

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
        fontSize: 60,
        x: 240,
        y: 50,
        fill: '#3538FF'
    });

    var subTitle = new Kinetic.Text({
        text: 'by Nimbus Terrafaux',
        fontFamily: 'French Script MT',
        fontSize: 40,
        x: 380,
        y: 110,
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

})();

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

    for (var i = 0; i < cards.length; i++) {
        cards[i].draw(layerOfGame);
    }
}

var current = [];

// click on card
//<<<<<<< HEAD
//layerOfGame.on('click', function (ev) {

//=======
layerOfGame.on('click', function (ev) {
//>>>>>>> 7f3f5358d63aa67308d78713478d5efc57f93c30
    var fx = ev.evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    var fy = ev.evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;

    for (var i = 0; i < cards.length; i++) {
        if (cards[i].isInBounds(fx, fy)) {
            if (current.length < 2) {
                cards[i].setTurned();
                current.push(cards[i]);                
            }
        }
    }

    if (current.length == 2) {
        setTimeout(function () {
            if (current[0].id == current[1].id) {
                current[0].finish();
                current[1].finish();
            }
            for (var i = 0; i < cards.length; i++) {
                cards[i].isTurned = false;
            }
            current = new Array();
        }, 100);
    }
});

// animation frame
var anim = new Kinetic.Animation(function (frame) {
    for (var i = 0; i < cards.length; i++) {

        cards[i].draw(layerOfGame);
    }

}, layerOfGame);

//anim.start();

stage.add(layerOfMenu);
stage.add(layerOfGame);
