const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000
app.use(cors());
app.use(express.json())
const ObjectID = require('mongodb').ObjectID;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.17hrv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventsCollection = client.db("volunteer-network2").collection("events");
    const registrationsCollection = client.db("volunteer-network2").collection("registrations");

    app.get('/events', (req, res) => {
        eventsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/event/:id', (req, res) => {

        const { id } = req.params;

        eventsCollection.find({_id: ObjectID(id)})
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/addRegistration', (req, res) => {
        const registration = req.body;
        registrationsCollection.insertOne(registration, (err, result) => {
            res.send({count: result.insertedCount})
        })
    })

    app.get('/registrations', (req, res) => {
        registrationsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/registrationByEmail', (req, res) => {
        const {email} = req.body;
        registrationsCollection.find({email: email})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addEvent', (req, res) => {
        const event = req.body;
        eventsCollection.insertOne(event, (err, result) => {
            res.send({count: result.insertedCount})
        })
    })

    app.delete('/registrationDelete/:id', (req, res) => {
        const id = req.params.id;
        registrationsCollection.deleteOne({_id: ObjectID(id)})
        .then(result => {
            res.send({count: result.deletedCount})
        })
    })

    // app.post('/addEvents', (req, res) => {
    //     const events = req.body;
    //     console.log(events.length);
    //     eventsCollection.insertMany(events, (err, result) => {
    //         console.log(err, result.insertedCount);
    //     })
    // })

});

app.listen(port);