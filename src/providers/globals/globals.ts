import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable()
export class GlobalsProvider {

  signStatus: boolean;
  user: User;

  constructor() {
    this.signStatus = false;
    this.user = null;
  }

  getSignStatus() {
    return this.signStatus;
  }
  setSignStatus(status: boolean) {
    this.signStatus = status;
  }

  getUser() {
    return this.user;
  }
  setUser(user: User) {
    if(this.user === null)
      this.user = new User();

    this.user = user;
  }
}
