
const {alias} = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias({
    '@components': 'src/components',
    '@common' : 'src/common'
  })(config)

  return config
}