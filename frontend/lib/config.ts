const withSlash = (endpoint: string) =>
  endpoint.endsWith('/') ? endpoint : `${endpoint}/`

// TODO: Port this to useRuntimeConfig. Note that the code is using the composition API.
// Dev: http://localhost:8090
export const baseUrl = withSlash(
  process.env.NUXT_BASE_URL || 'https://api.dev.pb.grtn.org'
)

export const token =
  '***REMOVED***>'
