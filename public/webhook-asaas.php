<?php
/**
 * Proxy de Webhook Asaas → Google Apps Script
 * 
 * Problema: O Asaas envia POST para a URL configurada e espera resposta 200.
 *           O Google Apps Script retorna 302 (redirect), que o Asaas interpreta como erro,
 *           pausando a fila de webhooks.
 * 
 * Solução: Este arquivo recebe o evento do Asaas, responde 200 imediatamente,
 *          e encaminha o payload para o Google Apps Script seguindo os redirects.
 * 
 * Upload: Coloque este arquivo na raiz do seu site na Hostinger.
 * URL Asaas: https://seusite.com.br/webhook-asaas.php
 */

// ── Configuração ──
$GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0T_fZYdL5JPn2buE7y6Lyu8MF0tRlRilhzTW-uFxO-lyUKFk9T8SKCrirwRZDaBuT/exec';
$ASAAS_WEBHOOK_TOKEN = 'whsec_nZPHTRfMFtE1eMBc6XYPSeQCvb7bveW5qRjDNyOD1QI';

// ── Apenas aceitar POST ──
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── Ler todos os headers para log de debug ──
$allHeadersForDebug = '';
if (function_exists('getallheaders')) {
    $allHeadersForDebug = json_encode(getallheaders());
} else {
    $allHeadersForDebug = json_encode($_SERVER);
}

// ── Validar Token do Asaas ──
$receivedToken = '';

if (isset($_SERVER['HTTP_ASAAS_ACCESS_TOKEN'])) {
    $receivedToken = $_SERVER['HTTP_ASAAS_ACCESS_TOKEN'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    foreach ($headers as $key => $value) {
        if (strtolower($key) === 'asaas-access-token') {
            $receivedToken = $value;
            break;
        }
    }
}

// Ler o corpo da requisição (precisamos ler antes de imprimir a resposta)
$rawBody = file_get_contents('php://input');

// ── Sempre retornar 200 OK para o Asaas parar de desativar o webhook ──
http_response_code(200);
header('Content-Type: application/json');
echo json_encode(['received' => true]);

// Se o token for inválido, registramos o erro no log, mas não repassamos para o Apps Script
if ($receivedToken !== $ASAAS_WEBHOOK_TOKEN) {
    $errorLog = date('Y-m-d H:i:s') . " | BLOQUEADO - Token Invalido. \n";
    $errorLog .= "Token Recebido: '" . $receivedToken . "'\n";
    $errorLog .= "Headers: " . $allHeadersForDebug . "\n";
    $errorLog .= "Body: " . $rawBody . "\n-------------------\n";
    file_put_contents(__DIR__ . '/webhook_log.txt', $errorLog, FILE_APPEND | LOCK_EX);
    
    // Encerra aqui, não repassa para o script
    exit;
}

$payload = json_decode($rawBody, true);

// ── Log para debug (opcional - salva em webhook_log.txt) ──
$logEntry = date('Y-m-d H:i:s') . ' | Event: ' . ($payload['event'] ?? 'unknown') . ' | Payment: ' . ($payload['payment']['id'] ?? 'N/A') . "\n";
file_put_contents(__DIR__ . '/webhook_log.txt', $logEntry, FILE_APPEND | LOCK_EX);

// ── Flush a resposta para o Asaas não ficar esperando ──
if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
} else {
    ob_end_flush();
    flush();
}

// ── Encaminhar para o Google Apps Script em background ──
$ch = curl_init($GOOGLE_APPS_SCRIPT_URL);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $rawBody,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,   // Segue os redirects 302 do Apps Script
    CURLOPT_MAXREDIRS      => 5,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error    = curl_error($ch);
curl_close($ch);

// ── Log do resultado do forward ──
$forwardLog = date('Y-m-d H:i:s') . ' | Forward: HTTP ' . $httpCode . ($error ? ' | Error: ' . $error : ' | OK') . "\n";
file_put_contents(__DIR__ . '/webhook_log.txt', $forwardLog, FILE_APPEND | LOCK_EX);
