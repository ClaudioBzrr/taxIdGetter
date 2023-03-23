import {utils,readFile,writeFile as wf} from 'xlsx'
import { ClientProps, ValidationProps } from './interfaces/Client'
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

const api_card = (cnpj:string) => Axios.create({
    baseURL:`https://api.cnpja.com/rfb/certificate?taxId=${cnpj}`,
    headers:{
        Authorization:`${process.env.TOKEN}`
    },
    responseType:'stream'
})

const api_info = (cnpj:string) => Axios.create({
    baseURL:`https://api.cnpja.com/rfb?taxId=${cnpj}`,
    headers:{
        Authorization:`${process.env.TOKEN}`
    }
})


async function generatePDF(cnpj:string,name:string,index:number){
    try{
        console.log(`Gerando pdf ${index+1} de ${client.length} ...`)
        const data = await api_card(cnpj).get('').then(response => response.data)
        await writeFile(`${path.join(`${process.env.OUTPUT}`,`${cnpj} ${name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'')}.pdf`)}`,data).then(() =>console.log(`Pdf ${index+1} de ${client.length} Gerado`))
    }catch(err){
        console.log(`${err}`)
    }
}

async function saveTaxIdCard(){
    const error_client:ClientProps[] = []
    const wb_error = utils.book_new()
    const err_header = [['cnpj','name']]
    client.forEach(async ({cnpj,name},index) => {
    
        try{
            
            setTimeout( async () =>  {
                await generatePDF(cnpj,name,index)
            },10000* (index+1))
                
        }catch(err){
            error_client.push({cnpj,name})
            console.log(`${err}`)
        }
    })
    
    const ws_error =  utils.json_to_sheet(error_client)
    utils.sheet_add_aoa(ws_error,err_header)
    utils.book_append_sheet(wb_error,ws_error,'error')
    wf(wb_error,'client_error.xlsx')
}


function getApiTaxIdData(){
    try{
        const validate:ValidationProps[]= []
        client.forEach(({cnpj,name},index) =>{
            setTimeout(async() =>{
                console.log(`Gerando dados ${index+1} de ${client.length}`)
                const data:any = await api_info(cnpj).get('').then(response => response.data)
                validate.push({cnpj,name,taxName:`${data.name}`,status:`${data.status.text}`})
                console.log(`Dados ${index+1} de ${client.length} gerados`)
            },10000*(index+1))
        })
        return validate
    }catch(err){
        throw new Error(`${err}`)
    }
}

const apiRFBData =  getApiTaxIdData()

async function saveNameAndStatusSheet(){
    try{
        const wb =  utils.book_new()
        const ws = utils.json_to_sheet(apiRFBData)
        const header = [['CNPJ','Nome no Protheus','Razão Social','Status']]
        utils.sheet_add_aoa(ws,header)
        utils.book_append_sheet(wb,ws,'Clientes')
        wf(wb,path.join(`${process.env.OUTPUT}`,'validation.xlsx'))
    }catch(err){
        console.log(err)
    }
}

apiRFBData.forEach(e => console.log(`CNPJ : ${e.cnpj} - Nome Protheus : ${e.name} - Razão social : ${e.taxName} - Status : ${e.status}`))