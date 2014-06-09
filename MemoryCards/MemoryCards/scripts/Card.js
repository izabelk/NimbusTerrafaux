/// <reference path="_references.js" />

// card images
var cardFronts = [
'imgs/cardFronts/Aland.ico',
'imgs/cardFronts/Andorra.ico',
'imgs/cardFronts/Bahrain.ico',
'imgs/cardFronts/Bangladesh.ico',
'imgs/cardFronts/Barbados.ico',
'imgs/cardFronts/Bonaire.ico',
'imgs/cardFronts/Brazil.ico',
'imgs/cardFronts/Bulgaria.ico',
'imgs/cardFronts/Canada.ico',
'imgs/cardFronts/Cascadia.ico',
'imgs/cardFronts/Denmark.ico',
'imgs/cardFronts/Ecuador.ico',
'imgs/cardFronts/Egypt.ico',
'imgs/cardFronts/England.ico',
'imgs/cardFronts/Faroe-islands.ico',
'imgs/cardFronts/Finland.ico',
'imgs/cardFronts/France.ico',
'imgs/cardFronts/Guernsey.ico',
'imgs/cardFronts/Guinea.ico',
'imgs/cardFronts/Guyana.ico',
'imgs/cardFronts/Haiti.ico',
'imgs/cardFronts/Honduras.ico',
'imgs/cardFronts/Hungary.ico',
'imgs/cardFronts/Iceland.ico',
'imgs/cardFronts/India.ico',
'imgs/cardFronts/Indonesia.ico',
'imgs/cardFronts/Iran.ico',
'imgs/cardFronts/Jamaica.ico',
'imgs/cardFronts/Japan.ico',
'imgs/cardFronts/Jersey.ico',
'imgs/cardFronts/Jordan.ico',
'imgs/cardFronts/Kazakhstan.ico',
'imgs/cardFronts/Laos.ico',
'imgs/cardFronts/Latvia.ico',
'imgs/cardFronts/Lebanon.ico',
'imgs/cardFronts/Lesotho.ico',
'imgs/cardFronts/Liechtenstein.ico',
'imgs/cardFronts/Mexico.ico',
'imgs/cardFronts/Moldova.ico',
'imgs/cardFronts/Mongolia.ico',
'imgs/cardFronts/Montenegro.ico',
'imgs/cardFronts/Myanmar.ico',
'imgs/cardFronts/Namibia.ico',
'imgs/cardFronts/Philippines.ico',
'imgs/cardFronts/Pitcairn.ico',
'imgs/cardFronts/Portugal.ico',
'imgs/cardFronts/Puerto-rico.ico',
'imgs/cardFronts/Qatar.ico',
'imgs/cardFronts/Romania.ico',
'imgs/cardFronts/Russia.ico',
'imgs/cardFronts/Rwanda.ico',
'imgs/cardFronts/Scotland.ico',
'imgs/cardFronts/Thailand.ico',
'imgs/cardFronts/Togo.ico',
'imgs/cardFronts/Turkey.ico',
'imgs/cardFronts/Turkmenistan.ico',
'imgs/cardFronts/Uganda.ico',
'imgs/cardFronts/Uruguay.ico',
'imgs/cardFronts/Uzbekistan.ico'
];

function getCurrentGameCardFronts(n) {
    var currentCardFronts = [],
        used = [];
    for (var i = 0; i < n; i++) {
        var pos = getRandomIntNotUsed(0, cardFronts.length, used);
        currentCardFronts.push(cardFronts[pos]);
    }
    return currentCardFronts;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomIntNotUsed(min, max, used) {
    var i = getRandomInt(min, max);
    while (used.indexOf(i) != -1) {
        i = getRandomInt(min, max);
    }
    used.push(i);
    return i;
}

function loadCardFaces(frontFace, backFace) {

    function loadImage(src) { // it is something like private method
        var imageObj = new Image();
        imageObj.src = src;
        return imageObj;
    }

    return {
        frontFace: loadImage(frontFace),
        backFace: loadImage(backFace)
    }

}

function Card(frontFace, backFace, position, id) {

    this.frontFace = frontFace;
    this.backFace = backFace;
    this.position = position;
    this.isTurned = false;
    this.kineticImage = undefined;
    this.cardShapeKineticObj = undefined;
    this.isFinished = false;
    this.id = id;
}

Card.DIMENSION = { width: 100, height: 100 };
var imageDimension = { width: 80, height: 80 };

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
            x: this.position.x + ((Card.DIMENSION.width - imageDimension.width) / 2),
            y: this.position.y + ((Card.DIMENSION.height - imageDimension.height) / 2),
            image: this.isTurned ? this.frontFace : this.backFace,
            width: imageDimension.width,
            height: imageDimension.height,
        });

        this.cardShapeKineticObj = new Kinetic.Rect({
            x: this.position.x,
            y: this.position.y,
            width: Card.DIMENSION.width,
            height: Card.DIMENSION.height,
            fill: 'rgba(79, 184, 253, 0.4)',
            stroke: 'rgb(16, 80, 121)',
            strokeWidth: 2,
            cornerRadius: 5
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