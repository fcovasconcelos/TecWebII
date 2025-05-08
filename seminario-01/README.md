📝 Gerenciador de Tarefas (Node.js - Terminal App)

 
Este é um projeto de aplicação de terminal desenvolvida em Node.js que permite cadastrar, listar, remover e gerenciar tarefas, utilizando:

Módulos personalizados

Manipulação de arquivos (JSON)

Entrada de dados via terminal

A aplicação gerencia tarefas com suporte a prioridades, status, data/hora de criação, edição e filtro por palavra-chave.

🎯 Funcionalidades implementadas
A aplicação exibe o seguinte menu de opções no terminal:

 >>>> GERENCIADOR DE TAREFAS <<<<

1 - Adicionar tarefa

2 - Listar tarefas

3 - Remover tarefa

4 - Alterar status de tarefa

5 - Filtrar tarefas por palavra-chave

6 - Editar nome da tarefa

0 - Sair


✅ Adicionar tarefa: permite cadastrar uma nova tarefa com descrição e prioridade.

✅ Listar tarefas: exibe todas as tarefas salvas, ordenadas por prioridade e data (tarefas finalizadas aparecem ao final).

✅ Remover tarefa: remove uma tarefa informando o ID (apenas se estiver como "Não iniciada").

✅ Alterar status: atualiza o status da tarefa para "Não iniciada", "Iniciada" ou "Finalizada".

✅ Filtrar por palavra-chave: lista apenas as tarefas cujo nome contém uma palavra-chave.

✅ Editar nome da tarefa: permite alterar a descrição de uma tarefa existente.

✅ Registro de data/hora de criação: cada tarefa armazena a data/hora no formato DD/MM/YYYY HH:MM.

✅ Persistência de dados em arquivo data.json.

📂 Estrutura do projeto

├── app.js          // Arquivo principal que roda o menu e interage com o usuário

├── tarefas.js      // Módulo com as funções de manipulação de tarefas

├── data.json       // Arquivo JSON onde as tarefas são armazenadas

└── README.md       // Este arquivo de documentação


💡 Detalhes técnicos
Tarefas são armazenadas em um array de objetos JSON no arquivo data.json.

Cada tarefa contém:

id: número único

descricao: descrição da tarefa

criadaEm: data/hora de criação

prioridade: Alta, Média ou Baixa

status: Não iniciada, Iniciada ou Finalizada

As tarefas são ordenadas por:

Status (pendentes primeiro)

Prioridade (Alta > Média > Baixa)

Data de criação (mais antigas primeiro)

📌 Validações implementadas
Prioridade inválida → aviso de erro.

Status inválido → aviso de erro.

Tarefa não encontrada pelo ID → aviso de erro.

Só permite remover tarefas com status "Não iniciada".
