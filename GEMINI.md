# Ezerhub — Instância do Agente de IA

> Este arquivo é espelhado em `CLAUDE.md`, `AGENTS.md` e `GEMINI.md` para que as mesmas instruções carreguem em qualquer ambiente de IA.
> **Última atualização:** 2026-02-23
>
> **Fontes:** `AGENTS_MSAAS.md` · `MICROSAAS_CLEAN_CODE.md` · `security.md`

---

## PARTE 1 — ARQUITETURA MICRO-SAAS (AGENTS_MSAAS.md)

Você opera dentro de uma arquitetura Micro-SaaS de 3 camadas que separa responsabilidades para maximizar confiabilidade, segurança e escalabilidade.
LLMs são probabilísticos; a lógica de negócio e a infraestrutura SaaS precisam ser determinísticas e consistentes.
Este sistema resolve essa incompatibilidade separando a **intenção do produto**, a **orquestração da aplicação** e a **execução da infraestrutura**.

---

### A Arquitetura de 3 Camadas

#### Camada 1 — Diretivos (O que o SaaS deve fazer)
- SOPs de produto e negócio escritos em Markdown, armazenados em `directives/`
- Definem fluxos de usuário, regras de negócio, entradas/saídas, permissões, implicações de billing e casos de borda
- Especificações em linguagem natural, equivalentes a requisitos de produto ou descrições de casos de uso de backend
- Representam o comportamento autoritativo do Micro-SaaS

#### Camada 2 — Orquestração (Camada de decisão da aplicação)
- Esta é a camada de serviço/aplicação do SaaS
- Lê os diretivos e implementa seus fluxos através de serviços de backend
- Coordena repositórios, integrações e ferramentas de infraestrutura na ordem correta
- Aplica validação, autorização, limites de tenant e regras de negócio
- Trata erros, transações e jobs assíncronos
- Atualiza diretivos com aprendizados arquiteturais quando o comportamento evolui

> **Você é a ponte entre a intenção do produto e a execução da infraestrutura.**
> Por exemplo: não implemente lógica de billing diretamente no código de banco de dados — leia `directives/manage_subscription.md`, determine as entradas/saídas necessárias, depois chame serviços e módulos de execução como `execution/payments/stripe_client`.

#### Camada 3 — Execução (Infraestrutura e integrações)
- Módulos de infraestrutura determinísticos em `execution/`
- Repositórios de banco de dados, provedores de pagamento, adapters de storage, clientes de email/SMS, filas e APIs externas
- Variáveis de ambiente, segredos e tokens de API armazenados em `.env` ou cofre seguro
- Apenas tratam E/S, persistência e comunicação externa
- Confiáveis, testáveis, seguros para retry e livres de decisões de negócio

**Por que isso funciona:**
Se lógica de negócio, infraestrutura e orquestração forem misturadas, os erros se acumulam e os sistemas ficam inseguros e impossíveis de manter.
Separar a execução determinística da lógica de decisão garante confiabilidade, auditabilidade e escalabilidade.

---

### Princípios de Operação

#### 1. Verifique módulos de execução existentes primeiro
Antes de criar nova infraestrutura ou código de integração, inspecione `execution/` para repositórios ou provedores existentes referenciados pelo diretivo. Crie novos módulos de execução somente se nenhum existir.

#### 2. Auto-corrigir quando algo quebrar (Self-Annealing)
- Leia mensagens de erro e stack traces
- Corrija o módulo de orquestração ou execução
- Teste novamente (a menos que a operação incorra em custo externo — billing, tokens, etc. — neste caso, confirme primeiro)
- Atualize o diretivo com restrições ou casos de borda descobertos (limites de API, regras de billing, restrições de tenant)

**Exemplo:**
Você encontra um rate limit do provedor de pagamento → inspecione os docs do provedor → implemente estratégia de retry ou batch na camada de execução → teste → atualize o diretivo com os limites.

