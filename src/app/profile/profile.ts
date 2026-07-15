import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Api } from '../service/api';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{

  constructor(
    private api:Api,
    private cdr:ChangeDetectorRef
  ){}

  user:any=null;
  message:string ='';

  ngOnInit(): void {
     this.fetchUserInfo();
  }

  fetchUserInfo():void{
    this.api.getLoggedInUserInfo().subscribe({
      next:(res)=>{
        this.user = res;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to Get Profile Info' + error
        );
      }
    })
  }


  //SHOW ERROR
  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

}
