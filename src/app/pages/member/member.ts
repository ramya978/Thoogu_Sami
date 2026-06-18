import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class MemberComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private saved = this.authService.loadMemberDetails();
  // expose saved PAN to template for binding
  savedPan: string | undefined = this.saved?.pan;

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fname = (form.querySelector('#fname') as HTMLInputElement).value.trim();
    const lname = (form.querySelector('#lname') as HTMLInputElement).value.trim();
    const email = (form.querySelector('#email') as HTMLInputElement).value.trim();
    const phone = (form.querySelector('#phone') as HTMLInputElement).value.trim();

    if (!fname || !email || !phone) {
      this.showToast('Please fill in all required fields.');
      return;
    }

    const name = `${fname} ${lname}`.trim();

    // Save member details to localStorage for checkout autofill (include PAN if provided or previously saved)
    const existingPan = this.saved?.pan;
    // try to read pan from form if user entered it (only when not readonly)
    const panInput = form.querySelector('#pan') as HTMLInputElement | null;
    const pan = panInput ? panInput.value.trim() : existingPan;

    this.authService.saveMemberDetails({ fname, lname, email, phone, pan });

    // Auto-login
    this.authService.login(name, phone, email);

    // Show toast & redirect
    this.showToastSuccess(() => {
      this.router.navigate(['/']);
    });
  }

  private showToast(msg: string) {
    const toast = document.getElementById('memberToast');
    const bar = document.getElementById('memberToastBar');
    if (!toast || !bar) return;

    const msgEl = toast.querySelector('.toast-msg') as HTMLElement;
    if (msgEl) msgEl.textContent = msg;

    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';

    bar.style.transitionDuration = '3s';
    bar.style.width = '0%';

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
      bar.style.transitionDuration = '0s';
      bar.style.width = '100%';
    }, 3000);
  }

  private showToastSuccess(callback: () => void) {
    const toast = document.getElementById('memberToast');
    const bar = document.getElementById('memberToastBar');
    if (!toast || !bar) return;

    const msgEl = toast.querySelector('.toast-msg') as HTMLElement;
    if (msgEl) msgEl.textContent = 'Welcome to our spiritual community.';

    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';

    bar.style.transitionDuration = '3s';
    bar.style.width = '0%';

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
      bar.style.transitionDuration = '0s';
      bar.style.width = '100%';
      callback();
    }, 3000);
  }
}