const express = require('express');
const {Customer, validate} = require('../../schema/customer');

const router = express.Router();

router.get('/', async(req,res)=>{
    try{
       const customers = await Customer.find({}).sort({name: 1});
       res.send(customers); 
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

router.get('/:id', async(req,res)=>{
    try{
    const user = await Customer.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
    }catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.post('/', async(req,res)=>{
    try {
        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        let newUser = new Customer ({...req.body});
        newUser = await newUser.save();
        res.send(newUser);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.put('/:id', async(req,res)=>{
    try{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    delete req.body._id ;
    const update = await Customer.findByIdAndUpdate(req.params.id,
        {$set:{...req.body}},
        {new:true}
    );
    if (!update) return res.status(404).send('Failed to delete, User not found');
    res.send(update);
    } catch (err){
        console.log(err);
        res.status(500).send(err);
    }
})

router.delete('/:id', async(req,res)=>{
    try {
        const userRemoved = await Customer.findByIdAndRemove(req.params.id);
        if(!userRemoved) return res.status(404).send('Failed to delete, User not found');
        res.send({status:'Successfully removed', user: userRemoved});
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

module.exports = router; 