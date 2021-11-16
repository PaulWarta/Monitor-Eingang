
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
        if (data[i]["Name"] == '') { data[i]["Name"] = "Privatstunde"} 
        html = `<div class="belegung ${i + 1}"><h1>${data[i]["Name"]}</h1>\n<div><h2>${data[i]["Von"]} - ${data[i]["Bis"]}</h2>\n<h2>${data[i]["Lehrer"]}</h2></div><p class="von" hidden>${data[i]["Von"]}</p><p class="bis" hidden>${data[i]["Bis"]}</p></div>`
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


// fürs testen einfach hours und minutes hinzufügen als Parameter
function slideUp () {
    let now = new Date();
    // For testing purposes:
    // now = new Date(now.getFullYear(), now.getMonth(), now.getDay(), hours, minutes, 0)
    console.log(now);
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
        document.getElementById('SaalContainer' + i).style.opacity = '1';
        document.getElementById('SaalContainer' + i).style.top = `${-stundenplanoffset}px`;

        element1 = document.querySelector('#Spalte' + i + ' .von');
        von = element1.innerText
        stunde = parseInt(von.slice(0, 2));
        minute = parseInt(von.slice(3, 5));
        von = new Date(now.getFullYear(), now.getMonth(), now.getDate(), stunde, minute, 0)
        console.log(`Spalte${i}`)
        console.log(element1);
        console.log(von.getTime() - now.getTime());
        console.log((von.getTime() - now.getTime()) >= 900);
        if ( von.getTime() - now.getTime() >= 1800000) {
            document.getElementById('SaalContainer' + i).style.opacity = 0;
            document.getElementById('SaalContainer' + i).style.top = '200px';
        }
    }
}

setTimeout(() => {
    slideUp()
}, 1500);



getData("1")
getData("2")
getData("3")
getData("4")
getData("5")
