import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../service/api';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-add-edit-supplier',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-edit-supplier.html',
  styleUrl: './add-edit-supplier.css',
})
export class AddEditSupplier implements OnInit {

  constructor(
    private api:Api,
    private router:Router,
    private cdr:ChangeDetectorRef
  ){}

  message:string = '';
  isEditing:boolean = false;
  supplierId:string | null = null;

  formData: any={
    name:'',
    address:''
  }

  ngOnInit():void{
    this.supplierId = this.router.url.split('/')[2];//extracting supplier id from url
    if(this.supplierId){
      this.isEditing = true;
      this.fetchSupplier();
    }
  }

  fetchSupplier():void{
    this.api.getSupplierById(this.supplierId!).subscribe({
      next:(res:any)=>{
      if(res.status===200){
         this.formData={
          name:res.supplier.name,
          address:res.supplier.address,
        };

        this.cdr.detectChanges(); // Force view update

        }else{
          this.showMessage(res.message)
        }
      },
      error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Unable to fetch supplier by id" + error)
      }

    })
  }


  //HANDLE FORM SUBMISSION
  handleSubmit(){
    if(!this.formData.name || !this.formData.address){
      this.showMessage("All fields are required")
      return;
    }

  //Prepare data for submission

  const supplierData={
    name:this.formData.name,
    address:this.formData.address
  };


  if(this.isEditing){
    this.api.updateSupplier(this.supplierId!,supplierData).subscribe({
      next:(res:any)=>{
        if(res.status===200){
          this.showMessage("Supplier edited successfully!")
          this.router.navigate(['/supplier'])
        }
      },
      error:(error)=>{
      this.showMessage(error?.error?.message || error?.message || "Unable to edit supplier" + error)
      }
    })

  }else{
    this.api.addSupplier(supplierData).subscribe({
      next:(res:any)=>{
        if(res.status===200){
          this.showMessage("Supplier added successfully!")
          this.router.navigate(['/supplier'])
        }
      },
      error:(error)=>{
      this.showMessage(error?.error?.message || error?.message || "Unable to add supplier" + error)
      }
    })

  }

  }
  
showMessage(message:string){
    this.message = message;
    setTimeout(()=>{
      this.message == ''
    },400)
  }
}
