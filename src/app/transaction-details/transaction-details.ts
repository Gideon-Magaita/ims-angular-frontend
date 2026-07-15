import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-details.html',
  styleUrl: './transaction-details.css',
})
export class TransactionDetails implements OnInit{

  constructor(
    private api: Api,
    private route: ActivatedRoute,
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {}

  transactionId:string | null = '';
  transaction: any = null;
  status:string = '';
  message:string = ''

  ngOnInit(): void {
    //extract transaction id from routes
    this.route.params.subscribe(params =>{
      this.transactionId = params['transactionId'];
      this.getTransactionDetails();
    })
  }

  getTransactionDetails():void{
    if (this.transactionId) {
      this.api.getTransactionById(this.transactionId).subscribe({
        next:(transactionData: any) =>{
          if (transactionData.status === 200) {
            this.transaction = transactionData.transaction;
            this.status = this.transaction.status;
            this.cdr.detectChanges(); // Force view update
          }
         
        },
        error:(error)=>{
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Unable to Get Transaction by id ' + error
          );
        }
      })
    }
  }

  //UPDATE STATUS
  handleUpdateStatus():void{
    if (this.transactionId && this.status) {
      this.api.updateTransactionStatus(this.transactionId, this.status).subscribe({
        next:(result)=>{
          this.router.navigate(['/transaction'])
        },
        error:(error)=>{
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Unable to Update a Transaction ' + error
          );
        }
      })
    }
  }


    //SHOW ERROR
    showMessage(message: string) {
      this.message = message;
      setTimeout(() => {
        this.message = '';
      }, 4000);
    }
}
