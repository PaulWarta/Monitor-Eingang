const app = require('express')();

app.use(express.static());

app.get('/*', (req, res) => {
    res.sendFile(__dirname + req.url);
})

app.listen(8085, "192.168.30.155");