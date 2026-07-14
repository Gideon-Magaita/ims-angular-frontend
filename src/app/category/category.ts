import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { ChangeDetectorRef } from '@angular/core';


export interface Category{
  id:string,
  name:string
}


@Component({
  selector: 'app-category',
  imports: [CommonModule,FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit{

  categories:Category[] = [];

  categoryName:string = '';
  message:string = '';
  isEditing:boolean = false;
  editingCategoryId: string | null = null;

  constructor(
    private api:Api,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit():void{
    this.getCategories();
  }

  //GET ALL CATEGORIES
  getCategories():void{
    this.api.getAllCategory().subscribe({
      next:(res:any)=>{
        if(res.status ===200){
          this.categories = res.categories;
          this.cdr.detectChanges(); // Force view update
        }
      },
      error:(error)=>{
      this.showMessage(error?.error?.message || error?.message || "Unable to load categories" + error)      }

    })
  }

  //ADD NEW CATEGORY
  addCategory():void{
    if(!this.categoryName){
      this.showMessage("Category name is required")
      return;
    }
    this.api.createCategory({name:this.categoryName}).subscribe({
      next:(res:any)=>{
        if(res.status===200){
          this.showMessage("Category name added successfully!")
          this.categoryName = '';
          this.getCategories();
          this.cdr.detectChanges(); // Force view update
        }
      },
      error:(error)=>{
      this.showMessage(error?.error?.message || error?.message || "Unable to save categories" + error)
      }
    })
  }


  //EDIT CATEGORY
  editCategory():void{
    if(!this.editingCategoryId || !this.categoryName){
      return;
    }
    this.api.updateCategory(this.editingCategoryId,{name:this.categoryName}).subscribe({
      next:(res:any)=>{
        if(res.status===200){
          this.showMessage("Category edited successfully!")
          this.categoryName = '';
          this.getCategories();
          this.cdr.detectChanges(); // Force view update
        }
      },
      error:(error)=>{
      this.showMessage(error?.error?.message || error?.message || "Unable to edit categories" + error)
      }
    })
  }


  //set the category to edit
  handleEditCategory(category:Category):void{
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryName = category.name
  }

  //Delete a caetgory
  handleDeleteCategory(caetgoryId: string):void{
    if (window.confirm("Are you sure you want to delete this categoy?")) {
      this.api.deleteCategory(caetgoryId).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("Category deleted successfully")
            this.getCategories(); //reload the category
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