#### 3. Atualize os diretivos conforme o sistema evolui
Os diretivos são especificações SaaS vivas.
Quando você descobrir restrições, fluxos melhorados, casos de falha comuns ou requisitos de conformidade — atualize o diretivo.
Não crie nem sobrescreva diretivos sem aprovação explícita, a menos que instruído.
Os diretivos são o comportamento canônico do produto e devem ser preservados e melhorados ao longo do tempo.

---

### Loop de Auto-Anelamento

Erros fortalecem o sistema quando resolvidos corretamente.

Quando algo quebrar:
1. Corrija o código de orquestração ou execução
2. Crie ou atualize testes automatizados
3. Valide a segurança e impacto no isolamento de tenant
4. Atualize o diretivo para refletir o fluxo corrigido
5. O sistema fica mais robusto

---

### Organização de Arquivos

**Dados persistentes vs. processamento temporário:**

| Tipo | Descrição |
|------|-----------|
| Dados persistentes | Registros de banco de dados, objetos de storage, entidades de billing, dados de tenant acessíveis via SaaS |
| Dados temporários | Artefatos de processamento ou exportações transitórias |

**Estrutura de diretórios:**

```
.tmp/         — Arquivos temporários de processamento. Nunca commitar. Sempre regenerável.
execution/    — Módulos de infraestrutura (repositórios, pagamentos, storage, integrações)
directives/   — Especificações de produto e negócio em Markdown
backend/      — Camada de orquestração (serviços, controllers, políticas, jobs)
src/          — Frontend (React/Vite ou equivalente)
.env          — Variáveis de ambiente e segredos (nunca commitar)
credentials.json, token.json — Credenciais OAuth ou de integração (git-ignoradas)
```

**Princípio-chave:**
Arquivos locais são apenas para processamento.
O estado persistente do SaaS vive no banco de dados, storage ou sistemas externos.
Tudo em `.tmp/` deve ser descartável e reproduzível.

---

### Princípios Multi-Tenant

- Todos os dados de domínio incluem `tenant_id`
- Isolamento de tenant aplicado na camada de repositório
- Autorização sempre com escopo de tenant
- Nenhuma consulta ou mistura de dados entre tenants
- Billing e assinaturas vinculados a tenants
- Storage e recursos segmentados por tenant

---

### Responsabilidades de Segurança por Camada

| Camada | Responsabilidade |
|--------|-----------------|
| **Diretivos** | Define permissões e propriedade; conformidade e retenção; expectativas de billing e auditoria |
| **Orquestração** | Autenticação e autorização; validação de input e anti-abuso; aplicação de limites de tenant; segurança de transações |
| **Execução** | Gerenciamento de segredos e credenciais; clientes de API seguros; storage criptografado ou isolado; acesso de banco com privilégio mínimo |

> Dados sensíveis **nunca** devem ser logados fora de contextos de auditoria seguros.

---

## PARTE 2 — CLEAN CODE (MICROSAAS_CLEAN_CODE.md)

Você gera e modifica código que humanos precisam entender e evoluir.
Software que apenas funciona é insuficiente — ele também precisa ser compreensível, evoluível e seguro de modificar.

---

### O Modelo de Qualidade de Código em 3 Camadas

#### Camada 1 — Intenção (O que o código significa)
O propósito semântico do código — significado de domínio e intenção de negócio.

Esta camada responde: **"Por que isso existe?"**

✅ **Bom:** `calculate_invoice_total`, `user_has_active_subscription`, `mark_order_as_shipped`
❌ **Ruim:** `processData`, `handleStuff`, `doLogic`

A intenção deve ser explícita em nomes e estrutura.

#### Camada 2 — Estrutura (Como a lógica é organizada)
A composição arquitetural e lógica do comportamento.

**Regras:**
- Uma função = uma responsabilidade
- Um módulo = uma razão para mudar
- Política de alto nível não deve depender de detalhes de baixo nível
- A hierarquia de chamadas deve ler como uma narrativa

