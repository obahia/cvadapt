# CVAdapt - Adaptador Inteligente de Currículos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev/)
[![AI: Gemini](https://img.shields.io/badge/AI-Gemini%202.5-orange.svg)](https://ai.google.dev/)

Sistema inteligente que usa IA para adaptar currículos a vagas específicas, atualizar experiências e gerar documentos profissionais.

## Características

- 📄 **Armazenamento de CV**: Mantém um currículo-fonte estruturado em JSON
- 🤖 **Adaptação com IA**: Adapta currículos para vagas específicas usando Gemini 2.5
- ✏️ **Atualização Natural**: Adicione experiências usando linguagem natural
- 📋 **Análise Crítica**: Revisão automática da qualidade do currículo
- 📑 **Geração em LaTeX/PDF**: Gera currículos em PDF profissionais
- 🌐 **Web Scraping**: Extrai descrições de vagas diretamente de URLs

## Quick Start

```bash
# 1. Clone o repositório
git clone https://github.com/obahia/cvadapt.git
cd cvadapt

# 2. Instale dependências
cd backend && npm install
cd ../frontend && npm install

# 3. Configure variáveis de ambiente
cp backend/.env.example backend/.env
# Edite backend/.env e adicione sua GEMINI_API_KEY

# 4. Inicie em desenvolvimento
npm run dev
```

**Acesse:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3333

## Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Variáveis de ambiente configuradas

### Setup

```bash
# Instalar dependências
cd backend && npm install
cd ../frontend && npm install

# Configurar variáveis de ambiente
cp backend/.env.example backend/.env
# Editar backend/.env com suas chaves de API
```

### Variáveis de Ambiente

```env
GEMINI_API_KEY=sua-chave-aqui
PORT=3001
NODE_ENV=development
LOG_LEVEL=INFO
```

## Uso

### Iniciar em Desenvolvimento

```bash
npm run dev
```

Isso inicia:
- Backend: http://localhost:3001
- Frontend: http://localhost:5173

### Endpoints da API

#### 1. Obter CV Fonte

```http
GET /api/cv
```

Retorna o currículo-fonte completo em JSON.

**Resposta:**
```json
{
  "contato": { "nome": "...", "email": "..." },
  "experiencias": [...],
  "projetos": [...],
  "formacao": [...],
  "skills": {...}
}
```

---

#### 2. Atualizar CV com IA

```http
POST /api/updater
Content-Type: application/json

{
  "mensagem": "Trabalhei na empresa XYZ como desenvolvedor full-stack de janeiro a junho de 2024"
}
```

A IA interpreta a mensagem natural e atualiza o CV automaticamente.

**Resposta:**
```json
{
  "ok": true,
  "alteracoes": [
    "Adicionada experiência em XYZ Company",
    "Adicionadas skills: Full-Stack Development"
  ],
  "avisos": ["Data de término não especificada"],
  "cv": { ... }
}
```

---

#### 3. Adaptar CV para Vaga

```http
POST /api/adapter
Content-Type: application/json

{
  "vaga": "Procuramos desenvolvedor Python com 3 anos de experiência...",
  "url": "opcional - URL da vaga (faz scraping automático)",
  "idioma": "pt|en"
}
```

Adapta o currículo para a vaga específica, reordenando experiências por relevância.

**Resposta:**
```json
{
  "ok": true,
  "analise_vaga": {
    "titulo": "Senior Python Developer",
    "nivel": "senior",
    "keywords_tecnicas": ["Python", "Django", "PostgreSQL"],
    "requisitos_obrigatorios": [...],
    "cultura": "..."
  },
  "cv_adaptado": { ... },
  "score_match": 8.5,
  "gaps_identificados": [...]
}
```

---

#### 4. Revisar Currículo

```http
POST /api/reviewer
Content-Type: application/json

{
  "cv_adaptado": { ... CV JSON ... },
  "vaga_texto": "opcional - descrição da vaga para contexto"
}
```

Analisa a qualidade do currículo em 4 dimensões.

**Resposta:**
```json
{
  "ok": true,
  "scores": {
    "clareza": 8,
    "impacto": 7,
    "keywords": 9,
    "formato": 8,
    "geral": 8
  },
  "resumo_avaliacao": "Currículo bem estruturado com bom uso de palavras-chave...",
  "sugestoes_gerais": [...],
  "bullets_melhorados": [...]
}
```

---

#### 5. Gerar LaTeX

```http
POST /api/latex/gerar
Content-Type: application/json

{
  "cv_adaptado": { ... CV JSON ... },
  "idioma": "pt|en"
}
```

Retorna código LaTeX do currículo.

**Resposta:**
```json
{
  "ok": true,
  "latex": "\\documentclass{...}",
  "pdf_disponivel": true
}
```

---

#### 6. Gerar PDF

```http
POST /api/latex/pdf
Content-Type: application/json

{
  "cv_adaptado": { ... CV JSON ... },
  "idioma": "pt|en"
}
```

Retorna arquivo PDF binário.

---

## Estrutura de Dados

### Currículo JSON

```json
{
  "_meta": {
    "versao": "1.0.0",
    "ultima_atualizacao": "2025-03-11",
    "historico": []
  },
  "contato": {
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "+351 9 9999 9999",
    "linkedin": "linkedin.com/in/joao",
    "github": "github.com/joao",
    "cidade": "Leiria",
    "pais": "Portugal"
  },
  "resumo": {
    "pt": "Desenvolver Full-Stack com experiência em PHP...",
    "en": "Full-Stack Developer with experience in PHP..."
  },
  "experiencias": [
    {
      "id": "exp-1",
      "empresa": "Empresa X",
      "cargo": "Desenvolvedor",
      "periodo_inicio": "2024-01",
      "periodo_fim": "2024-06",
      "atual": false,
      "modalidade": "presencial",
      "descricao": "Desenvolvimento de plataforma web",
      "bullets": ["Implementei feature X", "Otimizei performance em 50%"],
      "stack": ["PHP", "React", "MySQL"],
      "destaque": true
    }
  ],
  "projetos": [
    {
      "id": "proj-1",
      "nome": "Projeto X",
      "descricao": "Descrição",
      "bullets": ["Resultado 1", "Resultado 2"],
      "stack": ["React", "Node.js"],
      "link": "https://github.com/...",
      "periodo": "2024",
      "destaque": true
    }
  ],
  "formacao": [
    {
      "id": "form-1",
      "instituicao": "Universidade",
      "curso": "Engenharia Informática",
      "grau": "Licenciatura",
      "periodo_inicio": "2022",
      "periodo_fim": "2025",
      "concluido": false
    }
  ],
  "certificacoes": [
    {
      "id": "cert-1",
      "nome": "AWS Solutions Architect",
      "emissor": "Amazon",
      "data": "2024",
      "link": "..."
    }
  ],
  "skills": {
    "linguagens": ["PHP", "Python", "JavaScript"],
    "frameworks": ["React", "Django"],
    "ferramentas": ["Docker", "Git", "AWS"],
    "soft_skills": ["Trabalho em equipa", "Liderança"],
    "idiomas": [
      { "idioma": "Português", "nivel": "Nativo" },
      { "idioma": "Inglês", "nivel": "Fluente" }
    ]
  }
}
```

## Desenvolvimento

### Estrutura de Pastas

```
backend/
├── routes/           # Endpoints Express
├── services/         # Lógica de negócio
├── utils/            # Utilitários (validação, erros, logger)
├── data/             # Dados do CV (JSON)
└── server.js         # Entrada principal

frontend/
├── src/
├── public/
└── vite.config.js
```

### Validação de Dados

O sistema valida automaticamente todos os dados do CV antes de salvar:

- Email válido
- Campos obrigatórios preenchidos
- Formato de datas consistente
- IDs únicos e bem formatados

### Logging

Logs estruturados com níveis: DEBUG, INFO, WARN, ERROR

```javascript
import Logger from './utils/logger.js';
const logger = new Logger('MyModule');

logger.info('Operação bem-sucedida');
logger.error('Erro encontrado', { code: 500 });
```

## Melhorias Futuras

- [ ] Autenticação de usuários
- [ ] Histórico de versões do CV
- [ ] Integração com LinkedIn
- [ ] Análise de compatibilidade com ATS
- [ ] Suporte para múltiplos idiomas no frontend
- [ ] Temas de design de CV customizáveis
- [ ] Análise de palavras-chave de vagas em tempo real

## Troubleshooting

### Erro: "GEMINI_API_KEY não configurada"

Certifique-se de que a chave está em `backend/.env`

### Erro: "pdflatex não encontrado"

Instale TeXLive:
- Linux: `sudo apt install texlive-full`
- Mac: `brew install --cask mactex`
- Windows: [MiKTeX](https://miktex.org/)

### Erro: "JSON inválido"

A IA às vezes retorna JSON malformado. O sistema tenta consertar automaticamente. Se persistir, verifique a qualidade da entrada.

## Licença

MIT

## Suporte

Para bugs ou sugestões, abra uma issue no repositório GitHub.
