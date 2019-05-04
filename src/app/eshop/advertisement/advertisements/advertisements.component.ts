import { Component, OnInit } from '@angular/core';

// import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdsService } from '../advertisements.service';
import { AdDetailComponent} from '../advertisement-detail/ad-detail.component';
import { Advertisement } from '../advertisement';
import { AuthService } from '../../../services/auth.service';
import { TopnavService } from '../../../topnav/topnav.service';



// my comment on Monday morning
@Component({
  selector: 'app-ads',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css'],
  providers: [AdsService]
})
export class AdsComponent implements OnInit {
  title = 'PKENERGY';
  intViewportWidth = document.documentElement.clientWidth;
  searchResult = [];
  categories = [];
  ads: Array<Advertisement> = [];
  uid = '';

  searchTerm: FormControl = new FormControl();

  constructor(
    private router: Router,
    private adService: AdsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private topnav: TopnavService) { }

  searchContact(toSearch: String): void {
    console.log('searching for ' + toSearch);
  }

  handleKeyPress(e) {
    const key = e.keyCode || e.which;
      if (key === 13 ) {
      console.log(' enter pressed ' + this.searchTerm.value);


      }
  }

  filter() {
    // console.log('filtering with parameters: ' + JSON.stringify(this.fromTime) + JSON.stringify(this.toTime));

    // this.router.navigate(['/eshop/aggelies'], {queryParams: q});

    this.adService.searchCar();

    this.adService.search_firestore(this.searchTerm.value).then(response => {
      response.forEach((doc) => {

        const ad: Advertisement = this.adService.getAdvFromToken(doc);

        this.ads.push(ad);

        // console.log(doc.get('body'));
            // console.log(`${doc.id} => ${JSON.stringify(doc.data)} `);
      });
      this.searchResult = response;

  });

  }

  ngOnInit(): void {
    console.log('initializing app..');

    // console.log('test titlo ' + this.topnav.getTitlo());
    this.topnav.setTitle('Λίστα αγγελιών');

    this.authService.user.subscribe(
      (user) => {
        if (user) {
          this.uid = user.uid;
        }
      });

    this.filter();
  }


}



