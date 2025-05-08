const fs = require('fs');   // Importa o módulo "fs" (File System), para manipular arquivos no disco
const path = './data.json'; // Define o caminho do arquivo onde as tarefas serão salvas

function carregarTarefas() {
    if (!fs.existsSync(path)) return []; // Se o arquivo não existir, retorna um array vazio
    const data = fs.readFileSync(path, 'utf8'); // Lê o conteúdo do arquivo como string
    return JSON.parse(data || '[]'); // Converte o conteúdo para um array de objetos (JSON)
}

function salvarTarefas(tarefas) {
    fs.writeFileSync(path, JSON.stringify(tarefas, null, 2)); // Salva as tarefas no arquivo, com indentação de 2 espaços
}

// Se não houver tarefas começa do ID 1, caso contrario, pega o maior ID e soma 1
function gerarProximoId(tarefas) {
    if (tarefas.length === 0) return 1; 
    return Math.max(...tarefas.map(t => t.id)) + 1;
}

// Pega a data e hora atual e converte para formato dd/mm/aaaa HH:MM
function dataHoraFormatada() {
    const agora = new Date();
    const dia = agora.getDate().toString().padStart(2, '0');
    const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
    const ano = agora.getFullYear();
    const horas = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

// Mapeia texto da prioridade para números e retorna o número; se não encontrado, retorna 4
function tipoPrioridade(valor) {
    const mapa = { ALTA: 1, MÉDIA: 2, BAIXA: 3 };
    return mapa[valor.toUpperCase()] || 4;
}

// Constrói um objeto Date (formato ISO)
function parseData(data) {
    const [d, m, yHora] = data.split('/');
    const [y, hora] = yHora.split(' ');
    return new Date(`${y}-${m}-${d}T${hora}:00`);
}

// retorna a descrição da prioridade conforme valor informado
function mapearPrioridade(num) {
    switch (num) {
        case '1': return 'Alta';
        case '2': return 'Média';
        case '3': return 'Baixa';
        default: return null;
    }
}

// retorna a descrição  confordo status conforme valor informado
function mapearStatus(num) {
    switch (num) {
        case '1': return 'Não iniciada';
        case '2': return 'Iniciada';
        case '3': return 'Finalizada';
        default: return null;
    }
}

// add nova tarefa
function adicionarTarefa(descricao, prioridadeNum) {
    const prioridade = mapearPrioridade(prioridadeNum);
    if (!prioridade) { // valida prioridade existente
        console.log('❌ Prioridade inválida. Use 1 (Alta), 2 (Média) ou 3 (Baixa).');
        return;
    }

    const tarefas = carregarTarefas();
    const novaTarefa = {
        id: gerarProximoId(tarefas),
        descricao,
        criadaEm: dataHoraFormatada(),
        prioridade,
        status: 'Não iniciada'
    };
    tarefas.push(novaTarefa);
    salvarTarefas(tarefas);
    console.log('✅ Tarefa adicionada com sucesso.');
}

function listarTarefas(filtrarPorPalavra) {
    const tarefas = carregarTarefas();

    // filtra as tarefas por texto informado
    const filtradas = filtrarPorPalavra
        ? tarefas.filter(t => t.descricao.toLowerCase().includes(filtrarPorPalavra.toLowerCase()))
        : tarefas;

    // Separar finalizadas das outras
    const naoFinalizadas = filtradas.filter(t => t.status !== 'Finalizada');
    const finalizadas = filtradas.filter(t => t.status === 'Finalizada');

    // Ordenar não finalizadas por prioridade e data
    const ordenadasNaoFinalizadas = naoFinalizadas.sort((a, b) => {
        const prioridadeA = tipoPrioridade(a.prioridade);
        const prioridadeB = tipoPrioridade(b.prioridade);
        if (prioridadeA !== prioridadeB) return prioridadeA - prioridadeB;
        return parseData(a.criadaEm) - parseData(b.criadaEm);
    });

    // Ordenar finalizadas apenas por data
    const ordenadasFinalizadas = finalizadas.sort((a, b) => {
        return parseData(a.criadaEm) - parseData(b.criadaEm);
    });

    // Junta os dois grupos com as finalizadas no fim
    const ordenadas = [...ordenadasNaoFinalizadas, ...ordenadasFinalizadas];

    if (ordenadas.length === 0) {
        console.log('⚠️ Nenhuma tarefa encontrada.');
    } else {
        console.log(`\n--------------------------------------------------`);
        ordenadas.forEach(tarefa => {
            console.log(`\n[${tarefa.status === 'Finalizada' ? '✔' : ' '}] ID: ${tarefa.id}`);
            console.log(`   Descrição : ${tarefa.descricao}`);
            console.log(`   Criada em : ${tarefa.criadaEm}`);
            console.log(`   Prioridade: ${tarefa.prioridade}`);
            console.log(`   Status    : ${tarefa.status}`);
        });
        console.log(`\n--------------------------------------------------`);
    }
}

// remove a tarefa informada exceto se Não iniciada
function removerTarefa(id) {
    let tarefas = carregarTarefas();
    const tarefa = tarefas.find(t => t.id === Number(id));
    if (!tarefa) {
        console.log('⚠️ Tarefa não encontrada.');
        return;
    }

    if (tarefa.status !== 'Não iniciada') {
        console.log('❌ Apenas tarefas "Não iniciadas" podem ser removidas.');
        return;
    }

    tarefas = tarefas.filter(t => t.id !== Number(id));
    salvarTarefas(tarefas);
    console.log('🗑️ Tarefa removida.');
}

function alterarStatus(id, statusNum) {
    const tarefas = carregarTarefas();
    const tarefa = tarefas.find(t => t.id === Number(id));
    if (!tarefa) {
        console.log('⚠️ Tarefa não encontrada.');
        return;
    }

    const novoStatus = mapearStatus(statusNum);
    if (!novoStatus) {
        console.log('❌ Status inválido. Use 1 (Não iniciada), 2 (Iniciada), 3 (Finalizada).');
        return;
    }

    tarefa.status = novoStatus;
    salvarTarefas(tarefas);
    console.log('🔄 Status atualizado com sucesso.');
}

function editarTarefa(id, novaDescricao) {
    const tarefas = carregarTarefas();
    const tarefa = tarefas.find(t => t.id === Number(id));
    if (!tarefa) {
        console.log('⚠️ Tarefa não encontrada.');
        return;
    }

    tarefa.descricao = novaDescricao;
    salvarTarefas(tarefas);
    console.log('✏️ Tarefa editada com sucesso.');
}
// exporta as funções
module.exports = {
    adicionarTarefa,
    listarTarefas,
    removerTarefa,
    alterarStatus,
    editarTarefa
};
