/**
 * ==============================================================================
 * SEMIN UFBA 2026 - Backend Google Apps Script Oficial
 * Planilha: 1MUpQGUWd3KV-Dm1KIyRZ_q2IlJkFUhxEjLkZouOOG4M
 * Estrutura: [Data, NomeCompleto, Email, TipoInscricao, id, Confirmacao, Telefone]
 * ==============================================================================
 */

const SPREADSHEET_ID = '1MUpQGUWd3KV-Dm1KIyRZ_q2IlJkFUhxEjLkZouOOG4M';

// Links Oficiais do Evento
const LINKS = {
  SITE: 'https://seminufba.com.br',
  VALIDADOR: 'https://seminufba.com.br/validador',
  INSTAGRAM: 'https://instagram.com/seminufba',
  COMUNIDADE: 'https://chat.whatsapp.com/GiV7WJficGV51jbmO0Wfm5' // Link direto do Grupo Oficial no WhatsApp
};

// Logos Institucionais
const LOGOS = {
  SEMIN: 'https://drive.google.com/uc?export=view&id=12RbBtCdF-VMVtxTMY6Um_D32nhHAx6W0',
  UFBA: 'https://drive.google.com/uc?export=view&id=1SLGKD2V6pu6uLHckxAwlZf8OQQQUBwQq',
  DAEMIN: 'https://drive.google.com/uc?export=view&id=1xuiHACQKW_zchUwLObZvIMCfU93rolNu'
};

// Ícones Oficiais para Redes Sociais e Comunidade
const ICONS = {
  WEB: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png',
  INSTAGRAM: 'https://cdn-icons-png.flaticon.com/512/174/174855.png',
  WHATSAPP: 'https://cdn-icons-png.flaticon.com/512/733/733585.png'
};

/**
 * Função para autorizar o Google e testar o envio de e-mail com anexo PDF e redes sociais
 * Selecione esta função no topo e clique em "Executar" ▶️
 */
function autorizarEEnviarEmailTeste() {
  var meuEmail = Session.getActiveUser().getEmail() || 'contato@seminufba.com.br';
  Logger.log('Iniciando teste de autorização e envio para: ' + meuEmail);
  enviarEmailConfirmacao('Welington Santos', meuEmail, 'SEMIN-2026-0001', 'Estudante da UFBA', '27/08/2026 18:40:00', LINKS.VALIDADOR + '/?code=SEMIN-2026-0001');
  Logger.log('SUCESSO! E-mail oficial completo com anexo PDF e redes sociais enviado com sucesso.');
}

