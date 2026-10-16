/**
 * ==============================================================================
 * 16º ENCONTRO DOS ENGENHEIROS DE MINAS DA BAHIA & FESTA DO CINQUENTENÁRIO
 * Google Apps Script - Sistema de Credenciamento & Envio de QR Code por E-mail
 * 
 * Planilha Vinculada:
 * https://docs.google.com/spreadsheets/d/1seBafr2DACgq6yHCnbW-mc1CraWhjz3sG8okG3Q2tN8/edit
 * SPREADSHEET_ID: 1seBafr2DACgq6yHCnbW-mc1CraWhjz3sG8okG3Q2tN8
 * 
 * Implantação Web App Ativa:
 * ID: AKfycbyB2t4BHlwhkl1lFb4OmFNCBpVINvEVYEeNO1LUpfvmJ1koWppPAdCSGXHwR8OteBfd
 * URL: https://script.google.com/macros/s/AKfycbyB2t4BHlwhkl1lFb4OmFNCBpVINvEVYEeNO1LUpfvmJ1koWppPAdCSGXHwR8OteBfd/exec
 * ==============================================================================
 */

const SPREADSHEET_ID = '1seBafr2DACgq6yHCnbW-mc1CraWhjz3sG8okG3Q2tN8';

// Configurações do Evento
const EVENTO = {
  NOME: '16º Encontro dos Engenheiros de Minas da Bahia',
  SUBTITULO: 'Festa Oficial do Cinquentenário • Jubileu de Ouro (1976 - 2026)',
  DATA: 'Sábado, 14 de Novembro de 2026',
  HORARIO: 'A partir das 12h00',
  LOCAL: 'Escola Politécnica da UFBA • Salvador / BA',
  LINK_SITE: 'https://seminufba.com.br',
  LINK_VALIDADOR: 'https://seminufba.com.br/credenciamento-festa'
};

// Cabeçalhos Oficiais da Planilha
const CABECALHOS = [
  'Data/Hora Inscrição',
  'Nome Completo',
  'E-mail',
  'WhatsApp',
  'Ano Formatura / Vínculo',
  'Empresa / Atuação',
  'Mensagem / Homenagem',
  'Código da Credencial',
  'Status Credenciamento',
  'Data/Hora Credenciamento'
];

/**
 * Inicializa os cabeçalhos na planilha se estiver vazia
 */
function inicializarPlanilha(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CABECALHOS);
    var headerRange = sheet.getRange(1, 1, 1, CABECALHOS.length);
    headerRange.setBackground('#111827');
    headerRange.setFontColor('#F59E0B');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

/**
 * Função de teste: execute para autorizar permissões de envio de e-mail e acesso à planilha
 */
function autorizarEEnviarTeste() {
  var meuEmail = Session.getActiveUser().getEmail() || 'contato@seminufba.com.br';
  Logger.log('Enviando e-mail teste para: ' + meuEmail);
  
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheets()[0];
  inicializarPlanilha(sheet);

  var dadosTeste = {
    nome: 'Engenheiro Teste',
    email: meuEmail,
    telefone: '(71) 99999-9999',
    formatura: 'Turma 1995',
    empresa: 'Mineração Bahia',
    mensagem: 'Parabéns à Engenharia de Minas pelos 50 anos!'
  };

  enviarEmailCredencial(dadosTeste.nome, dadosTeste.email, '16EM-2026-0001', dadosTeste.formatura, dadosTeste.empresa);
  Logger.log('Teste concluído com sucesso!');
}

