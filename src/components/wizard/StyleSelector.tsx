'use client';

// ============================================
// STYLE SELECTOR COMPONENT
// ============================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useQuoteStore } from '@/lib/store/quote-store';
import { websiteStyles, getRecommendedStyles, getOtherStyles, type WebsiteStyle } from '@/lib/data/styles';
import { Button, Card, Badge } from '@/components/ui';
import { 
  DynamicIcon, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles,
  Crown,
  Minus,
  Palette,
  Cpu,
  Building2,
  Leaf
} from '@/components/icons';
import { cn } from '@/lib/utils';

// Icon mapping for styles
const styleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Minus,
  Crown,
  Palette,
  Cpu,
  Building2,
  Leaf,
};

interface StyleCardProps {
  style: typeof websiteStyles[0];
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
  index: number;
}

function StyleCard({ style, isSelected, isRecommended, onSelect, index }: StyleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const IconComponent = styleIcons[style.icon] || Palette;

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.5,
          delay: index * 0.1,
          ease: 'power3.out'
        }
      );
    }
  }, [index]);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Card
        variant={isSelected ? 'gradient' : 'default'}
        className={cn(
          'p-5 cursor-pointer transition-all duration-300 h-full hover-lift card-glow',
          isSelected
            ? 'ring-2 ring-[#4464AA] shadow-lg shadow-[#4464AA]/20'
            : 'hover:border-[#4464AA]/30'
        )}
        onClick={onSelect}
      >
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge variant="premium" className="text-[10px] px-2 py-1 flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
              Đề xuất
            </Badge>
          </div>
        )}

        {/* Selected Check */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-3 w-6 h-6 bg-[#4464AA] rounded-full flex items-center justify-center shadow-lg"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* Color Preview */}
        <div className="flex gap-1 mb-4">
          {style.colors.map((color, i) => (
            <div
              key={i}
              className="h-8 flex-1 rounded-md first:rounded-l-lg last:rounded-r-lg shadow-inner"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
              `bg-gradient-to-br ${style.gradient}`,
              'shadow-lg'
            )}
          >
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              {style.nameVi}
            </h4>
            <p className="text-xs text-slate-500">{style.name}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {style.descriptionVi}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {style.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

export function StyleSelector() {
  const { 
    selectedIndustry, 
    selectedStyle, 
    setStyle, 
    nextStep, 
    prevStep 
  } = useQuoteStore();
  
  const headerRef = useRef<HTMLDivElement>(null);
  const [showAllStyles, setShowAllStyles] = useState(false);

  // Get recommended and other styles
  const recommendedStyles = selectedIndustry ? getRecommendedStyles(selectedIndustry) : [];
  const otherStyles = selectedIndustry ? getOtherStyles(selectedIndustry) : websiteStyles;

  useEffect(() => {
    // GSAP animation for header
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const handleSelect = (styleId: WebsiteStyle) => {
    setStyle(styleId);
  };

  const handleContinue = () => {
    if (selectedStyle) {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#D59BC0]/20 text-[#4464AA] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Palette className="w-4 h-4" />
            Bước 4/5
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Chọn phong cách thiết kế
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Phong cách website sẽ quyết định ấn tượng đầu tiên với khách hàng của bạn
          </p>
        </div>

        {/* Recommended Styles */}
        {recommendedStyles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#E07038]" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Đề xuất cho ngành của bạn
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedStyles.map((style, index) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  isSelected={selectedStyle === style.id}
                  isRecommended={true}
                  onSelect={() => handleSelect(style.id)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Styles */}
        <div>
          <button
            onClick={() => setShowAllStyles(!showAllStyles)}
            className="flex items-center gap-2 text-sm text-[#4464AA] hover:text-[#4464AA]/80 font-medium mb-4 transition-colors"
          >
            {showAllStyles ? 'Ẩn bớt' : 'Xem thêm phong cách khác'}
            <ArrowRight className={cn(
              'w-4 h-4 transition-transform',
              showAllStyles && 'rotate-90'
            )} />
          </button>

          <AnimatePresence>
            {showAllStyles && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden"
              >
                {otherStyles.map((style, index) => (
                  <StyleCard
                    key={style.id}
                    style={style}
                    isSelected={selectedStyle === style.id}
                    isRecommended={false}
                    onSelect={() => handleSelect(style.id)}
                    index={index + recommendedStyles.length}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected Style Preview */}
        {selectedStyle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-r from-[#4464AA]/5 to-[#E07038]/5 rounded-2xl border border-[#4464AA]/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#4464AA] rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Bạn đã chọn</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  Phong cách {websiteStyles.find(s => s.id === selectedStyle)?.nameVi}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mt-10"
        >
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!selectedStyle}
            className="group bg-[#4464AA] hover:bg-[#4464AA]/90"
          >
            Tiếp tục
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
