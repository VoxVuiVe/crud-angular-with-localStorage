import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  studentArr: any = [];
  id: string = '';
  name: string = '';
  email: string = '';
  phone: string = '';
    dob: string = '';
    country: string = '';
    gender: boolean = true;

  
  validateForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.validateForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      dob: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    let value = localStorage.getItem('item');
    if (value != '' && value != null && typeof value != 'undefined') {
      this.studentArr = JSON.parse(value!);
    }
  }

  save() {
    localStorage.setItem('item', JSON.stringify(this.studentArr));
  }

  addProduct() {
      if(this.validateForm.valid) {
        const existingStudentsIndex = this.studentArr.findIndex(
          (student: any) => student.name === this.name
        );
  
        if (existingStudentsIndex !== -1) {
          // Sản phẩm đã tồn tại, cập nhật thông tin
          this.studentArr[existingStudentsIndex] = {
            name: this.name,
            email: this.email, // Chuyển đổi sang số
            phone: this.phone, // Chuyển đổi sang số nguyên
            dob: this.dob,
            country: this.country,
            gender: this.gender
          };
          alert("Cập nhật thành công")
        } else {
          const obj = {
            name: this.name,
            email: this.email, 
            phone: this.phone, 
            dob: this.dob,
            country: this.country,
            gender: this.gender
          };
          this.studentArr.push(obj);
          alert('Thêm thành công');
        }
        this.save();
      }
  }

}
