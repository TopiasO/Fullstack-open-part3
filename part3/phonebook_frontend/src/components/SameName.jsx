
function sameName(array, name) { 
    return array.some((arrayValue) =>
      arrayValue.person_name === name)
  }
  

export default sameName