var glob = require("glob")

let distFiles = glob.sync('**/*.*', { cwd: 'dist' })
var ONE_WEEK_IN_SEC = 60 * 60 * 24 * 7;

module.exports = function(deployTarget) {
  console.log('\n TARGET: ', deployTarget)

  var ENV = {}
  ENV["revision-data"] = {
    distDir: 'dist',
    distFiles: distFiles
  }

  ENV['s3'] = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: `black-jet-${deployTarget}`,
    region: 'us-west-2',
    distDir: 'dist',
    distFiles: distFiles,
    cacheControl: `max-age=60, s-maxage=${ONE_WEEK_IN_SEC}, public`
  }

  ENV['s3-index'] = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: `black-jet-${deployTarget}`,
    region: 'us-west-2',
    distDir: 'dist'
  }
  return ENV
}
