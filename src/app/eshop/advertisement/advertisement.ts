export class Advertisement {
    id: String;
    user_uid: String;
    body: string;
    category: string;
    phone: string;
    created_on: Date;
    images: Array<String>;
    geometry: Object;
}

export class AdvCat {
    id: string;
    name: string;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
