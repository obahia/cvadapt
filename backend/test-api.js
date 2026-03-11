#!/usr/bin/env node

/**
 * API Test Suite para CVAdapt
 * Executa testes básicos de funcionalidade
 */

const BASE_URL = "http://localhost:3001";

async function makeRequest(method, path, body = null) {
  const url = new URL(path, BASE_URL);
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => res.text());
    return { status: res.status, data };
  } catch (e) {
    throw new Error(`Network error: ${e.message}`);
  }
}

async function runTests() {
  console.log("\n📋 CVAdapt API Test Suite\n");
  console.log(`Testing: ${BASE_URL}\n`);

  let passed = 0;
  let failed = 0;

  // Test 1: Health check
  try {
    console.log("Test 1: Health Check");
    const res = await makeRequest("GET", "/api/health");
    if (res.status === 200 && res.data.status === "ok") {
      console.log("✅ PASSOU - API respondendo corretamente\n");
      passed++;
    } else {
      console.log("❌ FALHOU - Health check retornou status inválido\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FALHOU - Erro ao conectar:", e.message, "\n");
    failed++;
  }

  // Test 2: GET /api/cv
  try {
    console.log("Test 2: Obter CV Fonte");
    const res = await makeRequest("GET", "/api/cv");
    if (res.status === 200 && res.data.contato && res.data.contato.nome) {
      console.log(`✅ PASSOU - CV retornado com sucesso`);
      console.log(`   Nome: ${res.data.contato.nome}`);
      console.log(`   Experiências: ${res.data.experiencias.length}`);
      console.log(`   Projetos: ${res.data.projetos.length}\n`);
      passed++;
    } else {
      console.log("❌ FALHOU - CV retornado com formato inválido\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FALHOU - Erro ao obter CV:", e.message, "\n");
    failed++;
  }

  // Test 3: POST /api/updater - Validação
  try {
    console.log("Test 3: Atualizar CV (Validação de entrada)");
    const res = await makeRequest("POST", "/api/updater", {});
    if (res.status === 400 && res.data.error) {
      console.log("✅ PASSOU - Validação funcionando");
      console.log(`   Erro: ${res.data.error}\n`);
      passed++;
    } else {
      console.log("❌ FALHOU - Validação não funcionou corretamente\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FALHOU - Erro:", e.message, "\n");
    failed++;
  }

  // Test 4: 404 Handler
  try {
    console.log("Test 4: 404 Handler");
    const res = await makeRequest("GET", "/api/inexistente");
    if (res.status === 404) {
      console.log("✅ PASSOU - 404 retornado corretamente");
      console.log(`   Erro: ${res.data.error}\n`);
      passed++;
    } else {
      console.log("❌ FALHOU - 404 não está sendo tratado corretamente\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FALHOU - Erro:", e.message, "\n");
    failed++;
  }

  // Test 5: Validar estrutura de experiências
  try {
    console.log("Test 5: Estrutura de dados de experiências");
    const res = await makeRequest("GET", "/api/cv");
    if (res.data.experiencias && res.data.experiencias.length > 0) {
      const exp = res.data.experiencias[0];
      if (exp.id && exp.empresa && exp.cargo && exp.bullets && Array.isArray(exp.bullets)) {
        console.log("✅ PASSOU - Estrutura de experiências válida");
        console.log(`   Primeira experiência: ${exp.empresa} - ${exp.cargo}\n`);
        passed++;
      } else {
        console.log("❌ FALHOU - Campos obrigatórios faltando\n");
        failed++;
      }
    }
  } catch (e) {
    console.log("❌ FALHOU - Erro:", e.message, "\n");
    failed++;
  }

  // Test 6: Validar skills
  try {
    console.log("Test 6: Estrutura de skills");
    const res = await makeRequest("GET", "/api/cv");
    if (
      res.data.skills &&
      res.data.skills.linguagens &&
      Array.isArray(res.data.skills.linguagens) &&
      res.data.skills.linguagens.length > 0
    ) {
      console.log("✅ PASSOU - Skills estruturadas corretamente");
      console.log(`   Linguagens: ${res.data.skills.linguagens.slice(0, 3).join(", ")}...\n`);
      passed++;
    } else {
      console.log("❌ FALHOU - Skills mal formatadas\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FALHOU - Erro:", e.message, "\n");
    failed++;
  }

  // Summary
  console.log("=".repeat(50));
  console.log(`\n📊 Resumo: ${passed} ✅ | ${failed} ❌\n`);

  if (failed === 0) {
    console.log("🎉 Todos os testes essenciais passaram!\n");
    process.exit(0);
  } else {
    console.log("⚠️  Alguns testes falharam. Verifique a configuração.\n");
    process.exit(1);
  }
}

// Run
runTests().catch((e) => {
  console.error("Erro fatal:", e.message);
  process.exit(1);
});
