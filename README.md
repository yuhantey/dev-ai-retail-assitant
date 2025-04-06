# AI Retail Assistant

An intelligent retail assistant system that combines retrieval-based systems, conversational voice interfaces, and POS integration for brick and mortar stores.

## Features

- Multi-agent system for retail operations
- Voice interface for customer interactions
- POS system integration
- Product inventory management
- Customer relationship management
- Sales analytics and reporting

## Tech Stack

- **Backend**: Deno, TypeScript
- **Database**: Supabase, Drizzle ORM
- **Deployment**: Vercel/Deno Deploy

## Getting Started

1. Install Deno (if not already installed):
   ```bash
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

2. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ai-retail-assistant
   ```

3. Install dependencies:
   ```bash
   deno cache --reload main.ts
   ```

4. Start the development server:
   ```bash
   deno task dev
   ```

## Project Structure

```
src/
├── api/           # API routes and middleware
├── agents/        # AI agent implementations
│   ├── voice/     # Voice interface components
│   ├── pos/       # POS integration
│   └── retrieval/ # Retrieval-based systems
├── db/            # Database schema and migrations
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Environment Variables

Create a `.env` file with the following variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## License

MIT 