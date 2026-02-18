-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  date_of_birth DATE,
  country_of_birth TEXT,
  nationality TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  a_number TEXT,
  uscis_account_number TEXT,
  ssn TEXT,
  itin TEXT,
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  last_entry_date DATE,
  entry_status TEXT,
  i94_number TEXT,
  passport_number TEXT,
  passport_country TEXT,
  passport_expiry DATE,
  preferred_language TEXT DEFAULT 'es' CHECK (preferred_language IN ('es', 'en')),
  avatar_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service catalog
CREATE TABLE service_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  allow_installments BOOLEAN DEFAULT true,
  max_installments INTEGER DEFAULT 12,
  min_down_payment_percent INTEGER DEFAULT 20,
  estimated_duration TEXT,
  uscis_forms TEXT[],
  required_documents JSONB NOT NULL DEFAULT '[]',
  eligibility_questions JSONB,
  is_active BOOLEAN DEFAULT true,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cases
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES profiles(id),
  service_id UUID NOT NULL REFERENCES service_catalog(id),
  intake_status TEXT NOT NULL DEFAULT 'in_progress' CHECK (intake_status IN (
    'payment_pending', 'in_progress', 'submitted', 'under_review',
    'needs_correction', 'approved_by_henry', 'filed', 'cancelled'
  )),
  immigration_status TEXT DEFAULT 'not_filed' CHECK (immigration_status IN (
    'not_filed', 'receipt_received', 'biometrics_scheduled', 'biometrics_done',
    'interview_scheduled', 'interview_done', 'rfe_received', 'rfe_responded',
    'decision_pending', 'approved', 'denied', 'referred_to_court', 'appeal_filed'
  )),
  form_data JSONB DEFAULT '{}',
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER,
  total_cost DECIMAL(10,2) NOT NULL,
  payment_type TEXT DEFAULT 'full' CHECK (payment_type IN ('full', 'installments')),
  uscis_receipt_number TEXT,
  uscis_receipt_date DATE,
  biometrics_date TIMESTAMPTZ,
  interview_date TIMESTAMPTZ,
  court_date TIMESTAMPTZ,
  deadline_date TIMESTAMPTZ,
  filed_date DATE,
  decision_date DATE,
  client_notes TEXT,
  henry_notes TEXT,
  correction_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id),
  client_id UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  installment_number INTEGER DEFAULT 1,
  total_installments INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'completed', 'failed', 'refunded', 'overdue'
  )),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id),
  client_id UUID NOT NULL REFERENCES profiles(id),
  document_key TEXT NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'approved', 'rejected')),
  rejection_reason TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case activity / timeline
CREATE TABLE case_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  visible_to_client BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  case_id UUID REFERENCES cases(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'payment', 'action_required')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cases_client_id ON cases(client_id);
CREATE INDEX idx_cases_service_id ON cases(service_id);
CREATE INDEX idx_cases_intake_status ON cases(intake_status);
CREATE INDEX idx_payments_case_id ON payments(case_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_documents_case_id ON documents(case_id);
CREATE INDEX idx_case_activity_case_id ON case_activity(case_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: generate case number HF-YYYY-NNNN
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
DECLARE
  year_str TEXT;
  next_num INTEGER;
BEGIN
  year_str := TO_CHAR(NOW(), 'YYYY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(case_number FROM 9) AS INTEGER)), 0) + 1
  INTO next_num
  FROM cases
  WHERE case_number LIKE 'HF-' || year_str || '-%';
  NEW.case_number := 'HF-' || year_str || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_case_number
  BEFORE INSERT ON cases
  FOR EACH ROW
  WHEN (NEW.case_number IS NULL OR NEW.case_number = '')
  EXECUTE FUNCTION generate_case_number();

-- Trigger: update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
