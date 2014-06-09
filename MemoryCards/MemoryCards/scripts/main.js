/// <reference path="_references.js" />

var stage = new Kinetic.Stage({
    container: 'container',
    width: 800,
    height: 600
});

// create the canvas
var layer = new Kinetic.Layer();
layer.setWidth(800);
layer.setHeight(600);
var layerOffset = 10;

var rows = 4;
var cols = 4;
var cardOffset = 10;
// if we want cards to be floated left
var initialXOffset = (cardOffset + layerOffset) * 2;
var initialYOffset = (cardOffset + layerOffset) * 2;
// if we want cards to be centered
// var initialXOffset = (layer.getWidth() - cols * Card.DIMENSION.width - cols * cardOffset) / 2;
// var initialYOffset = (layer.getHeight() - rows * Card.DIMENSION.height - rows * cardOffset) / 2;

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
            var cardNumber = i * cols + j;
            var faces = loadCardFaces(cardFronts[cardNumber % numberOfCouples], 'imgs/Nimbus_terrafaux_mk.jpg');
            cards.push(new Card(faces.frontFace, faces.backFace, pos));
        }
    }
    shuffle(cards);
    return cards;
}

function shuffle(array) { }


var cards = createCards(rows, cols);

// draw field
(function initialize() {
    var rect = new Kinetic.Rect({
        x: layerOffset,
        y: layerOffset,
        width: layer.getWidth() - layerOffset * 2,
        height: layer.getHeight() - layerOffset * 2,
        fill: 'lightblue',
        stroke: 'black',
        strokeWidth: 4
    }); // Create table

    layer.add(rect);

    for (var i = 0; i < cards.length; i++) {
        cards[i].draw(layer);
    }
})();

var current = [];

// click on card
layer.on('click', function (ev) {

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

            /*if (current[0].backFaces == current[1].backFaces) {

                current[0].finish();
                current[1].finish();

            }*/

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

        cards[i].draw(layer);
    }

}, layer);

anim.start();

stage.add(layer);