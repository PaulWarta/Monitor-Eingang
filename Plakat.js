let container = document.getElementById('PlakatContainer')
let xhttp = new XMLHttpRequest();
let files;
xhttp.open("GET", './Plakate/Plakate.json', true);
xhttp.onload = function () {
    files = JSON.parse(this.responseText)
    load()
}
xhttp.send()

async function load () {
    let container = await document.getElementById('PlakatContainer')
    for (i = 0; i < files.length; i++) {
        container.innerHTML += `<img id='Plakat${i}' class='plakat ${i}' src='./Plakate/${files[i]}'>\n` 
    }
    slider()
}

id = 0;
let oldID;

function slider () {
    document.getElementById(`Plakat${id}`).style.opacity = '1';
    document.getElementById(`Plakat${id}`).style.zIndex = '2';
    document.getElementById(`Plakat${id}`).style.transform = 'translateX(-900px)';
    
    if (id - 1 === -1) {
        oldId = files.length - 1;
        console.log(oldId);
    } else {
        oldId = id - 1;
    }
    
    document.getElementById(`Plakat${oldId}`).style.zIndex = '1';
    setTimeout(() => {
        document.getElementById(`Plakat${oldId}`).style.opacity = '0';
        document.getElementById(`Plakat${oldId}`).style.transform = 'translateX(+900px)';
    }, 2100);
    
    id = id + 1;
    if (id === files.length) {
        id = 0;
    }
    setTimeout(() => {
        slider()
    }, 10000);
}
