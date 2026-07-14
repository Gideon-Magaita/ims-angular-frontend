import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-supplier',
  imports: [CommonModule,FormsModule],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css',
})
export class Supplier implements OnInit {

  constructor(
    private api:Api,
    private router:Router,
    private cdr:ChangeDetectorRef
  ){}

  suppliers:any[] = [];
  message:string = '';

  ngOnInit():void{
    this.getSuppliers();
  }

  //GET ALL SUPPLIERS
  getSuppliers():void{
    this.api.getAllSuppliers().subscribe({
      next:(res:any)=>{
        if(res.status === 200){
          this.suppliers = res.suppliers;
          this.cdr.detectChanges(); // Force view update
        }else{
          this.showMessage(res.message)
        }
      },
      error:(error)=>{
      this.showMessage(error?.error?.message || error?.message || "Unable to load suppliers" + error)
      }
    });
  }

  //NAVIGATE TO ADD A NEW SUPPLIER PAGE
  navigateToAddSupplier():void{
    this.router.navigate([`/add-supplier`]);
  }

   //NAVIGATE TO EDIT SUPPLIER PAGE
  navigateToEditSupplier(supplierId:string):void{
    this.router.navigate([`/edit-supplier/${supplierId}`]);
  }

  //DELETE SUPPLLIER
  handleDeleteSupplier(supplierId:string):void{
  if (window.confirm("Are you sure you want to delete this supplier?")) {
        this.api.deleteSupplier(supplierId).subscribe({
          next:(res:any) =>{
            if (res.status === 200) {
              this.showMessage("Supplier deleted successfully")
              this.getSuppliers(); //reload the supplier
              this.cdr.detectChanges(); // Force view update
            }
          },
          error:(error) =>{
            this.showMessage(error?.error?.message || error?.message || "Unable to Delete category" + error)
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
