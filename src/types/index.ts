// ============================================
// WINHOUSE QUOTE TOOL - TYPE DEFINITIONS
// ============================================

// ============================================
// INDUSTRY TYPES
// ============================================
export type IndustrySlug = 
  | 'real-estate' 
  | 'business' 
  | 'ecommerce' 
  | 'education' 
  | 'booking';

export interface Industry {
  id: string;
  name: string;
  nameVi: string;
  slug: IndustrySlug;
  icon: string;
  description: string;
  color: string;
  gradient: string;
}

// ============================================
// BUDGET TYPES
// ============================================
export type BudgetRange = 'under-20' | '20-50' | 'over-50';

export interface BudgetOption {
  id: BudgetRange;
  label: string;
  labelVi: string;
  minPrice: number;
  maxPrice: number | null;
  description: string;
}

// ============================================
// MODULE TYPES
// ============================================
export type ModuleCategory = 
  | 'core'           // Tính năng cốt lõi
  | 'marketing'      // Marketing & SEO
  | 'integration'    // Tích hợp
  | 'advanced'       // Nâng cao
  | 'support';       // Hỗ trợ & Bảo trì

export interface Module {
  id: string;
  name: string;
  nameVi: string;
  slug: string;
  description: string;
  descriptionVi: string;
  category: ModuleCategory;
  industryIds: IndustrySlug[];  // Ngành áp dụng
  basePrice: number;            // Giá triển khai 1 lần
  monthlyPrice: number;         // Giá duy trì/tháng
  icon: string;
  isPopular: boolean;
  isRequired: boolean;          // Bắt buộc phải có
  dependencies: string[];       // Các module phụ thuộc
  features: string[];           // Danh sách tính năng con
  estimatedDays: number;        // Thời gian triển khai (ngày)
}

export interface SelectedModule extends Module {
  quantity: number;
  addedAt: Date;
}

// ============================================
// QUOTE TYPES
// ============================================
export interface QuoteCalculation {
  subtotal: number;
  monthlyTotal: number;
  discount: number;
  discountPercent: number;
  total: number;
  estimatedDays: number;
  moduleCount: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  industryId: IndustrySlug;
  budgetRange: BudgetRange;
  modules: SelectedModule[];
  calculation: QuoteCalculation;
  validUntil: Date;
  createdAt: Date;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
}

// ============================================
// LEAD TYPES
// ============================================
export type LeadRole = 'owner' | 'admin' | 'seoer' | 'accountant' | 'other';

export interface Lead {
  id: string;
  quoteId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  role: LeadRole;
  notes?: string;
  createdAt: Date;
  source: 'quote-tool' | 'direct' | 'referral';
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  role: LeadRole;
  notes?: string;
  acceptTerms: boolean;
}

// ============================================
// AI CONTENT TYPES
// ============================================
export interface AIEmailTemplate {
  id: string;
  type: 'introduction' | 'follow-up' | 'closing';
  subject: string;
  body: string;
  tone: 'professional' | 'friendly' | 'urgent';
}

export interface AIGeneratedContent {
  emails: AIEmailTemplate[];
  consultingScript: string;
  keyPoints: string[];
  generatedAt: Date;
}

// ============================================
// WIZARD / STEP TYPES
// ============================================
export type WizardStep = 
  | 'welcome' 
  | 'industry' 
  | 'budget' 
  | 'builder' 
  | 'style'
  | 'lead-capture' 
  | 'result';

export interface WizardState {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  selectedIndustry: IndustrySlug | null;
  selectedBudget: BudgetRange | null;
  selectedModules: SelectedModule[];
  lead: LeadFormData | null;
  quote: Quote | null;
  aiContent: AIGeneratedContent | null;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WebhookPayload {
  event: 'quote_created' | 'lead_captured' | 'quote_downloaded';
  timestamp: string;
  data: {
    quote?: Quote;
    lead?: Lead;
    industry?: Industry;
  };
}

// ============================================
// DATABASE TYPES (MariaDB Integration)
// ============================================
export interface DBIndustry {
  id: number;
  name: string;
  name_vi: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DBModule {
  id: number;
  name: string;
  name_vi: string;
  slug: string;
  description: string;
  description_vi: string;
  category: ModuleCategory;
  base_price: number;
  monthly_price: number;
  icon: string;
  is_popular: boolean;
  is_required: boolean;
  dependencies: string; // JSON string
  features: string;     // JSON string
  estimated_days: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DBModuleIndustry {
  module_id: number;
  industry_slug: string;
}

export interface DBQuote {
  id: number;
  quote_number: string;
  industry_slug: string;
  budget_range: string;
  modules_json: string;
  subtotal: number;
  monthly_total: number;
  discount_percent: number;
  total: number;
  estimated_days: number;
  valid_until: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface DBLead {
  id: number;
  quote_id: number | null;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  role: string;
  notes: string | null;
  source: string;
  created_at: Date;
}

// ============================================
// UTILITY TYPES
// ============================================
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ValueOf<T> = T[keyof T];
