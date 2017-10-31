import { Component, OnInit } from '@angular/core';
import { Protocol } from './protocols/protocol';
import { ProtocolDetailComponent } from './protocols/protocol-detail.component';


// my comment on Monday morning
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  title = 'Angular pankal app';


  ngOnInit(): void {
    console.log('initializing app..');
  }



}



