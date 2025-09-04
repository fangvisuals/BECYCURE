import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { sanity } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import GradientText from '../components/GradientText';
import Scramble from '../components/Scramble';
import BackButton from '../components/BackButton';
import PageContainer from '../components/layout/PageContainer.jsx';

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
    setLoading(true);
    sanity
      .fetch(PAGED_QUERY, { offset, end })
      .then((res) => {
        setPosts(res.items || []);
        setTotal(res.total || 0);
      })
      .catch(setErr)
      .finally(() => setLoading(false));
  }, [offset, end]);

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

  if (loading) return <div className="text-white/80">Chargement…</div>;
  if (err) return <div className="text-red-400">Erreur: {String(err)}</div>;

  return (
    <PageContainer>
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
                text={"/ ACTUALITÉS"}
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

      <ul className="grid gap-5 sm:grid-cols-3 pt-10">
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
      </ul>

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
