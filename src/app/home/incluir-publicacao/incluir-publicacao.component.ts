import { Progresso } from './../../progresso.service';
import { Bd } from './../../bd.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import * as firebase from 'firebase';
import{Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  @Output() public atualizarTimeLine: EventEmitter<any> = new EventEmitter<any>()
  public email:string
  public formulario: FormGroup= new FormGroup({
    'titulo': new FormControl(null)
  })
  private imagem: any
  public progressoPublicacao:string = 'pendente'

  public porcentagemUpload:number
  constructor(
    private bd: Bd,
    private progresso: Progresso
  ) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
    })
  }

  public publicar(): void {
    this.bd.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem[0]
    })
    let continua = new Subject()
    continua.next(true)
    let acompanhamentoUpload = Observable.interval(1500)
    acompanhamentoUpload
      .takeUntil(continua)
      .subscribe(() => {
      //console.log(this.progresso.status)
      //console.log(this.progresso.estado)
      this.progressoPublicacao = 'andamento'
      this.porcentagemUpload = Math.round((this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes)*100)
      if(this.progresso.status === 'concluido'){
        this.progressoPublicacao = 'concluido'
        //emitir um evento do componente parent
        this.atualizarTimeLine.emit()
        continua.next(false)
      }
        
    })
    
  }

  public preparaImagemUpload(event: Event):void {
    this.imagem = (<HTMLInputElement>event.target).files
  }
}
