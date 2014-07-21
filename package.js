Package.describe({
  summary: 'Style with attitude.'
});

Package._transitional_registerBuildPlugin({
  name: 'meteor-ruby-sass',
  use: [],
  sources: [
    'plugin.js'
  ],
  npmDependencies: {
    'execSync': '1.0.1-pre'
  }
});
