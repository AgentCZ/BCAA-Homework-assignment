# MedLog – Digitální lékovka

Webová aplikace pro evidenci léků a záznamů o jejich požití. Aplikace je přístupná bez registrace.


---

## Struktura projektu

```
medlog/
├── server/                 # Node.js + Express backend (HW #3)
│   ├── app.js              # vstupní bod serveru
│   ├── package.json
│   ├── controller/         # routing – mapuje URL → ABL
│   │   ├── medication.js
│   │   └── usageRecord.js
│   ├── abl/                # business logika (validace, pravidla)
│   │   ├── medication/
│   │   │   ├── createAbl.js
│   │   │   ├── getAbl.js
│   │   │   ├── listAbl.js
│   │   │   ├── updateAbl.js
│   │   │   └── deleteAbl.js
│   │   └── usageRecord/
│   │       └── ... (create/get/list/update/delete)
│   └── dao/                # perzistence (JSON soubory)
│       ├── medication-dao.js
│       ├── usageRecord-dao.js
│       └── storage/
│           ├── medicationList/   # jeden JSON = jeden lék
│           └── usageRecordList/  # jeden JSON = jeden záznam užití
└── client/                 # React frontend (HW #4 – připravováno)
```

---

## Spuštění backendu

**Požadavky:** Node.js 18+

```bash
cd server
npm install
npm start
```

Server naslouchá na `http://localhost:8888`.

### Ověření, že server běží

```bash
curl http://localhost:8888/
# -> "MedLog backend is running."
```

---

## API – rychlá reference

| Entita        | Endpoint                  | Metoda | Účel                                 |
| ------------- | ------------------------- | ------ | ------------------------------------ |
| Medication    | `/medication/create`      | POST   | Založit lék                          |
| Medication    | `/medication/get`         | GET    | Detail léku                          |
| Medication    | `/medication/list`        | GET    | Seznam všech léků                    |
| Medication    | `/medication/update`      | POST   | Úprava léku                          |
| Medication    | `/medication/delete`      | POST   | Smazání léku (+ kaskáda záznamů)    |
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

**Záznam požití – aktuální čas (DAO doplní):**

```bash
curl -X POST http://localhost:8888/usageRecord/create \
  -H "Content-Type: application/json" \
  -d '{"medicationId":"a1b2c3d4e5f6789012345678abcdef01"}'
```

**Záznam požití – zpětný zápis (uživatel zadává čas):**

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

