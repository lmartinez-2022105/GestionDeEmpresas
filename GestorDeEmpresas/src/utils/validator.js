'use strict'
import {compare, hash} from 'bcrypt'

export const encrypt = async(pasword)=>{
    try {
        return await hash(pasword, 10)        
    } catch (error) {
        console.error(error)
        return error
    }
}

export const checkPassoword = async(pasword, hash)=>{
    try {
        return await compare(pasword, hash)
    } catch (error) {
        console.error(error)
        return error
    }
}