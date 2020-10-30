

var id_n = 1;


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

        concat+="</li></ul>"+"\n";
        return concat;
    }

    traverse_gv(node){

        //var concat;

        if(node.id === 0){
            node.id = id_n;
            id_n++;
        }
        /* id [label=valor fillcolor="#d62728" shape="circle"]*/
        console.log(node.id + '[label="'+node.value+'" fillcolor="#d62728" shape="circle"];')


        node.child.forEach(element => {
            /* id->id; */
            console.log(node.id+'->'+id_n+";")
            this.traverse_gv(element)
        });
    }

}

module.exports = TreeTraversal;

