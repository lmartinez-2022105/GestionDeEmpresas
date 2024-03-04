import { Schema, model } from "mongoose"

const adminSchema = Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type:String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    }
},

 {versionKey: false}

)

export default model('Admin', adminSchema)