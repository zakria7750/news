-- إنشاء bucket للصور
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- إعطاء صلاحيات للمستخدمين
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Allow public access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Allow public updates" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Allow public deletes" ON storage.objects FOR DELETE USING (bucket_id = 'images');
