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
  HORARIO: 'A partir das 18h00',
  LOCAL: 'Da Tetê - Bar • R. Borges dos Reis, 103 - Rio Vermelho, Salvador - BA, 41950-600',
  LINK_SITE: 'https://seminufba.com.br',
  LINK_INSCRICAO_ONLINE: 'https://seminufba.com.br/16-encontro-engenheiros-minas',
  LINK_VALIDADOR: 'https://seminufba.com.br/credenciamento-festa'
};

// Cabeçalhos Oficiais da Planilha com CPF
const CABECALHOS = [
  'Data/Hora Inscrição',
  'Nome Completo',
  'CPF',
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
 * Retorna a aba ativa da planilha vinculada com tratamento seguro de erros
 */
function obterPlanilhaAtiva() {
  var ss = null;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (errActive) {
      Logger.log('Erro ao abrir planilha: ' + err.toString());
    }
  }

  if (!ss) {
    throw new Error('Não foi possível carregar a planilha. Verifique o SPREADSHEET_ID: ' + SPREADSHEET_ID);
  }

  return ss.getSheets()[0];
}

/**
 * Função de Diagnóstico / Teste para execução no Editor do Apps Script
 * Pode ser selecionada no topo do editor e executada com segurança
 */
function testarConexaoEPlanilha() {
  var sheet = obterPlanilhaAtiva();
  var col = obterIndicesColunas(sheet);
  Logger.log('Planilha conectada com sucesso! Aba: ' + sheet.getName());
  Logger.log('Linhas preenchidas: ' + sheet.getLastRow());
  Logger.log('Estrutura de colunas identificada: ' + JSON.stringify(col));
  return 'Conexão validada com sucesso! Total de registros: ' + (sheet.getLastRow() > 1 ? sheet.getLastRow() - 1 : 0);
}

/**
 * Inicializa os cabeçalhos na planilha e migra coluna CPF se necessário.
 * Seguro para ser executado diretamente pelo editor do Google Apps Script.
 */
function obterIndicesColunas(sheet) {
  if (!sheet) {
    sheet = obterPlanilhaAtiva();
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CABECALHOS);
    var headerRange = sheet.getRange(1, 1, 1, CABECALHOS.length);
    headerRange.setBackground('#111827');
    headerRange.setFontColor('#F59E0B');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), CABECALHOS.length)).getValues()[0];
  var idx = {
    dataHora: headers.indexOf('Data/Hora Inscrição'),
    nome: headers.indexOf('Nome Completo'),
    cpf: headers.indexOf('CPF'),
    email: headers.indexOf('E-mail'),
    telefone: headers.indexOf('WhatsApp'),
    formatura: headers.indexOf('Ano Formatura / Vínculo'),
    empresa: headers.indexOf('Empresa / Atuação'),
    mensagem: headers.indexOf('Mensagem / Homenagem'),
    codigo: headers.indexOf('Código da Credencial'),
    status: headers.indexOf('Status Credenciamento'),
    dataCred: headers.indexOf('Data/Hora Credenciamento')
  };

  // Se 'CPF' ainda não existe nos cabeçalhos da planilha, insere coluna após 'Nome Completo'
  if (idx.cpf === -1) {
    sheet.insertColumnAfter(2);
    sheet.getRange(1, 3).setValue('CPF').setBackground('#111827').setFontColor('#F59E0B').setFontWeight('bold');
    headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    idx.cpf = 2;
    idx.email = headers.indexOf('E-mail');
    idx.telefone = headers.indexOf('WhatsApp');
    idx.formatura = headers.indexOf('Ano Formatura / Vínculo');
    idx.empresa = headers.indexOf('Empresa / Atuação');
    idx.mensagem = headers.indexOf('Mensagem / Homenagem');
    idx.codigo = headers.indexOf('Código da Credencial');
    idx.status = headers.indexOf('Status Credenciamento');
    idx.dataCred = headers.indexOf('Data/Hora Credenciamento');
  }

  return idx;
}

/**
 * Endpoint de Consulta e Validação (doGet)
 * Permite que a portaria consulte participantes pelo código, e-mail ou CPF
 * e credencie com trava estrita de 1 único check-in
 */
