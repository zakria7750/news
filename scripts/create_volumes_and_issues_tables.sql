-- إنشاء جدول المجلدات
CREATE TABLE IF NOT EXISTS public.volumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    volume_number INTEGER UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الأعداد
CREATE TABLE IF NOT EXISTS public.issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    volume_id UUID REFERENCES public.volumes(id) ON DELETE CASCADE,
    volume_number INTEGER NOT NULL,
    issue_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    publication_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(volume_number, issue_number)
);

-- إضافة حقل issue_id إلى جدول accepted_research
ALTER TABLE public.accepted_research 
ADD COLUMN IF NOT EXISTS issue_id UUID REFERENCES public.issues(id) ON DELETE SET NULL;

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_volumes_number ON public.volumes(volume_number);
CREATE INDEX IF NOT EXISTS idx_issues_volume ON public.issues(volume_id);
CREATE INDEX IF NOT EXISTS idx_issues_numbers ON public.issues(volume_number, issue_number);
CREATE INDEX IF NOT EXISTS idx_research_issue ON public.accepted_research(issue_id);

-- تحديث الـ updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة triggers للجداول الجديدة
DROP TRIGGER IF EXISTS update_volumes_updated_at ON public.volumes;
CREATE TRIGGER update_volumes_updated_at
    BEFORE UPDATE ON public.volumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_issues_updated_at ON public.issues;
CREATE TRIGGER update_issues_updated_at
    BEFORE UPDATE ON public.issues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- إدراج بعض البيانات التجريبية
INSERT INTO public.volumes (volume_number, title, description) VALUES
(1, 'المجلد الأول', 'المجلد الأول من مجلة وعي - العدد التأسيسي')
ON CONFLICT (volume_number) DO NOTHING;

INSERT INTO public.issues (volume_id, volume_number, issue_number, title, description) VALUES
((SELECT id FROM public.volumes WHERE volume_number = 1), 1, 1, 'العدد الأول', 'العدد الأول من المجلد الأول - العدد التأسيسي للمجلة')
ON CONFLICT (volume_number, issue_number) DO NOTHING;
