import {utils,readFile,writeFile as wf} from 'xlsx'
import { ClientProps, ValidationProps } from './interfaces/Client'
import 'dotenv/config'
import axios, { AxiosRequestConfig } from 'axios'
import {writeFile} from 'fs/promises'
import path from 'path'
import { ClientReponseData } from './interfaces/ApiResponse'




function readClientfromSheet(){

    const wb_file =  readFile(`${process.env.SHEET}`)
    const sheetName =  wb_file.SheetNames[0]
    const sheet = wb_file.Sheets[sheetName]
    const range = utils.decode_range(sheet['!ref']!)
    const header =  ['cnpj','name']
    
    range.s.r = 1
    sheet['!ref'] = utils.encode_range(range)
    
    const client:ClientProps[] =  utils.sheet_to_json(sheet,{header,range})

    return client
}

function api_card_config(cnpj:string):AxiosRequestConfig{
    const config:AxiosRequestConfig={
        url:`https://api.cnpja.com/rfb/certificate?taxId=${cnpj}`,
        method:'get',
        responseType:'stream',
        headers:{
            Authorization:`${process.env.TOKEN}`
        }
    }
    return config
}

function api_info_config(cnpj:string):AxiosRequestConfig{
    const config:AxiosRequestConfig={
        url:`https://api.cnpja.com/rfb?taxId=${cnpj}`,
        method:'get',
        headers:{
            Authorization:`${process.env.TOKEN}`
        }
    }
    return config
}



async function generatePDF(cnpj:string,name:string,index:number){
    try{
        const client =  readClientfromSheet()
        console.log(`Gerando pdf ${index+1} de ${client.length} ...`)
        const data = await axios(api_card_config(cnpj)).then(response => response.data)
        await writeFile(`${path.join(`${process.env.OUTPUT}`,`${cnpj} ${name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'')}.pdf`)}`,data).then(() =>console.log(`Pdf ${index+1} de ${client.length} Gerado`))
    }catch(err){
        console.log(`${err}`)
    }
}

async function saveTaxIdCard(){
    const client =  readClientfromSheet()
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


async function getApiTaxIdData():Promise<ValidationProps[]>{
    try{
        const valid:ValidationProps[] = []
        const clientList =  readClientfromSheet()
        for(const {cnpj,name} of clientList){
            const data:ClientReponseData = await axios(api_info_config(cnpj)).then(response => response.data)
            valid.push({
                cnpj:data.taxId,
                name:name,
                taxName:data.name,
                status:data.status.text
            })
        }
        return valid

    }catch(err){
        throw new Error(`${err}`)
    }
}


async function saveNameAndStatusSheet(){
    try{
        const data = await getApiTaxIdData()
        const wb =  utils.book_new()
        const ws = utils.json_to_sheet(data)
        const header = [['CNPJ','Nome no Protheus','Razão Social','Status']]
        utils.sheet_add_aoa(ws,header)
        utils.book_append_sheet(wb,ws,'Clientes')
        wf(wb,path.join(`${process.env.OUTPUT}`,'validation.xlsx'))
    }catch(err){
        console.log(err)
    }
}


getApiTaxIdData()