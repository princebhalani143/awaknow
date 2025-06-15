# AwakNow - Emotional Wellness Platform

A modern React application for emotional wellness and conflict resolution powered by AI.

## Website

Visit us at: [https://awaknow.org](https://awaknow.org)

## Features

- **Reflect Alone**: Private AI-powered sessions for personal emotional exploration
- **Resolve Together**: Guided conflict resolution sessions with AI mediation
- **User Authentication**: Secure email/phone authentication via Supabase
- **Responsive Design**: Beautiful, production-ready UI with Tailwind CSS
- **Modern Architecture**: Built with React, TypeScript, and Vite

## Translation Ready

The application is prepared for future internationalization:

- `TranslatedText` component ready for translation integration
- Language interfaces defined in types
- i18n utilities prepared in `src/utils/i18n.ts`
- Support for language files in `/public/locales/` (future)

To add translations in the future:
1. Create language files in `/public/locales/{language-code}.json`
2. Implement translation loading in `src/utils/i18n.ts`
3. Update `TranslatedText` component to use loaded translations
4. Add language selector back to TopBar component

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TAVUS_API_KEY=your_tavus_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
VITE_REVENUECAT_API_KEY=your_revenuecat_api_key
```

## Contact

For questions or support, contact us at: [info@awaknow.org](mailto:info@awaknow.org)

## License

© 2025 AwakNow. All rights reserved.