import { Schema, model } from "mongoose"

const companySchema = Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    impactLevel:{
        type: String,
        enum:['LOW','MEDIUM','HIGH'],
        uppercase: true,
        required: true
    },
    yearExpirience:{
        type: Number,
        required: true
    },
    companyCategory:{
        type:String,
        required: true
    }
},
    {versionKey:false}
)

export default model('Company', companySchema)