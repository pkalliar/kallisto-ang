import { Component, OnInit } from '@angular/core';

// import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { AggeliesService } from './classified-ads.service';
import { AggeliaDetailComponent} from './ad-detail.component';



// my comment on Monday morning
@Component({
  selector: 'app-skroutz',
  templateUrl: './classified-ads.component.html',
  styleUrls: ['./classified-ads.component.css'],
  providers: [AggeliesService]
})
export class AggeliesComponent implements OnInit {
  title = 'PKENERGY';
  intViewportWidth = document.documentElement.clientWidth;
  searchResult = [];
  categories = [];

  searchTerm: FormControl = new FormControl();

  constructor(
    private router: Router,
    private skroutzService: AggeliesService) { }

  searchContact(toSearch: String): void {
    console.log('searching for ' + toSearch);
  }

  handleKeyPress(e) {
    const key = e.keyCode || e.which;
      if (key === 13 ) {
      console.log(' enter pressed ' + this.searchTerm.value);
      this.skroutzService.search_word(this.searchTerm.value).then(response => {
            this.searchResult = response;
            this.categories = response.categories;
        });

      }
  }

  ngOnInit(): void {
    console.log('initializing app..');
  }


}



