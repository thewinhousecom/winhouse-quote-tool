// ============================================
// AI EMAIL GENERATION API ROUTE
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface GenerationRequest {
  industryName: string;
  modules: { name: string; description: string }[];
  totalAmount: number;
  leadName: string;
  companyName?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { industryName, modules, totalAmount, leadName, companyName } = body;

    // If no OpenAI key, return default templates
    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        success: true,
        emails: getDefaultEmails(industryName, modules, totalAmount, leadName, companyName),
      });
    }

    // Prepare the prompt
    const modulesList = modules.map(m => `- ${m.name}: ${m.description}`).join('\n');
    
    const systemPrompt = `Bạn là một chuyên gia tư vấn bán hàng website chuyên nghiệp tại Việt Nam. 
Nhiệm vụ của bạn là tạo 3 mẫu email tiếng Việt chuyên nghiệp, thuyết phục và cá nhân hóa.
Sử dụng ngôn ngữ lịch sự, chuyên nghiệp phù hợp với văn hóa kinh doanh Việt Nam.
Mỗi email nên có độ dài vừa phải, không quá dài.`;

    const userPrompt = `Tạo 3 mẫu email tiếng Việt cho khách hàng với thông tin sau:

Tên khách hàng: ${leadName}
${companyName ? `Công ty: ${companyName}` : ''}
Ngành nghề: ${industryName}
Tổng chi phí: ${formatCurrency(totalAmount)}

Các tính năng đã chọn:
${modulesList}

Yêu cầu:
1. Email giới thiệu (introduction): Gửi kèm báo giá, giới thiệu dịch vụ
2. Email theo dõi (follow-up): Theo dõi sau 2-3 ngày, hỏi thăm và giải đáp thắc mắc
3. Email chốt deal (closing): Đưa ra ưu đãi đặc biệt để thúc đẩy quyết định

Trả về dưới dạng JSON với cấu trúc:
{
  "emails": [
    {
      "title": "Tên email",
      "type": "introduction|follow-up|closing",
      "subject": "Tiêu đề email",
      "body": "Nội dung email"
    }
  ]
}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error:', errorData);
        throw new Error('OpenAI API request failed');
      }

      const aiResponse = await response.json();
      const content = aiResponse.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content in AI response');
      }

      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from AI response');
      }

      const parsedContent = JSON.parse(jsonMatch[0]);

      return NextResponse.json({
        success: true,
        emails: parsedContent.emails,
      });
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      // Fallback to default emails
      return NextResponse.json({
        success: true,
        emails: getDefaultEmails(industryName, modules, totalAmount, leadName, companyName),
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getDefaultEmails(
  industryName: string,
  modules: { name: string; description: string }[],
  totalAmount: number,
  leadName: string,
  companyName?: string
) {
  const modulesList = modules.slice(0, 5).map(m => `• ${m.name}`).join('\n');
  
  return [
    {
      title: 'Email giới thiệu',
      type: 'introduction' as const,
      subject: `[Winhouse] Báo giá website ${industryName} dành riêng cho ${companyName || 'Quý khách'}`,
      body: `Kính gửi ${leadName},

Cảm ơn Quý khách đã quan tâm đến dịch vụ thiết kế website của Winhouse.

Dựa trên yêu cầu của Quý khách trong lĩnh vực ${industryName}, chúng tôi đã chuẩn bị một giải pháp website chuyên nghiệp với các tính năng:

${modulesList}

Tổng chi phí triển khai: ${formatCurrency(totalAmount)}

Báo giá chi tiết đã được đính kèm trong email này. Nếu Quý khách có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi.

Trân trọng,
Đội ngũ Winhouse
📞 Hotline: 0901 234 567
🌐 Website: thewinhouse.com`,
    },
    {
      title: 'Email theo dõi',
      type: 'follow-up' as const,
      subject: `[Theo dõi] Báo giá website - ${companyName || leadName}`,
      body: `Kính gửi ${leadName},

Tôi muốn theo dõi về bản báo giá website mà chúng tôi đã gửi trước đó.

Quý khách có thắc mắc gì về:
• Các tính năng trong gói dịch vụ?
• Thời gian triển khai?
• Phương thức thanh toán?

Chúng tôi hiểu rằng việc đầu tư vào website là quyết định quan trọng. Vì vậy, tôi rất sẵn lòng giải đáp mọi thắc mắc và tư vấn thêm về giải pháp phù hợp nhất với ${companyName || 'doanh nghiệp của Quý khách'}.

Quý khách có thể đặt lịch tư vấn miễn phí 30 phút để chúng ta thảo luận chi tiết hơn.

Trân trọng,
Đội ngũ Winhouse`,
    },
    {
      title: 'Email chốt deal',
      type: 'closing' as const,
      subject: `[Ưu đãi cuối] Giảm 15% cho ${companyName || leadName} - Chỉ còn 3 ngày!`,
      body: `Kính gửi ${leadName},

🎁 ƯU ĐÃI ĐẶC BIỆT dành riêng cho Quý khách!

Để thể hiện sự trân trọng, Winhouse xin gửi tặng:
✨ GIẢM 15% tổng chi phí triển khai
✨ MIỄN PHÍ 3 tháng hỗ trợ kỹ thuật
✨ TẶNG 1 năm hosting cao cấp

Chi phí sau ưu đãi: ${formatCurrency(totalAmount * 0.85)}
(Tiết kiệm: ${formatCurrency(totalAmount * 0.15)})

⏰ Ưu đãi chỉ có hiệu lực trong 3 ngày tới!

Đây là cơ hội tuyệt vời để ${companyName || 'Quý khách'} sở hữu website ${industryName} chuyên nghiệp với chi phí tối ưu nhất.

Đăng ký ngay:
📞 Gọi: 0901 234 567
💬 Đặt lịch: thewinhouse.com/booking

Trân trọng,
Đội ngũ Winhouse`,
    },
  ];
}
