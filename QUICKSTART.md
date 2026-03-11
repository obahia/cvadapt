# 🚀 Começando com CVAdapt

## Pré-requisitos

- Node.js 18+ instalado
- Chave de API do Gemini (obtenha em https://ai.google.dev/)

## Setup Rápido (5 minutos)

### 1. Configurar variáveis de ambiente

```bash
# Editar backend/.env
echo "GEMINI_API_KEY=sua-chave-aqui" > backend/.env
echo "PORT=3001" >> backend/.env
echo "NODE_ENV=development" >> backend/.env
echo "LOG_LEVEL=INFO" >> backend/.env
```

### 2. Instalar dependências

```bash
npm run install:all
```

### 3. Iniciar servidor

```bash
npm run dev
```

Você verá:
```
[...] [Server] CVAdapt API running at http://localhost:3001
```

### 4. Testar (novo terminal)

```bash
cd backend
npm run test:api
```

Esperado: `6/6 testes passando ✅`

## Primeiro Uso - Fluxo Completo

### 1. Obter CV Fonte
```bash
curl http://localhost:3001/api/cv | jq '.contato'
```

### 2. Adicionar Experiência
```bash
curl -X POST http://localhost:3001/api/updater \
  -H "Content-Type: application/json" \
  -d '{
    "mensagem": "Trabalhei na Google como Senior Developer de Janeiro a Junho de 2024, desenvolvendo em Python e GCP"
  }' | jq '.alteracoes'
```

### 3. Adaptar para Vaga
```bash
curl -X POST http://localhost:3001/api/adapter \
  -H "Content-Type: application/json" \
  -d '{
    "vaga": "Procuramos Python Developer com experiência em GCP e arquitetura de microsserviços",
    "idioma": "pt"
  }' | jq '.score_match'
```

### 4. Revisar Qualidade
```bash
curl -X POST http://localhost:3001/api/reviewer \
  -H "Content-Type: application/json" \
  -d '{
    "cv_adaptado": { ... cv do step 3 ... }
  }' | jq '.scores'
```

## Estrutura de Arquivos

```
cvadapt/
├── backend/
│   ├── routes/          # Endpoints Express
│   ├── services/        # Lógica de IA e scraping
│   ├── utils/           # Validação, erros, logger
│   ├── data/
│   │   └── cv-fonte.json    # Seu CV base
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── test-api.js      # Suite de testes
│
├── frontend/            # Interface React/Vite
│
├── README.md            # Documentação completa
├── IMPROVEMENTS.md      # O que foi melhorado
└── COMMANDS.md          # Referência de comandos
```

## Validações Automáticas

O sistema valida automaticamente:

✅ Email válido  
✅ Campos obrigatórios  
✅ Tamanho mínimo de strings  
✅ Formato de datas  
✅ IDs únicos  
✅ Arrays tipados  

## Troubleshooting

### Erro: "GEMINI_API_KEY não configurada"
```bash
# Verificar .env
cat backend/.env
# Adicionar chave se faltando
echo "GEMINI_API_KEY=abc123..." >> backend/.env
```

### Erro: "Port 3001 already in use"
```bash
# Encontrar processo
lsof -i :3001

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
echo "PORT=3002" >> backend/.env
```

### Erro: "Cannot find module"
```bash
# Reinstalar node_modules
rm -rf node_modules backend/node_modules
npm run install:all
```

### Servidor não responde
```bash
# Verificar logs
npm run dev  # (sem background)

# Testar conexão
curl -v http://localhost:3001/api/health
```

## Scripts Úteis

```bash
# Desenvolvimento
npm run dev              # Iniciar backend + frontend

# Testes
npm run test:api         # Testes automatizados

# Build
npm run build            # Build do frontend

# Production
NODE_ENV=production npm start
```

## Próximos Passos

1. **Explorar documentação**: `cat README.md`
2. **Ver melhorias**: `cat IMPROVEMENTS.md`  
3. **Customizar CV**: Editar `backend/data/cv-fonte.json`
4. **Integrar com frontend**: Conectar React aos endpoints
5. **Deploy**: Usar Vercel, Railway ou seu servidor favorito

## Dúvidas Comuns

**P: Como adicionar novo CV para outro usuário?**  
R: Crie um novo arquivo JSON em `backend/data/` e modifique as rotas para aceitar um parâmetro de usuário.

**P: Como gerar PDF?**  
R: Use `/api/latex/pdf` - requer `pdflatex` instalado:
```bash
# Linux
sudo apt install texlive-full

# Mac  
brew install mactex
```

**P: Como usar a API do adaptador?**  
R: Veja o endpoint `POST /api/adapter` no README.md

**P: Posso usar com Claude ao invés de Gemini?**  
R: Sim! Edite `backend/services/claude.js` para usar `@anthropic-ai/sdk`

## Suporte

- Problemas? Verifique os testes: `npm run test:api`
- Logs? Configure `LOG_LEVEL=DEBUG` em `.env`
- Dúvidas? Leia `README.md` na raiz do projeto

---

**Parabéns!** Seu CVAdapt agora está:
- ✅ Estável
- ✅ Bem testado  
- ✅ Documentado
- ✅ Pronto para usar

Happy coding! 🚀
