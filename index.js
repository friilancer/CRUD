const express = require("express");
const path = require('path');
const db = require('./handledata');


const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
const collection ="todo";

app.get('/todos', (req, res) => {
    db.getData().collection(collection).find().toArray((err, data) => {
        if (err) throw err;
        else {
          res.json(data);
        }
    })
});


app.put('/:id', (req, res) => {
    const todoID = req.params.id;
    const inputs = req.body;

    db.getData().collection(collection).findOneAndUpdate({_id : db.getKey(todoID)}, {$set : {todo : inputs.todo}}, (err, data) =>{
        if (err) throw err;
        else {
            res.json(data)
        }
    });
});

app.post('/', (req, res) => {
    const input = req.body;

    db.getData().collection(collection).insertOne(input, (err, data) => {
        if (err) throw err;
        else{
            res.json({data : data, docs : data.ops[0]})
        }
    })
})

app.delete('/:id', (req, res) => {
    const todoId = req.params.id;
    db.getData().collection(collection).deleteOne({_id : db.getKey(todoId)}, (err, data) => {
        if(err) throw err;
        else{
            res.json(data);
        }
    })
})

const PORT = process.env.PORT || 5000;

db.connect((err) =>{
    if(err){
        console.log('unable to connect to the database');
    }
    else{
        app.listen(PORT, () => console.log("connected to database"));
    }
    
})