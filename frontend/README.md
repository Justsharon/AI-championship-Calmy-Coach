# Calmly Frontend

AI-powered communication coach frontend built with React, TypeScript, and TailwindCSS.

## Features

- **Scenario Input** - Describe interpersonal communication challenges
- **AI Analysis** - Get context detection, confidence scoring, and emotional tone analysis
- **Response Suggestions** - Receive 3 different response options with varying tones
- **Memory Integration** - Save selected responses for personalization
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first styling
- **Fetch API** - Backend integration

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and set your API Gateway URL:

```env
VITE_API_BASE_URL=http://localhost:8787
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## API Integration

The frontend connects to the Calmly API Gateway with these endpoints:

- **POST /api/analyze** - Analyze situation context
- **POST /api/suggest** - Generate response suggestions
- **POST /api/memory** - Save user interactions

## Project Structure

```
src/
├── components/        # React components
│   ├── AnalysisDisplay.tsx
│   ├── ErrorAlert.tsx
│   ├── ResponseCard.tsx
│   └── ScenarioInput.tsx
├── services/         # API client
│   └── api.ts
├── types/           # TypeScript types
│   └── index.ts
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Tailwind styles
```

## Usage

1. Enter a communication scenario in the text area
2. Select your preferred tone (Calm/Empathetic/Direct)
3. Click "Get Response Suggestions"
4. Review the analysis and 3 response suggestions
5. Click "Use This Response" to save your choice

## Development

This project uses:
- Vite for fast HMR (Hot Module Replacement)
- TypeScript strict mode for type safety
- ESLint for code quality
- Prettier for code formatting (add `.prettierrc` if needed)

## Deployment

Deploy to any static hosting service:

- **Netlify**: `netlify deploy --prod`
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Build and push `dist/` folder

## License

MIT
