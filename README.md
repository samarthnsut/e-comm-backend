## E‑Commerce Node.js App (Express + EJS + Mongoose)

### Overview
A simple e‑commerce prototype built with Express, EJS templates, and MongoDB via Mongoose. It supports basic account creation and sign‑in, product creation, and product comments, and renders pages using server-side templates.

### Tech Stack
- **Runtime**: Node.js (Express 4)
- **Templating**: EJS
- **Database**: MongoDB (via Mongoose)
- **Cookies**: cookie-parser

### Quick Start
1. Prerequisites
   - Node.js 14+ and npm
   - MongoDB running locally (default: `mongodb://localhost`)
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the server
   ```bash
   node index.js
   ```
4. Open in browser
   - Home: `http://localhost:2000/`

### Configuration
- MongoDB connection is defined in `config/moongose.js` and points to `mongodb://localhost/e_commerce_account_db`.
- Connection string is hard-coded. For production, consider moving it to an environment variable, e.g. `MONGODB_URI`.

### Project Structure
```
.
├── index.js                   # Express app: routes, middleware, server
├── package.json               # Dependencies and metadata
├── config/
│   └── moongose.js            # Mongoose connection
├── modals/                    # Mongoose schemas (models)
│   ├── account.js             # Account (user) schema
│   ├── products.js            # Product schema
│   └── comment.js             # Comment schema
├── views/                     # EJS templates
│   ├── index.ejs              # Landing page
│   ├── home.ejs               # Product list / Home
│   ├── signin.ejs             # Sign in
│   ├── signup.ejs             # Sign up
│   ├── accinfo.ejs            # Account info
│   └── maintain.ejs           # Maintenance page
└── assests/                   # Static assets (served at /assests)
    ├── *.css, *.js, *.png, *.jfif, ...
    └── index.js, script.js, jquery.js
```

Note: The folder names `modals` and `assests` are intentionally spelled that way in code; keep them consistent or refactor usages accordingly.

### Server and Middleware
- View engine: EJS (`app.set('view engine', 'ejs')`) with views in `views/`
- Body parsing: `express.urlencoded()` for form posts
- Cookies: `cookie-parser`
- Static files: `app.use(express.static('assests'))` (served under `/assests`)
- Server listens on port `2000`

### Data Models
- Account (`modals/account.js`)
  - `name` (String, required)
  - `phone` (String, required)
  - `l_name` (String)
  - `e_mail` (String, required)
  - `u_name` (String, required)
  - `password` (String, required; currently plain text)

- Product (`modals/products.js`)
  - `pname` (String, required)
  - `description` (String)
  - `account` (ObjectId -> Account)
  - `comment` (ObjectId -> Comment) — currently a single reference, not an array
  - `timestamps` enabled

- Comment (`modals/comment.js`)
  - `content` (String, required)
  - `account` (ObjectId -> Account)
  - `product` (ObjectId -> Product)
  - `timestamps` enabled

### Routes
- GET `/` → Render `views/index.ejs`
- GET `/home` → Query all products, populate `account` and `comment`; render `views/home.ejs`
- GET `/signin` → Render sign-in form (`views/signin.ejs`)
- GET `/signup` → Render sign-up form (`views/signup.ejs`)
- GET `/maintain` → Render maintenance page (`views/maintain.ejs`)
- POST `/new-account` → Create an account from form fields, then redirect to `/signin`
- POST `/create-session` → Validate credentials; on success set cookie `user_id` and redirect to `/accinfo`
- POST `/comment` → Create a comment for a given product; redirect back
- POST `/createproduct` → Create a product associated with the logged-in account; redirect to `/home`
- GET `/accinfo` → If `user_id` cookie is set, render account info page
- GET `/sign-out` → Clear `user_id` cookie; render `home`

### Views
All pages are rendered using EJS templates in `views/`. Static styling and scripts are located under `assests/`.

### Known Limitations / Issues (Important)
- Authentication & Security
  - Passwords are stored in plain text. Use hashing (e.g., bcrypt) and never log raw passwords.
  - No true session management. A raw cookie `user_id` is used without signing/expiration. Consider `express-session` or JWT with secure flags.
  - Dependencies `passport` and `passport-local` are present but unused.
- Global state
  - A global variable `yourAccount` is used to track the logged-in user and is mutated across requests; this is unsafe for concurrent users.
- Data modeling
  - `Product.comment` is a single `ObjectId`. Typically, products have an array of comments. Consider `comments: [{ type: ObjectId, ref: 'Comment' }]`.
  - In `/home`, population attempts to populate `comment.user`, but Comment schema uses `account` (not `user`).
- Request flow bugs
  - `/new-account` validates `confirm_password` after creating the account; it should validate before persist.
  - `/createproduct` has a misplaced callback and will not handle errors as expected.
  - `/sign-out` renders twice after clearing cookie due to multiple `return` paths.
- Configuration
  - Mongo connection option uses `UseNewUrlParser` (capital U) which is not the standard `useNewUrlParser` in newer Mongoose versions.
  - Connection string is hard-coded; use env vars.
- Naming/typos
  - Folders `modals` (should be `models`) and `assests` (should be `assets`) are misspelled throughout and referenced by those names.

### Suggested Improvements
- Replace cookie-only login with proper sessions (e.g., `express-session` + `passport-local`) or JWT-based auth; hash passwords with bcrypt.
- Remove global `yourAccount`; derive the user from `req.cookies.user_id` or session on each request.
- Fix Comment population in `/home` (use `account` instead of `user`).
- Update product schema to support multiple comments.
- Validate form inputs and `confirm_password` before creating an account.
- Refactor typos (`modals` → `models`, `assests` → `assets`) and update imports accordingly.
- Add environment configuration (`.env`) and use `process.env` in `config/moongose.js`.
- Add npm scripts: `start`, `dev` (nodemon), `lint`, and tests.
- Update Mongoose options (or bump Mongoose) for modern connection flags.

### Contributing
PRs to improve authentication, data modeling, and configuration are welcome.

### License
ISC (see `package.json`). 

