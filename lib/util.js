var RSVP = require('rsvp')
var ncp = require('ncp')
var fs = require('fs')
var rimraf = require('rimraf')

exports.copyDir = function (dir, outputDir) {
  try {
    fs.mkdirSync(outputDir)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
    console.error('Error: Directory "' + outputDir + '" already exists. Refusing to overwrite files.')
    process.exit(1)
  }
  return RSVP.denodeify(ncp)(dir, outputDir, {
    clobber: false,
    stopOnErr: true
  })
}

exports.rmDir = function (dir) {
  return RSVP.denodeify(rimraf)(dir)
}
