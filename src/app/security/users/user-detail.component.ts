import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from './user.service';

import { User } from './user';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})



export class UserDetailComponent implements OnInit {
    @Input() entity: User;
    isEdit = false;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private location: Location,
      private service: UserService
    ) {}

    ngOnInit(): void {
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => this.service.getOne(params.get('id'))))
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
      console.log('delete affair: ' + entity.username);
      this.service.delete(entity);
    }

}
