# Backoffice editoriale — MVP

Il sito è la destinazione di pubblicazione. PHP decide la visibilità a ogni richiesta, senza cron. Il runner prepara i file, li carica via HTTPS, quindi programma i social con le loro API native dopo approvazione. Nessuna chiamata social durante visite pubbliche.

## Installazione (da eseguire sul server)
PHP 8.1+ con PDO SQLite, DOM, fileinfo, sessioni. HTTPS obbligatorio. Copiare private/editorial-config.example.php come welora-editorial-config.php nel padre di httpdocs, con permessi limitati; creare directory editorial-data separata da httpdocs e dal repository. Generare credenziali forti distinte: password hash PHP e SHA256 del token runner (32 byte casuali o più). Non riportare segreti in file Git o log. Configurare inoltro Authorization in PHP-FPM, limite upload e timeout Plesk, rate limit/accesso protetto alla route admin; verificare backup e quota disco. Con configurazione assente, API/admin non accessibili, sito pubblico statico resta disponibile.

## Flusso
1. POST /editorial-api.php con bearer, JSON action=save_draft, id, track (operativa/informativa), slug, title, subtitle, content_html, publish_at (ISO 8601 con offset), next_title/next_at (entrambi o nessuno), youtube_text, facebook_text, revision per aggiornamenti. Slug immutabile.
2. POST multipart /editorial-media.php con id, name (video.mp4, thumbnail.jpg, captions.srt), revision, sha256 e file. File privati, MIME/limite/checksum; revision incrementata. GET autenticato per scaricare i file. Il video è privato fino all'uscita; dopo l'uscita, con public_video_enabled=true, player first-party con Range HTTP e sottotitoli VTT; altrimenti link ai social. L'opzione è disattivata finché non sono verificati banda, quota, sicurezza e playback. Screenshot incorporati da estendere.
3. /editorial-admin.php (Basic Auth, CSRF): calendario, titolo/sottotitolo, HTML sanitizzato, orario, trailer prossimo episodio, testi social, anteprima, approvazione. Solo bozze modificabili; almeno video caricato prima di approvare.
4. Runner legge GET /editorial-api.php?id=... (dati+manifest asset). Dopo approvazione carica il video privato e programma YouTube e Facebook, leggendo indietro ID e orario effettivo. Programmazione coordinata, non transazione distribuita: se un provider fallisce, conservare ricevuta parziale, non ripetere upload cieco, riconciliare o annullare la programmazione prima della scadenza.
5. POST action=record_schedule, id, revision, youtube_id, facebook_id, facebook_url, youtube_publish_at, facebook_publish_at. Le ricevute sono attestazioni del runner autorizzato (non verificate direttamente da PHP). Entrambi gli orari devono coincidere, l'articolo non è pubblico finché non è scheduled e la data raggiunta. Ripetere una ricevuta identica è idempotente.
6. Apache instrada hub, nuovi slug e sitemap a PHP. Le guide statiche preesistenti restano raggiungibili. Academy mostra entrambi i filoni, Guide solo informative; sitemap include soltanto episodi pubblicati. Nessun iframe o SDK social.

## Gate prima dell'uso reale
- Eseguire php tests/editorial-smoke.php (test isolato); lint PHP e test browser/router sullo staging con le estensioni richieste.
- Testare autenticazione negativa, CSRF, revisioni, upload rifiutati e validi, HTML ostile, assenza di bozze/futuri da URL/sitemap/hub, data UTC/Europe-Rome, fallback statico, backup/ripristino.
- Verificare on-site accesso OAuth YouTube/Meta con account test autorizzati, permessi, orari e read-back; nessun invio a produzione durante test. Testare errore parziale, annullo/riprogrammazione e recupero. Il modello attuale blocca modifica dopo approvazione/programmazione; UI di annullo/riprogrammazione coordinata ancora da implementare prima dell'uso ordinario.
- Verificare che il link di anteprima social non riveli contenuti prima della data, cache/CDN e redirect. Valutare pagina teaser distinta dalla bozza.
- Video/thumbnail/subtitle, chiusura narrata con prossimo titolo e data, QA e tracciabilità da runner. Se cambia calendario dopo il render, aggiornare finale e file, non mentire nel video.
- Non attivare il backoffice in produzione senza test, credenziali separate, hardening del server e controllo amministrativo. Il codice non esegue pubblicazioni da solo: la programmazione è delegata al runner.

## Avvio automatico senza cron
Configurare cURL e github_dispatch_token nel file privato di Plesk, limitato a Actions write sulla repo privata welora-social. L'approvazione invoca workflow_dispatch del workflow publish-approved.yml, su main; se la chiamata non è accettata, rimane approved e il backoffice permette di riprovare. Un dispatch accettato non è prova di programmazione: il runner dedicato self-hosted, label welora-social, scarica gli artefatti con token e checksum, programma i social e registra le ricevute. Non impostare il token fino a quando ambiente e gate sono verificati. L'azione è per episodio, non periodica. Non aggiungere segreti al repo pubblico.
