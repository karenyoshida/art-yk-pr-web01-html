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
	};

	var _scrollFlg = false;
	var _scrollTimer;

	$window.on('load scroll touchmove', function(e){
		_scrollFlg = true;
		scrollAnim();
		_scrollTimer = setTimeout( function () {
			_scrollFlg = false;
		}, 500 ) ;
	});

	//bg
	var _animTimer1;
	var _animTimer2;
	var _animState = 0;
	var _animNum = 36 + 3;
	var _scrollT = 0;

	$window.on('load', function(e){
		for(var i = 0; i <= 36; i++) {
			$('.bg__inner').append('<div class="bg__inner__item"><!--/.bg__inner__item--></div>');
			$('.bg__inner__item').eq(i).css({
				'background-image': 'url(./img/bg_anime' + ( i + 1 ) + '.gif)'
			});
		}
		$('.bg__inner__item').attr('data-active', false).eq(0).attr('data-active', true);
	});

	function bgAnim() {
		_animTimer1 = setInterval(function(){
			if ( _scrollT != $window.scrollTop() ) {
				clearInterval(_animTimer1);
				clearInterval(_animTimer2);
				_scrollT = $window.scrollTop();
				var _contentsH = $('#wrapper').height() - $window.height();
				var _animNextState = Math.floor(_scrollT / _contentsH * _animNum);
				_animTimer2 = setInterval(function(){
						if ( _animState < _animNextState ) {
							_animState++;
						} else if ( _animState > _animNextState ) {
							_animState--;
						} else {
							clearInterval(_animTimer2);
							bgAnim();
						}
						if ( _animState > 36 ) {
							_animState = 36;
							_animNextState = 36;
						}
						$('.bg__inner__item').attr('data-active', false).eq(_animState).attr('data-active', true);
				}, 30);
			}
		}, 20);

		var _footer = Math.floor($('.footer').offset().top - $window.height());
		if ( $('.header').outerHeight() > $window.scrollTop() ) {
			TweenMax.to('.bg' , 0.1 , {
				y: $('.header').outerHeight() - $window.scrollTop()
			});
		} else if ( $window.scrollTop() > _footer ) {
			TweenMax.to('.bg' , 0.1 , {
				y: _footer - $window.scrollTop()
			});
		} else {
			TweenMax.to('.bg' , 0.1 , {
				y: 0
			});
		}
	}
	bgAnim();

	//nav
	$('#floatNav').append($('#nav a').clone());

	//modal
	$('.openGoodsModal').on(clickEventType, function(){
		if ( !_scrollFlg ) {
			$('#goodsModal .modal__wrap').append($(this).clone());
			$('#goodsModal').attr('data-active', true);
		}
	});

	$('.openMovieModal').on(clickEventType, function(){
		if ( !_scrollFlg ) {
			var movie = $('iframe', this).clone();
			movie.attr('src', movie.attr('src')+ '&autoplay=1')
			$('#movieModal .modal__wrap').append(movie);
			$('#movieModal').attr('data-active', true);
		}
	});

	$('.modal').on(clickEventType, function(){
		$('.modal').attr('data-active', false);
		$('.modal__wrap').empty();
	});

	$('.modal__wrap').on(clickEventType, function(e){
		e.stopPropagation();
	});

});
