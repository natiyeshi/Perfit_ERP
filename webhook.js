import express from 'express';
import { exec } from 'child_process';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Wokring!!")
})

app.post('/github-webhook', (req, res) => {
  const branch = req.body.ref; // e.g., "refs/heads/main"
  if (branch === 'refs/heads/main') {
    exec('cd ../perfit && git pull origin main && cd server', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error changing directory or pulling from git: ${err.message}`);
        return res.status(500).send('Deployment failed at changing directory or git pull');
      }
      console.log(`Changed directory and pulled from git: ${stdout}`);
      console.warn(`STDERR:\n ${stderr}`);

      exec('npm install', (err, stdout, stderr) => {
        if (err) {
          console.error(`Error installing npm packages: ${err.message}`);
          return res.status(500).send('Deployment failed at npm install');
        }
        console.log(`NPM install: ${stdout}`);
        console.warn(`STDERR:\n ${stderr}`);

        exec('npm run build', (err, stdout, stderr) => {
          if (err) {
            console.error(`Error building project: ${err.message}`);
            return res.status(500).send('Deployment failed at npm run build');
          }
          console.log(`NPM run build: ${stdout}`);
          console.warn(`STDERR:\n ${stderr}`);

          exec('pm2 restart server', (err, stdout, stderr) => {
            if (err) {
              console.error(`Error restarting server: ${err.message}`);
              return res.status(500).send('Deployment failed at pm2 restart');
            }
            console.log(`PM2 restart: ${stdout}`);
            console.warn(`STDERR:\n ${stderr}`);

            res.send('Deployment successful');
          });
        });
      });
    });

  } else {
    res.send('No deployment triggered');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});