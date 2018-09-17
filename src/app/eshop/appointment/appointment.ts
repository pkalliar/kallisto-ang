import { Person } from '../../security/persons/person';
import { NgbTimeStruct } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

export class Appointment {
    id: string;
    firstname: string;
    lastname: string;
    start_time: Date;
    durationMinutes: number;
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

export class CreationData {
    category: ApptCat;
    fromDate: Date;
    toDate: Date;
    fromTime: NgbTimeStruct;
    toTime: NgbTimeStruct;
    appointmentDuration: number;
}

export class DailyData {
    day: Date;
    freeAppointment: number;
}

