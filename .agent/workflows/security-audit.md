---
description: Executar auditoria completa de segurança no codebase do Ezerhub
---

# Workflow: Security Audit

Este workflow realiza uma revisão completa de segurança conforme as diretrizes do `security.md`.
Execute este workflow sempre que houver um conjunto significativo de alterações ou antes de um deploy.

---

## 1. Ler os arquivos de referência

Leia antes de começar:
- `GEMINI.md` — para entender a arquitetura e regras de segurança
- `security.md` — para o template de análise

---

## 2. Mapear todos os arquivos do projeto

```powershell
Get-ChildItem -Recurse -Exclude "node_modules","*.lock",".tmp",".git" | Where-Object { !$_.PSIsContainer } | Select-Object FullName
```

---

## 3. Analisar cada categoria de segurança

### Categoria 1 — Injeção de Código
```powershell
Select-String -Path "backend\**\*.js","backend\**\*.ts","execution\**\*.js","execution\**\*.ts","src\**\*.ts","src\**\*.tsx" -Pattern "eval\(|exec\(|innerHTML|dangerouslySetInnerHTML" -Recurse
```

### Categoria 2 — Autenticação e Controle de Acesso
```powershell
Select-String -Path "backend\**\*.js","backend\**\*.ts" -Pattern "req\.user|tenant_id|user_id" -Recurse
```

### Categoria 3 — Exposição de Dados Sensíveis
```powershell
Select-String -Path "src\**\*.ts","src\**\*.tsx","backend\**\*.js" -Pattern "sk_live|sk_test|password\s*=\s*['\"]|apiKey\s*=\s*['\"]|secret\s*=\s*['\"]" -Recurse
```

### Categoria 4 — Validação de Entradas
```powershell
Select-String -Path "backend\**\*.js","backend\**\*.ts" -Pattern "req\.body\.|req\.params\.|req\.query\." -Recurse
```

### Categoria 5 — Configurações Inseguras
```powershell
Select-String -Path "backend\**\*.js","api\**\*.js" -Pattern "cors\(|origin:" -Recurse
```

### Categoria 6 — Variáveis de Ambiente no Frontend
```powershell
Select-String -Path ".env" -Pattern "VITE_.*SECRET|VITE_.*KEY|VITE_.*SERVICE"
```

---

## 4. Gerar relatório de segurança

Criar arquivo `.tmp/security-audit-YYYY-MM-DD.md` com:

```markdown
# Relatório de Auditoria de Segurança — [DATA]

## 1. CHECKLIST DE SEGURANÇA
- ✅/⚠️ Injeção de Código
- ✅/⚠️ Autenticação e Controle de Acesso
- ✅/⚠️ Exposição de Dados Sensíveis
- ✅/⚠️ Validação de Entradas
- ✅/⚠️ Bibliotecas Externas
- ✅/⚠️ Configurações Inseguras
- ✅/⚠️ Criptografia e Armazenamento

## 2. ANOTAÇÕES E EXEMPLOS
[Para cada vulnerabilidade encontrada: arquivo, linha, trecho, explicação]

## 3. SUGESTÕES DE CORREÇÃO
[Correções específicas com código seguro]
```

---

## 5. Implementar correções críticas

Para cada 🔴 CRÍTICO:
1. Implementar a correção
2. Verificar que nenhum comportamento quebrou
3. Atualizar o `GEMINI.md` com a nova regra aprendida

---

## 6. Commitar mudanças de segurança

```powershell
git add -A
git commit -m "security: [descrição das correções]"
git push origin main
```
