<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

const DEFAULT_COMMERCIAL_TO = 'lancio@welora.it';
const DEFAULT_SUPPORT_TO = 'suppor@welora.it';
const DEFAULT_FROM = 'lancio@welora.it';

function wantsJson(): bool
{
    return isset($_SERVER['HTTP_X_REQUESTED_WITH'])
        && strtolower((string) $_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}

function finish(bool $ok, string $message, int $status = 200): never
{
    http_response_code($status);

    if (wantsJson()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            ['ok' => $ok, 'message' => $message],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
    } else {
        header('Location: contatti.html?form=' . ($ok ? 'success' : 'error') . '#contact-form', true, 303);
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

function validMailbox(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false
        && !preg_match('/[\r\n]/', $email);
}

function sendWeloraMail(
    string $kind,
    string $to,
    string $subject,
    string $body,
    array $headers,
    string $envelopeFrom
): bool {
    if (!validMailbox($to) || !validMailbox($envelopeFrom)) {
        error_log('[Welora contact] invalid mailbox configuration for ' . $kind);
        return false;
    }

    $warning = null;
    set_error_handler(static function (int $severity, string $message) use (&$warning): bool {
        $warning = $message;
        return true;
    });

    try {
        $sent = mail(
            $to,
            encodeSubject($subject),
            $body,
            implode("\r\n", $headers),
            '-f' . $envelopeFrom
        );
    } finally {
        restore_error_handler();
    }

    if (!$sent || $warning !== null) {
        error_log(sprintf(
            '[Welora contact] %s failed; mail_result=%s; warning=%s; sendmail_path=%s; php=%s',
            $kind,
            $sent ? 'true' : 'false',
            $warning ?? 'none',
            (string) ini_get('sendmail_path'),
            PHP_VERSION
        ));
    }

    return $sent;
}

function sendConfirmation(
    string $email,
    string $name,
    string $reasonLabel,
    string $replyTo,
    string $from,
    bool $launchOffer
): bool {
    $parts = preg_split('/\s+/', trim($name));
    $firstName = ($parts && isset($parts[0])) ? $parts[0] : $name;
    $safeFirstName = html($firstName);
    $safeReason = html($reasonLabel);
    $subject = 'Welora — abbiamo ricevuto la tua richiesta';

    $plainLines = [
        'Ciao ' . $firstName . ',',
        '',
        'abbiamo ricevuto la tua richiesta relativa a: ' . $reasonLabel . '.',
        'La leggeremo e ti risponderemo usando il contatto più adatto.',
    ];
    if ($launchOffer) {
        $plainLines[] = '';
        $plainLines[] = 'Per lo sconto lancio: -50% sul canone Welora Base per i primi 12 mesi dal go-live, nei limiti e alle condizioni indicate sul sito.';
    }
    $plainLines[] = '';
    $plainLines[] = 'Puoi rispondere direttamente a questa email.';
    $plainLines[] = '';
    $plainLines[] = 'Welora';
    $plainLines[] = 'https://welora.it';
    $plain = implode("\n", $plainLines);

    $offerBlock = $launchOffer
        ? '<div style="margin:26px 0;padding:22px;border:1px solid #cfeee2;border-radius:18px;background:#f2fbf7;">'
            . '<div style="font-size:12px;font-weight:800;color:#0c6c4d;text-transform:uppercase;letter-spacing:1px;">Sconto lancio</div>'
            . '<div style="margin-top:8px;font-size:21px;font-weight:800;color:#172033;">-50% su Welora Base per i primi 12 mesi dal go-live</div>'
            . '<p style="margin:8px 0 0;color:#526071;font-size:13px;line-height:1.6;">Disponibilità, limiti e condizioni definitive vengono confermati prima della sottoscrizione.</p>'
            . '</div>'
        : '';

    $htmlBody = '<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . html($subject) . '</title></head>'
        . '<body style="margin:0;padding:0;background:#f3f5f8;font-family:Arial,Helvetica,sans-serif;color:#172033;">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f5f8;padding:28px 14px;"><tr><td align="center">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 55px rgba(11,18,32,.12);">'
        . '<tr><td style="background:#0b1220;padding:32px 36px;color:#ffffff;">'
        . '<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="width:46px;height:46px;background:#40dba2;border-radius:14px;text-align:center;vertical-align:middle;color:#0b1220;font-size:24px;font-weight:800;">W</td><td style="padding-left:13px;font-size:22px;font-weight:800;">Welora</td></tr></table>'
        . '<div style="margin-top:28px;color:#40dba2;font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">Richiesta ricevuta</div>'
        . '<h1 style="margin:9px 0 0;font-size:31px;line-height:1.15;color:#ffffff;">Grazie, ' . $safeFirstName . '.</h1>'
        . '</td></tr>'
        . '<tr><td style="padding:32px 36px 22px;">'
        . '<p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#445066;">Abbiamo ricevuto la tua richiesta relativa a <strong style="color:#172033;">' . $safeReason . '</strong>.</p>'
        . '<p style="margin:0;font-size:16px;line-height:1.7;color:#445066;">La leggeremo e ti risponderemo usando il contatto più adatto, senza farti ripetere le informazioni che hai già inviato.</p>'
        . $offerBlock
        . '<p style="margin:28px 0 0;padding-top:18px;border-top:1px solid #e5e9ef;font-size:14px;line-height:1.7;color:#637083;">Vuoi aggiungere un dettaglio? <a href="mailto:' . html($replyTo) . '" style="color:#0c6c4d;font-weight:700;text-decoration:none;">Rispondi direttamente a questa email</a>.</p>'
        . '</td></tr>'
        . '<tr><td style="padding:23px 36px 28px;background:#0b1220;color:#aeb8c7;font-size:12px;line-height:1.6;"><strong style="color:#fff;font-size:14px;">Welora</strong><br>Ospitalità, servizi, pagamenti e automazioni nello stesso sistema.<br><a href="https://welora.it" style="color:#40dba2;text-decoration:none;">welora.it</a></td></tr>'
        . '</table></td></tr></table></body></html>';

    $boundary = 'welora-contact-' . bin2hex(random_bytes(12));
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'From: Welora <' . $from . '>',
        'Sender: ' . $from,
        'Reply-To: ' . $replyTo,
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

    return sendWeloraMail('contact-confirmation', $email, $subject, $multipart, $headers, $from);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    finish(false, 'Metodo non consentito.', 405);
}

if (trim((string) ($_POST['website'] ?? '')) !== '') {
    finish(true, 'Richiesta ricevuta.');
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$reason = trim((string) ($_POST['reason'] ?? ''));
$businessType = trim((string) ($_POST['business_type'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$privacy = isset($_POST['privacy']);

$reasons = [
    'demo' => ['label' => 'Demo e valutazione prodotto', 'route' => 'commercial', 'offer' => true],
    'launch_discount' => ['label' => 'Sconto lancio −50%', 'route' => 'commercial', 'offer' => true],
    'product_pricing' => ['label' => 'Prodotto e prezzi', 'route' => 'commercial', 'offer' => false],
    'integrations' => ['label' => 'Integrazioni e canali', 'route' => 'commercial', 'offer' => false],
    'digital_receptionist' => ['label' => 'Digital Receptionist', 'route' => 'commercial', 'offer' => false],
    'partnership' => ['label' => 'Partnership o collaborazione', 'route' => 'commercial', 'offer' => false],
    'support' => ['label' => 'Supporto', 'route' => 'support', 'offer' => false],
    'privacy' => ['label' => 'Privacy o amministrazione', 'route' => 'support', 'offer' => false],
    'security' => ['label' => 'Segnalazione di sicurezza', 'route' => 'support', 'offer' => false],
    'other' => ['label' => 'Altro', 'route' => 'commercial', 'offer' => false],
];

if ($name === '' || strlen($name) > 320) {
    finish(false, 'Inserisci nome e cognome validi.', 422);
}
if (!validMailbox($email) || strlen($email) > 254) {
    finish(false, 'Inserisci un indirizzo email valido.', 422);
}
if (!isset($reasons[$reason])) {
    finish(false, 'Seleziona il motivo della richiesta.', 422);
}
if ($message === '' || strlen($message) > 8000) {
    finish(false, 'Inserisci un messaggio valido.', 422);
}
if (!$privacy) {
    finish(false, 'È necessario leggere l’informativa privacy e autorizzare il ricontatto richiesto.', 422);
}
if (strlen($phone) > 160 || strlen($businessType) > 320) {
    finish(false, 'Uno o più campi superano la lunghezza consentita.', 422);
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = sys_get_temp_dir() . '/welora-general-contact-' . hash('sha256', $ip) . '.rate';
$now = time();
$last = is_file($rateFile) ? (int) @file_get_contents($rateFile) : 0;
if ($last > 0 && ($now - $last) < 30) {
    finish(false, 'Attendi qualche secondo prima di inviare una nuova richiesta.', 429);
}
@file_put_contents($rateFile, (string) $now, LOCK_EX);

$commercialTo = getenv('CONTACT_TO') ?: DEFAULT_COMMERCIAL_TO;
$supportTo = getenv('CONTACT_SUPPORT_TO') ?: DEFAULT_SUPPORT_TO;
$from = getenv('CONTACT_FROM') ?: DEFAULT_FROM;
$route = $reasons[$reason]['route'];
$to = $route === 'support' ? $supportTo : $commercialTo;
$replyTo = $route === 'support' ? $supportTo : $commercialTo;

if (!validMailbox($to) || !validMailbox($from) || !validMailbox($replyTo)) {
    error_log('[Welora contact] invalid CONTACT_TO / CONTACT_SUPPORT_TO / CONTACT_FROM configuration.');
    finish(false, 'Configurazione email non valida sul server.', 500);
}

$reasonLabel = (string) $reasons[$reason]['label'];
$subject = 'Welora contatto — ' . $reasonLabel;
$body = implode("\n", [
    'Nuova richiesta dalla pagina Contatti di Welora',
    '',
    'Motivo: ' . $reasonLabel,
    'Nome: ' . $name,
    'Email: ' . $email,
    'Telefono: ' . ($phone !== '' ? $phone : 'non indicato'),
    'Tipo struttura / attività: ' . ($businessType !== '' ? $businessType : 'non indicato'),
    '',
    'Messaggio:',
    $message,
    '',
    'Privacy: informativa dichiarata letta; ricontatto richiesto/autorizzato dal mittente.',
]);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Welora sito <' . $from . '>',
    'Sender: ' . $from,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . PHP_VERSION,
];

$leadSent = sendWeloraMail('contact-notification-' . $reason, $to, $subject, $body, $headers, $from);
if (!$leadSent) {
    finish(false, 'Il server non è riuscito a spedire la richiesta. Puoi scriverci direttamente via email.', 500);
}

$confirmationSent = sendConfirmation(
    $email,
    $name,
    $reasonLabel,
    $replyTo,
    $from,
    (bool) $reasons[$reason]['offer']
);

if (!$confirmationSent) {
    finish(true, 'Richiesta ricevuta. La conferma automatica non è stata accettata dal server mail, ma il messaggio è arrivato a Welora.');
}

finish(true, 'Richiesta inviata. Ti abbiamo mandato una conferma via email.');
