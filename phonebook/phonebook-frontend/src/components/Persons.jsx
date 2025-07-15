
const Persons = ({ persons, filterQuery, onDelete }) => {
    const peopleToShow = persons.filter(person => person.name.toLowerCase().includes(filterQuery.toLowerCase()))
    return (

        peopleToShow.map(person => {
            return (
                <div key={person.id}>
                    {person.name} : {person.number}
                    <button onClick={onDelete} value={person.id}>delete</button>
                </div>
            );
        })
    );
}

export default Persons