import postcssViewportToContainerToggle from 'postcss-viewport-to-container-toggle';

export default {
  // Is the site still editable in production like a normal Apos Site,
  // if yes we need the plugin for all builds
  plugins: [
    postcssViewportToContainerToggle({
        modifierAttr: 'data-breakpoint-preview-mode',
        debug: true,
        transform: null
    })
  ]
}