import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { QuerySnapshot, Timestamp } from '@firebase/firestore-types';
import { Todo } from '../../models/todo.model';
import { LoaderProvider } from '../../providers/loader/loader';
import { User } from '../../models/user.model';
import { ToasterProvider } from '../../providers/toaster/toaster';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  newText: string;
  todoList: Todo[];

  constructor(public navCtrl: NavController, private angularFirestore: AngularFirestore, private angularFireAuth: AngularFireAuth, private loaderProvider: LoaderProvider, private events: Events, private ref: ChangeDetectorRef, private toasterProvider: ToasterProvider) {
    this.todoList = [];
  }

  ngOnInit(): void {
    this.events.subscribe('sign', (user, status) => {
      // this.loaderProvider.show();
      if (status) {
        this.getTodoList(user);
        this.toasterProvider.show(`${user.displayName}님, 반갑습니다. 오늘 하루도 보람찬 하루가 되길 기도합니다!`, 4000, 'center', false);
      }
    });
  }

  ngOnDestroy(): void {
    this.todoList = [];
    this.newText = '';
  }

  getTodoList(user: User) {
    this.angularFirestore.collection("todos").ref.where("email", "==", user.email).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.exists) {
          // console.log(`${doc.id} => ${doc.data()}`);
          let tmp: Todo = { id: doc.id, email: doc.data().email, done: doc.data().done, text: doc.data().text, isEditing: false, date: new Date() };
          this.todoList.push(tmp);
        }
        else {
          // TODO: 에러처리
        }
      });
      this.ref.detectChanges();
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
    this.todoList.splice(i, 1);
    this.angularFirestore.collection("todos").doc(this.todoList[i].id).delete()
      .then(() => {
        console.log("Document successfully deleted!");
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
}
