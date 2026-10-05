CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pig_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_code VARCHAR(50) UNIQUE NOT NULL,
    pig_count INTEGER NOT NULL,
    breed VARCHAR(100),
    start_weight DECIMAL(10,2),
    current_weight DECIMAL(10,2),
    date_acquired DATE,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE feed_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES pig_batches(id) ON DELETE CASCADE,
    feed_type VARCHAR(100) NOT NULL,
    quantity_kg DECIMAL(10,2) NOT NULL,
    feeding_date DATE NOT NULL,
    feeding_time VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vaccination_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES pig_batches(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(100) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    administered_by VARCHAR(100),
    dosage VARCHAR(50),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES pig_batches(id) ON DELETE SET NULL,
    expense_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE pig_batches ADD COLUMN IF NOT EXISTS owner_id UUID;
ALTER TABLE feed_records ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_pig_batches_owner ON pig_batches (owner_id);

CREATE INDEX IF NOT EXISTS idx_pig_batches_created_at ON pig_batches (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pig_batches_status ON pig_batches (status);
CREATE INDEX IF NOT EXISTS idx_feed_records_date ON feed_records (feeding_date DESC);
CREATE INDEX IF NOT EXISTS idx_feed_records_batch ON feed_records (batch_id);
CREATE INDEX IF NOT EXISTS idx_feed_records_reminder ON feed_records (feeding_date, reminder_sent);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_date ON vaccination_records (vaccination_date DESC);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_due_status ON vaccination_records (next_due_date, status);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_batch ON vaccination_records (batch_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses (expense_date DESC);