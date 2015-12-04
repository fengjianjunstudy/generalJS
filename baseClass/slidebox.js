define(function(require, exports, module) {
    var $ = require('JQ'),
		Widget = require('./widget'),

		ROLE_PREV = 'prev',
		ROLE_NEXT = 'next',
		ROLE_SLIDER = 'slider',

		HORIZONTAL = 'horizontal',
		VERTICAL = 'vertical',
		DIRECTION_PREV = 'prev',
		DIRECTION_NEXT = 'next',
		BUTTON_AVALIABLED = 'avaliabled';

    /**
     * 左右滚动产品.
     *
     * @extends Widget
     * @param {object} config 配置.
     * @param {jquery object} config.element 滑动区域的 jQuery 对象.
     * @param {number} config.unlimited 无限量的.
     * @param {number} config.mode 展示模式.
     * @param {number} config.minSpace 每个区块的最小空间.
     * @param {number} config.steps 每批滑动个数.
     * @param {number} config.autoplay 是否自动滚动.
     * @param {number} config.interval 自动滚动时间间隔.
     */
    var Slidebox = Widget.extend({
        attrs: {

			// 无限量的
			unlimited: false,

			// 展示模式
			mode: {
				value: HORIZONTAL,

				getter: function(val) {
					if(val !== VERTICAL) {
						val = HORIZONTAL;
					}
					return val;
				}
			},

			// 每个区块的最小空间
			minSpace: {
				value: 170,

				getter: function(val) {
					if(val <= 0) {
						val = 170;
					}
					return val;
				}
			},

			// 每批滑动个数
			steps: 0,

			// 是否自动滚动
			autoplay: false,

			// 自动滚动时间间隔
			interval: 3000
		},

		events: {
			'click [data-role=prev]': 'prev',
			'click [data-role=next]': 'next'
		},

		/**
		 * 私有成员
		 */
		pos: 0, // 第一个区块位置
		slideLock: false, // 滚动锁
		sliderMargin: NaN, // 初始化时滚动区块的外边距
		prevButton: null, // 前一页按钮
		nextButton: null, // 后一页按钮
		slider: null, // 滚动区域
		autoThread: null, // 自动滚动的线程
		disabledClass: '', // 禁用的 className

        /**
         * setup 方法
         */
        setup: function() {
			var _self = this;

			// 定义按钮, 滑动区域和禁用按钮的 className
			this.prevButton = this.element.find('[data-role=' + ROLE_PREV + ']');
			if(this.prevButton.length <= 0) {
				this.prevButton = $('<div>');
			}
			this.nextButton = this.element.find('[data-role=' + ROLE_NEXT + ']');
			if(this.nextButton.length <= 0) {
				this.nextButton = $('<div>');
			}
			this.slider = this.element.find('[data-role=' + ROLE_SLIDER + ']');
			this.disabledClass = this.prevButton.attr('class');

			// 重设位置
			this.resize();
			$(window).resize(function() {
				_self.resize();
			});

			// 无尽模式初始化
			if(this.get('unlimited')) {
				this._enableButton(this.prevButton);
				this._enableButton(this.nextButton);
				this._replenish();
			}

			// 自动滚动
			if(this.get('autoplay')) {
				this._bindAutoSlide();
			}
		},

		/**
		 * 上一页
		 */
		prev: function() {
			if(this._lock()) {
				return;
			}

			var increment = this._getStepCount();
			var newPos = this.pos - increment;

			// 如果要滑动到的节点不存在, 则不要处理
			if(this.slider.find('li').eq(newPos).length > 0) {
				this.pos = newPos;
			} else {
				return;
			}

			// 保证位置不为负数
			if(this.pos < 0) {
				this.pos = 0;
			}

			if(!this.get('unlimited')) {
				// 如果当前位置在起始位置, 不做任何处理
				if(!this.prevButton.data(BUTTON_AVALIABLED)) {
					return;
				}

				this._resetButtons(increment);
			}

			// 滑动
			this._slide();
		},

		/**
		 * 下一页
		 */
		next: function() {
			if(this._lock()) {
				return;
			}

			var increment = this._getStepCount();
			var newPos = this.pos + increment;

			// 如果要滑动到的节点不存在, 则不要处理
			if(this.slider.find('li').eq(newPos).length > 0) {
				this.pos = newPos;
			} else {
				return;
			}

			if(!this.get('unlimited')) {
				// 如果当前位置在总数目位置, 不做任何处理
				if(!this.nextButton.data(BUTTON_AVALIABLED)) {
					return;
				}

				this._resetButtons(increment);
			}

			// 滑动
			this._slide();
		},

		/**
		 * 重置 slider 尺寸
		 */
		resize: function() {
			var items = this.slider.find('> ul > li');
			var size = this._getPageSize();

			// 获取本来为了遮挡用的外边距
			if(isNaN(this.sliderMargin)) {
				if(this.get('mode') === VERTICAL) {
					this.sliderMargin = parseInt(this.slider.css('marginTop'), 10);
				} else {
					this.sliderMargin = parseInt(this.slider.css('marginLeft'), 10);
				}
			}

			// 初始化按钮状态
			if(this.pos <= 0) {
				this._disableButton(this.prevButton);
			} else {
				this._enableButton(this.prevButton);
			}
			if(this.pos + this._getStepCount() >= this._getTotal()) {
				this._disableButton(this.nextButton);
			} else {
				this._enableButton(this.nextButton);
			}

			// 初始化每个区块占用的空间
			if(this.get('mode') === VERTICAL) {
				var height = this.slider.parent().height();
				this.slider.css({
					'marginTop': Math.round(this.slider.find('li').eq(this.pos).position().top * (-1) + this.sliderMargin) + 'px'
				});

				// 节点高度, 如果是 IE6/7/8, 则对小数位四舍五入
				var itemHeight = height / size;
				if(!$.support.leadingWhitespace) {
					itemHeight = Math.round(itemHeight);
				}

				items.each(function() {
					var originalHeight = $(this).height();
					var padding = Math.round((itemHeight - originalHeight) / 2);
					$(this).css({
						'padding': padding + 'px 0',
						'visibility': 'visible'
					});
				});

			} else {
				var width = this.slider.parent().width();
				this.slider.css({
					'marginLeft': Math.round(this.slider.find('li').eq(this.pos).position().left * (-1) + this.sliderMargin) + 'px'
				});

				// 节点宽度, 如果是 IE6/7/8, 则对小数位四舍五入
				var itemWidth = width / size;
				if(!$.support.leadingWhitespace) {
					itemWidth = Math.round(itemWidth);
				}

				items.css({
					'width': itemWidth + 'px',
					'visibility': 'visible'
				});
			}
		},

		/**
		 * 更新按钮状态
		 */
		_resetButtons: function(increment) {
			if(this.pos <= 0) {
				this._disableButton(this.prevButton);
			} else {
				this._enableButton(this.prevButton);
			} 

			// 当前位置加上每页显示数量超或等于总数量时, 下一页按钮不可用
			if(this.pos + this._getPageSize() >= this._getTotal()) {
				this._disableButton(this.nextButton);
			} else {
				this._enableButton(this.nextButton);
			}
		},

		/**
		 * 动画锁, 并返回当前状态
		 */
		_lock: function() {
			var currentLock = true;
			if(!this.slider.is(':animated') || !this.slideLock) {
				currentLock = false;
			}

			this.slideLock = true;

			return currentLock;
		},

		/**
		 * 补充区块完整
		 */
		_replenish: function() {
			var list = this.slider.find('ul:eq(0)');

			var listSize = list.find('> li').length;
			var pageSize = this._getPageSize();

			// 添加向下一页的内容
			var nextWant = parseInt((pageSize * 2) / listSize, 10) + 1;
			for(var i=0; i<nextWant; i++) {
				this.slider.append(list.clone());
			}

			// 添加向上一页的内容
			var prevWant = parseInt(pageSize / listSize, 10) + 1;
			for(var i=0; i<prevWant; i++) {
				this.slider.prepend(list.clone());
			}

			// 重定位
			this.pos = listSize * prevWant;
			if(this.get('mode') === VERTICAL) {
				this.slider.css({
					'marginTop': Math.round(this.slider.find('ul').eq(prevWant).position().top * (-1) + this.sliderMargin) + 'px'
				});
			} else {
				this.slider.css({
					'marginLeft': Math.round(this.slider.find('ul').eq(prevWant).position().left * (-1) + this.sliderMargin) + 'px'
				});
			}
		},

		/**
		 * 调整区块
		 */
		_adjust: function() {
			var lists = this.slider.find('ul');
			var listSize = lists.first().find('> li').length;
			var pageSize = this._getPageSize();
			var total = this._getTotal();

			if(this.pos < pageSize) {
				var firstList = lists.first();
				var lastList = lists.last();

				while(this.pos < pageSize) {
					this.pos += listSize;
					if(this.get('mode') === VERTICAL) {
						this.slider.css({
							'marginTop': Math.round(parseInt(this.slider.css('marginTop'), 10) - firstList.outerHeight() + this.sliderMargin) + 'px'
						});
					} else {
						this.slider.css({
							'marginLeft': Math.round(parseInt(this.slider.css('marginLeft'), 10) - firstList.outerWidth() + this.sliderMargin) + 'px'
						});
					}
					firstList.before(lastList);
				}

			} else if(total - this.pos < pageSize * 2) {
				var firstList = lists.first();
				var lastList = lists.last();

				while(total - this.pos < pageSize * 2) {
					this.pos -= listSize;
					if(this.get('mode') === VERTICAL) {
						this.slider.css({
							'marginTop': parseInt(this.slider.css('marginTop'), 10) + firstList.outerHeight() + 1 + 'px'
						});
					} else {
						this.slider.css({
							'marginLeft': Math.round(parseInt(this.slider.css('marginLeft'), 10) + firstList.outerWidth() + this.sliderMargin) + 'px'
						});
					}
					lastList.before(firstList);
				}
			}
		},

		/**
		 * 滑动至第 N 个区块
		 */
		_slide: function() {
			if(this.get('unlimited')) {
				this._adjust();
			}

			var position = this.slider.find('li').eq(this.pos).position();

			if(this.get('mode') === VERTICAL) {
				this.slider.animate({
					'marginTop': Math.round(position.top * (-1) + this.sliderMargin) + 'px'
				});
			} else {
				this.slider.animate({
					'marginLeft': Math.round(position.left * (-1) + this.sliderMargin) + 'px'
				});
			}
		},

		/**
		 * 绑定控制自动滚动的事件
		 */
		_bindAutoSlide: function() {
			var _self = this;
			var direction = DIRECTION_NEXT;

			// 如果前后都不能滚动, 则不处理
			var isPrevAvaliabled = this.prevButton.data(BUTTON_AVALIABLED);
			var isNextAvaliabled = this.nextButton.data(BUTTON_AVALIABLED);
			if(!isPrevAvaliabled && !isNextAvaliabled) {
				return;
			}

			// 初始化自动滚动
			this.autoThread = setInterval(function() {
				isPrevAvaliabled = _self.prevButton.data(BUTTON_AVALIABLED);
				isNextAvaliabled = _self.nextButton.data(BUTTON_AVALIABLED);

				// 如果不是无限模式, 左右滚动
				if(!_self.get('unlimited')) {
					if(direction === DIRECTION_NEXT && !isNextAvaliabled) {
						direction = DIRECTION_PREV;
					} else if(direction === DIRECTION_PREV && !isPrevAvaliabled) {
						direction = DIRECTION_NEXT;
					}
				}

				// 根据方向来操作滚动
				if(direction === DIRECTION_NEXT) {
					_self.next();
				} else {
					_self.prev();
				}
			}, parseInt(_self.get('interval'), 10));

			// 鼠标移进移出滚动区域的动作
			this.element.hover(function(){
				clearInterval(_self.autoThread);
			}, function(){
				isPrevAvaliabled = _self.prevButton.data(BUTTON_AVALIABLED);
				isNextAvaliabled = _self.nextButton.data(BUTTON_AVALIABLED);

				_self.autoThread = setInterval(function() {
					if(!_self.get('unlimited')) {
						if(direction === DIRECTION_NEXT && !isNextAvaliabled) {
							direction = DIRECTION_PREV;
						} else if(direction === DIRECTION_PREV && !isPrevAvaliabled) {
							direction = DIRECTION_NEXT;
						}
					}
					if(direction === DIRECTION_NEXT) {
						_self.next();
					} else {
						_self.prev();
					}
				}, parseInt(_self.get('interval'), 10));
			});
		},

		/**
		 * 获得滚动个数
		 */
		_getStepCount: function() {
			var steps = parseInt(this.get('steps'), 10);
			if(steps > 0) {
				return steps;
			}

			return this._getPageSize();
		},

		/**
		 * 获得每页个数
		 */
		_getPageSize: function() {
			var space = 0;
			if(this.get('mode') === VERTICAL) {
				space = this.slider.parent().height();
			} else {
				space = this.slider.parent().width();
			}

			return parseInt(space / this.get('minSpace'), 10);
		},

		/**
		 * 获得总区块数量
		 */
		_getTotal: function() {
			return this.slider.find('li').size();
		},

		/**
		 * 激活按钮
		 */
		_enableButton: function(element) {
			element.data(BUTTON_AVALIABLED, true);
			element.removeClass(this.disabledClass);
		},

		/**
		 * 禁用按钮
		 */
		_disableButton: function(element) {
			element.data(BUTTON_AVALIABLED, false);
			element.addClass(this.disabledClass);
		}
	});

    module.exports = Slidebox;

});
