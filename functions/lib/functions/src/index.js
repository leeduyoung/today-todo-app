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
 * 매일 00시 10분에 모든 유저의 어제할일을 삭제합니다.
 */
exports.helloWorld2 = functions.https.onRequest((request, response) => {
    console.log("request: ", request);
    console.log("response: ", response);
    /**
     * 1. 매일 00시 10분에 deleteYesterdayTodos 함수를 호출 합니다.
     * 2. todos 도큐먼트를 조회 합니다.
     * 3. 어제 날짜로 등록된 todos가 있다면 삭제 합니다.
     */
    firestore
        .collection("todos")
        .get()
        .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    });
});
//# sourceMappingURL=index.js.map