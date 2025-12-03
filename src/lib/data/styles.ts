// ============================================
// WEBSITE STYLE DATA
// ============================================

import type { IndustrySlug } from '@/types';

export type WebsiteStyle = 
  | 'minimalist' 
  | 'luxury' 
  | 'creative' 
  | 'hightech' 
  | 'corporate' 
  | 'organic';

export interface StyleOption {
  id: WebsiteStyle;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  icon: string;
  colors: string[];
  gradient: string;
  previewImage?: string;
  tags: string[];
}

export const websiteStyles: StyleOption[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    nameVi: 'Tối giản',
    description: 'Clean, simple design with focus on content and whitespace',
    descriptionVi: 'Thiết kế sạch sẽ, đơn giản, tập trung vào nội dung và không gian trống',
    icon: 'Minus',
    colors: ['#ffffff', '#f8fafc', '#1e293b', '#64748b'],
    gradient: 'from-slate-100 to-white',
    tags: ['Clean', 'Simple', 'Modern'],
  },
  {
    id: 'luxury',
    name: 'Luxury',
    nameVi: 'Sang trọng',
    description: 'Elegant and sophisticated design with premium feel',
    descriptionVi: 'Thiết kế thanh lịch, tinh tế với cảm giác cao cấp',
    icon: 'Crown',
    colors: ['#1a1a2e', '#d4af37', '#f5f5dc', '#2d2d44'],
    gradient: 'from-amber-200 via-yellow-300 to-amber-400',
    tags: ['Premium', 'Elegant', 'Gold'],
  },
  {
    id: 'creative',
    name: 'Creative',
    nameVi: 'Sáng tạo',
    description: 'Bold, artistic design with unique visual elements',
    descriptionVi: 'Thiết kế táo bạo, nghệ thuật với các yếu tố hình ảnh độc đáo',
    icon: 'Palette',
    colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'],
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    tags: ['Bold', 'Artistic', 'Colorful'],
  },
  {
    id: 'hightech',
    name: 'High-tech',
    nameVi: 'Công nghệ',
    description: 'Modern tech-inspired design with futuristic elements',
    descriptionVi: 'Thiết kế hiện đại, lấy cảm hứng từ công nghệ với yếu tố tương lai',
    icon: 'Cpu',
    colors: ['#0f0f23', '#00d9ff', '#7c3aed', '#10b981'],
    gradient: 'from-cyan-400 via-blue-500 to-purple-600',
    tags: ['Futuristic', 'Tech', 'Neon'],
  },
  {
    id: 'corporate',
    name: 'Corporate',
    nameVi: 'Doanh nghiệp',
    description: 'Professional and trustworthy design for businesses',
    descriptionVi: 'Thiết kế chuyên nghiệp, đáng tin cậy cho doanh nghiệp',
    icon: 'Building2',
    colors: ['#1e40af', '#3b82f6', '#f1f5f9', '#1e293b'],
    gradient: 'from-blue-600 to-blue-800',
    tags: ['Professional', 'Trust', 'Business'],
  },
  {
    id: 'organic',
    name: 'Organic',
    nameVi: 'Tự nhiên',
    description: 'Natural, eco-friendly design with earthy tones',
    descriptionVi: 'Thiết kế tự nhiên, thân thiện môi trường với tông màu đất',
    icon: 'Leaf',
    colors: ['#1D6F41', '#a7c957', '#f2e8cf', '#6b4423'],
    gradient: 'from-green-400 to-emerald-600',
    tags: ['Natural', 'Eco', 'Earth'],
  },
];

// Recommended styles by industry
export const styleRecommendations: Record<IndustrySlug, WebsiteStyle[]> = {
  'real-estate': ['luxury', 'minimalist', 'corporate'],
  'business': ['corporate', 'minimalist', 'hightech'],
  'ecommerce': ['minimalist', 'creative', 'hightech'],
  'education': ['organic', 'minimalist', 'corporate'],
  'booking': ['minimalist', 'luxury', 'organic'],
};

export function getStyleById(id: WebsiteStyle): StyleOption | undefined {
  return websiteStyles.find(style => style.id === id);
}

export function getRecommendedStyles(industrySlug: IndustrySlug): StyleOption[] {
  const recommendedIds = styleRecommendations[industrySlug] || ['minimalist', 'corporate'];
  return recommendedIds.map(id => websiteStyles.find(s => s.id === id)!).filter(Boolean);
}

export function getOtherStyles(industrySlug: IndustrySlug): StyleOption[] {
  const recommendedIds = styleRecommendations[industrySlug] || [];
  return websiteStyles.filter(s => !recommendedIds.includes(s.id));
}
