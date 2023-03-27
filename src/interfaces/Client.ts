export interface ClientProps{
    cnpj:string,
    name:string
}

export interface ValidationProps{
    cnpj:string,
    name:string,
    taxName:string,
    status:string
}

export interface ClientDataProps{
    filial:string,
    cnpj:string,
    nome:string,
    endereco:string,
    bairro:string,
    cidade:string,
    estado:string,
    cep:string
}

export interface SheetValidationProps{
    filial:string,
    cnpj:string,
    apiCnpj:string,
    nome:string,
    apiNome:string,
    endereco:string,
    apiEndereco:string,
    bairro:string,
    apiBairro:string,
    cidade:string,
    apiCidade:string,
    estado:string,
    apiEstado:string
    cep:string,
    apiCep:string,
    status:string
}