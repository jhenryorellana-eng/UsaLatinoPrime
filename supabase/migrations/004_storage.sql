-- Create storage bucket for case documents
INSERT INTO storage.buckets (id, name, public) VALUES ('case-documents', 'case-documents', false);

-- Storage policies
CREATE POLICY "Clients can upload own documents" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'case-documents' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Clients can view own documents" ON storage.objects FOR SELECT USING (
  bucket_id = 'case-documents' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Admin can view all documents" ON storage.objects FOR SELECT USING (
  bucket_id = 'case-documents' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
