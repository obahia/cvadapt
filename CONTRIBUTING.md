# Contributing to CVAdapt

Obrigado por se interessar em contribuir para o CVAdapt! Este documento fornece orientações e instruções para contribuir.

## Code of Conduct

- Seja respeitoso
- Abra issues antes de fazer grandes mudanças
- Forneça contexto claro em PRs
- Escreva código limpo e bem documentado

## Como Contribuir

### 1. Fork & Clone

```bash
# Fork o repositório via GitHub
git clone https://github.com/SEU_USERNAME/cvadapt.git
cd cvadapt
```

### 2. Create a Branch

```bash
git checkout -b feature/sua-feature
# ou
git checkout -b fix/seu-bug
```

### 3. Setup Local Environment

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Configure seu GEMINI_API_KEY em .env

# Frontend (em outra aba)
cd frontend
npm install
npm run dev
```

### 4. Make Changes

- Escreva código limpo e bem comentado
- Siga o estilo existente do projeto
- Adicione testes se possível
- Atualize documentação se necessário

### 5. Commit & Push

```bash
git add .
git commit -m "feat: descrição clara da mudança"
git push origin feature/sua-feature
```

### 6. Create Pull Request

- Descreva o que sua PR faz
- Referencie issues relacionadas: `Fixes #123`
- Aguarde review

## Padrões de Código

### JavaScript/Node.js

```javascript
// Use const/let, evite var
const message = "exemplo";

// Arrow functions quando apropriado
const sum = (a, b) => a + b;

// Async/await em vez de callbacks
async function fetchData() {
  try {
    const data = await fetch('/api/data');
    return data;
  } catch (error) {
    logger.error('Erro ao buscar dados', error);
    throw error;
  }
}

// Comentários úteis
// Use comentários para PORQUÊ, não COMO
const MAX_RETRIES = 3; // Limita tentativas para evitar rate limiting
```

### React

```jsx
// Nomes de componentes em PascalCase
export function MyComponent() {
  // Estado com nomes claros
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="container">
      {/* Comentários para lógica complexa */}
      {isLoading && <Spinner />}
    </div>
  );
}
```

## Tipos de Contribuição

### 🐛 Bug Fixes

1. Abra uma issue descrevendo o bug
2. Crie uma branch: `fix/descricao-do-bug`
3. Forneça passos para reproduzir
4. PR com `Fixes #issue-number`

### ✨ Features

1. Abra uma issue descrevendo a feature
2. Aguarde feedback antes de começar
3. Crie uma branch: `feature/nome-feature`
4. Documente mudanças em README se necessário
5. PR com descrição clara

### 📚 Documentation

- Melhorias no README
- Melhores comentários no código
- Exemplos de uso
- Correções de typos

### 🔄 Refactoring

- Melhore qualidade do código
- Mantenha funcionalidade igual
- Inclua testes
- Descreva melhorias na PR

## Pull Request Template

```markdown
## Descrição
Breve descrição do que essa PR faz

## Tipo
- [ ] Bug fix
- [ ] Feature
- [ ] Refactoring
- [ ] Documentation

## Mudanças
- Mudança 1
- Mudança 2

## Como Testar
Passos para testar a mudança

## Checklist
- [ ] Código segue o estilo do projeto
- [ ] Testei localmente
- [ ] Atualizei documentação
- [ ] Sem erros no console
```

## Testing

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## Problemas Comuns

### "Meu PR foi rejeitado"

- Verifique se segue os padrões de código
- Certifique-se de que não quebra funcionalidade existente
- Descreva melhor suas mudanças
- Abra uma issue para discussão

### "Como rodao os testes?"

```bash
cd backend
npm run test  # Roda testes automatizados

# Teste manual
PORT=3333 node server.js
# Em outro terminal:
curl http://localhost:3333/api/health
```

## Contato

- Issues: Para bugs e sugestões
- Discussions: Para ideias e perguntas

Obrigado por contribuir! 🚀
