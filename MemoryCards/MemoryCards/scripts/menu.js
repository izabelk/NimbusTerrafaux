/// <reference path="_references.js" />

function renderRect(x, y, width, height, stroke, fill, cornerRadius, visible, strokeWidth, opacity) {

    var rect = new Kinetic.Rect({
        x: x,
        y: y,
        width: width,
        height: height,
        stroke: stroke,
        fill: fill,
        cornerRadius: cornerRadius,
        visible: visible,
        strokeWidth: strokeWidth,
        opacity: opacity
        //opacity:0; -> Tanya version
    });

    return rect;
}

function renderText(text, fontFamily, fontSize, x, y, fill) {

    var text = new Kinetic.Text({
        text: text,
        fontFamily: fontFamily,
        fontSize: fontSize,
        x: x,
        y: y,
        fill: fill
    });

    return text;
}

function initializeMenu() {

    //var rect = renderRect(layerOffset, layerOffset, layerOfMenu.getWidth() - layerOffset * 2,
    //    layerOfMenu.getHeight() - layerOffset * 2, '#51A5FF', '#B5FFDE', 10, true, 4, 1);

    var rect = renderRect(layerOffset, layerOffset, 500, 
       layerOfMenu.getHeight() - layerOffset * 2, 'white', 'white', 10, true, 4, 1);

    var title = renderText('Memory Cards', 'French Script MT', 80, 210, 50, '#3538FF');
    var subTitle = renderText('by Nimbus Terrafaux', 'French Script MT', 40, 370, 130, '#3538FF');

    var newGameRectVisible = renderRect(250, 230, 200, 50, '#3538FF', '#B5FFDE', 10, true, 1, 1);
    var invisibleRectNewGame = renderRect(250, 230, 200, 50, 'none', 'none', 10, true, 1, 0);
    var newGameText = renderText('New Game', 'Arial', 20, 300, 245, '#3538FF');

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

    var highScoresRectVisible = renderRect(250, 290, 200, 50, '#3538FF', '#B5FFDE', 10, true, 1, 1);
    var highScoresText = renderText('High Scores', 'Arial', 20, 300, 305, '#3538FF');
    var invisibleRectScores = renderRect(250, 290, 200, 50, 'none', 'none', 10, true, 1, 0);

    invisibleRectScores.on('click', function () {

        if (!highscore.isShowed()) {
            highscore.show();
        }
        else {
            highscore.removeFromDom();
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