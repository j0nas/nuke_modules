const fs = require('fs');
const path = require('path');

const pkgDir = require('pkg-dir');
const readDirEnhanced = require('readdir-enhanced');
const rimraf = require('rimraf');

const existsAsync = path =>
    (new Promise((resolve, reject) =>
        fs.access(path, error => !error ? resolve(path) : reject(error))
    ));

pkgDir(process.cwd())
    .then(rootDir => existsAsync(path.join(rootDir, 'node_modules')))
    .then(existingNodeModulesPath => readDirEnhanced.async(existingNodeModulesPath).then(files => files.map(file => path.join(existingNodeModulesPath, file))))
    .then(files => {
        files.forEach((file, index) => {
            rimraf.sync(file);
            console.log("Deleting: " + index + "/" + files.length);
        })
    })
    .catch(err => console.error("An error occurred:", err));
