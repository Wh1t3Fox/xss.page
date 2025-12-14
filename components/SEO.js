import Head from 'next/head'

export default function SEO({
  title = 'XSS.page - Cross-Site Scripting Documentation & Resources',
  description = 'Comprehensive guide to Cross-Site Scripting (XSS) vulnerabilities. Learn about reflected, stored, and DOM-based XSS with examples, prevention techniques, and security resources.',
  ogImage = '/og-image.png',
  url = 'https://xss.page'
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="canonical" href={url} />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}
