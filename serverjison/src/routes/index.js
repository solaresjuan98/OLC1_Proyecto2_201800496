const { Router } = require('express');
const router = Router();
const fs = require('fs');
var parser = require('../../jison/grammar');
var Tree = require('../../jison/TraverseTree');

var js = fs.readFileSync('result/translation.js', 'utf-8');




// routes
router.get('/', (req, res) => {
    res.json({ "Title": "hola" })
})

//JISON
router.post("/jison", (req, res) => {

    const { source_code } = req.body;

    if (source_code) {
        var root = new Tree();
        root.traverse_gv(parser.parse(source_code.toString()));
        root.writefile();
        root.translate();

        res.status(200);
        res.end();

    } else {
        res.json({ error: 'An error has ocurred.' })
    }

})

router.get("/ast", (req, res) => {

    var graph = fs.readFileSync('graph.txt', 'utf-8');
    res.json(graph);
   
})


router.get('/download', async (req, res) => {
    res.status(200)
        .attachment(`traduction.js`)
        .send(js)
})

module.exports = router;