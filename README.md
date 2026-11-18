# BuildMaster — Modern Full Stack Construction & Real Estate Platform

![BuildMaster Banner](https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80)

**BuildMaster** is a complete, production-grade Full Stack Construction Company and Real Estate Website built with **React.js (Vite)**, **Tailwind CSS**, **Node.js (Express.js)**, **MongoDB (Mongoose)**, **JWT Authentication**, and **Cloudinary / Local File Storage**.

Designed specifically for construction builders and real estate developers, BuildMaster enables seamless public showcases of **Completed Buildings**, **Ongoing Construction Sites (with live progress tracking)**, **Upcoming Masterplans**, and **Properties for Sale (Flats, Apartments, Villas, Penthouses, Houses)**, alongside an end-to-end **Secure Admin Dashboard** and **Customer Portal**.

---

## 🌟 Key Features

### 1. Public Visitor & Home Experience
- **Hero & Live Search**: High-resolution architectural backdrop with an interactive multi-parameter property search widget (Filter by Location, Property Type, Budget).
- **Three-Tier Project Portfolios**:
  - **Completed Buildings**: Previously constructed towers with floor counts, total flats, completion dates, and available vs. sold units.
  - **Ongoing Construction**: Active construction sites featuring animated milestone completion percentages (`%`), target handover dates, and structural photos.
  - **Upcoming Projects**: Future developments in architectural sanction phase with estimated groundbreaking dates, proposed 3D renders, and pre-booking enquiry.
- **Properties for Sale**: Real-time inventory of flats, apartments, villas, and penthouses with price tags, bedrooms, bathrooms, square footage, and availability badges.
- **Company Credentials**: 18+ years track record, 120+ completed landmarks, RERA certified, customer testimonials, and why-choose-us section.

### 2. Customer Features
- **Authentication**: JWT-based customer register and login with persistent session storage.
- **Wishlist**: Add or remove favorite flats and villas to a private wishlist with real-time counter badge synchronization.
- **Direct Enquiries**: Instant enquiry submissions for any property or project.
- **Customer Activity History**: `/my-enquiries` page to track the status of site visit requests and follow-up notes from the builder.

### 3. Comprehensive Admin Dashboard (`/admin`)
- **Key Metrics Overview**: Total projects, active ongoing sites, total properties, units available, units sold, and incoming customer inquiries.
- **Project Management**:
  - Add new projects (Completed, Ongoing, Upcoming).
  - Update construction progress slider (`0%` to `100%`).
  - Toggle project stages.
  - Upload multiple building elevation images or enter direct URLs with live preview.
  - Edit or delete projects with instant reflection on the live site.
- **Property Management**:
  - Add and manage flats, villas, penthouses, and independent houses.
  - Link individual properties to their parent building project.
  - Update unit availability (`Available`, `Booked`, `Sold`).
  - Configure bedrooms, bathrooms, area (sq.ft), parking, facing, and furnishing.
- **Enquiry Management**:
  - Review all customer messages and site inspection requests.
  - Update status (`New Lead`, `Contacted`, `In Progress`, `Closed`).
  - Log internal follow-up notes.
  - One-click customer contact via email or phone.

### 4. Resilient Database Layer
- Connects directly to **MongoDB / MongoDB Atlas** using Mongoose schemas.
- Features an automatic, fail-safe local persistence layer that loads rich seed data and preserves all changes even when a local MongoDB service is not started, guaranteeing zero server crashes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM 7, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Bcrypt.js, Morgan |
| **Database** | MongoDB (with Mongoose schemas: `users`, `projects`, `properties`, `enquiries`, `wishlists`) |
| **Media Storage** | Cloudinary integration + local static storage fallback in `/uploads` |
| **Theme** | Luxury Architectural: Deep Navy (`#0B192C`), Gold (`#D4AF37`), Pure White |

---

## 🔑 Demo Login Credentials

The project comes pre-seeded with sample data. You can log in immediately:

### Admin Account
- **Email:** `admin@buildmaster.com`
- **Password:** `admin123`
- *Has full access to the Admin Dashboard (`/admin`)*

### Customer Account
- **Email:** `customer@buildmaster.com`
- **Password:** `customer123`
- *Access to Wishlist and My Enquiries history*

> 💡 **Tip:** On the `/login` page, you can click the **"Fill Admin"** or **"Fill Customer"** buttons for instant one-click login!

---

## 📁 Project Folder Structure

