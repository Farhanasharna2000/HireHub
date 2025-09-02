# 🚀 HireHub

![HireHub Banner](/public/home.png) 



**HireHub** is a comprehensive job portal platform designed to connect job seekers with recruiters seamlessly. Job seekers can search, apply, and save jobs, while recruiters can post and manage job listings as well as showcase their company profiles.


## Features

### Job Seeker
- Search for jobs by title, category, price or location  
- Apply to jobs directly from the platform  
- Save favorite jobs for future reference  
- View and edit personal profile  
- Track applied jobs 

### Recruiter
- Add and manage job listings  
- View applicants for posted jobs  
- Create and update company profile  
- Manage company job postings efficiently  


## 🌍 Live Demo  

Experience **HireHub** live:  
➡️ **[Click here to visit](https://hire-hub-beryl.vercel.app)**  

## 🛠 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, ShadCN UI
- **State Management:** Redux Toolkit
- **Backend:** Node.js, Express
- **Authentication:** Next-Auth, JWT, bcryptjs
- **Utilities:** clsx, framer-motion, react-hot-toast, react-hook-form
- **Database:** MongoDB
- **Deployment:** Vercel 

## 📦 Installation

To set up the project locally, follow these steps:

### 1️⃣ Clone the repository
```sh
git clone https://github.com/Farhanasharna2000/HireHub.git
cd hirehub
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Create a `.env` file
Set up environment variables in a `.env` file at the root directory:

```ini
# MongoDB
NEXT_PUBLIC_MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_PUBLIC_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_IMAGE_PRESET=your_image_preset
NEXT_PUBLIC_CLOUDINARY_RESUME_PRESET=your_resume_preset

```

**⚠️ Never expose your API keys in public repositories.**

### 4️⃣ Start the development server
```sh
npm run dev
```

## 🤝 Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch (`feature-xyz`).
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.


🎉 **Enjoy using HireHub!**


