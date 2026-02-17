import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import ProductPage from './ProductPage';
import ErrorBoundary from './ErrorBoundary';

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

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(routing);
}
