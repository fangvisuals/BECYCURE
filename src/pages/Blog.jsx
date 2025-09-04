import React from 'react';
import { Link } from 'react-router-dom';
import { sanity } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import GradientText from '../components/GradientText';
import Scramble from '../components/Scramble';
import BackButton from '../components/BackButton';

const POSTS_QUERY = `*[
  _type == "post" && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id, title, slug, publishedAt, image
}`;

export default function Blog() {
  const [posts, setPosts] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);

  React.useEffect(() => {
    sanity
      .fetch(POSTS_QUERY)
      .then(setPosts)
      .catch(setErr)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white/80">Chargement…</div>;
  if (err) return <div className="text-red-400">Erreur: {String(err)}</div>;

  return (
    <main className="relative z-10 mx-auto w-full max-w-4xl px-10 text-white">
      <div className="relative z-10 px-6 md:px-10 pt-10 md:pt-16 mx-auto">
        <BackButton className="mb-4" />
        <h1 className="title leading-tight">
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
            </div>

      <ul className="grid gap-5 sm:grid-cols-3 pt-10">
        {posts?.map((p) => {
          const href = `/blog/${p.slug.current}`;
          const img = urlFor(p.image)?.width(800).height(450).fit('crop').url();
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
                  <h2 className="text-lg font-space-grotesk font-semibold">{p.title}</h2>
                  <p className="text-xs text-white/60 mt-1">
                    {new Date(p.publishedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
