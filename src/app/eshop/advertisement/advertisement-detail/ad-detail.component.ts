import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Advertisement } from '../advertisement';
import { AdsService } from '../advertisements.service';
import { TopnavService } from '../../../topnav/topnav.service';


@Component({
  selector: 'app-add-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.css']
})


export class AdDetailComponent implements OnInit {
    @Input() token: Advertisement;
    isEdit = false;
    id = '';

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private location: Location,
      private service: AdsService,
      private topnav: TopnavService
    ) {}

    ngOnInit(): void {
      this.token = new Advertisement();

      this.topnav.setTitle('Λεπτομέρειες αγγελίας');

      this.route.paramMap.subscribe(params => {
        this.id = params.get('id');
        console.log('id: ' + this.id);

        if (this.id === 'new') {
          console.log('preparing new adv');

        } else {
          this.service.get(this.id).then(token => {

            this.token = this.service.getAdvFromToken(token);

            console.log(JSON.stringify(this.token));

          });
        }

      });

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

    save(): void {
      console.log('loc: ' + location.pathname);
    }

    delete(): void {
      console.log('delete contact: ' + location.pathname);
    }

}
