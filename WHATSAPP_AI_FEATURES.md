# Recursos de WhatsApp e IA - Documentação

Este documento descreve os novos recursos implementados: Relatórios WhatsApp e Agente IA.

## Funcionalidades Implementadas

### 1. Relatórios WhatsApp
- **Descrição**: Permite configurar relatórios automáticos enviados via WhatsApp com análise de IA baseada nos dados dos dashboards.
- **Custo**: Gratuito
- **Frequência**: Diário, semanal ou mensal

### 2. Agente IA
- **Descrição**: Análise inteligente de campanhas com IA, fornecendo insights estratégicos e recomendações.
- **Custo**: R$ 20,00 por análise
- **Funcionalidades**: Análise de campanha, recomendações de otimização e insights estratégicos

## Instalação e Configuração

### 1. Dependências Instaladas
```bash
npm install whatsapp-web.js openai stripe node-cron qrcode-terminal tsx
```

### 2. Variáveis de Ambiente Necessárias
Adicione ao seu arquivo `.env`:

```env
# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# Stripe para pagamentos
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Banco de dados já configurado
DATABASE_URL="postgresql://..."
```

### 3. Executar Migração do Banco
```bash
npx prisma migrate dev --name add-whatsapp-reports-and-ai-agent
```

### 4. Iniciar Agendador de Relatórios (em produção)
```bash
npm run schedule-reports
```

## Estrutura de Arquivos Criados/Modificados

### Novos Arquivos
- `src/lib/whatsapp-service.ts` - Serviço de integração WhatsApp
- `src/lib/ai-service.ts` - Serviço de IA para geração de relatórios
- `src/lib/stripe-service.ts` - Serviço de pagamentos Stripe
- `src/lib/scheduler.ts` - Agendador de relatórios automáticos
- `src/scripts/schedule-reports.ts` - Script executável do agendador

### APIs Criadas
- `src/app/api/whatsapp-reports/` - CRUD de configurações WhatsApp
- `src/app/api/ai-agent/` - Gerenciamento de sessões IA
- `src/app/api/ai-agent/[id]/analyze/` - Análise de campanhas
- `src/app/api/ai-agent/[id]/confirm-payment/` - Confirmação de pagamentos

### Interfaces Criadas
- `src/app/(dashboard)/settings/whatsapp-reports/page.tsx` - Configuração WhatsApp
- `src/app/(dashboard)/ai-agent/page.tsx` - Interface do Agente IA

### Schema do Banco Atualizado
Novas tabelas:
- `WhatsAppReportConfig` - Configurações de relatórios
- `WhatsAppReportHistory` - Histórico de envios
- `AIAgentSession` - Sessões do agente IA
- `AIAgentAnalysis` - Análises realizadas

## Como Usar

### 1. Relatórios WhatsApp
1. Acesse "WhatsApp Reports" no menu lateral
2. Clique em "Novo Relatório"
3. Selecione um dashboard existente
4. Configure número do WhatsApp, frequência e horário
5. Clique em "Configurar Relatório"

### 2. Agente IA
1. Acesse "Agente IA" no menu lateral
2. Clique em "Nova Análise"
3. Descreva o nome e objetivo da campanha
4. Opcionalmente vincule um dashboard
5. Complete o pagamento de R$ 20,00
6. Aguarde a análise ser processada

## Agendamento Automático

O sistema inclui um agendador que:
- Executa automaticamente os relatórios configurados
- Envia relatórios via WhatsApp nos horários definidos
- Registra histórico de todos os envios

Para iniciar o agendador em produção:
```bash
npm run schedule-reports
```

## Segurança e Limitações

### WhatsApp
- Usa whatsapp-web.js (não oficial, pode ter limitações)
- Requer escaneamento de QR code na primeira configuração
- Sessões persistem automaticamente

### IA
- Usa OpenAI GPT-4 para análises
- Limitado por quotas da API OpenAI
- Análises em português brasileiro

### Pagamentos
- Integração com Stripe
- Pagamento obrigatório de R$ 20,00 por análise
- Suporte a reembolsos via dashboard Stripe

## Próximos Passos

1. **Teste em produção**: Configure ambiente de produção
2. **Monitoramento**: Implemente logging detalhado
3. **Backup**: Configure backup das sessões WhatsApp
4. **Rate limiting**: Implemente limites de uso
5. **Notificações**: Adicione sistema de notificações por email

## Troubleshooting

### WhatsApp não conecta
- Verifique se o QR code foi escaneado corretamente
- Reinicie o serviço do agendador
- Verifique logs do servidor

### IA não gera análises
- Verifique OPENAI_API_KEY
- Confirme saldo da conta OpenAI
- Verifique logs de erro

### Pagamentos não processam
- Verifique chaves do Stripe
- Confirme webhook endpoints
- Verifique configurações de moeda (BRL)
