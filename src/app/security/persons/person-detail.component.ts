import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { PersonService } from './person.service';

import { Person } from './person';

@Component({
  selector: 'person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})



export class PersonDetailComponent implements OnInit {
    @Input() entity: Person;
    isEdit = false;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private location: Location,
      private service: PersonService
    ) {}

    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.service.getOne(params.get('id')))
        .subscribe(entity => this.entity = entity);
        if (location.pathname.endsWith('edit') || location.pathname.endsWith('new')) { this.isEdit = true; }
    }

    // loadContact(id): void {
    //   this.contactService.getContact(id)
    // }

    goBack(): void {
      this.location.back();
    }

    edit(): void {
      this.router.navigate([location.pathname, 'edit']);
    }

    save(entity): void {
      console.log('loc: ' + location.pathname);
      this.service.save(entity);
    }

    delete(entity): void {
      console.log('delete contact: ' + entity.id);
      this.service.delete(entity);
    }

}
