const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })



function num_valid (phone_number) {
  //"^" start of the string
  //"(?=.{8,})" Positive look ahead that checks if ".{8,}" is valid
  //"." matches all characters except line break.
  //"{8,}" matches the previous token between 8 and infinite times.
  //If the positive lookahead is valid it proceeds to latter part of the regex.
  //The positive look ahead uses no characters so the latter part basically functions as /^\d{2,3}-\d{5,}/
  //"\d" matches digits and {2,3} matches the previous token 2-3 times.
  //"-" matches "-" in the string.
  //"\d{5,}$" matches digits between 5 and infite times and "$" marks the end of the string

  //TLDR; The look ahead checks if the string is atleast 8 characters long.
  //If yes it proceeds to the latter half of the regex without spending any characters.
  //The latter half checks that the string starts with 2-3 digits followed by a hyphen "-"
  //and ends with 5 to infinite digits.

  //".test("phone_number")" returns true if "phone_number" matches the regex
  //and false if it doesn't.
  return /^(?=.{8,})\d{2,3}-\d{5,}$/.test(phone_number)
}

const custom = [num_valid, 'Some message']

const personSchema = new mongoose.Schema({
  person_name: {
    type: String,
    minLength: 3,
    required: true
  },
  phone_number: {
    type: String,
    validate: num_valid,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})


module.exports = mongoose.model('Person', personSchema)