
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('error-handler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  fs = require('fs'),
  path = require('path'),
  tika = require('../tika/tika.js'),
  pln = require('../entities.js');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

app.post('/api/extraerSemantica', function(request, response){
	console.log("[server.js] post /extraerSemantica/"); 
	// es un texto y llamamos a extraer entidades + nube

	pln.getEntities(request.text, function(err, resultado){
		if(err){
			console.log(err);
			console.log("[server.js] error en getEntities"); 
			response.send(500);
		}
		else {
			// la info interesante esta en 'resultado' 
			response.send(200, resultado);
		}
	});
});

//POST
app.post('/api/extraerTexto', function(request, response){
	console.log("[server.js] POST /extraerTexto/");  
	// llama a Apache Tika
  var data;
  request.on('data', function (chunk) {
      data += chunk;
  });

  request.on('end', function(){
    tika.extraerPDF(data, function(err, information){
      if(err){
        console.log("[server.js] error en extraerPDF"); 
        response.send(500);
      }
      else {
        // 'information' tiene: {filename:filename, texto: text.trim(), metadata: meta}
        // 1. eliminar los saltos de linea!!!
        var texto = information.texto.replace(/\n/g, "");

        // 2. aqui se llama a getEntities
        pln.getEntities(texto, function(err, resultado){
          if(err){
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
  })
});

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});