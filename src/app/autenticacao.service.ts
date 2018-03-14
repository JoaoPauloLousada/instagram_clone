import { Usuario } from "./acesso/usuario.model";
import * as firebase from 'firebase';
import { Injectable } from "@angular/core";
import {Router} from '@angular/router';

@Injectable()
export class Autenticacao {
    public token_id:string 
    constructor(private router: Router){}
    public cadastrarUsuario(usuario: Usuario): Promise<any> {
        console.log("chegamos até o servico:",usuario)

        return firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
            .then((resposta:any)=>{
                //remove a senha do objeto usuario antes de gravar no banco
                delete usuario.senha
                //registra dados complementares do usuario no path email na base64
                firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`)
                    .set(usuario)
            })
            .catch((error: Error) => {
                console.log(error)
            })
    }

    public autenticar(email:string, senha:string):void {
        console.log('email:',email)
        console.log('senha:',senha)
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((resposta: any)=>{
                firebase.auth().currentUser.getIdToken()
                    .then((idToken:string) => {
                        this.token_id = idToken
                        sessionStorage.setItem('idToken', idToken)
                        this.router.navigate(['/home'])
                    })
            })
            .catch((error:Error) => console.log("erro:",error))
    }

    public autenticado():boolean {
        if(this.token_id === undefined && 
            sessionStorage.getItem('idToken') != null) {
            this.token_id = sessionStorage.getItem('idToken')
        }
        if(this.token_id === undefined){
            this.router.navigate(['/'])
        }
        return this.token_id !== undefined
    }

    public sair():void {
        console.log("chegou aqui")
        firebase.auth().signOut()
            .then(() => {
                sessionStorage.removeItem('idToken')
                this.token_id = undefined
                this.router.navigate(['/'])
            })
        
    }
}//Fim da Classe Autenticacao