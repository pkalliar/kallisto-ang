export class Contact {
    id: string;
    code: string;
    legal_name: string;
    enabled: boolean;
}

export class ContactGroup {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
}

export class ContactCategory {
    constructor(public id: string, public label: string) { }
}

export class ContactGroupFull {
    group: ContactGroup;
    contacts: Contact[];
}
