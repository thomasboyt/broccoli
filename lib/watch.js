var Watcher = require('./watcher')
var util = require('./util');

module.exports = watch
function watch (builder, outputDir, options) {
  options = options || {}

  var watcher = new Watcher(builder)
  var currentCopy = null;

  // We register these so the 'exit' handler removing temp dirs is called
  process.on('SIGINT', function () {
    process.exit(1)
  })
  process.on('SIGTERM', function () {
    process.exit(1)
  })

  watcher.on('change', function(dir) {
    console.log('Built')
    console.log(dir);

    // Don't allow two copies to happen simultaneously - chain off of existing copy
    if (currentCopy) {
      currentCopy = currentCopy.then(function() {
        return cleanAndCopy(dir, outputDir);
      });
    } else {
      currentCopy = cleanAndCopy(dir, outputDir);
    }
  })

  watcher.on('error', function(err) {
    console.log('Built with error:')
    // Should also show file and line/col if present; see cli.js
    console.log(err.stack)
    console.log('')
  })
}

function cleanAndCopy (dir, outputDir) {
  return util.rmDir(outputDir).then(function() {
    util.copyDir(dir, outputDir);
  });
}
