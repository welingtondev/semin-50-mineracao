# Configurações do Projeto

## Edge Function Asaas (Checkout)

A Edge Function `asaas-checkout` precisa ser configurada no painel do Supabase:

### Deploy da Edge Function
1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá para **Edge Functions** > **asaas-checkout**
3. Verifique se a função está implantada (deployed)
4. Configure as variáveis de ambiente na aba **Secrets**:
   - `ASAAS_API_KEY`: Sua chave da API do Asaas (produção ou sandbox)

### Obter a API Key do Asaas
1. Acesse: https://www.asaas.com/
2. Faça login no painel do Asaas
3. Vá em **Configurações** > **API**
4. Copie a chave de API (formato: `$aact_...`)

### Verificar link da planilha de doações
O link atual está definido em `src/components/CheckoutModal.tsx`:
- `DONATION_SCRIPT_URL`: https://script.google.com/macros/s/AKfycbz0T_fZYdL5JPn2buE7y6Lyu8MF0tRlRilhzTW-uFxO-lyUKFk9T8SKCrirwRZDaBuT/exec

Verifique se o script do Google Apps Script está configurado com a função `doGet` ou `doPost` para receber os dados.

## Comandos de verificação

```bash
# Verificar se o projeto está vinculado ao Supabase
cd supabase && supabase status

# Deploy da Edge Function
cd supabase && supabase functions deploy asaas-checkout

# Verificar Edge Functions disponíveis
cd supabase && supabase functions list
```