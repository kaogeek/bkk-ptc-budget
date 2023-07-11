const withSlash = (endpoint: string) =>
  endpoint.endsWith('/') ? endpoint : `${endpoint}/`

// TODO: Port this to useRuntimeConfig. Note that the code is using the composition API.
// Dev: http://localhost:8090
export const baseUrl = withSlash(
  process.env.NUXT_BASE_URL || 'https://api.dev.pb.grtn.org'
)

export const token =
  'b61621e24aacca8e195d5d3baab1b644980be16a116d8333fb05bf34d22be87cbe>'
