let babel = require('@babel/core')
let loaderUtils = require('./loaderUtils')

function loader (source) { // this => loaderContext
  console.log(source)
  let options = loaderUtils.getOptions(this)
  let cb = this.async();
  babel.transform(source, {
    ...options,
    sourceMap: true,
    filename: this.resourcePath.split('/').pop()
  }, function (err, result) {
    cb(err, result.code, result.map)
  })
}

module.exports = loader
