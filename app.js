"use strict";

let nomePag = '';

function trocaNome(nomePagina){
    localStorage.setItem('nomePagina', JSON.stringify(nomePagina)) 
    document.getElementById("menuPrincipal").classList.toggle("esconder");
}

document.getElementById("principal").innerHTML = JSON.parse(localStorage.getItem('nomePagina'));

document.getElementById("menuBotao").onclick = function() {mostrar()};

function mostrar() {
    document.getElementById("menuPrincipal").classList.toggle("mostrar");
}