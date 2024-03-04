import Company from './company.model.js'
import xlsxPopulate from 'xlsx-populate'

export const add = async(req, res)=>{
    try {
        let data = req.body
        let company = new Company(data)
        await company.save()
        return res.send('Company registered Successfully')
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error registered company'})
    }
}

export const update = async(req,res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let updateCompany = await Company.findOneAndUpdate({_id: id}, data, {new: true})
        if(!updateCompany) return res.status(404).send({message:'Company not found and not updated'})
        return res.send({message: 'Company updated', updateCompany})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error updating company', error})
    }
}

export const deleteCompany = async(req, res)=>{
    try {
        let {id} = req.params
        let deletedCompany = await Company.findOneAndDelete({_id:id})
        if(!deletedCompany) return res.status(404).send({message:'Company not found and not deleted'})
        return res.send({message:"Company deleted successfully"})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting company'})
    }
}

export const displayCompanies = async(req,res)=>{
    try {
        let allCompanies = await Company.find()
        return res.send(allCompanies)
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error displaying companies'})
    }
}

export const displayCompaniesByFilters = async(req,res)=>{
    try {
        let {impactLevel,yearExpirience,companyCategory} = req.body
        if(!impactLevel&&!yearExpirience){
            let allCompanies = await Company.find({companyCategory:companyCategory})
            return res.send(allCompanies)
        }
        if(!impactLevel&&!companyCategory){
            let allCompanies = await Company.find({yearExpirience:yearExpirience})
            return res.send(allCompanies)
        }
        if(!yearExpirience&&!companyCategory){
            let allCompanies = await Company.find({impactLevel:impactLevel})
            return res.send(allCompanies)
        }
        if(!impactLevel){
            let allCompanies = await Company.find({yearExpirience:yearExpirience, companyCategory:companyCategory})
            return res.send(allCompanies)
        }
        if(!yearExpirience){
            let allCompanies = await Company.find({impactLevel:impactLevel, companyCategory:companyCategory})
            return res.send(allCompanies)
        }
        if(!companyCategory){
            let allCompanies = await Company.find({impactLevel:impactLevel, yearExpirience:yearExpirience})
            return res.send(allCompanies)
        }
        if(!companyCategory&&!yearExpirience&&!impactLevel){
            let allCompanies = await Company.find()
            return res.send(allCompanies)
        }
        let allCompanies = await Company.find({impactLevel:impactLevel, companyCategory:companyCategory, yearExpirience:yearExpirience})
        return res.send(allCompanies)
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error displaying companies'})
    }
}

export const toExcel = async(req, res)=>{
    try {
        //Obtener los datos de la db
        let companies = await Company.find()
        //crea un nuevo archivo de excel
        let workbook = await xlsxPopulate.fromBlankAsync()
        //agregar una hoja al libro
        let sheet = workbook.sheet(0)
        //Agregar encabezados de columna
        sheet.cell('A1').value('Name')
        sheet.cell('B1').value('Impact Level')
        sheet.cell('C1').value('Year Expirience')
        sheet.cell('D1').value('Company Category')
        //Agregar datos de las empresas
        companies.forEach((company, index)=>{
            let rowIndex = index + 2 //Empieza en la fila 2 debajo de los encabezados
            sheet.cell(`A${rowIndex}`).value(company.name)
            sheet.cell(`B${rowIndex}`).value(company.impactLevel);
            sheet.cell(`C${rowIndex}`).value(company.yearExpirience);
            sheet.cell(`D${rowIndex}`).value(company.companyCategory);
        })
        //Guardar el archivo Excel
        await workbook.toFileAsync('companies.xlsx')
        return res.send({message:'Data export successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error exporting data to Excel'})
    }
}