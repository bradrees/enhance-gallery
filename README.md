Enhance Gallery
===============

This is a fork of Ben Watts script of the same name that adds touch support and a smoothing algorithm to the mouse movement.

An example can be seen at [Jenn Louise](http://jennlouise.com.au/ "Designer Handbags Australia") on any product page, such as [this handbag](http://jennlouise.com.au/collections/spencer-rutherford/products/suzanna-handbag-beige-cream "Handbags 2012").

For more information see [this blog post](http://bradleyrees.com/blog/2012/12/enhance-gallery-smoothing-boder-touch/) also.

New Features
------------

###Smoothing
This version implements a smoothing algorithm for the mouse or touch input, which can be configured by setting the mouseDecay and touchDecay parameters
	mouseDecay: 20,
	touchDecay: 2
This is the amount of change per frame, so in the above example the image would follow the current mouse position by moving 1/20th of the difference each frame, while the touch would move 1/2 the difference each frame.

The frame rate can also be adjusted.
	framesPerSecond: 60

###Touch Control
This version supports touch control events raised by iOS and Android devices. Touch devices behave slightly differently so there is an invert function so that the image follows under your finger.
	invertForTouch: true

###Border
If you object almost fill your image then you may want to have a border region that sets the zoom position to be on the edge, preventing the use from having to move their mouse or finger to the very edge pixel to see the edge of the image.
	borderPercent: 20
Note that this is the percent overshoot to add, so 20% would be to make the image region 140% as large, so taking the inverse it would create a border 100 - (100/140) / 2 = 14% or the final image.   