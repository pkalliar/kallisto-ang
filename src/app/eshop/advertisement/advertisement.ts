export class Advertisement {
    id: String;
    user_uid: String;
    body: string;
    category: string;
    phone: string;
    created_on: Date;
    images: Array<String>;
    geometry: Geometry;
}

export class AdvCat {
    id: string;
    name: string;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

export class Geometry {
    coordinates: Array<number>;

    constructor(coordinates) {
        this.coordinates = coordinates;
    }
}
