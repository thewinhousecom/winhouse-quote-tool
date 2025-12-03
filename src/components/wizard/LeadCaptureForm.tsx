'use client';

// ============================================
// LEAD CAPTURE FORM COMPONENT
// ============================================

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuoteStore } from '@/lib/store/quote-store';
import { getIndustryBySlug } from '@/lib/data/modules';
import { getStyleById } from '@/lib/data/styles';
import { leadFormSchema, type LeadFormInput } from '@/lib/validations';
import { Button, Card, Input, Textarea, Label, Checkbox, RadioGroup } from '@/components/ui';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Loader2,
  Shield,
  CheckCircle
} from '@/components/icons';
import { cn, formatCurrency } from '@/lib/utils';

const roleOptions = [
  { value: 'owner', label: 'Chủ doanh nghiệp / Giám đốc', description: 'Quyết định chiến lược và ngân sách' },
  { value: 'admin', label: 'Quản trị viên / IT', description: 'Quản lý kỹ thuật và vận hành' },
  { value: 'seoer', label: 'Marketing / SEO', description: 'Phụ trách marketing và nội dung' },
  { value: 'accountant', label: 'Kế toán / Tài chính', description: 'Quản lý tài chính và hóa đơn' },
  { value: 'other', label: 'Khác', description: 'Vai trò khác trong tổ chức' },
];

export function LeadCaptureForm() {
  const { 
    setLead, 
    nextStep, 
    prevStep, 
    getCalculation, 
    selectedModules, 
    selectedIndustry,
    selectedBudget,
    selectedStyle
  } = useQuoteStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const calculation = getCalculation();
  const formRef = useRef<HTMLDivElement>(null);

  const industry = selectedIndustry ? getIndustryBySlug(selectedIndustry) : null;
  const style = selectedStyle ? getStyleById(selectedStyle) : null;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      role: 'owner',
      notes: '',
      acceptTerms: false,
    },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    // GSAP animation
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const onSubmit = async (data: LeadFormInput) => {
    setIsSubmitting(true);
    
    try {
      // Set lead data in store
      setLead({
        ...data,
        company: data.company || undefined,
        notes: data.notes || undefined,
      });

      const budgetLabels: Record<string, string> = {
        'under-20': 'Dưới 20 triệu',
        '20-50': '20 - 50 triệu',
        'over-50': 'Trên 50 triệu',
      };

      // Send to webhook (Google Sheets)
      await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead_captured',
          timestamp: new Date().toISOString(),
          data: {
            leadName: data.name,
            leadEmail: data.email,
            leadPhone: data.phone,
            leadCompany: data.company,
            leadRole: data.role,
            industrySlug: selectedIndustry,
            industryName: industry?.nameVi,
            budgetRange: selectedBudget,
            budgetLabel: selectedBudget ? budgetLabels[selectedBudget] : '',
            styleName: style?.nameVi,
            moduleCount: selectedModules.length,
            modules: selectedModules.map(m => m.nameVi).join(', '),
            totalAmount: calculation.total,
            monthlyAmount: calculation.monthlyTotal,
            estimatedDays: calculation.estimatedDays,
          },
        }),
      });

      // Send email notification
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead_notification',
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            industry: industry?.nameVi,
            budget: selectedBudget ? budgetLabels[selectedBudget] : '',
            style: style?.nameVi,
            modules: selectedModules.map(m => m.nameVi),
            totalAmount: calculation.total,
            monthlyAmount: calculation.monthlyTotal,
            estimatedDays: calculation.estimatedDays,
          },
        }),
      });

      // Move to next step
      nextStep();
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Bước 4/4 - Sắp hoàn thành!
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Nhận báo giá chi tiết
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Điền thông tin để chúng tôi gửi báo giá PDF và kịch bản tư vấn được tạo bởi AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card variant="default" className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label required>Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        {...register('name')}
                        placeholder="Nguyễn Văn A"
                        className="pl-10"
                        error={errors.name?.message}
                      />
                    </div>
                  </div>
                  <div>
                    <Label required>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="email@company.com"
                        className="pl-10"
                        error={errors.email?.message}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label required>Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        {...register('phone')}
                        placeholder="0901 234 567"
                        className="pl-10"
                        error={errors.phone?.message}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Tên công ty</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        {...register('company')}
                        placeholder="Công ty ABC"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <Label required>Vai trò của bạn</Label>
                  <RadioGroup
                    name="role"
                    options={roleOptions}
                    value={selectedRole}
                    onChange={(value) => setValue('role', value as LeadFormInput['role'])}
                    error={errors.role?.message}
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label>Ghi chú thêm (tùy chọn)</Label>
                  <Textarea
                    {...register('notes')}
                    placeholder="Mô tả thêm về yêu cầu của bạn..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Checkbox
                    {...register('acceptTerms')}
                    label="Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật của Winhouse"
                    error={errors.acceptTerms?.message}
                  />
                </div>

                {/* Privacy Note */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <Shield className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Thông tin của bạn được bảo mật tuyệt đối và chỉ được sử dụng để liên hệ tư vấn. 
                    Chúng tôi không bao giờ chia sẻ thông tin với bên thứ ba.
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <Button type="button" variant="ghost" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        Nhận báo giá
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass" className="p-6 sticky top-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Tóm tắt đơn hàng
              </h3>

              {/* Module Count */}
              <div className="flex justify-between text-sm mb-3">
                <span className="text-slate-600 dark:text-slate-400">Số tính năng</span>
                <span className="font-medium">{calculation.moduleCount} modules</span>
              </div>

              {/* Modules List */}
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {selectedModules.slice(0, 5).map((module) => (
                    <div key={module.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span className="text-slate-600 dark:text-slate-400 truncate">
                        {module.nameVi}
                      </span>
                    </div>
                  ))}
                  {selectedModules.length > 5 && (
                    <p className="text-xs text-slate-500 pl-5">
                      +{selectedModules.length - 5} tính năng khác
                    </p>
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Phí triển khai</span>
                  <span className="font-medium">{formatCurrency(calculation.subtotal)}</span>
                </div>
                {calculation.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(calculation.discount)}</span>
                  </div>
                )}
                {calculation.monthlyTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Phí duy trì/tháng</span>
                    <span className="font-medium">{formatCurrency(calculation.monthlyTotal)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-end">
                  <span className="text-slate-600 dark:text-slate-400">Tổng cộng</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white block">
                      {formatCurrency(calculation.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Báo giá PDF chuyên nghiệp</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>3 mẫu email tư vấn AI</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Tư vấn miễn phí 30 phút</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
