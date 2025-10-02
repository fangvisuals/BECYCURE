// src/pages/BlogPost.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { sanity } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import BackButton from "@/components/BackButton.jsx";
import Panel from "@/components/Panel.jsx";
import PageContainer from "@/components/layout/PageContainer.jsx";
import SEO from "@/seo/SEO.jsx";

// Fetch the post + author (name + image)
const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  image,
  body,
  author->{_id, name, image}
}`;

const ptComponents = {
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 list-disc pl-6 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 list-decimal pl-6 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="marker:text-white/60">{children}</li>,
    number: ({ children }) => <li className="marker:text-white/60">{children}</li>,
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl md:text-3xl font-semibold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl md:text-2xl font-semibold">{children}</h3>
    ),
    normal: ({ children }) => <p className="leading-relaxed">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:opacity-80"
      >
        {children}
      </a>
    ),
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    sanity
      .fetch(POST_QUERY, { slug })
      .then((data) => !cancelled && setPost(data))
      .catch((e) => !cancelled && setErr(e))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <div className="text-white/80 p-6">Chargement…</div>;
  if (err) return <div className="text-red-400 p-6">Erreur: {String(err)}</div>;
  if (!post) return <div className="text-white/80 p-6">Article introuvable.</div>;

  const cover =
    post.image &&
    urlFor(post.image).width(1280).height(720).fit("crop").url();

  const authorAvatar =
    post.author?.image &&
    urlFor(post.author.image).width(80).height(80).fit("crop").url();

  const published = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("fr-FR")
    : "";

  // Portable Text custom renderers (optional: fine tune headings/images/links)
  const components = {
    block: {
      h2: ({ children }) => (
        <h2 className="font-space-grotesk text-green-500 text-2xl sm:text-[1.65rem] lg:text-3xl font-semibold mt-8 mb-3">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="font-space-grotesk text-green-400 text-xl sm:text-2xl font-semibold mt-6 mb-2">
          {children}
        </h3>
      ),
      normal: ({ children }) => <p className="leading-relaxed">{children}</p>,
    },
    types: {
      image: ({ value }) => {
        const src = value?.asset ? urlFor(value).width(1280).url() : null;
        if (!src) return null;
        return (
          <figure className="my-6">
            <img
              src={src}
              alt={value?.alt || ""}
              className="rounded-xl w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {value?.alt ? (
              <figcaption className="mt-2 text-sm text-white/60">
                {value.alt}
              </figcaption>
            ) : null}
          </figure>
        );
      },
    },
    marks: {
      link: ({ value, children }) => {
        const href = value?.href || "#";
        const isExt = /^https?:\/\//i.test(href);
        return (
          <a
            href={href}
            target={isExt ? "_blank" : undefined}
            rel={isExt ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <PageContainer
      as="section"
      centerY={false}                 // allow full-page scrolling
      maxW="max-w-[min(94vw,1000px)]"
      px="px-5 sm:px-6 md:px-8"
      py="py-8 sm:py-10 md:py-12 lg:py-16"
      className="text-white/80"
    >
      <SEO
        title={(post?.title ? `${post.title} — Blog | BECYCURE` : 'Article — Blog | BECYCURE')}
        description={undefined}
        canonicalPath={post?.slug?.current ? `/blog/${post.slug.current}` : undefined}
        ogImage={cover || ((import.meta.env.BASE_URL || "/") + "pictures/ogImage.png")}
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
            post?.slug?.current ? { "@type": "ListItem", position: 3, name: post.title || 'Article', item: (import.meta.env.VITE_SITE_ORIGIN || window.location.origin) + (import.meta.env.BASE_URL || "/") + `blog/${post.slug.current}` } : null,
          ].filter(Boolean),
        }]}
      />
      {/* Force Back to home (not history back) */}
      <BackButton className="mb-3" to="/blog" title="Retour aux articles" />

      <Panel className="p-8 sm:p-6 md:p-10 lg:p-10" >
        {/* Hero image */}
        {cover && (
          <img
            src={cover}
            alt={post.title}
            className="w-full aspect-video rounded-xl object-cover mb-6"
          />
        )}

        {/* Title */}
        <header className="mb-4">
          <h1 className="title leading-tight text-3xl sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Meta: author + date */}
          <div className="mt-3 flex items-center gap-3 text-white/70">
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={post.author?.name || "Auteur"}
                className="w-9 h-9 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="text-sm">
              {post.author?.name && (
                <div className="font-medium text-grey/90">
                  {post.author.name}
                </div>
              )}
              {published && <div>Publié le {published}</div>}
            </div>
          </div>
        </header>

        {/* Body */}
        <article
          className="
            prose prose-invert max-w-none
            prose-headings:font-space-grotesk
            prose-h2:scroll-mt-24 prose-h3:scroll-mt-24
            prose-p:text-grey/90 prose-a:text-green-400 hover:prose-a:text-green-300
            prose-strong:text-white prose-em:text-white
            prose-li:marker:text-white/60 max-w-none
            prose-img:rounded-xl
            prose-ul:list-disc 
            prose-ol:list-decimal
          "
        >
          {Array.isArray(post.body) ? (
            <PortableText value={post.body} components={components} />
          ) : (
            <p className="text-white/70">
              (Aucun contenu pour cet article.)
            </p>
          )}
        </article>
      </Panel>
    </PageContainer>
  );
}
