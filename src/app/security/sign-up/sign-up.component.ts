import { Component, OnInit } from '@angular/core';
import { TopnavService } from '../../topnav/topnav.service';

@Component({
  selector: 'pk-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private topnav: TopnavService) { }

  ngOnInit() {
    this.topnav.setTitle('Εγγραφή χρήστη');
  }

}
