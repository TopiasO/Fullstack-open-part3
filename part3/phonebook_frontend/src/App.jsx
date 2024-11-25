import { useState, useEffect } from 'react'

import personService from './services/persons'

import sameName from './components/SameName'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import PersonsToShow from './components/PersonsToShow'
import Notification from './components/Notification'
 

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage]= useState(null)

  const hook = () => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }

  useEffect(hook, [])
  console.log('render', persons.length, 'persons')
 

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }


  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)


  }

  const handleDeleteClick = (id) => {
    const personToDelete = persons.find(p => p.id === id)

    console.log(personToDelete)

    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
        personService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter((person) => 
          person.id !== id))
          setSuccessMessage(`Removed ${personToDelete.name}`)
          setTimeout(() => setSuccessMessage(null), 4000)
        })
        .catch((error) => {
          setErrorMessage(`Person '${personToDelete.name}' was already removed from server`)
          setTimeout(() => setErrorMessage(null), 4000)
        })
    }
  }


  const addPerson = (event) => {
    event.preventDefault()


    if (sameName(persons, newName)) {

      let personToUpdate = persons.find(p => p.name === newName)
      console.log(personToUpdate)


      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personToUpdate.number = newNumber
        
        personService
        .update(personToUpdate.id, personToUpdate)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id === personToUpdate.id ? returnedPerson : person))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`'${newName}' number was updated succesfully`)
          setTimeout(() => setSuccessMessage(null), 4000)
          return;
          
        })
        .catch((error) => {
          setErrorMessage(`Information of '${newName}' was already removed from server`)
          setTimeout(() => setErrorMessage(null), 4000)
        })
      } else {
        return;
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
  
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`'${newName}' was added succesfully`)
          setTimeout(() => setSuccessMessage(null), 4000)
        })

    }


  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />
      <Filter newSearch={newSearch} 
      handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName}
      handleNameChange={handleNameChange} newNumber={newNumber}
      handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <PersonsToShow persons={persons} 
      newSearch={newSearch}
      handleDeleteClick={handleDeleteClick} />
    </div>
  )
}

export default App
