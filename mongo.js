require('dotenv').config();
const mongoose = require('mongoose')

// Command line argument check
if (process.argv.length < 3) {
    throw new Error('enter a password')
    process.exit(1)
}

const password = process.argv[2]

const url = process
    .env
    .MONGODB_URI
    .replace(password, process.env.DB_PASSWORD);

mongoose.set('strictQuery', false)

mongoose.connect(url, {connectTimeoutMS: 10000}) // timeout after 10 seconds
    .then(() => {
    console.log('MongoDB connected')
    console.log('--------')
}).catch(err => console.error('MongoDB connection error:', err));

// Schema and model defintion
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 8,
        required: true,
    }, 
    number: {
        type: String,
        validate: {
            validator: v => {
                const regex = /\d{2,3}-\d+/
                return regex.test(v)
            },
            message: props => `Please enter a valid phone number, ${props.value} is invalid`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject
            ._id
            .toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
