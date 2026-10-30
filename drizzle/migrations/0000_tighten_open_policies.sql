DROP POLICY IF EXISTS "Anyone can check own access" ON public.game_access;
CREATE POLICY "Users can check own access" ON public.game_access FOR SELECT TO authenticated
USING (lower(user_email) = lower(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Anyone can insert payment requests" ON public.payment_requests;
CREATE POLICY "Users can submit own payment requests" ON public.payment_requests FOR INSERT TO authenticated
WITH CHECK (lower(user_email) = lower(auth.jwt() ->> 'email') AND status = 'pending' AND confirmed_at IS NULL AND confirmed_by IS NULL);

DROP POLICY IF EXISTS "Anyone can insert visits" ON public.site_visits;
CREATE POLICY "Visitors can log page visits" ON public.site_visits FOR INSERT TO anon, authenticated
WITH CHECK (length(page) BETWEEN 1 AND 200 AND (visitor_id IS NULL OR length(visitor_id) <= 100));