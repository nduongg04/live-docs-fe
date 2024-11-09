# LiveDocs Frontend ✨

<div align="center">
  <img src="/public/assets/icons/doc.svg" alt="LiveDocs Logo" width="120"/>
  
  A modern, real-time collaborative documentation platform built with Next.js and Liveblocks.
  
  [![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lexical](https://img.shields.io/badge/Lexical-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://lexical.dev/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://next-auth.js.org/)
[![Shadcn](https://img.shields.io/badge/Shadcn-100000?style=for-the-badge&logo=shadcnui&logoColor=white&labelColor=black&color=000000)](https://ui.shadcn.com/)
  
  [Demo](https://livedocs.example.com) · [Frontend Repo](https://github.com/nduongg04/live-docs-fe) · [Backend Repo](https://github.com/nduongg04/live-docs-be)
</div>

## 🔗 Related Repositories

This is the frontend repository of LiveDocs. For the backend implementation, please visit:
- [LiveDocs Backend](https://github.com/nduongg04/live-docs-be)

## ✨ Features

- 📝 Real-time collaborative document editing
- 🔒 Secure user authentication (Email + Google OAuth)
- 💬 Document commenting and threading
- 🤝 Document sharing with granular permissions
- 📱 Responsive design for all devices
- 🎨 Rich text editing with formatting options
- 📤 File upload support
- 🌙 Dark mode optimized

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Liveblocks](https://liveblocks.io/) - Real-time Collaboration
- [Lexical](https://lexical.dev/) - Text Editor
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Shadcn](https://ui.shadcn.com/) - UI Components

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/nduongg04/live-docs-fe.git
cd live-docs-fe
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
# Backend Connection
NEXT_PUBLIC_API_URL=http://localhost:8000

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=

# NextAuth
AUTH_SECRET=
AUTH_TRUST_HOST=

# Image Upload
IMAGE_UPLOAD_URL=https://upload.imagekit.io/api/v1/files/upload
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure
```
live-docs-fe/
├── src/
│ ├── app/          # Next.js pages and layouts
│ ├── components/   # Reusable React components
│ ├── hooks/        # Custom React hooks
│ └── utils/        # Utility functions
├── public/         # Static files
└── styles/         # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
