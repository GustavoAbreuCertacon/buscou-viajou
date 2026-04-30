-- Fix: search_path explícito + tratamento de erro ao parsear role
-- O Supabase Auth dispara esse trigger ao criar auth.users.
-- Sem search_path, SECURITY DEFINER não acha o tipo enum public.user_role.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_role public.user_role;
BEGIN
    BEGIN
        v_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'CLIENT');
    EXCEPTION WHEN invalid_text_representation OR others THEN
        v_role := 'CLIENT';
    END;

    INSERT INTO public.profiles (
        id, email, first_name, last_name, role, kyc_status
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuário'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        v_role,
        'NOT_VERIFIED'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;
