const express = require("express");
const app = express();
const cors = require('cors')

app.use(express.static(__dirname+"/static"));
app.use(cors())

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/static/index.html");
});

const listener = app.listen(80, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
  
