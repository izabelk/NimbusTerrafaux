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
var cardOffset = 20;
var initialXOffset = (layer.getWidth() - cols * Card.DIMENSION.width - cols * cardOffset) / 2;
var initialYOffset = (layer.getHeight() - rows * Card.DIMENSION.height - rows * cardOffset) / 2; // Just for clarity

function createCards() {

    var arr = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {

            var pos = {
                x: initialXOffset + j * Card.DIMENSION.width + cardOffset * j,
                y: initialYOffset + i * Card.DIMENSION.height + cardOffset * i
            }
            arr.push(new Card(faces.frontFaces[0], faces.backFaces[0], pos));
        }
    }
    return arr;
}

var cards = createCards();

// draw field
(function initialize() {
    var rect = new Kinetic.Rect({
        x: layerOffset,
        y: layerOffset,
        width: layer.getWidth() - layerOffset * 2,
        height: layer.getHeight() - layerOffset * 2,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4
    }); // Create table

    layer.add(rect);

    for (var i = 0; i < cards.length; i++) {
        cards[i].draw(layer);
    }
})();

// click on card
layer.on('click', function (ev) {

    var x = ev.evt.clientX;
    var y = ev.evt.clientY;
    var fx = ev.evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    var fy = ev.evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;

    for (var i = 0; i < cards.length; i++) {
        if (cards[i].isInBounds(fx, fy)) {
            cards[i].isTurned = !cards[i].isTurned;
        }
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