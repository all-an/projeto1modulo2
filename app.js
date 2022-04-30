"use strict";

let nomePag = '';

function trocaNome(nomePagina){
    localStorage.setItem('nomePagina', JSON.stringify(nomePagina)) 
}

document.getElementById("principal").innerHTML = JSON.parse(localStorage.getItem('nomePagina'));