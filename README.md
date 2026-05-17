# MedLog – Digitální lékovka

Webová aplikace pro evidenci léků a záznamů o jejich užití.

---

## Struktura projektu

```
medlog/
├── server/                     # Node.js + Express backend (HW #3)
│   ├── app.js                  # vstupní bod serveru
│   ├── package.json
│   ├── controller/             # routing – mapuje URL → ABL
│   │   ├── medication.js
│   │   └── usageRecord.js
│   ├── abl/                    # business logika (validace, pravidla)
│   │   ├── medication/
│   │   │   ├── createAbl.js
│   │   │   ├── getAbl.js
│   │   │   ├── listAbl.js
│   │   │   ├── updateAbl.js
│   │   │   └── deleteAbl.js
│   │   └── usageRecord/
│   │       └── ... (create/get/list/update/delete)
│   └── dao/                    # perzistence (JSON soubory)
│       ├── medication-dao.js
│       ├── usageRecord-dao.js
│       └── storage/
│           ├── medicationList/   # jeden JSON = jeden lék
│           └── usageRecordList/  # jeden JSON = jeden záznam užití
│
└── client/                     # React frontend – Next.js 14 + Tailwind (HW #4)
    ├── app/                    # App Router stránky a layout
    │   ├── layout.jsx          # globální layout + navbar
    │   ├── page.jsx            # /   (přehled)
    │   ├── not-found.jsx       # 404
    │   ├── globals.css         # Tailwind direktivy
    │   ├── leky/
    │   │   ├── page.jsx                  # /leky
    │   │   ├── novy/page.jsx             # /leky/novy
    │   │   └── [id]/
    │   │       ├── page.jsx              # /leky/[id]
    │   │       └── upravit/page.jsx      # /leky/[id]/upravit
    │   └── zaznamy/
    │       ├── page.jsx                  # /zaznamy
    │       ├── novy/page.jsx             # /zaznamy/novy
    │       └── [id]/
    │           ├── page.jsx              # /zaznamy/[id]
    │           └── upravit/page.jsx      # /zaznamy/[id]/upravit
    ├── components/             # Sdílené UI komponenty
    │   ├── Navbar.jsx
    │   ├── Button.jsx
    │   ├── Card.jsx
    │   ├── Field.jsx           # TextField, TextareaField, SelectField, DateTimeField
    │   ├── Feedback.jsx        # Loading, ErrorBox, EmptyState
    │   ├── ConfirmDialog.jsx
    │   ├── DeleteButton.jsx
    │   ├── MedicationForm.jsx
    │   └── UsageRecordForm.jsx
    ├── lib/
    │   ├── api.js              # REST klient (medicationApi, usageRecordApi)
    │   └── format.js           # formátování + překlad chybových kódů
    └── ...                     # next.config.js, tailwind.config.js, atd.
```

---

## Spuštění

**Požadavky:** Node.js 18+. Backend a frontend se spouští odděleně.

### 1. Backend (port 8888)

```bash
cd server
npm install
npm start
```

Server `http://localhost:8888`. Ověření:

```bash
curl http://localhost:8888/
# -> "MedLog backend is running."
```

### 2. Frontend (port 3000)

```bash
cd client
npm install
npm run dev
```

Frontend pak otevřete v prohlížeči na `http://localhost:3000`.

Frontend volá backend přes Next.js rewrites — z prohlížeče se chodí na
`/api/*`, Next.js to přesměruje na `http://localhost:8888/*`. URL backendu
lze přepsat v `client/.env.local` proměnnou `NEXT_PUBLIC_BACKEND_URL`
(viz `client/.env.local.example`).

---

## API

| Entita        | Endpoint                  | Metoda | Účel                                 |
| ------------- | ------------------------- | ------ | ------------------------------------ |
| Medication    | `/medication/create`      | POST   | Založit lék                          |
| Medication    | `/medication/get`         | GET    | Detail léku                          |
| Medication    | `/medication/list`        | GET    | Seznam všech léků                    |
| Medication    | `/medication/update`      | POST   | Úprava léku                          |
| Medication    | `/medication/delete`      | POST   | Smazání léku (+ kaskáda záznamů)     |
| UsageRecord   | `/usageRecord/create`     | POST   | Nový záznam užití                    |
| UsageRecord   | `/usageRecord/get`        | GET    | Detail záznamu                       |
| UsageRecord   | `/usageRecord/list`       | GET    | Seznam záznamů (filtr volitelný)     |
| UsageRecord   | `/usageRecord/update`     | POST   | Úprava záznamu                       |
| UsageRecord   | `/usageRecord/delete`     | POST   | Smazání záznamu                      |

### Ukázkové volání

**Vytvoření léku:**

```bash
curl -X POST http://localhost:8888/medication/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Ibalgin","dosage":"400 mg","instructions":"Při bolesti."}'
```

**Záznam užití – aktuální čas (DAO doplní):**

```bash
curl -X POST http://localhost:8888/usageRecord/create \
  -H "Content-Type: application/json" \
  -d '{"medicationId":"a1b2c3d4e5f6789012345678abcdef01"}'
```

**Záznam užití – zpětný zápis (uživatel zadává čas):**

```bash
curl -X POST http://localhost:8888/usageRecord/create \
  -H "Content-Type: application/json" \
  -d '{"medicationId":"a1b2c3d4e5f6789012345678abcdef01","timestamp":"2026-04-20T08:30:00.000Z","notes":"Vzal s jídlem."}'
```

**Kaskádové smazání léku (smaže i všechny související záznamy užití):**

```bash
curl -X POST http://localhost:8888/medication/delete \
  -H "Content-Type: application/json" \
  -d '{"id":"a1b2c3d4e5f6789012345678abcdef01"}'
# -> {"removedUsageRecordsCount":3}
```

---

## Frontend – mapa route

| Route                        | Popis                                                        |
| ---------------------------- | ------------------------------------------------------------ |
| `/`                          | Domovská stránka — přehled                                   |
| `/leky`                      | Seznam léků                                                  |
| `/leky/novy`                 | Nový lék                                                     |
| `/leky/[id]`                 | Detail léku + historie užití                                 |
| `/leky/[id]/upravit`         | Úprava léku                                                  |
| `/zaznamy`                   | Seznam záznamů užití                                         |
| `/zaznamy/novy`              | Nový záznam (lze přijít s `?medicationId=…`)                 |
| `/zaznamy/[id]`              | Detail záznamu                                               |
| `/zaznamy/[id]/upravit`      | Úprava záznamu                                               |
| `*`                          | 404                                                          |