/**
 * Recebe a submissão do formulário web (doPost)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    if (!e) {
      var emailAtual = Session.getActiveUser().getEmail() || 'contato@seminufba.com.br';
      e = {
        postData: {
          contents: JSON.stringify({
            nome: 'Participante de Teste',
            email: emailAtual,
            telefone: '(71) 99999-9999',
            categoria: 'Estudante da UFBA'
          })
        }
      };
    }

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
    var email = (data.email || '').trim();
    var telefone = (data.telefone || '').trim();
    var categoria = (data.categoria || data.tipoInscricao || 'Geral').trim();

    if (!nome || !email) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Nome e E-mail são obrigatórios.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheets()[0];
    var dataRange = sheet.getDataRange().getValues();

    // 1. Filtra apenas as linhas ativas reais na planilha (ignorando linhas vazias ou deletadas)
    var activeRows = [];
    var existingParticipant = null;

    for (var i = 1; i < dataRange.length; i++) {
      var rowEmail = String(dataRange[i][2] || '').trim().toLowerCase();
      var rowNome = String(dataRange[i][1] || '').trim();
      var rowCode = String(dataRange[i][4] || '').trim();

      if (rowEmail || rowNome || rowCode) {
        var rowObj = {
          rowNum: i + 1,
          email: rowEmail,
          nome: rowNome,
          codInscricao: rowCode
        };
        activeRows.push(rowObj);

        // Se o email existir atualmente na planilha, recupera o registro
        if (rowEmail === email.toLowerCase()) {
          existingParticipant = rowObj;
        }
      }
    }

    // 2. Se o e-mail foi deletado da planilha, ele NÃO existe em activeRows e será cadastrado como NOVO!
    var codInscricao = '';
    if (existingParticipant && existingParticipant.codInscricao && existingParticipant.codInscricao.startsWith('SEMIN-')) {
      codInscricao = existingParticipant.codInscricao;
    } else {
      var totalAtivos = activeRows.length + 1;
      var numeroFormatado = ("0000" + totalAtivos).slice(-4);
      codInscricao = 'SEMIN-2026-' + numeroFormatado;
    }

    var dataHora = Utilities.formatDate(new Date(), 'America/Bahia', 'dd/MM/yyyy HH:mm:ss');
    var statusConfirmacao = 'Confirmada';
    var linkValidacao = LINKS.VALIDADOR + '/?code=' + encodeURIComponent(codInscricao);

    // 3. Atualiza linha existente ou adiciona nova linha na planilha
    if (existingParticipant && existingParticipant.rowNum > 0) {
      sheet.getRange(existingParticipant.rowNum, 1).setValue(dataHora);
      sheet.getRange(existingParticipant.rowNum, 2).setValue(nome);
      sheet.getRange(existingParticipant.rowNum, 4).setValue(categoria);
      sheet.getRange(existingParticipant.rowNum, 5).setValue(codInscricao);
      sheet.getRange(existingParticipant.rowNum, 6).setValue(statusConfirmacao);
      if (telefone) sheet.getRange(existingParticipant.rowNum, 7).setValue(telefone);
    } else {
      sheet.appendRow([
        dataHora,
        nome,
        email,
        categoria,
        codInscricao,
        statusConfirmacao,
        telefone
      ]);
    }

    // 4. Envia e-mail institucional completo com anexo PDF e redes sociais
    enviarEmailConfirmacao(nome, email, codInscricao, categoria, dataHora, linkValidacao);

    // 5. Retorna sucesso para o formulário
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      codInscricao: codInscricao,
      message: 'Inscrição registrada e comprovante enviado por e-mail!',
      data: {
        codInscricao: codInscricao,
        nome: nome,
        email: email,
        telefone: telefone,
        categoria: categoria,
        dataRegistro: dataHora,
        linkValidacao: linkValidacao
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Erro no doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Erro interno: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Envia o e-mail de confirmação institucional com layout executivo, redes sociais e anexo PDF
 */
