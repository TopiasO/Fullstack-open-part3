require('dotenv').config()
const http = require('http')
const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


//app.use((req, res, next) => {
//    if (req.method === "POST") {
//        morgan(':method :url :status :res[content-length] - :res-time ms :body')(req, res, next)
//    } else {
//        morgan('tiny')(req, res, next)
//    }
//})

//const logOnlyPost = (req, res) => req.method !== "POST";
//app.use(morgan('tiny'))
//app.use(morgan(':body', { skip: logOnlyPost }))

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())



morgan.token('body', req => {
  return JSON.stringify(req.body)
})


app.use(morgan(function (tokens, req, res) {
  if (tokens.method(req, res) === 'POST') {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req, res),
    ].join(' ')
  } else {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }
}))


const getCurrentDate = () => {
  return new Date()
}

app.get('/info', (req,res) => {
  const DateNow = getCurrentDate()
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><br></br>
      <p>${DateNow}</p>`)
  })
})


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})


app.get('/api/persons/:id' ,(req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {

      if (person) {
        res.send(person)
      } else {
        res.status(404).end()
      }
    })

    .catch(error => next(error))
})


app.put('/api/persons/:id', (req, res, next) => {
  const { person_name, phone_number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { person_name, phone_number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.person_name || !body.phone_number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    person_name: body.person_name,
    phone_number: body.phone_number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })

    .catch(error => next(error))
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
  console.log(error.name)
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})