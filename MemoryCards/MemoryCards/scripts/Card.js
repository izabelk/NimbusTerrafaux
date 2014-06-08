/// <reference path="_references.js" />

// card images
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
    this.kineticImage = undefined;
    this.cardShapeKineticObj = undefined;
    this.isFinished = false;

}

Card.DIMENSION = { width: 80, height: 100 }

var cardShape = new Kinetic.Rect({
    width: Card.DIMENSION.width,
    height: Card.DIMENSION.height,
    fill: 'none',
    stroke: 'blue',
    strokeWidth: 3
});

Card.prototype.setTurned = function () {

    if (!this.isFinished) {

        this.isTurned = true;

    }

}

Card.prototype.finish = function () {

    this.isFinished = true;

}

Card.prototype.draw = function (layer) {
    if (!this.kineticImage) {

        this.kineticImage = new Kinetic.Image({
            x: this.position.x,
            y: this.position.y,
            image: this.isTurned ? this.frontFace : this.backFace,
            width: Card.DIMENSION.width,
            height: Card.DIMENSION.height,
        });

        this.cardShapeKineticObj = new Kinetic.Rect({
            x: this.position.x,
            y: this.position.y,
            width: Card.DIMENSION.width,
            height: Card.DIMENSION.height,
            fill: 'none',
            stroke: 'blue',
            strokeWidth: 3
        });

        layer.add(this.cardShapeKineticObj);
        layer.add(this.kineticImage);

    } else {

        if (this.isFinished) {

            this.kineticImage.setImage(this.frontFace);

        } else {

            this.kineticImage.setImage(this.isTurned ? this.frontFace : this.backFace);

        }

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