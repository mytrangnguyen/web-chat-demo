import firebase from "firebase";
// import uuid from "uuid/v4";

firebase.initializeApp({
  apiKey: "AIzaSyAqEv81FqrgvLdVog9N5bcfUoNVjtswk3U",
  authDomain: "webchat-a085a.firebaseapp.com",
  databaseURL: "https://webchat-a085a.firebaseio.com",
  projectId: "webchat-a085a",
  storageBucket: "webchat-a085a.appspot.com",
  messagingSenderId: "992314328687",
  appId: "1:992314328687:web:bd433af683241f25e36f9a",
  measurementId: "G-Z2NZX4TR1L",
});
firebase.analytics();
export { firebase };

// export {firebaseConfig};
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();
export const db = firebase.firestore();

export const addNewUserToCloud = ({
  id,
  firstname,
  lastname,
  email,
  password,
}) => {
  console.log("vào adđ user to cloud");

  db.collection("Users")
    .add({
      id: id,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
    })
    .then(() => {
      console.log("User added!");
    })
    .catch((error) => {
      console.log("not added yet ", error);
    });
};

export const addNewUserToRealTimeDatabase = ({ id, email, name, role }) => {
  database.ref("users/" + id).set({
    id: id,
    email: email,
    name: name,
    role: role,
  });
};

export const addNewUser = ({ id, firstname, lastname, email, password }) => {
  database.ref("usersTable/" + id).set({
    id: id,
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    type:"notContact"
  });
};
// db.collection("cities").add({
export const manageRequestAddContact = (senderID, senderFirstname, senderLastname, receiverID) => {
  console.log("vafo ddaay quarn ly");
  db.collection("manageRequestAddContact" ).add({
    id: receiverID,
    senderID: senderID,
    senderFirstname: senderFirstname,
    senderLastname: senderLastname,
    receiverID: receiverID,
    isAccept : false
  });
}

export const addNewNodeChat = (id1, id2) =>{
database.ref(`${id1}-${id2}`);
}
