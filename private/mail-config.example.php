<?php
/*
 * Configurazione SMTP del sito Welora.
 *
 * Copia questo file come private/mail-config.php sul server (oppure, meglio,
 * come welora-mail-config.php nella cartella SOPRA quella del sito) e
 * inserisci la password della casella. private/mail-config.php è escluso da
 * git: la password non deve mai finire nel repository.
 *
 * In alternativa puoi usare le variabili d'ambiente SMTP_HOST, SMTP_PORT,
 * SMTP_SECURE, SMTP_USER, SMTP_PASS e SMTP_FALLBACK_MAIL.
 */

return [
    // Aruba Business (welora.it): out.postassl.it, porta 465, SSL.
    // Non smtps.aruba.it: lì le caselle Aruba Business danno 535.
    'host' => 'out.postassl.it',
    'port' => 465,
    'secure' => 'ssl',            // 'ssl' (465), 'tls' (587) oppure 'none'

    // Casella che invia: deve coincidere con il mittente del sito
    // (CONTACT_FROM, predefinito lancio@welora.it).
    'user' => 'lancio@welora.it',
    'pass' => 'INSERISCI-LA-PASSWORD-DELLA-CASELLA',

    // Se SMTP non risponde, prova comunque con mail() di PHP per non
    // perdere la richiesta (con il punteggio antispam più basso di prima).
    'fallback_mail' => true,
];
