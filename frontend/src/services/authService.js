import { supabase } from "../supabaseClient";

// SIGN UP
export const signUp = async (email, password, username) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      },
    },
  });

  return { data, error };
};

// LOGIN
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

// LOGOUT
export const logout = async () => {
  return await supabase.auth.signOut();
};

// GET USER
export const getUser = async () => {
  return await supabase.auth.getUser();
};