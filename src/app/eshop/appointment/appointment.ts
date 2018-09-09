import { Person } from '../../security/persons/person';

export class Appointment {
    id: string;
    firstname: string;
    lastname: string;
    start_time: Date;
    end_time: Date;
    category: ApptCat;

}

export class Appointment2 {
    id: string;
    person: Person;
    slot: ApptSlot;
}

export class ApptSlot {
    id: string;
    category: ApptCat;
    start_time: Date;
    end_time: Date;
}

export class ApptCat {
    id: string;
    name: string;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

