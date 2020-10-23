package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
)

var nodeURL = ""

func main() {

	nodeip, defip := os.LookupEnv("NODEIP")
	nodeport, defport := os.LookupEnv("NODEPORT")

	if !defip {
		nodeip = "182.18.7.7"
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

	http.HandleFunc("/", showFront)

	fmt.Println(" Listening on IP:" + ip + " and PORT:" + port)
	fmt.Println(nodeURL)
	http.ListenAndServe(":3000", nil)

	/*
		http requests
		resp, err := http.Get("http://localhost:5000/api/test")
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
		r, e := http.Post("http://localhost:5000/api/data",
			"application/json", bytes.NewBuffer(reqBody))
		if e != nil {
			print(e)
		}

		defer r.Body.Close()
		body, errr := ioutil.ReadAll(r.Body)
		if errr != nil {
			print(errr)
		}
		fmt.Println(string(body))

		fmt.Print(string(body))
	*/
}

func showFront(w http.ResponseWriter, r *http.Request) {

	template, _ := template.ParseFiles("index.html")
	template.Execute(w, "Proyecto")
}
