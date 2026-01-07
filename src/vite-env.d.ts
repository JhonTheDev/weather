/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_KEY: string;
  readonly VITE_MAPBOX_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
