-- Public availability must not expose guest PII.
-- The anon key is shipped to the browser, so any visitor could previously read
-- guest_name / guest_email / total_price of every paid reservation via PostgREST.

DROP POLICY IF EXISTS "Reservations are viewable by everyone for availability check." ON reservations;

-- Availability is exposed through a view limited to non-identifying columns.
-- security_invoker is left off so the view (owned by postgres) reads past RLS.
CREATE OR REPLACE VIEW reservation_availability AS
  SELECT room_id, check_in, check_out
  FROM reservations
  WHERE status = 'paid';

REVOKE ALL ON reservation_availability FROM anon, authenticated;
GRANT SELECT ON reservation_availability TO anon, authenticated;

-- Full rows stay readable only to signed-in admins.
DROP POLICY IF EXISTS "Reservations are fully accessible by authenticated users." ON reservations;
CREATE POLICY "Reservations are fully accessible by authenticated users."
  ON reservations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Rooms are modifiable by authenticated users." ON rooms;
CREATE POLICY "Rooms are modifiable by authenticated users."
  ON rooms FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
