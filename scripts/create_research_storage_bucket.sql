-- إنشاء bucket للأبحاث والملفات المرفقة
INSERT INTO storage.buckets (id, name, public)
VALUES ('research-files', 'research-files', true)
ON CONFLICT (id) DO NOTHING;

-- إعداد سياسات الأمان للـ bucket
CREATE POLICY "Allow public read access on research files" ON storage.objects
FOR SELECT USING (bucket_id = 'research-files');

CREATE POLICY "Allow authenticated users to upload research files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'research-files');

CREATE POLICY "Allow authenticated users to update research files" ON storage.objects
FOR UPDATE USING (bucket_id = 'research-files');

CREATE POLICY "Allow authenticated users to delete research files" ON storage.objects
FOR DELETE USING (bucket_id = 'research-files');
