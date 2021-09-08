/*
 *
 * 🔌 [Plugin | Core] Core
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
<% options.forEach(({ name, path }) => { %>import <%= name %> from '<%= path %>'
<% }) %>

// This resolves to .nuxt/middleware.js
import NuxtMiddleware from '../../middleware'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// registerStore
const registerStore = (store, next) => {
  <% options.forEach(({ name, content }) => { %>
    store.registerModule('<%= name %>', Object.assign({
      namespaced: true
    }, <%= name %>))
  <% }) %>
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ store }) => {
  registerStore(store, () => {
    console.log(`🔌 [Plugin | Core] Core`)
  })
}
