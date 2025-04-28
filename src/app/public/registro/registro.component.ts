import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';



import { ApiService } from '../../shared/services/Api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule, FloatLabel,InputTextModule,ButtonModule,PasswordModule,RouterModule,ToastModule],
  providers: [MessageService],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  Formulario: FormGroup;
  value: string | undefined;

  constructor(private formBuilder: FormBuilder, private api: ApiService,private messageService: MessageService, private router:Router
  ){
    this.Formulario = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rol: [0]
    });
  }

  onSubmit() {
    if (this.Formulario.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Por favor completa todos los campos' });
      return;
    }

    this.api.postItem('register', this.Formulario.value).subscribe({
      next: (response) => {
        console.log('Respuesta registro:', response);
        this.messageService.add({ severity: 'success', summary: 'Registro exitoso', detail: response.mensaje });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el usuario' });
      }
    });

    console.log(this.Formulario.value);

  }

}