```
buildmaster/
├── backend/
│   ├── .env                      # Backend environment settings
│   ├── .env.example              # Environment template
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Express server & route registration
│   ├── uploads/                  # Local media uploads storage
│   ├── data/
│   │   └── store.json            # Seed and persistent fallback store
│   └── src/
│       ├── config/
│       │   ├── db.js             # Mongoose connection & status
│       │   └── cloudinary.js     # Cloudinary configuration
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── projectController.js
│       │   ├── propertyController.js
│       │   ├── enquiryController.js
│       │   ├── wishlistController.js
│       │   └── statsController.js
│       ├── middleware/
│       │   ├── auth.js           # JWT verification & isAdmin guard
│       │   ├── upload.js         # Multer & Cloudinary uploader
│       │   └── errorHandler.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Project.js
│       │   ├── Property.js
│       │   ├── Enquiry.js
│       │   ├── Wishlist.js
│       │   ├── modelProxy.js     # Dual Mongoose & fallback proxy
│       │   └── fallbackStore.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── projectRoutes.js
│       │   ├── propertyRoutes.js
│       │   ├── enquiryRoutes.js
│       │   ├── wishlistRoutes.js
│       │   ├── uploadRoutes.js
│       │   └── statsRoutes.js
│       └── seed/
│           └── seedData.js       # Rich initial construction & real estate data
│
├── frontend/
│   ├── .env                      # Frontend environment settings
│   ├── .env.example
│   ├── index.html                # App entrypoint with Playfair & Jakarta fonts
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite config with backend API proxy
│   ├── tailwind.config.js        # Theme colors: navy, gold, white
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx               # Routes definition & context providers
│       ├── index.css             # Tailwind base & custom utility styles
│       ├── context/
│       │   ├── AuthContext.jsx   # Authentication context
│       │   └── WishlistContext.jsx # Wishlist state & sync
│       ├── services/
│       │   └── api.js            # Axios client with JWT auto-headers
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── ProjectCard.jsx
│       │   │   ├── PropertyCard.jsx
│       │   │   ├── ProgressBar.jsx
│       │   │   ├── SectionHeading.jsx
│       │   │   └── EnquiryModal.jsx
│       │   └── admin/
│       │       ├── AdminLayout.jsx
│       │       ├── AdminSidebar.jsx
│       │       ├── StatCard.jsx
│       │       └── ImageUploader.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── CompletedProjects.jsx
│           ├── OngoingProjects.jsx
│           ├── UpcomingProjects.jsx
│           ├── ProjectDetails.jsx
│           ├── Properties.jsx
│           ├── PropertyDetails.jsx
│           ├── AboutUs.jsx
│           ├── ContactUs.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── WishlistPage.jsx
│           ├── MyEnquiries.jsx
│           └── admin/
│               ├── Dashboard.jsx
│               ├── ManageProjects.jsx
│               ├── ProjectForm.jsx
│               ├── ManageProperties.jsx
│               ├── PropertyForm.jsx
│               └── ManageEnquiries.jsx
│
└── package.json                  # Root orchestration scripts
```

---

## 🚀 Installation & Running Guide

### Step 1: Install Dependencies
Open a terminal in the root directory:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Seed the Database
Populate high quality architectural projects, properties, users, and customer enquiries:
```bash
cd backend
npm run seed
```

### Step 3: Run the Application

#### Option A: Run Backend Server
In the `backend` folder:
```bash
npm start
# Server runs on http://localhost:5000
```

#### Option B: Run Frontend Development Server
In a new terminal in the `frontend` folder:
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

Open your browser at **http://localhost:3000** to view the live website!

---

## ⚙️ Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Atlas or local)
MONGODB_URI=mongodb://127.0.0.1:27017/buildmaster

# JWT Authentication Secret
JWT_SECRET=buildmaster_super_secure_jwt_secret_key_2026

# Cloudinary Storage (Optional: if omitted, uploads will be stored locally in /uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`frontend/.env`):
```env
# Proxy / API Base URL
VITE_API_BASE_URL=/api
```

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new customer account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve authenticated user profile (Private)
- `PUT /api/auth/profile` — Update customer name, phone, or avatar (Private)

### 🏗️ Projects (`/api/projects`)
- `GET /api/projects` — List projects (Query: `status`, `category`, `search`, `page`, `limit`)
- `GET /api/projects/status-summary` — Status counts (`completed`, `ongoing`, `upcoming`)
- `GET /api/projects/:idOrSlug` — Single project specifications and floor plans
- `POST /api/projects` — Create building project (Admin only)
- `PUT /api/projects/:id` — Update project or progress percentage (Admin only)
- `DELETE /api/projects/:id` — Delete project (Admin only)

### 🏡 Properties (`/api/properties`)
- `GET /api/properties` — List properties (Query: `type`, `status`, `location`, `bedrooms`, `minPrice`, `maxPrice`, `search`, `sort`)
- `GET /api/properties/:idOrSlug` — Single property details
- `POST /api/properties` — Create property listing (Admin only)
- `PUT /api/properties/:id` — Update property (Admin only)
- `PATCH /api/properties/:id/status` — Quick toggle status (`Available`, `Booked`, `Sold`) (Admin only)
- `DELETE /api/properties/:id` — Delete property (Admin only)

### 📩 Enquiries (`/api/enquiries`)
- `POST /api/enquiries` — Submit enquiry for property, project, or general query (Public / Authenticated)
- `GET /api/enquiries/my` — Customer inquiry history (Private)
- `GET /api/enquiries` — Review all customer inquiries (Admin only)
- `PUT /api/enquiries/:id` — Update status (`New`, `Contacted`, `In Progress`, `Closed`) & add admin follow-up notes (Admin only)
- `DELETE /api/enquiries/:id` — Delete enquiry (Admin only)

### ❤️ Wishlist (`/api/wishlist`)
- `GET /api/wishlist` — Get logged-in user's saved wishlist items (Private)
- `GET /api/wishlist/check/:propertyId` — Check if a property is in wishlist (Private)
- `POST /api/wishlist/:propertyId` — Add property to wishlist (Private)
- `DELETE /api/wishlist/:propertyId` — Remove property from wishlist (Private)

### 📊 Dashboard Statistics (`/api/stats`)
- `GET /api/stats/dashboard` — Live counts, category breakdowns, and recent activity (Admin only)

### 🖼️ Image Uploads (`/api/upload`)
- `POST /api/upload/single` — Upload single image (Cloudinary / Local) (Admin only)
- `POST /api/upload/multiple` — Upload up to 10 images (Admin only)

---

## 🛡️ License
Built for **BuildMaster Construction & Real Estate Group**. All rights reserved.
