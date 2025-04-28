import { Component } from '@angular/core';
import { Usuario } from '../../../shared/interface/usuario.interface';
import { ApiService } from '../../../shared/services/Api.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-listado',
  imports: [CommonModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})

export class ListadoComponent {
  usuarios: Usuario[] = [];
  value: string[] = [];

  constructor(private api: ApiService, public router: Router, private route: ActivatedRoute, private messageService: MessageService, private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    this.api.postItem('user/index', {}).subscribe((response: any) => {
      this.usuarios = response.data;
    });
  }

  editarUsuario(usuario: Usuario) {
    const id = usuario.id;
    this.router.navigate(['editarUsuarios', id]);
  }

  eliminarUsuario(usuario: Usuario) {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar el usuario "${usuario.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.api.deleteItem('user', usuario.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Usuario eliminado correctamente'
            });
            this.api.postItem('user/index', {}).subscribe((response: any) => {
              this.usuarios = response.data;
            });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario' });
          }
        });
      }
    });
  }


}