#### Camada 3 — Implementação (Como a máquina executa)
A implementação deve ser:
- **mínima** — sem código desnecessário
- **explícita** — sem magia ou surpresas
- **livre de duplicação** — DRY
- **com efeitos colaterais controlados** — isolados e visíveis

Esta camada nunca deve vazar complexidade para cima.

---

### Os 10 Princípios Operacionais de Clean Code

#### 1. Nomeie pela intenção, não pela mecânica
✅ `invoice_total`, `expired_sessions`, `send_password_reset_email`
❌ `data`, `list`, `obj`, `tmp`, `handler`, `util`

> Se um nome precisa de um comentário, o nome está errado.

#### 2. Funções devem ser pequenas e singulares
Uma função deve fazer **uma coisa**.

Sinais de que faz demais:
- múltiplos verbos no nome
- condicionais aninhados
- mais de um nível de abstração
- comentários separando seções

**Meta:** 5–20 linhas, um passo conceitual, sem responsabilidades misturadas.

#### 3. Níveis de abstração não devem se misturar
❌ **Ruim:**
```typescript
processOrder() {
  validateInput()
  calculateTax()
  for (item of db.query(...)) { ... } // mistura alto e baixo nível
}
```

✅ **Bom:**
```typescript
process_order() {
  validate_order()
  totals = calculate_totals()
  persist_order(totals)
}
```

#### 4. Elimine duplicação agressivamente
Duplicação inclui: lógica, padrões de condição, algoritmos, regras de validação, constantes mágicas.

> **Regra:** Se dois lugares mudam juntos, eles devem viver juntos.

#### 5. Torne estados ilegais irrepresentáveis
Em vez de `status: string`, prefira:
```typescript
enum OrderStatus { Pending, Paid, Shipped, Cancelled }
```

#### 6. Comentários são o último recurso
**Permitidos:** rationale ("por que", não "o que"), restrições não óbvias, requisitos externos, notas legais.

**Evitar:** reafirmar o código, narrar passos, explicações óbvias.

#### 7. Erros devem ser explícitos e significativos
**Nunca:** engolir erros, retornar null silenciosamente, usar mensagens genéricas.

**Erros devem:** descrever causa, incluir contexto, ser acionáveis, preservar stack ou chain.

#### 8. Efeitos colaterais devem ser visíveis
✅ `save_user`, `mark_paid`, `delete_session`

Funções puras devem permanecer puras.

#### 9. Estruture para leitura, não para escrita
**Otimize para:** scanning, navegação, compreensão, segurança de mudança.
**Não otimize para:** esperteza, truques de brevidade, densidade.

#### 10. Refatore continuamente
Cada modificação deve melhorar: nomes, estrutura, duplicação, clareza.

> **Deixe o código melhor do que encontrou.**

---

### Sinais de Code Smell — Refatore Imediatamente Se Você Ver:

| Sintoma | Ação |
|---------|------|
| Funções longas | Extraia em funções menores |
| Nomes vagos | Renomeie para clareza |
| Flags booleanas controlando comportamento | Use polimorfismo ou enum |
| Aninhamento profundo | Extraia condições, use early return |
| Condicionais repetidos | Consolide em função |
| Abstração misturada | Separe em camadas |
| Blocos de comentário explicando código | Renomeie para tornar auto-explicativo |
| Variáveis temporárias espalhando | Extraia em função |
| Data clumps | Crie objeto/type |
| Switch/if chains em tipo | Use map ou polimorfismo |

---

### Alinhamento com Testes

**Testes devem ser:** legíveis, reveladores de intenção, independentes, determinísticos.

> Se os testes são difíceis de escrever, a estrutura do código está errada.

---

## PARTE 3 — VIGILÂNCIA DE SEGURANÇA (security.md)

**A cada alteração solicitada, você DEVE executar uma verificação de segurança proativa.**
Não espere ser perguntado — identifique e reporte riscos antes de implementar.

---

### Checklist de Segurança — Aplicar em Toda Alteração

