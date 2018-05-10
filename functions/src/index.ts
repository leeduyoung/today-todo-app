import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const deleteYesterdayTodos = functions.https.onRequest((request, response) => {
    console.log("request: ", request);
    console.log("response: ", response);

    // 매일 00시 10분에 모든 유저의 어제할일을 삭제합니다.
    functions.firestore.document('todos').onDelete(querySnapshot => {
        console.log(querySnapshot);
        // querySnapshot.ref.
    });

});

// export const test = functions.firestore.document('').onDelete(event => {

//     // 매일 00시 10분에 모든 유저의 어제할일을 삭제합니다.

// });

// export const test2 = functions.firestore.document('').onCreate(event => {

//     // 유저가 생성되면... ???
// });

