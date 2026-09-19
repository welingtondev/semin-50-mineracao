/**
 * SEMIN UFBA 2026 - Client Form Handler & Official PDF Receipt Generator
 * Edição Histórica de 50 Anos da Engenharia de Minas da UFBA (1976 - 2026)
 */

// URL do Google Apps Script (Web App implantado)
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyZSoH6DStsVd3mohww3xFPH0sHrhyPKyizCLC5fkvO-J4n-_XFkkmo_qTlf2vquQRq/exec';

// Caminho de validação e autenticação das inscrições
const VALIDATION_BASE_URL = 'https://seminufba.com.br/validador';

/**
 * Manipulador de submissão do formulário de inscrição
 * @param {Event} event
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = 'Processando inscrição...';
  }

  const formData = {
    nome: (document.getElementById('nome')?.value || '').trim(),
    email: (document.getElementById('email')?.value || '').trim(),
    telefone: (document.getElementById('telefone')?.value || '').trim(),
    categoria: document.getElementById('categoria')?.value || ''
  };

  try {
    let result;

    // Se a URL ainda for o placeholder inicial, faz simulação para teste local imediato
    if (!WEB_APP_URL || WEB_APP_URL === 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI' || !WEB_APP_URL.startsWith('http')) {
      console.warn('[SEMIN UFBA 2026] WEB_APP_URL não configurada. Simulando retorno com sucesso para visualização.');
      await new Promise(resolve => setTimeout(resolve, 700));

      const randomCode = 'SEMIN-' + Math.floor(100000 + Math.random() * 900000);
      result = {
        success: true,
        codInscricao: randomCode,
        data: {
          codInscricao: randomCode,
          ...formData,
          dataRegistro: new Date().toLocaleString('pt-BR')
        }
      };
    } else {
      // Disparo real para o Web App (Google Apps Script)
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' } // text/plain evita pre-flight OPTIONS do CORS
      });

      result = await response.json();
    }

    if (result && result.success) {
      // Exibe seção de sucesso com transição suave
      const formSec = document.getElementById('formSection');
      const successSec = document.getElementById('successSection');

      if (formSec) formSec.style.display = 'none';
      if (successSec) {
        successSec.style.display = 'block';
        successSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      const codInscricaoFinal = result.codInscricao || result.data?.codInscricao || 'SEMIN-CONFIRMADO';

      const displayCodeEl = document.getElementById('displayCode');
      if (displayCodeEl) {
        displayCodeEl.innerText = codInscricaoFinal;
      }

      // Atualiza link de validação na tela de sucesso
      const valLinkEl = document.getElementById('validationLink');
      if (valLinkEl) {
        const valUrl = `${VALIDATION_BASE_URL}/?code=${encodeURIComponent(codInscricaoFinal)}`;
        valLinkEl.href = valUrl;
        valLinkEl.innerText = valUrl;
      }

      // Prepara e armazena os dados para download direto via html2pdf
      window.currentRegistration = result.data || {
        codInscricao: codInscricaoFinal,
        ...formData,
        dataRegistro: new Date().toLocaleString('pt-BR')
      };
    } else {
      alert('Erro: ' + (result?.message || 'Falha ao processar inscrição.'));
    }
  } catch (err) {
    console.error('Erro na submissão:', err);
    alert('Erro de conexão ao enviar dados. Tente novamente.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Garantir Inscrição';
    }
  }
}

/**
 * Download do comprovante oficial premium no navegador usando html2pdf.js
 */
