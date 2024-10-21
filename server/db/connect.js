import mongoose from "mongoose";
import ENV from '../config.js'

const DB = `mongodb+srv://${ENV.MONGO_USER}:${ENV.MONGO_PASS}@aus.itwbo.mongodb.net/Contact?retryWrites=true&w=majority`

const connect = async () => {
  const database = await mongoose.connect(DB, {
    // useNewUrlParser: true, useUnifiedTopology: true
  }).then(() => {
    console.log('Database connected successfully');
  }).catch((err) => { console.error('Database connection error:', err); });
  return database;
}



export default connect 