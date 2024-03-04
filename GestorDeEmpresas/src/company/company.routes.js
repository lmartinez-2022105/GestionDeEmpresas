import {Router} from 'express'
import {check} from 'express-validator'
import { add, deleteCompany, displayCompanies, displayCompaniesByFilters, toExcel, update } from './company.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/add',[validateJwt] ,add)
api.put('/update/:id',[validateJwt], update)
api.delete('/delete/:id',[validateJwt],deleteCompany)
api.get('/display',[validateJwt], displayCompanies)
api.post('/filter',[validateJwt,], displayCompaniesByFilters)
api.get('/excel',[validateJwt], toExcel)

export default api