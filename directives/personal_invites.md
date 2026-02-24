# Diretivo: Convites Pessoais
**Camada:** Diretivo (Produto)
**Módulo:** `personal_invites`
**Versão:** 1.0.0

---

## Visão Geral

Sistema de convites pessoais para que usuários chamem amigos, contatos e membros para orações, eventos e círculos. O convite é a principal alavanca de crescimento viral do Trombetas.

---

## Tipos de Convite

```
prayer_session   → Convite para oração marcada
faith_event      → Convite para evento de fé
prayer_circle    → Convite para círculo de oração
app_invite       → Convite para entrar no Trombetas
```

---

## Fluxo: Enviar Convite

**Ator:** Usuário autenticado  
**Canais:**
- **In-app** — notificação direta para usuários Trombetas
- **Link** — link compartilhável (WhatsApp, Instagram, etc.)
- **SMS** — para não-usuários (limite: 5/dia no plano gratuito)
- **Email** — para não-usuários

**Entrada:**
- `type` (enum, obrigatório)
- `resource_id` (uuid) — id da sessão, evento ou círculo
- `recipient_user_ids` (array de uuid, se via in-app)
- `recipient_phones` (array de string, se via SMS)
- `recipient_emails` (array de string, se via email)
- `personal_message` (string, opcional, máx. 200 caracteres)

**Regras:**
- Máximo de 20 destinatários por envio
- Convites de SMS: 5/dia (plano gratuito), 50/dia (plano premium)
- Convite expiração: 7 dias

---

## Fluxo: Receber e Aceitar Convite

**Usuário Trombetas:**
- Recebe notificação push: "João te convidou para orar às 21h 🙏"
- Aceitar → entra automaticamente na sessão/evento/círculo
- Recusar → sem consequências, sem notificação ao remetente

**Não-usuário (via link):**
- Link abre landing page do Trombetas
- Mostra preview da sessão/evento/círculo
- Botão: "Entrar no Trombetas para participar"
- Após cadastro → é automaticamente adicionado ao recurso

---

## Template de Mensagem

**Oração marcada:**
> "João te convidou para orar juntos: **'Orar pela família'** — Hoje às 21h 🙏  
> Confirme sua presença no Trombetas."

**Evento:**
> "Maria te convidou para: **Noite de Louvor** — Sáb, 14h, Igreja Central  
> Veja detalhes no Trombetas."

**Círculo:**
> "Pedro te convidou para o círculo **'21 dias de oração'** no Trombetas.  
> Junte-se ao grupo — início amanhã!"

---

## Rastreamento de Convites

- Quantos convites foram enviados por usuário
- Quantos foram aceitos (taxa de conversão)
- Quantos resultaram em cadastro (novos usuários)

**Exibição no perfil:** "João convidou 12 pessoas para orar juntas" (badge de engajamento)

---

## Limites por Plano

| Ação | Gratuito | Premium |
|------|----------|---------|
| Convites in-app/dia | Ilimitado | Ilimitado |
| SMS/dia | 5 | 50 |
| Email/dia | 10 | 100 |
| Links de convite ativos | 3 | Ilimitado |

---

## Módulos de Execução

- `execution/repositories/invite_repository` — CRUD de convites
- `execution/notifications/push_notification_client` — in-app
- `execution/notifications/sms_client` — convites por SMS
- `execution/notifications/email_client` — convites por email
- `execution/links/invite_link_generator` — geração de links únicos rastreáveis