function doGet(e) {
  try {
    var sheet = obterPlanilhaAtiva();
    var col = obterIndicesColunas(sheet);

    var code = (e && e.parameter && e.parameter.code) ? e.parameter.code.trim().toUpperCase() : '';
    var email = (e && e.parameter && e.parameter.email) ? e.parameter.email.trim().toLowerCase() : '';
    var cpf = (e && e.parameter && e.parameter.cpf) ? e.parameter.cpf.replace(/\D/g, '') : '';
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action.trim() : '';

    var rows = sheet.getDataRange().getValues();

    // Ação: Verificar se CPF ou e-mail já existem (verificação pré-inscrição)
    if (action === 'check') {
      for (var i = 1; i < rows.length; i++) {
        var rowCpf = String(rows[i][col.cpf] || '').replace(/\D/g, '');
        var rowEmail = String(rows[i][col.email] || '').trim().toLowerCase();

        if ((cpf && rowCpf === cpf) || (email && rowEmail === email)) {
          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            exists: true,
            message: 'Já existe uma inscrição confirmada para este CPF ou E-mail.'
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        exists: false
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (code || email || cpf) {
      for (var i = 1; i < rows.length; i++) {
        var rowCode = String(rows[i][col.codigo] || '').trim().toUpperCase();
        var rowEmail = String(rows[i][col.email] || '').trim().toLowerCase();
        var rowCpf = String(rows[i][col.cpf] || '').replace(/\D/g, '');

        if ((code && rowCode === code) || (email && rowEmail === email) || (cpf && rowCpf === cpf)) {
          var statusAtual = String(rows[i][col.status] || '').trim();
          var dataCredAtual = String(rows[i][col.dataCred] || '').trim();
          var jaCredenciado = (statusAtual.indexOf('Credenciado') !== -1 || dataCredAtual.length > 0);

          var participanteObj = {
            dataRegistro: rows[i][col.dataHora],
            nome: rows[i][col.nome],
            cpf: rows[i][col.cpf],
            email: rows[i][col.email],
            telefone: rows[i][col.telefone],
            formatura: rows[i][col.formatura],
            empresa: rows[i][col.empresa],
            mensagem: rows[i][col.mensagem],
            codInscricao: rows[i][col.codigo],
            statusCredenciamento: jaCredenciado ? 'Credenciado / Presente' : (statusAtual || 'Confirmado'),
            dataCredenciamento: dataCredAtual
          };

          // AÇÃO DE PORTARIA: CREDENCIAR COM BLOQUEIO DE ENTRADA DUPLICADA
          if (action === 'credenciar') {
            if (jaCredenciado) {
              return ContentService.createTextOutput(JSON.stringify({
                success: false,
                alreadyCheckedIn: true,
                message: 'Atenção: Este participante JÁ realizou o credenciamento em ' + (dataCredAtual || 'horário anterior') + '. Entrada duplicada bloqueada!',
                participante: participanteObj
              })).setMimeType(ContentService.MimeType.JSON);
            }

            // Realiza o 1º e único credenciamento
            var dataHoraCred = Utilities.formatDate(new Date(), 'America/Bahia', 'dd/MM/yyyy HH:mm:ss');
            sheet.getRange(i + 1, col.status + 1).setValue('Credenciado / Presente');
            sheet.getRange(i + 1, col.dataCred + 1).setValue(dataHoraCred);

            participanteObj.statusCredenciamento = 'Credenciado / Presente';
            participanteObj.dataCredenciamento = dataHoraCred;

            return ContentService.createTextOutput(JSON.stringify({
              success: true,
              checkInSuccess: true,
              message: 'Check-in realizado com sucesso!',
              participante: participanteObj
            })).setMimeType(ContentService.MimeType.JSON);
          }

          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            found: true,
            alreadyCheckedIn: jaCredenciado,
            participante: participanteObj
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
 * Permite apenas 1 inscrição por pessoa (bloqueio rigoroso por CPF e E-mail)
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
    var cpf = (data.cpf || '').trim();
    var cpfLimpo = cpf.replace(/\D/g, '');
    var email = (data.email || '').trim().toLowerCase();
    var telefone = (data.telefone || data.phone || '').trim();
    var formatura = (data.formatura || data.anoFormatura || data.turma || 'Engenheiro de Minas').trim();
    var empresa = (data.empresa || '').trim();
    var mensagem = (data.mensagem || '').trim();

    if (!nome || !email || !cpfLimpo) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Nome completo, CPF e e-mail são obrigatórios.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = obterPlanilhaAtiva();
    var col = obterIndicesColunas(sheet);

    var rows = sheet.getDataRange().getValues();

    // TRAVA RIGOROSA: APENAS 1 INSCRIÇÃO POR PESSOA (VERIFICAÇÃO POR CPF E E-MAIL)
    for (var i = 1; i < rows.length; i++) {
      var rowCpf = String(rows[i][col.cpf] || '').replace(/\D/g, '');
      var rowEmail = String(rows[i][col.email] || '').trim().toLowerCase();

      if (rowCpf === cpfLimpo) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          duplicate: true,
          message: 'Já existe uma inscrição confirmada para este CPF (' + cpf + '). Só é permitida uma inscrição por participante.'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      if (rowEmail === email) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          duplicate: true,
          message: 'Já existe uma inscrição confirmada para este E-mail (' + email + '). Só é permitida uma inscrição por participante.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Gerador de código sequencial no formato 16EM-2026-0001
    var nextNum = rows.length;
    var numFormatado = ("0000" + nextNum).slice(-4);
    var codInscricao = '16EM-2026-' + numFormatado;

    var dataHora = Utilities.formatDate(new Date(), 'America/Bahia', 'dd/MM/yyyy HH:mm:ss');
    var statusCredenciamento = 'Confirmado';

    // Insere novo registro único
    var novaLinha = [];
    novaLinha[col.dataHora] = dataHora;
    novaLinha[col.nome] = nome;
    novaLinha[col.cpf] = cpf;
    novaLinha[col.email] = email;
    novaLinha[col.telefone] = telefone;
    novaLinha[col.formatura] = formatura;
    novaLinha[col.empresa] = empresa;
    novaLinha[col.mensagem] = mensagem;
    novaLinha[col.codigo] = codInscricao;
    novaLinha[col.status] = statusCredenciamento;
    novaLinha[col.dataCred] = '';

    sheet.appendRow(novaLinha);

    // Envia e-mail com QR Code para o participante
    var emailEnviado = false;
    try {
      enviarEmailCredencial(nome, email, codInscricao, formatura, empresa);
      emailEnviado = true;
    } catch (mailErr) {
      Logger.log('Erro no envio de e-mail: ' + mailErr.toString());
    }

    // O participante recebe apenas seu link de Inscrição Online e o QR Code pessoal
    var linkInscricaoOnline = EVENTO.LINK_INSCRICAO_ONLINE + '?ticket=' + encodeURIComponent(codInscricao);
    var qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(linkInscricaoOnline) + '&color=000000&bgcolor=FFFFFF';

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      codInscricao: codInscricao,
      linkInscricaoOnline: linkInscricaoOnline,
      qrCodeUrl: qrCodeUrl,
      emailEnviado: emailEnviado,
      message: 'Inscrição confirmada com sucesso! Credencial enviada por e-mail.',
      dados: {
        nome: nome,
        cpf: cpf,
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
 * Os participantes recebem apenas o QR Code e o número de inscrição, sem link de credenciamento
 */
function enviarEmailCredencial(nome, email, codInscricao, formatura, empresa) {
  var linkInscricaoOnline = EVENTO.LINK_INSCRICAO_ONLINE + '?ticket=' + encodeURIComponent(codInscricao);
  
  // URL do QR Code de alta qualidade apontando para a Inscrição Online do participante
  var qrCodeApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' + encodeURIComponent(linkInscricaoOnline) + '&color=111827&bgcolor=FFFFFF';
  
  // Baixa o QR Code para anexar como imagem inline segura
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
                  <span style="display: inline-block; background-color: rgba(0,0,0,0.3); color: #FFF; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 8px;">
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
                          Apresente este QR Code na portaria a partir das 18h00 no dia 14/11
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
                            <td style="color: #10B981; font-weight: bold;">✅ Confirmado (Entrada Única)</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Destaque Open Bar -->
                  <div style="background: linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%); border: 1px solid #D97706; border-radius: 12px; padding: 14px 16px; margin-bottom: 20px; text-align: center;">
                    <span style="font-size: 11px; font-weight: 800; color: #FCD34D; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 4px;">
                      OPEN BAR INCLUSO NA FESTA
                    </span>
                    <div style="font-size: 15px; font-weight: 900; color: #FFFFFF;">
                      Stella Pure Gold &bull; Chivas Regal 12 Anos
                    </div>
                  </div>

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
                        <p style="margin: 0 0 6px; font-size: 13px; color: #FFFFFF;">
                          📍 <strong>Local:</strong> ${EVENTO.LOCAL}
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #FCD34D; font-weight: bold;">
                          <strong>Bebidas Inclusas:</strong> Open Bar de Stella Pure Gold e Chivas 12 Anos
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Instruções para o Dia -->
                  <div style="background-color: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 10px; padding: 14px 16px; margin-bottom: 24px;">
                    <p style="margin: 0; font-size: 12px; color: #FEF3C7; line-height: 1.5;">
                      💡 <strong>Importante:</strong> Esta credencial é pessoal, nominal e intransferível. O check-in na portaria é validado uma única vez por participante através do QR Code.
                    </p>
                  </div>

                  <!-- Botão de Acesso Online -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 10px;">
                        <a href="${linkInscricaoOnline}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: #111827; font-weight: 800; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                          Ver Minha Inscrição Online 🎟️
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
