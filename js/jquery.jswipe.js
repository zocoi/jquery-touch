/*

 * Modifications for AaltoWindow
 * Add vertical scrolling
 * Support Firefox 8 and W3C touch event compatible browsers
 * v0.1 Hung Dao, Michael Vu 2011
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
      pinch:      function(scale) {}
		};
		
		var options = $.extend(defaults, options);
		
		if (!this) return false;
		
		return this.each(function() {
			
			var me = $(this)
			
			// Private variables for each element
			var originalCoord = { x: 0, y: 0 }
			var finalCoord = { x: 0, y: 0 }
			var touchesDistStart = 0
			var ongoingTouches = []
			
			// Screen touched, store the original coordinate
			function touchStart(event) {
				//console.log('Starting swipe gesture...')
				originalCoord.x = event.targetTouches[0].pageX
				originalCoord.y = event.targetTouches[0].pageY
        
				var c1 = Math.abs(event.touches[0].pageX-event.touches[1].pageX);
				var c2 = Math.abs(event.touches[0].pageY-event.touches[1].pageY);
				touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);
        
        // var touches = event.changedTouches;
        
        // for (var i=0; i<touches.length; i++) {
          // ongoingTouches.push(touches[i]);
          // //var color = colorForTouch(touches[i]);
          // //ctx.fillStyle = color;
          // //ctx.fillRect(touches[i].pageX-2, touches[i].pageY-2, 4, 4);
        // }
			}
			
			// Store coordinates as finger is swiping
			function touchMove(event) {
			  event.preventDefault();
				finalCoord.x = event.targetTouches[0].pageX // Updated X,Y coordinates
				finalCoord.y = event.targetTouches[0].pageY
        
				var changeY = originalCoord.y - finalCoord.y;
				window.scrollBy(0,changeY);
        
				var c1 = Math.abs(event.touches[0].pageX - event.touches[1].pageX);
				var c2 = Math.abs(event.touches[0].pageY - event.touches[1].pageY);
				var touchesDist = m.sqrt(c1*c1+c2*c2);
				
				scale = touchesDist / touchesDistStart;
				defaults.pinch(scale);
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
			
			// Done Swiping			
			function touchEnd(event) {
				//console.log('Ending swipe gesture...')
        var changeX = originalCoord.x - finalCoord.x
				var changeY = originalCoord.y - finalCoord.y
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
      
      function ongoingTouchIndexById(idToFind) {  
        for (var i=0; i<ongoingTouches.length; i++) {  
          var id = ongoingTouches[i].identifier;  
            
          if (id == idToFind) {  
            return i;  
          }  
        }  
        return -1;    // not found  
      }  
			
			// Add gestures to all swipable areas
			this.addEventListener("touchstart", touchStart, false);
			this.addEventListener("touchmove", touchMove, false);
			this.addEventListener("touchend", touchEnd, false);
			this.addEventListener("touchcancel", touchCancel, false);
      
      //this.addEventListener("MozTouchDown", mozTouchDown, false);
			//this.addEventListener("MozTouchMove", mozTouchMove, false);
			//this.addEventListener("MozTouchUp", touchEnd, false);
			//this.addEventListener("touchcancel", touchCancel, false);
      
				
		});
	};
})(jQuery);