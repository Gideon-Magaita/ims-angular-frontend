import { Routes } from '@angular/router';
import { Guard } from './service/guard';
import { Login } from './login/login';
import { Register } from './register/register';
import { Category } from './category/category';
import { Supplier } from './supplier/supplier';
import { AddEditProduct } from './add-edit-product/add-edit-product';
import { AddEditSupplier } from './add-edit-supplier/add-edit-supplier';
import { Product } from './product/product';
import { Purchase } from './purchase/purchase';
import { Sell } from './sell/sell';
import { Transaction } from './transaction/transaction';
import { TransactionDetails } from './transaction-details/transaction-details';
import { Profile } from './profile/profile';
import { Dashboard } from './dashboard/dashboard';



export const routes: Routes = [
 { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'category', component: Category, canActivate:[Guard], data: {requiresAdmin: true} },

  { path: 'supplier', component: Supplier, canActivate:[Guard], data: {requiresAdmin: true} },
  { path: 'edit-supplier/:supplierId', component: AddEditSupplier, canActivate:[Guard], data: {requiresAdmin: true} },
  { path: 'add-supplier', component: AddEditSupplier, canActivate:[Guard], data: {requiresAdmin: true} },

  { path: 'product', component: Product, canActivate:[Guard], data: {requiresAdmin: true} },
  { path: 'edit-product/:productId', component: AddEditProduct, canActivate:[Guard], data: {requiresAdmin: true} },
  { path: 'add-product', component: AddEditProduct, canActivate:[Guard], data: {requiresAdmin: true} },


  { path: 'purchase', component: Purchase, canActivate:[Guard] },
  { path: 'sell', component: Sell, canActivate:[Guard] },

  { path: 'transaction', component: Transaction, canActivate:[Guard] },
  { path: 'transaction/:transactionId', component: TransactionDetails, canActivate:[Guard] },


  { path: 'profile', component: Profile, canActivate:[Guard] },
  { path: 'dashboard', component: Dashboard, canActivate:[Guard] },

//   WIDE CARD
    {path: "", redirectTo: "/login", pathMatch: 'full'},
    // {path: "**", redirectTo: "/dashboard"}
];
