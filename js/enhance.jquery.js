/**
 * @see https://github.com/bradrees/enhance-gallery/ 
 */
 
(function($) {

  var cache = [];
  var settings = { 
        thumbListId : '#thumbs',
        activeWrapperId : '#active-wrapper',
        activeImageId : '#active-image',
        loadingLabel: 'Loading...',
		mouseDecay: 20,
		touchDecay: 2,
		framesPerSecond: 60,
		invertForTouch: true,
		borderPercent: 20
      };
  var $thumbList, $activeWrapper, $loading;


  $.fn.enhanceGallery = function(options){

    if( options ){
      $.extend(settings, options);
    }

    if( this.length > 0 ){
      $thumbList = $(settings.thumbListId);
      $activeWrapper = $(settings.activeWrapperId, this);
      $loading = $('<div id="active-image-loading">'+settings.loadingLabel+'</div>');

      preloadImage( $thumbList.find('a:first').attr('href'), $thumbList.find('a:first img').attr('alt') ); // preload 1st image

      $thumbList.find('a').click( function(e){
        preloadImage( this.href, this.alt );
        e.preventDefault();
      });
    }

    return this;

  };


  function swap(image){
    var scale = $activeWrapper.width() / image.originalWidth,
        wrapperWidth  = $activeWrapper.width(),
        wrapperHeight = (image.originalWidth < wrapperWidth) ? image.originalHeight : ~~(image.originalHeight * scale);

    hideSpinner();

    // empty container, change container's width, append the <img>
    $activeWrapper.empty().height(wrapperHeight).append(image.tag);

    // enable the zoominess
    if( image.originalWidth > wrapperWidth ){
	  var interval;
	  var $activeImage = $(settings.activeImageId);
      var onHoverStart = function(that, touch){
          // zoom in 
		  var fromLeft = 0, fromTop = 0;
		  var xp = 0, yp = 0;
		  var first = false;
          $(that).addClass('zoomed').width(image.originalWidth).height(image.originalHeight);
		  var offset = $activeWrapper.offset();
          var onMove = function(x, y){
            var localX = ~~((((x - offset.left)/wrapperWidth) * (100 + settings.borderPercent + settings.borderPercent)) - settings.borderPercent);
            var localY = ~~((((y - offset.top)/wrapperHeight) * (100 + settings.borderPercent + settings.borderPercent)) - settings.borderPercent);
			localX = localX > 100 ? 100 : localX < 0 ? 0 : localX; 
			localY = localY > 100 ? 100 : localY < 0 ? 0 : localY;
			if (touch && settings.invertForTouch)
			{
				localX = 100 - localX;
				localY = 100 - localY;
			} 
            fromLeft = (image.originalWidth - wrapperWidth) * localX/100;
            fromTop  = (image.originalHeight - wrapperHeight) * localY/100;
            //console.log( fromLeft,' :: ', fromTop);
			if (!first)
			{
            	$activeImage.css({ left: -fromLeft, top: -fromTop});
				xp = fromLeft;
				yp = fromTop;
				first = true;
			}
		  };

		  if (!touch)
		  { 
		  	$activeWrapper.mousemove(function(e){
				onMove(e.pageX, e.pageY);
			  });
		  }
		  else
		  {
		  	  var width = $(that).width();
			  var height = $(that).height()
			  $activeWrapper.bind('touchmove',function(e){
			      e.preventDefault();
			      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			      var x = touch.pageX - offset.left;
			      var y = touch.pageY - offset.top;
			      if(x < width && x > 0){
				      if(y < height && y > 0){
			             onMove(touch.pageX, touch.pageY);
				      }
			      }
			  });
		  }
		  
		  var smoothingFactor = touch ? settings.touchDecay : settings.mouseDecay;
		  interval = setInterval(function(){
			xp += (fromLeft - xp) / smoothingFactor;
			yp += (fromTop - yp) / smoothingFactor;
			xp = Math.round(xp * 2) / 2;
			yp = Math.round(yp * 2) / 2;
			$activeImage.css({ left: -xp, top: -yp});
		  }, 1000 / settings.framesPerSecond);
        };

      var onHoverEnd = function(that){
         // zoom out
	  	clearInterval(interval);
        $(that).removeClass('zoomed').width(wrapperWidth).height(wrapperHeight);
        $activeImage.unbind('mousemove');
	  	$activeImage.unbind('touchmove');
      };
      $activeImage.width(wrapperWidth).height(wrapperHeight);
      $activeImage.mouseenter(function(e) { onHoverStart(this); }).mouseleave(function(e) { onHoverEnd(this); });
	  $activeImage.bind('touchstart', function(e) { e.preventDefault(); onHoverStart(this, true); }).bind('touchend', function(e) { e.preventDefault(); onHoverEnd(this);});
    }
  }


  function preloadImage(url, alt){
    var alt = alt || "";
    var image = getCachedImage(url);
    if( image === false ){
      var cacheImage = document.createElement('img');
      cacheImage.id = 'active-image';
      cacheImage.onload = function(){
        imageLoaded(cacheImage, url);
      };
      cacheImage.src = url;
      cacheImage.alt = alt;
      showSpinner();
    } else {
      swap(image);
    }
  }


  function imageLoaded(img, url){
    var image = { 
      tag: img, 
      url: url, 
      originalWidth: img.width, 
      originalHeight: img.height 
    };
    cache.push(image);
    swap(image);
  }


  function showSpinner(){
    $activeWrapper.append($loading);
    var fromLeft = $activeWrapper.width()/2 - $loading.width()/2;
    var fromTop = $activeWrapper.height()/2 - $loading.height()/2;
    $loading.css('top', fromTop+'px').css('left', fromLeft +'px');
  }

  function hideSpinner(){
    $loading.remove();
  }


  function getCachedImage(url){
    for(var i=0; i < cache.length; i++ ){
      if( cache[i].url === url ){
        console.log('FOUND THE CACHED IMAGE')
        return cache[i];
      }
    }
    return false;
  }


})(jQuery);