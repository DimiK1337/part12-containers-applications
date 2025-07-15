import { useState, useEffect } from 'react'

import personService from "./services/persons"

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [filterQuery, setFilterQuery] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState({ message: null, isError: false })

  const hook = () => {
    personService
      .getAllPersons()
      .then(initialPersons => setPersons(initialPersons))
  }
  useEffect(hook, [])

  const clearForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const clearNotification = () => setTimeout(() => {
    setNotification({
      message: null,
      isError: false
    })
  }, 5000)

  const addName = (event) => {
    event.preventDefault()

    const newPerson = { name: newName, number: newNumber }

    // Update the phone number if the person is already in the phonebook
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      const shouldUpdateNumber = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (!shouldUpdateNumber) return

      personService
        .updatePerson(existingPerson.id, newPerson)
        .then(
          returnedPerson => {
            setNotification({
              message: `'${returnedPerson.name}' has changed their number to '${returnedPerson.number}'`,
              isError: false
            })
            clearNotification()

            setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))
            clearForm()
          }
        )
        .catch(error => {
          if (error.response.data.error) console.error(error.response.data.error)
          setNotification({
            message: `Information of '${existingPerson.name}' has already been removed from server`,
            isError: true
          })
          clearNotification()

          setPersons(persons.filter(person => person.id !== existingPerson.id))
        })

      return
    }

    personService
      .createPerson(newPerson)
      .then(returnedPerson => {
        setNotification({
          message: `Added '${returnedPerson.name}'`,
          isError: false
        })
        clearNotification()

        setPersons(persons.concat(returnedPerson))
        clearForm()
      })
      .catch(error => {
        if (error.response.data.error) console.error(error.response.data.error)
        setNotification({
          message: `Person validation failed - ${error.response.data.error}`,
          isError: true
        })
        clearNotification()
      })
  }

  const deleteName = (event) => {
    const personToDelete = persons.find(person => person.id === event.target.value)
    const shouldDeletePerson = window.confirm(`Delete '${personToDelete.name}'?`)

    if (!shouldDeletePerson) return

    personService
      .deletePerson(personToDelete.id)
      .catch(error => {
        if (error.response.data.error) console.error(error.response.data.error)
      })


    personService
      .getAllPersons()
      .then(returnedPersons => setPersons(
        returnedPersons.filter(person => person.id !== personToDelete.id)
      ))
      .catch(error => {
        if (error.response.data.error) console.error(error.response.data.error)
      })
  }

  const handleFilterQueryChange = (event) => setFilterQuery(event.target.value)
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const personFormProps = {
    addName,
    newName,
    handleNameChange,
    newNumber,
    handleNumberChange
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} isError={notification.isError} />
      <Filter value={filterQuery} onChange={handleFilterQueryChange} />

      <h2>Add a new</h2>
      <PersonForm {...personFormProps} />

      <h2>Numbers</h2>
      <Persons persons={persons} filterQuery={filterQuery} onDelete={deleteName} />
    </div>
  )
}

export default App