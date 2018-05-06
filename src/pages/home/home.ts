import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { QuerySnapshot } from '@firebase/firestore-types';
import { Todo } from '../../models/todo.model';
import { LoaderProvider } from '../../providers/loader/loader';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  newText: string;
  todoList: Todo[];

  constructor(public navCtrl: NavController, private angularFirestore: AngularFirestore, private angularFireAuth: AngularFireAuth, private loaderProvider: LoaderProvider) {
    this.todoList = [];
    this.loaderProvider.show();
  }

  ngOnInit(): void {
    this.angularFirestore.collection("todos").ref.get().then(querySnapshot => {
      console.log(querySnapshot);
      querySnapshot.forEach(doc => {
        console.log(`${doc.id} => ${doc.data()}`);
        let tmp: Todo = {email: doc.data().email, done: doc.data().done, text: doc.data().text, isEditing: false};
        this.todoList.push(tmp);
      });
      this.loaderProvider.hide();
    });
  }

  addTodo(newText) {
    if(newText) {
      let tmp = {
        done: false,
        text: newText,
        isEditing: false,
        email: this.angularFireAuth.auth.currentUser.email,
      };
      this.todoList.push(tmp);
      this.newText = '';

      this.angularFirestore.collection("todos").add(tmp)
        .then((docRef: any) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    }
  }

  editTodo(i) {
    console.log('editTodo: ', this.todoList[i]);
    this.todoList[i].isEditing = true;

  }

  deleteTodo(i) {
    console.log('deleteTodo: ', this.todoList[i]);
    this.todoList.splice(i, 1);

    // TODO: db에서 제거
  }

  editComplete(i) {
    console.log('before: ', this.todoList[i]);
    this.todoList[i].isEditing = false;

    // TODO: db에서 수정
  }
}
