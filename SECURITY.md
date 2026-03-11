# Security Policy

## Reporting Security Vulnerabilities

Se descobrir uma vulnerabilidade de segurança, **não abra uma issue pública**. 

Envie um email para: [seu-email@example.com] com os detalhes.

Por favor, inclua:
- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Sugestões de correção (se houver)

## Security Best Practices

### API Keys

**NUNCA commite API keys**:
```bash
# ❌ ERRADO
const API_KEY = "AIza..."; // Nunca faça isso!

# ✅ CORRETO
const API_KEY = process.env.GEMINI_API_KEY;
```

**Use `.env`** (que está no `.gitignore`):
```bash
# backend/.env
GEMINI_API_KEY=sua-chave-aqui
```

### Validação de Entrada

Todas as entradas são validadas antes de processar:
- Email válido
- Campos obrigatórios
- Formato de dados correto
- Tamanho máximo de mensagens (5000 caracteres)

### Dependências

Mantenha as dependências atualizadas:
```bash
npm audit
npm audit fix
```

### CORS

O backend está configurado com CORS restrito ao frontend local:
```javascript
// Apenas localhost:5173 pode acessar a API
CORS_ORIGIN=http://localhost:5173
```

### Logs

- ❌ Nunca logue dados sensíveis (API keys, senhas)
- ✅ Sempre revise logs antes de commitar
- ✅ Use níveis apropriados (DEBUG, INFO, WARN, ERROR)

## Histórico de Segurança

### v1.0.0 (2025-03-11)
- ✅ Removidas chaves API expostas dos arquivos de teste
- ✅ `.gitignore` configurado corretamente
- ✅ Validação robusta de entrada
- ✅ Tratamento seguro de erros

## Recomendações para Deploy

1. **Environment Variables**
   - Use gerenciador de secrets (AWS Secrets Manager, Heroku Config Vars, etc)
   - Nunca commite `.env` em produção

2. **HTTPS**
   - Sempre use HTTPS em produção
   - Cert SSL válido

3. **Rate Limiting**
   - Implemente rate limiting nos endpoints da API
   - Proteja contra abuso de AI

4. **Monitoramento**
   - Monitore logs de erro
   - Alertas para atividades suspeitas

5. **Backup**
   - Faça backup do `cv-fonte.json` regularmente
   - Versione os dados

## Contato

Para questões de segurança, entre em contato com o mantenedor do projeto.
