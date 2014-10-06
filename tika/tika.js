var tika = require('tika');
var folderPDF = "./pdf/";
var filename = folderPDF+'BOE-A-2014-10019.pdf';

tika.extract(filename, function(err, text, meta) {
	console.log("**********************************************")
	console.log("[TIKA] File:" + filename);
    console.log(text.trim());
    console.log(meta.producer);
});
