-- ============================================
-- WINHOUSE QUOTE TOOL - DATABASE SCHEMA
-- MariaDB 10.5.16+
-- ============================================

-- Create database (run as root)
CREATE DATABASE IF NOT EXISTS winhouse_quote CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE winhouse_quote;

-- ============================================
-- INDUSTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS industries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_vi VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL DEFAULT 'Briefcase',
    description TEXT,
    color VARCHAR(20) DEFAULT '#3b82f6',
    gradient VARCHAR(100) DEFAULT 'from-blue-500 to-indigo-600',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MODULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_vi VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    description_vi TEXT,
    category ENUM('core', 'marketing', 'integration', 'advanced', 'support') NOT NULL DEFAULT 'core',
    base_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    monthly_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    icon VARCHAR(50) NOT NULL DEFAULT 'Package',
    is_popular BOOLEAN DEFAULT FALSE,
    is_required BOOLEAN DEFAULT FALSE,
    dependencies JSON DEFAULT NULL COMMENT 'Array of module slugs this depends on',
    features JSON DEFAULT NULL COMMENT 'Array of feature strings',
    estimated_days INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_popular (is_popular)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MODULE-INDUSTRY RELATIONSHIP TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS module_industries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    industry_slug VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE KEY unique_module_industry (module_id, industry_slug),
    INDEX idx_industry (industry_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- QUOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_number VARCHAR(20) NOT NULL UNIQUE,
    industry_slug VARCHAR(50) NOT NULL,
    budget_range ENUM('under-20', '20-50', 'over-50') NOT NULL,
    modules_json JSON NOT NULL COMMENT 'Selected modules with details',
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    monthly_total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    estimated_days INT NOT NULL DEFAULT 0,
    valid_until DATE NOT NULL,
    status ENUM('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired') DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_quote_number (quote_number),
    INDEX idx_industry (industry_slug),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(200) DEFAULT NULL,
    role ENUM('owner', 'admin', 'seoer', 'accountant', 'other') NOT NULL DEFAULT 'owner',
    notes TEXT,
    source ENUM('quote-tool', 'direct', 'referral', 'ads') DEFAULT 'quote-tool',
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT,
    utm_source VARCHAR(100) DEFAULT NULL,
    utm_medium VARCHAR(100) DEFAULT NULL,
    utm_campaign VARCHAR(100) DEFAULT NULL,
    is_contacted BOOLEAN DEFAULT FALSE,
    contacted_at TIMESTAMP NULL,
    contact_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_quote (quote_id),
    INDEX idx_source (source),
    INDEX idx_contacted (is_contacted),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- AI GENERATED CONTENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT NOT NULL,
    content_type ENUM('email_intro', 'email_followup', 'email_closing', 'consulting_script') NOT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    body TEXT NOT NULL,
    tone ENUM('professional', 'friendly', 'urgent') DEFAULT 'professional',
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    INDEX idx_quote (quote_id),
    INDEX idx_type (content_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ANALYTICS/EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    quote_id INT DEFAULT NULL,
    lead_id INT DEFAULT NULL,
    session_id VARCHAR(100) DEFAULT NULL,
    data JSON DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    INDEX idx_event_type (event_type),
    INDEX idx_session (session_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SETTINGS TABLE (Key-Value store)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description VARCHAR(255) DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT INDUSTRIES
-- ============================================
INSERT INTO industries (name, name_vi, slug, icon, description, color, gradient, sort_order) VALUES
('Real Estate', 'Bất động sản', 'real-estate', 'Building2', 'Websites for real estate agencies, property listings, and land projects', '#059669', 'from-emerald-500 to-teal-600', 1),
('Business', 'Doanh nghiệp', 'business', 'Briefcase', 'Corporate websites, company profiles, and B2B solutions', '#2563eb', 'from-blue-500 to-indigo-600', 2),
('E-commerce', 'Thương mại điện tử', 'ecommerce', 'ShoppingCart', 'Online stores, product catalogs, and shopping platforms', '#dc2626', 'from-red-500 to-orange-600', 3),
('Education', 'Giáo dục', 'education', 'GraduationCap', 'Schools, courses, LMS, and educational platforms', '#7c3aed', 'from-violet-500 to-purple-600', 4),
('Booking', 'Đặt lịch / Booking', 'booking', 'CalendarCheck', 'Appointment booking, hotel reservations, and service scheduling', '#ea580c', 'from-orange-500 to-amber-600', 5);

-- ============================================
-- INSERT DEFAULT SETTINGS
-- ============================================
INSERT INTO settings (setting_key, setting_value, description) VALUES
('company_name', 'Winhouse', 'Company display name'),
('company_email', 'contact@thewinhouse.com', 'Contact email'),
('company_phone', '0901 234 567', 'Contact phone'),
('company_website', 'https://thewinhouse.com', 'Main website URL'),
('quote_validity_days', '30', 'Number of days quote is valid'),
('discount_5_modules', '5', 'Discount percentage for 5+ modules'),
('discount_7_modules', '10', 'Discount percentage for 7+ modules'),
('discount_10_modules', '15', 'Discount percentage for 10+ modules'),
('vat_percentage', '10', 'VAT percentage'),
('google_sheets_webhook', '', 'Google Sheets webhook URL for lead capture');

-- ============================================
-- SAMPLE MODULES (Core modules for all industries)
-- ============================================
INSERT INTO modules (name, name_vi, slug, description, description_vi, category, base_price, monthly_price, icon, is_popular, is_required, dependencies, features, estimated_days) VALUES
('Landing Page', 'Trang đích (Landing Page)', 'landing-page', 'High-converting landing page with optimized layout', 'Trang đích tối ưu chuyển đổi, thiết kế chuyên nghiệp', 'core', 5000000, 0, 'Layout', TRUE, FALSE, '[]', '["Responsive design", "SEO optimized", "Fast loading", "CTA buttons"]', 3),
('Multi-page Website', 'Website đa trang', 'multi-page', 'Complete website with multiple pages and navigation', 'Website hoàn chỉnh với nhiều trang và điều hướng', 'core', 12000000, 500000, 'FileStack', TRUE, FALSE, '[]', '["Up to 10 pages", "Navigation menu", "Footer", "Contact page"]', 7),
('Content Management (CMS)', 'Quản lý nội dung (CMS)', 'cms', 'Easy-to-use admin panel to manage content', 'Bảng quản trị dễ sử dụng để quản lý nội dung', 'core', 8000000, 300000, 'Settings2', TRUE, FALSE, '[]', '["WYSIWYG editor", "Media library", "User roles", "Content versioning"]', 5),
('Blog / News', 'Blog / Tin tức', 'blog', 'Blog system with categories and tags', 'Hệ thống blog với danh mục và thẻ', 'core', 4000000, 200000, 'Newspaper', FALSE, FALSE, '["cms"]', '["Categories", "Tags", "Comments", "Social sharing"]', 3),
('Contact Form', 'Form liên hệ', 'contact-form', 'Contact form with email notifications', 'Form liên hệ với thông báo email', 'core', 2000000, 0, 'Mail', TRUE, FALSE, '[]', '["Form validation", "Email notification", "Spam protection", "File upload"]', 1),
('SEO Optimization', 'Tối ưu SEO', 'seo', 'Complete SEO optimization package', 'Gói tối ưu SEO hoàn chỉnh', 'marketing', 8000000, 500000, 'Search', TRUE, FALSE, '[]', '["Meta tags", "Sitemap", "Schema markup", "Speed optimization"]', 5),
('Google Analytics', 'Google Analytics', 'analytics', 'Analytics integration and dashboards', 'Tích hợp Analytics và bảng thống kê', 'marketing', 3000000, 0, 'BarChart3', TRUE, FALSE, '[]', '["GA4 setup", "Custom events", "Conversion tracking", "Reports"]', 2),
('Live Chat', 'Chat trực tuyến', 'live-chat', 'Live chat widget for customer support', 'Widget chat trực tuyến hỗ trợ khách hàng', 'integration', 4000000, 200000, 'MessageCircle', TRUE, FALSE, '[]', '["Real-time chat", "Chatbot", "File sharing", "Chat history"]', 2),
('Basic Support', 'Hỗ trợ cơ bản', 'basic-support', '3 months of basic support', '3 tháng hỗ trợ cơ bản', 'support', 0, 500000, 'Headphones', FALSE, TRUE, '[]', '["Email support", "Bug fixes", "Security updates", "Backup"]', 0),
('Premium Support', 'Hỗ trợ cao cấp', 'premium-support', 'Priority support with dedicated manager', 'Hỗ trợ ưu tiên với quản lý chuyên trách', 'support', 5000000, 1500000, 'Shield', TRUE, FALSE, '[]', '["24/7 support", "Account manager", "Priority fixes", "Monthly reports"]', 0);

-- Link modules to all industries
INSERT INTO module_industries (module_id, industry_slug)
SELECT m.id, i.slug 
FROM modules m 
CROSS JOIN industries i 
WHERE m.slug IN ('landing-page', 'multi-page', 'cms', 'blog', 'contact-form', 'seo', 'analytics', 'live-chat', 'basic-support', 'premium-support');

-- ============================================
-- VIEW: Quote Summary
-- ============================================
CREATE OR REPLACE VIEW v_quote_summary AS
SELECT 
    q.id,
    q.quote_number,
    q.industry_slug,
    i.name_vi as industry_name,
    q.budget_range,
    q.total,
    q.monthly_total,
    q.status,
    q.created_at,
    l.name as lead_name,
    l.email as lead_email,
    l.phone as lead_phone,
    l.company as lead_company
FROM quotes q
LEFT JOIN industries i ON q.industry_slug = i.slug
LEFT JOIN leads l ON l.quote_id = q.id
ORDER BY q.created_at DESC;

-- ============================================
-- VIEW: Monthly Revenue Report
-- ============================================
CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as quote_count,
    SUM(CASE WHEN status = 'accepted' THEN total ELSE 0 END) as accepted_total,
    SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_count,
    AVG(total) as avg_quote_value
FROM quotes
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;

-- ============================================
-- STORED PROCEDURE: Generate Quote Number
-- ============================================
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_generate_quote_number(OUT new_number VARCHAR(20))
BEGIN
    DECLARE year_month VARCHAR(4);
    DECLARE random_suffix VARCHAR(4);
    
    SET year_month = DATE_FORMAT(NOW(), '%y%m');
    SET random_suffix = UPPER(SUBSTRING(MD5(RAND()), 1, 4));
    SET new_number = CONCAT('WH', year_month, '-', random_suffix);
END //
DELIMITER ;

-- ============================================
-- TRIGGER: Update quote status to expired
-- ============================================
DELIMITER //
CREATE TRIGGER IF NOT EXISTS trg_check_quote_expiry
BEFORE UPDATE ON quotes
FOR EACH ROW
BEGIN
    IF NEW.valid_until < CURDATE() AND OLD.status NOT IN ('accepted', 'rejected', 'expired') THEN
        SET NEW.status = 'expired';
    END IF;
END //
DELIMITER ;

-- ============================================
-- END OF SCHEMA
-- ============================================