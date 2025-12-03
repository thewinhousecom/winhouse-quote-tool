// ============================================
// WINHOUSE QUOTE TOOL - ZUSTAND STORE
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  WizardStep, 
  IndustrySlug, 
  BudgetRange, 
  SelectedModule, 
  Module,
  LeadFormData,
  Quote,
  AIGeneratedContent,
  QuoteCalculation 
} from '@/types';
import { calculateDiscount } from '@/lib/data/modules';
import type { WebsiteStyle } from '@/lib/data/styles';

// ============================================
// STORE STATE INTERFACE
// ============================================
interface QuoteStore {
  // Wizard State
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  
  // Selections
  selectedIndustry: IndustrySlug | null;
  selectedBudget: BudgetRange | null;
  selectedModules: SelectedModule[];
  selectedStyle: WebsiteStyle | null;
  
  // Lead & Quote
  lead: LeadFormData | null;
  quote: Quote | null;
  aiContent: AIGeneratedContent | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions - Navigation
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoToStep: (step: WizardStep) => boolean;
  
  // Actions - Selection
  setIndustry: (industry: IndustrySlug) => void;
  setBudget: (budget: BudgetRange) => void;
  setStyle: (style: WebsiteStyle) => void;
  
  // Actions - Modules
  addModule: (module: Module) => void;
  removeModule: (moduleId: string) => void;
  clearModules: () => void;
  isModuleSelected: (moduleId: string) => boolean;
  getModuleCount: () => number;
  
  // Actions - Calculation
  getCalculation: () => QuoteCalculation;
  
  // Actions - Lead & Quote
  setLead: (lead: LeadFormData) => void;
  setQuote: (quote: Quote) => void;
  setAIContent: (content: AIGeneratedContent) => void;
  
  // Actions - Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ============================================
// STEP ORDER FOR NAVIGATION
// ============================================
const STEP_ORDER: WizardStep[] = [
  'welcome',
  'industry',
  'budget',
  'builder',
  'style',
  'lead-capture',
  'result',
];

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  currentStep: 'welcome' as WizardStep,
  completedSteps: [] as WizardStep[],
  selectedIndustry: null,
  selectedBudget: null,
  selectedModules: [],
  selectedStyle: null,
  lead: null,
  quote: null,
  aiContent: null,
  isLoading: false,
  error: null,
};

// ============================================
// STORE IMPLEMENTATION
// ============================================
export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========================================
      // NAVIGATION ACTIONS
      // ========================================
      setStep: (step) => {
        const { completedSteps, currentStep } = get();
        
        // Add current step to completed if moving forward
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        const newIndex = STEP_ORDER.indexOf(step);
        
        let newCompleted = [...completedSteps];
        if (newIndex > currentIndex && !completedSteps.includes(currentStep)) {
          newCompleted.push(currentStep);
        }
        
        set({ 
          currentStep: step,
          completedSteps: newCompleted,
        });
      },

      nextStep: () => {
        const { currentStep, completedSteps } = get();
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        
        if (currentIndex < STEP_ORDER.length - 1) {
          const newCompleted = completedSteps.includes(currentStep)
            ? completedSteps
            : [...completedSteps, currentStep];
            
          set({
            currentStep: STEP_ORDER[currentIndex + 1],
            completedSteps: newCompleted,
          });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        
        if (currentIndex > 0) {
          set({ currentStep: STEP_ORDER[currentIndex - 1] });
        }
      },

      canGoToStep: (step) => {
        const { completedSteps, currentStep } = get();
        const targetIndex = STEP_ORDER.indexOf(step);
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        
        // Can always go back
        if (targetIndex <= currentIndex) return true;
        
        // Can only go forward if all previous steps completed
        for (let i = 0; i < targetIndex; i++) {
          if (!completedSteps.includes(STEP_ORDER[i]) && STEP_ORDER[i] !== currentStep) {
            return false;
          }
        }
        
        return true;
      },

      // ========================================
      // SELECTION ACTIONS
      // ========================================
      setIndustry: (industry) => {
        set({ 
          selectedIndustry: industry,
          // Clear modules when changing industry
          selectedModules: [],
        });
      },

      setBudget: (budget) => {
        set({ selectedBudget: budget });
      },

      setStyle: (style) => {
        set({ selectedStyle: style });
      },

      // ========================================
      // MODULE ACTIONS
      // ========================================
      addModule: (module) => {
        const { selectedModules } = get();
        
        // Check if already selected
        if (selectedModules.find(m => m.id === module.id)) {
          return;
        }
        
        const selectedModule: SelectedModule = {
          ...module,
          quantity: 1,
          addedAt: new Date(),
        };
        
        set({ 
          selectedModules: [...selectedModules, selectedModule],
        });
      },

      removeModule: (moduleId) => {
        const { selectedModules } = get();
        
        set({
          selectedModules: selectedModules.filter(m => m.id !== moduleId),
        });
      },

      clearModules: () => {
        set({ selectedModules: [] });
      },

      isModuleSelected: (moduleId) => {
        const { selectedModules } = get();
        return selectedModules.some(m => m.id === moduleId);
      },

      getModuleCount: () => {
        return get().selectedModules.length;
      },

      // ========================================
      // CALCULATION
      // ========================================
      getCalculation: () => {
        const { selectedModules } = get();
        
        // Calculate subtotals
        const subtotal = selectedModules.reduce((sum, m) => sum + m.basePrice, 0);
        const monthlyTotal = selectedModules.reduce((sum, m) => sum + m.monthlyPrice, 0);
        const estimatedDays = selectedModules.reduce((sum, m) => sum + m.estimatedDays, 0);
        
        // Calculate discount
        const { percent: discountPercent, amount: discount } = calculateDiscount(
          selectedModules.length,
          subtotal
        );
        
        // Final total
        const total = subtotal - discount;
        
        return {
          subtotal,
          monthlyTotal,
          discount,
          discountPercent,
          total,
          estimatedDays,
          moduleCount: selectedModules.length,
        };
      },

      // ========================================
      // LEAD & QUOTE ACTIONS
      // ========================================
      setLead: (lead) => {
        set({ lead });
      },

      setQuote: (quote) => {
        set({ quote });
      },

      setAIContent: (content) => {
        set({ aiContent: content });
      },

      // ========================================
      // UTILITY ACTIONS
      // ========================================
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'winhouse-quote-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist essential data
        selectedIndustry: state.selectedIndustry,
        selectedBudget: state.selectedBudget,
        selectedModules: state.selectedModules,
        selectedStyle: state.selectedStyle,
        lead: state.lead,
        completedSteps: state.completedSteps,
      }),
    }
  )
);

// ============================================
// SELECTOR HOOKS (for performance)
// ============================================
export const useCurrentStep = () => useQuoteStore((state) => state.currentStep);
export const useSelectedIndustry = () => useQuoteStore((state) => state.selectedIndustry);
export const useSelectedBudget = () => useQuoteStore((state) => state.selectedBudget);
export const useSelectedModules = () => useQuoteStore((state) => state.selectedModules);
export const useCalculation = () => useQuoteStore((state) => state.getCalculation());
export const useIsLoading = () => useQuoteStore((state) => state.isLoading);
