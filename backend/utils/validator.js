/**
 * Schemas and validators for CV data structure
 */

const schemas = {
  contato: {
    nome: { type: "string", required: true, minLength: 3 },
    email: { type: "string", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    telefone: { type: "string", required: false },
    linkedin: { type: "string", required: false },
    github: { type: "string", required: false },
    portfolio: { type: "string", required: false },
    cidade: { type: "string", required: false },
    pais: { type: "string", required: false },
  },

  experiencia: {
    id: { type: "string", required: true, pattern: /^exp-\d+$/ },
    empresa: { type: "string", required: true, minLength: 2 },
    cargo: { type: "string", required: true, minLength: 3 },
    periodo_inicio: { type: "string", required: true },
    periodo_fim: { type: "string", required: false },
    atual: { type: "boolean", required: false },
    modalidade: { type: "string", required: false, enum: ["presencial", "remoto", "hibrido"] },
    cidade: { type: "string", required: false },
    descricao: { type: "string", required: false },
    bullets: { type: "array", required: false, itemType: "string" },
    stack: { type: "array", required: false, itemType: "string" },
    destaque: { type: "boolean", required: false },
  },

  projeto: {
    id: { type: "string", required: true, pattern: /^proj-\d+$/ },
    nome: { type: "string", required: true, minLength: 3 },
    descricao: { type: "string", required: false },
    bullets: { type: "array", required: false, itemType: "string" },
    stack: { type: "array", required: false, itemType: "string" },
    link: { type: "string", required: false },
    periodo: { type: "string", required: false },
    destaque: { type: "boolean", required: false },
  },

  formacao: {
    id: { type: "string", required: true, pattern: /^form-\d+$/ },
    instituicao: { type: "string", required: true, minLength: 2 },
    curso: { type: "string", required: true, minLength: 3 },
    grau: { type: "string", required: false },
    periodo_inicio: { type: "string", required: false },
    periodo_fim: { type: "string", required: false },
    concluido: { type: "boolean", required: false },
    destaque: { type: "boolean", required: false },
    notas: { type: "string", required: false },
    cidade: { type: "string", required: false },
  },

  certificacao: {
    id: { type: "string", required: true, pattern: /^cert-\d+$/ },
    nome: { type: "string", required: true, minLength: 3 },
    emissor: { type: "string", required: false },
    data: { type: "string", required: false },
    validade: { type: "string", required: false },
    link: { type: "string", required: false },
    destaque: { type: "boolean", required: false },
  },
};

function validateField(value, schema) {
  if (schema.required && (value === undefined || value === null || value === "")) {
    return { valid: false, error: "Campo obrigatório" };
  }

  if (value === undefined || value === null) {
    return { valid: true };
  }

  if (schema.type === "string" && typeof value !== "string") {
    return { valid: false, error: "Deve ser texto" };
  }

  if (schema.type === "boolean" && typeof value !== "boolean") {
    return { valid: false, error: "Deve ser verdadeiro/falso" };
  }

  if (schema.type === "array" && !Array.isArray(value)) {
    return { valid: false, error: "Deve ser uma lista" };
  }

  if (schema.minLength && value.length < schema.minLength) {
    return { valid: false, error: `Mínimo ${schema.minLength} caracteres` };
  }

  if (schema.pattern && !schema.pattern.test(value)) {
    return { valid: false, error: "Formato inválido" };
  }

  if (schema.enum && !schema.enum.includes(value)) {
    return { valid: false, error: `Deve ser um de: ${schema.enum.join(", ")}` };
  }

  if (schema.type === "array" && schema.itemType === "string") {
    if (!value.every((item) => typeof item === "string")) {
      return { valid: false, error: "Todos os itens da lista devem ser texto" };
    }
  }

  return { valid: true };
}

export function validateObject(obj, schemaName) {
  const schema = schemas[schemaName];
  if (!schema) {
    return { valid: false, errors: { [schemaName]: "Schema não encontrado" } };
  }

  const errors = {};
  for (const [field, fieldSchema] of Object.entries(schema)) {
    const result = validateField(obj[field], fieldSchema);
    if (!result.valid) {
      errors[field] = result.error;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateCV(cv) {
  const errors = {};

  // Validar contato
  if (!cv.contato) {
    errors.contato = "Contato obrigatório";
  } else {
    const contatoValidation = validateObject(cv.contato, "contato");
    if (!contatoValidation.valid) {
      errors.contato = contatoValidation.errors;
    }
  }

  // Validar experiências
  if (Array.isArray(cv.experiencias)) {
    errors.experiencias = [];
    cv.experiencias.forEach((exp, idx) => {
      const expValidation = validateObject(exp, "experiencia");
      if (!expValidation.valid) {
        errors.experiencias[idx] = expValidation.errors;
      }
    });
    if (errors.experiencias.length === 0) {
      delete errors.experiencias;
    }
  }

  // Validar projetos
  if (Array.isArray(cv.projetos)) {
    errors.projetos = [];
    cv.projetos.forEach((proj, idx) => {
      const projValidation = validateObject(proj, "projeto");
      if (!projValidation.valid) {
        errors.projetos[idx] = projValidation.errors;
      }
    });
    if (errors.projetos.length === 0) {
      delete errors.projetos;
    }
  }

  // Validar formação
  if (Array.isArray(cv.formacao)) {
    errors.formacao = [];
    cv.formacao.forEach((form, idx) => {
      const formValidation = validateObject(form, "formacao");
      if (!formValidation.valid) {
        errors.formacao[idx] = formValidation.errors;
      }
    });
    if (errors.formacao.length === 0) {
      delete errors.formacao;
    }
  }

  // Validar certificações
  if (Array.isArray(cv.certificacoes)) {
    errors.certificacoes = [];
    cv.certificacoes.forEach((cert, idx) => {
      const certValidation = validateObject(cert, "certificacao");
      if (!certValidation.valid) {
        errors.certificacoes[idx] = certValidation.errors;
      }
    });
    if (errors.certificacoes.length === 0) {
      delete errors.certificacoes;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function sanitizeCV(cv) {
  // Remove campos vazios em strings
  if (cv.contato) {
    Object.keys(cv.contato).forEach((key) => {
      if (typeof cv.contato[key] === "string") {
        cv.contato[key] = cv.contato[key].trim();
      }
    });
  }

  // Sanitiza arrays removendo vazios
  if (Array.isArray(cv.skills?.linguagens)) {
    cv.skills.linguagens = cv.skills.linguagens.filter((s) => s && s.trim()).map((s) => s.trim());
  }

  return cv;
}

export default { validateCV, validateObject, sanitizeCV };
