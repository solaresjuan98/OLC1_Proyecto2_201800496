

var fs = require('fs');
var id_n = 1;
var concat = "";

class TreeTraversal {

    constructor() {

    }

    traverse(node) {

        var concat;

        if (node.type != "") {
            concat = "<ul><li data-jstree='{ \"opened\" : true }'>" + node.value + " (" + node.type + ")" + "\n";
        } else {
            concat = "<ul><li data-jstree='{ \"opened\" : true }'>" + node.value + "\n";
        }

        node.child.forEach(element => {
            concat += this.traverse(element);
        });

        concat += "</li></ul>" + "\n";
        return concat;
    }

    traverse_gv(node) {



        if (node.id === 0) {
            node.id = id_n;
            id_n++;
        }
        /* id [label=valor fillcolor="#d62728" shape="circle"]*/

        // replace '"'
        if(node.value.includes("\"")){
            let aux = node.value.replace(/\"/, "");
            //console.log(aux);
            let newvalue = aux.replace(/\"/, "");
            concat += node.id + '[label="' + newvalue + '" fillcolor="#d62728" shape="circle"];\n';

        }else{

            concat += node.id + '[label="' + node.value + '" fillcolor="#d62728" shape="circle"];\n';
        }

        //concat += node.id + '[label="' + node.value + '" fillcolor="#d62728" shape="circle"];\n';
        //console.log(node.id + '[label="'+node.value+'" fillcolor="#d62728" shape="circle"];')


        node.child.forEach(element => {
            /* id->id; */
            //console.log(node.id+'->'+id_n+";")
            concat += node.id + '->' + id_n + ";\n";
            this.traverse_gv(element)
        });
    }

    writefile() {
        var aux = " digraph G { \n\n";
        aux += concat;
        aux += "\n\n}"
        fs.writeFileSync('graph.txt', aux, 'utf-8');
    }

}


module.exports = TreeTraversal;

