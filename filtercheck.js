$(document).ready(function () {
    $(".form-check-input").change(function () {
      console.log($(this).attr("id") + " filter applied.");
      // Add filtering logic here
    });
  });
