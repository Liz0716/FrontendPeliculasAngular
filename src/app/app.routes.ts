import { Routes } from '@angular/router';
import { NavbarComponent } from './private/navbar/navbar.component';
import { VerComponent } from './private/peliculas/ver/ver.component';
import { ListadoComponent } from './private/usuarios/listado/listado.component';
import { AgregarComponentU } from './private/usuarios/agregar/agregar.component';
import { guardGuard } from './shared/guard/guard.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./public/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./public/registro/registro.component').then(c => c.RegistroComponent)
  },
  {
    path: '', component: NavbarComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./private/dashboard/dashboard.component').then(c => c.DashboardComponent),
        canActivate: [guardGuard],
        data: {
          roles: [0,1]
        }
      },
      {
        path: 'peliculas',
        component: VerComponent,
        canActivate: [guardGuard],
        data: {
          roles: [0,1]
        }
      },
      {
        path: 'agregarPeliculas',
        loadComponent: () => import('./private/peliculas/agregar/agregar.component').then(c => c.AgregarComponent),
        canActivate: [guardGuard],
        data: {
          roles: [0,1]
        }
      },
      {
        path: 'editarPeliculas/:id',
        loadComponent: () => import('./private/peliculas/agregar/agregar.component').then(c => c.AgregarComponent),
        canActivate: [guardGuard],
        data: {
          roles: [0,1]
        }
      },
      {
        path: 'usuarios',
        component: ListadoComponent,
        canActivate: [guardGuard],
        data: {
          roles: [1]
        }
      },
      {
        path: 'agregarUsuarios',
        loadComponent: () => import('./private/usuarios/agregar/agregar.component').then(c => c.AgregarComponentU),
        canActivate: [guardGuard],
        data: {
          roles: [1]
        }
      },
      {
        path: 'editarUsuarios/:id',
        loadComponent: () => import('./private/usuarios/agregar/agregar.component').then(c => c.AgregarComponentU),
        canActivate: [guardGuard],
        data: {
          roles: [1]
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }

];
