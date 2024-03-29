module.exports = {
  apps: [{
    name: 'myBlog',
    script: './app.js',
    'instances': 'max',
    'exec_mode': 'cluster',
    watch: true,
    env: {
      'NODE_ENV': 'development',
      'PORT': 8080,
    },
    env_production: {
      'NODE_ENV': 'production',
      'PORT': 8080,
    }
  }]
};