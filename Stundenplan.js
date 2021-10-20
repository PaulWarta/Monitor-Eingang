
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
        if (data[i]["Bem"] == '') { data[i]["Bem"] = "Privatstunde"} 
        html = `<div class="belegung ${i + 1}" style="position: absolute; top: ${calcHeight(data[i]["Von"])}px"><h1>${data[i]["Bem"]}</h1>\n<h2>${data[i]["Von"]} - ${data[i]["Bis"]}</h2>\n<h2>${data[i]["Lehrer"]}</h2></div>`
        parent.innerHTML += html;
        html = "";
    }
}

function calcHeight(start) {
    let now = new Date();
    let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    midnight = midnight.getTime()

    if (start.length == 4) {
        start = '0' + start;
    }
    let kursstart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(start.slice(0, 2)), parseInt(start.slice(3)), 0)
    
    let position = ((kursstart - midnight) / 86400000) * (165 * 24)

    return position
}

function moveContainers () {
    let now = new Date();
    let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    midnight = midnight.getTime()

    let position = ((now - midnight) / 86400000) * (165 * 24)

    return position
}



setInterval(() => {
    let containers = document.querySelectorAll('.saalContainer').forEach(container => {
        container.style.top = `${-moveContainers()}px`;
    })
}, 5000);

calcHeight('12:00');

getData("1")
getData("2")
getData("3")
getData("4")
getData("5")
