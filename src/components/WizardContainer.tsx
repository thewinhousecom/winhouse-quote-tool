'use client';

// ============================================
// WIZARD CONTAINER COMPONENT
// ============================================

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuoteStore } from '@/lib/store/quote-store';
import {
  WelcomeScreen,
  IndustrySelector,
  BudgetSelector,
  ModuleBuilder,
  StyleSelector,
  LeadCaptureForm,
  ResultScreen,
} from '@/components/wizard';

// Initialize Lenis smooth scroll
let lenis: Lenis | null = null;

const stepComponents = {
  welcome: WelcomeScreen,
  industry: IndustrySelector,
  budget: BudgetSelector,
  builder: ModuleBuilder,
  style: StyleSelector,
  'lead-capture': LeadCaptureForm,
  result: ResultScreen,
};

// Lenis type
type Lenis = {
  raf: (time: number) => void;
  destroy: () => void;
};

export function WizardContainer() {
  const currentStep = useQuoteStore((state) => state.currentStep);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Dynamic import Lenis to avoid SSR issues
    const initLenis = async () => {
      try {
        const Lenis = (await import('@studio-freight/lenis')).default;
        
        lenisRef.current = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
        });

        function raf(time: number) {
          lenisRef.current?.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
      } catch (error) {
        console.log('Lenis not available:', error);
      }
    };

    initLenis();

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const StepComponent = stepComponents[currentStep];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        <StepComponent />
      </motion.div>
    </AnimatePresence>
  );
}
