import { Injectable } from '@angular/core';
import { Students } from '../models/students';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students: Students[] = [];

  constructor() {
    this.loadLocalData();
  }

  private loadLocalData(): void { 
    const localData = localStorage.getItem('students'); //Lay du lieu voi tu khoan students tu LocalStorage
    if (localData) {
      this.students = JSON.parse(localData);
    }
  }

  getAll(): Students[] {
    return this.students;
  }

  deleteService(id: number): void {
    const index = this.students.findIndex((st) => st.id === id)
    if (index !== -1) {
      this.students.splice(index, 1);
      this.saveLocalData();
    }
  }

  addService(student: Students): void {
    student.id = this.generateId();
    this.students.push(student);
    this.saveLocalData();
  }

  updateService(student: Students): void {
    const index = this.students.findIndex((st) => st.id === student.id)
    if (index !== -1) {
      this.students[index] = student;
      this.saveLocalData();
    }
  }
  
  private saveLocalData(): void {
    localStorage.setItem('students', JSON.stringify(this.students)); 
  }  //dung pthuc setItem cua LcS de luu chuoi - chuyen doi this.student thanh mot chuoi JSON

  private generateId(): number {
    const maxId = this.students.reduce((max, st) => (st.id > max ? st.id : max), 0);
    return maxId + 1;
  }
}
