import personFilter from "./PersonFilter"
import Person from "./Person"

const PersonsToShow = ({persons, newSearch, handleDeleteClick}) => {

    const personsToShow = personFilter(persons, newSearch)

    

    return (
        <div>
            {personsToShow.map(person =>
            <Person key={person.id} 
            person={person} 
            handleDeleteClick={() => handleDeleteClick(person.id)}/>
        )}
        </div>
    )
}

export default PersonsToShow