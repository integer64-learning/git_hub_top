'use strict';
document.addEventListener('DOMContentLoaded', function () {
    Date.prototype.yyyymmdd = function() {

        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();

        return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
    };

    function startOfWeek(date)
    {
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    }

    function drawTable(data) {
        for(var i = 0; i < data.length; i++ ) {
            var name = data[i].name;
            var stars = data[i].stargazers_count;
            var link = data[i].html_url;

            var rowHtml = templateRow.replace(regexName, name);
            rowHtml = rowHtml.replace(regexStars, stars);
            rowHtml = rowHtml.replace(regexLink, link);

            var htmlNode = document.createElement('tr');
            htmlNode.innerHTML = rowHtml;
            $table.appendChild(htmlNode);
        }
    }

    var templateRow =
        '<td>${name}</td>' +
        '<td>${stars}</td>' +
        '<td><a href="${link}" title="${name}" target="_blank">${link}</a></td>';

    var $table = document.querySelector('.top-repositories__table tbody');
    var regexName = new RegExp('\\$\{name\}', 'g');
    var regexStars = new RegExp('\\$\{stars\}', 'g');
    var regexLink = new RegExp('\\$\{link\}', 'g');

    var startDayWeek = startOfWeek(new Date()).yyyymmdd();
    var url = 'https://api.github.com/search/repositories?q=pushed:">' + startDayWeek + '"language:javascript&sort=stars&order=desc&per_page=10';
    var http = new XMLHttpRequest();
    var arrayOfRepositories = [];

    http.open('GET', url);
    http.onreadystatechange = function () {
        if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
            arrayOfRepositories = JSON.parse(http.responseText).items;
            drawTable(arrayOfRepositories);
        } else if (http.readyState === XMLHttpRequest.DONE && http.status !== 200) {
            console.log('Error!');
        }
    };
    http.send();

});
