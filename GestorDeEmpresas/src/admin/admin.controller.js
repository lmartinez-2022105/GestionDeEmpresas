import Admin from './admin.model.js'
import { encrypt, checkPassoword } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const register = async(req, res)=>{
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let admin = new Admin(data)
        await admin.save()
        return res.send('Registered successfully')
    } catch (error) {
        console.log(error)
        if(error.keyValue.username) return res.status(400).send({message: `Username ${error.keyValue.username} is already taken`})

    }
}

export const login = async(req, res)=>{
    try {
        let {username, password} = req.body
        let admin = await Admin.findOne({username})
        if(admin&&await checkPassoword(password, admin.password)){
            let loggedAdmin = {
                uid: admin._id,
                username: admin.username,
                name: admin.name,
                surname: admin.surname
            }
            let token = await generateJwt(loggedAdmin)
            return res.send({message:`Welcome ${admin.name}`, loggedAdmin, token})
        }
        return res.status(404).send({message: 'Invalid credentials'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Failed to login'})
    }
}

export const update = async(req, res)=>{
    try {
        let {id} = req.admin
        let data = req.body
        let updateAdmin = await Admin.findOneAndUpdate({_id: id}, data, {new:true})
        if(!updateAdmin) return res.status(401).send({ message: 'Admin not found and not updated' })
        return res.send({ message: 'Updated admin', updateAdmin })
    } catch (error) {
         console.error(error)
        return res.status(500).send({ message: 'Error updating admin', error })
    }
}

export const deleteAdmin = async(req, res)=>{
    try {
        let {id} = req.admin
        let admin = await Admin.findOneAndDelete({_id:id})
        if(!admin) return res.status(401).send({message: 'Admin not foud and not deleted'})
        return res.send('Admin deleted successfully')
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting admin', error })
    }
}