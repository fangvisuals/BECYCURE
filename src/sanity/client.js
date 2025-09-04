import {createClient} from '@sanity/client';

export const sanity = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2025-08-26', // une date récente
  useCdn: true,             // CDN pour lecture publique
});
