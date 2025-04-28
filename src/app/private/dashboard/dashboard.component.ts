import { Component, OnInit,inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../../shared/services/Api.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,CardModule,CardModule,AvatarModule,ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  datos: any = {};

  peliculasData: any;
  peliculasOptions: any;

  platformId = inject(PLATFORM_ID);

  constructor(private api: ApiService) {


  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cargarDatosDashboard();
    this.cargarPeliculas();
  }

  cargarDatosDashboard() {
    this.api.getItems('dashboard/datos').subscribe({
      next: (data: any) => this.datos = data,
      error: () => console.error('Error al cargar datos del dashboard')
    });
  }

  cargarPeliculas() {
    const coloresPorGenero: { [key: string]: string } = {
      'Terror': 'rgba(255, 99, 132, 0.6)',
      'Romance': 'rgba(255, 159, 64, 0.6)',
      'Comedia': 'rgba(75, 192, 192, 0.6)',
    };

    this.api.getItems('dashboard/peliculas').subscribe({
      next: (response: any) => {
        const labels = response.data.map((item: any) => item.genero);
        const valores = response.data.map((item: any) => item.total);

        const backgroundColors = response.data.map((d: any) => {
          return coloresPorGenero[d.genero] ||this.getRandomColor(0.6);
        });

        const borderColors = backgroundColors.map((c: any) => c.replace('0.6', '1'));

        this.peliculasData = {
          labels,
          datasets: [
            {
              label: 'Películas por Genero',
              data: valores,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        };
        this.peliculasOptions = this.getChartOptions('Peliculas por Genero');
      },
      error: (err) => console.error('Error al obtener el conteo de peliculas:', err)
    });
  }

  getRandomColor(opacity: number = 0.6): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }


  getChartOptions(titulo: string) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
      plugins: {
        title: {
          display: true,
          text: titulo,
          color: textColor,
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            display: true
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            display: false
          },
          grid: {
            display: false
          }
        }
      }
    };
  }

}
