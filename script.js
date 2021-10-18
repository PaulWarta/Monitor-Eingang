
function getData(saal) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        createHTML(saal, this.responseText)
    }
    xhttp.open("GET", `./stundenplan${saal}.json`, true);
    xhttp.send();
}

function createHTML (saal, response) {
    let parent = document.getElementById(`SaalContainer${saal}`);
    let data = JSON.parse(response);
    let html = "";
    for (let i = 0; i < data.length; i++) {
        html = `<div class="belegung ${i + 1}"><h1>${data[i]["Bem"]}</h1>\n<h2>${data[i]["Von"]} - ${data[i]["Bis"]}</h2>\n<h2>${data[i]["Lehrer"]}</h2></div>`
        parent.innerHTML += html;
        html = "";
    }
}

getData("1")
getData("2")
getData("3")
getData("4")
