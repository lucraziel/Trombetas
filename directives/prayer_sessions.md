# Diretivo: Orações em Horário Marcado
**Camada:** Diretivo (Produto)
**Módulo:** `prayer_sessions`
**Versão:** 1.0.0

---

## Visão Geral

Usuários criam sessões de oração com horário definido. Outros podem participar, receber lembretes e confirmar presença. É o diferencial central do Trombetas — oração comunitária sincronizada.

---

## Fluxo do Usuário

### Criar uma Sessão de Oração

**Ator:** Usuário autenticado  
**Entrada:**
- `title` (string, obrigatório) — ex: "Orar pela minha família"
- `scheduled_at` (datetime, obrigatório) — data e hora da sessão
- `duration_minutes` (integer, obrigatório) — duração em minutos (15, 30, 60, 90)
- `visibility` (enum: `public` | `friends` | `private`) — quem pode ver
- `category` (enum: ver categorias abaixo)
- `description` (string, opcional)

**Saída:**
- Sessão criada com `session_id`
- Notificação enviada para seguidores (se `public` ou `friends`)
- Link de convite gerado

**Regras de negócio:**
- Horário mínimo: 30 minutos no futuro
- Duração máxima: 180 minutos
- Limite de 5 sessões ativas simultâneas por usuário (plano gratuito)
- Sessões `private` não aparecem em busca nem no feed

### Participar de uma Sessão

**Ator:** Usuário autenticado  
**Condições:**
- Sessão deve ser `public` ou o usuário deve ser amigo do criador ou ter convite
- Sessão não pode ter iniciado há mais de 10 minutos

**Ação:**
- Usuário confirma presença → status: `confirmed`
- Usuário recebe lembrete automático (30 min antes e 5 min antes)
- Usuário aparece na lista de participantes

### Status de uma Sessão

| Status | Descrição |
|--------|-----------|
| `scheduled` | Criada, aguardando horário |
| `live` | Em andamento |
| `completed` | Encerrada |
| `cancelled` | Cancelada pelo criador |

### Confirmação de Presença

Ao chegar no horário, participantes clicam em "Estou Orando":
- Registra timestamp de início da oração do usuário
- Incrementa contador de orações na sessão
- Notifica o criador: "João está orando com você!"

---

## Categorias de Oração

```
family           → Família
health           → Saúde
guidance         → Direção / Propósito
financial        → Provisão financeira
healing          → Cura
nations          → Nações / Missões
gratitude        → Agradecimento
intercession     → Intercessão
personal_growth  → Crescimento pessoal
```

---

## Lembretes Automáticos

| Momento | Canal | Mensagem |
|---------|-------|---------|
| -30 min | Push + Email | "Sua oração começa em 30 minutos" |
| -5 min  | Push | "Prepare seu coração — sua oração começa em breve" |
| Na hora | Push | "É hora de orar! [Nome da sessão]" |

---

## Permissões

| Ação | Dono | Participante | Visitante |
|------|------|-------------|-----------|
| Criar sessão | ✅ | — | — |
| Editar sessão | ✅ | ❌ | ❌ |
| Cancelar sessão | ✅ | ❌ | ❌ |
| Ver participantes | ✅ | ✅ | se `public` |
| Participar | — | ✅ | se `public` ou convite |
| Sair da sessão | — | ✅ | — |

---

## Casos de Borda

- Criador cancela sessão com participantes confirmados → todos recebem notificação de cancelamento
- Usuário bloqueia o criador → não vê a sessão no feed
- Horário inválido (no passado) → erro de validação imediato
- Sessão `live` iniciada → não pode ser editada, apenas cancelada

---

## Módulos de Execução

- `execution/repositories/prayer_session_repository` — CRUD de sessões
- `execution/repositories/prayer_participant_repository` — participantes e confirmações
- `execution/notifications/push_notification_client` — lembretes push
- `execution/notifications/email_client` — lembretes por email
- `execution/schedulers/prayer_reminder_job` — job de lembretes agendados
