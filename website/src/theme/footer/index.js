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
        <Docsly
            publicId="pk_wJepGyTZ2kAS3Ilkj3M9CJcBJ0IpXhkGfZOFkxDVJc962Gvk"
            pathname={pathname}
        />
    </>
  );
}
