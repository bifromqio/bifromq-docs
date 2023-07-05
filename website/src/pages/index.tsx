import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import HomeSection from '../components/homepage/HomeSection';
import HomeFooter from '../components/homepage/HomeFooter';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="BifroMQ Open Source"
      description={`${siteConfig.tagline}`}
    >
      <div className="bg-white dark:bg-gray-900 dark:text-gray-100 text-gray-500">
        <HomeSection />
        <HomeFooter />
      </div>
    </Layout>
  );
}
