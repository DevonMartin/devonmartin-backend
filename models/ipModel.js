import mongoose from "mongoose";

const schema = mongoose.Schema({
    ip: String,
    city: String,
    region: String,
    visits: Number
});

let ipModel = mongoose.model("ip", schema);

export default ipModel;
