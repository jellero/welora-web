<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

const DEFAULT_TO = 'lancio@welora.it';
const DEFAULT_FROM = 'lancio@welora.it';
const CUSTOMER_REPLY_TO = 'lancio@welora.it';

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

function encodeSubject(string $subject): string
{
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

function html(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function sendCustomerConfirmation(string $email, string $name, string $businessType, string $from): bool
{
    $firstNameParts = preg_split('/\s+/', trim($name));
    $firstName = $firstNameParts && isset($firstNameParts[0]) ? $firstNameParts[0] : $name;
    $safeFirstName = html($firstName);
    $safeBusinessType = html($businessType);

    $subject = 'Welora Founding — abbiamo ricevuto la tua richiesta';
    $plain = implode("\n", [
        'Ciao ' . $firstName . ',',
        '',
        'grazie per aver scelto di conoscere Welora in anteprima.',
        'Abbiamo ricevuto la tua richiesta per il programma Founding e la valuteremo personalmente per capire come Welora può adattarsi ai flussi della tua struttura.',
        '',
        'Il programma Founding prevede, per gli aderenti ammessi entro i limiti indicati sul sito:',
        '- 50% sul canone Welora Base per i primi 12 mesi dal go-live;',
        '- prezzo di listino bloccato per i successivi 12 mesi;',
        '- nessun pagamento prima dell’attivazione;',
        '- priorità nell’onboarding.',
        '',
        'Il prossimo passo: ti contatteremo per conoscere meglio la struttura, i flussi che vuoi semplificare e verificare insieme che Welora sia la soluzione giusta.',
        '',
        'Puoi rispondere direttamente a questa email oppure scrivere a lancio@welora.it.',
        '',
        'Welora',
        'https://welora.it',
        '',
        'Hai ricevuto questa email perché hai richiesto un contatto dal sito welora.it.',
    ]);

    $htmlBody = '<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . html($subject) . '</title></head>'
        . '<body style="margin:0;padding:0;background:#f3f5f8;font-family:Arial,Helvetica,sans-serif;color:#172033;">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f5f8;padding:28px 14px;"><tr><td align="center">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 55px rgba(11,18,32,.12);">'
        . '<tr><td style="background:#0b1220;padding:34px 36px 32px;color:#ffffff;">'
        . '<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="width:46px;height:46px;background:#40dba2;border-radius:14px;text-align:center;vertical-align:middle;color:#0b1220;font-size:24px;font-weight:800;">W</td><td style="padding-left:13px;font-size:22px;font-weight:800;letter-spacing:-.4px;">Welora</td></tr></table>'
        . '<div style="margin-top:32px;color:#40dba2;font-size:12px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase;">Programma Founding</div>'
        . '<h1 style="margin:10px 0 0;font-size:34px;line-height:1.12;letter-spacing:-1px;color:#ffffff;">La tua richiesta è arrivata.<br>Ora inizia la parte interessante.</h1>'
        . '</td></tr>'
        . '<tr><td style="padding:34px 36px 12px;">'
        . '<p style="margin:0 0 18px;font-size:18px;line-height:1.65;">Ciao <strong>' . $safeFirstName . '</strong>,</p>'
        . '<p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#445066;">grazie per aver scelto di conoscere Welora in anteprima. Abbiamo ricevuto la tua richiesta per <strong>' . $safeBusinessType . '</strong> e la valuteremo personalmente per capire come semplificare i flussi della tua struttura, senza costringerti a sommare software diversi.</p>'
        . '<div style="margin:28px 0;padding:24px;border:1px solid #dfe5ec;border-radius:18px;background:#f8fafb;">'
        . '<div style="font-size:13px;font-weight:800;color:#0c6c4d;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Cosa riserviamo ai Founding</div>'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">'
        . '<tr><td style="padding:9px 0;font-size:15px;line-height:1.5;"><span style="color:#19b77d;font-weight:900;">✓</span>&nbsp;&nbsp;<strong>-50%</strong> sul canone Welora Base per i primi 12 mesi dal go-live</td></tr>'
        . '<tr><td style="padding:9px 0;font-size:15px;line-height:1.5;"><span style="color:#19b77d;font-weight:900;">✓</span>&nbsp;&nbsp;Prezzo di listino bloccato per i successivi 12 mesi</td></tr>'
        . '<tr><td style="padding:9px 0;font-size:15px;line-height:1.5;"><span style="color:#19b77d;font-weight:900;">✓</span>&nbsp;&nbsp;Nessun pagamento prima dell’attivazione</td></tr>'
        . '<tr><td style="padding:9px 0;font-size:15px;line-height:1.5;"><span style="color:#19b77d;font-weight:900;">✓</span>&nbsp;&nbsp;Priorità nell’onboarding e raccolta feedback</td></tr>'
        . '</table></div>'
        . '<h2 style="margin:30px 0 10px;font-size:22px;line-height:1.25;color:#172033;">Cosa succede adesso?</h2>'
        . '<p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#445066;">Ti contatteremo per conoscere meglio la struttura, capire quali passaggi oggi ti fanno perdere più tempo e verificare insieme che Welora sia la soluzione giusta. Non vogliamo venderti un elenco di funzioni: vogliamo capire il tuo modo di lavorare.</p>'
        . '<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px;"><tr><td style="border-radius:12px;background:#40dba2;"><a href="https://welora.it/#piattaforma" style="display:inline-block;padding:14px 22px;color:#0b1220;text-decoration:none;font-size:15px;font-weight:800;">Scopri cosa include Welora →</a></td></tr></table>'
        . '<p style="margin:0;padding:18px 0 0;border-top:1px solid #e5e9ef;font-size:14px;line-height:1.7;color:#637083;">Hai una domanda nel frattempo? <a href="mailto:lancio@welora.it" style="color:#0c6c4d;font-weight:700;text-decoration:none;">Rispondi a questa email</a>: arriverà direttamente al team Welora.</p>'
        . '</td></tr>'
        . '<tr><td style="padding:24px 36px 30px;background:#0b1220;color:#b7c0cf;font-size:12px;line-height:1.6;">'
        . '<strong style="color:#ffffff;font-size:14px;">Welora</strong><br>Un solo gestionale, dalla singola struttura al multi-sede.<br><a href="https://welora.it" style="color:#40dba2;text-decoration:none;">welora.it</a> &nbsp;·&nbsp; <a href="mailto:lancio@welora.it" style="color:#40dba2;text-decoration:none;">lancio@welora.it</a>'
        . '<div style="margin-top:14px;color:#7f8a9b;">Hai ricevuto questa email perché hai richiesto un contatto dal sito welora.it. Le condizioni definitive del programma Founding saranno confermate prima della sottoscrizione.</div>'
        . '</td></tr></table></td></tr></table></body></html>';

    $boundary = 'welora-' . bin2hex(random_bytes(12));
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'From: Welora <' . $from . '>',
        'Reply-To: ' . CUSTOMER_REPLY_TO,
        'X-Mailer: PHP/' . PHP_VERSION,
    ];

    $multipart = '--' . $boundary . "\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $plain . "\r\n\r\n"
        . '--' . $boundary . "\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $htmlBody . "\r\n\r\n"
        . '--' . $boundary . '--';

    return @mail($email, encodeSubject($subject), $multipart, implode("\r\n", $headers));
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

$sent = @mail($to, encodeSubject($subject), $body, implode("\r\n", $headers));
if (!$sent) {
    finish(false, 'Invio non riuscito. Puoi scrivere direttamente a lancio@welora.it.', 500);
}

// L'autorisposta è best effort: la richiesta commerciale resta valida anche se il provider mail rifiuta la conferma al cliente.
sendCustomerConfirmation($email, $name, $businessType, $from);

finish(true, 'Richiesta inviata. Controlla la tua email: ti abbiamo inviato una conferma Welora.');
