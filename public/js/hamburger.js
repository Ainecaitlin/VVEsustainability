$(document).ready(function() {
    $('#show-hidden-menu').click(function() {
      $('.hidden-menu').slideToggle("slow");
      // Alternative animation for example
      // slideToggle("fast");
    });
  });