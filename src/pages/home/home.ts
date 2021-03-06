import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Todo } from '../../models/todo.model';
import { LoaderProvider } from '../../providers/loader/loader';
import { ToasterProvider } from '../../providers/toaster/toaster';
import { GlobalsProvider } from '../../providers/globals/globals';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  newText: string;
  todoList: Todo[];

  constructor(public navCtrl: NavController, private angularFirestore: AngularFirestore, private angularFireAuth: AngularFireAuth, private loaderProvider: LoaderProvider, private events: Events, private ref: ChangeDetectorRef, private toasterProvider: ToasterProvider, private globalProvider: GlobalsProvider) {
    this.todoList = [];

    this.events.subscribe('sign', (user, status) => {
      if (status) {
        this.getTodoList(user);
        this.toasterProvider.show(`${user.displayName}님, 반갑습니다. 오늘 하루도 보람찬 하루가 되길 기도합니다!`, 4000, 'center', false);
      }
    });
  }

  ngOnInit(): void {
    if(this.angularFireAuth.auth.currentUser) {
      this.getTodoList(this.angularFireAuth.auth.currentUser);
    }
  }

  ngOnDestroy(): void {
    this.todoList = [];
    this.newText = '';
  }

  getTodoList(user: any) {
    this.loaderProvider.show();
    this.angularFirestore.collection("todos").ref.where("email", "==", user.email).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.exists) {
          console.log(`${doc.id} => ${doc.data()}`);
          let tmp: Todo = { id: doc.id, email: doc.data().email, done: doc.data().done, text: doc.data().text, isEditing: false, date: new Date() };
          this.todoList.push(tmp);
        }
      });
      this.ref.detectChanges();
    })
    .then(() => {
      console.log('this.todoList: ', this.todoList);
      this.loaderProvider.hide();
    })
    .catch(error => {
      console.log(error);
    });
  }

  addTodo(newText) {
    if (newText) {
      let tmp = {
        id: null,
        done: false,
        text: newText,
        isEditing: false,
        email: this.angularFireAuth.auth.currentUser.email,
        date: new Date()
      };
      this.todoList.push(tmp);
      this.newText = '';

      this.angularFirestore.collection("todos").add(tmp)
        .then((docRef: any) => {
          console.log("Document written with ID: ", docRef.id);
          this.todoList[this.todoList.length - 1].id = docRef.id;
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    }
  }

  editTodo(i) {
    this.todoList[i].isEditing = true;
  }

  deleteTodo(i) {
    this.loaderProvider.show();
    this.angularFirestore.collection("todos").doc(this.todoList[i].id).delete()
      .then(() => {
        console.log("Document successfully deleted!");
        this.todoList.splice(i, 1);
        this.loaderProvider.hide();
      })
      .catch(error => {
        console.error("Error delete document: ", error);
      });
  }

  editComplete(i) {
    this.todoList[i].isEditing = false;
    this.angularFirestore.collection("todos").doc(this.todoList[i].id).update({ text: this.todoList[i].text })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch(error => {
        console.error("Error update document: ", error);
      });
  }

  todoDoneToggle(i) {
    console.log('todoDone: ', this.todoList[i]);
    this.angularFirestore.collection("todos").doc(this.todoList[i].id).update({ done: this.todoList[i].done })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch(error => {
        console.error("Error update document: ", error);
      });    
  }
}
