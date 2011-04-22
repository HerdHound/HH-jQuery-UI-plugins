/*
 * jQuery UI Content Panel 1.0
 *
 * Copyright 2011, Branko Vukelic
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.error-panel.js
 */


(function( $, undefined ) {
	var contentPanelClasses = 'ui-content-panel ui-widget';
	var contentPanelDivClasses = 'ui-content-panel-container ui-helper-reset ui-widget';
	var contentPanelTitleClasses = 'ui-content-panel-title';
	var contentPanelContentClasses = 'ui-content-panel-content';

	function supplant(s, o) {
		// Variable interpolation by Douglas Crockford
		// Modified to be used as a standalone function
		return s.replace(/{([^{}]*)}/g, function (a, b) {
			var r = o[b];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		});
	}

	$.widget('ui.contentPanel', {
		options: {
			title: '',
			template: '',
			content: {},
			errors: false,
			errorsType: 'error',
			defaultErrorText: '',
			defaulterrorIcon: '',
			errorShow: ''
		},

		_create: function() {
			var self = this;
			var opts = self.options;
			
			self.elementTitle = self.element.attr('title');
			if (typeof elementTitle !== 'string') {
				self.elementTitle = '';
			}
			self.options.title = self.options.title || self.elementTitle;

			self.element.addClass(contentPanelClasses)
			.attr({
				role: 'content-panel'
			});

			self.contentDiv = $('<div>').addClass(contentPanelDivClasses);
			self.element.append(self.contentDiv);

			self.titleHeader = '';
			if (self.options.title) {
				// FIXME: At some time make the header level customizable, for now h2 will do
				self.title = self.options.title;
				self.titleHeader = self._makeTitle().text(self.options.title);
				self.contentDiv.append(self.titleHeader);
			}

			self.errorPanel = '';
			if (self.options.errors) {
				self.errorPanel = $('<div>').errorPanel({
					type: self.options.errorsType,
					defaultErrorText: self.options.defaultErrorText,
					defaulterrorIcon: self.options.defaulterrorIcon,
					show: self.options.errorShow
				});
				self.errorPanel.css({
					'margin-bottom': '1em'
				});
				self.contentDiv.append(self.errorPanel);
			}

			self.panelContent = $('<div>').addClass(contentPanelContentClasses);
			self.panelContent.html(self.options.template);
			self.replaceContent(self.options.content);
			self.contentDiv.append(self.panelContent);
		},

		_destroy: function() {
			self.errorPanel.errorPanel('hide');
			self.errorPanel.errorPanel('destroy');
			self.contentDiv.remove();
		},

		_makeTitle: function() {
			return $('<h2>').addClass(contentPanelTitleClasses);
		},

		_setOption: function(key, val) {
			if (key === 'title') {
				this.titleHeader.remove();
				this.titleHeader = this._makeTitle().text(val);
				this.contentDiv.prepend(this.titleHeader);
			} else if (key == 'template') {
				this.template = val;
				this.replaceContent(this.options.content);
			}
		},

		replaceContent: function(o) {
			var self = this;
			var len, i;
			self.panelContent.empty();
			if ($.isArray(o)) {
				len = o.length;
				for (i = 0; i < len; i++) {
					self.panelContent.append(supplant(self.options.template, o[i]));
				}
			} else if ($.isPlainObject(o)) {
				self.panelContent.append(supplant(self.options.template, o));
			} else if (typeof o === 'string') {
				self.panelContent.html(o);
			} else {
				self.panelContent.html(self.options.template);
			}
			return self.panelContent;
		},

		addError: function(message, icon) {
			if (this.options.errors) {
				this.errorPanel.errorPanel('addError', message, icon);
			}
		},

		addErrors: function(messages, icon) {
			if (this.options.errors) {
				this.errorPanel.errorPanel('addErrors', messages, icon);
			}
		},

		removeError: function(message) {
			if (this.options.errors) {
				this.errorPanel.errorPanel('removeError', message);
			}
		},

		clearErrors: function() {
			if (this.options.errors) {
				this.errorPanel.errorPanel('clearErrors');
			}
		},

		titleElement: function () {
			return this.titleHeader;
		},

		contentElement: function () {
			return this.panelContent;
		},

		errorElement: function() {
			return this.errorPanel;
		}

	});

	$.extend( $.ui.contentPanel, {
		version: 1.0
	});
})(jQuery);
