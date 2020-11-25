var express = require("express");
var app = express();

app.get("/test", (req, res, next) => {
 res.json(["Tony","Michael","Ginger","Food"]);
});


app.listen(80,'139.147.9.192', () => {
 console.log("Server running on port 3000");
});


