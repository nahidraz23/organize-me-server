const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5300
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

// middlewares
app.use(cors())
app.use(express.json())

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rv3rk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function run () {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const eventCollection = client
      .db('OrganizeMeDB')
      .collection('eventCollection');

    app.get('/events', async (req, res) => {
      const result = await eventCollection.find().toArray();
      res.send(result);
    })

    app.get('/event/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await eventCollection.findOne(query);
      res.send(result);
    })

    app.post('/events', async (req, res) => {
      const event = req.body
      // console.log(events)
      const result = await eventCollection.insertOne(event)
      res.send(result)
    })

    app.delete('/events/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await eventCollection.deleteOne(query);
      res.send(result)
    })

    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Organize me server is running')
})

app.listen(port, () => {
  console.log(`Organize me server is running on port: ${port}`)
})
