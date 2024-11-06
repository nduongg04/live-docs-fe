# Live Docs Frontend

A modern web application for real-time documentation management.

## Technologies Used

- React
- TypeScript
- Next.js
- Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd live-docs-fe
```

2. Install dependencies
```bash
npm install
```
or

```bash
yarn install
```


3. Set up environment variables
Create a `.env.local` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

4. Run the development server
```bash
npm run dev
or
yarn dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Project Structure
```
  live-docs-fe/
  ├── src/
  │ ├── app/ # Next.js pages and layouts
  │ ├── components/ # Reusable React components
  │ ├── hooks/ # Custom React hooks
  │ ├── services/ # API services
  │ └── utils/ # Utility functions
  ├── public/ # Static files
  └── styles/ # Global styles
```
## Features

- User authentication (Email, Google OAuth)
- Real-time document editing
- Document sharing and collaboration
- File upload support
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
