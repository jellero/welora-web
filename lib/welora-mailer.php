<?php
declare(strict_types=1);

/*
 * Invio email del sito Welora.
 *
 * Se è configurato un server SMTP (variabili d'ambiente o file di
 * configurazione privato) le email partono via SMTP autenticato con
 * PHPMailer: il mittente di busta (Return-Path) diventa la casella
 * autenticata, quindi SPF, DKIM e DMARC risultano allineati su welora.it.
 *
 * Se SMTP non è configurato, o fallisce e il ripiego è attivo, si usa
 * mail() di PHP come prima, così un problema SMTP non fa perdere i lead.
 *
 * Configurazione (prima trovata vince):
 *   1. variabili d'ambiente SMTP_HOST, SMTP_PORT, SMTP_SECURE,
 *      SMTP_USER, SMTP_PASS, SMTP_FALLBACK_MAIL;
 *   2. ../welora-mail-config.php (fuori dalla cartella pubblicata);
 *   3. private/mail-config.php (escluso da git, bloccato via .htaccess).
 * Vedi private/mail-config.example.php.
 */

use PHPMailer\PHPMailer\Exception as PHPMailerException;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

/**
 * @return array{host:string,port:int,secure:string,user:string,pass:string,fallback_mail:bool}|null
 */
function weloraSmtpConfig(): ?array
{
    static $loaded = false;
    static $config = null;
    if ($loaded) {
        return $config;
    }
    $loaded = true;

    $raw = null;
    if ((string) getenv('SMTP_HOST') !== '') {
        $raw = [
            'host' => getenv('SMTP_HOST'),
            'port' => getenv('SMTP_PORT') ?: null,
            'secure' => getenv('SMTP_SECURE') ?: null,
            'user' => getenv('SMTP_USER') ?: '',
            'pass' => getenv('SMTP_PASS') ?: '',
            'fallback_mail' => getenv('SMTP_FALLBACK_MAIL'),
        ];
    } else {
        $siteRoot = dirname(__DIR__);
        foreach ([dirname($siteRoot) . '/welora-mail-config.php', $siteRoot . '/private/mail-config.php'] as $file) {
            // @: con open_basedir la cartella sopra il sito può non essere accessibile.
            if (@is_file($file) && @is_readable($file)) {
                $data = require $file;
                if (is_array($data)) {
                    $raw = $data;
                    break;
                }
            }
        }
    }

    if ($raw === null || trim((string) ($raw['host'] ?? '')) === '') {
        return null;
    }

    $secure = strtolower(trim((string) ($raw['secure'] ?? 'ssl')));
    if (!in_array($secure, ['ssl', 'tls', 'none'], true)) {
        $secure = 'ssl';
    }
    $port = (int) ($raw['port'] ?? 0);
    if ($port <= 0) {
        $port = $secure === 'ssl' ? 465 : ($secure === 'tls' ? 587 : 25);
    }
    $fallback = $raw['fallback_mail'] ?? true;
    if (is_string($fallback)) {
        $fallback = $fallback === '' ? true : filter_var($fallback, FILTER_VALIDATE_BOOLEAN);
    }

    $config = [
        'host' => trim((string) $raw['host']),
        'port' => $port,
        'secure' => $secure,
        'user' => trim((string) ($raw['user'] ?? '')),
        'pass' => (string) ($raw['pass'] ?? ''),
        'fallback_mail' => (bool) $fallback,
    ];

    return $config;
}

/**
 * Invia un'email. $html è opzionale: se presente il messaggio è
 * multipart/alternative con $text come versione testuale.
 */
function weloraSendMail(
    string $kind,
    string $to,
    string $subject,
    string $text,
    ?string $html,
    string $from,
    string $fromName,
    string $replyTo
): bool {
    $config = weloraSmtpConfig();

    if ($config !== null) {
        $error = weloraSendSmtp($config, $to, $subject, $text, $html, $from, $fromName, $replyTo);
        if ($error === null) {
            return true;
        }
        error_log(sprintf('[Welora mail] %s via SMTP %s:%d fallita: %s', $kind, $config['host'], $config['port'], $error));
        if (!$config['fallback_mail']) {
            return false;
        }
        error_log('[Welora mail] ' . $kind . ': ripiego su mail()');
    }

    return weloraSendPhpMail($kind, $to, $subject, $text, $html, $from, $fromName, $replyTo);
}

