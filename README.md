# 📚 Books Booking System (ReactJS)

A web built with **ReactJS** that allows users to browse books, check availability, and reserve books online. Designed for libraries, schools, and small organizations needing a lightweight and easy-to-use booking platform.

---

## 🚀 Features

### User Features
- Browse and view all available books  
- Check real-time availability  
- Search and filter books  
- Reserve (book) a book  
- View and manage reservations  

### Admin Features (Optional)
- Add, edit, delete books  
- Manage user reservations  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | ReactJS |
| UI | TailwindCSS / Material UI |
| Routing | React Router |
| API | REST API backend (Node.js / Express) |
| Deployment | Netlify |

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/lk153/vc-book-fe.git
cd vc-book-fe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a .env file in your project root:
```bash
REACT_APP_API_URL=https://vc-book-api.onrender.com/api/v1
```

For local development with backend running on localhost:
```bash
REACT_APP_API_URL=http://localhost:3000/api/v1
```

### 4. Start the Development Server
```bash
npm start
```

## Build for Production
```bash
npm run build
```