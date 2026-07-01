import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://izgndwfumgxekdztspjn.supabase.co";

const supabaseKey =
  "sb_publishable_mQJij6zAOcFfuvatpBqyNg_u3B_wiQO";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);