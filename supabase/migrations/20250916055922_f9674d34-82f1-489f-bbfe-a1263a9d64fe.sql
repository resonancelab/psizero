-- Allow everyone to view active API endpoints for documentation
CREATE POLICY "Everyone can view active api_endpoints" 
ON public.api_endpoints 
FOR SELECT 
USING (is_active = true);