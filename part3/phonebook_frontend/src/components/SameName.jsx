
function sameName(array, name) { 
    return array.some((arrayValue) =>
      arrayValue.name === name)
  }
  

export default sameName