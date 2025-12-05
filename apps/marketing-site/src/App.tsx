import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MarketingLanding from './pages/MarketingLanding'
import './index.css'

// Component to redirect to home and scroll to features section
const FeaturesRedirect = () => {
  useEffect(() => {
    window.location.href = '/#features';
  }, []);
  return null;
};

// Component to redirect to external framework compliance URLs
const ExternalRedirect = ({ url }: { url: string }) => {
  useEffect(() => {
    window.location.href = url;
  }, [url]);
  return null;
};

function App() {
  const frameworkComplianceUrl = import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingLanding />} />
        {/* Redirect /features to home page features section */}
        <Route path="/features" element={<FeaturesRedirect />} />
        {/* Redirect pricing, privacy, and terms to framework compliance site */}
        <Route path="/pricing" element={<ExternalRedirect url={`${frameworkComplianceUrl}/pricing`} />} />
        <Route path="/privacy" element={<ExternalRedirect url={`${frameworkComplianceUrl}/privacy`} />} />
        <Route path="/terms" element={<ExternalRedirect url={`${frameworkComplianceUrl}/terms`} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

