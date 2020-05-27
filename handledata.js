const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbName = 'contacts';
const url = "mongodb://localhost:27017";
const data ={
    db : null
};
let options = { useNewUrlParser : true, useUnifiedTopology: true };

const client = new MongoClient(url, options);

const connect = (param) => {
    client.connect((err)=>{

        if(err){ param(err)}
    
        else {
            console.log("connected successfully to the server");
             data.db = client.db(dbName);
             param();    
        }
    }) 
}

const getData = () => data.db;

const getKey = (_id) => {
    return ObjectID(_id);
};

module.exports = {connect, getData, getKey};