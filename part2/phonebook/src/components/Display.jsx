import Filter from './Filter'
import phonebookService from '../services/phonebookService'

const Display = ({ persons, filter, setFilter, setPersons, setErrorMessage }) => {
    const filteredPersons = persons.filter(person => {
        return person.name.toLowerCase().includes(filter.toLowerCase())
    })

    const handleDelete = (id) => {
        const person = persons.find(p => p.id === id)
        if (window.confirm(`Delete ${person.name}?`)) {
            phonebookService.remove(id)
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
                setErrorMessage('Information of this person has already been removed from server')
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
    }

    return (    
        <div>
            <Filter filter={filter} setFilter={setFilter} />
            {filteredPersons.map((person) => (
                <p key={person.name}>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button></p>
            ))}
        </div>
    )
}

export default Display