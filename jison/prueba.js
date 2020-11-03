var fs = require('fs'); 
var parser = require('./grammar');
var Tree = require('./TraverseTree');


fs.readFile('./3.java', (err, data) => {
    if (err) throw err;

    var root = new Tree();
    root.traverse_gv(parser.parse(data.toString()));
    root.writefile();
    root.translate();
});