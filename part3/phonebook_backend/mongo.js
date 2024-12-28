require('dotenv').config()
const mongoose = require('mongoose')


if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const url = process.env.MONGODB_URI


mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  person_name: String,
  phone_number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.person_name} ${person.phone_number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const person = new Person({
    person_name: process.argv[3],
    phone_number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`added ${person.person_name} number ${person.phone_number} to phonebook`)
    mongoose.connection.close()
  })
}




//note.save().then(result => {
//console.log('note saved!')
//mongoose.connection.close()
//})