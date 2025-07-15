const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minLength: 3
  },
  number: {
    required: true,
    type: String,
    minLength: 8,
    set: v => v.replace(/\s+/g, '' ), // Remove any whitespace from the number (there shouldn't be any in the first place) using Regex validation
    validate: {
      validator: (val) => /\d{2,3}-\d{5,}/g.test(val)
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person