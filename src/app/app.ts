import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { Api } from './service/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ims');

  constructor(
    private api:Api,
    private router:Router,
    private cdr:ChangeDetectorRef
  ){}

  isAuth():boolean{
    return this.api.isAuthenticated();
  }

    isAdmin():boolean{
    return this.api.isAdmin();
  }

  logOut():void{
    this.api.logout();
    this.router.navigate(["/login"]);
    this.cdr.detectChanges();
  }
}
