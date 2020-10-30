

class TreeNode{

    constructor(value, type){
        this.id = 0; 
        this.value = value;
        this.type = type;
        this.child = [];
    }

    getValue(){
        return this.value;
    }

    getType(){
        return this.type; 
    }

    addChild(child){
        this.child.push(child);
    }
}

module.exports = TreeNode;
