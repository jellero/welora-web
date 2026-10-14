<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

const DEFAULT_TO = 'suppor@welora.it';
const DEFAULT_FROM = 'no-reply@welora.it';

function wantsJson(): bool
{
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower((string) $_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}

function finish(bool $ok, string $message, int $status = 200): never
{
    http_response_code($status);
    if (wantsJson()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        $value = $ok ? 'success' : 'error';
        header('Location: index.html?form=' . $value . '#demo', true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    finish(false, 'Metodo non consentito.', 405);
}

// Honeypot: un utente reale non compila questo campo invisibile.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    finish(true, 'Richiesta ricevuta.');
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$businessType = trim((string) ($_POST['business_type'] ?? ''));
$locations = trim((string) ($_POST['locations'] ?? ''));
$resources = trim((string) ($_POST['resources'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$privacy = isset($_POST['privacy']);
$needsRaw = $_POST['needs'] ?? [];
$needs = is_array($needsRaw) ? array_values(array_filter(array_map(static fn($v) => trim((string) $v), $needsRaw))) : [];

if ($name === '' || strlen($name) > 320) {
    finish(false, 'Inserisci nome e cognome validi.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || preg_match('/[\r\n]/', $email)) {
    finish(false, 'Inserisci un indirizzo email valido.', 422);
}
if ($businessType === '' || strlen($businessType) > 320) {
    finish(false, 'Seleziona il tipo di struttura.', 422);
}
if (!$privacy) {
    finish(false, 'È necessario leggere l’informativa privacy e autorizzare il ricontatto richiesto.', 422);
}
if (strlen($phone) > 160 || strlen($message) > 8000) {
    finish(false, 'Uno o più campi superano la lunghezza consentita.', 422);
}

// Rate limit minimo per IP: una richiesta ogni 30 secondi.
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = sys_get_temp_dir() . '/welora-contact-' . hash('sha256', $ip) . '.rate';
$now = time();
$last = is_file($rateFile) ? (int) @file_get_contents($rateFile) : 0;
if ($last > 0 && ($now - $last) < 30) {
    finish(false, 'Attendi qualche secondo prima di inviare una nuova richiesta.', 429);
}
@file_put_contents($rateFile, (string) $now, LOCK_EX);

$allowedNeeds = [
    'bookings' => 'PMS e prenotazioni',
    'checkin' => 'Check-in e adempimenti',
    'payments' => 'Pagamenti e POS',
    'fiscal' => 'Corrispettivi e fatture',
    'operations' => 'Automazioni operative',
    'multisite' => 'Multi-sede',
    'services' => 'Servizi e beni',
    'receptionist' => 'Digital Receptionist futuro',
];
$needLabels = [];
foreach ($needs as $need) {
    if (isset($allowedNeeds[$need])) {
        $needLabels[] = $allowedNeeds[$need];
    }
}

$to = getenv('CONTACT_TO') ?: DEFAULT_TO;
$from = getenv('CONTACT_FROM') ?: DEFAULT_FROM;
$subject = 'Adesione pre-lancio Welora Founding';
$body = implode("\n", [
    'Nuova richiesta dal sito Welora',
    '',
    'Nome: ' . $name,
    'Email: ' . $email,
    'Telefono: ' . ($phone !== '' ? $phone : 'non indicato'),
    'Tipo struttura: ' . $businessType,
    'Numero sedi: ' . ($locations !== '' ? $locations : 'non indicato'),
    'Camere/unità: ' . ($resources !== '' ? $resources : 'non indicato'),
    'Esigenze: ' . ($needLabels ? implode(', ', $needLabels) : 'non specificate'),
    '',
    'Flusso prioritario:',
    $message !== '' ? $message : 'non indicato',
    '',
    'Privacy: informativa dichiarata letta; ricontatto richiesto/autorizzato dal mittente.',
]);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Welora sito <' . $from . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . PHP_VERSION,
];

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$sent = @mail($to, $encodedSubject, $body, implode("\r\n", $headers));
if (!$sent) {
    finish(false, 'Invio non riuscito. Puoi scrivere direttamente a suppor@welora.it.', 500);
}

finish(true, 'Richiesta inviata. Ti ricontatteremo all’indirizzo indicato.');
