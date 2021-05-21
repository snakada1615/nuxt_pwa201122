//import path from 'path'
//import fs from 'fs'
export default {
  // add version number from WebPack to the program environmental variable
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
  css: [
    '@/assets/scss/app.scss'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {src: '@/plugins/vee-validate'},
    {src: '@/plugins/helper'},
    {src: '@/plugins/helperVue'},
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/pwa',
  ],
  render: {
    // Setting up cache for 'static' directory - a year in milliseconds
    // https://web.dev/uses-long-cache-ttl
    static: {
      maxAge: 60 * 60 * 24 * 365 * 1000,
    },
  },
  pwa: {
    manifest: {
      "theme_color": "#c2f1c3",
      "background_color": "#066308",
      "display": "standalone",
      "scope": "/",
      "start_url": "/index.vue",
      "app_name": "NFA-tool",
      "short_name": "nfa",
      "name":"nfa-tool"
    }
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    "@nuxtjs/axios",

    // https://go.nuxtjs.dev/bootstrap
    ['bootstrap-vue/nuxt', {
      css: false,
      // Add the desired icon components to the `components` array
      components: [
        'BIcon',
        'BIconReception0',
        'BIconReception4',
        'BIconCaretDownSquare',
        'BIconCheckCircleFill',
        'BIconPersonCircle',
        'BIconHouseFill',
        'BIconExclamationCircleFill',
        'BIconCheck',
        'BIconPeopleFill',
        'BIconX',
        'BIconEnvelope',
        'BIconFacebook',
        'BIconTwitter',
        'BIconGoogle',
        'BIconChatDotsFill',
      ],
      componentPlugins: [
        'NavbarPlugin',
        'LayoutPlugin',
        'BadgePlugin',
        'ButtonPlugin',
        'ModalPlugin',
        'PaginationPlugin',
        'TabsPlugin',
        'CarouselPlugin',
        'CardPlugin',
        'ToastPlugin',
        'TablePlugin',
        'TooltipPlugin',
        'InputGroupPlugin',
        'FormPlugin',
        'FormGroupPlugin',
        'FormInputPlugin',
        'FormSelectPlugin',
        'FormCheckboxPlugin',
        'FormRadioPlugin',
        'ListGroupPlugin',
      ],
    }]
  ],

  router: {
    middleware: 'pages'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ["vee-validate/dist/rules"],
    //analyze: true,
  },

  // Customize the progress-bar color
  //
  loading: {color: "#00FFFF"},
}
