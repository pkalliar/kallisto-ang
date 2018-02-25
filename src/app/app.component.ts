import { Component, OnInit, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import * as moment from 'moment';

// my comment on Monday morning
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})

@Injectable()
export class AppComponent implements OnInit {
  title = 'PKENERGY';
  countdown = '...';

  constructor(private http: Http, private httpClient: HttpClient, private authService: AuthService) {
    this.http = http;
    this.authService = authService;
  }




  ngOnInit(): void {
    console.log('initializing app..');

  }
}



