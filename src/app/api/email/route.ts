// ============================================
// EMAIL API ROUTE (SMTP)
// ============================================

import { NextRequest, NextResponse } from 'next/server';

// Company Info
const COMPANY = {
  name: 'CÔNG TY TNHH WIN HOUSE',
  hotline: '0899 789 799',
  email: 'info@thewinhouse.com',
  website: 'thewinhouse.com',
  address: '380/17 Nam Kỳ Khởi Nghĩa, Phường Xuân Hòa, TP Hồ Chí Minh, Việt Nam',
  taxId: '0315125475',
};

// Brand Colors
const COLORS = {
  blue: '#4464AA',
  green: '#1D6F41',
  yellow: '#FDDE4B',
  tangerine: '#E07038',
  cyanellow: '#ADBBDD',
  notred: '#D59BC0',
};

interface EmailRequest {
  type: 'lead_notification' | 'quote_sent' | 'welcome';
  to?: string;
  data: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    industry?: string;
    budget?: string;
    style?: string;
    modules?: string[];
    totalAmount?: number;
    monthlyAmount?: number;
    estimatedDays?: number;
    quoteNumber?: string;
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

function generateEmailHTML(data: EmailRequest['data']): string {
  const modulesList = data.modules?.map(m => `<li style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${m}</li>`).join('') || '';
  
  return `
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead - Winhouse Quote Tool</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0f4f8; padding: 40px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(68, 100, 170, 0.1);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, ${COLORS.blue} 0%, #6B8DD6 100%);">
              <div style="color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: -1px;">Winhouse<span style="color: ${COLORS.tangerine};">.</span></div>
              <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 8px;">Quote Tool - New Lead Notification</div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Greeting -->
              <div style="color: #2d3748; font-size: 20px; font-weight: 700; margin-bottom: 10px;">
                🎉 Lead mới từ Quote Tool!
              </div>
              <div style="color: #718096; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Khách hàng <strong style="color: ${COLORS.blue};">${data.name}</strong> vừa hoàn thành wizard và gửi yêu cầu báo giá.
              </div>

              <!-- Customer Info Card -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid ${COLORS.blue};">
                <div style="color: ${COLORS.blue}; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 15px;">
                  THÔNG TIN KHÁCH HÀNG
                </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="35%" style="color: #718096; font-size: 14px; padding: 8px 0;">Họ và tên:</td>
                    <td style="color: #2d3748; font-size: 15px; font-weight: 600; padding: 8px 0;">${data.name}</td>
                  </tr>
                  <tr>
                    <td style="color: #718096; font-size: 14px; padding: 8px 0;">Email:</td>
                    <td style="padding: 8px 0;">
                      <a href="mailto:${data.email}" style="color: ${COLORS.blue}; font-size: 15px; font-weight: 600; text-decoration: none;">${data.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #718096; font-size: 14px; padding: 8px 0;">Điện thoại:</td>
                    <td style="padding: 8px 0;">
                      <a href="tel:${data.phone}" style="color: ${COLORS.green}; font-size: 15px; font-weight: 600; text-decoration: none;">${data.phone}</a>
                    </td>
                  </tr>
                  ${data.company ? `
                  <tr>
                    <td style="color: #718096; font-size: 14px; padding: 8px 0;">Công ty:</td>
                    <td style="color: #2d3748; font-size: 15px; font-weight: 600; padding: 8px 0;">${data.company}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Project Overview -->
              <div style="margin-bottom: 25px;">
                <div style="color: ${COLORS.blue}; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 15px;">
                  TỔNG QUAN DỰ ÁN
                </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                  <tr>
                    <td style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 50%; background: #ffffff;">
                      <div style="color: #718096; font-size: 12px;">Ngành nghề</div>
                      <div style="color: #2d3748; font-weight: 700; font-size: 16px; margin-top: 4px;">${data.industry || '---'}</div>
                    </td>
                    <td style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0; width: 50%; background: #ffffff;">
                      <div style="color: #718096; font-size: 12px;">Ngân sách</div>
                      <div style="color: #2d3748; font-weight: 700; font-size: 16px; margin-top: 4px;">${data.budget || '---'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 20px; border-right: 1px solid #e2e8f0; background: #ffffff;">
                      <div style="color: #718096; font-size: 12px;">Phong cách</div>
                      <div style="color: #2d3748; font-weight: 700; font-size: 16px; margin-top: 4px;">${data.style || '---'}</div>
                    </td>
                    <td style="padding: 15px 20px; background: #ffffff;">
                      <div style="color: #718096; font-size: 12px;">Thời gian dự kiến</div>
                      <div style="color: #2d3748; font-weight: 700; font-size: 16px; margin-top: 4px;">${data.estimatedDays ? `${data.estimatedDays} ngày` : '---'}</div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Selected Modules -->
              ${data.modules && data.modules.length > 0 ? `
              <div style="margin-bottom: 25px;">
                <div style="color: ${COLORS.blue}; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 15px;">
                  TÍNH NĂNG ĐÃ CHỌN (${data.modules.length})
                </div>
                <div style="background-color: #fff9f5; border: 1px dashed ${COLORS.tangerine}; border-radius: 12px; padding: 20px;">
                  <ul style="margin: 0; padding-left: 20px; color: #2d3748; font-size: 14px; line-height: 1.8;">
                    ${modulesList}
                  </ul>
                </div>
              </div>
              ` : ''}

              <!-- Price Summary -->
              <div style="background: linear-gradient(135deg, ${COLORS.blue} 0%, #6B8DD6 100%); border-radius: 12px; padding: 25px; color: white; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                  <span style="font-size: 14px; opacity: 0.9;">Tổng phí triển khai:</span>
                  <span style="font-size: 18px; font-weight: 700;">${data.totalAmount ? formatCurrency(data.totalAmount) : '---'}</span>
                </div>
                ${data.monthlyAmount && data.monthlyAmount > 0 ? `
                <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                  <span style="font-size: 14px; opacity: 0.9;">Phí duy trì/tháng:</span>
                  <span style="font-size: 16px; font-weight: 600;">${formatCurrency(data.monthlyAmount)}</span>
                </div>
                ` : ''}
              </div>

              <!-- CTA -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="tel:${data.phone}" style="display: inline-block; background: ${COLORS.green}; color: white; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
                      📞 Gọi ngay: ${data.phone}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Tagline -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <div style="color: ${COLORS.tangerine}; font-weight: 700; font-size: 18px;">Winhouse – Kết nối tạo dấu ấn</div>
                    <div style="color: #a0aec0; font-size: 13px; margin-top: 5px;">Hệ thống thông báo tự động từ Quote Tool</div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f8fafc; padding: 30px; border-top: 1px solid #edf2f7; color: #718096; font-size: 13px; line-height: 1.8;">
              <strong style="color: ${COLORS.blue}; font-size: 14px;">${COMPANY.name}</strong><br>
              ${COMPANY.address}<br>
              MST: ${COMPANY.taxId}<br>
              Hotline/Zalo: <a href="tel:${COMPANY.hotline}" style="color: ${COLORS.blue}; text-decoration: none;">${COMPANY.hotline}</a> | 
              <a href="mailto:${COMPANY.email}" style="color: ${COLORS.blue}; text-decoration: none;">${COMPANY.email}</a><br>
              <a href="https://${COMPANY.website}" style="color: ${COLORS.blue}; text-decoration: none; font-weight: 600;">${COMPANY.website}</a>
              <br><br>
              <span style="color: #a0aec0;">&copy; ${new Date().getFullYear()} Winhouse. All rights reserved.</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();
    const { type, to, data } = body;

    // Generate HTML
    const htmlContent = generateEmailHTML(data);

    // For now, we'll use the webhook to send email data
    // In production, integrate with SMTP service like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - Mailgun
    // - Amazon SES

    // Check for SMTP configuration
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      // Dynamic import nodemailer only when needed
      try {
        const nodemailer = await import('nodemailer');
        
        const transporter = nodemailer.default.createTransport({
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT || '587'),
          secure: SMTP_PORT === '465',
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        const mailOptions = {
          from: `"Winhouse Quote Tool" <${SMTP_USER}>`,
          to: to || COMPANY.email,
          subject: `[Quote Tool] Lead mới: ${data.name} - ${data.industry || 'Chưa xác định'}`,
          html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully to:', to || COMPANY.email);
      } catch (smtpError) {
        console.error('SMTP Error:', smtpError);
        // Continue without failing - email is optional
      }
    } else {
      console.log('SMTP not configured. Email content generated but not sent.');
      console.log('To email:', to || COMPANY.email);
    }

    // Return the HTML for preview/logging
    return NextResponse.json({
      success: true,
      message: 'Email processed',
      preview: htmlContent,
    });

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process email' },
      { status: 500 }
    );
  }
}

// GET endpoint to preview email template
export async function GET(request: NextRequest) {
  const sampleData = {
    name: 'Nguyễn Văn A',
    email: 'test@example.com',
    phone: '0899 789 799',
    company: 'Công ty ABC',
    industry: 'Bất động sản',
    budget: '20 - 50 triệu',
    style: 'Sang trọng',
    modules: ['Landing Page', 'CMS', 'SEO Optimization', 'Live Chat'],
    totalAmount: 35000000,
    monthlyAmount: 1200000,
    estimatedDays: 21,
    quoteNumber: 'WH2412-DEMO',
  };

  const html = generateEmailHTML(sampleData);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
