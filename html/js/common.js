TweenMax.to(".header__wrap" , 0.8 , {
	opacity: 1,
	delay: 0.6
});
	
$(function(){
	// #で始まるアンカーをクリックした場合に処理
	$('a[href^=#]').click(function() {
		// アンカーの値取得
		let href= $(this).attr("href");
		smoothScroll(href);
		return false;
	});
	function smoothScroll(href){
		// 移動先を取得
		let target = $(href == "#" || href == "" ? 'html' : href);
		// 移動先を数値で取得
		let position = target.offset().top;
		// スムーススクロール
		$('body,html').animate({scrollTop:position}, 600, 'swing');
	};
	
	//addSVG
	$(".loadSVG").each(function(i){
		const $this = $(this);
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
	let _ww = 0;
	$window.on('load resize',function() {
		if ( _ww != $window.width() ) {
			if ( !$('.contents').hasClass('home') ) {
				let h = $window.height() - $('.header').outerHeight() - $('.footer').outerHeight();
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
	let _visual = 0;
	let _visualLen = 0;
	let _visualPager = 0;
	let _visualTimer;
	if ( $('.mainVisual')[0] ) {
		$('.mainVisual__pager').empty();
		_visualLen = $('.mainVisual__item').length - 1;
		if ( _visualLen == 1 ) {
			$('.mainVisual__list').prepend($('.mainVisual__item:first-child').clone());
			_visualLen++;
		}
		if ( _visualLen > 0 ) {
			$('.mainVisual__items__wrap').addClass('-acitve');
			$('.mainVisual__arrow').fadeIn();
			$('.mainVisual__item').each(function(i){
				$('.mainVisual__pager').append('<li class="mainVisual__pager__item"></li>');	
			});
			$('.mainVisual__list').prepend($('.mainVisual__item:last-child'));
		}
		//opening
		if ( sessionStorage.getItem('opening') ) {
			$('#wrapper').removeClass('-fixed');
			$('.opening').remove();
			if ( _visualLen > 0 ) {
				changeVisual();
			}
		} else {
			TweenMax.to('.opening__cover' , 0.4 , {
				x: 500,
				delay: 1,
				ease: Power2.easeInOut,
				onComplete: function(){
					TweenMax.fromTo('.opening__cover' , 0.4 , {
						x: -500
					}, {
						x: 0,
						delay: 1,
						ease: Power2.easeInOut
					});
					TweenMax.to('.opening' , 0.4 , {
						x: $window.width(),
						delay: 1.3,
						ease: Power2.easeInOut,
						onComplete: function(){
							$('#wrapper').removeClass('-fixed');
							$('.opening').remove();
							sessionStorage.setItem('opening', 1);
							if ( _visualLen > 0 ) {
								changeVisual();
							}
						}
					});
				}
			});
		}
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
	
	const isTouch = ('ontouchstart' in window);
	let _beforeX = 0;
	let _touched = false;
	let _clicked = true;
	if ( _visualLen > 0 ) {
		$('.mainVisual__items').on({
			'touchstart': function(e) {
				this.touchX = (isTouch ? event.changedTouches[0].pageX : e.pageX);
				this.slideX = _beforeX = $(this).position().left;
				// タッチ処理を開始したフラグをたてる
				_touched = true;
			},
			'touchmove': function(e) {
				if (!_touched) return;
				this.slideX = this.slideX - (this.touchX - (isTouch ? event.changedTouches[0].pageX : e.pageX) );
				$('.mainVisual__items').css({left:this.slideX});
				this.touchX = (isTouch ? event.changedTouches[0].pageX : e.pageX);
				_clicked = false;
			},
			'touchend': function(e) {
				// 過剰動作の防止
				if (!_touched) return;
				_touched = false;
				let _moveX = _beforeX - this.slideX;
				$('.mainVisual__items').animate({'left':0},600);
				if (_moveX > 20) {
					nextVisual();
				} else if (_moveX < -20) {
					prevVisual();
				} else {
					changeVisual();
				}
				setTimeout(function(){
					_clicked = true;
				},20);
			}
		});
	}
	$('.mainVisual__item a').on('click', function(e) {
		e.preventDefault();
		if ( _clicked ) {
			location.href = $(this).attr('href');
		}
	});
	$(document).on('mouseup', function(){
		_touched = false;
	});
		
	//news
	let _news = 0;
	$('.home__news__tab').on(clickEventType, function(e){
		e.preventDefault();
		if ( !$(this).hasClass('-active') ) {
			_news = $('.home__news__tab').index(this);
			changeTab();
		}
	});
	function changeTab() {
		$('.home__news__tab').removeClass('-active').eq(_news).addClass('-active');
		$('.home__news__body').hide().eq(_news).fadeIn(400);
	};
	changeTab();
	
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
		let sT = $window.scrollTop() + $window.height() * 0.9;
		let count = 0;
		$(".anim").each(function(i){
			let $this = $(this);
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
