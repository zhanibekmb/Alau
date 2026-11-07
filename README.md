# Alau

Чтение коротких историй на английском по уровням A1–B2 с мгновенным переводом слова на казахский.

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:3000.

## Команды

- `npm test`: проверки логики (перевод каждого слова, лицензии, страницы, прогресс).
- `npm run build`: сборка. Она падает, если у слова в тексте нет перевода.
- `npm run lint`: проверка стиля кода.
- `npm run test:db`: проверки с базой. Нужен `DATABASE_URL_TEST` в `.env`, база должна называться `…_test`, её таблицы очищаются.
- `npm run db:generate`: после правки `src/db/schema.ts` создаёт новую миграцию в `drizzle/`.
- `npm run db:migrate`: применяет миграции к базе из `DATABASE_URL`.

## База данных

PostgreSQL на своём компьютере. Скопируйте `.env.example` в `.env` и впишите пароль пользователя `alau`. Таблицы описаны в `src/db/schema.ts` (аккаунты better-auth в `src/db/auth-schema.ts`), план работы с ними в `docs/paywall-plan.md`.

## Где что лежит

- `src/content/books.ts`: истории и их лицензии.
- `src/content/lexicon.ts`: словарь «слово → казахский перевод».
- `src/lib/publish.ts`: разбор текста на слова и страницы.
- `src/lib/serve.ts`: отдача главы, проверка лицензии.
- `src/lib/state.ts`, `src/lib/store.ts`: прогресс и словарь читателя в браузере.
- `src/components/reader/`: читалка.
- `src/app/`: страницы сайта.

## Как добавить историю

1. Добавьте книгу в `src/content/books.ts`.
2. Разметка `{looked for|look for}` задаёт устойчивое выражение: нажатие на любое его слово покажет перевод всего выражения.
3. Запустите `npm test`. Он назовёт слова без перевода, их нужно добавить в `src/content/lexicon.ts`.
4. Картинку обложки положите в `public/covers/` и укажите её в `cover.image`. Казахский оригинал главы можно добавить в `original`: в читалке появится кнопка «Қазақша нұсқа».

Настоящие книги, у каждой четыре уровня:
- «The Secret of Lake Bakaly» (Ites Shynbatyr): `src/content/bakaly.ts`, словарь в `src/content/lexicon-bakaly.ts`.
- «The Institute of Advanced Research and Experimental Artificial Consciousness»: `src/content/institute.ts`, словарь в `src/content/lexicon-institute.ts`, обложка в `public/covers/institute-of-artificial-consciousness.svg`. Версия C1 опубликована как B2, потому что уровня C1 на сайте пока нет.

## Что пока не сделано

Аккаунты и база данных, панель `/admin`, ИИ-конвейер, лендинг, аналитика, развёртывание и E2E-тесты. План описан в дизайн-документе.

Сейчас тексты демонстрационные, а казахские переводы и транскрипции черновые: перед показом читателям их должен проверить носитель языка.
