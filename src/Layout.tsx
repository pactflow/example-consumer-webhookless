import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function Layout(props: LayoutProps) {
  return (
    <div className="container">
      <div className="columns">
        <div className="column col-8 col-mx-auto">{props.children}</div>
      </div>
    </div>
  );
}

export default Layout;
