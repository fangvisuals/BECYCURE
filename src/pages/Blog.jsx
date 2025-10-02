import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { sanity } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import GradientText from '../components/GradientText';
import Scramble from '../components/Scramble';
import BackButton from '../components/BackButton';
import PageContainer from '../components/layout/PageContainer.jsx';
import SEO from "@/seo/SEO.jsx";

const PAGE_SIZE = 6;

const PAGED_QUERY = `{
  "items": *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc)[$offset...$end]{
      _id, title, slug, publishedAt, image,
      author->{ name, avatar }
    },
  "total": count(*[_type == "post" && defined(slug.current)])
}`;

function avatarUrl(image) {
  try {
    return image ? urlFor(image).width(48).height(48).fit('crop').url() : null;
  } catch {
    return null;
  }
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const offset = (page - 1) * PAGE_SIZE;
  const end = offset + PAGE_SIZE;

  const [posts, setPosts] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);

    React.useEffect(() => {
    const ctrl = new AbortController();
    let stale = false;
    setLoading(true);
    setErr(null);

    sanity
      .fetch(PAGED_QUERY, { offset, end }, { signal: ctrl.signal })
      .then((res) => {
        if (stale) return;
        setPosts(res?.items || []);
        setTotal(res?.total || 0);
      })
      .catch((err) => {
        if (stale) return;
        setErr(err);
      })
      .finally(() => {
        if (stale) return;
        setLoading(false);
      });

    return () => {
      stale = true;
      try { ctrl.abort(); } catch {}
    };
  }, [offset, end]);;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const gotoPage = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setSearchParams(next === 1 ? {} : { page: String(next) });
  };

  const buildPages = (totalPages, current) => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (current > 3) pages.push('…');
    const start = Math.max(2, current - 1);
    const finish = Math.min(totalPages - 1, current + 1);
    for (let i = start; i <= finish; i++) pages.push(i);
    if (current < totalPages - 2) pages.push('…');
    pages.push(totalPages);
    return pages;
  };

  // Afficher l'erreur inline, pas de retour anticipé pour garder le titre fixe

  return (
    <PageContainer>
    <SEO
      title="Actualités — Blog | BECYCURE"
      description="Articles et actualités cybersécurité: intégration SOC/SIEM, services managés, conformité, bonnes pratiques et retours d’expérience."
      canonicalPath="/blog"
      ogImage={(import.meta.env.BASE_URL || "/") + "pictures/ogImage.png"}
      structuredData={[{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "BECYCURE",
        url: (import.meta.env.VITE_SITE_ORIGIN || window.location.origin),
        logo: ((import.meta.env.VITE_SITE_ORIGIN || window.location.origin).replace(/\/$/, "")) + (import.meta.env.BASE_URL || "/") + "android-chrome-512x512.png",
        sameAs: ["https://fr.linkedin.com/company/becycure"],
      }, {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: (import.meta.env.VITE_SITE_ORIGIN || window.location.origin) + (import.meta.env.BASE_URL || "/") },
          { "@type": "ListItem", position: 2, name: "Actualités", item: (import.meta.env.VITE_SITE_ORIGIN || window.location.origin) + (import.meta.env.BASE_URL || "/") + "blog" },
        ],
      }]}
    />
    <main className="relative z-10 mx-auto w-full max-w-4xl">
      <BackButton className="mb-4" to="/" />
      <h1 className="title text-[9.5vw] sm:text-6xl lg:text-7xl leading-[1.05] mb-2">
        <span className="block">
          <span className="inline-flex items-baseline gap-x-2 md:gap-x-3">
            <GradientText
              colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]}
              animationSpeed={3}
            >
              <Scramble
                as="span"
                text={"/ ACTUALIT&Eacute;S"}
                trigger="mount"
                duration={300}
                cyclesPerLetter={4}
                shuffleMs={120}
                respectMotion={false}
                reserveWidth={false}
              />
            </GradientText>
          </span>
        </span>
      </h1>

      {/* Erreur */}
      {err && (
        <div className="my-4 rounded-lg bg-red-500/10 text-red-400 ring-1 ring-red-500/20 px-4 py-3">Erreur: {String(err)}</div>
      )}

      {/* Loading discret */}
      {loading && (
        <div className="mt-6 flex items-center gap-2 text-white/70"> 
          <div className="h-4 w-4 rounded-full border-2 border-white/25 border-t-green-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest">Chargement…</span>
        </div>
      )}

      <AnimatePresence mode="wait"> 
        <motion.ul 
          key={page}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="grid gap-5 sm:grid-cols-3 pt-10 min-h-[50vh]"
        >
        {posts.map((p) => {
          const href = `/blog/${p.slug.current}`;
          const img = p.image ? urlFor(p.image)?.width(800).height(450).fit('crop').url() : null;
          const aUrl = avatarUrl(p.author?.avatar);
          const aName = p.author?.name || "Équipe BECYCURE";
          const initial = aName?.slice(0, 1)?.toUpperCase() || "?";

          return (
            <li key={p._id} className="rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
              <Link to={href} className="block backdrop-blur-sm hover:bg-white/5 transition">
                {img && (
                  <img
                    src={img}
                    alt={p.title}
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-space-grotesk font-semibold line-clamp-2">
                    {p.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
                    {aUrl ? (
                      <img
                        src={aUrl}
                        alt={aName}
                        className="w-6 h-6 rounded-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                        {initial}
                      </div>
                    )}
                    <span className="truncate">{aName}</span>
                    <span className="opacity-50">•</span>
                    <span>{new Date(p.publishedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
        </motion.ul>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-10 mb-12 flex items-center justify-center gap-2 text-sm select-none">
          {/* Prev */}
          {page > 1 ? (
            <button
              onClick={() => gotoPage(page - 1)}
              className="px-3 py-1 rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10"
            >
              ‹
            </button>
          ) : (
            <span className="px-3 py-1 rounded-lg ring-1 ring-white/5 bg-white/5 opacity-40">‹</span>
          )}

          {/* Pages */}
          {buildPages(totalPages, page).map((p, idx) =>
            p === '…' ? (
              <span key={`dots-${idx}`} className="px-2 text-white/50">…</span>
            ) : p === page ? (
              <span
                key={p}
                aria-current="page"
                className="px-3 py-1 rounded-lg bg-green-400 text-black font-medium"
              >
                {p}
              </span>
            ) : (
              <button
                key={p}
                onClick={() => gotoPage(p)}
                className="px-3 py-1 rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10"
              >
                {p}
              </button>
            )
          )}

          {/* Next */}
          {page < totalPages ? (
            <button
              onClick={() => gotoPage(page + 1)}
              className="px-3 py-1 rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10"
            >
              ›
            </button>
          ) : (
            <span className="px-3 py-1 rounded-lg ring-1 ring-white/5 bg-white/5 opacity-40">›</span>
          )}
        </nav>
      )}
    </main>
    </PageContainer>
  );
}




