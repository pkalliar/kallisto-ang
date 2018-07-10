
export class Appointment {
    id: string;
    name: string;
    start_time: Date;
    end_time: Date;
    category: ApptCat;

}

export class ApptCat {
    id: string;
    name: string;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

