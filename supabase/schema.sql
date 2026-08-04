-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROOMS TABLE
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  capacity INT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RESERVATIONS TABLE
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES FOR ROOMS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Anyone can read rooms
CREATE POLICY "Rooms are viewable by everyone."
  ON rooms FOR SELECT
  USING (true);

-- Only authenticated users (admins) can modify rooms
CREATE POLICY "Rooms are modifiable by authenticated users."
  ON rooms FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS POLICIES FOR RESERVATIONS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- No public policy on the base table: it holds guest PII and the anon key is public.
-- Admins can do everything
CREATE POLICY "Reservations are fully accessible by authenticated users."
  ON reservations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public availability is exposed only through this column-limited view.
CREATE OR REPLACE VIEW reservation_availability AS
  SELECT room_id, check_in, check_out
  FROM reservations
  WHERE status = 'paid';

REVOKE ALL ON reservation_availability FROM anon, authenticated;
GRANT SELECT ON reservation_availability TO anon, authenticated;

-- Service Role (Webhook) can do everything
-- Note: Service Role bypasses RLS by default.

-- Exclusion constraint to prevent overlapping paid reservations
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE reservations ADD CONSTRAINT no_overlapping_reservation
  EXCLUDE USING GIST (
    room_id WITH =,
    daterange(check_in, check_out, '[]') WITH &&
  ) WHERE (status = 'paid');

-- Insert dummy rooms based on our design
INSERT INTO rooms (slug, name, description, price, capacity) VALUES 
('101', '101', 'Spazio minimalista con vista sul cortile interno.', 40, 2),
('102', '102', 'Design contemporaneo con vasca freestanding in camera.', 40, 3),
('103', '103', 'Intima e accogliente, ideale per brevi soggiorni.', 40, 3),
('104', '104', 'L''apice del lusso con terrazza privata sui tetti.', 40, 2);
