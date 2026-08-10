require('dotenv').config()

const app = require('./app')
const config = require('./config/config')

app.listen(config.port, () => {
  console.log(`server started on port ${config.port}`)
})
