// send form

(function () {
  emailjs.init("user_S3AG8fpXyuDH5VmtFjNMV");
})();

function sendForm() {
  emailjs.sendForm("gmail", "honey_locator", "#myForm").then(
    function () {
      alert("Thanks for your suggestion, we'll get back to you asap!");
    },
    function (error) {
      alert("Hmm something has gone wrong here, please try again...", error);
    }
  );

  //close modal on submit
  $("#modal").modal("hide");
  return false;
}
