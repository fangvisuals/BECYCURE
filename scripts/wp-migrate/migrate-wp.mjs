// scripts/wp-migrate/migrate-wp.mjs
import 'dotenv/config';
import {createClient} from '@sanity/client';
import * as cheerio from 'cheerio';

// ------- ENV (SANITY_* ou VITE_SANITY_* acceptés) -------
const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const DATASET    = process.env.SANITY_DATASET    || process.env.VITE_SANITY_DATASET;
const TOKEN      = process.env.SANITY_TOKEN      || process.env.VITE_SANITY_TOKEN;
const WP_URL     = (process.env.WP_URL || process.env.VITE_WP_URL || '').replace(/\/+$/, '');
const WP_REST_BASE = process.env.WP_REST_BASE || process.env.WP_CPT || 'actualites_article';

if (!PROJECT_ID || !DATASET || !TOKEN || !WP_URL) {
  console.error('❌ Missing env: need PROJECT_ID, DATASET, TOKEN, WP_URL (SANITY_* ou VITE_SANITY_*).');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
});

// -------- utils ----------
const genKey = () =>
  Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);

const span = (text) => ({
  _type: 'span',
  _key: genKey(),
  text: (text || '').replace(/\s+\n/g, '\n'),
  marks: [],
});

const block = ({style = 'normal', children = [], listItem, level}) => {
  const b = {
    _type: 'block',
    _key: genKey(),
    style,
    markDefs: [],
    children: children.length ? children : [span('')],
  };
  if (listItem) b.listItem = listItem;
  if (level) b.level = level;
  return b;
};

const isBulletLine = (s) => /^(\u2022|•|-|–|\*)\s+/.test(s);

// ------- WordPress fetch -------
async function fetchAllWpPosts() {
  let page = 1;
  const perPage = 100;
  const all = [];

  while (true) {
    const url = `${WP_URL}/wp-json/wp/v2/${encodeURIComponent(WP_REST_BASE)}?per_page=${perPage}&page=${page}&_embed`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 400 || res.status === 404) break;
      const txt = await res.text();
      throw new Error(`WP fetch error ${res.status}: ${txt}`);
    }
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) break;
    all.push(...items);
    if (items.length < perPage) break;
    page++;
  }
  return all;
}

// -------- HTML -> Portable Text (titres, paragraphes, UL/OL, et "•" + <br>) --------
function htmlToPortableTextWithLists(html) {
  const $ = cheerio.load(html || '');
  const out = [];

  // Normalise <br> en '\n' dans les <p> pour détecter les listes à puces en texte
  $('p').each((_, el) => {
    const $el = $(el);
    $el.find('br').replaceWith('\n');
  });

  // On parcourt les éléments de haut niveau qui nous intéressent
  $('h1, h2, h3, h4, ul, ol, p, blockquote').each((_, el) => {
    const tag = el.tagName?.toLowerCase();

    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') {
      const txt = $(el).text().trim();
      if (txt) {
        // on mappe h1->h2, h2->h2, h3->h3, h4->h4 pour rester sobre
        const style = tag === 'h3' ? 'h3' : tag === 'h4' ? 'h4' : 'h2';
        out.push(block({style, children: [span(txt)]}));
      }
      return;
    }

    if (tag === 'ul' || tag === 'ol') {
      const liEls = $(el).find('> li');
      liEls.each((__, li) => {
        const txt = $(li).text().trim();
        if (txt) out.push(block({children: [span(txt)], listItem: tag === 'ol' ? 'number' : 'bullet'}));
      });
      return;
    }

    if (tag === 'blockquote') {
      const txt = $(el).text().trim();
      if (txt) out.push(block({style: 'blockquote', children: [span(txt)]}));
      return;
    }

    if (tag === 'p') {
      const raw = $(el).text().replace(/\r/g, '');
      const lines = raw.split('\n').map((s) => s.trim()).filter(Boolean);

      // Est-ce un "para" qui contient en fait une liste à puces via "•", "-", "–", "*" ?
      const bulletLike = lines.length > 1 && lines.every((l) => isBulletLine(l));

      if (bulletLike) {
        lines.forEach((l) => {
          const text = l.replace(/^(\u2022|•|-|–|\*)\s+/, '').trim();
          if (text) out.push(block({children: [span(text)], listItem: 'bullet'}));
        });
      } else {
        const txt = raw.trim();
        if (txt) out.push(block({children: [span(txt)]}));
      }
      return;
    }
  });

  // Fallback si rien
  if (out.length === 0) {
    const text = $.text().trim();
    if (text) out.push(block({children: [span(text)]}));
  }

  return out;
}

// Upload image distante -> Sanity asset
async function uploadImageFromUrl(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload('image', buffer, {
      contentType: res.headers.get('content-type') || 'image/jpeg',
      filename: url.split('/').pop() || 'image.jpg',
    });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (e) {
    console.warn('⚠️ Image upload failed:', url, e.message);
    return null;
  }
}

// -------- Migration --------
async function run() {
  console.log('⏳ Fetching WordPress posts…');
  const posts = await fetchAllWpPosts();
  console.log(`✅ ${posts.length} posts récupérés depuis ${WP_REST_BASE}`);

  for (const p of posts) {
    const id = p.id;
    const slug = p.slug;
    const title = p.title?.rendered || '';
    const html = p.content?.rendered || '';
    const publishedAt = p.date || p.modified || new Date().toISOString();

    // Image à la une
    let featuredUrl = null;
    const media = p._embedded?.['wp:featuredmedia'];
    if (Array.isArray(media) && media[0]?.source_url) {
      featuredUrl = media[0].source_url;
    }
    const image = await uploadImageFromUrl(featuredUrl);

    // Corps en Portable Text avec vraies listes
    const bodyBlocks = htmlToPortableTextWithLists(html);

    const doc = {
      _id: `wp-post-${id}`,   // stable (ré-exécutable)
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slug },
      publishedAt,
      image,
      body: bodyBlocks,
    };

    await client.createOrReplace(doc);
    console.log(`→ Migré: ${title} (${slug})`);
  }

  console.log('🎉 Migration terminée !');
}

run().catch((err) => {
  console.error('❌ Migration error:', err);
  process.exit(1);
});
