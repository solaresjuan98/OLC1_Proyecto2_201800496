package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
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

type info struct {
	Info string
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

	http.HandleFunc("/tokens", showFront2)
	http.HandleFunc("/", showFront)
	fmt.Println(" Listening on IP:" + ip + " and PORT:" + port)
	fmt.Println(nodeURL)
	fmt.Println()
	http.ListenAndServe(":"+port, nil)

}

var infoURL = ""

func getReport(w http.ResponseWriter, r *http.Request) {

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

	fmt.Printf(ip)
	fmt.Print(port)
	infoURL = "http://" + nodeip + ":" + nodeport + "/api/info"

	// get request to /api/info to show the report in console
	response, err := http.Get(infoURL)

	if err != nil {
		log.Fatalln(err)
	}

	defer response.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(response.Body)

	log.Printf(string(bodyBytes))

	var i info
	_ = json.Unmarshal(bodyBytes, &i)

}

func showFront(w http.ResponseWriter, r *http.Request) {

	template, _ := template.ParseFiles("index.html")
	template.Execute(w, "Proyecto")
}

func showFront2(w http.ResponseWriter, r *http.Request) {

	template, _ := template.ParseFiles("prueba.html")
	template.Execute(w, "Proyecto")
}
