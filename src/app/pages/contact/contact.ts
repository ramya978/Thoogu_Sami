import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  formData = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    message: ''
  };

  sendMail() {
    const { fname, lname, email, phone, message } = this.formData;

    if (!fname || !lname || !email || !phone) {
      return;
    }

    const subject = encodeURIComponent('Contact Form Submission from ' + fname + ' ' + lname);
    const body = encodeURIComponent(
      `First Name: ${fname}\n` +
      `Last Name: ${lname}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Message: ${message || 'N/A'}`
    );

    window.location.href = `mailto:info@ascendingsoftware.com?subject=${subject}&body=${body}`;
  }
}