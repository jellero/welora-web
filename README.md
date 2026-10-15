# Welora marketing site

Sito commerciale per `welora.it`, con front-end statico e endpoint PHP per il form di contatto.

La landing è impostata per il **pre-lancio hospitality** e presenta Welora come gestionale completo e accessibile dalla singola struttura al multi-sede. La comunicazione distingue la base Welora, i costi dei provider esterni e il futuro servizio Digital Receptionist.

## Posizionamento corrente

Target prioritario:

- B&B e affittacamere;
- hotel e residence;
- appartamenti e affitti brevi;
- strutture con servizi o vendite aggiuntive;
- gruppi multi-sede.

Messaggio principale:

> Tutto ciò che serve alla tua struttura. In un solo gestionale.

Welora Base parte da €29/mese + IVA e include le funzioni core; il prezzo può scalare con capacità e volumi senza usare piani superiori per sbloccare moduli essenziali.

Digital Receptionist è presentato come **servizio futuro separato**.

## Pre-lancio

Data obiettivo comunicata: **15 febbraio 2027**.

Programma Founding proposto:

- primi 50 aderenti;
- adesione entro il 31 gennaio 2027;
- 50% di sconto sul canone Base per i primi 12 mesi dal go-live;
- prezzo di listino bloccato per i successivi 12 mesi;
- nessun pagamento prima dell'attivazione;
- condizioni definitive confermate prima della sottoscrizione.

La data resta subordinata al superamento dei collaudi critici del prodotto e dei provider necessari.

## Anteprima locale

Per provare anche il form PHP:

```bash
php -S 127.0.0.1:8080
```

Aprire `http://127.0.0.1:8080`. Per verificare l'invio reale serve un SMTP configurato (vedi sotto) oppure `mail()` attivo sul server locale.

Per una sola anteprima grafica resta possibile usare un server statico, ma `contact.php` non funzionerà.

## Hosting

La landing può essere servita come HTML statico, ma i form richiedono un hosting con **PHP 8.1+**. GitHub Pages non esegue PHP e quindi non è adatto come hosting finale.

### Invio email (SMTP)

Le email del sito (notifica interna e conferma al cliente) partono via **SMTP autenticato** con PHPMailer (`lib/PHPMailer`, v6.12.0, senza Composer) tramite `lib/welora-mailer.php`. Così il mittente di busta è la casella autenticata e SPF, DKIM e DMARC risultano allineati su `welora.it`.

Con `mail()` di PHP, su Aruba il mittente di busta risultava un indirizzo Gmail invece di welora.it: SPF softfail e punteggio mail-tester 5.9/10 (ottobre 2026).

Sul server **basta la password** della casella `lancio@welora.it`: server, porta, cifratura e utente sono già nel codice (`out.postassl.it`, 465, SSL, `lancio@welora.it`), verificati dal server di produzione. Per la posta Aruba Business `smtps.aruba.it` non va: rifiuta il login con 535.

La password si legge, in ordine di priorità, da:

1. variabile d'ambiente `SMTP_PASS` (con `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_FALLBACK_MAIL` facoltative);
2. file `/var/www/vhosts/welora.it/welora-mail-config.php`, nella cartella che contiene `httpdocs` (consigliato, fuori dal web);
3. file `httpdocs/private/mail-config.php` (escluso da git e bloccato da `private/.htaccess`).

Il modello è `private/mail-config.example.php`. La password non va mai committata.

Nota: sul server Plesk è impostato `mail.force_extra_parameters = -fj.ellero@gmail.com`, che forza quella Gmail come mittente di busta su ogni `mail()`. Non è modificabile dal sito: per questo l'invio passa da SMTP.

Se SMTP non è configurato si usa `mail()` come prima. Se SMTP è configurato ma fallisce, l'errore finisce nel log PHP (`[Welora mail]`) e, salvo `fallback_mail => false`, si riprova con `mail()` per non perdere il lead.

Variabili ambiente opzionali per i destinatari:

- `CONTACT_TO`: destinatario delle richieste commerciali; fallback `lancio@welora.it`;
- `CONTACT_SUPPORT_TO`: destinatario di supporto, privacy e sicurezza; fallback `support@welora.it`;
- `CONTACT_FROM`: mittente delle email del sito; fallback `lancio@welora.it`. Deve coincidere con `SMTP_USER`.

