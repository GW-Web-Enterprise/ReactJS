import React from 'react';
import './App.css';

// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app'
/* The type information from the import statement will include all of the SDKs, not just the
ones you have required below, so you could get a runtime error if you reference a non-required service. */

// These imports load individual services into the firebase namespace.
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
  apiKey: "AIzaSyBzHQIRDVJooBCRmF30kwrmU2o6OE4q2rQ",
    authDomain: "gw-enterprise.firebaseapp.com",
    projectId: "gw-enterprise",
    storageBucket: "gw-enterprise.appspot.com",
    messagingSenderId: "268992275771",
    appId: "1:268992275771:web:78231566281d6a84fb831e",
    measurementId: "G-BNDJYP9MPL"
})

function App() {
  return ( <div></div>
  )
}

export default App;
