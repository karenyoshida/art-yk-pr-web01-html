$(function(){
	// #で始まるアンカーをクリックした場合に処理
	$('a[href^=#]').click(function() {
		// アンカーの値取得
		var href= $(this).attr("href");
		smoothScroll(href);
		return false;
	});
	function smoothScroll(href){
		// 移動先を取得
		var target = $(href == "#" || href == "" ? 'html' : href);
		// 移動先を数値で取得
		var position = target.offset().top;
		// スムーススクロール
		$('body,html').animate({scrollTop:position}, 600, 'swing');
	};
	
	//addSVG
	$(".loadSVG").each(function(i){
		var $this = $(this);
		$this.after('<span class="addSVG"></span>');
		$this.next(".addSVG").addClass($(this).attr("class")).removeClass("loadSVG");
		$this.next(".addSVG").load($(this).attr("src"),function(){
			$this.remove();
		});
	});
	
	const $window  = $(window);
	const clickEventType=((window.ontouchstart!==null)?'click':'touchend');
	//sp menu
	$('.header__menuButton').on(clickEventType, function() {
		if ($(this).hasClass('-active') ) {
			$(this).removeClass('-active');
			$('#wrapper').removeClass('-fixed');
			$('.header__links').fadeOut();
			$window.off('.noScroll');
		} else {
			$(this).addClass('-active');
			$('#wrapper').addClass('-fixed');
			$('.header__links').fadeIn().css({
				top: $('.header__wrap').height() + 13
			});
			$window.on('touchmove.noScroll', function(e) {
				e.preventDefault();
			});
		}
	});
	
	//resize
	var _ww = 0;
	$window.on('load resize',function() {
		if ( _ww != $window.width() ) {
			if ( !$('.contents').hasClass('home') ) {
				var h = $window.height() - $('.header').outerHeight() - $('.footer').outerHeight();
				if ( $('.contents').height() < h ) {
					$('.contents').css({
						'min-height': h
					});
				}
			}
			_ww = $window.width()
		}
	});
	
	//mainVisual
	var _visual = 0;
	var _visualLen = 0;
	var _visualPager = 0;
	var _visualTimer;
	if ( $('.mainVisual')[0] ) {
		$('.mainVisual__pager').empty();
		$('.mainVisual__item').each(function(i){
			$('.mainVisual__pager').append('<li class="mainVisual__pager__item"></li>');	
		});
		$('.mainVisual__list').prepend($('.mainVisual__item:last-child'));
		_visualLen = $('.mainVisual__item').length - 1;
		changeVisual();
	}
	$('.mainVisual__pager').on(clickEventType, '.mainVisual__pager__item', function(){
		_visualPager = $('.mainVisual__pager__item').index(this) - _visual;
		if ( _visualPager > 0 ) {
			_visualPager--;
			nextVisual();
		} else if ( _visualPager < 0 ) {
			_visualPager++;
			prevVisual();
		} else {
			changeVisual();
		}
	});
	$('.mainVisual__arrow.-next').on(clickEventType, function(){
		nextVisual();
	});
	function nextVisual() {
		_visual++;
		if ( _visual > _visualLen ) {
			_visual = 0;
		}
		TweenMax.to(".mainVisual__list" , 0.4 , {
			x : -$('.mainVisual__inner').width(),
			ease: Power2.easeIn,
			onComplete : function(){
				$('.mainVisual__list').append($('.mainVisual__item:first-child'));
				TweenMax.to(".mainVisual__list" , 0 , {
					x : 0
				});
				if ( _visualPager > 0 ) {
					_visualPager--;
					nextVisual();
				}
				$('.mainVisual__item').removeClass('-active').eq(1).addClass('-active');
			}
		});
		changeVisual();
	};
	$('.mainVisual__arrow.-prev').on(clickEventType, function(){
		prevVisual();
	});
	function prevVisual() {
		_visual--;
		if ( _visual < 0 ) {
			_visual = _visualLen;
		}
		$('.mainVisual__list').prepend($('.mainVisual__item:last-child'));
		TweenMax.to(".mainVisual__list" , 0 , {
			x : -$('.mainVisual__inner').width()
		});
		TweenMax.to(".mainVisual__list" , 0.4 , {
			x : 0,
			ease: Power2.easeIn,
			onComplete : function(){
				if ( _visualPager < 0 ) {
					_visualPager++;
					prevVisual();
				}
				$('.mainVisual__item').removeClass('-active').eq(1).addClass('-active');
			}
		});
		changeVisual();
	};
	function changeVisual() {
		clearTimeout(_visualTimer);
		$('.mainVisual__pager__item').removeClass('-active').eq(_visual).addClass('-active');
		_visualTimer = setTimeout(function(){
			nextVisual();
		},6000);
	};
	
	//news
	var _news = 0;
	$('.home__news__tab').on(clickEventType, function(e){
		if ( !$(this).hasClass('-active') ) {
			//e.preventDefault();
			_news = $('.home__news__tab').index(this);
			//changeTab();
		}
	});
	function changeTab() {
		$('.home__news__tab').removeClass('-active').eq(_news).addClass('-active');
		$('.home__news__body').hide().eq(_news).fadeIn(400);
	};
	//changeTab();
	
	$('.discographyDetail__imageTab__thumb').on(clickEventType, function(e){
		$('.discographyDetail__imageTab__image img').attr('src', $('img', this).attr('src'));
		
		TweenMax.fromTo(".discographyDetail__imageTab__image" , 0.2 , {
			opacity: 0
		}, {
			opacity: 1
		});
	});
	
	//autoKana
	if ( $('.contact__input')[0] ) {
		$.fn.autoKana('.contact__input.-name', '.contact__input.-kana', {
			katakana : true
		});
	}
	
	//scroll
	TweenMax.to('.anim' , 0 , {
		y: 40,
		opacity: 0
	});
	$window.on("load scroll",function(){
		var sT = $window.scrollTop() + $window.height() * 0.9;
		var count = 0;
		$(".anim").each(function(i){
			var $this = $(this);
			if ( sT > $this.offset().top && $window.scrollTop() < $this.offset().top) {
				count++;
				TweenMax.to($this , 0 , {
					y: 0,
					opacity: 1,
					delay: 0.1 * count,
					ease: Power2.easeIn,
					onComplete : function(){
						$this.removeClass('anim');
					}
				});
			}
		});
	});
	
});
