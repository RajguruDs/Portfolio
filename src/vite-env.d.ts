/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script web-app URL for the contact form (public; not a secret). */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
