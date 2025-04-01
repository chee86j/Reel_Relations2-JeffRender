const express = require('express');
const app = express.Router();
const { User } = require('../db');

app.get('/', async(req, res, next)=>{
    try{
        const user = await User.findAll();
        res.send(user)
    }catch(er){
        next(er);
    }
})

app.get('/:id', async(req, res, next)=>{
    try{
        const user = await User.findByPk(req.params.id);
        res.send(user);
    }catch(er){
        next(er);
    }
})

app.post('/', async(req, res, next)=>{
    try{
        console.log('Registration request:', JSON.stringify(req.body, null, 2));
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch(ex){
        // Handle Sequelize validation errors
        if (ex.name === 'SequelizeUniqueConstraintError') {
            const field = ex.errors[0].path;
            res.status(400).json({ 
                error: `${field === 'username' ? 'Username' : 'Email'} is already taken`
            });
        } else if (ex.name === 'SequelizeValidationError') {
            res.status(400).json({ 
                error: ex.errors[0].message 
            });
        } else {
            next(ex);
        }
    }
})

app.put('/:id', async(req, res, next)=>{
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).send('User not found');
        } else {
            await user.update(req.body);
            res.send(user);
        }
    }catch(er){
        next(er);
    }
})


module.exports = app;