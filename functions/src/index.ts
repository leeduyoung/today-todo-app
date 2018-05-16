import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { firebaseConfig } from "../../src/config/config";
admin.initializeApp(firebaseConfig);
const firestore = admin.firestore();

export const helloWorld = functions.https.onRequest((request, response) => {
  console.log("called helloWorld function");
  response.send("Hello from Firebase!");
});

/**
 * 매일 00시 10분에 모든 유저의 어제할일(또는 과거할일)을 삭제합니다.
 */
export const deleteYesterdayTodos = functions.https.onRequest(
  (request, response) => {
    const currentDate = new Date();

    firestore
      .collection("todos")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data());
          console.log(doc.data().date.getDate());
          console.log(currentDate.getDate());
          console.log(doc.data().date.getDate() !== currentDate.getDate());

          if (doc.data().date.getDate() !== currentDate.getDate()) {
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
