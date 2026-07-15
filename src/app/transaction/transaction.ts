import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pagination } from '../pagination/pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  imports: [Pagination,CommonModule,FormsModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css',
})
export class Transaction implements OnInit{

  constructor(
    private api:Api,
    private router:Router,
    private cdr:ChangeDetectorRef
  ){}

  transactions:any[]=[];
  message:string = '';
  searchInput:string = '';
  valueToSearch:string = '';
  currentPage:number = 1;
  totalPages:number = 1;
  itemsPerPage:number = 10;

  ngOnInit(): void {
    this.loadTransactions();
  }

  //FETCH TRANSACTIONS
  loadTransactions():void{
    this.api.getAllTransactions(this.valueToSearch).subscribe({
      next:(res:any)=>{
        const transactions = res.transactions || [];
        this.totalPages = Math.ceil(transactions.length/this.itemsPerPage);
        this.transactions = transactions.slice(
          (this.currentPage-1)*this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );

        this.cdr.detectChanges(); // Force view update
      },
      error:(error) =>{
            this.showMessage(
              error?.error?.message || 
              error?.message || 
              "Unable to load transactions" + error
            );
      }
    })
  }

  //HANDLE SEARCH
  handleSearch():void{
   this.currentPage = 1;
   this.valueToSearch = this.searchInput;
   this.loadTransactions();
   
  }


  //NAVIGATE TO TRANSACTIONS DETAILS PAGE
  navigateToTransactionsDetailsPage(transactionId:string):void{
    this.router.navigate([`/transaction/${transactionId}`])
  }

  //HANDLE PAGE CHANGE//NAVIGATE TO NEXT,SPECIFIC AND PREVIOUS PAGE
  onPageChange(page:number):void{
    this.currentPage=page;
    this.loadTransactions();
  }


   showMessage(message:string){
    this.message = message;
    setTimeout(()=>{
      this.message == ''
    },1000)
  }

}
