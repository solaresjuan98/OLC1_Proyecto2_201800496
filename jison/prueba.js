var fs = require('fs'); 
var parser = require('./grammar');
var Tree = require('./TraverseTree');


fs.readFile('./entrada.java', (err, data) => {
    if (err) throw err;

    //parser.parse(data.toString());
    var root = new Tree();
    //parser.parse();
    console.log(root.traverse_gv(parser.parse(data.toString())));
    root.writefile();
});