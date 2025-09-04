// src/pages/BlogPost.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import BackButton from "@/components/BackButton.jsx";
import Panel from "@/components/Panel.jsx";
import { sanity } from "@/sanity/client";
import { urlFor } from "@/sanity/image";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id, title, slug, publishedAt, image, body
}`;

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    sanity
      .fetch(POST_QUERY, { slug })
      .then((data) => mounted && setPost(data))
      .catch((e) => mounted && setErr(e))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return <div className="text-white/80 p-6">Chargement…</div>;
  if (err) return <div className="text-red-400 p-6">Erreur : {String(err)}</div>;
  if (!post) return <div className="text-white/80 p-6">Article introuvable.</div>;

  const hero =
    post.image &&
    urlFor(post.image)?.width(1600).height(900).fit("crop").auto("format").url();

  /** Mapping Portable Text → React (mise en forme Tailwind) */
  const components = {
    types: {
      image: ({ value }) => {
        const src = urlFor(value)?.width(1400).fit("max").auto("format").url();
        if (!src) return null;
        const alt = value?.alt || post.title || "Illustration";
        return (
          <figure className="my-6">
            <img
              src={src}
              alt={alt}
              className="w-full rounded-xl object-cover"
              loading="lazy"
              decoding="async"
            />
            {value?.caption && (
              <figcaption className="mt-2 text-sm text-white/60">{value.caption}</figcaption>
            )}
          </figure>
        );
      },
    },
    block: {
      h1: ({ children }) => (
        <h2 className="mt-8 mb-3 text-3xl md:text-4xl font-semibold leading-tight">{children}</h2>
      ),
      h2: ({ children }) => (
        <h3 className="mt-8 mb-3 text-2xl md:text-3xl font-semibold leading-snug">{children}</h3>
      ),
      h3: ({ children }) => (
        <h4 className="mt-6 mb-2 text-xl md:text-2xl font-semibold leading-snug">{children}</h4>
      ),
      h4: ({ children }) => (
        <h5 className="mt-5 mb-2 text-lg md:text-xl font-semibold leading-snug">{children}</h5>
      ),
      normal: ({ children }) => (
        <p className="my-4 text-base md:text-lg leading-relaxed text-white/90">{children}</p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-6 border-l-4 border-white/20 pl-4 md:pl-6 italic text-white/90">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="my-4 ml-5 list-disc space-y-2 text-white/90">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="my-4 ml-5 list-decimal space-y-2 text-white/90">{children}</ol>
      ),
    },
    marks: {
      link: ({ value, children }) => {
        const href = value?.href || "#";
        const isExternal = /^https?:\/\//i.test(href);
        return (
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-green-400 hover:text-green-300 underline decoration-dotted underline-offset-4"
          >
            {children}
          </a>
        );
      },
      strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
      em: ({ children }) => <em className="italic text-white/90">{children}</em>,
      code: ({ children }) => (
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.95em]">
          {children}
        </code>
      ),
    },
  };

  return (
    <main className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8 py-8 md:py-10">
      <BackButton className="mb-4" />

      <Panel className="p-4 sm:p-6 md:p-8">
        {/* Hero */}
        {hero && (
          <img
            src={hero}
            alt={post.title}
            className="w-full rounded-xl aspect-video object-cover mb-6"
          />
        )}

        {/* Titre + méta */}
        <header className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight font-inter text-white">
            {post.title}
          </h1>
          <p className="text-sm md:text-base text-white/60 mt-2">
            Publié le {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
          </p>
        </header>

        {/* Corps de l’article */}
        <article className="font-inter text-white">
          {Array.isArray(post.body) ? (
            <PortableText value={post.body} components={components} />
          ) : (
            <p className="text-white/80">Aucun contenu.</p>
          )}
        </article>

        {/* Navigation retour */}
        <div className="mt-8">
          <Link
            to="/blog"
            className="text-green-400 hover:text-green-300 underline decoration-dotted underline-offset-4"
          >
            ← Retour aux articles
          </Link>
        </div>
      </Panel>
    </main>
  );
}
