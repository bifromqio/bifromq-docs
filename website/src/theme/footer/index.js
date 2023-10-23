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
            publicId="pk_K0A0eAsd2bGPDGSXkoPimJgHRxPTgKIxRCr7BXcfKQ3PcrJh"
            pathname={pathname}
            appearance={{
                docslyToolboxStyles: "bg-orange-600 text-orange-50",
            }}
        />
    </>
  );
}
