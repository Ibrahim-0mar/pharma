# Medical Prescriptions System

A modern web application for managing medical prescriptions, built with React, TypeScript, and Vite.

## Features

- 🔐 User Authentication (Pharmacists & Doctors)
- 📋 Prescription Management
- 📸 Image Upload & Cropping
- 📱 Responsive Design
- 🎨 Modern UI with Shadcn/UI
- 🔍 Form Validation
- 📊 Data Management

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Components:** Shadcn/UI + Radix UI
- **Styling:** TailwindCSS
- **Form Management:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Image Processing:** react-easy-crop
- **Notifications:** React Toastify

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Ibrahim-0mar/pharma
```

2. Install dependencies:

```bash
cd pharma
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── lib/              # Utilities and configurations
│   ├── axios/        # API client setup
│   ├── constants/    # Application constants
│   ├── schemas/      # Zod validation schemas
│   └── utils/        # Helper functions
├── pages/            # Application pages
└── types/            # TypeScript type definitions
```

## Key Features

### Authentication

- Login/Register for Pharmacists
- Secure session management
- Protected routes

### Prescription Management

- Create new prescriptions
- Upload and crop prescription images
- View prescription history
- Manage medications

### Profile Management

- View and edit user profile
- Update personal information
- Manage account settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful UI components
- [React Hook Form](https://react-hook-form.com/) for form management
- [Zod](https://zod.dev/) for schema validation
- [React Easy Crop](https://github.com/ricardo-ch/react-easy-crop) for image cropping
