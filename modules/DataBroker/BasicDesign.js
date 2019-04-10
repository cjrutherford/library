const express = require('express');
const app = express();
const Keyv = require('keyv');
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017';
const uuid = require('uuid');

const modelSchema = require('./Schema');

const modelSample = [
    {
        id: uuid.v4(),
        name: "Calamity Janes Combat Simulations"
    },
    {
        name: "Bullfrog Entertainment"
    }
];

const firstModel = new Keyv(mongoURI, {
    namespace: 'FirstModel'
});

firstModel.on('error', err => console.error(err));

firstModel.set('idList', []);
console.log('initialized ID List');

const generateKey = () => {
    return uuid.v4();
}

const updateList = (...idList) => {
    firstModel.get('idList').then(list => {
        console.log(`Adding ${idList} to the ID List`);
        firstModel.set('idList', [...list, ...idList]);
    });
};

const setModel = (model) => {
    //check if the model already has an ID.
    model.id = model.id === undefined ? generateKey() : model.id;

    //check if the model matches the schema
    return modelSchema.validate(model).then(result => {
        console.log(result);
        firstModel.set(model.id, result);
        updateList(model.id);
        return result;
    }).catch(err => console.error(err));
}

const getList = async () => {
    return await firstModel.get('idList');
}

const deleteModel = (modelId) => {
    firstModel.get('idList').then(list => {
        firstModel.set('idList', list.filter(i => i !== modelId));
        firstModel.delete(modelId);
        console.log(`ID: ${modelId} is now lost to the sands of time.`);
    });
}

modelSample.forEach(s => {
    setModel(s);
});

app.use((req,res, next) => {
    console.log(`Received a ${req.method} request from ${req.ip} for ${req.url}`);
    next();
});


app.use('/model', require('./Routes'));


const port = process.env.PORT || 3200;
app.listen(port, (err) => {
    if(err) console.error(err);
    console.log('Listening on port: ' + port + ' !');
});