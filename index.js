require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./mongo.js')
var morgan = require('morgan')

morgan.token('date', function getBody(req, res) {
    return Date().substring(0, 25)
})

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status - :response-time ms on :date'))
app.use(cors())

// Sends back JSON data with names, numbers and ids//
app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

// Get individual person data //
app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response
                    .status(400)
                    .end
            }
        })
        .catch(error => next(error))

})

// Delete individual JSON data //
app.delete('/api/persons/:id', async(req, res) => {
    const deletedPerson = await Person.findByIdAndDelete({_id: req.params.id})
    if (!deletedPerson) {
        res
            .status(404)
            .json({error: "Person not found"})
    } else {
        const updatedPersons = await Person.find({})
        res
            .status(200)
            .json(updatedPersons)
    }
})

// Edits person data, if content is missing, input fields are missing, or
// duplicate names are entered the code returns an error message with
// instructions
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (body.name === '' || body.number == '') {
        return res.status(400).json({ error: "Name and number are required" });
    }

    const person = new Person({"name": body.name, "number": body.number})
    person
        .save()
        .then(result => {
            console.log('note saved!')
            return Person.find({})
        })
        .then(AllPersons => {
            response.json(AllPersons)
        })
        .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response
            .status(400)
            .send({error: 'malformatted id'});
    } else if (error.name === 'ValidationError') {
        console.log('error')
        return response
            .status(400)
            .json({error: error.message});
    } else {
        return response
            .status(500)
            .json({error: 'Internal server error'});
    }
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})