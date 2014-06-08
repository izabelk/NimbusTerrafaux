var faces = (function () {

    function loadImage(src) { // it is something like private method
        var imageObj = new Image();
        imageObj.src = src;
        return imageObj;
    }

    return {
        frontFaces: [loadImage("imgs/images.jpg")],
        backFaces: [loadImage("imgs/Nimbus_terrafaux_mk.jpg")]
    }

})();

function loadCardFaces(faces) {



}

function Card(frontFace, backFace, position) {

    this.frontFace = frontFace;
    this.backFace = backFace;
    this.position = position;
    this.isTurned = false;
    this.kineticObj = undefined;

}
Card.DIMENSION = { width: 80, height: 100 }

Card.prototype.draw = function (layer) {
    if (!this.kineticObj) {
        this.kineticObj = new Kinetic.Image({
            x: this.position.x,
            y: this.position.y,
            image: this.isTurned ? this.frontFace : this.backFace,
            width: Card.DIMENSION.width,
            height: Card.DIMENSION.height
        });

        layer.add(this.kineticObj);

    } else {

        this.kineticObj.setImage(this.isTurned ? this.frontFace : this.backFace);

    }
}

Card.prototype.isInBounds = function (x, y) {

    function inRange(range, comp) {
        return range.low < comp && comp < range.high;
    }

    return inRange({
        low: this.position.x,
        high: this.position.x + Card.DIMENSION.width
    }, x)
        &&
        inRange({
            low: this.position.y,
            high: this.position.y + Card.DIMENSION.height
        }, y);

}

var stage = new Kinetic.Stage({
    container: 'container',
    width: 800,
    height: 600
});

var layer = new Kinetic.Layer(); // Create the canvas
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

var anim = new Kinetic.Animation(function (frame) {
    for (var i = 0; i < cards.length; i++) {

        cards[i].draw(layer);

    }

}, layer);

anim.start();

stage.add(layer);