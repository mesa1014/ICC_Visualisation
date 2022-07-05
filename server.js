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

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
