import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";

// Case studies are split into their own chunks so the home page stays light.
const PropVision = lazy(() => import("./pages/work/PropVision"));
const Attrition = lazy(() => import("./pages/work/Attrition"));
const MarketingCampaign = lazy(() => import("./pages/work/MarketingCampaign"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <MotionConfig reducedMotion="user">
    <LazyMotion features={domAnimation} strict>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/work/propvision" element={<PropVision />} />
              <Route path="/work/attrition" element={<Attrition />} />
              <Route path="/work/marketing-campaign-analysis" element={<MarketingCampaign />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </LazyMotion>
  </MotionConfig>
);

export default App;
