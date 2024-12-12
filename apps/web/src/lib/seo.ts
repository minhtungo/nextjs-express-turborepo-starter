import { config } from '@repo/lib/config';

type MetadataProps = {
  title?: string;
  description?: string;
  canonical: string;
  ogImage?: string;
};

const defaultMetadata = {
  title: '',
  description: '',
};

export const constructMetadata = ({
  title = defaultMetadata.description,
  description = defaultMetadata.description,
  canonical = '/',
  ogImage = '/images/og-image.png',
}: MetadataProps) => {
  return {
    metadataBase: new URL(config.app.url),
    title,
    description,
    keywords: [],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'OG Image',
        },
      ],
    },
    // --- will add this once we get the logo ---
    // icons: {
    //   icon: "/icon.png",
    //   shortcut: "/icon.png",
    //   apple: "/icon.png",
    // },
  };
};
