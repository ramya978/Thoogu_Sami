import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface AppointmentPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  appointmentDate: string;
  appointmentTime: string;
}

type ToastState = 'success' | 'error' | null;

@Component({
  selector: 'app-appontment',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './appontment.html',
  styleUrl: './appontment.css',
})
export class AppontmentComponent {
  public apiUrl = 'https://bhagavadkarma.org/api/appointment.php';

  // form fields (kept as plain properties for [(ngModel)] like the original)
  fname = '';
  lname = '';
  email = '';
  phone = '';
  address = '';
  message = '';
  date = '';
  time = '';
minDate: string = '';
minTime: string = '';
  // ui state
  isSubmitting = signal(false);
  toast = signal<ToastState>(null);
  toastBarWidth = signal('100%');

  private toastTimeoutId?: ReturnType<typeof setTimeout>;
  private toastBarTimeoutId?: ReturnType<typeof setTimeout>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.updateMinTime();
  }

  get isToday(): boolean {
    return this.date === this.minDate;
  }

  updateMinTime() {
    if (this.isToday) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      this.minTime = `${hh}:${mm}`;

      if (this.time && this.time < this.minTime) {
        this.time = '';
      }
    } else {
      this.minTime = ''; 
    }
  }


  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => control.markAsTouched());
      return;
    }

    const payload: AppointmentPayload = {
      firstName: this.fname,
      lastName: this.lname,
      email: this.email,
      phone: this.phone,
      address: this.address,
      message: this.message,
      appointmentDate: this.date,
      appointmentTime: this.formatTimeTo12Hour(this.time),
    };

    this.isSubmitting.set(true);

    this.http
      .post<{ success: boolean; message?: string }>(this.apiUrl, payload)
      .subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          if (response.success) {
            this.showToast('success');
            this.resetForm(form);
          } else {
            console.error('API returned success:false', response);
            this.showToast('error');
          }
        },
        error: (err) => {
          console.error('Appointment submission failed');
          console.error('Status:', err.status);
          console.error('Error body:', err.error);
          this.isSubmitting.set(false);
          this.showToast('error');
        },
      });
  }

  // converts "10:30" (24hr, from <input type="time">) -> "10:30 AM"
  private formatTimeTo12Hour(time24: string): string {
    if (!time24) return '';
    const [hoursStr, minutes] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  private resetForm(form: NgForm) {
    form.resetForm();
    this.fname = '';
    this.lname = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.message = '';
    this.date = '';
    this.time = '';
  }

  private showToast(type: 'success' | 'error') {
    clearTimeout(this.toastTimeoutId);
    clearTimeout(this.toastBarTimeoutId);

    this.toastBarWidth.set('100%');
    this.toast.set(type);

    this.toastBarTimeoutId = setTimeout(() => this.toastBarWidth.set('0%'), 50);
    this.toastTimeoutId = setTimeout(() => this.toast.set(null), 4500);
  }

  dismissToast() {
    clearTimeout(this.toastTimeoutId);
    clearTimeout(this.toastBarTimeoutId);
    this.toast.set(null);
  }

  limitEmailLength() {
  if (this.email && this.email.length > 10) {
    this.email = this.email.substring(0, 10);
  }
}


}