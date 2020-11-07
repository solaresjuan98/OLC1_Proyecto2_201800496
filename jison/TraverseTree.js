

var fs = require('fs');
var id_n = 1;
var concat = "";
var translate = "";
var tab = 0;
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
        if (node.value.includes("\"")) {
            let aux = node.value.replace(/\"/, "");
            let newvalue = aux.replace(/\"/, "");

            translate += node.value;

            concat += node.id + '[label="' + newvalue + '" fillcolor="#d62728" shape="circle"];\n';

        } else {
            if (node.type != "NON_TERMINAL") {


                if (node.value === 'int' || node.value === 'double' || node.value === 'String'
                    || node.value === 'char' || node.value === 'boolean') {

                    translate += this.GenTab(tab) + "var ";
                }
                else if (node.type === 'class') {
                    translate += this.GenTab(tab) + node.value + " ";
                }
                else if (node.type === 'method_id') {
                    translate += this.GenTab(tab) + node.value;
                }
                else if (node.type === 'function_id') {
                    translate += "function " + node.value;
                }

                else if (node.type === 'var_id') {
                    translate += this.GenTab(tab) + node.value;
                }

                /*CONDITIONALS AND CYCLES*/
                //while
                else if (node.value === 'while') {
                    translate += this.GenTab(tab) + node.value;
                }
                //if
                else if (node.value === 'if') {
                    translate += this.GenTab(tab) + node.value;
                }
                else if (node.value === 'else') {
                    translate += this.GenTab(tab) + node.value;
                }
                else if (node.type === 'if_') {
                    console.log(":D");
                    translate += node.value;
                }
                //do while
                else if (node.value === 'do') {

                    translate += this.GenTab(tab) + node.value;
                }
                // break
                else if (node.value === 'break') {
                    translate += this.GenTab(tab) + node.value;
                }
                // continue
                else if (node.value === 'continue') {
                    translate += this.GenTab(tab) + node.value;
                }

                /*-----------------------------*/
                else if (node.value === 'main') {
                    //console.log("pillé un punto y coma");
                    translate += this.GenTab(tab) + node.value;
                }
                else if (node.value === ';') {
                    //console.log("pillé un punto y coma");
                    translate += ";\n";
                }
                else if (node.value === '{') {
                    translate += "{\n\n";
                    tab++;
                }
                else if (node.value === '}') {
                    translate += this.GenTab(tab - 1) + "}\n\n";
                    tab--;
                }
                else if (node.value === '(') {
                    translate += "(";
                }
                else if (node.value === ')') {
                    translate += ")";
                }
                else if (node.type === 'paramater_type') {

                    // this sentence is not translated
                }
                else if (node.value === 'return') {
                    //console.log("tipo de dato de parametro");
                    translate += this.GenTab(tab) + node.value + " ";
                }
                else if (node.value === 'print' || node.value === 'println') {
                    translate += this.GenTab(tab) + "console.log";
                }
                // ----- NOT TRANSLATED
                else if (node.value === 'interface' || node.value === 'public' || node.value === 'static'
                    || node.value === 'args' || node.value === '[' || node.value === 'void' || node.value === ']'
                    || node.type === 'id_interface' || node.type === '{_interface' || node.type === '}_interface') {
                    //
                }
                else {
                    translate += node.value;
                }
                //translating to javascript sintax
            }

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

    GenTab(n) {
        let tabs = n * 4;
        let tab = "";

        for (var i = 1; i <= tabs; i++) {
            tab += " ";
            //console.log(i);
        }

        return tab;
    }

    translate() {

        console.log(translate);

    }

    writefile() {
        var aux = " digraph G { \n\n";
        aux += concat;
        aux += "\n\n}"
        fs.writeFileSync('graph.txt', aux, 'utf-8');
    }

}


module.exports = TreeTraversal;

