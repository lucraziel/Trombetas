# Diretivo: Círculos de Oração
**Camada:** Diretivo (Produto)
**Módulo:** `prayer_circles`
**Versão:** 1.0.0

---

## Visão Geral

Círculos de oração são **pequenos grupos temporários com objetivo espiritual definido**. Usuários entram juntos para orar em campanhas de 7, 21 ou 40 dias. Cada membro registra sua oração diária, e o progresso coletivo é visível para todos. É o maior diferencial de engajamento do Trombetas.

---

## Tipos de Círculo

```
daily_prayer     → Oração diária (7, 14, 21 ou 40 dias)
collective_fast  → Jejum coletivo (1, 3 ou 7 dias)
campaign         → Campanha temática (ex: "21 dias pelo Brasil")
intercession     → Grupo de intercessão contínuo
bible_challenge  → Desafio bíblico (ex: "Leia um capítulo por dia")
```

---

## Fluxo: Criar um Círculo

**Ator:** Usuário autenticado  
**Entrada:**
- `name` (string, obrigatório) — ex: "Oração 21 dias pela família"
- `type` (enum, obrigatório)
- `description` (string, opcional)
- `goal` (string, obrigatório) — objetivo do círculo
- `duration_days` (integer, obrigatório) — duração total
- `max_members` (integer, padrão: 12, máx: 50)
- `visibility` (enum: `public` | `invite_only`)
- `daily_prayer_time` (time, opcional) — horário sugerido de oração
- `starts_at` (date, obrigatório)
- `cover_image_url` (string, opcional)
- `verse` (string, opcional) — versículo temático

**Saída:**
- Círculo criado com código de convite único
- Criador é automaticamente membro (role: `leader`)

---

## Fluxo: Entrar em um Círculo

**Formas de entrada:**
1. Pesquisa pública → círculos `public`
2. Código de convite → qualquer círculo
3. Convite pessoal enviado pelo líder

**Restrição:**
- Círculo iniciado há mais de 2 dias → usuário entra, mas não recebe retroativamente os dias passados
- Máximo de 5 círculos ativos por usuário (plano gratuito)

---

## Fluxo: Registro Diário de Oração

**Todo dia** cada membro pode registrar:

```
Orei hoje? → Sim / Não
Duração: [minutos]
Nota (opcional): "Senti muito a presença de Deus hoje 🙏"
```

**Regras:**
- Prazo: até meia-noite do dia corrente
- Registro retroativo não permitido
- Se não registrar → dia conta como "sem registro" (não quebra o círculo automaticamente)

---

## Progresso e Engajamento

### Progresso Individual
- Streak de dias consecutivos
- Badge ao completar 7 / 14 / 21 / 40 dias
- Histórico de todos os registros

### Progresso Coletivo
- **Mapa de calor** — quais dias o grupo orou mais
- **Porcentagem de participação** por dia
- **Total de horas de oração** acumuladas pelo círculo

### Gamificação Leve
| Conquista | Trigger |
|-----------|---------|
| 🔥 Iniciante | 7 dias consecutivos |
| ⭐ Intercessor | 21 dias consecutivos |
| 👑 Guerreiro de Oração | Completa círculo sem falhar |
| 🌍 Missionário | Participa de 3 círculos diferentes |

---

## Comunicação Interna

- **Feed do círculo** — mensagens, encorajamentos, pedidos específicos do grupo
- **Reações** — membros reagem às notas de oração dos outros
- **Notificação diária** — lembrete para registrar a oração do dia

---

## Encerramento do Círculo

Ao final do `duration_days`:
- Status muda para `completed`
- Relatório final gerado: total de dias, participação, conquistas
- Membros podem optar por renovar ou criar novo círculo
- Conquistas são adicionadas ao perfil de cada membro

---

## Status do Círculo

| Status | Descrição |
|--------|-----------|
| `upcoming` | Criado, ainda não iniciou |
| `active` | Em andamento |
| `completed` | Concluído ao fim do prazo |
| `abandoned` | Encerrado antes do prazo pelo líder |

---

## Permissões

| Ação | Líder | Membro | Visitante |
|------|-------|--------|-----------|
| Criar | ✅ | — | — |
| Editar | ✅ | ❌ | ❌ |
| Encerrar antecipado | ✅ | ❌ | ❌ |
| Remover membro | ✅ | ❌ | ❌ |
| Registrar oração | ✅ | ✅ | ❌ |
| Ver progresso | ✅ | ✅ | se `public` |
| Postar no feed do círculo | ✅ | ✅ | ❌ |

---

## Módulos de Execução

- `execution/repositories/circle_repository` — CRUD de círculos
- `execution/repositories/circle_member_repository` — membros e roles
- `execution/repositories/circle_prayer_log_repository` — registros diários
- `execution/repositories/circle_achievement_repository` — conquistas
- `execution/schedulers/circle_daily_reminder_job` — lembretes diários
- `execution/schedulers/circle_completion_job` — encerramento automático
- `execution/notifications/push_notification_client` — notificações
