function Card(frontFace, backFace, position) {

    this.frontFace = frontFace;
    this.backFace = backFace;
    this.position = position;
    this.isTurned = false;
    this.kineticObj = undefined;
    this.isFinished = false;

}

Card.DIMENSION = { width: 80, height: 100 }

Card.prototype.setTurned = function () {

    if (!this.isFinished) {

        this.isTurned = true;

    }

}

Card.prototype.finish = function () {

    this.isFinished = true;

}

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