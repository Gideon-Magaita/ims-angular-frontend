import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule,FormsModule],
  templateUrl: './purchase.html',
  styleUrl: './purchase.css',
})
export class Purchase implements OnInit {
 constructor(
  private api:Api,
  private cdr:ChangeDetectorRef
 ){}

 ngOnInit(): void {
   this.fetchProductsAndSuppliers();
 }

 fetchProductsAndSuppliers():void{
  this.api.getAllProducts().subscribe({
    next:(res:any)=>{
      
    }
  })
 }

}
