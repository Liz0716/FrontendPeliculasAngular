import { Component } from '@angular/core';
import { FormGroup,FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../shared/services/Api.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Pelicula } from '../../../shared/interface/pelicula.interface';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { Dialog } from 'primeng/dialog';


@Component({
  selector: 'app-agregar',
  imports: [ReactiveFormsModule,CommonModule,ToastModule,DropdownModule,ButtonModule,SelectModule,Dialog,FormsModule],
  providers: [MessageService],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent {
  Formulario: FormGroup;
  ID: any = '0';

  peliculas: Pelicula[] = [];

  generos: any = [];
  usuarios: any = [];

  edicion: boolean = false;

  dialgo: boolean = false;
  nombreGenero: string = '';


  constructor(public FormBuilder: FormBuilder, private api: ApiService,private messageService: MessageService, private router: Router,private activateRoute: ActivatedRoute ) {
    this.Formulario = this.FormBuilder.group({
      nombre: ['', Validators.required],
      sinopsis: ['', Validators.required],
      director: ['', Validators.required],
      anio_publicacion: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      urlImagen: ['', Validators.required],
      duracion: ['', Validators.required],
      id_user: ['', Validators.required],
      id_genero: ['', Validators.required],
      nombreGenero: [''],
    });

    // this.Formulario.addControl('nombreGenero', this.FormBuilder.control('', Validators.required));


    this.getGeneros();
    this.getUsuarios();

  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (!params['id']) {
        return;
      }
      this.edicion = true;
      this.ID = params['id'];

      this.api.getItems('peliculas', this.ID).subscribe({
        next: (data: any) => {
          this.peliculas = data;

          if (!this.peliculas || Object.keys(this.peliculas).length === 0) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Pelicula no encontrada',
              detail: 'La pelicula que buscas no existe o fue eliminada'
            });
            setTimeout(() => {
              this.router.navigate(['/peliculas']);
            }, 3000);
            return;
          }

          this.Formulario.reset(this.peliculas);
        },
        error: (error) => {
          console.error('Error al obtener pelicula:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar la informacion de la pelicula'
          });
          setTimeout(() => {
            this.router.navigate(['/peliculas']);
          }, 3000);
        }
      });
    });
  }


  onSubmit(): void {
    if (this.Formulario.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor completa todos los campos'
      });
      return;
    }

    const data = this.Formulario.value;
    console.log('Datos del formulario:', data);


    if (this.ID !== '0') {
      this.api.updateItem('peliculas', this.ID, data).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Pelicula actualizada',
            detail: 'Los datos fueron modificados correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/peliculas']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al actualizar pelicula:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la pelicula'
          });
        }
      });
    } else {
      // Modo creación
      this.api.postItem('peliculas', data).subscribe({
        next: (response) => {
          console.log('Respuesta:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Pelicula registrada',
            detail: response.mensaje || 'Registro exitoso'
          });

          setTimeout(() => {
            this.router.navigate(['/peliculas']);
          }, 3000);
        },
        error: (error) => {
          console.error('Error al registrar pelicula:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar la pelicula'
          });
        }
      });
    }
  }

  getGeneros(){
    this.api.getItems('peliculas/generos').subscribe({
      next: (data:any) => this.generos = data.generos,
      complete: ()  => console.log(this.generos),
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los generos' })
    });
  }
  getUsuarios(){
    this.api.getItems('peliculas/usuarios').subscribe({
      next: (data:any) => this.usuarios = data.usuarios,
      complete: ()  => console.log(this.usuarios),
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' })
    });
  }

  abrirDialogo(){
    this.nombreGenero = '';
    this.dialgo = true;
  }

  cerrarDialogo(){
    this.dialgo = false;
  }

  dialogGenero(){

    // const nombreGenero = prompt('Ingresa el nombre del nuevo género:');
    // const nombre = this.nombreGenero.trim();
    const nombre = this.Formulario.get('nombreGenero')?.value.trim();

    if (!nombre) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Nombre invalido',
        detail: 'Debes ingresar un nombre valido para el genero.'
      });
      return;
    }

    this.api.postItem('genero', { nombre }).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Genero registrado',
          detail: response.mensaje || 'Registro exitoso'
        });
        this.getGeneros();
        this.cerrarDialogo();
        this.Formulario.get('nombreGenero')?.reset();
      },
      error: (error) => {
        console.error('Error al registrar genero:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el genero'
        });
      }
    });


  }



}
