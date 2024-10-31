import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SignupRequest } from '../../../shared/models/request/signup-request.model';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
   registerForm: FormGroup;

    private formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);
    private snackBar = inject(MatSnackBar);
    private router = inject(Router);

  constructor() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: passwordMatchValidator,
    });
  }

  controlHasError(control: string, error: string) {
    return this.registerForm.controls[control].hasError(error);
  }
  
  onSubmit() {
    if (this.registerForm.valid) {
      const signupRequest: SignupRequest = this.registerForm.value;      
      this.authService.signup(signupRequest).subscribe({
        next: () => {
          this.showSnackBar('Registro exitoso');
          this.router.navigate(['/auth/sign-in']);
        },
        error: () => {
          this.showSnackBar('Error al registrarse, por favor intente de nuevo');
        }
      });
    }
  }

  //TODO: implementar luego en un util porque se utiliza en varios componentes
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
}
