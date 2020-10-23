const { Router, response } = require('express')
const router = Router();
var Scanner = require('../util/Scanner');
var Parser = require('../util/Parser');
var list = [];

router.get('/test', (req, res) => {
    //res.send({"Entry": "text entry"});

    const data = [
        {
            "name": "Juan",
            "website": "juan.com"
        },
        {
            "name": "Luis",
            "website": "luis.com"
        }

    ];

    res.json(data);
});

router.post("/send", (req, res) => {

    const { source_code } = req.body;

    if (source_code) {

        // lexical analysis
        var scanner = new Scanner(source_code);
        scanner.scan();
        scanner.addEOF();
        console.log(scanner.ReturnLexErrors());
        
        // parser 
        var parser = new Parser(scanner.tokenList);
        parser.getTokens();
        //parser.parse();
        //parser.WriteFile();
        res.status(200);
        res.end();

    } else {
        //console.log(":v")
        res.json({ error: 'An error has ocurred.' });
    }

})

router.post("/data", (req, res) => {

    const {data} =  req.body;

    res.json(req.body);
})

router.get("/report", (req, res) => {

    res.json(list);


})

module.exports = router;