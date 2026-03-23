// Variáveis globais
let arrayDisciplinas = [];
const listaDisciplinas = document.getElementById('lista-disciplinas');
const mensagemVazia = document.getElementById('mensagem-vazia');
const btnCadastrar = document.getElementById('btn-cadastrar');
const totalHorasGlobal = document.getElementById('total-horas-global');

function carregarDados() {
    const dadosSalvos = localStorage.getItem('estudos_disciplinas');
    if (dadosSalvos) {
        arrayDisciplinas = JSON.parse(dadosSalvos);
    }
    renderizarDisciplinas();
}
function salvarDados() {
    localStorage.setItem('estudos_disciplinas', JSON.stringify(arrayDisciplinas));
}
btnCadastrar.addEventListener('click', function() {
    const nomeInput = document.getElementById('input-disciplina');
    const profInput = document.getElementById('input-professor');
    const cargaInput = document.getElementById('input-carga');
    const areaInput = document.getElementById('select-area');

    if (!nomeInput.value || !profInput.value || !cargaInput.value) {
        alert("Por favor, preencha todos os campos obrigatórios!");
        return;
    }

    const novaDisciplina = {
        id: Date.now(), 
        nome: nomeInput.value,
        professor: profInput.value,
        cargaTotal: parseInt(cargaInput.value),
        area: areaInput.value,
        horasEstudadas: 0
    };

    arrayDisciplinas.push(novaDisciplina);
    salvarDados();
    
    nomeInput.value = '';
    profInput.value = '';
    cargaInput.value = '';
    
    renderizarDisciplinas();
});

function renderizarDisciplinas() {
    listaDisciplinas.innerHTML = '';
    let somaTotalHoras = 0;

    if (arrayDisciplinas.length === 0) {
        mensagemVazia.style.display = 'block';
    } else {
        mensagemVazia.style.display = 'none';
    }

    arrayDisciplinas.forEach(function(disciplina) {
        let percentual = (disciplina.horasEstudadas / disciplina.cargaTotal) * 100;
        if (percentual > 100) percentual = 100;

        somaTotalHoras += disciplina.horasEstudadas;

        let li = document.createElement('li');
        li.style.background = "#fff";
        li.style.padding = "20px";
        li.style.borderRadius = "10px";
        li.style.border = "1px solid #ddd";
        li.style.borderLeft = "5px solid #007bff";

        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 250px;">
                    <h3 style="color: #2c3e50; font-size: 20px; margin-bottom: 5px;">${disciplina.nome}</h3>
                    <p style="color: #555; font-size: 14px; margin-bottom: 3px;"><strong>Professor:</strong> ${disciplina.professor}</p>
                    <p style="color: #555; font-size: 14px; margin-bottom: 3px;"><strong>Área:</strong> ${disciplina.area}</p>
                    <p style="color: #555; font-size: 14px;"><strong>Carga Total:</strong> ${disciplina.cargaTotal}h</p>
                </div>

                <div style="flex: 1; min-width: 250px; text-align: right;">
                    <p style="font-size: 18px; color: #2c3e50; margin-bottom: 5px;">Estudado: <strong>${disciplina.horasEstudadas}h</strong></p>
                    <p style="font-size: 14px; color: #888; margin-bottom: 10px;">Progresso: ${percentual.toFixed(1)}%</p>
                    
                    <div class="acoes-card" style="margin-top: 15px;">
                        <button class="btn-horas" onclick="adicionarHoras(${disciplina.id})">+ Horas</button>
                        <button class="btn-editar" onclick="editarDisciplina(${disciplina.id})">Editar</button>
                        <button class="btn-excluir" onclick="excluirDisciplina(${disciplina.id})">Excluir</button>
                    </div>
            </div>
        `;
        listaDisciplinas.appendChild(li);
    });

    totalHorasGlobal.innerText = `${somaTotalHoras}h`;
}
// Adicionar horas estudadas
function adicionarHoras(id) {
    const horasExtras = prompt("Quantas horas você quer adicionar a esta disciplina?");
    
    if (horasExtras !== null && horasExtras.trim() !== "" && !isNaN(horasExtras) && Number(horasExtras) > 0) {
        
        const disciplina = arrayDisciplinas.find(d => d.id === id);
        
        if (disciplina) {
            disciplina.horasEstudadas += Number(horasExtras);
            
            salvarDados(); // Salvar no LocalStorage a atualização
            renderizarDisciplinas();
        }
    } else if (horasExtras !== null) {
        alert("Por favor, digite um número válido de horas.");
    }
}

// Excluir disciplina
function excluirDisciplina(id) {
    const confirmacao = confirm("Tem certeza que deseja excluir esta disciplina?");
    
    if (confirmacao) {
        arrayDisciplinas = arrayDisciplinas.filter(d => d.id !== id);
        
        salvarDados();
        renderizarDisciplinas();
    }
}
// Editar disciplina
function editarDisciplina(id) {
    const disciplina = arrayDisciplinas.find(d => d.id === id);
    
    if (disciplina) {
        const novoNome = prompt("Editar Nome da Disciplina:", disciplina.nome);
        const novoProf = prompt("Editar Professor:", disciplina.professor);
        const novaCarga = prompt("Editar Carga Horária Total (apenas números):", disciplina.cargaTotal);
        const novaArea = prompt("Editar Área (Exatas, Humanas, Biológicas ou Tecnologia):", disciplina.area);
        if (novoNome && novoProf && novaCarga && novaArea) {
            
            if (isNaN(novaCarga) || Number(novaCarga) <= 0) {
                alert("A carga horária deve ser um número maior que zero!");
                return;
            }
            disciplina.nome = novoNome.trim();
            disciplina.professor = novoProf.trim();
            disciplina.cargaTotal = parseInt(novaCarga);
            disciplina.area = novaArea.trim();
            // Salva as alterações e atualiza a tela
            salvarDados();
            renderizarDisciplinas();
            
        } else {
            alert("Edição cancelada ou campos deixados em branco.");
        }
    }
}
carregarDados();