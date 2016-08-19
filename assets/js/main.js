$(document).ready(function() {
	if($(".chat").length > 0){
		$(".toggle-users").on("click",function(){
			$(".users").toggleClass("visible");
		});
	}
});