const compression = require('compression');
const express = require("express");
var morgan = require('morgan')

const app = express();

app.use(morgan('combined'))
app.use(compression());
app.use(express.static('public'))

// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/index.html");
// });

app.listen(8082, function () {
    console.log("Server is running on localhost:8082");
});
