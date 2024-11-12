import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // Obtiene los controles de los campos "password" y "confirmPassword" del formulario.
  const passwordControl = control.get('password');
  const confirmPasswordControl = control.get('confirmPassword');

  // Si alguno de los controles no está presente, no se realiza ninguna validación.
  if (!passwordControl || !confirmPasswordControl) {
    return null;
  }

  // Compara los valores de "password" y "confirmPassword". Si no coinciden, establece un error en el control de "confirmPassword".
  if (passwordControl.value !== confirmPasswordControl.value) {
    confirmPasswordControl.setErrors({ passwordMismatch: true });
  } else {
    // Si los valores coinciden, elimina cualquier error previo en el control de "confirmPassword".
    confirmPasswordControl.setErrors(null);
  }

  // Retorna `null` porque el validador no aplica directamente al formulario padre, sino a los controles hijos.
  return null;
};
