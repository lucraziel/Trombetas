---
description: Revisão de qualidade de código (Clean Code) antes de commitar alterações no Ezerhub
---

# Workflow: Clean Code Review

Execute este workflow antes de cada commit significativo para garantir que o código segue os padrões do `MICROSAAS_CLEAN_CODE.md`.

---

## 1. Verificar nomes genéricos que devem ser renomeados

```powershell
Select-String -Path "src\**\*.ts","src\**\*.tsx","backend\**\*.js","execution\**\*.js" -Pattern "\bdata\b|\blist\b|\bobj\b|\btmp\b|\bhandler\b|\bstuff\b|\binfo\b" -Recurse
```

Renomeie para nomes que revelem a intenção de domínio.

---

## 2. Detectar console.log de debug esquecidos

```powershell
Select-String -Path "src\**\*.ts","src\**\*.tsx","backend\**\*.js","execution\**\*.js" -Pattern "console\.log\(" -Recurse
```

Remova ou converta para sistema de logging estruturado.

---

## 3. Verificar erros sendo engolidos silenciosamente

```powershell
Select-String -Path "src\**\*.ts","src\**\*.tsx","backend\**\*.js" -Pattern "catch\s*\(\w+\)\s*\{\s*\}" -Recurse
```

Todo `catch` vazio é um bug potencial.

---

## 4. Verificar separação de camadas

- Lógica de negócio está em `backend/` (não em `src/`)?
- Queries de banco estão em `execution/` (não direto nos services)?
- Componentes React são apenas de apresentação?

---

## 5. Verificar enums vs. strings

```powershell
Select-String -Path "src\**\*.ts","src\**\*.tsx" -Pattern "status:\s*string|type:\s*string|role:\s*string" -Recurse
```

---

## 6. Commit

```powershell
git add -A
git commit -m "refactor: clean code — [descrição]"
git push origin main
```
