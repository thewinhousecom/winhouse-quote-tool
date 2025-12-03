# Winhouse Quote Tool

🚀 **Công cụ báo giá website thông minh** cho [Winhouse](https://thewinhouse.com)

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License](https://img.shields.io/badge/License-Private-red)

## 📋 Tổng quan

Quote Tool là ứng dụng Single Page Application (SPA) giúp:
- **Khách hàng** tự xây dựng cấu trúc website và ước tính chi phí
- **Sale Team** tạo nội dung tư vấn tự động bằng AI
- **Admin** theo dõi leads và quản lý báo giá

### 🎯 Live Demo
- **Production**: https://tool.thewinhouse.com
- **Main Site**: https://thewinhouse.com

## ✨ Tính năng

### Giai đoạn 1: Onboarding
- ✅ Màn hình chào mừng với CTA
- ✅ Chọn ngành nghề (5 ngành: BĐS, Doanh nghiệp, E-commerce, Giáo dục, Booking)
- ✅ Chọn ngân sách (<20tr, 20-50tr, >50tr)

### Giai đoạn 2: Builder
- ✅ Danh sách modules theo ngành
- ✅ Click-to-add modules (MVP)
- ✅ Real-time price calculation
- ✅ Discount tự động (5-15% theo số lượng)

### Giai đoạn 3: Lead Capture
- ✅ Form thông tin khách hàng
- ✅ Validation với Zod
- ✅ Webhook gửi về Google Sheets

### Giai đoạn 4: Result
- ✅ Download báo giá PDF/HTML
- ✅ 3 mẫu email tư vấn AI
- ✅ Copy-to-clipboard

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS 4 |
| State | Zustand (Persisted) |
| Form | React Hook Form + Zod |
| Animation | Framer Motion |
| Icons | Lucide React |
| AI | OpenAI GPT-3.5/4 |
| Database | MariaDB 10.5+ |
| Webhook | Google Sheets |

## 📁 Cấu trúc thư mục

```
winhouse-quote-tool/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/generate/    # AI email generation
│   │   │   ├── pdf/            # PDF generation
│   │   │   └── webhook/        # Google Sheets webhook
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── wizard/             # Step components
│   │   ├── icons.tsx
│   │   └── WizardContainer.tsx
│   ├── lib/
│   │   ├── data/modules.ts     # Mock data
│   │   ├── store/              # Zustand store
│   │   ├── validations/        # Zod schemas
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── database/
│   └── schema.sql              # MariaDB schema
├── scripts/
│   └── google-sheets-webhook.js # Apps Script
├── .env.example
└── README.md
```

## 🚀 Cài đặt

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- MariaDB 10.5+ (optional)

### 1. Clone repository

```bash
git clone https://github.com/thewinhousecom/winhouse-quote-tool.git
cd winhouse-quote-tool
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# OpenAI API (for AI emails)
OPENAI_API_KEY=sk-your-key

# Google Sheets Webhook
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/...

# App URL
NEXT_PUBLIC_APP_URL=https://tool.thewinhouse.com
```

### 4. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

### 5. Build production

```bash
npm run build
npm start
```

## 📊 Database Setup (Optional)

Nếu muốn lưu data vào MariaDB:

```bash
mysql -u root -p < database/schema.sql
```

## 🔗 Google Sheets Integration

1. Tạo Google Sheets mới
2. Vào **Extensions > Apps Script**
3. Paste code từ `scripts/google-sheets-webhook.js`
4. Deploy as Web App
5. Copy URL vào `.env.local`

## 🎨 Brand Colors

```css
:root {
  --brand-primary: #4464AA;  /* Winhouse Blue */
  --brand-white: #FFFFFF;
  --brand-black: #000000;
}
```

## 📱 Responsive Design

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Security

- ✅ Input validation (Zod)
- ✅ XSS protection
- ✅ Rate limiting ready
- ⚠️ CORS configuration needed for production

## 📈 Analytics Events

Các event được track:
- `quote_started` - Bắt đầu tạo báo giá
- `industry_selected` - Chọn ngành
- `budget_selected` - Chọn ngân sách
- `module_added/removed` - Thêm/xóa module
- `lead_captured` - Submit form
- `quote_downloaded` - Tải PDF

## 🚢 Deployment

### Vercel (Recommended)

1. Import repository vào Vercel
2. Set environment variables
3. Deploy

### Custom Server

```bash
npm run build
npm start
```

## 📝 TODO / Roadmap

- [ ] Drag & Drop với dnd-kit
- [ ] PDF generation với Puppeteer
- [ ] Admin dashboard
- [ ] Email automation
- [ ] Multi-language (EN/VI)
- [ ] Dark mode toggle
- [ ] A/B testing

## 👥 Contributors

- **Winhouse Team** - Development & Design

## 📄 License

Private - © 2024 Winhouse. All rights reserved.

---

Made with ❤️ by [Winhouse](https://thewinhouse.com)
