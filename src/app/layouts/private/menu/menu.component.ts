import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from '../../../_services';
import { User } from '../../../_models';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  user: User;
  isNavbarCollapsed: boolean;

  constructor(
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('account'));
    if (!this.user) {
      this.accountService.getAccount()
        .subscribe(
          user => {
            this.user = user;
          },
          (error: HttpErrorResponse) => {
            console.log(error);
          });
    }
    this.isNavbarCollapsed = true;
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true;
  }

  isAdmin(): boolean {
    return this.accountService.hasRole('admin');
  }
}
