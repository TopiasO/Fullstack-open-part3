
function personFilter(array, Search) { 
    return array.filter((arrayValue) =>
  arrayValue.name.toLowerCase().includes(Search.toLowerCase()))
  }



export default personFilter