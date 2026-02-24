# Diretivo: Pedidos de Oração (Prayer Feed)
**Camada:** Diretivo (Produto)
**Módulo:** `prayer_requests`
**Versão:** 1.0.0

---

## Visão Geral

Feed simples onde usuários postam pedidos de oração. Outros podem reagir com 🙏, comentar e confirmar que estão orando. É o coração social do Trombetas — o lugar onde a comunidade se conecta em necessidade e fé.

---

## Fluxo: Criar Pedido de Oração

**Ator:** Usuário autenticado  
**Entrada:**
- `content` (string, obrigatório) — o pedido em si (máx. 500 caracteres)
- `category` (enum, obrigatório) — veja categorias abaixo
- `urgency` (enum: `urgent` | `regular`) — urgente ou comum
- `visibility` (enum: `public` | `friends` | `circles`) — quem vê
- `is_anonymous` (boolean) — postar sem nome

**Saída:**
- Post criado no feed
- Aparece para seguidores do usuário
- Se `urgent` → badge de destaque no feed

---

## Categorias de Pedido

```
family           → Família
health           → Saúde
financial        → Provisão financeira
healing          → Cura
guidance         → Direção / Propósito
relationships    → Relacionamentos
nations          → Nações / Missões
gratitude        → Agradecimento
personal         → Pessoal
intercession     → Intercessão geral
```

---

## Fluxo: Interações no Feed

### Reação 🙏 "Estou Orando"
- Usuário clica em "Estou Orando"
- Contador de orações incrementa (+1)
- Criador do pedido recebe notificação: "Maria está orando por você 🙏"
- Usuário pode cancelar a reação

### Comentário de Oração
- Texto livre (máx. 300 caracteres)
- Ex: "Crendo junto com você! Que Deus cuide da sua família 🙏"
- Criador notificado de novo comentário

### Reações disponíveis
| Emoji | Significado |
|-------|-------------|
| 🙏 | Estou orando |
| ❤️ | Amor e apoio |
| 🔥 | Crendo com fé! |
| ✝️ | Em oração |

---

## Ciclo de Vida do Pedido

| Status | Descrição | Ação do Criador |
|--------|-----------|-----------------|
| `active` | Pedido ativo no feed | — |
| `answered` | Oração respondida | Marcar como "Deus respondeu!" |
| `archived` | Arquivado manualmente | Arquivar |

**Regra:** Pedidos com mais de 30 dias são automaticamente exibidos com prompt "Foi respondido?" para o criador.

---

## Feed e Algoritmo

**Ordenação:**
1. Pedidos urgentes de círculos do usuário
2. Pedidos recentes de amigos
3. Pedidos públicos recentes por categoria de interesse

**Filtros:**
- Por categoria
- Por urgência
- Por visibilidade (todos / amigos / círculos)

---

## Permissões

| Ação | Criador | Amigo | Público |
|------|---------|-------|---------|
| Criar pedido | ✅ | — | — |
| Editar pedido | ✅ | ❌ | ❌ |
| Deletar pedido | ✅ | ❌ | ❌ |
| Reagir 🙏 | — | ✅ | se `public` |
| Comentar | — | ✅ | se `public` |
| Marcar respondido | ✅ | ❌ | ❌ |

---

## Segurança e Moderação

- Pedidos `anonymous` não expõem `user_id` em nenhuma resposta da API
- Conteúdo reportado → revisão manual antes de remoção
- Palavras bloqueadas (lista configurável) → rejeição automática

---

## Módulos de Execução

- `execution/repositories/prayer_request_repository` — CRUD de pedidos
- `execution/repositories/prayer_reaction_repository` — reações e contadores
- `execution/repositories/prayer_comment_repository` — comentários
- `execution/notifications/push_notification_client` — notificações de interação
- `execution/moderation/content_filter` — filtro de conteúdo
