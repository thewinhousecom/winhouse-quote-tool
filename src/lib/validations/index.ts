// ============================================
// WINHOUSE QUOTE TOOL - VALIDATION SCHEMAS
// ============================================

import { z } from 'zod';

// ============================================
// LEAD FORM VALIDATION
// ============================================
export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được quá 100 ký tự'),
  
  email: z
    .string()
    .email('Email không hợp lệ')
    .max(255, 'Email không được quá 255 ký tự'),
  
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(15, 'Số điện thoại không được quá 15 số')
    .regex(
      /^0[35789]\d{8}$/,
      'Số điện thoại không hợp lệ (VD: 0901234567)'
    ),
  
  company: z
    .string()
    .max(200, 'Tên công ty không được quá 200 ký tự')
    .optional(),
  
  role: z.enum(['owner', 'admin', 'seoer', 'accountant', 'other'], {
    message: 'Vui lòng chọn vai trò của bạn',
  }),
  
  notes: z
    .string()
    .max(1000, 'Ghi chú không được quá 1000 ký tự')
    .optional(),
  
  acceptTerms: z
    .boolean()
    .refine(val => val === true, {
      message: 'Bạn cần đồng ý với điều khoản sử dụng',
    }),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

// ============================================
// QUOTE REQUEST VALIDATION
// ============================================
export const quoteRequestSchema = z.object({
  industrySlug: z.enum([
    'real-estate',
    'business',
    'ecommerce',
    'education',
    'booking',
  ]),
  
  budgetRange: z.enum(['under-20', '20-50', 'over-50']),
  
  moduleIds: z
    .array(z.string())
    .min(1, 'Vui lòng chọn ít nhất 1 module'),
  
  lead: leadFormSchema,
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

// ============================================
// WEBHOOK PAYLOAD VALIDATION
// ============================================
export const webhookPayloadSchema = z.object({
  event: z.enum(['quote_created', 'lead_captured', 'quote_downloaded']),
  
  timestamp: z.string().datetime(),
  
  data: z.object({
    quoteNumber: z.string().optional(),
    industryName: z.string().optional(),
    budgetRange: z.string().optional(),
    totalAmount: z.number().optional(),
    monthlyAmount: z.number().optional(),
    moduleCount: z.number().optional(),
    modules: z.array(z.string()).optional(),
    estimatedDays: z.number().optional(),
    
    // Lead info
    leadName: z.string().optional(),
    leadEmail: z.string().email().optional(),
    leadPhone: z.string().optional(),
    leadCompany: z.string().optional(),
    leadRole: z.string().optional(),
  }),
});

export type WebhookPayloadInput = z.infer<typeof webhookPayloadSchema>;

// ============================================
// AI GENERATION REQUEST VALIDATION
// ============================================
export const aiGenerationRequestSchema = z.object({
  industryName: z.string(),
  modules: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
  totalAmount: z.number(),
  leadName: z.string(),
  companyName: z.string().optional(),
});

export type AIGenerationRequestInput = z.infer<typeof aiGenerationRequestSchema>;

// ============================================
// CONTACT FORM VALIDATION (Simple)
// ============================================
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự'),
  
  email: z
    .string()
    .email('Email không hợp lệ'),
  
  message: z
    .string()
    .min(10, 'Tin nhắn phải có ít nhất 10 ký tự')
    .max(2000, 'Tin nhắn không được quá 2000 ký tự'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ============================================
// MODULE SELECTION VALIDATION
// ============================================
export const moduleSelectionSchema = z.object({
  moduleId: z.string(),
  quantity: z.number().min(1).max(10).default(1),
});

export type ModuleSelectionInput = z.infer<typeof moduleSelectionSchema>;

// ============================================
// SEARCH/FILTER VALIDATION
// ============================================
export const moduleFilterSchema = z.object({
  industry: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
});

export type ModuleFilterInput = z.infer<typeof moduleFilterSchema>;
