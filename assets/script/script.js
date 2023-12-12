//Funzione per la chiamata Ajax

let apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc4MTZmOGMwNTgzNTAwMTg1MjJjOTIiLCJpYXQiOjE3MDIzNjkwMTYsImV4cCI6MTcwMzU3ODYxNn0.KFwDHeVcN_n0jmRiWXR_bCFqfaf48GkMdmd77VdzWC0'; 
let url = "https://striveschool-api.herokuapp.com/api/product/";

fetch(url, {
  // Chiamata di tipo POST
  method: "POST", // Method della chiamata - Salvataggio di una risorsa
  body: JSON.stringify(obj), // nel body della richiesta invio il dato al server
  headers: {
    "Content-Type": "application/json", // il tipo del contenuto che sto inviando
    Authorization: apiKey
  },
});