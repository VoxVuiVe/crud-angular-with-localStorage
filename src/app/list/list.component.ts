import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent {
  studentArr: any = [];
  name: string = '';
  email: string = '';
  phone: string = '';
  dob: string = '';
  country: string = '';
  gender: boolean = true;
  selectedIndex: number = -1; 

  ngOnInit(): void {
    this.getAll();
  }

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
      const existingStudentsIndex = this.studentArr.findIndex(
        (student: any) => student.name === this.name
      );

      if (existingStudentsIndex !== -1) {
        // Sản phẩm đã tồn tại, cập nhật thông tin
        this.studentArr[existingStudentsIndex] = {
          name: this.name,
          email: this.email,
          phone: this.phone,
          dob: this.dob,
          country: this.country,
          gender: this.gender
        };
        alert("Cập nhật thành công")
      } else {
        // Sản phẩm chưa tồn tại, thêm mới
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

  
edit(index: number) {
  // Kiểm tra xem chỉ số index có hợp lệ trong mảng list hay không
  if (index >= 0 && index < this.studentArr.length) {
    
    // Gán chỉ số của phần tử cần chỉnh sửa vào biến selectedIndex
    this.selectedIndex = index;    
    // Đặt giá trị của các biến cần nhập liệu dựa trên thông tin của phần tử cần chỉnh sửa
    const selectedItem = this.studentArr[index++];
    this.name = selectedItem.name;
    this.phone = selectedItem.phone;
    this.email = selectedItem.email;
    this.country = selectedItem.country;
    this.gender = selectedItem.gender;
    this.dob = selectedItem.dob;
  } else {
    console.log('Chỉ số không hợp lệ');
  }
}

delete(index: number) {
  if (this.studentArr.length > index) {
    this.studentArr.splice(index, 1);
    this.save();
  }
}

}
