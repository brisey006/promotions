
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Promotions',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/small-logo.png' },
    ],
    script: [
      { src: '/plugins/jquery/jquery.min.js', body: true, ssr: false },
      { src: '/plugins/jquery-ui/jquery-ui.js', body: true, ssr: false },
      { src: '/plugins/moment/moment.min.js', body: true, ssr: false },
      { src: '/plugins/popper/popper.js', body: true, ssr: false },
      { src: '/plugins/feather/feather.min.js', body: true, ssr: false },
      { src: '/plugins/bootstrap/js/bootstrap.min.js', body: true, ssr: false },
      { src: '/plugins/pace/pace.min.js', body: true, ssr: false },
      { src: '/plugins/slimscroll/jquery.slimscroll.min.js', body: true, ssr: false },
      { src: '/plugins/highlight/highlight.min.js', body: true, ssr: false },
      { src: '/js/app.js', body: true, ssr: false },
      { src: '/js/avesta.js', body: true, ssr: false }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/static/plugins/dropzone/dropzone.css',
    '@/static/css/style.css',
    '@/static/css/skin/skin.light-skin.css',
    '@/static/css/skin/skin.light.css',
    '@/static/css/fonts.css',
    '@/static/css/custom.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/v-select', mode: 'client' },
    { src: '~/plugins/cleave', mode: 'client' },
    { src: '~/plugins/vue-tags', mode: 'client' },
    { src: '~/plugins/vue-notification', mode: 'client' },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    ['nuxt-fontawesome', {
      imports: [
       {
         set: '@fortawesome/free-solid-svg-icons',
         icons: ['fas']
       },
       {
         set:'@fortawesome/free-brands-svg-icons',
         icons: ['fab']
       },
       {
        set:'@fortawesome/free-regular-svg-icons',
        icons: ['far']
      }
     ]
    }]
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: 'http://<baseurl>/api',
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: ['vue-notifications'],
    extend (config, ctx) {
    }
  },
  router: {
    middleware: ['auth'],
    linkActiveClass: 'activeLink'
  }
}
