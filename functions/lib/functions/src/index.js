"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config_1 = require("../../src/config/config");
admin.initializeApp(config_1.firebaseConfig);
const firestore = admin.firestore();
exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log("called helloWorld function");
    response.send("Hello from Firebase!");
});
/**
 * 매일 00시 10분에 모든 유저의 어제할일(또는 과거할일)을 삭제합니다.
 */
exports.deleteYesterdayTodos = functions.https.onRequest((request, response) => {
    const currentDate = new Date();
    firestore
        .collection("todos")
        .get()
        .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            console.log(doc.id, " => ", doc.data());
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
});
//# sourceMappingURL=index.js.map