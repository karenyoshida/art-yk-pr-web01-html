$(function(){

	var $window  = $(window);
	var $document  = $(document);
	var clickEventType=((window.ontouchstart!==null)?'click':'touchend');

	// #で始まるアンカーをクリックした場合に処理
	$document.on(clickEventType, 'a[href^=#]', function() {
		// アンカーの値取得
		var href= $(this).attr("href");
		smoothScroll(href);
		return false;
	});
	function smoothScroll(href){
		// 移動先を取得
		var target = $(href == "#" || href == "" ? 'html' : href);
		// 移動先を数値で取得
		var position = target.offset().top - $('#floatNav').outerHeight();
		// スムーススクロール
		$('body,html').animate({scrollTop:position}, 600, 'swing');
	};

	//pc/sp
	var _device = 'pc';
	var _ww = 0;
	var _timer;
	$window.on('load resize',function(){
		if ( _ww != $window.width() ) {
			if ( $('.pc-only').eq(0).is(':visible') ) {
				_device = 'pc';
			} else {
				_device = 'sp';
			}
			clearTimeout(_timer);
			$('.album__slider__arrow').removeClass('-active');
			_timer = setTimeout(function(){
				$('.album__slider__arrow').height( $('.album__slider__item.-item1 .album__slider__thumb').height() ).addClass('-active');
			},2000);
			_ww = $window.width();
		}
	});

	//スクロール処理
	function scrollAnim() {
		var sT = $window.scrollTop() + $window.height() * 0.9;
		var count = 0;
		$('.-anim').each(function(i){
			var $this = $(this);
			if ( sT > $this.offset().top && $window.scrollTop() < $this.offset().top) {
				count++;
				TweenMax.fromTo($this , 0.8 , {
					opacity: 0,
					y: 100
				}, {
					opacity: 1,
					y: 0,
					ease: Power2.easeInOut,
					delay: 0.2 * count,
					onComplete: function(){
						$this.removeAttr('style');
					}
				});
				$this.removeClass('-anim');
			}
		});
		if ( $window.scrollTop() > $('#nav').offset().top + $('#nav').outerHeight() ) {
			$('#floatNav').attr('data-active', true);
		} else {
			$('#floatNav').attr('data-active', false);
		}
		if ( $('.header').outerHeight() > $window.scrollTop() ) {
			TweenMax.to('.bg' , 0 , {
				y: $('.header').outerHeight() - $window.scrollTop()
			});
		} else {
			TweenMax.to('.bg' , 0 , {
				y: 0
			});
		}
	};

	$window.on('load scroll', function(e){
		scrollAnim();
	});

	$('#floatNav').append($('#nav a').clone());

	//modal
	$('.openGoodsModal').on(clickEventType, function(){
		$('#goodsModal .modal__wrap').append($(this).clone());
		$('#goodsModal').attr('data-active', true);
	});

	$('.openMovieModal').on(clickEventType, function(){
		var movie = $('iframe', this).clone();
		movie.attr('src', movie.attr('src')+ '&autoplay=1')
		$('#movieModal .modal__wrap').append(movie);
		$('#movieModal').attr('data-active', true);
	});

	$('.modal').on(clickEventType, function(){
		$('.modal').attr('data-active', false);
		$('.modal__wrap').empty();
	});

	$('.modal__wrap').on(clickEventType, function(e){
		e.stopPropagation();
	});

});
