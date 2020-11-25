 const express = require("express");
const app = express();
const db = require('./queries')

//app.use('/covid.html',express.static('public'))
//app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));

app.get('/', (request, response) => {
 response.json(["Tony","Michael","Ginger","Food"])
})

app.get('/counties', db.getCounties)

app.get('/countyIncidence', db.getCountyIncidence)

app.get('/collegeTotal', db.getCollegeTotals)

app.get('/northamptonCollege', db.getNorthCol)

app.get('/casesTotal', db.getCasesTotal)

app.listen(80,'139.147.9.192', () => {
 console.log("Server running on port 80")
})

