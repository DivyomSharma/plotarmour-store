export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  replicateApiToken: process.env.REPLICATE_API_TOKEN,
  replicateTryOnModel: process.env.REPLICATE_TRYON_MODEL ?? "omnious/vella-1.5",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
};

export const hasSupabasePublicEnv = Boolean(
  env.supabaseUrl && env.supabaseAnonKey,
);
export const hasSupabaseAdminEnv = Boolean(
  env.supabaseUrl && env.supabaseServiceRoleKey,
);
export const hasCloudinaryEnv = Boolean(
  env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret,
);
export const hasReplicateEnv = Boolean(env.replicateApiToken);
export const hasRazorpayEnv = Boolean(
  env.razorpayKeyId && env.razorpayKeySecret,
);
