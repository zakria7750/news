-- إنشاء bucket لحفظ صور الأخبار
INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true);

-- إعداد سياسات الوصول للـ bucket
CREATE POLICY "Allow public read access on news images" ON storage.objects
FOR SELECT USING (bucket_id = 'news-images');

CREATE POLICY "Allow authenticated users to upload news images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Allow authenticated users to update news images" ON storage.objects
FOR UPDATE USING (bucket_id = 'news-images');

CREATE POLICY "Allow authenticated users to delete news images" ON storage.objects
FOR DELETE USING (bucket_id = 'news-images');
