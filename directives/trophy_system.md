# Diretivo: Sistema de Troféus

**Feature:** Trophy System  
**Módulo:** `trophy_system`  
**Camada:** Execution (gamificação + perfil)

---

## Visão Geral

Sistema de gamificação baseado em adesões acumuladas do usuário. Cada vez que o usuário entra em um evento de fé ou círculo de oração, acumula 1 bronze. Os troféus de maior nível são calculados por conversão cumulativa.

---

## Regras de Conversão

```
Adesão (evento ou círculo)  → +1 bronze
100 bronzes                 → 1 prata    (100 adesões)
100 pratas                  → 1 ouro     (10.000 adesões)
100 ouros                   → 1 platina  (1.000.000 adesões)
```

### Fórmula de Cálculo (a partir do total de adesões)

```
platina = floor(total / 1.000.000)
ouro    = floor((total % 1.000.000) / 10.000)
prata   = floor((total % 10.000) / 100)
bronze  = total % 100
```

---

## Eventos que concedem adesão (+1 bronze)

| Ação | Gatilho |
|------|---------|
| Entrar em círculo de oração | `POST /api/prayer-circles/:id/join` |
| Confirmar presença em evento de fé | `POST /api/faith-events/:id/rsvp` com `status=going` |

---

## Exibição no Perfil

- Exibir os 4 contadores de troféus no perfil
- Mostrar barra de progresso para o próximo troféu
- Ícone animado ao alcançar novo nível
- Na aba de conquistas, mostrar histórico de troféus ganhos

---

## Ranking

- Troféus são públicos e visíveis no perfil de outros usuários
- Ordem de classificação: platina > ouro > prata > bronze > adesões totais
