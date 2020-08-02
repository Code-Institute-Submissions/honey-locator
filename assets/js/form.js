function sendForm(){
emailjs.sendForm("gmail", "honey_locator", "#myForm")
    .then(function() {
       alert("Thanks for your submission!");
    }, function(error) {
       alert("Hmm something has gone wrong here, please try again...", error);
    });
    return false;
}