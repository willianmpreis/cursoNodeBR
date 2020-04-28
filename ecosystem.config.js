module.exports = {
  apps : [{
    name: "api",
    script: "./api.js",
    instances: "max",
    env: {
      NODE_ENV: "dev",
    },
    env_production: {
      NODE_ENV: "prod",
    }
  }]
}