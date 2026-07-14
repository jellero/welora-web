# Welora marketing site

Sito commerciale statico per `welora.it`, progettato come vetrina del prodotto finale.

## Anteprima locale

```bash
python3 -m http.server 8080
```

Aprire `http://localhost:8080`.

## GitHub Pages

La repository è predisposta per essere pubblicata dalla root del branch `main`. In **Settings → Pages**, selezionare **Deploy from a branch**, branch `main`, cartella `/ (root)`.

## Struttura

- `index.html`: landing completa, pricing, ROI calculator, FAQ e modulo demo;
- `styles.css` e `blue-theme.css`: design system responsive e identità visiva blu;
- `app.js`: navigazione mobile, vertical switcher, toggle prezzi, calcolatore ROI, validazione form e animazioni;
- `assets/`: mockup SVG derivati dai flussi dell'app Welora e ampliati al prodotto finale;
- `privacy.html`: bozza da completare con dati legali verificati;
- `MARKET_AND_PRICING.md`: analisi competitiva e logica dei piani.

## Prima della pubblicazione

1. Collegare il modulo demo a un endpoint CRM/lead reale e rimuovere il messaggio di fallback in `app.js`.
2. Sostituire email, dati societari e informativa privacy con dati ufficiali.
3. Configurare analytics e cookie consent management secondo la policy scelta.
4. Comprimere/minificare CSS, JavaScript e SVG nella pipeline di deploy.
5. Inserire dominio canonico, immagini Open Graph, favicon e Search Console.
6. Verificare prezzi, limiti, costi provider e condizioni commerciali definitive.
7. Verificare autorizzazioni all'uso dei marchi di integrazione; il sito attuale li presenta solo come testo.

## Note di prodotto

Il sito comunica la visione definitiva di Welora. I mockup rappresentano l'esperienza finale e non sono screenshot di dati reali. Le interfacce Planning, Agenda e Task riprendono strutture già presenti nell'app; Digital Receptionist, portale cliente, automazioni, dispositivi e controllo economico sono visualizzati nel loro assetto target.
