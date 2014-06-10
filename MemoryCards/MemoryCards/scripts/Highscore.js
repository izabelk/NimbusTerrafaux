/// <reference path="_references.js" />

var highscore = {

    addUser: function (name, score) {
        var topPlayers = 5;

        if (name === null || name === '') {
            name = 'Unknown';
        }

        var player = {
            name: name,
            score: score
        };

        localStorage.setItem(player.name, player.score);

        // if players are more than topPlayers, removes the worst one
        if (localStorage.length > topPlayers) {
            var worstPlayer = localStorage.key(0);
            var worstScore = Number(localStorage.getItem(worstPlayer));

            for (var i = 1; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var value = Number(localStorage.getItem(key));

                if (value < worstScore) {
                    worstScore = value;
                    worstPlayer = key;
                }
            }

            localStorage.removeItem(worstPlayer);
        }
    },

    show: function () {
        var orderedList = document.createElement('ol');

        // set position of the <ol> ranking
        orderedList.id = 'highscore';
        orderedList.style.position = 'absolute';
        orderedList.style.top = '350px';
        orderedList.style.left = '250px';
        orderedList.style.color = '#3538FF';
        orderedList.style.font = 'italic 28px Consolas';

        var users = [];

        // push all users in array
        for (var item in localStorage) {
            users.push(new Object({
                name: item,
                score: localStorage.getItem(item)
            }))
        }

        // sort users by score
        users.sort(function (u1, u2) {
            return u2.score - u1.score;
        });

        // add every user as list-item in the ol
        for (var i in users) {
            var listItem = document.createElement('li');
            listItem.style.height = '35px';
            var name = users[i].name;
            var score = users[i].score;

            listItem.innerText = name + ' - ' + score + ' scores';
            orderedList.appendChild(listItem);
        }

        // where to show the ol
        document.getElementById('container').appendChild(orderedList);
    },

    isShowed: function () {
        var ranking = document.querySelector('#highscore');

        return ranking !== null;
    },

    removeFromDom: function () {

        if (highscore.isShowed()) {
            var orderedList = document.querySelector('#highscore');

            orderedList.parentNode.removeChild(orderedList);
        }
    }
}