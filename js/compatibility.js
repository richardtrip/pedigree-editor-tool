(function () {
	function a(b) {
		if (typeof console != "undefined" && typeof console.warn == "function") {
			console.warn(b)
		}
	}

	if (typeof XWiki.widgets == "object" && typeof XWiki.widgets.FullScreen == "function") {
		XWiki.editors = XWiki.editors || {};
		XWiki.editors.FullScreenEditing = Class.create(XWiki.widgets.FullScreen, {initialize: function ($super) {
			a("XWiki.editors.FullScreenEditing is deprecated since XWiki 2.6RC2. Use XWiki.widgets.FullScreen instead.");
			$super()
		}})
	}
	if (window.useXWKns) {
		a("_xwk namespace is deprecated since XWiki 2.6RC1. Use the XWiki namespace instead.");
		if (typeof _xwk == "undefined") {
			_xwk = new Object()
		}
	} else {
		_xwk = window
	}
	_xwk.ajaxSuggest = Class.create(XWiki.widgets.Suggest, {initialize: function ($super) {
		a("ajaxSuggest is deprecated since XWiki 2.6RC1. Use XWiki.widgets.Suggest instead.");
		var b = $A(arguments);
		b.shift();
		$super.apply(_xwk, b)
	}});
	window.displayDocExtra = XWiki.displayDocExtra.wrap(function () {
		a("window.displayDocExtra is deprecated since XWiki 1.9M2. Use XWiki.displayDocExtra instead.");
		var b = $A(arguments), c = b.shift();
		return c.apply(window, b)
	});
	if (typeof XWiki.widgets == "object" && typeof XWiki.widgets.LiveTable == "function") {
		window.ASSTable = Class.create(XWiki.widgets.LiveTable, {initialize: function ($super, b, f, e, c, g, h, i, d) {
			a("window.ASSTable is deprecated since XWiki 1.9M2. Use XWiki.widgets.LiveTable instead.");
			if ($("showLimits")) {
				if ($("showLimits").up("tr")) {
					$("showLimits").up("tr").insert({after: new Element("tr").update(new Element("td").update(new Element("div", {id: e + "-pagination", "class": "xwiki-grid-pagination-content"})))})
				}
				$("showLimits").id = e + "-limits"
			}
			if ($("scrollbar1") && $("scrollbar1").up("td")) {
				if ($("scrollbar1").up("td").next()) {
					$("scrollbar1").up("td").next().remove()
				}
				$("scrollbar1").up("td").remove()
			}
			if ($("table-filters")) {
				$("table-filters").id = e + "-filters"
			}
			$super(b, e, h, {action: d})
		}})
	}
	window.hideForm = function (b) {
		a("window.hideForm is deprecated since XWiki 2.6RC1. Use a CSS selector + Element#toggleClassName instead.");
		b.getElementsByTagName("fieldset").item(0).className = "collapsed"
	};
	window.toggleForm = function (c) {
		a("window.toggleForm is deprecated since XWiki 2.6RC1. Use a CSS selector + Element#toggleClassName instead.");
		var b = c.getElementsByTagName("fieldset").item(0);
		if (b.className == "collapsed") {
			b.className = "expanded"
		} else {
			b.className = "collapsed"
		}
	};
	window.createCookie = XWiki.cookies.create.wrap(function () {
		a("window.createCookie is deprecated since XWiki 2.6RC1. Use XWiki.cookies.create instead.");
		var b = $A(arguments), c = b.shift();
		return c.apply(window, b)
	});
	window.readCookie = XWiki.cookies.read.wrap(function () {
		a("window.readCookie is deprecated since XWiki 2.6RC1. Use XWiki.cookies.read instead.");
		var b = $A(arguments), c = b.shift();
		return c.apply(window, b)
	});
	window.eraseCookie = XWiki.cookies.erase.wrap(function () {
		a("window.eraseCookie is deprecated since XWiki 2.6RC1. Use XWiki.cookies.erase instead.");
		var b = $A(arguments), c = b.shift();
		return c.apply(window, b)
	});
	window.togglePanelVisibility = XWiki.togglePanelVisibility.wrap(function () {
		a("window.togglePanelVisibility is deprecated since XWiki 2.6RC1. Use XWiki.togglePanelVisibility instead.");
		var b = $A(arguments), c = b.shift();
		return c.apply(window, b)
	});
	window.cancelEdit = function () {
		a("window.cancelEdit is deprecated since XWiki 4.1M1. Use XWiki.EditLock.unlock instead.");
		XWiki.EditLock.unlock()
	};
	window.lockEdit = function () {
		a("window.lockEdit is deprecated since XWiki 4.1M1. Use XWiki.EditLock.lock instead.");
		XWiki.EditLock.lock()
	};
	window.cancelCancelEdit = function () {
		a("window.cancelCancelEdit is deprecated since XWiki 4.1M1. Use XWiki.EditLock.setLocked(false) instead.");
		XWiki.EditLock.setLocked(false)
	};
	XWiki.resource = XWiki.resource || {};
	Object.extend(XWiki.resource, {getWikiFromResourceName: function (b) {
		if (b.include(XWiki.constants.wikiSpaceSeparator)) {
			return b.substring(0, b.indexOf(XWiki.constants.wikiSpaceSeparator))
		}
		return null
	}, getSpaceFromResourceName: function (c) {
		var b = c;
		if (c.include(XWiki.constants.wikiSpaceSeparator)) {
			c = c.substring(c.indexOf(XWiki.constants.wikiSpaceSeparator) + 1, c.length)
		}
		if (c.include(XWiki.constants.spacePageSeparator)) {
			if (c.include(XWiki.constants.pageAttachmentSeparator) && c.indexOf(XWiki.constants.spacePageSeparator) > c.indexOf(XWiki.constants.pageAttachmentSeparator)) {
				return null
			}
			return c.substring(0, c.indexOf(XWiki.constants.spacePageSeparator))
		}
		if (b.include(XWiki.constants.wikiSpaceSeparator) && !b.include(XWiki.constants.pageAttachmentSeparator) && !b.include(XWiki.constants.anchorSeparator)) {
			return c
		}
		return null
	}, getNameFromResourceName: function (c) {
		var b = c;
		if (c.include(XWiki.constants.wikiSpaceSeparator)) {
			c = c.substring(c.indexOf(XWiki.constants.wikiSpaceSeparator) + 1, c.length)
		}
		if (c.include(XWiki.constants.pageAttachmentSeparator)) {
			c = c.substring(0, c.indexOf(XWiki.constants.pageAttachmentSeparator))
		}
		if (c.include(XWiki.constants.anchorSeparator)) {
			c = c.substring(0, c.indexOf(XWiki.constants.anchorSeparator))
		}
		if (c.include(XWiki.constants.spacePageSeparator)) {
			return c.substring(c.indexOf(XWiki.constants.spacePageSeparator) + 1, c.length)
		} else {
			if (b.include(XWiki.constants.wikiSpaceSeparator)) {
				return null
			} else {
				return c
			}
		}
	}, getAttachmentFromResourceName: function (b) {
		if (b.include(XWiki.constants.pageAttachmentSeparator)) {
			return b.substring(b.indexOf(XWiki.constants.pageAttachmentSeparator) + 1, b.length)
		}
		return null
	}, getAnchorFromResourceName: function (b) {
		if (b.include(XWiki.constants.anchorSeparator)) {
			return b.substring(b.indexOf(XWiki.constants.anchorSeparator) + 1, b.length)
		}
		return null
	}});
	XWiki.constants = XWiki.constants || {};
	Object.extend(XWiki.constants, {wikiSpaceSeparator: ":", spacePageSeparator: ".", pageAttachmentSeparator: "@"});
	(function () {
		if ($$("meta[name='document']").length > 0) {
			return
		}
		var c = $$("html")[0];
		var b = $$("head")[0];
		var d = function (e, f) {
			b.insert(new Element("meta", {name: e, content: c.readAttribute("data-xwiki-" + f)}))
		};
		d("document", "document");
		d("wiki", "wiki");
		d("space", "space");
		d("page", "page");
		d("version", "version");
		d("restURL", "resturl");
		d("form_token", "form-token");
		b.insert(new Element("meta", {name: "language", content: c.readAttribute("lang")}))
	})()
})();