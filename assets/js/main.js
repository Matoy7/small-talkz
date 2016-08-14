$(document).ready(function() {

	if($("#loginPage").length > 0){
 
	  	$("#owl-example").owlCarousel({
			items : 1, //10 items above 1000px browser width
			itemsDesktop : [1000,1], //5 items between 1000px and 901px
			itemsDesktopSmall : [900,1], // betweem 900px and 601px
			itemsTablet: [600,1], //2 items between 600 and 0
			itemsMobile : false, // itemsMobile disabled - inherit from itemsTablet option
			pagination: false,
			animateOut: 'slideOutDown',
	    	animateIn: 'flipInX',
	    	touchDrag  : false,
     		mouseDrag  : false

		});
		$("#owl-example").data('owlCarousel').reinit({
		     touchDrag  : false,
		     mouseDrag  : false
		 });
		var owl = $("#owl-example").data('owlCarousel');
		$("#join").on("click", function(e){
			owl.goTo(1);
		});
		$("#newConvers").on("click", function(e){
			owl.goTo(0);
		});

	}

});