
function getData(saal) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        createHTML(saal, this.responseText)
    }
    xhttp.open("GET", `./stundenplan${saal}.json`, true);
    xhttp.send();
}

//Sollte die Idee eines durchlaufenden Stundenplans nochmal aufkommen:
//  in createHTML() in html das styling hinzufügen mit der Höhe aus dem Rückgabewert von calcHeight()

function createHTML (saal, response) {
    let parent = document.getElementById(`SaalContainer${saal}`);
    let data = JSON.parse(response);
    let html = "";
    for (let i = 0; i < data.length; i++) {
        if (data[i]["Bem"] == '') { data[i]["Bem"] = "Privatstunde"} 
        html = `<div class="belegung ${i + 1}"><h1>${data[i]["Bem"]}</h1>\n<h2>${data[i]["Von"]} - ${data[i]["Bis"]}</h2>\n<h2>${data[i]["Lehrer"]}</h2><p class="von" hidden>${data[i]["Von"]}</p><p class="bis" hidden>${data[i]["Bis"]}</p></div>`
        parent.innerHTML += html;
        html = "";
    }
}

// function calcHeight(start) {
//     let now = new Date();
//     let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
//     midnight = midnight.getTime()

//     if (start.length == 4) {
//         start = '0' + start;
//     }
//     let kursstart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(start.slice(0, 2)), parseInt(start.slice(3)), 0)
    
//     let position = ((kursstart - midnight) / 86400000) * (165 * 24)

//     return position
// }

// function moveContainers () {
//     let now = new Date();
//     let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
//     midnight = midnight.getTime()

//     let position = ((now - midnight) / 86400000) * (165 * 24)

//     return position
// }

// setInterval(() => {
//     let containers = document.querySelectorAll('.saalContainer').forEach(container => {
//         container.style.top = `${-moveContainers()}px`;
//     })
// }, 5000);

function slideUp () {
    let now = new Date();
    now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 50, 0)
    let top = 0;
    for (i = 1; i <= 5; i++) {
        let stundenplanoffset = 0;
        document.querySelectorAll('#Spalte' + i + ' .bis').forEach(element => {
            bis = element.innerText
            stunde = parseInt(bis.slice(0, 2));
            minute = parseInt(bis.slice(3, 5));
            bis = new Date(now.getFullYear(), now.getMonth(), now.getDate(), stunde, minute, 0)
            if ( bis.getTime() - now.getTime() <= 0) {
                stundenplanoffset += 145;
            }
        })
        document.getElementById('SaalContainer' + i).style.top = `${-stundenplanoffset}px`;
    }
}

setTimeout(() => {
    slideUp()
}, 1000);



getData("1")
getData("2")
getData("3")
getData("4")
getData("5")
