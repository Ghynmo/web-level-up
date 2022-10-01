const { MongoClient } = require("mongodb");
// Connection URI
const uri =
  "mongodb+srv://Zyro:Qwerty123456Zyro@cluster0.brzit.mongodb.net/?retryWrites=true&w=majority"
const dbName = 'Pointhub'
// Create a new MongoClient
const client = new MongoClient(uri);


// async function run() {
//     try {
//       const database = client.db(dbName);
//       const users = database.collection('users');
//       // Query for a movie that has the title 'Back to the Future'
//       const query = { firstname: "Boy" };
//       const user = await users.findOne(query);
//       console.log(user);
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
// run().catch(console.dir);

// client.connect((error, client)=> {
//     if (error){
//         return console.log('fail to connect the database')
//     } else {
//         return console.log('success to connect the database')
//     }
// })
var lib = {}

lib.read = async function run(data, callback) {
    try {
      const database = client.db(dbName);
      const users = database.collection('users');
      // Query for a movie that has the title 'Back to the Future'
      const query = { firstname: "Boy" };
      const user = await users.findOne(query);
      console.log(user);
      callback('success get data')
    }finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
// run().catch(console.dir);

// lib.create = client.connect(function(data,callback){
    
//     db.collection('users').insertOne(
//         data,
//         (error, result) => {
//             if (error) {
//                 callback('Error writing to new file');
//             }
//             console.log(result)
//         }
//     )
// })

// lib.read = function(data,callback){
    
//     db.collection('users').find(
//     data
//     ).toArray((error, result)=> {
//         if (error) {
//             callback('Error writing to new file');
//             console.log('Error writing to new file');
//         }
//         if (result == []){
//             callback('not found');
//             console.log('not found');
//         } else {
//             callback('0000000000')
//             console.log('0000000000')
//         }
//     })
// }


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