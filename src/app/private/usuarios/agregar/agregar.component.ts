import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/Api.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-agregar',
  imports: [FormsModule, ReactiveFormsModule, FloatLabel,InputTextModule,DropdownModule,ButtonModule,PasswordModule,RouterModule,ToastModule],
  providers: [MessageService],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponentU {
  Formulario: FormGroup;
  value: string | undefined;

  ID: any = '0';


  roles = [
    { label: 'Cliente', value: 0 },
    { label: 'Administrador', value: 1 }
  ]

  constructor(private formBuilder: FormBuilder, private api: ApiService,private messageService: MessageService, private router:Router,private activateRoute: ActivatedRoute)
  {
    this.Formulario = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      rol: [, Validators.required],
    });
  }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.ID = params['id'];
        this.api.getItems('user', this.ID).subscribe({
          next: (response: any) => {
            const usuario = response.usuario;
            this.Formulario.patchValue({
              name: usuario.name,
              email: usuario.email,
              rol: usuario.rol,
              password: usuario.password,
            });
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el usuario' });
            this.router.navigate(['/usuarios']);
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.Formulario.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Por favor completa todos los campos' });
      return;
    }

    const datos = this.Formulario.getRawValue();
    if (this.ID !== '0') {
      this.api.updateItem(`user/editar`, this.ID, {
        name: datos.name,
        email: datos.email,
        rol: datos.rol
      }).subscribe({
        next: () => {
          if (datos.password) {
            this.api.updateItem(`user/password`, this.ID, {
              password: datos.password
            }).subscribe({
              next: () => {
                this.messageService.add({ severity: 'success', summary: 'Usuario actualizado', detail: 'Datos y contraseña actualizados' });
                setTimeout(() => this.router.navigate(['/usuarios']), 3000);
              },
              error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la contraseña' })
            });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Usuario actualizado', detail: 'Datos actualizados correctamente' });
            setTimeout(() => this.router.navigate(['/usuarios']), 3000);
          }
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario' })
      });

    } else {
      this.api.postItem('user/register', datos).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Usuario registrado', detail: 'Se creo correctamente' });
          setTimeout(() => this.router.navigate(['/usuarios']), 3000);
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'No se pudo registrar el usuario' });
        }
      });
    }
  }



}
