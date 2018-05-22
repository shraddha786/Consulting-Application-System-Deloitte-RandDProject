import { Component, OnInit } from '@angular/core';
import { Profile } from '../profile';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: Profile = {
    first_name: 'Maxwell',
    last_name: 'Francis',
    accepted: false,
    upload_CV: false,
    upload_Video: false
  }

  constructor() { }

  ngOnInit() {
  }

}
