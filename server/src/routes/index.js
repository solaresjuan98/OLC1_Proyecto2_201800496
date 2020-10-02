const { Router } = require('express')
const router = Router();
var Scanner = require('../util/Scanner');
var Parser = require('../util/Parser');

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

    res.json(data[1].name);
});

router.post("/", (req, res) => {

    const { source_code } = req.body;

    if (source_code) {
        //console.log(source_code);

        var scanner = new Scanner(source_code);
        scanner.scan();
        //console.log(scanner.tokenList);
        console.log('Source code received');
        //scanner.ReturnTokens();

        var parser = new Parser(scanner.tokenList)
        parser.getTokens();
        
    } else {
        res.json({ error: 'An error has ocurred.' });
    }



})




module.exports = router;