'use client';

// ============================================
// BUDGET SELECTOR COMPONENT
// ============================================

import { motion } from 'framer-motion';
import { useQuoteStore } from '@/lib/store/quote-store';
import { budgetOptions } from '@/lib/data/modules';
import { Button, Card } from '@/components/ui';
import { ArrowLeft, ArrowRight, Check, DollarSign, TrendingUp, Rocket } from '@/components/icons';
import { cn, formatCurrency } from '@/lib/utils';
import type { BudgetRange } from '@/types';

const budgetIcons = {
  'under-20': DollarSign,
  '20-50': TrendingUp,
  'over-50': Rocket,
};

const budgetColors = {
  'under-20': {
    gradient: 'from-emerald-500 to-teal-600',
    ring: 'ring-emerald-500',
    shadow: 'shadow-emerald-500/20',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  '20-50': {
    gradient: 'from-blue-500 to-indigo-600',
    ring: 'ring-blue-500',
    shadow: 'shadow-blue-500/20',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
  },
  'over-50': {
    gradient: 'from-violet-500 to-purple-600',
    ring: 'ring-violet-500',
    shadow: 'shadow-violet-500/20',
    bg: 'bg-violet-100 dark:bg-violet-900/30',
    text: 'text-violet-600 dark:text-violet-400',
  },
};

const budgetFeatures = {
  'under-20': [
    'Website cơ bản 1-5 trang',
    'Thiết kế responsive',
    'Hosting 1 năm miễn phí',
    'Hỗ trợ kỹ thuật 3 tháng',
  ],
  '20-50': [
    'Website đa chức năng',
    'CMS quản lý nội dung',
    'SEO cơ bản',
    'Tích hợp Analytics',
    'Hỗ trợ kỹ thuật 6 tháng',
  ],
  'over-50': [
    'Giải pháp tùy chỉnh hoàn toàn',
    'Tích hợp AI & Automation',
    'Multi-platform support',
    'Dedicated Account Manager',
    'Hỗ trợ 24/7',
    'Training nhân viên',
  ],
};

export function BudgetSelector() {
  const { selectedBudget, setBudget, nextStep, prevStep } = useQuoteStore();

  const handleSelect = (id: BudgetRange) => {
    setBudget(id);
  };

  const handleContinue = () => {
    if (selectedBudget) {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Bước 2/4
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ngân sách dự kiến của bạn?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Giúp chúng tôi đề xuất các tính năng phù hợp với ngân sách của bạn
          </p>
        </motion.div>

        {/* Budget Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {budgetOptions.map((option, index) => {
            const isSelected = selectedBudget === option.id;
            const Icon = budgetIcons[option.id];
            const colors = budgetColors[option.id];
            const features = budgetFeatures[option.id];

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  variant={isSelected ? 'gradient' : 'default'}
                  className={cn(
                    'relative cursor-pointer p-6 h-full transition-all duration-300',
                    'hover:shadow-xl',
                    isSelected
                      ? `ring-2 ${colors.ring} shadow-lg ${colors.shadow}`
                      : 'hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                  onClick={() => handleSelect(option.id)}
                >
                  {/* Popular Badge for middle option */}
                  {option.id === '20-50' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold rounded-full shadow-lg">
                      Phổ biến nhất
                    </div>
                  )}

                  {/* Selected Check */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        'absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center',
                        `bg-gradient-to-br ${colors.gradient}`
                      )}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300',
                      isSelected
                        ? `bg-gradient-to-br ${colors.gradient} shadow-lg`
                        : colors.bg
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-7 h-7 transition-colors',
                        isSelected ? 'text-white' : colors.text
                      )}
                    />
                  </div>

                  {/* Price Range */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {option.labelVi}
                  </h3>
                  
                  {/* Price in numbers */}
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {option.maxPrice
                      ? `${formatCurrency(option.minPrice, false)} - ${formatCurrency(option.maxPrice, false)}`
                      : `Từ ${formatCurrency(option.minPrice, false)}`}
                  </p>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                    {option.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className={cn('w-4 h-4 mt-0.5 flex-shrink-0', colors.text)} />
                        <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8"
        >
          * Đây chỉ là mức ngân sách tham khảo. Báo giá cuối cùng sẽ phụ thuộc vào các tính năng bạn chọn.
        </motion.p>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between"
        >
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!selectedBudget}
            className="group"
          >
            Tiếp tục chọn tính năng
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
