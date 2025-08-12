-- إنشاء جدول طلبات تقديم الأبحاث
CREATE TABLE IF NOT EXISTS research_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- معلومات الباحث
    researcher_name VARCHAR(255) NOT NULL,
    researcher_email VARCHAR(255) NOT NULL,
    researcher_phone VARCHAR(50) NOT NULL,
    researcher_institution VARCHAR(500) NOT NULL,
    
    -- معلومات البحث
    research_title VARCHAR(1000) NOT NULL,
    research_abstract TEXT NOT NULL,
    research_keywords TEXT NOT NULL,
    research_language VARCHAR(20) NOT NULL CHECK (research_language IN ('arabic', 'english')),
    
    -- الملفات المرفقة
    research_file_url VARCHAR(1000) NOT NULL,
    cover_image_url VARCHAR(1000),
    cv_file_url VARCHAR(1000),
    cover_letter_url VARCHAR(1000),
    
    -- حالة الطلب
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    admin_notes TEXT,
    
    -- تواريخ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- إنشاء جدول الأبحاث المقبولة
CREATE TABLE IF NOT EXISTS accepted_research (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id UUID REFERENCES research_submissions(id) ON DELETE CASCADE,
    
    -- معلومات الباحث
    researcher_name VARCHAR(255) NOT NULL,
    researcher_email VARCHAR(255) NOT NULL,
    researcher_phone VARCHAR(50) NOT NULL,
    researcher_institution VARCHAR(500) NOT NULL,
    
    -- معلومات البحث
    research_title VARCHAR(1000) NOT NULL,
    research_abstract TEXT NOT NULL,
    research_keywords TEXT NOT NULL,
    research_language VARCHAR(20) NOT NULL,
    
    -- الملفات المرفقة
    research_file_url VARCHAR(1000) NOT NULL,
    cover_image_url VARCHAR(1000),
    
    -- معلومات النشر
    publication_date DATE,
    issue_number VARCHAR(50),
    volume_number VARCHAR(50),
    page_numbers VARCHAR(50),
    doi VARCHAR(255),
    
    -- تواريخ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_research_submissions_status ON research_submissions(status);
CREATE INDEX IF NOT EXISTS idx_research_submissions_created_at ON research_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_accepted_research_publication_date ON accepted_research(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_accepted_research_language ON accepted_research(research_language);

-- إضافة trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_research_submissions_updated_at 
    BEFORE UPDATE ON research_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accepted_research_updated_at 
    BEFORE UPDATE ON accepted_research 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
