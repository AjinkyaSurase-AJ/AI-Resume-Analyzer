require('dotenv').config()

const app = require('./app')
const config = require('./config/config')

app.listen(config.port, "0.0.0.0",() => {
  console.log(`server started on port ${config.port}`)
})
