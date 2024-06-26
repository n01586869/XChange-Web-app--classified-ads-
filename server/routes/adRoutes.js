const express = require('express')
const jwt = require('jsonwebtoken')
const User = require("../models/User.js")
const Ad = require('../models/Ad.js')
require('dotenv').config()

const router = express.Router()

router.get('/ads', async (req, res) => { // returns all ads
    res.json(await Ad.find({}))
})

.get('/:id', async (req, res) => { // returns 1 specific ad
    const {id} = req.params
    res.json (await Ad.find({_id: id}))
})

.post('/createAd', async(req, res)=>{ // creates new Ad
    try{
        const ad = await Ad.createAd(req.headers, req.body)
        res.json(ad)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({error: err.message})
    }
})

.get('/createAd/:id', async(req, res)=>{ // returns ad details so update page can be filled in

    const adId = req.params.id

    try{
        const {authorization} = req.headers
    
        if(!authorization) throw Error("Authorization token required")
    
        const token = authorization.split(' ')[1] // gets token from authorization header
        const {_id} = jwt.verify(token, process.env.jwtSecret)
        const user = await User.findOne({_id})
    
        if (!user) throw Error("Not authorized")

        const ad = await Ad.findOne({_id: adId})

        if (user._id.toString() !== ad.owner.toString()) throw Error("Not authorized") // returns only if user and owner match

        res.json(ad)

    } catch (err) {
        console.log(err.message)
        res.status(500).json({error: err.message})
    }

})

.put('/createAd/:id', async(req, res)=>{ // updates an existing ad
    try{
        const ad = await Ad.updateAd(req.headers, req.body)
        res.json(ad)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({error: err.message})
    }
})

.delete('/delete/:id', async (req, res) => { // deletes an ad
    const {id} = req.params
    const deletedAd = await Ad.deleteAd(req.headers, id)
    res.json(deletedAd)
})

module.exports = router