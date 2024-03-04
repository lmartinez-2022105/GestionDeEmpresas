'use strict'

import jwt from 'jsonwebtoken'
import Admin from '../admin/admin.model.js'

export const validateJwt = async(req, res, next)=>{
    try {
        let secretKey = process.env.SECRET_KEY
        let {token} = req.headers
        if(!token)  return res.status(401).send({message: 'Unauthorized'})
        let {uid} = jwt.verify(token, secretKey)
        let admin = await Admin.findOne({_id: uid})
        if(!admin) res.status(404).send({message:'User not found - Unauthorized'})
        req.admin = admin
        next()
    } catch (error) {
        console.error(error)
        return  res.status(498).send({message: 'Invalid token or expired'})
    }
}