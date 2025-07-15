require('dotenv').config() // Load environment variables from .env file
const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3] || null
const number = process.argv[4] || null

const DB_NAME = 'phonebookApp'

const url = `mongodb+srv://fullstack:${password}@cluster0.xlabd.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

// Create a connection to the MongoDB database
console.log(`Connecting to MongoDB at ${url}`)
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Create a model for the person schema -> this will create a collection named 'people' (and not 'persons') in the database and provide methods to interact with it
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // If only the password is provided, list all persons in the database
  console.log('Phonebook:')
  Person.find({})
    .then(persons => {
      if (persons.length === 0) {
        console.log('No entries found in the phonebook.')
        mongoose.connection.close()
        return
      }
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch(error => {
      console.error('Error fetching persons:', error)
      mongoose.connection.close()
    })
  return
}

// Save a new person to the database if name and number are provided
const person = new Person({
  name: name,
  number: number,
})

person.save()
  .then(result => {
    console.log('result', result)
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
  .catch(error => {
    console.error('Error saving person:', error)
    mongoose.connection.close()
  })