'use client';

// ============================================
// INDUSTRY SELECTOR COMPONENT
// ============================================

import { motion } from 'framer-motion';
import { useQuoteStore } from '@/lib/store/quote-store';
import { industries } from '@/lib/data/modules';
import { Button, Card } from '@/components/ui';
import { DynamicIcon, ArrowLeft, ArrowRight, Check } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { IndustrySlug } from '@/types';

export function IndustrySelector() {
  const { selectedIndustry, setIndustry, nextStep, prevStep } = useQuoteStore();

  const handleSelect = (slug: IndustrySlug) => {
    setIndustry(slug);
  };

  const handleContinue = () => {
    if (selectedIndustry) {
      nextStep();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Bước 1/4
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Bạn đang kinh doanh trong lĩnh vực nào?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Chọn ngành nghề để chúng tôi gợi ý các tính năng phù hợp nhất cho website của bạn
          </p>
        </motion.div>

        {/* Industry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10"
        >
          {industries.map((industry) => {
            const isSelected = selectedIndustry === industry.slug;
            
            return (
              <motion.div
                key={industry.slug}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  variant={isSelected ? 'gradient' : 'default'}
                  className={cn(
                    'relative cursor-pointer p-6 h-full transition-all duration-300',
                    'hover:shadow-xl',
                    isSelected
                      ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                      : 'hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                  onClick={() => handleSelect(industry.slug)}
                >
                  {/* Selected Check */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300',
                      isSelected
                        ? `bg-gradient-to-br ${industry.gradient} shadow-lg`
                        : 'bg-slate-100 dark:bg-slate-800'
                    )}
                  >
                    <DynamicIcon
                      name={industry.icon}
                      className={cn(
                        'w-7 h-7 transition-colors',
                        isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                      )}
                    />
                  </div>

                  {/* Content */}
                  <h3
                    className={cn(
                      'text-lg font-semibold mb-2 transition-colors',
                      isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                    )}
                  >
                    {industry.nameVi}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {industry.description}
                  </p>

                  {/* Hover Gradient */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
                      `bg-gradient-to-br ${industry.gradient}`,
                      !isSelected && 'group-hover:opacity-5'
                    )}
                  />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

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
            disabled={!selectedIndustry}
            className="group"
          >
            Tiếp tục
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