/**
 * Endpoint de Consulta e Validação (doGet)
 * Permite que a equipe de recepção consulte participantes pelo código ou e-mail
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheets()[0];
    inicializarPlanilha(sheet);

    var code = (e && e.parameter && e.parameter.code) ? e.parameter.code.trim().toUpperCase() : '';
    var email = (e && e.parameter && e.parameter.email) ? e.parameter.email.trim().toLowerCase() : '';
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action.trim() : '';

    var rows = sheet.getDataRange().getValues();

    if (code || email) {
      for (var i = 1; i < rows.length; i++) {
        var rowCode = String(rows[i][7] || '').trim().toUpperCase();
        var rowEmail = String(rows[i][2] || '').trim().toLowerCase();

        if ((code && rowCode === code) || (email && rowEmail === email)) {
          // Se ação for credenciar na portaria
          if (action === 'credenciar') {
            var dataHoraCred = Utilities.formatDate(new Date(), 'America/Bahia', 'dd/MM/yyyy HH:mm:ss');
            sheet.getRange(i + 1, 9).setValue('Credenciado / Presente');
            sheet.getRange(i + 1, 10).setValue(dataHoraCred);
            rows[i][8] = 'Credenciado / Presente';
            rows[i][9] = dataHoraCred;
          }

          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            found: true,
            participante: {
              dataRegistro: rows[i][0],
              nome: rows[i][1],
              email: rows[i][2],
              telefone: rows[i][3],
              formatura: rows[i][4],
              empresa: rows[i][5],
              mensagem: rows[i][6],
              codInscricao: rows[i][7],
              statusCredenciamento: rows[i][8] || 'Confirmado',
              dataCredenciamento: rows[i][9] || ''
            }
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        found: false,
        message: 'Credencial não localizada no sistema.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Retorno padrão de saúde da API
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'API do 16º Encontro dos Engenheiros de Minas da Bahia ativa e operacional.'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Erro na consulta: ' + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint de Inscrição Oficial (doPost)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var rawContents = (e && e.postData) ? e.postData.contents : '';
    var data = {};

    if (rawContents) {
      try {
        data = JSON.parse(rawContents);
      } catch (jsonErr) {
        data = (e && e.parameter) ? e.parameter : {};
      }
    } else {
      data = (e && e.parameter) ? e.parameter : {};
    }

    var nome = (data.nome || '').trim();
    var email = (data.email || '').trim().toLowerCase();
    var telefone = (data.telefone || data.phone || '').trim();
    var formatura = (data.formatura || data.anoFormatura || data.turma || 'Engenheiro de Minas').trim();
    var empresa = (data.empresa || '').trim();
    var mensagem = (data.mensagem || '').trim();

    if (!nome || !email) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Nome completo e e-mail são obrigatórios.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheets()[0];
    inicializarPlanilha(sheet);

    var rows = sheet.getDataRange().getValues();
    var existingRowIndex = -1;
    var existingCode = '';

    for (var i = 1; i < rows.length; i++) {
      var rowEmail = String(rows[i][2] || '').trim().toLowerCase();
      if (rowEmail === email) {
        existingRowIndex = i + 1;
        existingCode = String(rows[i][7] || '').trim();
        break;
      }
    }

    // Gerador de código sequencial no formato 16EM-2026-0001
    var codInscricao = '';
    if (existingCode && existingCode.startsWith('16EM-')) {
      codInscricao = existingCode;
    } else {
      var nextNum = rows.length; // considerando cabeçalho
      var numFormatado = ("0000" + nextNum).slice(-4);
      codInscricao = '16EM-2026-' + numFormatado;
    }

    var dataHora = Utilities.formatDate(new Date(), 'America/Bahia', 'dd/MM/yyyy HH:mm:ss');
    var statusCredenciamento = 'Confirmado';

    if (existingRowIndex > 0) {
      // Atualiza inscrição existente
      sheet.getRange(existingRowIndex, 1).setValue(dataHora);
      sheet.getRange(existingRowIndex, 2).setValue(nome);
      sheet.getRange(existingRowIndex, 4).setValue(telefone);
      sheet.getRange(existingRowIndex, 5).setValue(formatura);
      sheet.getRange(existingRowIndex, 6).setValue(empresa);
      sheet.getRange(existingRowIndex, 7).setValue(mensagem);
      sheet.getRange(existingRowIndex, 8).setValue(codInscricao);
      sheet.getRange(existingRowIndex, 9).setValue(statusCredenciamento);
    } else {
      // Insere novo registro
      sheet.appendRow([
        dataHora,
        nome,
        email,
        telefone,
        formatura,
        empresa,
        mensagem,
        codInscricao,
        statusCredenciamento,
        ''
      ]);
    }

    // Envia e-mail com QR Code para o participante
    var emailEnviado = false;
    try {
      enviarEmailCredencial(nome, email, codInscricao, formatura, empresa);
      emailEnviado = true;
    } catch (mailErr) {
      Logger.log('Erro no envio de e-mail: ' + mailErr.toString());
    }

    var linkValidacao = EVENTO.LINK_VALIDADOR + '?code=' + encodeURIComponent(codInscricao);
    var qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(linkValidacao) + '&color=000000&bgcolor=FFFFFF';

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      codInscricao: codInscricao,
      linkValidacao: linkValidacao,
      qrCodeUrl: qrCodeUrl,
      emailEnviado: emailEnviado,
      message: 'Inscrição confirmada com sucesso! Credencial enviada por e-mail.',
      dados: {
        nome: nome,
        email: email,
        telefone: telefone,
        formatura: formatura,
        empresa: empresa,
        codInscricao: codInscricao
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Erro no doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Erro interno ao processar inscrição: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Envia o E-mail Oficial com a Credencial e o QR Code
 */