function enviarEmailConfirmacao(nome, email, codInscricao, categoria, dataHora, linkValidacao) {
  try {
    var assunto = 'Comprovante Oficial de Inscrição: SEMIN UFBA 2026 (Nº ' + codInscricao + ')';
    var qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=' + encodeURIComponent(linkValidacao) + '&color=DDAE3B&bgcolor=11141A';

    // 1. Gera o documento HTML do comprovante para o anexo PDF oficial
    var pdfHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0A0C10; color: #F1F5F9; margin: 0; padding: 25px; }
          .receipt { border: 2px solid #DDAE3B; border-radius: 10px; padding: 26px; background-color: #11141A; }
          .header { border-bottom: 2px solid #232C3D; padding-bottom: 16px; margin-bottom: 18px; text-align: center; }
          .univ { font-size: 11px; font-weight: bold; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.5px; }
          .title { font-size: 22px; font-weight: 900; color: #FFFFFF; margin: 6px 0 4px; }
          .sub { font-size: 12px; color: #DDAE3B; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
          .code-box { background: #07090C; border-left: 4px solid #DDAE3B; border: 1px solid #232C3D; padding: 12px 18px; margin-bottom: 18px; border-radius: 4px; }
          .code-label { font-size: 10px; color: #94A3B8; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
          .code-val { font-size: 24px; font-weight: 900; color: #DDAE3B; font-family: monospace; letter-spacing: 1px; margin-top: 2px; }
          .grid { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
          .grid td { font-size: 13px; padding: 6px 0; }
          .info-box { background: #161B24; border-left: 3px solid #2563EB; padding: 12px 16px; border-radius: 4px; font-size: 12px; line-height: 1.5; margin-bottom: 16px; color: #E2E8F0; }
          .agenda { font-size: 11px; color: #94A3B8; line-height: 1.6; border-top: 1px solid #232C3D; padding-top: 12px; }
          .footer { font-size: 10px; color: #64748B; margin-top: 16px; text-align: center; border-top: 1px solid #1E293B; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="univ">Universidade Federal da Bahia &bull; Escola Politécnica</div>
            <div class="title">SEMIN UFBA 2026 &mdash; 50 Anos (1976&ndash;2026)</div>
            <div class="sub">Comprovante Oficial de Inscrição &bull; Credencial do Congressista</div>
          </div>
          <div class="code-box">
            <div class="code-label">Número Único de Inscrição</div>
            <div class="code-val">${codInscricao}</div>
          </div>
          <table class="grid">
            <tr><td style="color:#94A3B8; width:130px;"><strong>Congressista:</strong></td><td style="color:#FFFFFF;"><strong>${nome}</strong></td></tr>
            <tr><td style="color:#94A3B8;"><strong>E-mail:</strong></td><td style="color:#E2E8F0;">${email}</td></tr>
            <tr><td style="color:#94A3B8;"><strong>Categoria:</strong></td><td style="color:#F6AD55; font-weight:bold;">${categoria}</td></tr>
            <tr><td style="color:#94A3B8;"><strong>Data de Registro:</strong></td><td style="color:#E2E8F0;">${dataHora}</td></tr>
            <tr><td style="color:#94A3B8;"><strong>Status Oficial:</strong></td><td style="color:#4ADE80; font-weight:bold;">Confirmada</td></tr>
          </table>
          <div class="info-box">
            <strong>Período:</strong> 09 a 14 de Novembro de 2026<br>
            <strong>Local:</strong> Escola Politécnica da UFBA (Auditório Leopoldo Amaral) &bull; Salvador/BA<br>
            <strong>Autenticação Online:</strong> ${linkValidacao}
          </div>
          <div class="agenda">
            &bull; <strong>09 a 11/11:</strong> Treinamentos e Minicursos Práticos Especializados<br>
            &bull; <strong>12 e 13/11:</strong> Palestras Magnas, Painéis Executivos e Mesas Redondas<br>
            &bull; <strong>14/11:</strong> Solenidade Oficial de Encerramento (Comemoração dos 50 Anos)
          </div>
          <div class="footer">
            Realização: DAEMIN &bull; CRISTAL Jr. &bull; Escola Politécnica da UFBA
          </div>
        </div>
      </body>
      </html>
    `;

    var pdfBlob = Utilities.newBlob(pdfHtml, 'text/html', 'Comprovante_Inscricao.html')
                           .getAs('application/pdf')
                           .setName('Comprovante_Inscricao.pdf');

    // 2. Corpo do E-mail Institucional Completo com Redes Sociais e Comunidade
    var htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin: 0; padding: 0; background-color: #06080B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #06080B; padding: 25px 10px;">
          <tr>
            <td align="center">
              
              <!-- Cartão do E-mail -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #11141A; border: 1px solid #DDAE3B; border-radius: 10px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.7);">
                
                <!-- 1. CABEÇALHO: LOGO DO EVENTO GRANDE E CENTRALIZADA NO INÍCIO -->
                <tr>
                  <td align="center" style="background-color: #0A0D12; padding: 28px 20px 22px; border-bottom: 2px solid #232C3D;">
                    <a href="${LINKS.SITE}" target="_blank" style="text-decoration: none; display: block;">
                      <img src="${LOGOS.SEMIN}" alt="SEMIN UFBA 2026" width="260" style="display: block; margin: 0 auto; max-width: 260px; height: auto; border: 0;" />
                    </a>
                    <div style="font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 2px; margin-top: 14px;">
                      Universidade Federal da Bahia &bull; Escola Politécnica
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #DDAE3B; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">
                      Edição Histórica de 50 Anos (1976 &mdash; 2026)
                    </div>
                  </td>
                </tr>

                <!-- Mensagem de Confirmação -->
                <tr>
                  <td style="padding: 26px 30px 14px; font-size: 14px; line-height: 1.6; color: #CBD5E1;">
                    Prezado(a) <strong style="color: #FFFFFF; font-size: 15px;">${nome}</strong>,<br><br>
                    Sua inscrição para a <strong>SEMIN UFBA 2026 &mdash; Semana de Mineração da UFBA</strong> foi registrada com sucesso no sistema oficial do evento.
                  </td>
                </tr>

                <!-- Box do Número Único de Inscrição -->
                <tr>
                  <td style="padding: 0 30px 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07090D; border: 1px solid #232C3D; border-left: 4px solid #DDAE3B; border-radius: 6px; padding: 14px 18px;">
                      <tr>
                        <td>
                          <div style="font-size: 10px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700;">
                            Número Oficial de Inscrição
                          </div>
                          <div style="font-size: 24px; font-weight: 900; color: #DDAE3B; font-family: 'Courier New', Courier, monospace; letter-spacing: 1.5px; margin-top: 3px;">
                            ${codInscricao}
                          </div>
                        </td>
                        <td align="right" style="vertical-align: middle;">
                          <span style="background-color: rgba(34, 197, 94, 0.15); color: #4ADE80; border: 1px solid rgba(34, 197, 94, 0.4); padding: 5px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                            Confirmada
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Resumo dos Dados do Congressista -->
                <tr>
                  <td style="padding: 0 30px 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0C0F15; border-radius: 6px; border: 1px solid #1E2633; padding: 14px 18px; font-size: 13px; line-height: 1.8;">
                      <tr>
                        <td style="color: #94A3B8; width: 110px;"><strong>Congressista:</strong></td>
                        <td style="color: #FFFFFF; font-weight: 600;">${nome}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;"><strong>E-mail:</strong></td>
                        <td style="color: #E2E8F0;">${email}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;"><strong>Categoria:</strong></td>
                        <td style="color: #F6AD55; font-weight: 600;">${categoria}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;"><strong>Registro:</strong></td>
                        <td style="color: #CBD5E1;">${dataHora}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Bloco de Validação & QR Code -->
                <tr>
                  <td style="padding: 0 30px 22px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A0D12; border: 1px solid #232C3D; border-radius: 6px; padding: 18px;">
                      <tr>
                        <td align="center">
                          <div style="font-size: 11px; font-weight: 700; color: #DDAE3B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                            Validação Digital da Credencial
                          </div>
                          <img src="${qrCodeUrl}" alt="QR Code Oficial" width="120" height="120" style="border: 2px solid #DDAE3B; border-radius: 4px; padding: 4px; display: block; margin: 0 auto 14px;" />
                          
                          <a href="${linkValidacao}" target="_blank" style="display: inline-block; background-color: #DDAE3B; color: #090A0C; padding: 11px 24px; border-radius: 5px; font-weight: 700; font-size: 12px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">
                            Acessar Validador Oficial
                          </a>
                          
                          <div style="margin-top: 10px; font-size: 10px; color: #94A3B8;">
                            Link: <a href="${linkValidacao}" target="_blank" style="color: #DDAE3B; text-decoration: underline;">${linkValidacao}</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Aviso do Anexo em PDF -->
                <tr>
                  <td style="padding: 0 30px 20px;">
                    <div style="background-color: rgba(37, 99, 235, 0.08); border-left: 3px solid #2563EB; border-radius: 4px; padding: 12px 16px; font-size: 12px; line-height: 1.5; color: #CBD5E1;">
                      <strong style="color: #FFFFFF;">Comprovante em PDF Anexado:</strong><br>
                      O arquivo <strong>Comprovante_Inscricao.pdf</strong> está anexado a esta mensagem para impressão ou apresentação no credenciamento.
                    </div>
                  </td>
                </tr>

                <!-- SEÇÃO EXCLUSIVA: REDES SOCIAIS, PORTAL E COMUNIDADE -->
                <tr>
                  <td style="padding: 0 30px 22px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0E131A; border: 1px solid #232C3D; border-radius: 6px; padding: 18px 20px;">
                      <tr>
                        <td align="center" style="padding-bottom: 12px;">
                          <div style="font-size: 12px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1px;">
                            Conecte-se com a SEMIN UFBA 2026
                          </div>
                          <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">
                            Acompanhe novidades, programação e participe da rede de congressistas
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <!-- Botão Portal Oficial -->
                              <td align="center" style="padding: 6px 8px;">
                                <a href="${LINKS.SITE}" target="_blank" style="display: inline-block; background-color: #1A222D; border: 1px solid #334155; border-radius: 6px; padding: 8px 14px; text-decoration: none; color: #FFFFFF; font-size: 11px; font-weight: 700;">
                                  <img src="${ICONS.WEB}" alt="Site" width="14" height="14" style="vertical-align: middle; margin-right: 6px; display: inline-block;" />
                                  Portal Oficial
                                </a>
                              </td>
                              <!-- Botão Instagram -->
                              <td align="center" style="padding: 6px 8px;">
                                <a href="${LINKS.INSTAGRAM}" target="_blank" style="display: inline-block; background-color: #1A222D; border: 1px solid #E1306C; border-radius: 6px; padding: 8px 14px; text-decoration: none; color: #FFFFFF; font-size: 11px; font-weight: 700;">
                                  <img src="${ICONS.INSTAGRAM}" alt="Instagram" width="14" height="14" style="vertical-align: middle; margin-right: 6px; display: inline-block;" />
                                  Instagram Oficial
                                </a>
                              </td>
                              <!-- Botão Comunidade -->
                              <td align="center" style="padding: 6px 8px;">
                                <a href="${LINKS.COMUNIDADE}" target="_blank" style="display: inline-block; background-color: #1A222D; border: 1px solid #25D366; border-radius: 6px; padding: 8px 14px; text-decoration: none; color: #FFFFFF; font-size: 11px; font-weight: 700;">
                                  <img src="${ICONS.WHATSAPP}" alt="Comunidade" width="14" height="14" style="vertical-align: middle; margin-right: 6px; display: inline-block;" />
                                  Comunidade Oficial
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Informações de Programação e Local -->
                <tr>
                  <td style="padding: 0 30px 22px; font-size: 12px; line-height: 1.6; color: #94A3B8; border-top: 1px solid #1E2633; padding-top: 18px;">
                    <strong style="color: #E2E8F0;">Informações do Evento:</strong><br>
                    &bull; <strong>Período:</strong> 09 a 14 de Novembro de 2026<br>
                    &bull; <strong>Local:</strong> Escola Politécnica da UFBA (Auditório Leopoldo Amaral) &bull; Salvador/BA<br>
                    &bull; <strong>Estrutura:</strong> Minicursos (09 a 11/11), Palestras e Painéis Técnicos (12 e 13/11) e Solenidade de 50 Anos (14/11).
                  </td>
                </tr>

                <!-- 2. RODAPÉ INSTITUCIONAL: LOGOS DA UFBA E DAEMIN CENTRALIZADAS NO FINAL -->
                <tr>
                  <td align="center" style="background-color: #07090D; padding: 24px 30px 20px; border-top: 1px solid #232C3D;">
                    
                    <!-- Logos com fundo branco nítido para valorizar o azul da UFBA e o DAEMIN -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px;">
                      <tr>
                        <td align="center" style="padding: 0 12px; vertical-align: middle;">
                          <div style="background-color: #FFFFFF; border-radius: 6px; padding: 6px 14px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                            <img src="${LOGOS.UFBA}" alt="Universidade Federal da Bahia" height="42" style="display: block; border: 0; max-height: 42px;" />
                          </div>
                        </td>
                        <td align="center" style="padding: 0 12px; vertical-align: middle;">
                          <div style="background-color: #FFFFFF; border-radius: 6px; padding: 6px 14px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                            <img src="${LOGOS.DAEMIN}" alt="DAEMIN UFBA" height="42" style="display: block; border: 0; max-height: 42px;" />
                          </div>
                        </td>
                      </tr>
                    </table>

                    <div style="font-size: 11px; color: #94A3B8; line-height: 1.5; margin-top: 8px;">
                      Universidade Federal da Bahia &bull; Escola Politécnica<br>
                      <strong>DAEMIN &bull; CRISTAL Jr. &bull; Comissão Organizadora SEMIN 2026</strong><br>
                      <a href="mailto:contato@seminufba.com.br" style="color: #DDAE3B; text-decoration: none;">contato@seminufba.com.br</a> &bull; <a href="${LINKS.SITE}" target="_blank" style="color: #DDAE3B; text-decoration: none;">seminufba.com.br</a>
                    </div>
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
      htmlBody: htmlBody,
      name: 'SEMIN UFBA 2026',
      attachments: [pdfBlob]
    };

    try {
      GmailApp.sendEmail(email, assunto, '', emailOptions);
      Logger.log('E-mail institucional enviado via GmailApp para: ' + email);
    } catch (gErr) {
      MailApp.sendEmail(email, assunto, '', emailOptions);
      Logger.log('E-mail institucional enviado via MailApp para: ' + email);
    }

  } catch (mailErr) {
    Logger.log('Erro ao enviar e-mail: ' + mailErr.toString());
  }
}

/**
 * Consulta de validação para o Validador Web (doGet)
 */
function doGet(e) {
  var code = (e && e.parameter) ? e.parameter.code : '';

  if (!code) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Código de inscrição não informado.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    var searchCode = code.trim().toUpperCase();

    for (var i = 1; i < data.length; i++) {
      var rowDate = data[i][0];
      var rowNome = String(data[i][1] || '').trim();
      var rowEmail = String(data[i][2] || '').trim().toUpperCase();
      var rowTipo = data[i][3];
      var rowId = String(data[i][4] || '').trim().toUpperCase();

      // Ignora linhas que foram deletadas ou estão vazias
      if (!rowNome && !rowEmail && !rowId) continue;

      if (rowId === searchCode || rowEmail === searchCode || (rowId && searchCode.includes(rowId))) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          found: true,
          data: {
            dataHora: rowDate,
            nome: rowNome,
            email: data[i][2],
            categoria: rowTipo,
            codInscricao: data[i][4] || ('SEMIN-2026-' + ("0000" + i).slice(-4)),
            status: 'Confirmada'
          }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      found: false,
      message: 'Inscrição não localizada.'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Erro: ' + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função Opcional: Atualiza e padroniza as inscrições anteriores para o formato SEMIN-2026-0001, SEMIN-2026-0002...
 */
function preencherCodigosInscricoesAntigas() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var idAtual = String(data[i][4] || '').trim();
    if (!idAtual || idAtual.toLowerCase() === 'sucesso' || !idAtual.startsWith('SEMIN-')) {
      var numeroFormatado = ("0000" + i).slice(-4);
      var novoCodigo = 'SEMIN-2026-' + numeroFormatado;
      sheet.getRange(i + 1, 5).setValue(novoCodigo);
      sheet.getRange(i + 1, 6).setValue('Confirmada');
      count++;
    }
  }

  Logger.log('Códigos sequenciais gerados para ' + count + ' inscrições antigas com sucesso!');
}
