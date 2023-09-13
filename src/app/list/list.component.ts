import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  selectedFile: File | null = null;
  flagIndex: number = -1;

  validateForm: FormGroup;

  ngOnInit(): void {
    this.loadStudents();
    this.reset()
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  loadStudents(): void {
    this.students = this.studentsService.getAll();
  }

  constructor(private formBuilder: FormBuilder, private studentsService: StudentService) {
    this.validateForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhiteSpaceValidator]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      dob: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  addStudent() {
    if (this.studentForm && this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.studentForm.image = event.target.result;
        this.studentsService.addService(this.studentForm);
        this.studentForm = {};
        this.selectedFile = null;
        this.cancelEdit();
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
          this.studentsService.updateService(this.flagIndex, this.studentForm);
          this.studentForm = {};
          this.cancelEdit(); // Kết thúc chỉnh sửa
          this.selectedFile = null;
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        // Nếu không có tệp mới được chọn, chỉ cập nhật thông tin khác
        this.studentsService.updateService(this.flagIndex, this.studentForm);
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

  cancelEdit() {
    this.flagIndex = -1;
    this.studentForm = {};
    this.reset()
    const fileInput = document.getElementById('image') as HTMLInputElement;
    fileInput.value = '';
  }

  deleteStudent(index: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.studentsService.deleteService(index);
    }
  }

  reset(): void {
    // this.studentForm = {} as Students;
    this.validateForm.reset()
  }

  noWhiteSpaceValidator(control: FormControl) {
    if(control.value && control.value.trim() === '') 
      return {noWhiteSpace: true}
     return null;
  }
}
