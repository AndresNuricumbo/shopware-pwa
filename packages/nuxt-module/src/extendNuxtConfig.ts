import { NuxtConfig } from "@nuxt/types";
import { isArray, mergeWith } from "lodash";

function customizer(objValue: Object, srcValue: unknown) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

const defaultConfig: NuxtConfig = {
  telemetry: false,
  env: {
    CHOKIDAR_USEPOLLING: process.env.NODE_ENV == "production" ? "0" : "1",
    EXPERIMENTAL_IMAGE_PROCESSING_SERVER:
      process.env.EXPERIMENTAL_IMAGE_PROCESSING_SERVER || "",
  },
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "0.0.0.0",
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Shopware PWA",
    meta: [
      { hid: "project-type", name: "project-type", content: "shopware-pwa" },
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~assets/scss/main.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxt/typescript-build", "@shopware-pwa/nuxt-module"],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en",
    },
    workbox: {
      offlineStrategy: "StaleWhileRevalidate",
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [["@babel/plugin-proposal-private-methods", { loose: true }]],
    },
  },
};

const configs: NuxtConfig[] = [defaultConfig];
export default function extendNuxtConfig(config: NuxtConfig) {
  configs.push(config);
  return configs.reduce((prev, next) => mergeWith(prev, next, customizer));
}
