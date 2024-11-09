import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Permitir acceso si está autenticado
  } else {
    router.navigate(['/auth/sign-in']); // Redirigir a la página de inicio de sesión si no está autenticado
    return false;
  }
};