function enviarEmailCredencial(nome, email, codInscricao, formatura, empresa) {
  var linkValidacao = EVENTO.LINK_VALIDADOR + '?code=' + encodeURIComponent(codInscricao);
  
  // URL do QR Code de alta qualidade
  var qrCodeApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' + encodeURIComponent(linkValidacao) + '&color=111827&bgcolor=FFFFFF';
  
  // Baixa o QR Code para anexar como imagem inline segura (não bloqueada por clientes de e-mail)
  var qrCodeBlob = null;
  try {
    var response = UrlFetchApp.fetch(qrCodeApiUrl);
    qrCodeBlob = response.getBlob().setName('qrcode_credencial.png');
  } catch (err) {
    Logger.log('Aviso: Falha ao baixar blob do QR Code, fallback para URL pública.');
  }

  var assunto = '🎟️ Sua Credencial Oficial: ' + EVENTO.NOME + ' (Cód. ' + codInscricao + ')';

  var htmlBody = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${EVENTO.NOME}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0B0E14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F3F4F6;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0B0E14; padding: 25px 10px;">
        <tr>
          <td align="center">
            <!-- Container Principal -->
            <table role="presentation" width="100%" style="max-width: 600px; background-color: #111827; border: 1px solid #374151; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 45px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0" border="0">
              
              <!-- Top Banner Dourado / Esmeralda -->
              <tr>
                <td style="background: linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #B45309 100%); padding: 26px 20px; text-align: center;">
                  <span style="display: inline-block; background-color: rgba(0,0,0,0.3); color: #FFF; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 5px 14px; rounded-radius: 20px; border-radius: 20px; margin-bottom: 8px;">
                    JUBILEU DE OURO • 1976 - 2026
                  </span>
                  <h1 style="margin: 4px 0 6px; color: #FFFFFF; font-size: 24px; font-weight: 900; line-height: 1.2; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                    ${EVENTO.NOME}
                  </h1>
                  <p style="margin: 0; color: #FEF3C7; font-size: 13px; font-weight: 600;">
                    ${EVENTO.SUBTITULO}
                  </p>
                </td>
              </tr>

              <!-- Corpo do Voucher / Credencial -->
              <tr>
                <td style="padding: 30px 24px 20px;">
                  
                  <!-- Saudação -->
                  <p style="font-size: 16px; line-height: 1.5; color: #E5E7EB; margin-top: 0;">
                    Olá, <strong>${nome}</strong>!
                  </p>
                  <p style="font-size: 14px; line-height: 1.6; color: #9CA3AF; margin-bottom: 24px;">
                    Sua inscrição para o tradicional <strong>Encontro dos Engenheiros de Minas da Bahia</strong> e a <strong>Festa do Cinquentenário</strong> foi confirmada com sucesso!
                  </p>

                  <!-- Card de Credencial -->
                  <table role="presentation" width="100%" style="background-color: #1F2937; border: 2px dashed #D97706; border-radius: 16px; padding: 20px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 15px;">
                        <span style="font-size: 10px; font-weight: 800; color: #F59E0B; text-transform: uppercase; letter-spacing: 1.5px;">
                          CÓDIGO INDIVIDUAL DE CREDENCIAMENTO
                        </span>
                        <div style="font-size: 26px; font-weight: 900; font-family: Courier, monospace; color: #FCD34D; letter-spacing: 2px; margin-top: 4px;">
                          ${codInscricao}
                        </div>
                      </td>
                    </tr>
                    
                    <!-- QR Code -->
                    <tr>
                      <td align="center" style="padding: 10px 0 15px;">
                        <div style="background-color: #FFFFFF; padding: 12px; display: inline-block; border-radius: 12px; box-shadow: 0 6px 16px rgba(0,0,0,0.3);">
                          ${qrCodeBlob ? 
                            '<img src="cid:qrCodeInline" alt="QR Code" width="180" height="180" style="display: block; border: 0;" />' : 
                            '<img src="' + qrCodeApiUrl + '" alt="QR Code" width="180" height="180" style="display: block; border: 0;" />'
                          }
                        </div>
                        <p style="font-size: 11px; color: #9CA3AF; margin: 8px 0 0; text-transform: uppercase; letter-spacing: 1px;">
                          Apresente este QR Code na portaria no dia 14/11
                        </p>
                      </td>
                    </tr>

                    <!-- Detalhes do Participante -->
                    <tr>
                      <td style="border-top: 1px solid #374151; padding-top: 15px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 13px;">
                          <tr>
                            <td style="color: #9CA3AF; width: 35%;"><strong>Engenheiro(a):</strong></td>
                            <td style="color: #FFFFFF; font-weight: bold;">${nome}</td>
                          </tr>
                          <tr>
                            <td style="color: #9CA3AF;"><strong>Turma / Vínculo:</strong></td>
                            <td style="color: #FCD34D; font-weight: bold;">${formatura}</td>
                          </tr>
                          ${empresa ? `
                          <tr>
                            <td style="color: #9CA3AF;"><strong>Empresa / Atuação:</strong></td>
                            <td style="color: #E5E7EB;">${empresa}</td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="color: #9CA3AF;"><strong>Status:</strong></td>
                            <td style="color: #10B981; font-weight: bold;">✅ Confirmado</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Caixa de Informações do Evento -->
                  <table role="presentation" width="100%" style="background-color: #182234; border-left: 4px solid #F59E0B; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td>
                        <p style="margin: 0 0 6px; font-size: 13px; color: #FFFFFF;">
                          🗓️ <strong>Data:</strong> ${EVENTO.DATA}
                        </p>
                        <p style="margin: 0 0 6px; font-size: 13px; color: #FFFFFF;">
                          ⏰ <strong>Horário:</strong> ${EVENTO.HORARIO}
                        </p>
                        <p style="margin: 0; font-size: 13px; color: #FFFFFF;">
                          📍 <strong>Local:</strong> ${EVENTO.LOCAL}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Instruções para o Dia -->
                  <div style="background-color: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 10px; padding: 14px 16px; margin-bottom: 24px;">
                    <p style="margin: 0; font-size: 12px; color: #FEF3C7; line-height: 1.5;">
                      💡 <strong>Dica:</strong> Salve este e-mail nos seus favoritos ou tire um print do QR Code no celular para agilizar sua entrada na portaria da festa.
                    </p>
                  </div>

                  <!-- Botão de Acesso Online -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 10px;">
                        <a href="${linkValidacao}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: #111827; font-weight: 800; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                          Ver Minha Credencial Online 🎟️
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Rodapé Institucional -->
              <tr>
                <td style="background-color: #0F172A; padding: 20px; text-align: center; border-top: 1px solid #1E293B;">
                  <p style="margin: 0 0 4px; font-size: 12px; color: #94A3B8; font-weight: bold;">
                    Comissão Organizadora • SEMIN UFBA 50 Anos
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #64748B;">
                    Escola Politécnica da UFBA &bull; Departamento de Engenharia de Minas
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  var emailOptions = {
    to: email,
    subject: assunto,
    htmlBody: htmlBody,
    name: 'SEMIN UFBA • 50 Anos'
  };

  if (qrCodeBlob) {
    emailOptions.inlineImages = {
      qrCodeInline: qrCodeBlob
    };
  }

  MailApp.sendEmail(emailOptions);
}
