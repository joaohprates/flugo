# Desafio Frontend - Flugo

Aplicação de cadastro de funcionários em formato multi-step desenvolvida com:

- ReactJS
- TypeScript
- Material UI
- Firebase (Firestore)
- Vite

---

## 🔗 Deploy

A aplicação está disponível em:

https://flugovercel.vercel.app/

---

## 📦 Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/joaohprates/flugo.git
cd flugo
```

---

### 2. Instale as dependências

```bash
npm install
```

---

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

No console do Firebase, ao criar um app do tipo **Web**, copie as credenciais exibidas e preencha o arquivo `.env` com:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

### 4. Execute o projeto

```bash
npm run dev
```

Acesse no navegador:

```
http://localhost:5173
```

---

## ✨ Funcionalidades

- Formulário multi-step
- Validação de campos obrigatórios
- Validação de e-mail único
- Persistência de dados no Firebase
- Listagem com ordenação
- Layout fiel ao protótipo do Figma
- Deploy em ambiente remoto (Vercel)