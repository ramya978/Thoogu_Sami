import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appontment',
  imports: [FormsModule, CommonModule],
  templateUrl: './appontment.html',
  styleUrl: './appontment.css',
})
export class AppontmentComponent {
  toastVisible = false;
  toastMessage = '';
  toastBarWidth = 100;

  // Form field references (for clearing)
  fname = '';
  lname = '';
  email = '';
  phone = '';
  address = '';
  message = '';
  date = '';
  time = '';

  closeToast() {
    this.toastVisible = false;
  }

  onSubmit() {
    // Show success toast
    this.toastVisible = true;
    this.toastMessage = 'Message sent successfully';
    this.toastBarWidth = 100;

    // Clear form fields
    this.fname = '';
    this.lname = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.message = '';
    this.date = '';
    this.time = '';

  
  }
}
