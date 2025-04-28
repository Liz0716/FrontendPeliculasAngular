import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/Api.service';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-login',
  imports: [ButtonModule, DividerModule,InputTextModule, FormsModule, ReactiveFormsModule,PasswordModule,RouterModule,ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  Formulario: FormGroup;

  constructor(private formBuilder: FormBuilder, private router:Router, private api: ApiService,private messageService: MessageService){
    this.Formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }


  onSubmit(){
    if (this.Formulario.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos',  detail: 'Por favor completa los campos correctamente'});
      return;
    }
    this.api.postItem('user', this.Formulario.value, 'login').subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.messageService.add({ severity: 'success', summary: 'Bienvenido'});

        localStorage.setItem('token', response.access_token);
        localStorage.setItem('rol', response.rol);
        localStorage.setItem('user_id', response.id);


        setTimeout(() => {
          this.router.navigate(['/peliculas']);
        }, 1000);

      },
      error: (error) => {
        console.error('Error en login:', error);
        this.messageService.add({ severity: 'error',summary: 'Error de autenticacion', detail: 'Correo o contraseña incorrectos'});
      }
    });

  }

  formularioRegistro() {
    this.router.navigate(['/registro']);
  }

}


