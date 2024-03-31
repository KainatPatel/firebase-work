import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {  getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut , onAuthStateChanged , GoogleAuthProvider ,signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { doc, setDoc, getFirestore , getDoc , collection, addDoc , query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
const firebaseConfig = {
    apiKey: "AIzaSyDG084w0vMYlSBQl6C5v-OD3rlSY9157f0",
    authDomain: "saylani-6d8d7.firebaseapp.com",
    projectId: "saylani-6d8d7",
    storageBucket: "saylani-6d8d7.appspot.com",
    messagingSenderId: "281358697230",
    appId: "1:281358697230:web:ca813cba506169ae5ccd5f"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



const register = ()=>{
    const first = document.getElementById("first");
    const last = document.getElementById("last");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
// email.value="";
// password.value="";
console.log(first.value,last.value,email.value,password.value)
createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    const user = userCredential.user;
   console.log("user--->",user)
   Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Your account has been created sucessfully",
    showConfirmButton: false,
    timer: 1500
  });

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("errorMessage",errorMessage)
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
        
      });
  });
}
window.register= register;


// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const finallogin =  ()=>{
  const email = document.getElementById("email");
    const password = document.getElementById("password");
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
   
      const user = userCredential.user;
console.log("user--->",user)
   
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Welcome!",
      showConfirmButton: false,
      timer: 2000
       });
       window.location.href = "library.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errorMessage",errorMessage)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
        
      });
    });

}
window.finallogin = finallogin;


let logout = ()=>{
  signOut(auth).then(() => {
    window.location.href = "register.html"
  }).catch((error) => {
    // An error happened.
  });
}
let logoutBtn = document.getElementById("logoutBtn");
 logoutBtn && logoutBtn.addEventListener("click",logout)

 onAuthStateChanged(auth, async(user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
const docSnap = await getDoc(docRef);
console.log("doc",docSnap.data())
if(docSnap.data()){
  console.log("user-->",user)
  if(location.pathname !== "/library.html"){
    window.location = "library.html"
  }
  
} 


  } else {
    console.log("not login")
    // if(location.pathname !== "/login.html" && location.pathname !== "/register.html"){
      if(location.pathname === "/library.html"){
      window.location = "login.html"
    }
  } 
     
    
 }
 )
const db = getFirestore();
 let addUserToFirestore =  async(user) =>{
 const res = await setDoc(doc(db, "users", user.uid), {
    name: user.displayName,
    email: user.email,
    verify : user.emailVerified,
    photo: user.photoURL,
    uid : user.uid
  });
  console.log("res-->",res)
 }


// google k liye
 const provider = new GoogleAuthProvider();

let  GoogleProvider =() => {
  signInWithPopup(auth, provider)
  .then((result) => {
   
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
   
    const user = result.user;
    
    console.log("user--->",user)
    addUserToFirestore(user)
  }).catch((error) => {
    
    const errorCode = error.code;
    const errorMessage = error.message;
    
    const email = error.customData.email;
    
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log("error-->",errorMessage)
  });

}
let signInwithgoogle = document.getElementById("signInwithgoogle");
 signInwithgoogle && signInwithgoogle.addEventListener ("click" , GoogleProvider)


// book work

// const formbtn = document.getElementById("sumbit");
// formbtn.addEventListener('click', async()=>{
//   const booktitle = document.getElementById("booktitle").value;
//   const bookprice = document.getElementById("bookprice").value;
//   // console.log(bookprice, booktitle)
//   const docRef = await addDoc(collection(db, "books"), {
//     title: booktitle.title,
//     currency : bookprice.currency
//   });
//   console.log("Document written with ID: ", docRef.id);
  
// })


const formbtn = document.getElementById("sumbit"); // "submit" ki jagah "sumbit" likha hua tha
 formbtn && formbtn.addEventListener('click', async () => {
  const booktitle = document.getElementById("booktitle").value;
  const bookprice = document.getElementById("bookprice").value;
  const bookimage = document.getElementById("bookimage").value

  // Saahi se input values collect ki hai. Ab Firestore me data store karein.
  try {
    // Firestore me data store karne ke liye collection ka use karna hoga, yeh ek collection reference provide karta hai.
    const docRef = await addDoc(collection(db, "books"), {
      title: booktitle, // booktitle.title ki jagah sirf booktitle likhna hoga
      currency: bookprice, // bookprice.currency ki jagah sirf bookprice likhna hoga
      url : bookimage
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

let getAllBooks = async()=>{
  const ref = collection(db, "books");
  const unsubscribe = onSnapshot(ref, (querySnapshot) => {
    const addingBook = document.getElementById("addingBook");
      const bookPicture = document.getElementById("bookPicture").value;
      const bookName = document.getElementById("bookName").value;
      const dollarPrice = document.getElementById("dollarPrice").value;
      console.log(bookPicture,bookName,dollarPrice)
    querySnapshot.forEach((doc) => {
        addingBook.innerHTML += `
        <div class="col">
         <div class="card library-new-card1" style="width:12rem;">
           <img height="200" src = ${doc.data().url}
            class="card-img-top horror-width" alt="...">
          <div class="card-body">
            <div class="d-flex justify-content-center">
              <h5 class="card-title horror-card-title">${doc.data().title}</h5>
            </div>
            <div class="d-flex justify-content-center">
              <p class="card-text horror-card-text">$${doc.data().currency}</p>
            </div>
            <div class="d-flex justify-content-center">
              <a href="order.html" class="btn btn-primary horror-card-btn">Order Now</a>
            </div>
          </div>
        </div>
      </div>     
        `
    });
   
  });
  
}
  
getAllBooks();
