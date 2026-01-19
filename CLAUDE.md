# CLAUDE.md - VC Book Frontend

## Project Overview

This is a **React-based e-commerce frontend** for an online book store. Users can browse books, manage shopping carts, place orders, and manage their accounts.

## Quick Commands

```bash
npm start        # Start development server (port 3000)
npm run build    # Production build to /build
npm test         # Run Jest tests
```

## Tech Stack

- **React 19** with React Router DOM 7
- **TailwindCSS 3** for styling
- **JavaScript (JSX)** - no TypeScript
- **Create React App** build tooling
- **Netlify** for deployment

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── BookCard.jsx
│   ├── CartItem.jsx
│   ├── CategoryFilter.jsx
│   ├── Navigation.jsx
│   └── LanguageSwitcher.jsx
├── pages/           # Route page components
│   ├── Home.jsx
│   ├── BookDetail.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── Orders.jsx
│   ├── Checkout.jsx
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   └── checkout/
│       ├── Cart.jsx
│       ├── ShippingAddress.jsx
│       └── OrderSuccess.jsx
├── services/        # API communication
│   ├── api.js       # Books, cart, orders APIs
│   └── authAPI.js   # Auth endpoints + token management
├── i18n/            # Internationalization
│   ├── LanguageContext.jsx
│   └── translation.jsx  # EN/VI translations
├── utils/
│   └── price.jsx    # Price formatting utility
├── App.js           # Root component with routing
└── index.js         # Entry point
```

## Key Patterns

### State Management
- **Local state**: React `useState` hooks
- **Language context**: `LanguageContext` for i18n
- **Persistence**: localStorage for tokens, user data, guest cart, language preference

### Cart System (Dual Mode)
- **Guest cart**: localStorage-based via `guestCartManager`
- **Authenticated cart**: Server-synced via API
- Automatic migration from guest to authenticated on login

### API Architecture
Base URL from `REACT_APP_API_URL` env variable.

| Endpoint Group | Base Path |
|---------------|-----------|
| Books | `/api/v1/books` |
| Cart | `/api/v1/cart` |
| Orders | `/api/v1/orders` |
| Auth | `/api/v1/auth` |

### Authentication
- JWT tokens stored in localStorage
- Auto-logout on 401 errors via `handle401Error` callback
- Token/user managers in `authAPI.js`

## Environment Setup

Copy `.env.example` to `.env` and set:
```
REACT_APP_API_URL=http://localhost:3000/api/v1
```

## Code Conventions

- Components use PascalCase - `src/components` directory  (e.g., `BookCard.jsx`)
- Services use camelCase - `src/services` directory (e.g., `api.js`)
- Props drilling from App → pages → components
- TailwindCSS utility classes for all styling
- Toast notifications via react-toastify

## Features

- Multi-language support (English, Vietnamese)
- View Book listing on Homepage, Book details
- Guest checkout capability
- User authentication (login, register, password reset)
- Shopping cart with persistence
- Order history
- User profile management
- Responsive design (mobile + desktop)
