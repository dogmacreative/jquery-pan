(function ($) {
	$.fn.pan = function (options) {
		options = options || {};
		var opts = options.constructor == String || options.constructor == Boolean ? options : $.extend({}, $.fn.pan.defaults, options);
		return this.each(function () {
			var _frame = this;
			var $frame = $(_frame);

			var o = new Object();
			if (opts.constructor == String || opts.constructor == Boolean) {
				switch (opts) {
					case "start", true:
						$frame.data("stop.pan", false);
						break;
					case "stop", false:
						$frame.data("stop.pan", true);
						break;
				}
				o = $frame.data("options.pan");
				o = o === undefined ? $.extend({}, $.fn.pan.defaults, options) : o;
			}
			else {
				o = opts;
				$frame.data("options.pan", o);
				$frame.data("stop.pan", false);
			}

			var _children = $frame.children(o.children);
			_children.each(function () {
				var _pan = this;
				var $pan = $(_pan);
				var co = o;

				var _parallax = new Array();
				$.each(co.parallax, function () {
					_parallax.push({
						element: $(this.selector),
						offset: this.offset
					})
				});

				var _step = null;
				var _delay = null;

				var frame_width = null;
				var frame_left = null;
				var frame_height = null;
				var frame_top = null;

				var pan_width = null;
				var pan_left = null;
				var pan_height = null;
				var pan_top = null;

				var hoz_diff = null;
				var hoz_ratio = null;
				var vert_diff = null;
				var vert_ratio = null;

				// Initialiser
				function init(ignoreEvents) {
					clearTimer();

					$pan.data("timeout.pan", null);
					$pan.data("mousemove.pan", null);
					$pan.data("die.pan", false);

					_step = co.step;
					_delay = co.delay;

					frame_width = Number($frame.width());
					frame_height = Number($frame.height());

					pan_width = Number($pan.width());
					pan_left = Number($pan.position().left);
					pan_height = Number($pan.height());
					pan_top = Number($pan.position().top);

					hoz_diff = pan_width - frame_width;
					hoz_ratio = hoz_diff / frame_width;

					vert_diff = pan_height - frame_height;
					vert_ratio = vert_diff / frame_height;

					if (ignoreEvents === undefined || !ignoreEvents)
						$frame.bind("mousemove.pan", frame_mousemove);
				};

				function dispose(ignoreEvents) {
					if (ignoreEvents === undefined || !ignoreEvents)
						$frame.unbind("mousemove.pan");

					clearTimer();

					$pan.data("die.pan", true);

					_step = null;
					_delay = null;

					frame_width = null;
					frame_height = null;

					pan_width = null;
					pan_left = null;
					pan_height = null;
					pan_top = null;

					hoz_diff = null;
					hoz_ratio = null;

					vert_diff = null;
					vert_ratio = null;
				};

				// Helper Methods
				function getOffset(ratio, value) {
					if (ratio == null)
						init();

					if (!isNaN(ratio))
						return -Math.floor(value * ratio);
					else
						throw "Ratio has not been set.";
				};

				function getLeft(x) {
					return getOffset(hoz_ratio, x - Number($frame.offset().left));
				};

				function getTop(y) {
					return getOffset(vert_ratio, y - Number($frame.offset().top));
				};

				function move() {
					if ($pan.data("die.pan") != true) {
						var panMouse = $pan.data("mousemove.pan");
						if (panMouse != null) {
							pan_left = $pan.position().left;
							pan_top = $pan.position().top;

							var left = getLeft(panMouse.x);
							var hoz_step = Math.abs(pan_left - left);
							hoz_step = hoz_step < _step ? hoz_step : _step;

							var top = getTop(panMouse.y);
							var vert_step = Math.abs(pan_top - top);
							vert_step = vert_step < _step ? vert_step : _step;

							if (hoz_step > 0 && (left <= (pan_left - hoz_step) || left >= (pan_left + hoz_step))) {
								var newLeft = pan_left + (left > pan_left ? hoz_step : -hoz_step);

								if (newLeft <= 0 && newLeft >= -hoz_diff) {
									pan_left = newLeft;
									$pan.css("left", newLeft + "px");

									// Parallax
									var ratio = newLeft / frame_width;
									$.each(_parallax, function () {
										var offset = this.offset * ratio;
										this.element.css("margin-left", offset + "px");
									});
								}
							}

							if (vert_step > 0 && (top <= (pan_top - vert_step) || top >= (pan_top + vert_step))) {
								var newTop = pan_top + (top > pan_top ? vert_step : -vert_step);

								if (newTop <= 0 && newTop >= -vert_diff) {
									pan_top = newTop;
									$pan.css("top", newTop + "px");

									// Parallax
									var ratio = newTop / frame_height;
									$.each(_parallax, function () {
										var offset = this.offset * ratio;
										this.element.css("margin-top", offset + "px");
									});
								}
							}

							setTimer();
						}
					}
				};

				function clearTimer() {
					var panTimeout = $pan.data("timeout.pan");

					if (panTimeout != null)
						clearTimeout(panTimeout);
				};

				function setTimer() {
					clearTimer();
					$pan.data("timeout.pan", setTimeout(move, _delay));
				};

				function setMouse(x, y) {
					$pan.data("mousemove.pan", { x: x, y: y });
				};

				// Events
				function frame_mousemove(evt) {
					if (o.pause && !$(evt.target).is(o.children)) {
						dispose(true);
						return;
					}

					if ($pan.data("die.pan"))
						init(true);

					setMouse(evt.clientX, evt.clientY);

					if ($pan.data("timeout.pan") == null)
						move();
				};

				if ($frame.data("stop.pan") == false)
					init();
				else
					dispose();
			});
		});
	};

	$.fn.pan.defaults = {
		step: 4,
		delay: 5,
		children: ".pan",
		parallax: new Array(),
		pause: true
	};
})(jQuery);