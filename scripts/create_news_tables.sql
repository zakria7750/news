-- إنشاء جدول الاشتراكات في النشرة الإخبارية
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- إنشاء جدول الأخبار
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  image_path VARCHAR(500),
  publish_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس على البريد الإلكتروني لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);

-- إنشاء فهرس على تاريخ النشر لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_news_publish_date ON news(publish_date DESC);

-- إدراج بيانات تجريبية للأخبار
INSERT INTO news (title, description, image_path, publish_date) VALUES
('إطلاق العدد الجديد من مجلة وعي', 'نعلن عن إطلاق العدد الجديد من مجلة وعي الأكاديمية المحكمة، والذي يحتوي على مجموعة متميزة من البحوث والدراسات الأكاديمية في مختلف المجالات العلمية والإنسانية.', '/news-images/magazine-launch.jpg', '2024-01-15'),
('ورشة عمل حول منهجية البحث العلمي', 'تنظم أكاديمية المعرفة الدولية ورشة عمل متخصصة حول منهجية البحث العلمي وأساليب كتابة البحوث الأكاديمية، بمشاركة نخبة من الأكاديميين والباحثين المتميزين.', '/news-images/research-workshop.jpg', '2024-01-10'),
('مؤتمر الابتكار في التعليم العالي', 'يسعدنا دعوتكم لحضور مؤتمر الابتكار في التعليم العالي الذي تنظمه الأكاديمية بالتعاون مع جامعات عالمية رائدة، لمناقشة أحدث التطورات في مجال التعليم الأكاديمي.', '/news-images/education-conference.jpg', '2024-01-05');
