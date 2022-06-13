const Task = require('../models/task');
const express = require('express');
const auth = require('../middleware/auth');


// ==========>>>>>> Post Task
exports.postTask = async (req, res, next) =>{

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
}

// ==========>>>>>> Get  Tasks
exports.getTask = async(req, res, next) =>{
    const match = {}
    const sort = {}
        
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1: 1;
    }
    if(req.query.completed){
        match.completed= req.query.completed === 'true';
    }
   
    
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
        
    } catch (e) {

        res.status(500).send(e)
        console.log('erro')
    }
}

exports.getTaskById =async (req, res) => {
    const taskid =req.params.tid; 

    try {
        const task = await Task.findOne({ taskid, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
}

exports.updateTask = async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.tid, req.body, { new: true, runValidators: true})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
}

exports.deleteTask = async(req, res) =>{
    try{
        const task = await Task.findByIdAndDelete(req.params.tid);
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
}
