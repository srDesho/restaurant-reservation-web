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
  standalone: true, // Este componente es "standalone", lo que significa que no depende de un módulo específico y puede ser utilizado directamente en otras partes del proyecto.
  imports: [
    CommonModule, // Importa funcionalidades comunes como *ngIf y *ngFor.
    ReactiveFormsModule, // Se utiliza para trabajar con formularios reactivos en Angular.
    MatFormFieldModule, // Proporciona estilos y estructura para los campos del formulario.
    MatInputModule, // Permite el uso de inputs estilizados de Angular Material.
    MatButtonModule, // Proporciona botones estilizados de Angular Material.
    MatSnackBarModule, // Permite mostrar notificaciones temporales (snackbars).
    MatIconModule, // Proporciona íconos para mejorar la interfaz de usuario.
    RouterLink // Se utiliza para la navegación entre rutas en la aplicación.
  ],
  templateUrl: './register.component.html', // Define la plantilla HTML que se usará para el diseño del componente.
  styleUrls: ['./register.component.css'] // Define los estilos específicos del componente.
})
export class RegisterComponent {
  registerForm: FormGroup; // Define el formulario reactivo del componente.

  // Inyecta servicios necesarios para la funcionalidad del componente.
  private formBuilder = inject(FormBuilder); // Permite construir formularios de manera sencilla.
  private authService = inject(AuthService); // Servicio para manejar la autenticación del usuario.
  private snackBar = inject(MatSnackBar); // Servicio para mostrar notificaciones al usuario.
  private router = inject(Router); // Permite redirigir al usuario a otras rutas dentro de la aplicación.

  constructor() {
    // Inicializa el formulario con los campos necesarios y sus validaciones.
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]], // Campo obligatorio para el nombre.
      lastName: ['', [Validators.required]], // Campo obligatorio para el apellido.
      email: ['', [Validators.required, Validators.email]], // Campo obligatorio y debe ser un correo electrónico válido.
      password: ['', [Validators.required]], // Campo obligatorio para la contraseña.
      confirmPassword: ['', [Validators.required]], // Campo obligatorio para confirmar la contraseña.
    }, {
      validator: passwordMatchValidator, // Validador personalizado para asegurar que las contraseñas coincidan.
    });
  }

  // Verifica si un control específico tiene un error específico.
  controlHasError(control: string, error: string) {
    return this.registerForm.controls[control].hasError(error); // Retorna `true` si el control tiene el error proporcionado.
  }
  
  // Maneja el envío del formulario.
  onSubmit() {
    if (this.registerForm.valid) { // Comprueba si el formulario es válido antes de enviarlo.
      const signupRequest: SignupRequest = this.registerForm.value; // Crea un objeto con los datos del formulario.

      // Llama al servicio de autenticación para registrar al usuario.
      this.authService.signup(signupRequest).subscribe({
        next: () => {
          this.showSnackBar('Registro exitoso'); // Muestra un mensaje de éxito al usuario.
          this.router.navigate(['/auth/sign-in']); // Redirige al usuario a la página de inicio de sesión.
        },
        error: () => {
          this.showSnackBar('Error al registrarse, por favor intente de nuevo'); // Muestra un mensaje de error si ocurre un problema.
        }
      });
    }
  }

  // Muestra un mensaje temporal (snackbar) al usuario.
  // TODO: Refactorizar esta función en una utilidad reutilizable, ya que es utilizada en varios componentes.
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', { // Muestra el mensaje con un botón para cerrar.
      duration: 3000, // El mensaje se cierra automáticamente después de 3 segundos.
    });
  }
}
