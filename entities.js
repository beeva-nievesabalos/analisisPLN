var exec = require('child_process').exec;

var sentence="BOLETÍN OFICIAL DEL ESTADO Núm. 240 Viernes 3 de octubre de 2014 Sec. I.   Pág. 78813 I. DISPOSICIONES GENERALES MINISTERIO DE ASUNTOS EXTERIORES Y DE COOPERACIÓN 10019 Corrección de errores de la aplicación provisional del Acuerdo entre el Gobierno del Reino de España y el Gobierno de Australia relativo al programa de movilidad para jóvenes, hecho en Canberra el 3 de septiembre de 2014.Advertido error en la publicación de la aplicación provisional del Acuerdo entre el Gobierno del Reino de España y el Gobierno de Australia relativo al programa de movilidad para jóvenes, hecho en Canberra el 3 de septiembre de 2014, publicada en el «Boletín Oficial del Estado» número 228, de fecha 19 de septiembre de 2014, se procede a efectuar la oportuna rectificación:En la pág. 73352, en la primera línea del preámbulo, donde dice: «y Gobierno del Australia», debe decir: «y el Gobierno de Australia». En la pág. 73353, en la cláusula 6, línea 4, donde dice: «del cupo fijo», debe decir: «del cupo fijado». En la pág. 73356, en la antefirma, donde dice: «POR ESPAÑA», debe decir: «POR EL REINO DE ESPAÑA».";


exports.getEntities = function(text, callback) {
	console.log("[getEntities] Entrada a procesar:\n" + text);
	
	/* Extraer cosas del dominio especificas */
	//var re = /^(Artículo|ARTÍCULO)(.*)$/;
	/*var rePattern = new RegExp(/(Artículo|ARTÍCULO)\s[\d*]$/);
	var matches = text.match(rePattern);
	console.log("RegEx");
	console.log(matches);*/

	 //Etiquetas:Person (tag NP00SP0), Geographicallocation (NP00G00), Organization (NP00O00), and Others (NP00V00).
	command = 'echo "'+ text +'" | analyzer_client 50005'

	json = {"person": [], "geographicalLocation" : [], "organization":[], "othersEntities":[] , "concepts":[] , "cloud":[] }
	counts=[]
	words=[]

	exec(command, function cb2(error, stdout, stderr) { 
		if(error) {
	 		console.log(error);
	 		callback(error);
		} else {
			var lines = stdout.split('\n')
			for(l in lines){
			 	//console.log(lines[l])	
			 	var res = lines[l].split(" ");
			 	if(res[2]!=undefined && res[2].search("N")>=0){
			 		if(res[2].indexOf("NP") != -1){
			 			console.log("+ ENTIDADES: "+res[1])
			 			var aux =[]
				 		switch(res[2]) {
						    case "NP00SP0":
						       	aux=json.person
								aux=addEntity(aux,res[0]) // que no quite las mayusculas
						       	json.person=aux
						        break;
						    case "NP00G00":
						        aux=json.geographicalLocation
								aux=addEntity(aux,res[0])  // que no quite las mayusculas
						       	json.geographicalLocation=aux
						        break;
						    case "NP00O00":
						       	aux=json.organization
								aux=addEntity(aux,res[0])  // que no quite las mayusculas
						       	json.organization=aux
						        break;
						    case "NP00V00":
								aux=json.othersEntities
								aux=addEntity(aux,res[0])  // que no quite las mayusculas
						       	json.othersEntities=aux
						        break;
						    default:
						    	/*aux=json.concepts
								aux=addEntity(aux,res[1])
						       	json.concepts=aux
						       	console.log("Añado a conceptos: "+res[1])*/
						        break;
						}
			 		}
			 		else {
			 			if(res[2].indexOf("NC")!= -1){
				 			if(res[1].length > 1){
					 			var aux =[]
						 		aux=json.concepts
								aux=addEntity(aux,res[1]) // el original esta en la pos 0, y en la 1 lo pone en 'singular'
								json.concepts=aux
								console.log("+ CONCEPTOS: "+res[1])
							}
							else {
								console.log("No he añadido a conceptos: "+res[1])
							}
						}
					}
			 	}
			}
			//console.log(json)
			//console.log(words)
			//console.log(counts)
			var json_aux= '{' 
			if(words.length>0){
				for(w in words){
					if(w!=0){
						json_aux = json_aux+ ","
					}
					json_aux=  json_aux + '"'+ words[w].replace(/_/g, " ") + '":' + counts[w]
				}
				json_aux= json_aux + '}'
			}
			json.cloud=JSON.parse(json_aux)
			
			//Quitar guión bajo
			organization=[]
			for (c in json.organization){
				organization[organization.length]=json.organization[c].replace(/_/g, " ")
			}
			json.organization=organization
			
			//Quitar guión bajo
			othersEntities=[]
			for (c in json.othersEntities){
				othersEntities[othersEntities.length]=json.othersEntities[c].replace(/_/g, " ")
			}
			json.othersEntities=othersEntities

			//Quitar guión bajo
			concepts=[]
			for (c in json.concepts){
				concepts[concepts.length]=json.concepts[c].replace(/_/g, " ")
			}
			json.concepts=concepts

			//Quitar guión bajo
			geographicalLocation=[]
			for (c in json.geographicalLocation){
				geographicalLocation[geographicalLocation.length]=json.geographicalLocation[c].replace(/_/g, " ")
			}
			json.geographicalLocation=geographicalLocation

			//Quitar guión bajo
			person=[]
			for (c in json.person){
				person[person.length]=json.person[c].replace(/_/g, " ")
			}
			json.person=person

			console.log("[getEntities] Freeling ha extraido...\n"+JSON.stringify(json));
			callback(null,json);
	    }
	})   
}

// Añadir entidad
addEntity = function(array, entidad) {
	//compruebo si ya lo he metido en el json
	var array_aux=array
	if(array_aux.indexOf(entidad)<0){
		array_aux[array_aux.length]=entidad
	}
	//Actualizo la cuenta correspondiete
	if(words.indexOf(entidad)<0){
		words[words.length]=entidad
		counts[counts.length]=1

	}else{
		counts[words.indexOf(entidad)]=counts[words.indexOf(entidad)]+1
	}
	return array_aux
};

