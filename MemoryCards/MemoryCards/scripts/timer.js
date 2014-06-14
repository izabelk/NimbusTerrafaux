/// <reference path="_references.js" />

var timer = {
    colors: ['#2e8e00', '#ffcf1c', '#c50000'],
    radius: 20,
    positionX: 30,
    positionY: 30,
    elapsedTime: 1,
    draw: function draw(paper, tile) {
        var tileToDraw = paper.path(tile.path);
        tileToDraw.attr("fill", tile.fill);
    },
    generateTile: function generateTile(radius, startAngle, endAngle, fillColor) {

        var rad = Math.PI / 180,
            cX = timer.radius * 1.5,
            cY = timer.radius * 1.5;

        function sector(cx, cy, r, startAngle, endAngle) {
            var x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad);
            var path = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"].join(' ');
            return path;
        }

        var generatedPath = sector(cX, cY, radius, startAngle, endAngle);

        return {
            path: generatedPath,
            fill: fillColor
        };
    },
    start: function start() {
        var START_ANGLE = 90,
            END_ANGLE = 450,
            ANGLE_PER_SEC = 6,
            timerPaper = timerPaper || Raphael(timer.positionX - timer.radius,
                                       timer.positionY - timer.radius,
                                       timer.radius * 3, timer.radius * 3);

        timer.elapsedTime = 1;
        var interval = setInterval(function () {
            timerPaper.clear();
            var fillColor = timer.elapsedTime < 30 ? timer.colors[0] : timer.elapsedTime < 45 ? timer.colors[1] : timer.colors[2];
            var tile = timer.generateTile(timer.radius, START_ANGLE,
                                          END_ANGLE - (timer.elapsedTime * ANGLE_PER_SEC),
                                          fillColor);

            timer.draw(timerPaper, tile);

            if (timer.elapsedTime === 60) {
                timerPaper.clear();
                clearInterval(interval);
            }
            timer.elapsedTime++;

        }, 1000);

    },
    stop: function stop() {
        timer.elapsedTime = 60;
    }
};
