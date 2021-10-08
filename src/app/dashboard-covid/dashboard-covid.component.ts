import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DadosService } from './dados.service';
import { MonthlyCases } from './model';

// Declarando variavel dos graficos
declare var google: any;

@Component({
  selector: 'app-dashboard-covid',
  templateUrl: './dashboard-covid.component.html',
  styleUrls: ['./dashboard-covid.component.css']
})

export class DashboardCovidComponent implements OnInit {

  @ViewChild("myForm", { static: true }) myForm: NgForm;

  casosMensais: MonthlyCases[]
  selected_month: string
  selected_cases: number
  cases: number

  constructor(private dadosService: DadosService) { }

  ngOnInit(): void {
    this.dadosService.state.subscribe(
      update => {
        this.casosMensais = update;
        console.log(update)
        this.init();
      });
    this.listar();
    this.selected_month = "Junho";
  }

  listar() {
    this.dadosService.listar();
  }

  atualizaNovosCasos(): void {
    this.dadosService.setNovoCasos(this.selected_month, this.cases);
  }

  //----------------------------------------------------------------------
  init(): void {
    if (typeof (google) !== "undefined") {
      google.charts.load('current', { 'packages': ['corechart'] });
      setTimeout(() => {
        google.charts.setOnLoadCallback(this.exibirGraficos());
      }, 1000);
    }
  }

  exibirGraficos(): void {
    this.exibirPieChart();
  }

  // --------------GRAFICOS--------------
  exibirPieChart(): void {
    const el = document.getElementById('pie_chart');
    const chart = new google.visualization.PieChart(el);

    chart.draw(this.obterDataTable(), this.obterOpcoes());
  }

  // --------------FIM GRAFICOS--------------
  obterDataTable(): any {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Mês');
    data.addColumn('number', 'Quantidade');

    this.casosMensais.forEach(i => {
      const { cases, month } = i
      data.addRow([month, cases]);
    })
    return data
  }

  obterOpcoes(): any {
    return {
      'title': "",
      'width': 600,
      'height': 500
    };
  }

}
