
const Person = ({ person, handleDeleteClick }) => {

    return (
      <div>
        {person.person_name} {person.phone_number}
        <button onClick={handleDeleteClick}>delete</button>
      </div>
    )
  }
  
export default Person