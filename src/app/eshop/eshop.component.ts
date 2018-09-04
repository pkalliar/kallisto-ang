import { Component, OnInit, ViewChild, ChangeDetectionStrategy  } from '@angular/core';
import { MatCalendar } from '@angular/material';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

import {
  CalendarEvent,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';




@Component({
  templateUrl: './eshop.component.html',
  styleUrls: ['./eshop.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EshopComponent implements OnInit {

  images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);

  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
      config.showNavigationArrows = true;
      config.showNavigationIndicators = true;
      config.interval = 2000;
  }


  ngOnInit() {


  }




}
