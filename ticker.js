let data = [];

let xhttp = new XMLHttpRequest;
xhttp.open("GET", "ticker_data", false);
xhttp.send();
data.push(xhttp.responseText())