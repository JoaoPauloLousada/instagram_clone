import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit():void {
    var config = {
      apiKey: "AIzaSyAXWTxldh2IYW4pAMk6z1rSJUhYeN3aA7U",
      authDomain: "jta-instagram-clone-9db1d.firebaseapp.com",
      databaseURL: "https://jta-instagram-clone-9db1d.firebaseio.com",
      projectId: "jta-instagram-clone-9db1d",
      storageBucket: "jta-instagram-clone-9db1d.appspot.com",
      messagingSenderId: "498421596408"
    };
    firebase.initializeApp(config)
  }
}
