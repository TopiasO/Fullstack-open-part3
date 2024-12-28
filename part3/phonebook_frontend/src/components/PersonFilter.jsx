
function personFilter(array, Search) { 
    return array.filter((arrayValue) =>
  arrayValue.person_name.toLowerCase().includes(Search.toLowerCase()))
  }



export default personFilter