# Diretivo: Autenticação e Perfil do Usuário
**Camada:** Diretivo (Produto)
**Módulo:** `auth_profile`
**Versão:** 1.0.0

---

## Visão Geral

Gerencia criação de conta, login, perfil espiritual e configurações do usuário. A identidade do usuário é o centro de toda a experiência do Trombetas.

---

## Fluxo: Cadastro

**Canais:**
- Email + senha
- Google OAuth
- Apple Sign In (obrigatório para iOS App Store)

**Campos obrigatórios no onboarding:**
- Nome completo
- Username (único, ex: @davidm_prayer)
- Foto de perfil (opcional no cadastro, sugerida no onboarding)
- Cidade / Estado
- Igreja (opcional)
- Interesses espirituais (seleção múltipla — mínimo 1)

**Onboarding:**
1. Bem-vindo ao Trombetas
2. Selecione seus interesses espirituais
3. Defina sua localização
4. Encontre người próximas
5. Entre no seu primeiro círculo ou crie uma oração

---

## Perfil do Usuário

### Dados Públicos (visíveis por todos)
- Foto, nome, username
- Bio (máx. 160 caracteres)
- Versículo favorito
- Interesses espirituais
- Igreja (se configurado como público)
- Estatísticas: orações, círculos, dias de streak

### Dados Privados (apenas o próprio usuário)
- Email
- Telefone
- Localização exata
- Histórico de atividades

---

## Configurações de Privacidade

| Configuração | Opções |
|-------------|--------|
| Visibilidade do perfil | Público / Seguidores / Privado |
| Localização | Cidade / Bairro / Oculto |
| Pedidos de oração anônimos | Sim / Não |
| Notificações push | Por categoria |
| Aparecer em buscas | Sim / Não |

---

## Planos de Usuário

| Plano | Preço | Limites |
|-------|-------|---------|
| Gratuito | R$0 | 5 sessões ativas, 5 SMS/dia, 3 links de convite, 5 círculos |
| Premium | R$19,90/mês | Ilimitado + destaque no feed + grupos privados |

---

## Segurança

- Senhas hasheadas com bcrypt
- JWT com expiração de 24h / refresh token de 30 dias
- 2FA opcional por email
- Sessões múltiplas gerenciadas (logout remoto)
- Rate limiting no login: 5 tentativas → bloqueio 15 min

---

## Módulos de Execução

- `execution/repositories/user_repository` — CRUD de usuários
- `execution/auth/jwt_service` — geração e validação de tokens
- `execution/auth/oauth_client` — Google e Apple OAuth
- `execution/storage/avatar_storage` — upload de foto de perfil
- `execution/notifications/email_client` — emails de verificação e reset
