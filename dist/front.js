var el = document.querySelectorAll('.accordion-title');
el.forEach(function(ele) {
				ele.onclick = function() {
				  ele.closest('.accordion').classList.toggle('active');
				}
});
