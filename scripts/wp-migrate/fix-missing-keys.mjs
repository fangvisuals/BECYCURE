// scripts/wp-migrate/fix-missing-keys.mjs
import 'dotenv/config';
import {createClient} from '@sanity/client';

const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const DATASET    = process.env.SANITY_DATASET    || process.env.VITE_SANITY_DATASET;
const TOKEN      = process.env.SANITY_TOKEN      || process.env.VITE_SANITY_TOKEN;

if (!PROJECT_ID || !DATASET || !TOKEN) {
  console.error('Missing env: SANITY/VITE_SANITY projectId, dataset or token');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
});

// générateur de clés courtes mais uniques
const key = () => (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) + Math.random().toString(36).slice(2, 6);

const addKeysToBlocks = (blocks) =>
  (Array.isArray(blocks) ? blocks : []).map((b) => ({
    ...b,
    _key: b._key || key(),
    children: Array.isArray(b.children)
      ? b.children.map((c) => ({ ...c, _key: c._key || key() }))
      : b.children,
  }));

const addKeysToBody = (doc) => ({
  ...doc,
  body: addKeysToBlocks(doc.body),
});

const q = `*[_type=="post" && defined(body)][]._id`;
const ids = await client.fetch(q);

for (const id of ids) {
  const doc = await client.getDocument(id);
  const patched = addKeysToBody(doc);
  await client.patch(id).set({ body: patched.body }).commit();
  console.log('✓ fixed keys for', id);
}

console.log('🎉 Done: all posts have _key on body blocks/children');
