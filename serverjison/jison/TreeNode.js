
var tokenValueList = [];

class TreeNode {

    constructor(value, type) {
        this.id = 0;
        this.value = value;
        this.type = type;
        this.child = [];
    }

    getValue() {
        return this.value;
    }

    getType() {
        return this.type;
    }

    addChild(child) {
        this.child.push(child);
    }

    returnList() {
        return tokenValueList;
    }

    translate(str) {
       
        //tokenValueList.push(node.value);
        //console.log(str);
        //console.log(tokenValueList);
    }
}

module.exports = TreeNode;
