"use strict";

/**
 * Seção header, botão filtro e botão escurecer
 */

document.getElementById("menuBotao").onclick = function() {mostrar()};
let tema = JSON.parse(localStorage.getItem('tema'));

function escurecerClarear(){
    tema = tema == 'claro' || tema == null ? 'escuro' : 'claro';
    atualizarTela();
}

function mostrar() {
    document.getElementById("menuPrincipal").classList.toggle("mostrar");
}

// Troca nome da página, guarda no banco: Torna o item em string e adiciona no banco sobrescrevendo item da chave

let nomePag = JSON.parse(localStorage.getItem('nomePagina'));

if(nomePag == null){
    localStorage.setItem('nomePagina', JSON.stringify('Todos os Itens'))
}

function trocaNome(nomePagina){
    localStorage.setItem('nomePagina', JSON.stringify(nomePagina)) 
    document.getElementById("menuPrincipal").classList.toggle("esconder");
}
document.getElementById("principal").innerHTML = JSON.parse(localStorage.getItem('nomePagina'));


/**
 * Itens e localStorage
 */

let produtos =  [
    {item: 'Batata', status: '', valor:''}, 
    {item: 'Pão', status: 'checked', valor:'45'}
]

let nomeDaPagina = document.getElementById("principal").innerHTML;

let db = JSON.parse(localStorage.getItem('db'));

if(db == null){
    atualizaLocalStorage('db', produtos);
}else{
    produtos = db;
}

/* Inserir e buscar item no localStorage */

function adicionarNoLocalStorage(chave, item) {
    // Pega array do banco
    let dadosBancoNestaChave = pegarDoLocalStorage(chave);

    // Adiciona item
    dadosBancoNestaChave.push(item);

    localStorage.setItem(chave, JSON.stringify(dadosBancoNestaChave));

    return dadosBancoNestaChave;
}

function atualizaLocalStorage(antigo, novo){
    localStorage.setItem(antigo, JSON.stringify(novo));
}

function pegarDoLocalStorage(chave) {
    return JSON.parse(localStorage.getItem(chave));
}

/**
 * Inserindo na tela e passando para o banco
 */

/* Cria item html para inserir na lista */
function criarItem(descricaoProduto, status, indice){
    const item = document.createElement('label');
    item.classList.add('item');
    item.innerHTML = `
        <input " type="checkbox" id="itemCheckBox" name="valor" data-indice=${indice} onchange="comprar(this)" value="example" ${status}>
        <div id="descricaoProdutoDiv">${descricaoProduto}</div>
        <input type="button" value="X" data-indice=${indice}>
    `
    document.getElementById('listaCompras').appendChild(item);  
}

//Limpa itens da tela
function limparItens(){
    const listaCompras = document.getElementById('listaCompras');
    while(listaCompras.firstChild){
        listaCompras.removeChild(listaCompras.lastChild);
    }
}

//Para cada item no array produtos cria-se um item html na tela, filtrando para separar cada tipo de item
function atualizarTela(){
    
    localStorage.setItem('tema', JSON.stringify(tema));
    limparItens();
    let soma = 0;
    let produtosComprados = produtos.filter(produto => produto.status == 'checked');
    produtosComprados.forEach(produto => {
        soma += parseFloat(produto.valor);
    });
    if(nomeDaPagina == 'Todos os Itens'){
        produtos.forEach((produto, indice) => criarItem(produto.item, produto.status, indice));
        document.getElementById("numeroDeItens").innerHTML = 'Número de Itens: ' + produtos.length;
        document.getElementById("valorTotalDosItens").innerHTML = 'Valor total: ' + soma;
    }else if(nomeDaPagina == 'Comprados'){
        produtosComprados.forEach((produto, indice) => criarItem(produto.item, produto.status, indice));
        document.getElementById("numeroDeItens").innerHTML = 'Número de Itens: ' + produtosComprados.length;
        document.getElementById("valorTotalDosItens").innerHTML = 'Valor total: ' + soma;
    }else if(nomeDaPagina == 'Pendentes'){
        let produtosPendentes = produtos.filter(produto => produto.status == '');
        produtosPendentes.forEach((produto, indice) => criarItem(produto.item, produto.status, indice));
        document.getElementById("numeroDeItens").innerHTML = 'Número de Itens: ' + produtosPendentes.length;
        document.getElementById("valorTotalDosItens").innerHTML = 'Valor total: ' + soma;
    }

    if(tema == 'escuro'){
        document.documentElement.style.setProperty("--primeira-cor","#1f2e2e");
        document.documentElement.style.setProperty("--segunda-cor","black");
        document.documentElement.style.setProperty("--terceira-cor","#4a4b4d");
    }else if(tema == 'claro'){
        document.documentElement.style.setProperty("--primeira-cor","#fdfdfc");
        document.documentElement.style.setProperty("--segunda-cor","#2791d8");
        document.documentElement.style.setProperty("--terceira-cor","#3fa2c9");
    }
}

//Remove item de Produtos
function removerItem(indice){
    produtos.splice(indice, 1);
    atualizarTela();
}

// Checkbox comprar item
function comprar(elemento) {
    if (!elemento.checked) {
        return false;
    } else {
        if (pegaValorPrompt(elemento)){
            return true;
        }else{
            elemento.checked = true;   
        } 
    }
}

//Valor do produto inserido, deve have e deve ser maior que zero
function pegaValorPrompt(elemento){
    let valorInput = prompt("Qual o valor do produto ?");
    while(valorInput == '' || !numero(valorInput) || valorInput === null || valorInput <= 0){
        valorInput = prompt("Deve conter um valor numérico !\nO Valor Deve Ser Maior do que Zero !\nQual o valor do produto ?");
        elemento.checked = false;
    }
    function numero(numero){
        return !isNaN(numero)
    }
    const index = elemento.dataset.indice;
    produtos[index].valor = valorInput;
    atualizaLocalStorage('db', produtos);
    atualizarTela();
}

//Retorna  Item clicado
function clickedItem(evento){
    const elemento = evento.target;
    if(elemento.type == 'button'){
        const index = elemento.dataset.indice;
        removerItem(index);
        atualizaLocalStorage('db', produtos);
    }else if(elemento.type === 'checkbox'){
        const index = elemento.dataset.indice;
        produtos[index].status = produtos[index].status === '' ? 'checked' : '';
        produtos[index].valor = produtos[index].status === '' ? '' : produtos[index].valor;
        atualizaLocalStorage('db', produtos);
    }
}
document.getElementById('listaCompras').addEventListener('click', clickedItem);

//Pega novo item do input e insere no array e no banco no banco
function inserirItem(){
    let descricaoProduto = document.getElementById('inputNovoItem').value;
    if(descricaoProduto != ''){
        produtos.push({item: `${descricaoProduto}`, status: ''}); 
        produtos = adicionarNoLocalStorage('db', {item: `${descricaoProduto}`, status: '', valor: ''});   
    }else{
        alert('O Produto Deve Conter uma Descrição !')
    }
    atualizarTela();
}

atualizarTela();