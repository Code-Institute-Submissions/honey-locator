function sendForm(){
emailjs.sendForm("gmail", "honey_locator", "#myForm")
    .then(function() {
       alert("Thanks for your suggestion, we'll get back to you asap!");
    }, function(error) {
       alert("Hmm something has gone wrong here, please try again...", error);
    });
    return false;
}