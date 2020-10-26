const { Router, response } = require('express')
const router = Router();
var Scanner = require('../util/Scanner');
var Parser = require('../util/Parser');
const fs = require('fs');
var list = [];


// read file that contains the token list
const tokens = fs.readFileSync('reports/tokenlist.json', 'utf-8');
const tokens_ = JSON.parse(tokens);

// read file that contains the lex error list
const lexerrors = fs.readFileSync('reports/lexerrors.json', 'utf-8');
const lexerrors_ = JSON.parse(lexerrors);

// read file that contains the console information
const info = fs.readFileSync('reports/info.json', 'utf-8');
const info_ = JSON.parse(info);


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
        var lex_errors = scanner.ReturnLexErrors();

        fs.writeFileSync('reports/lexerrors.json', "", 'utf-8');
        // writing on the JSON file
        fs.writeFileSync('reports/lexerrors.json', JSON.stringify(lex_errors), 'utf-8');


        // parser 
        var parser = new Parser(scanner.tokenList);

        var tk_list = parser.returnTokenList();
        parser.parse();
        parser.WriteFile();

        fs.writeFileSync('reports/tokenlist.json', "", 'utf-8');
        // writing on the JSON file
        fs.writeFileSync('reports/tokenlist.json', JSON.stringify(tk_list), 'utf-8');

        var info = {
            "info": parser.returnConsoleReport()
        }

        fs.writeFileSync('reports/info.json', JSON.stringify(info), 'utf-8');

        res.status(200);
        res.end();

    } else {
        //console.log(":v")
        res.json({ error: 'An error has ocurred.' });
    }

})

router.post("/data", (req, res) => {

    const { data } = req.body;

    res.json(req.body);
})

router.get("/tokensreport", (req, res) => {

    res.json(tokens_);

})

router.get("/lexerrors", (req, res) => {

    res.json(lexerrors_);
})

router.get("/info", (req, res) => {

    res.json(info_);

})

module.exports = router;