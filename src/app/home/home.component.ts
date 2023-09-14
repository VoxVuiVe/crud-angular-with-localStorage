import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Students } from '../models/students';
import { StudentService } from '../services/student.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  students: Students[] = [];
  studentForm: any = {}
  selectedFile: File | null = null;
  flagIndex: number = -1;

  validateForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private studentsService: StudentService) {
    this.validateForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      dob: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required]
      // image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.reset()
  }

  loadStudents(): void {
    this.students = this.studentsService.getAll();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addStudent() {
    if (this.studentForm.name && this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.studentForm.image = event.target.result;
        this.studentsService.addService(this.studentForm);
        this.studentForm = {};
        this.selectedFile = null;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  updateStudent() {
    if (this.flagIndex !== null) {
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.studentForm.image = event.target.result;
          this.studentsService.updateService(this.studentForm);
          this.cancelEdit(); // Kết thúc chỉnh sửa
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        // Nếu không có tệp mới được chọn, chỉ cập nhật thông tin khác
        this.studentsService.updateService(this.studentForm);
        this.cancelEdit(); // Kết thúc chỉnh sửa
      }
    }
  }

  submitForm() {
    if(this.flagIndex !== -1) {
      this.updateStudent()
    } else {
      this.addStudent()
    }
  }

  
  editStudent(index: number) {
    this.flagIndex = index; // Bắt đầu chỉnh sửa
    this.studentForm = { ...this.students[index] };
  }

  edit(index: number) {
    this.flagIndex = -1; // Bắt đầu chỉnh sửa
    this.studentForm = {};
  }


  cancelEdit() {
    this.flagIndex = -1;
    this.studentForm = {};
    this.reset()
  }

  deleteStudent(index: number) {
    // if (confirm('Are you sure you want to delete this employee?')) {
      this.studentsService.deleteService(index);
    // }
  }

  reset(): void {
    this.studentForm = {} as Students;
    this.validateForm.reset()
  }
}
