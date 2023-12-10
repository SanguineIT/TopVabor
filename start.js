const { exec } = require('child_process');

// Set the desired directory
const targetDirectory =
  'C:\\Inetpub\\vhosts\\microlent.com\\restroreff.microlent.com';

// Run npm install with the --legacy-peer-deps flag
exec(
  `npm install --cache npm-cache  --legacy-peer-deps`,
  { cwd: targetDirectory },
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing npm install: ${error}`);
      return;
    }

    // Log the output
    console.log(`npm install output:\n${stdout}`);

    if (stderr) {
      console.error(`npm install error:\n${stderr}`);
    }
  },
);
