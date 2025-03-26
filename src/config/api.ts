export const CLAID_API_KEY = process.env.NEXT_PUBLIC_CLAID_API_KEY

if (!CLAID_API_KEY) {
  console.error('CLAID API key is not configured')
} 