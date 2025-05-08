const readline = require('readline'); // Importa o módulo readline, que permite interagir com o usuário via terminal (input/output)
const tarefas = require('./tarefas'); // Importa o módulo local que contém as funções de manipulação de tarefas

// obj de iteração com usuário
const rl = readline.createInterface({
    input: process.stdin,  // captura entradas do teclado 
    output: process.stdout // exibe saídas no terminal
});

function menu() {
    console.log('\n>>>> GERENCIADOR DE TAREFAS <<<<');
    console.log('1 - Adicionar tarefa');
    console.log('2 - Listar tarefas');
    console.log('3 - Remover tarefa');
    console.log('4 - Alterar status de tarefa');
    console.log('5 - Filtrar tarefas por palavra-chave');
    console.log('6 - Editar nome da tarefa');
    console.log('0 - Sair');
    rl.question('Escolha uma opção: ', opcao => {
        switch (opcao) {
            case '1':
                rl.question('Descrição da tarefa: ', desc => {
                    rl.question('Prioridade (1 - Alta, 2 - Média, 3 - Baixa): ', nivel => {
                        tarefas.adicionarTarefa(desc, nivel);
                        menu();
                    });
                });
                break;
            case '2':
                tarefas.listarTarefas();
                menu();
                break;
            case '3':
                rl.question('ID da tarefa a remover: ', id => {
                    tarefas.removerTarefa(id);
                    menu();
                });
                break;
            case '4':
                rl.question('ID da tarefa para alterar status: ', id => {
                    rl.question('Novo status (1 - Não iniciada, 2 - Iniciada, 3 - Finalizada): ', status => {
                        tarefas.alterarStatus(id, status);
                        menu();
                    });
                });
                break;
            case '5':
                rl.question('Palavra-chave para filtro: ', palavra => {
                    tarefas.listarTarefas(palavra);
                    menu();
                });
                break;
            case '6':
                rl.question('ID da tarefa a editar: ', id => {
                    const tarefasTemp = require('./tarefas');
                    const all = require('fs').readFileSync('./data.json');
                    const data = JSON.parse(all);
                    const tarefa = data.find(t => t.id === Number(id));
                    if (!tarefa) {
                        console.log('⚠️ Tarefa não encontrada.');
                        return menu();
                    }
                    rl.question('Nova descrição: ', desc => {
                        tarefas.editarTarefa(id, desc);
                        menu();
                    });
                });
                break;
            case '0':
                rl.close();
                break;
            default:
                console.log('❌ Opção inválida.');
                menu();
        }
    });
}

menu();
