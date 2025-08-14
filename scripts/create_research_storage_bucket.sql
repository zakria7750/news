-- إنشاء bucket لتخزين ملفات الأبحاث
INSERT INTO storage.buckets (id, name, public)
VALUES ('research-files', 'research-files', false);

-- إعداد سياسات الأمان للـ bucket
CREATE POLICY "Allow authenticated users to upload research files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'research-files' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view research files" ON storage.objects
FOR SELECT USING (bucket_id = 'research-files' AND auth.role() = 'authenticated');

CREATE POLICY "Allow service role full access to research files" ON storage.objects
FOR ALL USING (bucket_id = 'research-files' AND auth.role() = 'service_role');
