// ============================================
// PDF GENERATION API ROUTE
// ============================================

import { NextRequest, NextResponse } from 'next/server';

interface PDFRequest {
  quoteNumber: string;
  industry: string;
  lead: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  modules: Array<{
    nameVi: string;
    descriptionVi: string;
    basePrice: number;
    monthlyPrice: number;
    estimatedDays: number;
  }>;
  calculation: {
    subtotal: number;
    monthlyTotal: number;
    discount: number;
    discountPercent: number;
    total: number;
    estimatedDays: number;
    moduleCount: number;
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export async function POST(request: NextRequest) {
  try {
    const body: PDFRequest = await request.json();
    const { quoteNumber, industry, lead, modules, calculation } = body;

    // Generate simple HTML-based PDF content
    // In production, you would use a proper PDF library like @react-pdf/renderer or puppeteer
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Báo giá ${quoteNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif; 
      color: #1e293b;
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3b82f6;
    }
    .logo { 
      font-size: 28px; 
      font-weight: 700; 
      color: #3b82f6;
    }
    .logo span { color: #1e293b; }
    .quote-info { text-align: right; }
    .quote-number { 
      font-size: 24px; 
      font-weight: 600;
      color: #1e293b;
    }
    .quote-date { 
      color: #64748b; 
      font-size: 14px;
      margin-top: 5px;
    }
    .section { margin-bottom: 30px; }
    .section-title { 
      font-size: 18px; 
      font-weight: 600; 
      color: #1e293b;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    .client-info { 
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
    }
    .client-info p { margin: 5px 0; }
    .client-info strong { color: #3b82f6; }
    table { 
      width: 100%; 
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td { 
      padding: 12px 15px; 
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th { 
      background: #f1f5f9;
      font-weight: 600;
      color: #475569;
      font-size: 13px;
      text-transform: uppercase;
    }
    td { font-size: 14px; }
    .price { text-align: right; font-weight: 500; }
    .module-name { font-weight: 500; color: #1e293b; }
    .module-desc { 
      font-size: 12px; 
      color: #64748b;
      margin-top: 3px;
    }
    .summary { 
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      color: white;
      padding: 25px;
      border-radius: 12px;
      margin-top: 30px;
    }
    .summary-row { 
      display: flex; 
      justify-content: space-between;
      padding: 8px 0;
      font-size: 15px;
    }
    .summary-row.total { 
      font-size: 22px;
      font-weight: 700;
      padding-top: 15px;
      margin-top: 10px;
      border-top: 1px solid rgba(255,255,255,0.3);
    }
    .discount { color: #86efac; }
    .footer { 
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 13px;
      color: #64748b;
    }
    .footer-grid { 
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
    .footer-section h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 10px;
    }
    .validity {
      background: #fef3c7;
      color: #92400e;
      padding: 12px 20px;
      border-radius: 8px;
      text-align: center;
      margin-top: 20px;
      font-weight: 500;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Win<span>house</span></div>
      <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Thiết kế website chuyên nghiệp</p>
    </div>
    <div class="quote-info">
      <div class="quote-number">BÁO GIÁ #${quoteNumber}</div>
      <div class="quote-date">Ngày: ${formatDate(new Date())}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Thông tin khách hàng</div>
    <div class="client-info">
      <p><strong>Tên:</strong> ${lead.name}</p>
      ${lead.company ? `<p><strong>Công ty:</strong> ${lead.company}</p>` : ''}
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Điện thoại:</strong> ${lead.phone}</p>
      <p><strong>Ngành nghề:</strong> ${industry}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Chi tiết dịch vụ</div>
    <table>
      <thead>
        <tr>
          <th style="width: 50%">Tính năng</th>
          <th>Thời gian</th>
          <th class="price">Triển khai</th>
          <th class="price">Duy trì/tháng</th>
        </tr>
      </thead>
      <tbody>
        ${modules.map(m => `
          <tr>
            <td>
              <div class="module-name">${m.nameVi}</div>
              <div class="module-desc">${m.descriptionVi}</div>
            </td>
            <td>${m.estimatedDays} ngày</td>
            <td class="price">${formatCurrency(m.basePrice)}</td>
            <td class="price">${m.monthlyPrice > 0 ? formatCurrency(m.monthlyPrice) : '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="summary">
    <div class="summary-row">
      <span>Phí triển khai (${calculation.moduleCount} tính năng):</span>
      <span>${formatCurrency(calculation.subtotal)}</span>
    </div>
    ${calculation.discount > 0 ? `
    <div class="summary-row discount">
      <span>Giảm giá (${calculation.discountPercent}%):</span>
      <span>-${formatCurrency(calculation.discount)}</span>
    </div>
    ` : ''}
    ${calculation.monthlyTotal > 0 ? `
    <div class="summary-row">
      <span>Phí duy trì hàng tháng:</span>
      <span>${formatCurrency(calculation.monthlyTotal)}</span>
    </div>
    ` : ''}
    <div class="summary-row total">
      <span>TỔNG CỘNG:</span>
      <span>${formatCurrency(calculation.total)}</span>
    </div>
  </div>

  <div class="validity">
    ⏰ Báo giá có hiệu lực đến: ${formatDate(validUntil)}
  </div>

  <div class="footer">
    <div class="footer-grid">
      <div class="footer-section">
        <h4>Điều khoản thanh toán</h4>
        <p>• Đặt cọc 50% khi ký hợp đồng</p>
        <p>• 50% còn lại khi nghiệm thu</p>
        <p>• Chưa bao gồm VAT 10%</p>
      </div>
      <div class="footer-section">
        <h4>Liên hệ Winhouse</h4>
        <p>📞 Hotline: 0901 234 567</p>
        <p>📧 Email: contact@thewinhouse.com</p>
        <p>🌐 Web: thewinhouse.com</p>
      </div>
    </div>
    <p style="margin-top: 20px; text-align: center;">
      Cảm ơn Quý khách đã tin tưởng Winhouse! 🙏
    </p>
  </div>
</body>
</html>
    `;

    // Return HTML for now (in production, convert to PDF using puppeteer or similar)
    // For MVP, we'll return an HTML that can be printed to PDF
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="Bao-gia-Winhouse-${quoteNumber}.html"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
