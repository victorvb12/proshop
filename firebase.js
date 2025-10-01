// ProShop firebase.js
// For this demo we don't actually use Firebase — but we keep this file
// so your HTML <script type="module" src="js/firebase.js"> won't break.
// If you want real Firebase Auth/Firestore, you can integrate here.

export const authApi = {
  onAuthState: (cb) => cb(null) // always "no user"
};
