import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  flagIndex: any;

  validateForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private studentsService: StudentService) {
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
    this.loadStudents();
  }

  loadStudents(): void {
    this.students = this.studentsService.getAll();
  }

  edit(index: number): void {
    this.flagIndex = index;
    this.studentForm = { ...this.students[index] };
  }

  delete(index: number): void {
    this.studentsService.deleteService(index);
  }

  saveOrUpdate() {
    if (this.validateForm.valid) {
      const existingStudentIndex = this.students.findIndex(
        (student: any) => student.name === this.studentForm.name
      );
  
      if (this.flagIndex !== existingStudentIndex && existingStudentIndex !== -1) {
        // Nếu flagIndex đã được thiết lập và student đã tồn tại, thực hiện cập nhật
        this.studentsService.updateService(this.flagIndex, this.studentForm);
        this.flagIndex = null;
        console.log(this.students)
        alert('Cập nhật thành công')
      } else {
        // Nếu không có flagIndex hoặc student không tồn tại, thực hiện thêm mới
        this.studentsService.addService(this.studentForm);
        alert('Thêm mới thành công')
      }
  
      this.reset();
    }
  }

  reset(): void {
    this.studentForm = {} as Students;
    this.validateForm.reset()
  }
}
