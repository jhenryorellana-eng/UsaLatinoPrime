-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Service catalog (public read)
CREATE POLICY "Anyone can view active services" ON service_catalog FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage services" ON service_catalog FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Cases
CREATE POLICY "Clients can view own cases" ON cases FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Clients can insert own cases" ON cases FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Clients can update own cases" ON cases FOR UPDATE USING (client_id = auth.uid());
CREATE POLICY "Admin can view all cases" ON cases FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can update all cases" ON cases FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payments
CREATE POLICY "Clients can view own payments" ON payments FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admin can view all payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can manage payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Documents
CREATE POLICY "Clients can view own documents" ON documents FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Clients can upload documents" ON documents FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Admin can view all documents" ON documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can manage documents" ON documents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Case activity
CREATE POLICY "Clients can view own case activity" ON case_activity FOR SELECT USING (
  visible_to_client = true AND EXISTS (SELECT 1 FROM cases WHERE cases.id = case_activity.case_id AND cases.client_id = auth.uid())
);
CREATE POLICY "Admin can view all activity" ON case_activity FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can insert activity" ON case_activity FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admin can manage notifications" ON notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