Il form invia una notifica interna e, dopo l'acquisizione valida del lead, una conferma HTML responsive con fallback `text/plain`. La conferma usa la casella del team come `Reply-To`. Il fallimento della sola conferma non invalida la ricezione del lead interno.

## Struttura

- `index.html`: landing di pre-lancio, funzionalità, pricing Founding, ROI, FAQ e form;
- `styles.css` e `blue-theme.css`: design system responsive;
- `app.js`: navigazione mobile, selettore per tipo di struttura, calcolatore ROI e invio AJAX del form;
- `contact.php`: adattatore del form Founding della home, delega a `contact-general.php`;
- `contact-general.php`: endpoint server-side con validazione, honeypot, rate limit minimo, notifica lead e autorisposta;
- `lib/welora-mailer.php` e `lib/PHPMailer/`: invio email via SMTP autenticato con ripiego su `mail()`;
- `private/mail-config.example.php`: modello di configurazione SMTP;
- `consent.js` e `consent.css`: cookie banner, preferenze e Google Consent Mode v2;
- `favicon.svg`: favicon Welora;
- `assets/`: mockup SVG;
- `privacy.html`: informativa privacy;
- `cookies.html`: cookie policy e gestione preferenze;
- `MARKET_AND_PRICING.md`: decisioni di posizionamento, pricing, guardrail e piano di lancio.

## Note sui claim

### Check-in

Il sito non usa “check-in automatico certificato” come promessa assoluta.

Presenta invece un flusso digitale che può raccogliere dati e documenti, integrare la verifica identità, preparare gli adempimenti e tracciare il processo. Gli obblighi di identificazione applicabili restano da rispettare e il provider può prevedere un costo per check-in.

### POS da smartphone

Tap to Pay viene presentato soltanto per smartphone e provider compatibili e con i relativi costi/commissioni esterni.

### Fiscalità senza cassa fisica

Il sito comunica la gestione di documenti commerciali, corrispettivi e fatturazione elettronica e precisa che l'assenza di un registratore telematico fisico dipende dalla soluzione fiscale adottata e dalla normativa applicabile.

## Privacy, cookie e analytics

- Google Analytics 4 usa l'ID `G-PD8W376DFH`.
- Il tag viene caricato solo dopo consenso analytics.
- Consent Mode v2 parte con `analytics_storage`, `ad_storage`, `ad_user_data` e `ad_personalization` negati.
- Le funzioni pubblicitarie restano disabilitate.
- La scelta è salvata in local storage per 6 mesi ed è modificabile dal footer.
- I cookie analytics vengono configurati lato sito con scadenza massima di circa 13 mesi.

Verificare anche nella proprietà GA4 che le impostazioni di conservazione dei dati siano coerenti con l'informativa pubblicata.

## Prima della pubblicazione

1. Configurare SMTP sul server (vedi "Invio email"), poi verificare con mail-tester che il mittente di busta sia `lancio@welora.it` e che SPF, DKIM e DMARC passino; dopo qualche settimana di invii puliti valutare DMARC `p=quarantine`.
2. Verificare che `support@welora.it` resti l'indirizzo definitivo per supporto/privacy e `lancio@welora.it` quello per il flusso commerciale Founding.
3. Verificare con il consulente privacy la versione pubblicata di Privacy Policy e Cookie Policy, in particolare i periodi di conservazione e i fornitori effettivamente usati.
4. Configurare la proprietà GA4 in coerenza con l'informativa e verificare Consent Mode con Tag Assistant.
5. Verificare prezzi, limiti, costi provider e condizioni Founding definitive.
6. Verificare con test reali i provider di pagamento, identità, fiscalità e compliance che saranno dichiarati disponibili al lancio.
7. Confermare il 15 febbraio 2027 solo dopo il superamento delle stop condition del pilot.
8. Inserire dominio canonico, immagini Open Graph e Search Console.
9. Verificare autorizzazioni all'uso dei marchi di integrazione prima di citarli come brand.

## Stato dei mockup

I mockup rappresentano l'esperienza di prodotto e possono includere flussi target. La landing deve evitare di confondere una funzione pianificata o dipendente da provider esterni con una funzione già attivabile in produzione.
