export interface ClientReponseData {
    uf:                                    string;
    cep:                                   string;
    qsa:                                   Qsa[];
    cnpj:                                  string;
    pais:                                  null;
    email:                                 null;
    porte:                                 string;
    bairro:                                string;
    numero:                                string;
    ddd_fax:                               string;
    municipio:                             string;
    logradouro:                            string;
    cnae_fiscal:                           number;
    codigo_pais:                           null;
    complemento:                           string;
    codigo_porte:                          number;
    razao_social:                          string;
    nome_fantasia:                         string;
    capital_social:                        number;
    ddd_telefone_1:                        string;
    ddd_telefone_2:                        string;
    opcao_pelo_mei:                        null;
    descricao_porte:                       string;
    codigo_municipio:                      number;
    cnaes_secundarios:                     CnaesSecundario[];
    natureza_juridica:                     string;
    situacao_especial:                     string;
    opcao_pelo_simples:                    null;
    situacao_cadastral:                    number;
    data_opcao_pelo_mei:                   null;
    data_exclusao_do_mei:                  null;
    cnae_fiscal_descricao:                 string;
    codigo_municipio_ibge:                 number;
    data_inicio_atividade:                 Date;
    data_situacao_especial:                null;
    data_opcao_pelo_simples:               null;
    data_situacao_cadastral:               Date;
    nome_cidade_no_exterior:               string;
    codigo_natureza_juridica:              number;
    data_exclusao_do_simples:              null;
    motivo_situacao_cadastral:             number;
    ente_federativo_responsavel:           string;
    identificador_matriz_filial:           number;
    qualificacao_do_responsavel:           number;
    descricao_situacao_cadastral:          string;
    descricao_tipo_de_logradouro:          string;
    descricao_motivo_situacao_cadastral:   string;
    descricao_identificador_matriz_filial: string;
}

export interface CnaesSecundario {
    codigo:    number;
    descricao: string;
}

export interface Qsa {
    pais:                                    null;
    nome_socio:                              string;
    codigo_pais:                             null;
    faixa_etaria:                            string;
    cnpj_cpf_do_socio:                       string;
    qualificacao_socio:                      string;
    codigo_faixa_etaria:                     number;
    data_entrada_sociedade:                  Date;
    identificador_de_socio:                  number;
    cpf_representante_legal:                 string;
    nome_representante_legal:                string;
    codigo_qualificacao_socio:               number;
    qualificacao_representante_legal:        string;
    codigo_qualificacao_representante_legal: number;
}
