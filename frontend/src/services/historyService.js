import { supabase } from "../supabaseClient";

// SAVE ANALYSIS RESULT
export const saveHistory = async ({ filename, prediction, confidence }) => {
  const { data: userData } = await supabase.auth.getUser();

  const user = userData?.user;

  if (!user) {
    console.error("User not logged in");
    return;
  }

  const { error } = await supabase.from("analysis_history").insert([
    {
      user_id: user.id,
      filename,
      prediction,
      confidence,
    },
  ]);

  if (error) console.error("Save error:", error);
};

// GET HISTORY
export const getHistory = async () => {
  const { data, error } = await supabase
    .from("analysis_history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    return [];
  }

  return data || [];
};