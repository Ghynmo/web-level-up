const { MongoClient } = require("mongodb");
// Connection URI
const uri =
  "mongodb+srv://Zyro:Qwerty123456Zyro@cluster0.brzit.mongodb.net/?retryWrites=true&w=majority"
const dbName = 'Pointhub'
// Create a new MongoClient
const client = new MongoClient(uri, {
    useNewUrlParser : true,
    useUnifiedTopology: true
});



client.connect((error, client)=> {
    if (error){
        return console.log('fail to connect the database')
    }
    // const db = client.db(dbName)

    // db.collection('users').insertOne(
    //     {
    //         firstname : "Boy"
    //     },
    //     (error, result) => {
    //         if (error) {
    //             callback('Error writing to new file');
    //         }
    //         console.log(result)
    //     }
    // )
})

var lib = {}
const db = client.db(dbName)

lib.create = function(data,callback){
    
    db.collection('users').insertOne(
        {
            firstname : "BRO"
        },
        (error, result) => {
            if (error) {
                callback('Error writing to new file');
            }
            console.log(result)
        }
    )
}

lib.read = function(data,callback){
    
    db.collection('users').find(
    data
    ).toArray((error, result)=> {
        if (result == []){
            callback('not found');
        }
    })
}


// lib.updates = function(collection,data,callback){
    
//     db.collection(collection).find(
//         {
//             phone: data.phone
//         },
//         (error, result) => {
//             if (error) {
//                 callback('Error updates to new file');
//             }
//             console.log(result)
//         }
//     )
// }


module.exports = lib;