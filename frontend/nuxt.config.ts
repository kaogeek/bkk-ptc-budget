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
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js",
          type: "text/javascript",
        },
      ],
    },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // BASE_API_URL: "http://localhost:8090/",
      BASE_API_URL: "https://api.dev.pb.grtn.org/",
      TOKEN_API:
        "http://b61621e24aacca8e195d5d3baab1b644980be16a116d8333fb05bf34d22be87cbe>:8090/",
      EDITOR_TOKEN: "811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq",
    },
  },
};
