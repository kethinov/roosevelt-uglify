const UglifyJS = require('uglify-es').minify
const fs = require('fs')
const path = require('path')
const logger = app.get('logger')

module.exports = {
  parse: function (app, fileName) {
    let code = fs.readFileSync(path.join(app.get('jsPath'), fileName), 'utf-8')
    let options = app.get('params').js.compiler.params || {}
    let result
    let newJs
    let errors
    let warnings

    // make a copy of the params so the originals aren't modified
    options = JSON.parse(JSON.stringify(options))

    // port showWarnings param over to uglify params
    if (app.get('params').js.compiler.showWarnings) {
      options.warnings = true
    }

    result = UglifyJS(code, options)
    newJs = result.code
    errors = result.error

    // only populated when warnings option passed
    warnings = result.warnings

    if (warnings) {
      logger.warn('⚠️  UglifyJS Warnings:'.bold.yellow)
      logger.warn(warnings)
    }

    if (errors) {
      throw errors
    }

    return newJs
  }
}
