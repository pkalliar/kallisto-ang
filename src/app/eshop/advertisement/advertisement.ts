export class Advertisement {
    id: String;
    user_uid: String;
    body: string;
    category: string;
    phone: string;
    images: Array<String>;
}

export class AdvCat {
    id: string;
    name: string;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
