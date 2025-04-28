import { Component } from '@angular/core';
import { ApiService } from '../../../shared/services/Api.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Pelicula } from '../../../shared/interface/pelicula.interface';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { Genero } from '../../../shared/interface/genero.interface';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-ver',
  imports: [CommonModule,FormsModule,CardModule,ButtonModule,ToastModule,ConfirmDialogModule,Dialog,DropdownModule],
  providers: [MessageService,ConfirmationService],
  templateUrl: './ver.component.html',
  styleUrl: './ver.component.css'
})
export class VerComponent {

  peliculas: Pelicula[] = [];
  generos: Genero[] = [];

  dialog = false;
  sinopsisSeleccionda: string = '';

  filtradoGenero: number | null = null;


  constructor(private api: ApiService, public router: Router, private route: ActivatedRoute,private messageService: MessageService, private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    this.api.postItem('peliculas/index',{}).subscribe((data: any) => {
      this.peliculas = data.peliculas || [];
      console.log(this.peliculas);
    });

    this.api.getItems('peliculas/generos').subscribe((response: any) => {
      this.generos = response.generos || [];
      console.log('Géneros:', this.generos);
    });

  }

  editarPelicula(pelicula: Pelicula) {
    const id = pelicula.id;
    this.router.navigate(['editarPeliculas', id]);
  }

  eliminarPelicula(pelicula: Pelicula) {
    this.confirmationService.confirm({
      message: `¿Estas seguro que deseas eliminar la pelicula "${pelicula.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.api.deleteItem('peliculas', pelicula.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Pelicula eliminada correctamente'
            });
            this.api.postItem('peliculas/index', {}).subscribe((response: any) => {
              this.peliculas = response.peliculas || [];
            });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la pelicula' });
          }
        });
      }
    });
  }

  verSinopsis(sinopsis: string) {
    this.sinopsisSeleccionda = sinopsis;
    this.dialog = true;
  }


  filtrarGeneros() {
    const filtros: any = {};

    if (this.filtradoGenero) {
      filtros.id_genero = this.filtradoGenero;
    }

    console.log("filtro con ", filtros);


    this.api.postItem('peliculas/index', filtros).subscribe((response: any) => {

      this.peliculas = response.peliculas || [];
    });
  }

  limpiarFiltro() {
    this.filtradoGenero = null;
    this.api.postItem('peliculas/index', {}).subscribe((response: any) => {
      this.peliculas = response.peliculas || [];
    });
  }




}
