var fs = require('fs'); 
var parser = require('./grammar');
//var arbol = require('./recorrido_arbol')


fs.readFile('./entrada2.java', (err, data) => {
    if (err) throw err;
    parser.parse(data.toString());
});