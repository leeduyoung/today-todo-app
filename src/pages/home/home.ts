import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  newText: string;
  todoList: {
    done: boolean,
    text: string,
    isEditing: boolean
  }[];

  constructor(public navCtrl: NavController) {
    this.todoList = [];
  }

  ngOnInit(): void {

  }

  addTodo(newText) {
    console.log(newText);
    if(newText) {
      this.todoList.push({
        done: false,
        text: newText,
        isEditing: false
      });
      this.newText = '';
    }
    else {
      // TODO: 팝업 띄우던지..
    }
  }

  editTodo(i) {
    console.log('editTodo: ', this.todoList[i]);
    this.todoList[i].isEditing = true;

  }

  deleteTodo(i) {
    console.log('deleteTodo: ', this.todoList[i]);
    this.todoList.splice(i, 1);
  }

  editComplete(i) {
    console.log('before: ', this.todoList[i]);
    this.todoList[i].isEditing = false;
  }
}
