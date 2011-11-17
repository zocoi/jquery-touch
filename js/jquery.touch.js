/*
 * Modifications for AaltoWindow
 * Add vertical scrolling
 * Support Firefox 8 and W3C touch event compatible browsers
 * v0.1 Hung Dao 2011
 *
 * 
 */
(function($) {
	$.fn.touch = function(options) {
		
		// Default thresholds & swipe functions
		var defaults = {
			threshold: {
				x: 60,
				y: 10
			},
			swipeLeft:  function() { alert('swiped left') },
			swipeRight: function() { alert('swiped right') },
      pinch:      function(scale) { alert('pinch') }
		};
		
		var options = $.extend(defaults, options);
		
		if (!this) return false;
		
		return this.each(function() {
			
			var me = $(this)
			
			// Touches
			var originalTouches = []
			var finalTouches = []
      var touchIds = []
      // Distance from the first two touches
			var originalDistance = 0
      
			
			
			// Screen touched, store the original coordinate
			function touchStart(event) {
        var touches = event.targetTouches;
        for (var i=0; i<touches.length; i++) {
          originalTouches[touches[i].identifier] = {x: touches[i].pageX, y: touches[i].pageY};
          touchIds.push(touches[i].identifier);
        }
				_touchStart();
			}
      
      function mozTouchDown(event) {
        originalTouches[event.streamId] = {x: event.clientX, y: event.clientY};
        touchIds.push(event.streamId);
        _touchStart();
      }
      
      function _touchStart() {
        var c1 = Math.abs(originalTouches[touchIds[0]].x-originalTouches[touchIds[1]].x);
				var c2 = Math.abs(originalTouches[touchIds[0]].y-originalTouches[touchIds[1]].y);
				originalDistance = Math.sqrt(c1 * c1 + c2 * c2);
      }
			
			// Store coordinates as finger is swiping
			function touchMove(event) {
        var touches = event.targetTouches;
        for (var i=0; i<touches.length; i++) {
          finalTouches[touches[i].identifier] = {x: touches[i].pageX, y: touches[i].pageY};
        }
        _touchMove(event);
        

        // var touches = event.changedTouches;
      
            
        // for (var i=0; i<touches.length; i++) {
          // var idx = ongoingTouchIndexById(touches[i].identifier);

          // // ctx.fillStyle = color;
          // // ctx.beginPath();
          // // ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
          // // ctx.lineTo(touches[i].pageX, touches[i].pageY);
          // // ctx.closePath();
          // // ctx.stroke();
          // ongoingTouches.splice(idx, 1, touches[i]);  // swap in the new touch record
        // }
			}
      
      function MozTouchMove(event) {
        finalTouches[event.streamId] = {x: event.clientX, y: event.clientY};
        _touchMove(event);
      }
      
      function _touchMove() {
			  event.preventDefault(event);
        
        // Scroll
        var changeY = originalTouches[touchIds[0]].y - finalTouches[touchIds[0]].y;
				window.scrollBy(0,changeY);
        
        // Pinch
        var c1 = Math.abs(finalTouches[touchIds[0]].x - finalTouches[touchIds[1]].x);
				var c2 = Math.abs(finalTouches[touchIds[0]].y - finalTouches[touchIds[1]].y);
				var touchesDist = m.sqrt(c1*c1+c2*c2);
				
				scale = touchesDist / touchesDistStart;
				defaults.pinch(scale);
        
			}
      
      
			// Done Swiping			
			function touchEnd(event) {
				//console.log('Ending swipe gesture...')
        var changeX = originalTouches[touchIds[0]].x - finalTouches[touchIds[0]].x;
				var changeY = originalTouches[touchIds[0]].y - finalTouches[touchIds[0]].y;
        // Calculate if the swipe was left or right
				if(changeY < defaults.threshold.y && changeY > (defaults.threshold.y*-1)) {
					
					if(changeX > defaults.threshold.x) {
						defaults.swipeLeft();
					}
					if(changeX < (defaults.threshold.x*-1)) {
						defaults.swipeRight();
					}
				}
			}
			
			// Swipe was canceled
			function touchCancel(event) { 
				//console.log('Canceling swipe gesture...') 
        event.preventDefault();  
        var touches = evt.changedTouches;  
    
        for (var i=0; i<touches.length; i++) {  
          ongoingTouches.splice(i, 1);  // remove it; we're done  
        }
			}
			
			// Add gestures to all swipable areas
			this.addEventListener("touchstart", touchStart, false);
			this.addEventListener("touchmove", touchMove, false);
			this.addEventListener("touchend", touchEnd, false);
			this.addEventListener("touchcancel", touchCancel, false);
      
      this.addEventListener("MozTouchDown", mozTouchDown, false);
			this.addEventListener("MozTouchMove", mozTouchMove, false);
			this.addEventListener("MozTouchUp", touchEnd, false);
      
				
		});
	};
})(jQuery);