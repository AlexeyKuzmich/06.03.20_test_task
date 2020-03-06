$(function(){

	var toggleMenu = $('.toggle-menu'),
	mainNav = $('.mainNav');

	toggleMenu.on('click', function(){
		mainNav.toggleClass('activeMenu');
	});


	$(".owl-mainSlider").owlCarousel({
		loop: true,
		margin: 0,
		nav: true,
		dots: true,
		nav: true,
		pagination: true,
		autoplay: false,
		autoplayTimeout: 3000,
		autoplayHoverPause: true,
		items: 1
	});

   // исчезают значки навигации (причина непонятна). решение:
   var $owl = $(".owl-mainSlider");
   var $owlNav = $owl.find('.owl-nav');
   $owlNav.removeClass('disabled');
   $owl.on('changed.owl.carousel', function(event) {
   	$owlNav.removeClass('disabled');
   });




   $(".owl-pop-slider").owlCarousel({
   	loop: true,
   	margin: 0,
   	nav: true,
   	dots: true,
   	nav: true,
   	pagination: true,
   	autoplay: false,
   	autoplayTimeout: 3000,
   	autoplayHoverPause: true,
   	responsive:{
   		0: {
   			items: 1
   		},
   		767: {
   			items: 2
   		},
   		900: {
   			items: 3
   		},
   		1200: {
   			items: 5
   		}
   	}
   });

   var $owl_pop = $(".owl-pop-slider");
   var $owlNav_pop = $owl_pop.find('.owl-nav');
   $owlNav_pop.removeClass('disabled');
   $owl_pop.on('changed.owl.carousel', function(event) {
   	$owlNav_pop.removeClass('disabled');
   });

  // убрать текст с кнопок навигации
  $(".owl-prev").text("");
  $(".owl-next").text("");
  
  // scroll to top
  (function() {
    var $scrollToTop = $(".scrollToTop");
    $(window).scroll(function() {
      if ( $(this).scrollTop() > 100 ) {
        $scrollToTop.css("right","100px");
      } else {
        $scrollToTop.css("right","-100px");
      }
    });

    $scrollToTop.click(function() {
      $("body, html").animate({scrollTop: 0}, 500);
    });
  })();

});