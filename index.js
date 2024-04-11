const express = require('express')
const app = express()

app.use(express.json())

let notes = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    }, {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    }, {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    }, {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

// Sends back a page with some text written in it//
app.get('/info', (request, response) => {
    date = Date()
    response.send('<p> Phonebook has info for 2 people <br> ' + date + '</p>')
})

// Sends back JSON data with names, numbers and ids''
app.get('/api/persons', (request, response) => {
    response.json(notes)
})

// Sends back individual JSON data //
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => String(note.id) === id)
    if (id > notes.length) {
        return response
            .status(404)
            .send('Invalid ID number, please enter a different number')
    } else {
        response.json(note)
    }
})

// Deletes individual person data //
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    console.log(notes)

    response
        .status(204)
        .end()
})

// Generates new id based on amount of id's 
const generateID = () => {
    const maxID = notes.length > 0
        ? Math.max(...notes.map(note => note.id))
        : 0
    return maxID + 1
}

// Edits person data, if content is missing, input fields are missing, or duplicate names are entered
// the code returns an error message with instructions
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body) {
        return response.status(400).json(
            { error: 'content missing' }
        )
    }

    if (body.name === '' || body.number == '') {
        return response.status(400).json(
            { error: 'Please fill out all fields' }
        )
    }

    if (notes.map(note => note.name).includes(body.name)) {
        return response.status(400).json(
            {error: 'name must be unique'}
        )
    }

    note = {
        "id": generateID(),
        "name": body.name,
        "number": body.number
    }

    notes = notes.concat(note)

    response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
