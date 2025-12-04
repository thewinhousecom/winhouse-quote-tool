'use client';

// ============================================
// RESULT SCREEN COMPONENT
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuoteStore } from '@/lib/store/quote-store';
import { getIndustryBySlug } from '@/lib/data/modules';
import { Button, Card, Badge } from '@/components/ui';
import {
  Download,
  Copy,
  CheckCircle,
  Mail,
  Sparkles,
  Loader2,
  RefreshCw,
  ExternalLink,
  Phone,
  ArrowRight,
} from '@/components/icons';
import { cn, formatCurrency, formatEstimatedTime, copyToClipboard, generateQuoteNumber } from '@/lib/utils';

// ============================================
// EMAIL TEMPLATE CARD
// ============================================
interface EmailTemplateProps {
  title: string;
  subject: string;
  body: string;
  type: 'introduction' | 'follow-up' | 'closing';
}

function EmailTemplateCard({ title, subject, body, type }: EmailTemplateProps) {
  const [copied, setCopied] = useState<'subject' | 'body' | null>(null);

  const handleCopy = async (text: string, field: 'subject' | 'body') => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const typeColors = {
    introduction: 'from-blue-500 to-indigo-500',
    'follow-up': 'from-amber-500 to-orange-500',
    closing: 'from-emerald-500 to-teal-500',
  };

  return (
    <Card variant="default" className="p-5 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br', typeColors[type])}>
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
          <Badge variant="secondary" className="text-[10px] mt-1">
            {type === 'introduction' ? 'Giới thiệu' : type === 'follow-up' ? 'Theo dõi' : 'Chốt deal'}
          </Badge>
        </div>
      </div>

      {/* Subject */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500">Tiêu đề email:</span>
          <button
            onClick={() => handleCopy(subject, 'subject')}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {copied === 'subject' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied === 'subject' ? 'Đã sao chép' : 'Sao chép'}
          </button>
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
          {subject}
        </p>
      </div>

      {/* Body */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500">Nội dung:</span>
          <button
            onClick={() => handleCopy(body, 'body')}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {copied === 'body' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied === 'body' ? 'Đã sao chép' : 'Sao chép'}
          </button>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg max-h-48 overflow-y-auto whitespace-pre-wrap">
          {body}
        </div>
      </div>
    </Card>
  );
}

// ============================================
// MAIN RESULT SCREEN
// ============================================
export function ResultScreen() {
  const { lead, selectedModules, getCalculation, selectedIndustry, reset } = useQuoteStore();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiEmails, setAiEmails] = useState<EmailTemplateProps[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [quoteNumber] = useState(() => generateQuoteNumber());

  const calculation = getCalculation();
  const industry = selectedIndustry ? getIndustryBySlug(selectedIndustry) : null;

  // Generate AI emails on mount
  useEffect(() => {
    generateAIEmails();
  }, []);

  const generateAIEmails = async () => {
    setIsGeneratingAI(true);
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industryName: industry?.nameVi || 'Doanh nghiệp',
          modules: selectedModules.map(m => ({ name: m.nameVi, description: m.descriptionVi })),
          totalAmount: calculation.total,
          leadName: lead?.name || 'Quý khách',
          companyName: lead?.company,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.emails) {
        setAiEmails(data.emails);
      } else {
        // Fallback emails
        setAiEmails(getDefaultEmails());
      }
    } catch (error) {
      console.error('Error generating AI emails:', error);
      setAiEmails(getDefaultEmails());
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getDefaultEmails = (): EmailTemplateProps[] => [
    {
      title: 'Email giới thiệu',
      type: 'introduction',
      subject: `[Winhouse] Báo giá website ${industry?.nameVi || ''} - ${quoteNumber}`,
      body: `Kính gửi ${lead?.name || 'Quý khách'},

Cảm ơn Quý khách đã quan tâm đến dịch vụ thiết kế website của Winhouse.

Dựa trên yêu cầu của Quý khách, chúng tôi xin gửi báo giá như sau:
- Ngành nghề: ${industry?.nameVi || 'Không xác định'}
- Số tính năng: ${selectedModules.length} modules
- Tổng chi phí triển khai: ${formatCurrency(calculation.total)}
${calculation.monthlyTotal > 0 ? `- Phí duy trì hàng tháng: ${formatCurrency(calculation.monthlyTotal)}` : ''}
- Thời gian thực hiện: ${formatEstimatedTime(calculation.estimatedDays)}

Vui lòng xem file báo giá đính kèm để biết thêm chi tiết.

Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi.

Trân trọng,
Đội ngũ Winhouse`,
    },
    {
      title: 'Email theo dõi',
      type: 'follow-up',
      subject: `[Theo dõi] Báo giá website ${quoteNumber}`,
      body: `Kính gửi ${lead?.name || 'Quý khách'},

Tôi muốn theo dõi về báo giá website mà chúng tôi đã gửi trước đó.

Quý khách có thắc mắc gì về các tính năng hoặc mức giá không? Tôi rất sẵn lòng giải đáp và tư vấn thêm.

Một số điểm nổi bật trong gói dịch vụ của chúng tôi:
${selectedModules.slice(0, 3).map(m => `• ${m.nameVi}`).join('\n')}

Nếu Quý khách cần điều chỉnh bất kỳ tính năng nào, chúng tôi hoàn toàn có thể tùy chỉnh theo yêu cầu.

Trân trọng,
Đội ngũ Winhouse`,
    },
    {
      title: 'Email chốt deal',
      type: 'closing',
      subject: `[Ưu đãi đặc biệt] Giảm 10% cho báo giá ${quoteNumber}`,
      body: `Kính gửi ${lead?.name || 'Quý khách'},

Để cảm ơn sự quan tâm của Quý khách, Winhouse xin gửi tặng ưu đãi đặc biệt:

🎁 GIẢM 10% tổng chi phí triển khai khi ký hợp đồng trong tuần này!

Chi phí sau ưu đãi: ${formatCurrency(calculation.total * 0.9)}
(Tiết kiệm: ${formatCurrency(calculation.total * 0.1)})

Ưu đãi có hiệu lực đến hết ngày [Ngày cụ thể].

Để đăng ký hoặc tìm hiểu thêm, Quý khách có thể:
📞 Gọi: 0899 789 799
📧 Email: info@thewinhouse.com
💬 Đặt lịch tư vấn: https://thewinhouse.com/booking

Trân trọng,
Đội ngũ Winhouse`,
    },
  ];

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteNumber,
          industry: industry?.nameVi,
          lead,
          modules: selectedModules,
          calculation,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Bao-gia-Winhouse-${quoteNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStartOver = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Báo giá đã sẵn sàng! 🎉
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Cảm ơn <span className="font-semibold">{lead?.name}</span>! 
            Dưới đây là báo giá và các mẫu email tư vấn được tạo bởi AI.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Quote Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="gradient" className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Báo giá #{quoteNumber}
                </h3>
                <Badge variant="success">Đã tạo</Badge>
              </div>

              {/* Industry */}
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 mb-1">Ngành nghề</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {industry?.nameVi || 'Không xác định'}
                </p>
              </div>

              {/* Modules */}
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 mb-2">Tính năng ({calculation.moduleCount})</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedModules.map((module) => (
                    <div key={module.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400 truncate">
                        {module.nameVi}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Phí triển khai</span>
                  <span className="font-medium">{formatCurrency(calculation.subtotal)}</span>
                </div>
                {calculation.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Giảm giá ({calculation.discountPercent}%)</span>
                    <span>-{formatCurrency(calculation.discount)}</span>
                  </div>
                )}
                {calculation.monthlyTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Phí duy trì/tháng</span>
                    <span className="font-medium">{formatCurrency(calculation.monthlyTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(calculation.total)}
                  </span>
                </div>
              </div>

              {/* Download Button */}
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full"
                variant="success"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tạo PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Tải báo giá PDF
                  </>
                )}
              </Button>
            </Card>
          </motion.div>

          {/* AI Generated Emails */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Email tư vấn AI
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateAIEmails}
                disabled={isGeneratingAI}
              >
                <RefreshCw className={cn('w-4 h-4 mr-1', isGeneratingAI && 'animate-spin')} />
                Tạo lại
              </Button>
            </div>

            {isGeneratingAI ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Đang tạo email bằng AI...
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiEmails.map((email, index) => (
                  <motion.div
                    key={email.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <EmailTemplateCard {...email} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card variant="glass" className="p-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Cần tư vấn thêm?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
              Đội ngũ Winhouse luôn sẵn sàng hỗ trợ bạn. Đặt lịch tư vấn miễn phí 30 phút ngay hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="default" size="lg" className="group">
                <Phone className="w-4 h-4 mr-2" />
                Gọi: 0899 789 799
              </Button>
              <Button variant="outline" size="lg">
                <a href="https://zalo.me/0899789799" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Đặt lịch tư vấn
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>

            {/* Start Over */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleStartOver}
                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Tạo báo giá mới
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
