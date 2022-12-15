const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const URL = "mongodb://localhost:27017/new";

try {
    mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('connected to the database'));
} catch (error) {
    console.log(error);
}

const User = require('./schema/hobbies.js');
const { db } = require('./schema/hobbies.js');

app.get('/',
    cors(),
    async (req, res) => {
        const hobbies = await User.find();
        res.json(hobbies);
    }
);


app.post('/',
    cors(),
    async (req, res) => {
        try {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                hobbies: req.body.hobbies,
            })
            await newUser.save();
            res.send(req.body);
        } catch (error) {
            console.log(error);
        }
    }
);


app.delete('/',
    cors(),
    async (req, res) => {
        try {
            const b = await User.deleteOne({ phone: req.body.phone });
            res.send(b);
        } catch (err) {
            console.log(err)
        }
    }
);

app.put('/',
    cors(),
    async (req, res) => {
        console.log(req.body)
        const { name, phone, hobbies } = req.body;
        try {
            const a = User.collection.findOneAndUpdate({ phone: parseInt(phone) },
                { $set: { "name": name, "hobbies": hobbies } })
            res.send(a)
        } catch (err) {
            console.log('Error updating', err)
        }
    }
);

app.listen(PORT,
    () => {
        console.log(`Server is running at url: http://localhost:${PORT}`);
    }
);