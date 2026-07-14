import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(
    private api:Api,
    private router:Router
  ){}

  formData:any={
    email:'',
    password:''
  };

  message:string | null = null;

  async handleSubmit(){
    if(
      !this.formData.email ||
      !this.formData.password
    ){
      this.showMessage("All fields are required!!");
      return;
    }
    try{
      const response:any=await firstValueFrom(
        this.api.loginUser(this.formData)
      );
      if(response.status === 200){
      this.api.encryptAndSaveTpStorage('token',response.token);
      this.api.encryptAndSaveTpStorage('role',response.role);
      this.router.navigate(["/dashboard"]);
      }
    }catch(error:any){
      console.log(error)
      this.showMessage(error?.error?.message || error?.message || "Unable to login" + error)
    }
  }

  showMessage(message:string){
    this.message = message;
    setTimeout(()=>{
      this.message == null
    },400)
  }
}
