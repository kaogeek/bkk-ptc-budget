// https://nuxt.com/docs/api/configuration/nuxt-config
// https://api.dev.pb.grtn.org/
export default defineNuxtConfig({
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "/assets/scss/main.css",
    "bootstrap-icons/font/bootstrap-icons.css",
  ],
  modules: [
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Sarabun: true,
          download: true,
          inject: true,
          wght: [300, 400, 500, 600, 700, 800],
        },
      },
    ],
  ],
  app: {
    head: {
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.1/js/bootstrap.bundle.min.js",
          type: "text/javascript",
        },
      ],
    },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    // Private keys are only available on the server
    tokenApi: process.env.NUXT_TOKEN_API,
    // Public keys that are exposed to the client
    public: {
      baseApiUrl: process.env.NUXT_PUBLIC_BASE_API_URL,
      editorToken: process.env.NUXT_PUBLIC_EDITOR_TOKEN,
    },
  },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer'
          ]
        : ['@juggle/resize-observer']
  },
  vite: {
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : []
    }
  }
})