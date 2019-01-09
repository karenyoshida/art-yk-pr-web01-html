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
	$('.mainVisual__pager').on('click', '.mainVisual__pager__item', function(){
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
	$('.mainVisual__arrow.-next').on('click', function(){
		nextVisual();
	});
	function nextVisual() {
		_visual++;
		if ( _visual > _visualLen ) {
			_visual = 0;
		}
		TweenMax.to(".mainVisual__list" , 0.4 , {
			x : -$('.mainVisual__inner').width(),
			onComplete : function(){
				$('.mainVisual__list').append($('.mainVisual__item:first-child'));
				TweenMax.to(".mainVisual__list" , 0 , {
					x : 0
				});
				if ( _visualPager > 0 ) {
					_visualPager--;
					nextVisual();
				}
			}
		});
		changeVisual();
	};
	$('.mainVisual__arrow.-prev').on('click', function(){
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
			onComplete : function(){
				if ( _visualPager < 0 ) {
					_visualPager++;
					prevVisual();
				}
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
	$('.home__news__tab').on('click', function(){
		_news = $('.home__news__tab').index(this);
		changeTab();
	});
	function changeTab() {
		$('.home__news__tab').removeClass('-active').eq(_news).addClass('-active');
		$('.home__news__body').hide().eq(_news).fadeIn(400);
	};
	changeTab();
	
	
	
});
