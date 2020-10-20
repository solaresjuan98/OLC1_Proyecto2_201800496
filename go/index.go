package main

import (
	"html/template"
	"net/http"
)

func main() {

	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css/"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js/"))))
	http.Handle("/codemirror/", http.StripPrefix("/codemirror/", http.FileServer(http.Dir("codemirror/"))))
	//http.Handle("/go/", http.StripPrefix("/go/", http.FileServer(http.Dir("go/"))))

	//http.Handle("/go/", http.FileServer(http.Dir("/jquery-1.7.2.min.js")))

	http.HandleFunc("/", showFront)
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
