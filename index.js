
// require the express module and create an express app and a port
const express = require('express');
const app = express();
const port = 5000;
// require cors 
const cors = require('cors');
// json parser
app.use(express.json());
app.use(cors());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// conncet to mongodb database
const uri = "mongodb+srv://busAdmin:busAdmin@cluster0.pucpolg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const availableSeats = client.db("busTicket").collection("availableSeats");
const boookseat = client.db("busTicket").collection("bookSeat");
// create a route to get all the data from the database

 const run = () => {
// api for available seats
    app.get('/availableSeats', async (req, res) => {
        const cursor = availableSeats.find({});
        const result = await cursor.toArray();
        res.send(result);
    })
    // api for booked seats
    app.post('/bookSeat', async (req, res) => {
        const seat = req.body;
        const id = seat.bookId;
        const findBooked = await boookseat.findOne({ bookId: id });
        if (findBooked) {
            return res.status(403).send({ message: "This seat is already booked" })
        }
        else{
            const updatingBooked = await availableSeats.updateOne({ _id:ObjectId(id) },{ $set:{ book: "true" } })
            const result = await boookseat.insertOne(seat);
            console.log(result);
            res.send(result);
        }
       
    })

 }
 run()
 

// listen to the port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})