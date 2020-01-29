import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AffairService } from './affair.service';

import { Affair } from './affair';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-affair-detail',
  templateUrl: './affair-detail.component.html',
  styleUrls: ['./affair-detail.component.css']
})



export class AffairDetailComponent implements OnInit {
    @Input() affair: Affair;
    isEdit = false;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private location: Location,
      private service: AffairService
    ) {}

    ngOnInit(): void {




      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => this.service.getOne(params.get('id'))))
        .subscribe(affair => this.affair = affair);
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

    save(affair): void {
      console.log('loc: ' + location.pathname);
      this.service.save(affair);
    }

    delete(affair): void {
      console.log('delete affair: ' + affair.id);
      this.service.delete(affair);
    }

}
