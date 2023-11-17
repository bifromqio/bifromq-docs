import React from 'react';
import Footer from '@theme-original/Footer';
import Docsly from "@docsly/react";
import "@docsly/react/styles.css";
import {useLocation} from "@docusaurus/router";

export default function FooterWrapper(props) {
  const { pathname } = useLocation();
  return (
    <>
      <Footer {...props} />
      <Docsly publicId="pk_3w27Gav8Q0EzQ4lZh4zVFAyNsVlGHpf34UTiz73MG5zeix3e" pathname={pathname} />
    </>
  );
}
