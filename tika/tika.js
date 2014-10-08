var tika = require('tika');
var folderPDF = "./pdf/";
//var filename = folderPDF+'BOE-A-2014-10019.pdf';


exports.extraerPDF = function(pdf, callback){
	// Descargar el fichero?

	// quitar esto!!!!!
	var filename = pdf;//folderPDF+'BOE-A-2014-10019.pdf';

	// Extrae la informacion a partir del nombre del ficheo
	tika.extract(filename, function(err, text, meta) {
		if(err){
			callback(err);
		}
		else {
			console.log("**********************************************")
			console.log("[TIKA] File:" + filename);
	   		console.log(text.trim());
	    	console.log(meta.producer);
	    	callback(null, {filename:filename, texto: text.trim(), metadata: meta});
		}

	});
}