const mongoose = require('mongoose');

const connectDB = async()=> {
    await mongoose.connect(process.env.MONGO_URI,{

        useNewUrlParser: true, 
        
        useUnifiedTopology: true 
        
        },
        (err) => {
         if(err) console.log(err) 
         else console.log("mongdb is connected");
        });
    console.log("Mongo DB connected !!! ")
};
module.exports = connectDB