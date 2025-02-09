module.exports = {
    apps: [
      {
        name: "mybookreader-frontend",
        script: "npm",   // Use npm as the script
        args: " build",   // This will run the 'start' script defined in your package.json
        cwd: "/home/champ/projects/ri7_project/mybookreader-frontend",
        env: {
          NODE_ENV: "production",
          PORT: 3000
        },
        watch: false
      }
    ]
  };
  