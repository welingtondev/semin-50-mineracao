// ==========================================
// GOOGLE APPS SCRIPT - PLANILHA DE DOAÇÕES
// ==========================================
// Para usar este script:
// 1. Acesse: https://script.google.com/
// 2. Crie um novo projeto
// 3. Cole este código no editor
// 4. Deploy > Novo deployment > Tipo: API executável
// 5. Copie a URL gerada e atualize DONATION_SCRIPT_URL no CheckoutModal.tsx

const SPREADSHEET_ID = "SUA_PLANILHA_ID_AQUI"; // Substitua pelo ID da sua planilha

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const params = e.parameter || e.postData?.contents || {};
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Doações") || 
                  SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();

    const row = [
      new Date(),
      params.id_cobranca || "",
      params.nome || "",
      params.email || "",
      params.cpf || "",
      params.tel || "",
      params.valor || "",
      params.metodo_de_pagamento || "",
      params.status || "Pendente",
      params.data_hora || ""
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// PASSOS PARA CONFIGURAR:
// ==========================================
// 1. Crie uma planilha no Google Sheets com cabeçalhos:
//    | Data | ID Cobrança | Nome | Email | CPF | Telefone | Valor | Método | Status | Data/Hora |
//
// 2. Copie o ID da planilha da URL (ex: docs.google.com/spreadsheets/d/THIS-PART-HERE/edit)
//
// 3. Substitua "SUA_PLANILHA_ID_AQUI" acima pelo ID da sua planilha
//
// 4. Deploy o script como "API executável" e copie a URL
//
// 5. Atualize a constante DONATION_SCRIPT_URL em src/components/CheckoutModal.tsx