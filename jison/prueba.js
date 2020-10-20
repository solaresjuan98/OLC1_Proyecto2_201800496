var fs = require('fs'); 
var parser = require('./gramatica');
//var arbol = require('./recorrido_arbol')


fs.readFile('./entrada.java', (err, data) => {
    if (err) throw err;
    parser.parse(data.toString());
});