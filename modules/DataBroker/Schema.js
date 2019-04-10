const Schema = require('schm');


const modelSchema = Schema({
    id: {
        type:String,
        required: true,
        unique: true
    },
    name: String,
    date: Date.now()
});

module.exports = modelSchema;