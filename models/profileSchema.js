const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    serverId: { type: String, require: true },
    balance: { type: Number, default: 100 },
})

const model = mongoose.model("finEdDB", profileSchema)

module.exports = model;