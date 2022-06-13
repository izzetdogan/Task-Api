const express = require('express');
const User  = require('../models/user');
const bcryptjs =require('bcryptjs');
const sharp = require('sharp');

const multer = require('multer');

exports.postUser = async (req, res, next) => {

    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token});

    }catch(error) {
        res.status(400).send(error)

    }
}

exports.getUsers = async (req, res) =>{
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
}


exports.getUserById = async(req, res) => {
    const userid = req.params.uid;
    try {
        const user = await User.findById(userid)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
}

exports.updateUser = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
}


exports.deleteUser = async (req, res) =>{
    try{
        await req.user.remove();
        res.send(req.user)
    }catch(error){
        res.status(500).send(error)
    }
}


//-----------------------------------------------Authenticate---------------------------------------//

exports.getMe = async (req, res)=>{
    res.send(req.user);
}

exports.userLogin=async(req, res) =>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
}

exports.userLogout = async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
}

exports.logoutAll = async(req, res) =>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}



exports.postmeAvatar =async (req, res) =>{
    const buffer = await sharp (req.file.buffer)
    .resize({width: 250, height: 300})
    .png()
    .toBuffer()
    req.user.avatar = buffer;
    await req.user.save()
    res.send()
},(error, req,res, next )=>{
    res.status(400).send({error: error.message})
}

exports.deleteAvatar= async(req,res,next)=>{
    req.user.avatar = undefined;
    await req.user.save()
    res.send();
}

exports.getAvatarById = async(req, res, next)=>{
    try{
        const user = await User.findById(req.params.uid);
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type',  'image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(400).send(e)
    }
}