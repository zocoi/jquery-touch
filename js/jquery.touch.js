/*
 * Modifications for AaltoWindow
 * Add vertical scrolling
 * Support Firefox 8 and W3C touch event compatible browsers
 * v0.1 Hung Dao 2011
 *
 * 
 */
(function ($) {
  $.fn.touch = function (options) {

    // Default thresholds & swipe functions
    var defaults = {
      threshold: {
        x: 60,
        y: 10
      },
      swipeLeft: function () {
        console.log('swiped left');
      },
      swipeRight: function () {
        console.log('swiped right');
      },
      pinch: function (scale) {
        console.log('pinch');
      }
    };

    var options = $.extend(defaults, options);

    if (!this) return false;

    return this.each(function () {

      var me = $(this);

      // Touches
      var originalTouches = {};
      var finalTouches = {};
      var touchIds = [];
      // Distance from the first two touches
      var originalDistance = 0;
      var finalDistance = 0;



      // Screen touched, store the original coordinate
      function touchStart(event) {
        var touches = event.targetTouches;
        for (var i = 0; i < touches.length; i++) {
          originalTouches[touches[i].identifier] = {
            x: touches[i].pageX,
            y: touches[i].pageY
          };
          touchIds.push(touches[i].identifier);
        }
        
        //_touchStart();
      }

      function mozTouchDown(event) {
        event.preventDefault();
        event.stopPropagation();
        originalTouches[event.streamId] = {
          x: event.pageX,
          y: event.pageY
        };
        finalTouches[event.streamId] = originalTouches[event.streamId];
        touchIds.push(event.streamId);
        console.log(event.pageX);
        _touchStart();
      }

      function _touchStart() {
        if (touchIds.length > 1) {
          var c1 = Math.abs(originalTouches[touchIds[0]].x - originalTouches[touchIds[1]].x);
          var c2 = Math.abs(originalTouches[touchIds[0]].y - originalTouches[touchIds[1]].y);
          originalDistance = Math.sqrt(c1 * c1 + c2 * c2);
        }
        console.log('touchStart');
        //console.log('touchIds: ');
        //console.log(touchIds);
        //console.log('originalTouches: ');
        //console.log(originalTouches);
      }

      // Store coordinates as finger is moving

      function touchMove(event) {
        var touches = event.targetTouches;
        for (var i = 0; i < touches.length; i++) {
          finalTouches[touches[i].identifier] = {
            x: touches[i].pageX,
            y: touches[i].pageY
          };
        }
        _touchMove(event);
      }

      function mozTouchMove(event) {
        event.preventDefault();
        event.stopPropagation();
        finalTouches[event.streamId] = {
          x: event.pageX,
          y: event.pageY
        };
        _touchMove(event);
      }

      function _touchMove(event) {
        //console.log('touchMove...');

        if (touchIds.length == 1) {
          // Scroll
          var changeY = originalTouches[touchIds[0]].y - finalTouches[touchIds[0]].y;
          window.scrollBy(0, changeY);

        } else if (touchIds.length == 2) {
          // Pinch
          //console.log('Pinch...');
          //console.log('touchIds: ');
          //console.log(touchIds);
          //console.log('originalTouches: ');
          //console.log(originalTouches);
          //console.log('finalTouches: ');
          //console.log(finalTouches);
          var c1 = Math.abs(finalTouches[touchIds[0]].x - finalTouches[touchIds[1]].x);
          var c2 = Math.abs(finalTouches[touchIds[0]].y - finalTouches[touchIds[1]].y);
          finalDistance = Math.sqrt(c1 * c1 + c2 * c2);

          var scale = Math.round(100 * finalDistance / originalDistance) / 100;
          //console.log('originalDistance: ' + originalDistance);
          //console.log('finalDistance: ' + finalDistance);
          //console.log('scale: ' + scale);
          //console.log(scale);
          defaults.pinch(scale);
          } else {}

      }


      // Done Swiping			

      function mozTouchUp(event) {
        event.preventDefault();
        event.stopPropagation();
        if (touchIds.length == 1) {
          //console.log('Ending swipe gesture...')
          var changeX = originalTouches[touchIds[0]].x - finalTouches[touchIds[0]].x;
          console.log(changeX);
          var changeY = originalTouches[touchIds[0]].y - finalTouches[touchIds[0]].y;
          console.log(changeY);
          // Calculate if the swipe was left or right
          if (changeY < defaults.threshold.y && changeY > (defaults.threshold.y * -1)) {

            if (changeX > defaults.threshold.x) {
              defaults.swipeLeft();
            }
            if (changeX < (defaults.threshold.x * -1)) {
              defaults.swipeRight();
            }
          }
        }
        
        // console.log('touchIds: ');
        // console.log(touchIds);
        // console.log('originalTouches: ');
        // console.log(originalTouches);
        // console.log('finalTouches: ');
        // console.log(finalTouches);
        
        finalDistance = originalDistance = 0;


        delete originalTouches[event.streamId];
        delete finalTouches[event.streamId];
        var index = touchIds.indexOf(event.streamId);
        touchIds.splice(index, 1);
        // console.log("touchEnd");
        // console.log('touchIds: ');
        // console.log(touchIds);
        // console.log('originalTouches: ');
        // console.log(originalTouches);
        // console.log('finalTouches: ');
        // console.log(finalTouches);
        // console.log("touchEndStop");
        
      }

      // Add gestures to all swipable areas
      //this.addEventListener("touchstart", touchStart, false);
      //this.addEventListener("touchmove", touchMove, false);
      //this.addEventListener("touchend", touchEnd, false);
      //this.addEventListener("touchcancel", touchCancel, false);
      this.addEventListener("MozTouchDown", mozTouchDown, false);
      this.addEventListener("MozTouchMove", mozTouchMove, false);
      this.addEventListener("MozTouchUp", mozTouchUp, false);
      
      this.onselectstart = function() { return false; };
      this.style.MozUserSelect = "none";
      this.style.KhtmlUserSelect = "none";
      this.unselectable = "on";


    });
  };
})(jQuery);
