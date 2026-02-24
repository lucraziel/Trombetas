# Diretivo: Eventos de Fé
**Camada:** Diretivo (Produto)
**Módulo:** `faith_events`
**Versão:** 1.0.0

---

## Visão Geral

Usuários criam e descobrem eventos cristãos — cultos, células, vigílias, estudos bíblicos, jejuns coletivos e evangelismo. Eventos são exibidos por proximidade geográfica.

---

## Tipos de Evento

```
church_service   → Culto
cell_group       → Célula
vigil            → Vigília
bible_study      → Estudo Bíblico
collective_fast  → Jejum Coletivo
evangelism       → Evangelismo
worship          → Noite de Louvor
prayer_meeting   → Reunião de Oração
conference       → Conferência / Congresso
retreat          → Retiro
```

---

## Fluxo: Criar Evento

**Ator:** Usuário autenticado  
**Entrada:**
- `title` (string, obrigatório)
- `type` (enum, obrigatório)
- `description` (string, opcional)
- `starts_at` (datetime, obrigatório)
- `ends_at` (datetime, obrigatório)
- `is_recurring` (boolean) — se é recorrente (semanal/mensal)
- `recurrence_rule` (string, opcional) — RRULE se recorrente
- `location_name` (string) — nome do local
- `location_address` (string)
- `location_lat` / `location_lng` (float) — coordenadas
- `is_online` (boolean) — evento online
- `online_url` (string, se `is_online`)
- `visibility` (enum: `public` | `community` | `private`)
- `max_participants` (integer, opcional)
- `cover_image_url` (string, opcional)

**Saída:**
- Evento criado e indexado para busca por proximidade
- Notificação para seguidores do criador e membros da comunidade local

---

## Fluxo: Descobrir Eventos

**Filtros disponíveis:**
- Por tipo de evento
- Por data (hoje, esta semana, este mês)
- Por proximidade (raio em km)
- Por cidade / bairro / igreja
- Por palavra-chave

**Ordenação padrão:**
1. Eventos hoje → por horário
2. Eventos esta semana → por proximidade
3. Eventos futuros → por data

---

## Fluxo: Confirmação de Presença (RSVP)

**Status possíveis:**
- `going` — vai comparecer
- `interested` — tem interesse
- `not_going` — não irá

**Regras:**
- Se `max_participants` definido → lista de espera após lotado
- Organizador pode ver lista completa de confirmados

---

## Visibilidade

| Tipo | Quem vê |
|------|---------|
| `public` | Todos os usuários, aparece no mapa |
| `community` | Membros da mesma comunidade/igreja |
| `private` | Apenas convidados |

---

## Permissões

| Ação | Organizador | Participante | Visitante |
|------|------------|-------------|-----------|
| Criar | ✅ | — | — |
| Editar | ✅ | ❌ | ❌ |
| Cancelar | ✅ | ❌ | ❌ |
| RSVP | — | ✅ | se `public` |
| Ver lista de participantes | ✅ | se `public` | se `public` |

---

## Regras de Negócio

- Evento deve ter início no futuro (mínimo 1 hora)
- Eventos recorrentes geram instâncias individualmente na agenda
- Evento cancelado → notificação para todos os confirmados
- Eventos premium podem aparecer em destaque no feed (monetização futura)

---

## Módulos de Execução

- `execution/repositories/event_repository` — CRUD de eventos
- `execution/repositories/event_rsvp_repository` — confirmações de presença
- `execution/geo/location_service` — indexação e busca por proximidade (PostGIS)
- `execution/storage/image_storage` — upload de imagem de capa
- `execution/notifications/push_notification_client` — notificações de evento
