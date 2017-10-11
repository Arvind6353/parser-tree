var express = require('express')

var app = new express()
var path = require('path')

app.use(express.static(path.join(__dirname)))

app.listen(9000);

