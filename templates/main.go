package main

import (
	"html/template"
	"net/http"
)

func main() {
	//fmt.Println("Templates")
	http.HandleFunc("/", show)
	http.ListenAndServe(":3000", nil)
	//title.fTitle
}

func show(w http.ResponseWriter, r *http.Request) {
	title := Title{"Proyecto", "juan"}
	template, _ := template.ParseFiles("index.html")
	template.Execute(w, title)

}

type Title struct {
	fTitle, fname string
}
