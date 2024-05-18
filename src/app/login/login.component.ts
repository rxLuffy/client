import { Component } from "@angular/core";
import { UserService } from "./user.service";
import { Router, RouterModule } from "@angular/router";
import { AppService } from "../app.service";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { AppHelper } from "../utils/app.helper";
import { OrderService } from "../products/order.service";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: 'login.component.html',
  imports: [ButtonModule, RouterModule, FormsModule]
})
export class LoginComponent {

  public mobile!: number;
  public password: string = '';
  public isValidPassword: boolean = false;
  public isValidPhoneNumber: boolean = false;

  constructor(public userService: UserService, private router: Router,
    private appService: AppService,
    private orderService: OrderService
  ) {
    this.isValidPassword = true;
    this.isValidPhoneNumber = true;
  }

  public login() {
    this.mobile = 7299933974;
    this.password = 'Sri@276286';
    const user = {
      username: this.mobile,
      password: this.password
    }
    this.userService.login(user).subscribe((res) => {
      // set user
      this.setUser(res);

      // check for localcart items and set pushtocart
      this.localCart();

      this.pushUserDistance();

      // handle navigation
      this.handleNavigation();
    });
  }

  public validatePassword() {
    this.isValidPassword = AppHelper.validatePassword(this.password);
  }

  public validatePhoneNumber() {
    this.isValidPhoneNumber = AppHelper.validatePhoneNumber(this.mobile);
  }

  private setUser(res: any) {
    this.appService.user.update(() => res);
    localStorage.setItem('scUser', JSON.stringify(res));
  }

  private localCart() {
    const user = this.appService.user();
    if (user) {
      console.log('dfg => ', user);
      const cartItems = AppHelper.getFromLocalStorage('scCart');
      console.log(cartItems)
      if (cartItems && cartItems.length) {
        cartItems.forEach((item: any, index: number) => {
          item.CustomerId = user.CustomerId;
          this.orderService.addToCart(item).subscribe();
          if (index === cartItems.length - 1) {
            localStorage.removeItem('scCart');
          }
        });
      }
    }
  }

  private pushUserDistance() {
    const user = this.appService.user();
    const scDistance = AppHelper.getFromLocalStorage('scDistance');
    if (user && scDistance) {
      const { pincode, distance } = scDistance;
      user.Pincode = pincode;
      user.KmDistance = distance;
      this.userService.editUser(user).subscribe();
    }
  }

  private handleNavigation() {
    this.router.navigate(['']);
  }
}
