# Welora marketing site

Sito commerciale statico per `welora.it`.

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

```bash
python3 -m http.server 8080
```

Aprire `http://localhost:8080`.

## GitHub Pages

La repository è predisposta per essere pubblicata dalla root del branch `main`. In **Settings → Pages**, selezionare **Deploy from a branch**, branch `main`, cartella `/ (root)`.

## Struttura

- `index.html`: landing di pre-lancio, funzionalità, pricing Founding, ROI, FAQ e form;
- `styles.css` e `blue-theme.css`: design system responsive;
- `app.js`: navigazione mobile, selettore per tipo di struttura, calcolatore ROI, validazione form e fallback email;
- `assets/`: mockup SVG;
- `privacy.html`: bozza da completare con dati legali verificati;
- `MARKET_AND_PRICING.md`: decisioni di posizionamento, pricing, guardrail e piano di lancio.

## Note sui claim

### Check-in

Il sito non usa “check-in automatico certificato” come promessa assoluta.

Presenta invece un flusso digitale che può raccogliere dati e documenti, integrare la verifica identità, preparare gli adempimenti e tracciare il processo. Gli obblighi di identificazione applicabili restano da rispettare e il provider può prevedere un costo per check-in.

### POS da smartphone

Tap to Pay viene presentato soltanto per smartphone e provider compatibili e con i relativi costi/commissioni esterni.

### Fiscalità senza cassa fisica

Il sito comunica la gestione di documenti commerciali, corrispettivi e fatturazione elettronica e precisa che l'assenza di un registratore telematico fisico dipende dalla soluzione fiscale adottata e dalla normativa applicabile.

## Prima della pubblicazione

1. Collegare il form Founding a un endpoint CRM/lead reale. Il fallback corrente apre una email precompilata a `commerciale@welora.it`.
2. Sostituire o verificare email, dati societari, privacy e condizioni commerciali.
3. Configurare analytics e cookie consent management secondo la policy scelta.
4. Verificare prezzi, limiti, costi provider e condizioni Founding definitive.
5. Verificare con test reali i provider di pagamento, identità, fiscalità e compliance che saranno dichiarati disponibili al lancio.
6. Confermare il 15 febbraio 2027 solo dopo il superamento delle stop condition del pilot.
7. Inserire dominio canonico, immagini Open Graph, favicon e Search Console.
8. Verificare autorizzazioni all'uso dei marchi di integrazione prima di citarli come brand.

## Stato dei mockup

I mockup rappresentano l'esperienza di prodotto e possono includere flussi target. La landing deve evitare di confondere una funzione pianificata o dipendente da provider esterni con una funzione già attivabile in produzione.
