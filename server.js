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

var tika = require('./tika/tika.js');
var pln = require('./entities.js');

//POST
app.post('/extraerSemantica/', function(request, response){
	console.log("[server.js] GET /extraerSemantica/"); 
	// es un texto y llamamos a extraer entidades + nube

	pln.getEntities(request.text, function(success, resultado){
		if(success){
			console.log("[server.js] error en getEntities:" + resultado); 
			response.send(500);
		}
		else {
			// la info interesante esta en 'resultado' 
			response.send(200, resultado);
		}
	});

	
});

//POST
app.post('/extraerTexto/', function(request, response){
	console.log("[server.js] POST /extraerTexto/");  
	// llama a Apache Tika
	var pdf = request.pdf;

	tika.extraerPDF(pdf, function(success, information){
		if(success){
			console.log("[server.js] error en extraerPDF:" + information); 
			response.send(500);
		}
		else {
			// 'information' tiene: {filename:filename, texto: text.trim(), metadata: meta}
			// 1. eliminar los saltos de linea!!!
			var texto = information.texto.replace(/\n/g, "");

			// 2. aqui se llama a getEntities
			pln.getEntities(texto, function(success, resultado){
				if(success){
					console.log("[server.js] error en getEntities:" + resultado); 
					response.send(500);
				}
				else {
					// la info interesante esta en 'resultado' 
					response.send(200, resultado);
				}
			});
		}
	}); 
});


app.listen(port);
console.log("[server.js] listening @ http://"+ ip +":" + port);   

