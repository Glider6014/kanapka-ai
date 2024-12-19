const REQUIRED_ENV_VARS = [
  'MONGODB_URI',
  'OPENAI_API_KEY',
  'NEXTAUTH_SECRET',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
];

export default function validateEnv() {
  for (const variable of REQUIRED_ENV_VARS) {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  }
}
