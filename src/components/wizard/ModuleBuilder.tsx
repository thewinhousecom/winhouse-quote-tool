'use client';

// ============================================
// MODULE BUILDER COMPONENT
// ============================================

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuoteStore } from '@/lib/store/quote-store';
import { getModulesByIndustry, categoryLabels, getIndustryBySlug } from '@/lib/data/modules';
import { Button, Card, Badge } from '@/components/ui';
import { 
  DynamicIcon, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Check, 
  Trash2,
  Clock,
  Search,
  X
} from '@/components/icons';
import { cn, formatCurrency, formatMillions, formatEstimatedTime } from '@/lib/utils';
import type { Module, ModuleCategory } from '@/types';

// ============================================
// MODULE CARD COMPONENT
// ============================================
interface ModuleCardProps {
  module: Module;
  isSelected: boolean;
  onToggle: () => void;
}

function ModuleCard({ module, isSelected, onToggle }: ModuleCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="relative"
    >
      <Card
        variant={isSelected ? 'gradient' : 'default'}
        className={cn(
          'p-4 cursor-pointer transition-all duration-300 h-full',
          isSelected
            ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
            : 'hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
        )}
        onClick={onToggle}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-all',
              isSelected
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            )}
          >
            <DynamicIcon name={module.icon} className="w-5 h-5" />
          </div>
          
          {/* Toggle Button */}
          <button
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all',
              isSelected
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        <h4 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">
          {module.nameVi}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
          {module.descriptionVi}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {module.isPopular && (
            <Badge variant="premium" className="text-[10px] px-2 py-0.5">
              Phổ biến
            </Badge>
          )}
          {module.isRequired && (
            <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
              Bắt buộc
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {formatMillions(module.basePrice)}
            </div>
            {module.monthlyPrice > 0 && (
              <div className="text-[10px] text-slate-500">
                +{formatMillions(module.monthlyPrice)}/tháng
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Clock className="w-3 h-3" />
            {module.estimatedDays} ngày
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ============================================
// PRICE SUMMARY COMPONENT
// ============================================
function PriceSummary() {
  const { selectedModules, getCalculation } = useQuoteStore();
  const calculation = getCalculation();

  return (
    <Card variant="glass" className="p-6 sticky top-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Tóm tắt báo giá
      </h3>

      {/* Module Count */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <span className="text-slate-600 dark:text-slate-400">Số tính năng</span>
        <Badge variant="secondary">{calculation.moduleCount} modules</Badge>
      </div>

      {/* Subtotal */}
      <div className="space-y-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Phí triển khai</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {formatCurrency(calculation.subtotal)}
          </span>
        </div>
        {calculation.monthlyTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Phí duy trì/tháng</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {formatCurrency(calculation.monthlyTotal)}
            </span>
          </div>
        )}
      </div>

      {/* Discount */}
      {calculation.discount > 0 && (
        <div className="flex justify-between text-sm mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <span className="text-emerald-600 dark:text-emerald-400">
            Giảm giá ({calculation.discountPercent}%)
          </span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            -{formatCurrency(calculation.discount)}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="mb-4">
        <div className="flex justify-between items-end">
          <span className="text-slate-600 dark:text-slate-400">Tổng cộng</span>
          <div className="text-right">
            <motion.span
              key={calculation.total}
              initial={{ scale: 1.2, color: '#3b82f6' }}
              animate={{ scale: 1, color: 'inherit' }}
              className="text-2xl font-bold text-slate-900 dark:text-white block"
            >
              {formatCurrency(calculation.total)}
            </motion.span>
            <span className="text-xs text-slate-500">Chưa bao gồm VAT</span>
          </div>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Clock className="w-4 h-4" />
          Thời gian dự kiến
        </div>
        <span className="font-semibold text-slate-900 dark:text-white">
          {formatEstimatedTime(calculation.estimatedDays)}
        </span>
      </div>

      {/* Discount Info */}
      {calculation.moduleCount >= 3 && calculation.moduleCount < 5 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xs text-center text-amber-600 dark:text-amber-400"
        >
          💡 Thêm {5 - calculation.moduleCount} module nữa để được giảm 5%!
        </motion.p>
      )}
    </Card>
  );
}

// ============================================
// SELECTED MODULES LIST
// ============================================
function SelectedModulesList() {
  const { selectedModules, removeModule } = useQuoteStore();

  if (selectedModules.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        <p className="text-sm">Chưa có module nào được chọn</p>
        <p className="text-xs mt-1">Nhấp vào các module bên trái để thêm</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {selectedModules.map((module) => (
          <motion.div
            key={module.id}
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="w-8 h-8 rounded-md bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
              <DynamicIcon name={module.icon} className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {module.nameVi}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {formatMillions(module.basePrice)}
              </p>
            </div>
            <button
              onClick={() => removeModule(module.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN MODULE BUILDER
// ============================================
export function ModuleBuilder() {
  const { 
    selectedIndustry, 
    selectedModules, 
    addModule, 
    removeModule, 
    isModuleSelected,
    nextStep, 
    prevStep 
  } = useQuoteStore();

  const [activeCategory, setActiveCategory] = useState<ModuleCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get modules for selected industry
  const availableModules = useMemo(() => {
    if (!selectedIndustry) return [];
    return getModulesByIndustry(selectedIndustry);
  }, [selectedIndustry]);

  // Get industry info
  const industry = selectedIndustry ? getIndustryBySlug(selectedIndustry) : null;

  // Filter modules
  const filteredModules = useMemo(() => {
    let result = availableModules;

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(m => m.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        m =>
          m.nameVi.toLowerCase().includes(query) ||
          m.descriptionVi.toLowerCase().includes(query)
      );
    }

    return result;
  }, [availableModules, activeCategory, searchQuery]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(availableModules.map(m => m.category))];
    return cats;
  }, [availableModules]);

  const handleToggleModule = (module: Module) => {
    if (isModuleSelected(module.id)) {
      removeModule(module.id);
    } else {
      addModule(module);
    }
  };

  const handleContinue = () => {
    if (selectedModules.length > 0) {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-3 py-1 rounded-full text-xs font-medium mb-2">
                Bước 3/4
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Chọn tính năng cho website
              </h1>
              {industry && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Ngành: <span className="font-medium">{industry.nameVi}</span>
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500">Đã chọn</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedModules.length} modules
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Module List */}
          <div className="flex-1">
            {/* Search & Filters */}
            <div className="mb-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tính năng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    activeCategory === 'all'
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  )}
                >
                  Tất cả ({availableModules.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      activeCategory === cat
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    )}
                  >
                    {categoryLabels[cat]?.vi || cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredModules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    isSelected={isModuleSelected(module.id)}
                    onToggle={() => handleToggleModule(module)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {filteredModules.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
                  Không tìm thấy module phù hợp
                </p>
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Selected Modules */}
            <Card variant="default" className="p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                <span>Đã chọn</span>
                <Badge variant="secondary">{selectedModules.length}</Badge>
              </h3>
              <SelectedModulesList />
            </Card>

            {/* Price Summary */}
            <PriceSummary />
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <Button
            onClick={handleContinue}
            disabled={selectedModules.length === 0}
            className="group"
          >
            Tiếp tục
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
