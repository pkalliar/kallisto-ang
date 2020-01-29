import { Component, OnInit } from '@angular/core';
import { TopnavService } from '../../topnav/topnav.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pk-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  ufg: FormGroup;

  constructor(private topnav: TopnavService, private auth: AuthService) { }

  ngOnInit() {
    this.topnav.setTitle('Εγγραφή χρήστη');

    this.ufg = new FormGroup({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', Validators.minLength(2)),
      passwordConfirm: new FormControl('', Validators.minLength(2)),
    }, passwordMatchValidator);

    function passwordMatchValidator(g: FormGroup) {
      return g.get('password').value === g.get('passwordConfirm').value
         ? null : {'mismatch': true};
    }

    this.ufg.valueChanges.subscribe(data => {
      console.log(this.ufg);
      console.log(data);
    });

  }

  createUser() {
    console.log('ad is ' + JSON.stringify(this.ufg.value));
    this.auth.createUserEmail(this.ufg.value.fname, this.ufg.value.lname, this.ufg.value.email, this.ufg.value.password);

  }

}
