# Jota-Quali

Sistema de gestão de qualidade para controle de equipamentos, calibrações, auditorias, padrões de referência e obras.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:
- `backend/`: API em Node.js (Express) com banco de dados.
- `frontend/`: Aplicação web construída com React, Vite e Shadcn UI.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (Versão 18 ou superior)
- Gerenciador de pacotes (`npm` ou `bun`)
- Banco de Dados configurado (SQL Server ou correspondente utilizado pelo MikroORM)

---

## 🚀 Guia de Implantação e Configuração

### 1. Configurando o Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configuração de Variáveis de Ambiente:
   Crie um arquivo `.env` na raiz da pasta `backend/` e preencha as variáveis de banco de dados e as **chaves de API para os serviços de Inteligência Artificial**. 
   
   *Exemplo de `.env`:*
   ```env
   # Configurações do Banco de Dados
   DB_HOST=localhost
   DB_PORT=1433
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   DB_NAME=jota_quali
   PORT=3000

   # Configurações de Inteligência Artificial (Integração OpenAI)
   OPENAI_API_KEY=sk-sua-chave-api-da-openai-aqui
   ```
4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

### 2. Configurando o Frontend

1. Em outro terminal, navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação:
   ```bash
   npm run dev
   ```
4. Acesse a aplicação no navegador através do endereço `http://localhost:5173`.

---

## 🤖 Integração com Inteligência Artificial

O Jota-Quali utiliza serviços de IA (OpenAI) para otimizar e apoiar a tomada de decisão em avaliações de qualidade, tais como:
- **Análise preditiva e sumários de relatórios de calibração:** O sistema processa históricos e desvios de equipamentos, auxiliando gestores na identificação rápida de equipamentos não conformes.
- **Aviso:** Para que o módulo de IA da aplicação funcione, é mandatório que a variável `OPENAI_API_KEY` seja preenchida corretamente no `.env` do backend. Caso o limite de tokens da conta seja excedido ou a chave seja inválida, a aplicação fará o fallback gracefully para a exibição padrão de relatórios sem insights da IA.
