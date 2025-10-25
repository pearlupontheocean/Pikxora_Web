import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'admin' | 'artist' | 'investor' | 'studio';

export const getUserRoles = async (userId: string): Promise<AppRole[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
  
  return data?.map(r => r.role as AppRole) || [];
};

export const getUserPrimaryRole = async (userId: string): Promise<AppRole | null> => {
  const roles = await getUserRoles(userId);
  return roles[0] || null;
};

export const hasRole = async (userId: string, role: AppRole): Promise<boolean> => {
  const { data } = await supabase.rpc('has_role', {
    _user_id: userId,
    _role: role
  });
  
  return data || false;
};

export const addUserRole = async (userId: string, role: AppRole) => {
  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role });
  
  return { error };
};
