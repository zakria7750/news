-- Create editorial_board_members table
CREATE TABLE IF NOT EXISTS editorial_board_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  image_url TEXT,
  section VARCHAR(50) NOT NULL CHECK (section IN ('editor_in_chief', 'managing_editor', 'executive_manager', 'technical_committee', 'advisory_committee')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_editorial_board_members_updated_at 
    BEFORE UPDATE ON editorial_board_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO editorial_board_members (name, position, country, section, image_url) VALUES
('د. أحمد محمد الخليل', 'رئيس التحرير', 'المملكة العربية السعودية', 'editor_in_chief', '/arabic-male-professor.png'),
('د. فاطمة عبدالله النور', 'مدير التحرير', 'الإمارات العربية المتحدة', 'managing_editor', '/arabic-female-professor.png'),
('أ. محمد سالم الراشد', 'المدير التنفيذي', 'قطر', 'executive_manager', '/arabic-executive.png'),
('د. سارة أحمد الزهراني', 'عضو اللجنة الفنية', 'الكويت', 'technical_committee', '/arabic-female-researcher.png'),
('د. عبدالرحمن علي المطيري', 'عضو اللجنة الفنية', 'البحرين', 'technical_committee', '/placeholder-46y0c.png'),
('د. نورا محمد العتيبي', 'عضو اللجنة الفنية', 'عمان', 'technical_committee', '/placeholder-ocbfi.png'),
('د. خالد سعد الدوسري', 'عضو اللجنة الفنية', 'الأردن', 'technical_committee', '/placeholder-2jfcd.png'),
('د. ليلى حسن القحطاني', 'عضو اللجنة الاستشارية', 'لبنان', 'advisory_committee', '/arabic-female-advisor.png'),
('د. عمر يوسف الشمري', 'عضو اللجنة الاستشارية', 'العراق', 'advisory_committee', '/arabic-male-consultant.png'),
('د. رانيا محمود السيد', 'عضو اللجنة الاستشارية', 'مصر', 'advisory_committee', '/placeholder-ahoxb.png');
