//import path from 'path'
//import fs from 'fs'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'nuxt-pwa-201122',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {src: '@/plugins/vee-validate'},
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/fontawesome',
    '@nuxtjs/pwa',
  ],

  pwa: {
    manifest: {
      name: 'NFA App',
      lang: 'en',
    }
  },

  fontawesome: {
    icons: {
      solid: true,
      brands: true
    }
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    "@nuxtjs/axios",

    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
  ],

  router: {
    middleware: 'pages'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ["vee-validate/dist/rules"]
  },

  // Customize the progress-bar color
  //
  loading: {color: "#00FFFF"},
}
