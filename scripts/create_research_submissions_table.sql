-- إنشاء جدول طلبات تقديم الأبحاث
CREATE TABLE IF NOT EXISTS public.research_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- معلومات الباحث
    researcher_name VARCHAR(255) NOT NULL,
    researcher_email VARCHAR(255) NOT NULL,
    researcher_phone VARCHAR(50) NOT NULL,
    researcher_institution VARCHAR(500) NOT NULL,
    
    -- معلومات البحث
    research_title VARCHAR(500) NOT NULL,
    research_abstract TEXT NOT NULL,
    research_keywords TEXT NOT NULL,
    research_language VARCHAR(20) NOT NULL CHECK (research_language IN ('arabic', 'english')),
    
    -- الملفات المرفوعة
    research_file_url VARCHAR(1000) NOT NULL,
    cover_image_url VARCHAR(1000),
    cv_file_url VARCHAR(1000),
    cover_letter_url VARCHAR(1000),
    
    -- حالة الطلب
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(255)
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_research_submissions_status ON public.research_submissions(status);
CREATE INDEX IF NOT EXISTS idx_research_submissions_created_at ON public.research_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_submissions_email ON public.research_submissions(researcher_email);

-- تفعيل RLS (Row Level Security)
ALTER TABLE public.research_submissions ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة (للمشرفين فقط)
CREATE POLICY "Enable read access for authenticated users" ON public.research_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- سياسة للإدراج (للجميع)
CREATE POLICY "Enable insert for all users" ON public.research_submissions
    FOR INSERT WITH CHECK (true);

-- سياسة للتحديث (للمشرفين فقط)
CREATE POLICY "Enable update for authenticated users" ON public.research_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_research_submissions_updated_at
    BEFORE UPDATE ON public.research_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
