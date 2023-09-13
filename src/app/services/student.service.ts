import { Injectable } from '@angular/core';
import { Students } from '../models/students';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students: Students[] = [];
  // studentForm: any = {}
  // photoURL!: string;

  constructor() {
    this.loadLocalData();
  }

  private loadLocalData(): void {
    const localData = localStorage.getItem('students');
    if (localData) {
      this.students = JSON.parse(localData);
    }
  }

  getAll(): Students[] {
    return this.students;
  }

  deleteService(index: number): void {
    if (index >= 0 && index < this.students.length) {
      this.students.splice(index, 1);
      this.saveLocalData();
    }
  }

  addService(student: Students): void {
    this.students.push(student);
    this.saveLocalData();
  }

  updateService(index: number, student: Students): void {
    if (index >= 0 && index < this.students.length) {
      this.students[index] = student;
      this.saveLocalData();
    }
  }

  private saveLocalData(): void {
    localStorage.setItem('students', JSON.stringify(this.students)); 
  }  //dung pthuc setItem cua LcS de luu chuoi - chuyen doi this.student thanh mot chuoi JSON
}