function downloadReceiptPDF() {
  const p = window.currentRegistration;
  if (!p) {
    alert('Nenhuma inscrição encontrada para gerar comprovante.');
    return;
  }

  // Verifica se a biblioteca html2pdf está carregada
  if (typeof html2pdf === 'undefined') {
    alert('A biblioteca de geração de PDF está sendo carregada. Aguarde alguns instantes e tente novamente.');
    return;
  }

  const downloadBtn = document.getElementById('downloadPdfBtn');
  const originalBtnText = downloadBtn ? downloadBtn.innerHTML : '';
  if (downloadBtn) {
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = 'Gerando Comprovante Oficial...';
  }

  const codInscricao = p.codInscricao || 'SEMIN-CONFIRMADO';
  const validationUrl = `${VALIDATION_BASE_URL}/?code=${encodeURIComponent(codInscricao)}`;
  const emissionDate = p.dataRegistro || new Date().toLocaleString('pt-BR');
  const securityHash = 'UFBA-' + Math.abs((codInscricao + (p.email || '')).split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16).toUpperCase();

  const tempReceipt = document.createElement('div');
  tempReceipt.style.position = 'absolute';
  tempReceipt.style.left = '-9999px';
  tempReceipt.style.top = '0';
  tempReceipt.style.width = '780px';
  tempReceipt.style.backgroundColor = '#0B0D11';
  tempReceipt.style.color = '#F3F4F6';
  tempReceipt.style.padding = '28px';
  tempReceipt.style.fontFamily = 'Inter, Arial, -apple-system, sans-serif';
  tempReceipt.style.boxSizing = 'border-box';

  tempReceipt.innerHTML = `
    <div style="background: linear-gradient(145deg, #14181F 0%, #0F1217 100%); border: 2px solid #DDAE3B; border-radius: 12px; padding: 28px; box-sizing: border-box; box-shadow: 0 10px 30px rgba(0,0,0,0.6); position: relative;">
      
      <!-- Cabeçalho Institucional -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2B3D52; padding-bottom: 18px; margin-bottom: 20px;">
        <div>
          <div style="font-size: 11px; font-weight: 800; color: #A0AEC0; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
            UNIVERSIDADE FEDERAL DA BAHIA &bull; ESCOLA POLITÉCNICA
          </div>
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 0.5px; line-height: 1.2;">
            SEMIN UFBA 2026
          </h1>
          <div style="color: #DDAE3B; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px;">
            Comprovante Oficial de Inscrição &bull; Credencial
          </div>
        </div>

        <div style="text-align: right;">
          <div style="background: linear-gradient(135deg, #2B3D52, #1B2838); color: #DDAE3B; padding: 8px 16px; border-radius: 6px; font-weight: 900; font-size: 12px; border: 1px solid #DDAE3B; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
            Jubileu de Ouro &bull; 50 Anos
          </div>
          <div style="font-size: 10px; color: #718096; margin-top: 5px; font-family: monospace;">
            1976 &mdash; 2026
          </div>
        </div>
      </div>

      <!-- Barra de Destaque do Código & Autenticação -->
      <div style="display: flex; justify-content: space-between; align-items: stretch; background: #0A0C10; border: 1px solid #334155; border-left: 5px solid #DDAE3B; border-radius: 8px; padding: 14px 18px; margin-bottom: 22px;">
        <div>
          <span style="font-size: 10px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 800; display: block; margin-bottom: 2px;">
            CÓDIGO OFICIAL DE INSCRIÇÃO
          </span>
          <span style="font-size: 26px; font-weight: 900; color: #DDAE3B; font-family: 'Courier New', Courier, monospace; letter-spacing: 1px;">
            ${codInscricao}
          </span>
        </div>
        <div style="text-align: right; display: flex; flex-direction: column; justify-content: center;">
          <span style="display: inline-block; background: rgba(34, 197, 94, 0.15); color: #4ADE80; border: 1px solid rgba(34, 197, 94, 0.4); padding: 4px 10px; border-radius: 99px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">
            &bull; Inscrição Confirmada
          </span>
          <span style="font-size: 10px; color: #64748B;">
            Emissão: ${emissionDate}
          </span>
        </div>
      </div>

      <!-- Grid Principal: Dados do Participante + QR Code de Validação -->
      <div style="display: flex; justify-content: space-between; align-items: stretch; gap: 20px; margin-bottom: 22px;">
        
        <!-- Bloco de Dados do Participante -->
        <div style="flex: 1.3; background: #13171E; border: 1px solid #232936; border-radius: 8px; padding: 16px 18px;">
          <div style="font-size: 11px; color: #DDAE3B; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #1E2533; padding-bottom: 6px;">
            Dados do Congressista
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 5px 0; color: #94A3B8; width: 95px; font-weight: 600;">Nome:</td>
              <td style="padding: 5px 0; color: #FFFFFF; font-weight: 800;">${p.nome}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #94A3B8; font-weight: 600;">E-mail:</td>
              <td style="padding: 5px 0; color: #E2E8F0;">${p.email}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #94A3B8; font-weight: 600;">WhatsApp:</td>
              <td style="padding: 5px 0; color: #E2E8F0;">${p.telefone || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #94A3B8; font-weight: 600;">Categoria:</td>
              <td style="padding: 5px 0; color: #F6AD55; font-weight: 700;">${p.categoria}</td>
            </tr>
          </table>
        </div>

        <!-- Bloco de Validação & Autenticação Digital -->
        <div style="flex: 0.9; background: #13171E; border: 1px solid #232936; border-radius: 8px; padding: 14px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 10px; color: #DDAE3B; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            Autenticação Digital
          </div>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=${encodeURIComponent(validationUrl)}&color=DDAE3B&bgcolor=13171E" alt="QR Code Oficial" style="border: 2px solid #DDAE3B; border-radius: 6px; padding: 4px; display: block; width: 115px; height: 115px; margin: 0 auto 8px;" />
          <div style="font-size: 10px; color: #94A3B8; margin-bottom: 4px;">
            Link direto de autenticação:
          </div>
          <a href="${validationUrl}" target="_blank" style="color: #DDAE3B; text-decoration: underline; font-weight: 700; font-size: 10px; word-break: break-all; display: block;">
            ${validationUrl}
          </a>
        </div>

      </div>

      <!-- Informações do Evento e Localização -->
      <div style="background: #11151C; border-left: 4px solid #3B82F6; border-radius: 6px; padding: 12px 16px; font-size: 12px; line-height: 1.5; margin-bottom: 18px;">
        <strong style="color: #FFFFFF;">Período Oficial:</strong> 09 a 14 de Novembro de 2026<br>
        <strong style="color: #FFFFFF;">Local:</strong> Escola Politécnica da UFBA (Auditório Leopoldo Amaral) &bull; Salvador &mdash; BA
      </div>

      <!-- Estrutura da Programação de 50 Anos -->
      <div style="background: #0E1117; border: 1px solid #1E2533; border-radius: 6px; padding: 12px 16px; font-size: 11px; color: #CBD5E1; line-height: 1.6; margin-bottom: 18px;">
        <div style="font-weight: 800; color: #E2E8F0; text-transform: uppercase; font-size: 10px; letter-spacing: 0.8px; margin-bottom: 4px;">
          Síntese da Programação Oficial:
        </div>
        &bull; <strong style="color: #FFFFFF;">09 a 11/11:</strong> Treinamentos e Minicursos Práticos Especializados<br>
        &bull; <strong style="color: #FFFFFF;">12 e 13/11:</strong> Palestras Magnas, Painéis Executivos e Mesas Redondas com Líderes do Setor<br>
        &bull; <strong style="color: #FFFFFF;">14/11:</strong> Solenidade Especial de Encerramento &bull; Celebração dos 50 Anos da Engenharia de Minas
      </div>

      <!-- Rodapé de Validação e Assinatura -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #2B3D52; padding-top: 12px; font-size: 10px; color: #64748B;">
        <div>
          Realização: <strong style="color: #94A3B8;">DAEMIN &bull; CRISTAL Jr. &bull; UFBA</strong>
        </div>
        <div style="text-align: right; font-family: monospace;">
          Autenticação: <strong style="color: #94A3B8;">${securityHash}</strong> &bull; Válido com documento oficial
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(tempReceipt);

  const opt = {
    margin: 10,
    filename: 'Comprovante_Inscricao.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(tempReceipt).save().then(() => {
    document.body.removeChild(tempReceipt);
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = originalBtnText;
    }
  }).catch(err => {
    console.error('Erro ao gerar PDF:', err);
    if (document.body.contains(tempReceipt)) {
      document.body.removeChild(tempReceipt);
    }
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = originalBtnText;
    }
    alert('Erro ao gerar comprovante em PDF. Tente novamente.');
  });
}

/**
 * Permite reiniciar o formulário para uma nova submissão
 */
function resetRegistrationForm() {
  const form = document.getElementById('registrationForm');
  if (form) form.reset();

  const formSec = document.getElementById('formSection');
  const successSec = document.getElementById('successSection');

  if (formSec) formSec.style.display = 'block';
  if (successSec) successSec.style.display = 'none';

  formSec?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Máscara e formatação amigável para telefone brasileiro
document.addEventListener('DOMContentLoaded', () => {
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/^(\d*)/, '($1');
      }
      e.target.value = v;
    });
  }

  // Se o formulário tiver listener submit nativo
  const form = document.getElementById('registrationForm');
  if (form && !form.getAttribute('onsubmit')) {
    form.addEventListener('submit', handleFormSubmit);
  }
});

// Exporta para o escopo global para acesso inline via atributos HTML
window.handleFormSubmit = handleFormSubmit;
window.downloadReceiptPDF = downloadReceiptPDF;
window.resetRegistrationForm = resetRegistrationForm;
window.resetForm = resetRegistrationForm;
