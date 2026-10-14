# Welora marketing site

Sito commerciale per `welora.it`, con front-end statico e endpoint PHP per il form di contatto.

La landing è impostata per il **pre-lancio hospitality** e presenta Welora come gestionale completo e accessibile per piccole strutture ricettive. La comunicazione distingue la base Welora, i costi dei provider esterni e il futuro servizio Digital Receptionist.

## Posizionamento corrente

Target prioritario:

- B&B e affittacamere;
- piccoli hotel e residence;
- appartamenti e affitti brevi;
- strutture con servizi o vendite aggiuntive;
- piccoli gruppi multi-sede.

Messaggio principale:

> Tutto ciò che serve a una piccola struttura. In un solo gestionale.

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

Aprire `http://127.0.0.1:8080`. Il server locale deve avere `mail()` configurato per verificare l'invio reale.

Per una sola anteprima grafica resta possibile usare un server statico, ma `contact.php` non funzionerà.

## Hosting

La landing può essere servita come HTML statico, ma il form Founding richiede un hosting con **PHP 8.1+** e funzione `mail()` configurata, oppure una successiva integrazione SMTP. GitHub Pages non esegue PHP e quindi non è adatto come hosting finale se si vuole usare `contact.php`.

Variabili ambiente opzionali:

- `CONTACT_TO`: destinatario del form; fallback `suppor@welora.it`;
- `CONTACT_FROM`: mittente tecnico; fallback `no-reply@welora.it`.

## Struttura

- `index.html`: landing di pre-lancio, funzionalità, pricing Founding, ROI, FAQ e form;
- `styles.css` e `blue-theme.css`: design system responsive;
- `app.js`: navigazione mobile, selettore per tipo di struttura, calcolatore ROI e invio AJAX del form;
- `contact.php`: endpoint server-side con validazione, honeypot e rate limit minimo;
- `consent.js` e `consent.css`: cookie banner, preferenze e Google Consent Mode v2;
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

1. Verificare sul server reale che `contact.php` invii correttamente le email e configurare SPF/DKIM/DMARC del dominio; per affidabilità maggiore valutare SMTP transazionale.
2. Verificare che `suppor@welora.it` sia l'indirizzo definitivo per contatti e privacy.
3. Verificare con il consulente privacy la versione pubblicata di Privacy Policy e Cookie Policy, in particolare i periodi di conservazione e i fornitori effettivamente usati.
4. Configurare la proprietà GA4 in coerenza con l'informativa e verificare Consent Mode con Tag Assistant.
5. Verificare prezzi, limiti, costi provider e condizioni Founding definitive.
6. Verificare con test reali i provider di pagamento, identità, fiscalità e compliance che saranno dichiarati disponibili al lancio.
7. Confermare il 15 febbraio 2027 solo dopo il superamento delle stop condition del pilot.
8. Inserire dominio canonico, immagini Open Graph, favicon e Search Console.
9. Verificare autorizzazioni all'uso dei marchi di integrazione prima di citarli come brand.

## Stato dei mockup

I mockup rappresentano l'esperienza di prodotto e possono includere flussi target. La landing deve evitare di confondere una funzione pianificata o dipendente da provider esterni con una funzione già attivabile in produzione.
