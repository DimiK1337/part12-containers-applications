require('dotenv').config()

const express = require('express')
const app = express()

const morgan = require('morgan')

const Person = require('./models/person')

/* MIDDLEWARE (Before route definitions) */
app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))


/* ENDPOINTS */

// GET
app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.countDocuments({})
    .then(count => {
      res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
    })
    .catch(error => next(error)) // Pass error to the error handler
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(returnedPersons => {
      res.json(returnedPersons)
    })
    .catch(error => next(error)) // Pass error to the error handler
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error)) // Pass error to the error handler
})

// POST
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const { name, number } = body
  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }

  const newPerson = Person({
    name: name,
    number: number,
  })

  newPerson.save()
    .then(savedPerson => {
      res.status(201).json(savedPerson)
    })
    .catch(error => next(error)) // Pass error to the error handler
})

// PUT
app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const { name, number } = body
  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }

  const person = {
    name: name,
    number: number,
  }

  // Find the person by ID and update it, returning the updated document (new:true)
  // and running validators to ensure the updated document is valid
  Person.findByIdAndUpdate(id, person, { new:true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (!updatedPerson) {
        return res.status(404).send({ error: 'Person not found' })
      }
      res.json(updatedPerson)
    })
    .catch(error => next(error)) // Pass error to the error handler
})

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error)) // Pass error to the error handler
})

/* MIDDLEWARE (POST ROUTES) */
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformed ID' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}\nURL: http://localhost:${PORT}/`)
})
