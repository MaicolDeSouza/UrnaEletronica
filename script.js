const seuVotoPara = document.querySelector('.d-1-1 span'); // Seleciona o span "Seu voto para"
const cargo = document.querySelector('.d-1-2 span');
const descricao = document.querySelector('.d-1-4');
const aviso = document.querySelector('.d-2');
const lateral = document.querySelector('.d-1-right');
const numeros = document.querySelector('.d-1-3');

let etapaAtual = 0;
let numero = '';    //Variavel para armazenar os numeros digitados
let votoBranco = true;
let votos = []; // Armazena os votos

// Etapa que limpa a tela e deixa pronta para votar
function iniciarEtapa() {
    let etapa = etapas[etapaAtual]; // Armazena na variavel etapa todo o conteudo do elemento 0 do prog. etapas.js
    let numeroHtml = '';

    numero = ''; // Limpa o numero para receber novos digitos
    votoBranco = false;



    // Esse for cria os quadrados dos numeros da tela conforme a quantidade em numeros no prog. etapas.js
    // Se o numero for 5 ira criar 5x o '<div class="numero"></div>'
    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0){ // No incio da etapa devemos piscar apenas o primeiro digito
            numeroHtml = '<div class="numero pisca"></div>' // Cria o digito piscante
        }
        else{
            numeroHtml += '<div class="numero"></div>';     // Cria demais digitos sem pisca
        }
    }
    
    seuVotoPara.style.display = 'none';
    cargo.innerHTML = etapa.titulo; // Busca dados do titulo dentro da varaivel etapa que recebe o array0 do prog. etapas.js
    descricao.innerHTML = '';
    aviso.style.display = 'none'
    lateral.innerHTML = '';
    numeros.innerHTML = numeroHtml; // Carrega a quantidade de '<div class="numero"></div>' conforme o for acima
}

function atualizaInterface() {
     //console.log('Atualizando interface');
     //console.log(numero);

     let etapa = etapas[etapaAtual]; // Armazena na variavel etapa todo o conteudo do elemento 0 do prog. etapas.js
     console.log(etapa);
     
     // Fizemos um filtro na lista de canditados, quando encontrar um canditado corresposndente 
     // ao numero digitado, retorna os dados do canditado
     let candidato = etapa.candidatos.filter((item)=>{
         if(item.numero === numero){
            // console.log(item);
             return true;
         }else{
             return false;
         }
     });
    //console.log(candidato);
    // console.log(candidato[0].nome);

    if (candidato.length > 0){ // Verificamos se existe canditado na variavel canditado
        seuVotoPara.style.display = 'block'; // Para mostrar o texto
        aviso.style.display = 'block';    // Para mostrar o texto
        descricao.innerHTML = `Nome: ${candidato[0].nome}<br/> Partido: ${candidato[0].partido}` ;

        let fotosHtml = ''; // Variavel que armezana html para as fotos

        // Cria o HTML para exibir a foto do canditado
      for (let i in candidato[0].fotos){ // Extrai a foto do canditado atual
        if(candidato[0].fotos[i].small){ // Verifica se existe foto small(vice-prefeito) na etapa do prefeito
            fotosHtml += `
            <div class="d-1-image small"> 
            <img src="/images/${candidato[0].fotos[i].url}" alt="">
            ${candidato[0].fotos[i].legenda} </div>`
        }else{  // Caso nao exista small imprimi a foto normal
            fotosHtml += `
            <div class="d-1-image"> 
            <img src="/images/${candidato[0].fotos[i].url}" alt="">
            ${candidato[0].fotos[i].legenda} </div>`
        }
      }
      lateral.innerHTML = fotosHtml; // Exibe a foto da tela
    }else{ // Caso voto nulo
        seuVotoPara.style.display = 'block'; // Para mostrar o texto
        aviso.style.display = 'block';    // Para mostrar o texto
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>'
    }
}

// Funcao chamada quando algum numero for pressionado
function clicou(n){
    //alert('clicou em '+ n);
    let elNumero = document.querySelector('.numero.pisca'); // Salva na variavel o digito que esta piscando
    if (elNumero !== null) {    // Se elNumero nao é null indica que existe numero piscando 
        elNumero.innerHTML = n; // Entao escreve o numero na casa piscante 
        numero = `${numero}${n}`; // concatena os numeros digitados

        elNumero.classList.remove('pisca'); // Assim que preencher numero vai parara de piscar, retiramos a classe pisca.

        // Abaixo verificamos o proximo elemento e vai retornar '<div class="numero"></div>'
        // Ai podemos adicionar a classe pisca a esse elemento desta forma o proximo digito ira piscar
        if (elNumero.nextElementSibling !== null){ // Apenas verificamos se existe proximo elemento
         elNumero.nextElementSibling.classList.add('pisca');
        }
        else{
            atualizaInterface(); // Para carregar demais dados conforme o numero digitado
        }
    }
}

// Funcao chamada quando botao branco for pressionado
function branco() {
    // alert('clicou em branco');
    if(numero === ''){
        votoBranco = true;
        seuVotoPara.style.display = 'block'; // Para mostrar o texto
        aviso.style.display = 'block';    // Para mostrar o texto
        numeros.innerHTML = '';
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>'
    }else{
        alert('Para votar em BRANCO, nao pode digitar nenhum numero.')
    }
}

// Funcao chamada quando botao corrige for pressionado
function corrige() {
    // alert('clicou em corrige');
    iniciarEtapa();
}

// Funcao chamada quaundo botao confirma for pressionado
function confirma() {
    // alert('clicou em confirma');

    let votoConfirmado = false;
    let etapa = etapas[etapaAtual]; // Armazena na variavel etapa todo o conteudo do elemento 0 do prog. etapas.js
    if(numero.length === etapa.numeros){ // Verifica se todos os digitos foram preenchidos
        votoConfirmado = true;
        // Na etapa abaixo salvamos a etapa do voto e o valor votado, para enviar a DB posteriormente
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        });
    }
    else if(votoBranco){  // Caso o voto tenha sido branco
        votoConfirmado = true;
        // Na etapa abaixo salvamos a etapa do voto e o valor votado, para enviar a DB posteriormente
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'Branco'
        });
    }

    if (votoConfirmado){
        etapaAtual++; // Passa para proxima etapa;
        if (etapas[etapaAtual] !== undefined){ // Verifica se existe mais uma etapa
            iniciarEtapa();  
        }else{
            document.querySelector('.tela').innerHTML = '<div class="aviso--gigante pisca">FIM</div>';
            console.log(votos); // Imprimi os votos nos console
        }
    }
}

iniciarEtapa();