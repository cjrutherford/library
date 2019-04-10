const router = require('express').Router();

module.exports = () => {

    router.get('/', async (req,res) => {
        res.json(await getList());
    });

    router.post('/', async (req,res) => {
        const data = setModel(req.body);
        res.json(data);
    });

    router.delete('/:modelId', (req,res) => {
        deleteModel(req.params.modelId);
        res.json('Succcess');
    });
    return router;
};