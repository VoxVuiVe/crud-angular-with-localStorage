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
  studentForm: any = {} //Khai bao de luu SV trong form
  selectedFile: File | null = null;
  flagIndex: number = -1; //De xac dinh sinh vien.
  isEditing = false;

  // Search
  searchItems = '';

  // Pagination
  totalLength: any;
  page: number = 1;

  validateForm: FormGroup; //duoc su dung de quan li va kiem tra bieu mau

  ngOnInit(): void {
    this.loadStudents();
    this.reset()
  }

  onFileSelected(event: any) { //tạo onFileSelected de xu li ng dung khi chon tep thong qua su kien (event)
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
      reader.onload = (event: any) => {;
        this.studentForm.image = event.target.result;
        this.studentsService.addService(this.studentForm);
        // this.studentForm = {};
        // this.selectedFile = null;
        this.cancelEdit();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateStudent(students: Students): void {
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

  saveOrUpdate(students: Students): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        students.image = event.target.result;
        if (students.id) {
          // Nếu có ID, thì đây là một người đã tồn tại, cần cập nhật
          this.studentsService.updateService(students);
        } else {
          // Nếu không có ID, thì đây là một người mới, cần thêm mới
          this.studentsService.addService(students);
        }
        this.cancelEdit();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      if (students.id) {
        this.studentsService.updateService(students);
      } else {
        this.studentsService.addService(students);
      }
      this.cancelEdit();
    }
  }

  editStudent(students: Students) {
    this.isEditing = true; 
    this.studentForm = { ...students}; // dùng spread ... để copy tất cả thuộc tính từ student cần chỉnh sửa vào studentForm
  }

  cancelEdit() {
    this.flagIndex = -1;
    this.studentForm = {};
    this.reset()
    const fileInput = document.getElementById('image') as HTMLInputElement;
    fileInput.value = '';
  }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.studentsService.deleteService(id);
    }
    this.loadStudents()
  }

  reset(): void {
    this.isEditing = false;
    this.validateForm.reset()
  }

  noWhiteSpaceValidator(control: FormControl) {
    if(control.value && control.value.trim() === '') 
      return {noWhiteSpace: true}
     return null;
  }

  search() {
    if (this.searchItems.trim() === '') {
      this.loadStudents()
    } else {
      // Nếu có từ khóa tìm kiếm, lọc danh sách sinh viên dựa trên từ khóa
      this.students = this.studentsService.getAll().filter(student => { //Dung filter de loc tu khoa tim kiem
        const searchItems = this.searchItems.toLowerCase();
        return (
          student.name.toLowerCase().includes(searchItems) ||
          student.email.toLowerCase().includes(searchItems) ||
          student.phone.toString().toLowerCase().includes(searchItems) ||
          student.country.toLowerCase().includes(searchItems) ||
          student.dob.toLowerCase().includes(searchItems) ||
          student.gender.toLowerCase().includes(searchItems)
        );
      });
    }
  }
}
