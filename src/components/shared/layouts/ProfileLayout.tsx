import React from "react";
import Layout from "./Layout";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <Layout>
      <div className="container-contents">
        <div className="container__profile">
          <div className="container__profile--content">
            <div className="constrained-content-alt">{children}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
