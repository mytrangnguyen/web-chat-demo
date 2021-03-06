import asapi from "../../api/asapi";
import {auth, addNewUser} from "../../services/firebase"

export const fetchSignin = async ({ email, password }) => {
    const response = await asapi.post("/auth/login", {
        email,
        password,
    });
    return response;
};

export const fetchSignup = async ({ firstname, lastname, email, password }) => {
  await auth
  .createUserWithEmailAndPassword(email, password)
  .then((res) => {
    // addNewUser({
    //   id: res.user.uid,
    //   firstname: firstname,
    //   lastname: lastname,
    //   email: email,
    //   password: password,
    // });
    console.log("res", res);
    
    return res;
  })
  .catch((err) => {
    console.error(err);
  });

//   const response = await asapi.post("/auth/register", {
//     firstname,
//     lastname,
//     email,
//     password,
// });
// return response;
    
};

export const fetchSendResetPassword = async (email) => {
    const response = await asapi.post("/auth/send-password-reset", email);
    return response;
};

export const fetchChangePassword = async (data) => {
    const response = await asapi.post("/auth/reset-password", data);
    return response;
};

export const fetchRefreshToken = async (data)=>{
    const response = await asapi.post("/auth/refresh-token", data);
    return response;
}
