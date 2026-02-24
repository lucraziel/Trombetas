# Diretivo: Conexões por Proximidade
**Camada:** Diretivo (Produto)
**Módulo:** `proximity_connections`
**Versão:** 1.0.0

---

## Visão Geral

Permite que usuários descubram outros cristãos próximos — por cidade, bairro, Igreja ou interesses espirituais. É a camada social do Trombetas que impulsiona comunidade local, convites e participação em eventos presenciais.

---

## Fluxo: Configurar Localização

**Ator:** Usuário autenticado  
**Opções:**
1. **Automático** — GPS do dispositivo (mais preciso)
2. **Manual** — usuário digita cidade/bairro
3. **Igreja** — usuário seleciona/cadastra sua igreja

**Privacidade:**
- Precisão máxima exibida: **bairro** (nunca endereço exato)
- Coordenadas brutas nunca expostas na API para outros usuários
- Usuário pode desativar visibilidade de localização a qualquer momento

---

## Fluxo: Descobrir Pessoas por Proximidade

**Entrada (filtros):**
- `radius_km` (integer: 5, 10, 25, 50) — raio de busca
- `city` (string, opcional)
- `neighborhood` (string, opcional)
- `church_id` (uuid, opcional) — mesma igreja
- `interests` (array de enum) — interesses em comum

**Saída:**
- Lista de perfis (sem localização exata)
- Exibe: foto, nome, cidade/bairro, interesses espirituais, círculos em comum

**Ordenação:**
1. Contatos da agenda (se permissão concedida)
2. Membros da mesma igreja
3. Membros com círculos em comum
4. Distância crescente

---

## Perfil de Descoberta

Dados visíveis na listagem de proximidade:
- Foto e nome
- Cidade e bairro (geral)
- Igreja (se definida e pública)
- Interesses espirituais
- Círculos ativos em comum
- Botão: "Convidar para orar" / "Seguir"

---

## Interesses Espirituais

```
intercession     → Intercessão
worship          → Louvor e adoração
evangelism       → Evangelismo
discipleship     → Discipulado
missions         → Missões
bible_study      → Estudo bíblico
youth_ministry   → Ministério jovem
children_ministry → Ministério infantil
counseling       → Aconselhamento cristão
```

---

## Conexões: Seguir e Ser Seguido

- Modelo assimétrico (como Twitter/Instagram)
- Seguir → vê posts públicos e sessões públicas no feed
- Amizade mútua (seguem um ao outro) → desbloqueiam visibilidade `friends`

---

## Privacidade e Controles do Usuário

| Configuração | Opções |
|-------------|--------|
| Visibilidade de localização | Todos / Seguidores / Ninguém |
| Precisão da localização | Cidade / Bairro |
| Aparecer em "Pessoas próximas" | Sim / Não |
| Aceitar seguida de desconhecidos | Sim / Não / Apenas conhecidos |

---

## Segurança

- Dados de localização armazenados como geohash de baixa precisão
- Nunca retornar coordenadas exatas em nenhum endpoint
- Usuários bloqueados não aparecem em buscas
- Rate limiting em buscas geográficas: 20 requisições/minuto

---

## Módulos de Execução

- `execution/repositories/user_location_repository` — localização e privacidade
- `execution/repositories/follow_repository` — relações de seguimento
- `execution/repositories/church_repository` — cadastro de igrejas
- `execution/geo/location_service` — busca por proximidade (PostGIS/Supabase)
- `execution/repositories/user_interest_repository` — interesses espirituais
