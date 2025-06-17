import phonebookService from '../services/phonebookService'
import { useState } from 'react'

const AddPerson = ({ persons, setPersons, setErrorMessage }) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }
    
    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (handleDuplicateName(newName)) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
                const existingPerson = persons.find(p => p.name === newName)
                phonebookService.update(existingPerson.id, { name: newName, number: newNumber })
                .then(response => {
                    console.log(response.data)
                    setErrorMessage(`${newName} has been updated`)
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000)
                })
                .catch(error => {
                    console.log(error)
                    setErrorMessage(`Information of ${newName} has already been removed from server`)
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000)
                })
                .finally(() => {
                    phonebookService.getAll().then(response => {
                        setPersons(response.data)
                    })
                })
            }
        } else {
            phonebookService.create({ name: newName, number: newNumber })
            .then(response => {
                console.log(response.data)
                setPersons(persons.concat(response.data))
                setErrorMessage(`${newName} has been added`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            })
            .catch(error => {
                console.log(error)
                setErrorMessage('Error adding new person')
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            })
        }
        setNewName('')
        setNewNumber('')
    }

    const handleDuplicateName = (name) => {
        return persons.some((person) => person.name === name)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>name: <input value={newName} onChange={handleNameChange} /></div>
            <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}

export default AddPerson