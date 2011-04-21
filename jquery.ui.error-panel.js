/*
 * jQuery UI Error Panel 1.0
 *
 * Copyright 2011, Branko Vukelic
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */


(function ( $, undefined ) {
	var widgetClasses = 'ui-error-panel ui-widget ui-corner-all ui-helper-reset';
	var listClasses = 'ui-error-panel-list ui-helper-reset';
	var errorClasses = 'ui-widget-content ui-state-error';
	var noticeClasses = 'ui-widget-content ui-state-highlight';
	var itemClasses = {
		ok: 'ui-error-panel-ok ui-helper-clearfix',
		error: 'ui-error-panel-error ui-helper-clearfix',
		info: 'ui-error-panel-info ui-helper-clearfix'
	};
	var iconClasses = {
		ok: 'ui-icon ui-icon-check',
		error: 'ui-icon ui-icon-alert',
		info: 'ui-icon ui-icon-info'
	};

	$.widget('ui.errorPanel', {
		options: {
			type: 'error', // can be 'error' or 'notice'
			defaultText: '',
			defaultIcon: '', // can be 'info', 'error', or 'ok'
			animate: '', // jQuery UI effect class
			hidden: true
		},

		_create: function() {
			var self = this;
			var opts = self.options;

			opts.defaultIcon = opts.defaultIcon in iconClasses ? opts.defaultIcon : 'info';

			self.element.addClass(widgetClasses)
			.attr({role: 'list'});

			if (opts.type === 'notice') {
				self.element.addClass(noticeClasses);
			} else {
				self.element.addClass(errorClasses);
			}

			self.listUl = $('<ul></ul>').addClass(listClasses)
			self.element.append(self.listUl);

			self.errors = {};

			self._refreshList();
		},

		_addItem: function(message, type) {
			type = type in itemClasses ? type : 'error';

			this.errors[message] = type;
		},

		_removeItem: function(message) {
			delete this.errors[message];
		},

		_updateList: function() {
			var errorItem;
			var errorLi;
			var errorIcon;

			this.listUl.empty();

			if (this.errors) {
				for (e in this.errors) {
					errorLi = this._renderLi(itemClasses[this.errors[e]], e);
					this.listUl.append(errorLi);
				}
			} else {
				if (this.options.defaultText) {
					errorLi = this._renderLi(this.options.defaultText, this.options.defaultIcon);
					this.listUl.append(errorLi);
				}
			}
		},

		_refreshList: function() {
			this.hide();
			this._updateList();
			if (this.listUl.html()) {
				this.show();
			} else {
				this.hide();
			}
		},

		_renderIcon: function(type) {
			type = type in itemClasses ? type : 'error';
			return $('<span>').addClass(iconClasses[type]).css({'float': 'left', 'margin-right': '0.3em'});
		},

		_renderLi: function(type, text) {
			var self = this;
			type = type in itemClasses ? type : 'error';
			return $('<li>').addClass(itemClasses[type])
			.css('list-style', 'none').text(text)
			.prepend(self._renderIcon(type));
		},

		_destroy: function() {
			var self = this;
			self.element.removeClass(widgetClasses);
			self.element.removeAttr('role');
			self.listDiv.remove();
		},

		clearErrors: function() {
			this.errors = {};
			this._refreshList();
		},

		addError: function(message, icon) {
			this._addItem(message, icon);
			this._refreshList();
		},

		addErrors: function(messages, icon) {
			var self = this;
			$.each(messages, function(i, e) {
				self._addItem(e, icon);
			});
			self._refreshList();
		},

		removeError: function(message) {
			this._removeItem(message);
			this._refreshList();
		},

		show: function() {
			this.element.show(this.options.animate);
		},

		hide: function() {
			this.element.hide(this.options.animate);
		}

	});

	$.extend( $.ui.errorPanel, {
		version: "1.0"
	});

})(jQuery);
