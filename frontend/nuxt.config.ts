// https://nuxt.com/docs/api/configuration/nuxt-config
// https://api.dev.pb.grtn.org/
export default {
  mode: "universal",
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
    public: {
      BASE_API_URL: process.env.NUXT_BASE_API_URL,
      TOKEN_API: process.env.NUXT_TOKEN_API,
      EDITOR_TOKEN: process.env.NUXT_EDITOR_TOKEN,
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
}