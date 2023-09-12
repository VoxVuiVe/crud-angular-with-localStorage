import { Component, NgZone } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Students } from '../models/students';
import { StudentService } from '../services/student.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent {
  students: Students[] = [];
  studentForm: any = {}
  flagIndex: number | null = null;

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
        (student: any) => student.id === this.studentForm.id
      );
  
      if (this.flagIndex !== null && existingStudentIndex !== -1) {
        // Nếu flagIndex đã được thiết lập và student đã tồn tại, thực hiện cập nhật
        this.studentsService.updateService(this.flagIndex, this.studentForm);
        this.flagIndex = null;
        alert('Cập nhật thành công')
      } 
      else {
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
