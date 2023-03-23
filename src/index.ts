import {utils,readFile,writeFile as wf} from 'xlsx'
import { ClientProps } from './interfaces/Client'
import 'dotenv/config'
import Axios from 'axios'
import {writeFile} from 'fs/promises'
import path from 'path'

const wb_file =  readFile(`${process.env.SHEET}`)
const sheetName =  wb_file.SheetNames[0]
const sheet = wb_file.Sheets[sheetName]
const range = utils.decode_range(sheet['!ref']!)
const header =  ['cnpj','name']

range.s.r = 1
sheet['!ref'] = utils.encode_range(range)



const client:ClientProps[] =  utils.sheet_to_json(sheet,{header,range})
const api = (cnpj:string) => Axios.create({
    baseURL:`https://api.cnpja.com/rfb/certificate?taxId=${cnpj}`,
    headers:{
        Authorization:`${process.env.TOKEN}`
    },
    responseType:'stream'
})
// client.forEach(e =>console.log(`CNPJ : ${e.cnpj} - Nome : ${e.name}`))
// console.log(`Total de ${client.length} registros`)


async function generatePDF(cnpj:string,name:string,index:number){
    try{
        console.log(`Gerando pdf ${index+1} de ${client.length} ...`)
        const data = await api(cnpj).get('').then(response => response.data)
        await writeFile(`${path.join(`${process.env.OUTPUT}`,`${name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'')}.pdf`)}`,data).then(() =>console.log(`Pdf ${index+1} de ${client.length} Gerado`))
    }catch(err){
        console.log(`${err}`)
    }
}


client.forEach(async ({cnpj,name},index) => {

    try{
        
        setTimeout( async () =>  {
            await generatePDF(cnpj,name,index)
        },6000* (index+1))
            
    }catch(err){
        console.log(`${err}`)
    }
})
