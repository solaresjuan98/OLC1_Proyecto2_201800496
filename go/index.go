package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
)

var nodeURL = ""

type token struct {
	Type   string
	Value  string
	Row    int
	Column int
}

func main() {

	nodeip, defip := os.LookupEnv("NODEIP")
	nodeport, defport := os.LookupEnv("NODEPORT")

	if !defip {
		nodeip = "localhost"
	}

	if !defport {
		nodeport = "5000"
	}

	nodeURL = "http://" + nodeip + ":" + nodeport

	ip, defip := os.LookupEnv("GOIP")
	port, defport := os.LookupEnv("GOPORT")

	if !defip {
		ip = "182.18.7.9"
	}

	if !defport {
		port = "3000"
	}

	// Handle js, css and condemirror files
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css/"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js/"))))
	http.Handle("/codemirror/", http.StripPrefix("/codemirror/", http.FileServer(http.Dir("codemirror/"))))

	http.HandleFunc("/hola", showFront2)
	http.HandleFunc("/", showFront)
	fmt.Println(" Listening on IP:" + ip + " and PORT:" + port)
	fmt.Println(nodeURL)
	http.ListenAndServe(":"+port, nil)

}

/*
func getData(w http.ResponseWriter, r *http.Request) {
	nodeip, defip := os.LookupEnv("NODEIP")
	nodeport, defport := os.LookupEnv("NODEPORT")

	if !defip {
		nodeip = "localhost"
	}

	if !defport {
		nodeport = "5000"
	}

	url := "http://" + nodeip + ":" + nodeport + "/api/lexerrors"

	log.Printf(url)

	//Enviamos una peticion GET a nodejs
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	log.Printf(string(bodyBytes))

	/*
		//http requests
		resp, err := http.Get("http://localhost:5000/api/lexerrors")
		if err != nil {
			print(err)
		}

		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			print(err)
		}
		//----

		reqBody, err := json.Marshal(map[string]string{
			"username": "Goher Go",
			"email":    "go@gmail.com",
		})

		if err != nil {
			print(err)
		}
		re, e := http.Post("http://localhost:5000/api/lexerrors",
			"application/json", bytes.NewBuffer(reqBody))
		if e != nil {
			print(e)
		}

		defer re.Body.Close()
		body, errr := ioutil.ReadAll(r.Body)
		if errr != nil {
			print(errr)
		}

		fmt.Println(string(body))

		fmt.Print(string(body))


}
*/

func showFront(w http.ResponseWriter, r *http.Request) {

	/*
		nodeip, defip := os.LookupEnv("NODEIP")
		nodeport, defport := os.LookupEnv("NODEPORT")

		if !defip {
			nodeip = "localhost"
		}

		if !defport {
			nodeport = "5000"
		}

		url := "http://" + nodeip + ":" + nodeport + "/api/lexerrors"

		log.Printf(url)

		//Enviamos una peticion GET a nodejs
		resp, err := http.Get(url)
		if err != nil {
			log.Fatalln(err)
		}

		defer resp.Body.Close()
		bodyBytes, _ := ioutil.ReadAll(resp.Body)

		log.Printf(string(bodyBytes))
	*/
	template, _ := template.ParseFiles("index.html")
	template.Execute(w, "Proyecto")
}

func showFront2(w http.ResponseWriter, r *http.Request) {

	template, _ := template.ParseFiles("prueba.html")
	template.Execute(w, "Proyecto")
}