#### 1. ✅/⚠️ Injeção de Código
- [ ] SQL Injection: Todas as queries usam parâmetros preparados ou o client Supabase corretamente?
- [ ] Command Injection: Há uso de `exec`, `eval`, `Function()` com dados de usuário?
- [ ] XSS: Dados de usuário são sanitizados antes de renderizar no DOM?
- [ ] Template Injection: Strings de usuário são interpoladas em templates ou queries?

#### 2. ✅/⚠️ Falhas de Autenticação e Controle de Acesso
- [ ] Endpoints protegidos verificam JWT/sessão válida?
- [ ] O `tenant_id` é sempre verificado no backend antes de retornar dados?
- [ ] Ações sensíveis (deletar, editar) requerem verificação de propriedade?
- [ ] Tokens expiram e são invalidados corretamente?

#### 3. ✅/⚠️ Exposição de Dados Sensíveis
- [ ] Chaves de API, senhas, tokens estão apenas em `.env` (nunca no código fonte)?
- [ ] O `.env` está no `.gitignore`?
- [ ] Logs não contêm dados sensíveis (senhas, tokens, PII)?
- [ ] Respostas de API não expõem campos desnecessários?

#### 4. ✅/⚠️ Validação Inadequada de Entradas
- [ ] Todos os inputs do usuário são validados no backend (não só no frontend)?
- [ ] Tipos, tamanhos e formatos são verificados antes de processar?
- [ ] Uploads de arquivo têm validação de tipo e tamanho?
- [ ] Parâmetros de URL/query são sanitizados?

#### 5. ✅/⚠️ Uso Inseguro de Bibliotecas Externas
- [ ] Dependências estão atualizadas (sem CVEs conhecidas críticas)?
- [ ] Funções depreciadas ou inseguras de bibliotecas são evitadas?
- [ ] SDKs de terceiros são usados conforme a documentação de segurança?

#### 6. ✅/⚠️ Configurações Inseguras
- [ ] Debug/verbose logging está desabilitado em produção?
- [ ] Credenciais hardcoded foram eliminadas?
- [ ] CORS está configurado corretamente (não `*` em produção)?
- [ ] Headers de segurança HTTP estão configurados (CSP, HSTS, etc.)?
- [ ] Endpoints de admin ou debug não estão expostos publicamente?

#### 7. ✅/⚠️ Falhas de Criptografia ou Armazenamento Inseguro
- [ ] Senhas são armazenadas com hash forte (bcrypt/argon2) — nunca texto plano?
- [ ] Dados sensíveis em repouso são criptografados quando necessário?
- [ ] HTTPS é enforçado em todas as comunicações?
- [ ] Chaves privadas e certificados têm gerenciamento adequado?

---

### Protocolo de Reporte de Segurança

Quando uma vulnerabilidade for identificada em uma alteração solicitada, reportar **antes de implementar**:

```
🔴 ALERTA DE SEGURANÇA
Categoria: [ex: Exposição de Dados Sensíveis]
Arquivo:   [caminho/arquivo.ts]
Linha:     [número]
Problema:  [descrição clara do risco]
Impacto:   [o que um atacante poderia fazer]
Correção:  [implementação segura]
```

**Nunca implemente código vulnerável sem reportar primeiro. Se a correção for clara, implemente-a diretamente junto com a feature.**

---

## RESUMO — Como Operar

Você é o agente do Ezerhub Micro-SaaS. A cada tarefa:

1. **📋 Leia o diretivo relevante** em `directives/` antes de implementar
2. **🏗️ Implemente via orquestração** usando serviços em `backend/`
3. **🔌 Use repositórios e integrações** em `execution/`
4. **🔒 Execute o checklist de segurança** antes de cada alteração
5. **✨ Aplique Clean Code** — nomes intencionais, funções pequenas, sem duplicação
6. **🐛 Auto-corrija erros** e atualize o diretivo com learnings
7. **🌱 Deixe o código melhor** do que encontrou

**Seja pragmático. Seja confiável. Construa sistemas Micro-SaaS seguros que escalam.**
