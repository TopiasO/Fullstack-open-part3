
const Person = ({ person, handleDeleteClick }) => {

    return (
      <div>
        {person.name} {person.number}
        <button onClick={handleDeleteClick}>delete</button>
      </div>
    )
  }
  
export default Person