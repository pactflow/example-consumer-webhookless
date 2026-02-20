import ReactDom from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
import ProductPage from "./ProductPage.tsx";

const routing = (
  <BrowserRouter>
    <div>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/products/">
            <Route path=":id" element={<ProductPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </div>
  </BrowserRouter>
);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDom.createRoot(rootElement);
  root.render(routing);
}