/**
 * @param array{host:string,port:int,secure:string,user:string,pass:string,fallback_mail:bool} $config
 * @return string|null null se inviata, altrimenti il motivo dell'errore
 */
function weloraSendSmtp(
    array $config,
    string $to,
    string $subject,
    string $text,
    ?string $html,
    string $from,
    string $fromName,
    string $replyTo
): ?string {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $config['host'];
        $mail->Port = $config['port'];
        $mail->Timeout = 15;
        $mail->SMTPDebug = SMTP::DEBUG_OFF;
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->Encoding = PHPMailer::ENCODING_BASE64;
        $mail->XMailer = ' ';

        if ($config['secure'] === 'ssl') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } elseif ($config['secure'] === 'tls') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        } else {
            $mail->SMTPSecure = '';
            $mail->SMTPAutoTLS = false;
        }

        if ($config['user'] !== '') {
            $mail->SMTPAuth = true;
            $mail->Username = $config['user'];
            $mail->Password = $config['pass'];
        }

        // Mittente di busta = casella autenticata: è ciò che allinea SPF.
        $envelope = $config['user'] !== '' ? $config['user'] : $from;
        $mail->setFrom($from, $fromName, false);
        $mail->Sender = $envelope;
        $mail->addAddress($to);
        $mail->addReplyTo($replyTo);
        $mail->Subject = $subject;

        if ($html !== null) {
            $mail->isHTML(true);
            $mail->Body = $html;
            $mail->AltBody = $text;
        } else {
            $mail->isHTML(false);
            $mail->Body = $text;
        }

        $mail->send();
        return null;
    } catch (PHPMailerException $e) {
        return $mail->ErrorInfo !== '' ? $mail->ErrorInfo : $e->getMessage();
    } catch (\Throwable $e) {
        return get_class($e) . ': ' . $e->getMessage();
    }
}

function weloraSendPhpMail(
    string $kind,
    string $to,
    string $subject,
    string $text,
    ?string $html,
    string $from,
    string $fromName,
    string $replyTo
): bool {
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . $fromName . ' <' . $from . '>',
        'Sender: ' . $from,
        'Reply-To: ' . $replyTo,
    ];

    if ($html !== null) {
        $boundary = 'welora-' . bin2hex(random_bytes(12));
        $headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';
        $body = '--' . $boundary . "\r\n"
            . "Content-Type: text/plain; charset=UTF-8\r\n"
            . "Content-Transfer-Encoding: 8bit\r\n\r\n"
            . $text . "\r\n\r\n"
            . '--' . $boundary . "\r\n"
            . "Content-Type: text/html; charset=UTF-8\r\n"
            . "Content-Transfer-Encoding: 8bit\r\n\r\n"
            . $html . "\r\n\r\n"
            . '--' . $boundary . '--';
    } else {
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $body = $text;
    }

    $warning = null;
    set_error_handler(static function (int $severity, string $message) use (&$warning): bool {
        $warning = $message;
        return true;
    });

    try {
        $sent = mail(
            $to,
            '=?UTF-8?B?' . base64_encode($subject) . '?=',
            $body,
            implode("\r\n", $headers),
            '-f' . $from
        );
    } finally {
        restore_error_handler();
    }

    if (!$sent || $warning !== null) {
        error_log(sprintf(
            '[Welora mail] %s via mail() fallita; mail_result=%s; warning=%s; sendmail_path=%s; php=%s',
            $kind,
            $sent ? 'true' : 'false',
            $warning ?? 'none',
            (string) ini_get('sendmail_path'),
            PHP_VERSION
        ));
    }

    return $sent;
}
