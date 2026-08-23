import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name = 'Kavya Patel', type = 'website', image = '/favicon.svg' }) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      
      {/* Facebook tags */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      
      {/* Twitter tags */}
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      {/* Schema.org for Google */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "url": "https://kavyapatel.com/",
            "name": "Kavya Patel",
            "jobTitle": "Full Stack Developer",
            "description": "Full Stack Developer & AI Workflow Automation Expert based in Surat, Gujarat."
          }
        `}
      </script>
    </Helmet>
  );
};

export default SEO;
