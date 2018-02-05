import { Component, OnInit } from '@angular/core';

import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormControl} from '@angular/forms';


// my comment on Monday morning
@Component({
  selector: 'app-intro',
  templateUrl: './skroutz.component.html',
  styleUrls: ['./skroutz.component.css'],
  providers: []
})
export class SkroutzComponent implements OnInit {
  title = 'PKENERGY';
  intViewportWidth = document.documentElement.clientWidth;

  searchTerm: FormControl = new FormControl();

  searchContact(toSearch: String): void {
    console.log('searching for ' + toSearch);
  }

  handleKeyPress(e) {
    const key = e.keyCode || e.which;
      if (key === 13 ) {
      console.log(' enter pressed ' + this.searchTerm.value);
      }
  }

  ngOnInit(): void {
    console.log('initializing app..');
  }


}



