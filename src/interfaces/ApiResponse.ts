export interface ClientReponseData {
    updated:        Date;
    taxId:          string;
    name:           string;
    alias:          null;
    founded:        Date;
    equity:         number;
    head:           boolean;
    nature:         MainActivity;
    size:           Size;
    statusDate:     Date;
    status:         MainActivity;
    address:        Address;
    phones:         Phone[];
    emails:         Email[];
    mainActivity:   MainActivity;
    sideActivities: MainActivity[];
    members:        Member[];
}

export interface Address {
    municipality: number;
    street:       string;
    number:       string;
    details:      string;
    district:     string;
    city:         string;
    state:        string;
    zip:          string;
    country:      Country;
}

export interface Country {
    id:   number;
    name: string;
}

export interface Email {
    address: string;
    domain:  string;
}

export interface MainActivity {
    id:   number;
    text: string;
}

export interface Member {
    since:  Date;
    role:   MainActivity;
    person: Person;
}

export interface Person {
    name:  string;
    type:  string;
    taxId: string;
    age:   string;
}

export interface Phone {
    area:   string;
    number: string;
}

export interface Size {
    id:      number;
    acronym: string;
    text:    string;
}
