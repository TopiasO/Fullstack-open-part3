const http = require('http')
const express = require('express')
var morgan = require('morgan')
const app = express()



//app.use((request, response, next) => {
//    if (request.method === "POST") {
//        morgan(':method :url :status :res[content-length] - :response-time ms :body')(request, response, next)
//    } else {
//        morgan('tiny')(request, response, next)
//    }
//})



//const logOnlyPost = (req, res) => req.method !== "POST";
//app.use(morgan('tiny'))
//app.use(morgan(':body', { skip: logOnlyPost }))



morgan.token('body', request => {
    return JSON.stringify(request.body)
})


app.use(morgan(function (tokens, req, res) {
    if (tokens.method(req, res) === "POST") {
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



app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id' ,(request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => Number(person.id) === id)

    if (person) {
        response.send(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const getCurrentDate = () => {
    return new Date();
}

app.get('/info', (request,response) => {
    const length = JSON.stringify(persons.length)
    const DateNow = getCurrentDate()
    response.send(`<p>Phonebook has info for ${length} people</p><br></br>
        <p>${DateNow}</p>`)
})

const generateId = () => {
    return Math.floor(Math.random() * 100000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const foundPerson = persons.find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (foundPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: JSON.stringify(generateId()),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})