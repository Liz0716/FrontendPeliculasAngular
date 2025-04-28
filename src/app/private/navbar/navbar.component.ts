import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { MegaMenu } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';



@Component({
  selector: 'app-navbar',
  imports: [RouterOutlet,RouterModule,CommonModule,AvatarModule,MegaMenu,ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {


  items: MegaMenuItem[] | undefined;
  rol: number = 0;

  ngOnInit() {
    this.rol = Number(localStorage.getItem('rol'));

    this.items = [
      ...(this.rol == 1 ?[{
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/dashboard'],
      }]: []),
      {
        label: 'Peliculas',
        icon: 'pi pi-video',
        routerLink: ['/peliculas']
      },
      ...(this.rol == 1 ? [{
        label: 'Usuarios',
        icon: 'pi pi-users',
        routerLink: ['/usuarios'],
      }] : []),

    ];
  }

}
