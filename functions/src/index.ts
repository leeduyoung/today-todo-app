import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { firebaseConfig } from "../../src/config/config";
import * as moment from 'moment';
admin.initializeApp(firebaseConfig);
const firestore = admin.firestore();

export const helloWorld = functions.https.onRequest((request, response) => {
  console.log("called helloWorld function");
  console.log(moment());
  console.log(moment().add(9,'hours'));
  response.send("Hello from Firebase!");
});

/**
 * 매일 00시 10분에 모든 유저의 어제할일(또는 과거할일)을 삭제합니다.
 */
export const deleteYesterdayTodos = functions.https.onRequest(
  (request, response) => {
    const currentDate = moment().add(9, 'hours');

    firestore
      .collection("todos")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data());
          console.log(moment(doc.data().date));
          console.log(currentDate);
          console.log(moment(doc.data().date).add(9, 'hours').date() !== currentDate.date());

          if (moment(doc.data().date).add(9, 'hours').date() !== currentDate.date()) {
            doc.ref.delete().then(() => {
              console.log('Document successfully deleted!');
            })
            .catch(error => {
              console.log('erorr: ', error);
            });
          }
        });
      });

    response.send("Success called deleteYesterdayTodos!");
  }
);
