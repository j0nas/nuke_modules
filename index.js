const fs = require('fs');
const path = require('path');

const pkgDir = require('pkg-dir');
const readDirEnhanced = require('readdir-enhanced');
const rimraf = require('rimraf');
const logUpdate = require('log-update');

const existsAsync = path =>
    (new Promise((resolve, reject) =>
        fs.access(path, error => !error ? resolve(path) : reject(error))
    ));

let nodeModulesPath;

pkgDir(process.cwd())
    .then(rootDir => existsAsync(path.join(rootDir, 'node_modules')))
    .then(existingNodeModulesPath => nodeModulesPath = existingNodeModulesPath)
    .then(() => readDirEnhanced.async(nodeModulesPath))
    .then(files => files.map(file => path.join(nodeModulesPath, file)))
    .then(files => [].concat(files, nodeModulesPath))
    .then(files => files.forEach((file, index) => {
        logUpdate(`Deleting: ${index + 1}/${files.length}`);
        rimraf.sync(file);
    }))
    .catch(err => console.error("An error occurred:", err));
