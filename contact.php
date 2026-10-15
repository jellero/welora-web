<?php
declare(strict_types=1);

/*
 * Compatibilità per il form "Sconto lancio" della home.
 *
 * L'invio viene delegato all'unico endpoint mail del sito
 * (contact-general.php), evitando due implementazioni diverse
 * di mail(), autoresponse e diagnostica.
 */

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    /*
     * Il form home aggiunge via JS un honeypot chiamato "website".
     * Alcune estensioni/autofill possono valorizzare campi nascosti e
     * contact-general.php, correttamente, tratterebbe la richiesta come bot
     * restituendo successo senza inviare email. Per il form di lancio
     * ignoriamo quindi questo honeypot: restano validazione e rate limiting.
     */
    unset($_POST['website']);

    $_POST['reason'] = 'launch_discount';
    $_POST['source'] = 'launch-home';

    $details = [];

    $locations = trim((string) ($_POST['locations'] ?? ''));
    if ($locations !== '') {
        $details[] = 'Numero sedi: ' . $locations;
    }

    $resources = trim((string) ($_POST['resources'] ?? ''));
    if ($resources !== '') {
        $details[] = 'Camere / unità: ' . $resources;
    }

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

    $needsRaw = $_POST['needs'] ?? [];
    if (!is_array($needsRaw) && isset($_POST['needs[]'])) {
        $needsRaw = $_POST['needs[]'];
    }

    if (is_array($needsRaw)) {
        $needLabels = [];
        foreach ($needsRaw as $need) {
            $key = trim((string) $need);
            if (isset($allowedNeeds[$key])) {
                $needLabels[] = $allowedNeeds[$key];
            }
        }
        if ($needLabels !== []) {
            $details[] = 'Esigenze: ' . implode(', ', $needLabels);
        }
    }

    $message = trim((string) ($_POST['message'] ?? ''));
    $context = $details !== []
        ? "Dati dalla landing Sconto lancio:\n- " . implode("\n- ", $details)
        : 'Richiesta Sconto lancio dalla home.';

    $_POST['message'] = $message !== ''
        ? $context . "\n\nMessaggio:\n" . $message
        : $context;
}

require __DIR__ . '/contact-general.php';
