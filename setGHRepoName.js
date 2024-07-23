import { writeFileSync } from 'fs';
import { cwd } from 'process';
import { sep } from 'path';

// Get the current working directory
const currentDir = cwd();
console.log('Directory name: ', currentDir);

// Extract the repository name from the current directory path
const repoName = currentDir.split(sep).pop();
const envFilePath = `${currentDir}${sep}.env`;

// Write the environment variable to a .env file
writeFileSync(envFilePath, `VITE_REPO_NAME=${repoName}\n`, { flag: 'w' });

console.log(`.env file created at ${envFilePath}`);
console.log(`VITE_REPO_NAME set to ${repoName}`);
