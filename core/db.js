const mongoose = require('mongoose');


const url = `mongodb+srv://reubz:<password>@cluster0.dwt2jnx.mongodb.net/dental?retryWrites=true&w=majority`
  .replace('<password>', '12345678r')


mongoose.connect(url, {
  useNewUrlParser: true,
})
  .then(() => {
      console.log(`db connected!`)
  })
  .catch(err => console.log(err.message))


process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  console.log('UNHANDLED REJECTION! Shutting down ...')
  server.close(() => {
    process.exit(1)
  })
})
