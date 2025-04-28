import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn,Router } from '@angular/router';


export const guardGuard: CanActivateFn = (route, state) => {

  // console.log(route);
  // console.log(state);
  // const localStorage = window.localStorage;
  const platform_id = inject(PLATFORM_ID);
  const router = inject(Router);


  let token: string | null = null;
  let rol: string | null = null;


  if (isPlatformBrowser(platform_id)) {
    token = localStorage.getItem('token');
    rol = localStorage.getItem('rol');
  }

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data?.['roles'] as number[] | undefined;


  if (allowedRoles && rol !== null && !allowedRoles.includes(+rol)) {
    router.navigate(['/login']);
    return false;
  }

  return true;

  // if(localStorage.getItem('token')){
  //   return true;
  // }
  // return false;

};
