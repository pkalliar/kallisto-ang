export class Contact {
    id: string;
    code: string;
    legal_name: string;
    enabled: boolean;
}

export class ContactCategory {
    constructor(public id: string, public label: string) { }
}