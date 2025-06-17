import { useState, useEffect } from 'react'
import AddPerson from './components/AddPerson'
import Display from './components/Display'
import phonebookService from './services/phonebookService'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <div className='error'>{message}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    phonebookService.getAll().then(response => {
      setPersons(response.data)
    })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <h2>Add a new</h2>
      <AddPerson persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage} />
      <h2>Numbers</h2>
      <Display persons={persons} filter={filter} setFilter={setFilter} setPersons={setPersons} setErrorMessage={setErrorMessage} />
    </div>
  )
}

export default App