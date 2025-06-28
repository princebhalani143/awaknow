/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_TAVUS_API_KEY: string;
  readonly VITE_TAVUS_PERSONA_ID: string;
  readonly VITE_TAVUS_REPLICA_ID: string;
  readonly VITE_REVENUECAT_API_KEY: string;
  readonly VITE_ELEVENLABS_API_KEY: string;
  readonly VITE_ALGORAND_API_KEY: string;
  readonly VITE_IPFS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}