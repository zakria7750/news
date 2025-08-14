-- إنشاء سياسات الأمان لـ Storage bucket للأبحاث

-- السماح للجميع برفع الملفات
CREATE POLICY "Allow public uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'research-files');

-- السماح للجميع بقراءة الملفات
CREATE POLICY "Allow public downloads" ON storage.objects
    FOR SELECT USING (bucket_id = 'research-files');

-- السماح للمشرفين بحذف الملفات
CREATE POLICY "Allow authenticated users to delete" ON storage.objects
    FOR DELETE USING (bucket_id = 'research-files' AND auth.role() = 'authenticated');

-- السماح للمشرفين بتحديث الملفات
CREATE POLICY "Allow authenticated users to update" ON storage.objects
    FOR UPDATE USING (bucket_id = 'research-files' AND auth.role() = 'authenticated');
