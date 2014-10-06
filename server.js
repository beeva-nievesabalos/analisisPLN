//server.js
var ip = "localhost";
var port = 3000;

var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json({limit: '100mb'}));     // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ extended: false, limit: '100mb' }));

app.use(function (req, res, next) {
  next()
}) 

// Enables CORS
var enableCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// enable CORS!
app.use(enableCORS);


//GET
app.get('/extraerSemantica/', function(request, response){
	console.log("[server.js] GET /extraerSemantica/"); 
	// es un texto y llamamos a extraer entidades + nube

});

//POST
app.post('/extraerTexto/', function(request, response){
	console.log("[server.js] POST /extraerTexto/");  
	// llama a Apache Tika 
});


app.listen(port);
console.log("[server.js] listening @ http://"+ ip +":" + port);   

