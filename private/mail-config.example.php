<?php
/*
 * Configurazione SMTP del sito Welora.
 *
 * DOVE: /var/www/vhosts/welora.it/welora-mail-config.php
 *       (la cartella che CONTIENE httpdocs, fuori dal web).
 *       In alternativa: httpdocs/private/mail-config.php
 *
 * Basta la password della casella lancio@welora.it: server, porta,
 * cifratura e utente hanno già i valori giusti nel codice
 * (out.postassl.it, 465, SSL, lancio@welora.it).
 * Le altre chiavi servono solo se vuoi cambiarli.
 *
 * Questo file con la password NON va mai su GitHub.
 * In alternativa: variabile d'ambiente SMTP_PASS.
 */

return [
    'pass' => 'LA-PASSWORD-DELLA-CASELLA',

    // Facoltativi (valori predefiniti):
    // 'host' => 'out.postassl.it',
    // 'port' => 465,
    // 'secure' => 'ssl',
    // 'user' => 'lancio@welora.it',
    // 'fallback_mail' => true,   // se SMTP fallisce, riprova con mail()
];
