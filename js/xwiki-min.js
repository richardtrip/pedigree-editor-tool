var XWiki = (function (a) {
	a.widgets = a.widgets || {};
	Object.extend(a, {constants: {anchorSeparator: "#", docextraCommentsAnchor: "Comments", docextraAttachmentsAnchor: "Attachments", docextraHistoryAnchor: "History", docextraInformationAnchor: "Information"}, resource: {get: function (e, h) {
		var d = "", j = ["Attachments"];
		var g = [a.EntityType.DOCUMENT];
		for (var f = 0; f < j.length; f++) {
			if (e.endsWith(a.constants.anchorSeparator + j[f])) {
				d = j[f];
				e = e.substr(0, e.length - (d.length + 1));
				h = h || g[f];
				break
			}
		}
		var b;
		if (h) {
			b = a.Model.resolve(e, h)
		} else {
			b = a.Model.resolve(e, a.EntityType.ATTACHMENT);
			if (!b.parent) {
				b = a.Model.resolve(e, a.EntityType.DOCUMENT);
				if (!b.parent) {
					var c = a.Model.resolve(e, a.EntityType.SPACE);
					if (c.parent) {
						b = c
					} else {
					}
				}
			}
		}
		return this.fromEntityReference(b, d)
	}, fromEntityReference: function (e, g) {
		var l = e.extractReference(a.EntityType.WIKI);
		l = (l && l.name) || a.currentWiki;
		var c = e.extractReference(a.EntityType.SPACE);
		c = (c && c.name) || a.currentSpace;
		var j = e.extractReference(a.EntityType.DOCUMENT);
		j = (j && j.name) || a.currentPage;
		var h = e.extractReference(a.EntityType.ATTACHMENT);
		h = (h && h.name) || "";
		var f = new a.DocumentReference(l, c, j);
		var d = a.Model.serialize(f.relativeTo(new a.WikiReference(l)));
		var b = a.Model.serialize(f.parent);
		var i = a.Model.serialize(f);
		return{wiki: l, space: c, prefixedSpace: b, fullName: d, prefixedFullName: i, name: j, attachment: h, anchor: g}
	}, asEntityReference: function (e) {
		var b;
		var d = [e.wiki, e.space, e.name, e.attachment];
		for (var c = 0; c < d.length; c++) {
			if (d[c]) {
				b = new a.EntityReference(d[c], c, b)
			}
		}
		return b
	}, serialize: function (c) {
		var b = a.Model.serialize(this.asEntityReference(c));
		if (c.anchor) {
			if (b.length > 0) {
				b += a.constants.anchorSeparator
			}
			b += c.anchor
		}
		return b
	}}, getResource: function (b) {
		return this.resource.get(b)
	}, displayDocExtra: function (b, c, e) {
		var d = function (f) {
			var g = document.getElementById(f + "tab");
			var h = document.getElementById(f + "pane");
			if (window.activeDocExtraTab != null) {
				window.activeDocExtraTab.className = "";
				window.activeDocExtraPane.className = "hidden"
			}
			window.activeDocExtraTab = g;
			window.activeDocExtraPane = h;
			window.activeDocExtraTab.className = "active";
			window.activeDocExtraPane.className = "";
			g.blur();
			document.fire("xwiki:docextra:activated", {id: f})
		};
		if ($(b + "pane").className.indexOf("empty") != -1) {
			if (window.activeDocExtraPane != null) {
				window.activeDocExtraPane.className = "invisible"
			}
			$("docextrapanes").className = "loading";
			new Ajax.Updater(b + "pane", window.docgeturl + "?xpage=xpart&vm=" + c, {method: "post", evalScripts: true, onComplete: function (f) {
				$("docextrapanes").className = "";
				document.fire("xwiki:docextra:loaded", {id: b, element: $(b + "pane")});
				d(b);
				if (e) {
					$(b + "anchor").id = b;
					location.href = "#" + b;
					$(b).id = b + "anchor"
				}
			}})
		} else {
			d(b);
			if (e) {
				$(b + "anchor").id = b;
				location.href = "#" + b;
				$(b).id = b + "anchor"
			}
		}
	}, makeRenderingErrorsExpandable: function (b) {
		$(b || "body").select(".xwikirenderingerror").each(function (c) {
			if (c.next().innerHTML !== "" && c.next().hasClassName("xwikirenderingerrordescription")) {
				c.style.cursor = "pointer";
				c.title = "Read technical information related to this error";
				Event.observe(c, "click", function (d) {
					d.element().next().toggleClassName("hidden")
				})
			}
		})
	}, fixLinksTargetAttribute: function (g) {
		var f = $(g || "body").select("a[rel]");
		for (var e = 0; e < f.length; e++) {
			var d = f[e];
			if (d.up(".xRichTextEditor")) {
				continue
			}
			if (d.getAttribute("href") && d.getAttribute("rel")) {
				var b = d.getAttribute("rel").split(" ");
				for (var c = 0; c < b.length; c++) {
					if (b[c].charAt(0) == "_") {
						d.target = b[c].substring(1);
						break
					} else {
						if (b[c] == "external") {
							d.target = "_blank";
							break
						}
					}
				}
			}
		}
	}, insertSectionEditLinks: function (b) {
		if (false && a.docsyntax != "xwiki/1.0" && a.contextaction == "view" && a.hasEdit) {
			var f = 1;
			b = $(b || "body");
			b = b.id == "xwikicontent" ? b : b.down("#xwikicontent");
			if (!b) {
				return
			}
			var c = b.childNodes;
			var e = new RegExp("H[1-" + 2 + "]");
			for (var d = 0; d < c.length; d++) {
				var h = $(c[d]);
				if (e.test(h.nodeName) && h.className.include("wikigeneratedheader") == false) {
					var g = document.createElement("SPAN");
					g.className = "edit_section";
					(!h.visible() || h.hasClassName("hidden")) && g.hide();
					var j;
					if (!a.hasRenderer) {
						j = document.createElement("SPAN");
						g.className = g.className + " disabled";
						j.title = "This document's syntax doesn't support section editing!"
					} else {
						j = document.createElement("A");
						j.href = window.docediturl + "?section=" + f;
						j.style.textDecoration = "none";
						j.innerHTML = "Edit"
					}
					g.appendChild(j);
					h.insert({after: g});
					f++
				}
			}
		}
	}, insertCreatePageFromTemplateModalBoxes: function (b) {
		if (a.docsyntax != "xwiki/1.0" && a.contextaction == "view" && a.hasEdit && a.widgets.ModalPopup) {
			a.widgets.CreatePagePopup = Class.create(a.widgets.ModalPopup, {initialize: function ($super, f) {
				var e = new Element("div", {"class": "modal-popup"});
				e.insert(f.content);
				$super(e, {show: {method: this.showDialog, keys: []}, close: {method: this.closeDialog, keys: ["Esc"]}}, {displayCloseButton: true, verticalPosition: "center", backgroundColor: "#FFF"});
				this.showDialog();
				this.setClass("createpage-modal-popup")
			}});
			var d = $(b || "body").select("span.wikicreatelink");
			for (var c = 0; c < d.length; c++) {
				d[c].down("a").observe("click", function (e) {
					new Ajax.Request(e.findElement("a").href.replace(/#.*$/, ""), {method: "get", parameters: {xpage: "createinline", ajax: 1}, onSuccess: function (g) {
						var f = g.getHeader("redirect");
						if (f) {
							window.location = f
						} else {
							new a.widgets.CreatePagePopup({content: g.responseText})
						}
					}, onFailure: function () {
						new a.widgets.Notification("An error occurred, please refresh the page and try again", "error", {inactive: true}).show()
					}});
					e.stop()
				})
			}
		}
	}, watchlist: {actionsMap: {tmWatchDocument: "adddocument", tmUnwatchDocument: "removedocument", tmWatchSpace: "addspace", tmUnwatchSpace: "removespace", tmWatchWiki: "addwiki", tmUnwatchWiki: "removewiki"}, flowMap: {tmWatchDocument: "tmUnwatchDocument", tmUnwatchDocument: "tmWatchDocument", tmWatchSpace: "tmUnwatchSpace", tmUnwatchSpace: "tmWatchSpace", tmWatchWiki: "tmUnwatchWiki", tmUnwatchWiki: "tmWatchWiki"}, executeAction: function (b) {
		var d = window.docgeturl + "?xpage=watch&do=" + this.actionsMap[b.id];
		var c = new Ajax.Request(d, {method: "get", onComplete: function () {
			if (b.nodeName == "A") {
				b.up().toggleClassName("hidden");
				$(a.watchlist.flowMap[b.id]).up().toggleClassName("hidden")
			} else {
				b.toggleClassName("hidden");
				$(a.watchlist.flowMap[b.id]).toggleClassName("hidden")
			}
		}})
	}, initialize: function (b) {
		b = $(b || "body");
		for (button in a.watchlist.actionsMap) {
			var d = b.down("#" + button);
			if (d) {
				var c = this;
				if (d.nodeName != "A") {
					d = $(button).down("A")
				}
				d.stopObserving("click");
				d.observe("click", function (f) {
					Event.stop(f);
					var e = f.element();
					while (e.id == "") {
						e = e.up()
					}
					a.watchlist.executeAction(e)
				})
			}
		}
	}}, cookies: {create: function (d, e, f) {
		if (f) {
			var c = new Date();
			c.setTime(c.getTime() + (f * 24 * 60 * 60 * 1000));
			var b = "; expires=" + c.toGMTString()
		} else {
			var b = ""
		}
		document.cookie = d + "=" + e + b + "; path=/"
	}, read: function (d) {
		var f = d + "=";
		var b = document.cookie.split(";");
		for (var e = 0; e < b.length; e++) {
			var g = b[e];
			while (g.charAt(0) == " ") {
				g = g.substring(1, g.length)
			}
			if (g.indexOf(f) == 0) {
				return g.substring(f.length, g.length)
			}
		}
		return null
	}, erase: function (b) {
		a.cookies.create(b, "", -1)
	}}, togglePanelVisibility: function (b) {
		b = $(b);
		b.toggleClassName("collapsed")
	}, registerPanelToggle: function (b) {
		$(b || "body").select(".panel .xwikipaneltitle").each(function (c) {
			c.observe("click", this.togglePanelVisibility.bind(this, c.up(".panel")))
		}.bind(this))
	}, extractFileName: function (c) {
		c = $(c);
		if (c.files && c.files.length > 0) {
			return c.files[0].name
		} else {
			if (c.value.substr(0, 12) == "C:\\fakepath\\") {
				return c.value.substr(12)
			} else {
				var b = c.value.lastIndexOf("/");
				if (b >= 0) {
					return c.value.substr(b + 1)
				}
				b = c.value.lastIndexOf("\\");
				if (b >= 0) {
					return c.value.substr(b + 1)
				}
				return c.value
			}
		}
	}, initialize: function () {
		if (typeof this.isInitialized == "undefined" || this.isInitialized == false) {
			if (typeof a.lastScriptLoaded == "undefined") {
				a.failedInit = true;
				return
			}
			this.isInitialized = true;
			document.fire("xwiki:dom:loading");
			document.observe("xwiki:dom:updated", function (b) {
				b.memo.elements.each(this._addBehaviour.bind(this))
			}.bindAsEventListener(this));
			this._addBehaviour();
			this.domIsLoaded = true;
			document.fire("xwiki:dom:loaded")
		}
	}, _addBehaviour: function (b) {
		b = b || $("body");
		this.makeRenderingErrorsExpandable(b);
		this.fixLinksTargetAttribute(b);
		this.insertSectionEditLinks(b);
		this.insertCreatePageFromTemplateModalBoxes(b);
		this.watchlist.initialize(b);
		this.registerPanelToggle(b)
	}});
	return a
})(XWiki || {});
document.observe("dom:loaded", XWiki.initialize.bind(XWiki));
function showsubmenu(a) {
	if (a.lastChild.tagName.toLowerCase() == "span") {
		if (window.hidetimer) {
			if (window.hideelement == a.lastChild) {
				clearTimeout(window.hidetimer);
				window.hidetimer = null;
				window.hideelement = null
			} else {
				doHide()
			}
		}
		var b = Element.positionedOffset(a);
		a.lastChild.style.left = (b[0] - 10) + "px";
		a.lastChild.style.top = (b[1] + a.offsetHeight) + "px";
		a.lastChild.className = a.lastChild.className.replace("hidden", "visible")
	}
}
function hidesubmenu(a) {
	if (a.lastChild.tagName.toLowerCase() == "span") {
		window.hideelement = a.lastChild;
		window.hidetimer = setTimeout(doHide, 100)
	}
}
function doHide() {
	window.hideelement.className = window.hideelement.className.replace("visible", "hidden");
	clearTimeout(window.hidetimer);
	window.hidetimer = null;
	window.hideelement = null
}
function toggleClass(b, a) {
	if (!eltHasClass(b, a)) {
		b.className += " " + a
	} else {
		rmClass(b, a)
	}
}
function addClass(b, a) {
	if (!eltHasClass(b, a)) {
		b.className += " " + a
	}
}
function eltHasClass(b, a) {
	if (!b.className) {
		return false
	}
	return new RegExp("\\b" + a + "\\b").test(b.className)
}
function rmClass(b, a) {
	b.className = b.className.replace(new RegExp("\\s*\\b" + a + "\\b"), "")
}
function openURL(a) {
	win = open(a, "win", "titlebar=0,width=990,height=500,resizable,scrollbars");
	if (win) {
		win.focus()
	}
}
function openHelp() {
	win = open("http://platform.xwiki.org/xwiki/bin/view/Main/XWikiSyntax?xpage=print", "XWikiSyntax", "titlebar=0,width=750,height=480,resizable,scrollbars");
	if (win) {
		win.focus()
	}
}
function updateName(a, d, c) {
	var b = a.value;
	b = noaccent(b);
	if (c != false) {
		b = b.replace(/class$/gi, "")
	}
	if (d == null) {
		a.value = b
	} else {
		d.value = b
	}
	if (b == "") {
		return false
	}
	return true
}
function noaccent(a) {
	temp = a.replace(/[\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5\u0100\u0102\u0104\u01cd\u01de\u01e0\u01fa\u0200\u0202\u0226]/g, "A");
	temp = temp.replace(/[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u0101\u0103\u0105\u01ce\u01df\u01e1\u01fb\u0201\u0203\u0227]/g, "a");
	temp = temp.replace(/[\u00c6\u01e2\u01fc]/g, "AE");
	temp = temp.replace(/[\u00e6\u01e3\u01fd]/g, "ae");
	temp = temp.replace(/[\u008c\u0152]/g, "OE");
	temp = temp.replace(/[\u009c\u0153]/g, "oe");
	temp = temp.replace(/[\u00c7\u0106\u0108\u010a\u010c]/g, "C");
	temp = temp.replace(/[\u00e7\u0107\u0109\u010b\u010d]/g, "c");
	temp = temp.replace(/[\u00d0\u010e\u0110]/g, "D");
	temp = temp.replace(/[\u00f0\u010f\u0111]/g, "d");
	temp = temp.replace(/[\u00c8\u00c9\u00ca\u00cb\u0112\u0114\u0116\u0118\u011a\u0204\u0206\u0228]/g, "E");
	temp = temp.replace(/[\u00e8\u00e9\u00ea\u00eb\u0113\u0115\u0117\u0119\u011b\u01dd\u0205\u0207\u0229]/g, "e");
	temp = temp.replace(/[\u011c\u011e\u0120\u0122\u01e4\u01e6\u01f4]/g, "G");
	temp = temp.replace(/[\u011d\u011f\u0121\u0123\u01e5\u01e7\u01f5]/g, "g");
	temp = temp.replace(/[\u0124\u0126\u021e]/g, "H");
	temp = temp.replace(/[\u0125\u0127\u021f]/g, "h");
	temp = temp.replace(/[\u00cc\u00cd\u00ce\u00cf\u0128\u012a\u012c\u012e\u0130\u01cf\u0208\u020a]/g, "I");
	temp = temp.replace(/[\u00ec\u00ed\u00ee\u00ef\u0129\u012b\u012d\u012f\u0131\u01d0\u0209\u020b]/g, "i");
	temp = temp.replace(/[\u0132]/g, "IJ");
	temp = temp.replace(/[\u0133]/g, "ij");
	temp = temp.replace(/[\u0134]/g, "J");
	temp = temp.replace(/[\u0135]/g, "j");
	temp = temp.replace(/[\u0136\u01e8]/g, "K");
	temp = temp.replace(/[\u0137\u0138\u01e9]/g, "k");
	temp = temp.replace(/[\u0139\u013b\u013d\u013f\u0141]/g, "L");
	temp = temp.replace(/[\u013a\u013c\u013e\u0140\u0142\u0234]/g, "l");
	temp = temp.replace(/[\u00d1\u0143\u0145\u0147\u014a\u01f8]/g, "N");
	temp = temp.replace(/[\u00f1\u0144\u0146\u0148\u0149\u014b\u01f9\u0235]/g, "n");
	temp = temp.replace(/[\u00d2\u00d3\u00d4\u00d5\u00d6\u00d8\u014c\u014e\u0150\u01d1\u01ea\u01ec\u01fe\u020c\u020e\u022a\u022c\u022e\u0230]/g, "O");
	temp = temp.replace(/[\u00f2\u00f3\u00f4\u00f5\u00f6\u00f8\u014d\u014f\u0151\u01d2\u01eb\u01ed\u01ff\u020d\u020f\u022b\u022d\u022f\u0231]/g, "o");
	temp = temp.replace(/[\u0156\u0158\u0210\u0212]/g, "R");
	temp = temp.replace(/[\u0157\u0159\u0211\u0213]/g, "r");
	temp = temp.replace(/[\u015a\u015c\u015e\u0160\u0218]/g, "S");
	temp = temp.replace(/[\u015b\u015d\u015f\u0161\u0219]/g, "s");
	temp = temp.replace(/[\u00de\u0162\u0164\u0166\u021a]/g, "T");
	temp = temp.replace(/[\u00fe\u0163\u0165\u0167\u021b\u0236]/g, "t");
	temp = temp.replace(/[\u00d9\u00da\u00db\u00dc\u0168\u016a\u016c\u016e\u0170\u0172\u01d3\u01d5\u01d7\u01d9\u01db\u0214\u0216]/g, "U");
	temp = temp.replace(/[\u00f9\u00fa\u00fb\u00fc\u0169\u016b\u016d\u016f\u0171\u0173\u01d4\u01d6\u01d8\u01da\u01dc\u0215\u0217]/g, "u");
	temp = temp.replace(/[\u0174]/g, "W");
	temp = temp.replace(/[\u0175]/g, "w");
	temp = temp.replace(/[\u00dd\u0176\u0178\u0232]/g, "Y");
	temp = temp.replace(/[\u00fd\u00ff\u0177\u0233]/g, "y");
	temp = temp.replace(/[\u0179\u017b\u017d]/g, "Z");
	temp = temp.replace(/[\u017a\u017c\u017e]/g, "z");
	temp = temp.replace(/[\u00df]/g, "SS");
	temp = temp.replace(/[^a-zA-Z0-9_]/g, "");
	return temp
}
function prepareName(b) {
	var d = b.register_first_name.value;
	var a = b.register_last_name.value;
	var c = b.xwikiname;
	if (d != "") {
		d = d.substring(0, 1).toUpperCase() + d.substring(1);
		d.replace(/ /g, "")
	}
	if (a != "") {
		a = a.substring(0, 1).toUpperCase() + a.substring(1);
		a.replace(/ /g, "")
	}
	if (c.value == "") {
		c.value = noaccent(d + a)
	}
}
function checkAdvancedContent(a) {
	result = false;
	if (!document.forms.edit) {
		return true
	}
	data = document.forms.edit.content.value;
	myRE = new RegExp("</?(html|body|img|a|i|b|embed|script|form|input|textarea|object|font|li|ul|ol|table|center|hr|br|p) ?([^>]*)>", "ig");
	results = data.match(myRE);
	if (results && results.length > 0) {
		result = true
	}
	myRE2 = new RegExp("(#(set|include|if|end|for)|#(#) Advanced content|public class|/* Advanced content */)", "ig");
	results = data.match(myRE2);
	if (results && results.length > 0) {
		result = true
	}
	if (result == true) {
		return confirm(a)
	}
	return true
}
shortcut = {all_shortcuts: {}, add: function (b, h, d) {
	var g = {type: "keydown", propagate: false, disable_in_input: false, target: document, keycode: false};
	if (!d) {
		d = g
	} else {
		for (var a in g) {
			if (typeof d[a] == "undefined") {
				d[a] = g[a]
			}
		}
	}
	var f = d.target;
	if (typeof d.target == "string") {
		f = document.getElementById(d.target)
	}
	var c = this;
	b = b.toLowerCase();
	var e = function (p) {
		p = p || window.event;
		if (d.disable_in_input) {
			var m;
			if (p.target) {
				m = p.target
			} else {
				if (p.srcElement) {
					m = p.srcElement
				}
			}
			if (m.nodeType == 3) {
				m = m.parentNode
			}
			if (m.tagName == "INPUT" || m.tagName == "TEXTAREA" || m.tagName == "SELECT") {
				return
			}
		}
		var j = 0;
		if (p.keyCode) {
			j = p.keyCode
		} else {
			if (p.which) {
				j = p.which
			}
		}
		var o = String.fromCharCode(j).toLowerCase();
		if (j == 188) {
			o = ","
		}
		if (j == 190) {
			o = "."
		}
		var t = b.split("+");
		var s = 0;
		var q = {"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ":", "'": '"', ",": "<", ".": ">", "/": "?", "\\": "|"};
		var n = {esc: 27, escape: 27, tab: 9, space: 32, "return": 13, enter: 13, backspace: 8, scrolllock: 145, scroll_lock: 145, scroll: 145, capslock: 20, caps_lock: 20, caps: 20, numlock: 144, num_lock: 144, num: 144, pause: 19, "break": 19, insert: 45, home: 36, "delete": 46, end: 35, pageup: 33, page_up: 33, pu: 33, pagedown: 34, page_down: 34, pd: 34, left: 37, up: 38, right: 39, down: 40, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123};
		var r = {shift: {wanted: false, pressed: false}, ctrl: {wanted: false, pressed: false}, alt: {wanted: false, pressed: false}, meta: {wanted: false, pressed: false}};
		if (p.ctrlKey) {
			r.ctrl.pressed = true
		}
		if (p.shiftKey) {
			r.shift.pressed = true
		}
		if (p.altKey) {
			r.alt.pressed = true
		}
		if (p.metaKey) {
			r.meta.pressed = true
		}
		for (var l = 0; k = t[l], l < t.length; l++) {
			if (k == "ctrl" || k == "control") {
				s++;
				r.ctrl.wanted = true
			} else {
				if (k == "shift") {
					s++;
					r.shift.wanted = true
				} else {
					if (k == "alt") {
						s++;
						r.alt.wanted = true
					} else {
						if (k == "meta") {
							s++;
							r.meta.wanted = true
						} else {
							if (k.length > 1) {
								if (n[k] == j) {
									s++
								}
							} else {
								if (d.keycode) {
									if (d.keycode == j) {
										s++
									}
								} else {
									if (o == k) {
										s++
									} else {
										if (q[o] && p.shiftKey) {
											o = q[o];
											if (o == k) {
												s++
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		if (s == t.length && r.ctrl.pressed == r.ctrl.wanted && r.shift.pressed == r.shift.wanted && r.alt.pressed == r.alt.wanted && r.meta.pressed == r.meta.wanted) {
			h(p);
			if (!d.propagate) {
				p.cancelBubble = true;
				p.returnValue = false;
				if (document.all && !window.opera && window.XMLHttpRequest) {
					p.keyCode = 0
				}
				if (p.stopPropagation) {
					p.stopPropagation();
					p.preventDefault()
				}
				return false
			}
		}
	};
	this.all_shortcuts[b] = {callback: e, target: f, event: d.type};
	if (f.addEventListener) {
		f.addEventListener(d.type, e, false)
	} else {
		if (f.attachEvent) {
			f.attachEvent("on" + d.type, e)
		} else {
			f["on" + d.type] = e
		}
	}
}, remove: function (a) {
	a = a.toLowerCase();
	var d = this.all_shortcuts[a];
	delete (this.all_shortcuts[a]);
	if (!d) {
		return
	}
	var b = d.event;
	var c = d.target;
	var e = d.callback;
	if (c.detachEvent) {
		c.detachEvent("on" + b, e)
	} else {
		if (c.removeEventListener) {
			c.removeEventListener(b, e, false)
		} else {
			c["on" + b] = false
		}
	}
}};
function BrowserDetect() {
	var b = navigator.userAgent.toLowerCase();
	this.isGecko = (b.indexOf("gecko") != -1 && b.indexOf("safari") == -1);
	this.isAppleWebKit = (b.indexOf("applewebkit") != -1);
	this.isKonqueror = (b.indexOf("konqueror") != -1);
	this.isSafari = (b.indexOf("safari") != -1);
	this.isOmniweb = (b.indexOf("omniweb") != -1);
	this.isOpera = (b.indexOf("opera") != -1);
	this.isIcab = (b.indexOf("icab") != -1);
	this.isAol = (b.indexOf("aol") != -1);
	this.isIE = (b.indexOf("msie") != -1 && !this.isOpera && (b.indexOf("webtv") == -1));
	this.isMozilla = (this.isGecko && b.indexOf("gecko/") + 14 == b.length);
	this.isFirefox = (b.indexOf("firefox/") != -1 || b.indexOf("firebird/") != -1);
	this.isNS = ((this.isGecko) ? (b.indexOf("netscape") != -1) : ((b.indexOf("mozilla") != -1) && !this.isOpera && !this.isSafari && (b.indexOf("spoofer") == -1) && (b.indexOf("compatible") == -1) && (b.indexOf("webtv") == -1) && (b.indexOf("hotjava") == -1)));
	this.isIECompatible = ((b.indexOf("msie") != -1) && !this.isIE);
	this.isNSCompatible = ((b.indexOf("mozilla") != -1) && !this.isNS && !this.isMozilla);
	this.geckoVersion = ((this.isGecko) ? b.substring((b.lastIndexOf("gecko/") + 6), (b.lastIndexOf("gecko/") + 14)) : -1);
	this.equivalentMozilla = ((this.isGecko) ? parseFloat(b.substring(b.indexOf("rv:") + 3)) : -1);
	this.appleWebKitVersion = ((this.isAppleWebKit) ? parseFloat(b.substring(b.indexOf("applewebkit/") + 12)) : -1);
	this.versionMinor = parseFloat(navigator.appVersion);
	if (this.isGecko && !this.isMozilla) {
		this.versionMinor = parseFloat(b.substring(b.indexOf("/", b.indexOf("gecko/") + 6) + 1))
	} else {
		if (this.isMozilla) {
			this.versionMinor = parseFloat(b.substring(b.indexOf("rv:") + 3))
		} else {
			if (this.isIE && this.versionMinor >= 4) {
				this.versionMinor = parseFloat(b.substring(b.indexOf("msie ") + 5))
			} else {
				if (this.isKonqueror) {
					this.versionMinor = parseFloat(b.substring(b.indexOf("konqueror/") + 10))
				} else {
					if (this.isSafari) {
						this.versionMinor = parseFloat(b.substring(b.lastIndexOf("safari/") + 7))
					} else {
						if (this.isOmniweb) {
							this.versionMinor = parseFloat(b.substring(b.lastIndexOf("omniweb/") + 8))
						} else {
							if (this.isOpera) {
								this.versionMinor = parseFloat(b.substring(b.indexOf("opera") + 6))
							} else {
								if (this.isIcab) {
									this.versionMinor = parseFloat(b.substring(b.indexOf("icab") + 5))
								}
							}
						}
					}
				}
			}
		}
	}
	this.versionMajor = parseInt(this.versionMinor);
	this.isDOM1 = (document.getElementById);
	this.isDOM2Event = (document.addEventListener && document.removeEventListener);
	this.mode = document.compatMode ? document.compatMode : "BackCompat";
	this.isWin = (b.indexOf("win") != -1);
	this.isWin32 = (this.isWin && (b.indexOf("95") != -1 || b.indexOf("98") != -1 || b.indexOf("nt") != -1 || b.indexOf("win32") != -1 || b.indexOf("32bit") != -1 || b.indexOf("xp") != -1));
	this.isMac = (b.indexOf("mac") != -1);
	this.isUnix = (b.indexOf("unix") != -1 || b.indexOf("sunos") != -1 || b.indexOf("bsd") != -1 || b.indexOf("x11") != -1);
	this.isLinux = (b.indexOf("linux") != -1);
	this.isNS4x = (this.isNS && this.versionMajor == 4);
	this.isNS40x = (this.isNS4x && this.versionMinor < 4.5);
	this.isNS47x = (this.isNS4x && this.versionMinor >= 4.7);
	this.isNS4up = (this.isNS && this.versionMinor >= 4);
	this.isNS6x = (this.isNS && this.versionMajor == 6);
	this.isNS6up = (this.isNS && this.versionMajor >= 6);
	this.isNS7x = (this.isNS && this.versionMajor == 7);
	this.isNS7up = (this.isNS && this.versionMajor >= 7);
	this.isIE4x = (this.isIE && this.versionMajor == 4);
	this.isIE4up = (this.isIE && this.versionMajor >= 4);
	this.isIE5x = (this.isIE && this.versionMajor == 5);
	this.isIE55 = (this.isIE && this.versionMinor == 5.5);
	this.isIE5up = (this.isIE && this.versionMajor >= 5);
	this.isIE6x = (this.isIE && this.versionMajor == 6);
	this.isIE6up = (this.isIE && this.versionMajor >= 6);
	this.isIE4xMac = (this.isIE4x && this.isMac);
	var a = /trident\/(\d+)/.exec(b);
	this.isIE11up = a && parseInt(a[1]) >= 7
}
var browser = new BrowserDetect();
XWiki.Document = Class.create({initialize: function (c, b, a) {
	this.page = c || XWiki.Document.currentPage;
	this.space = b || XWiki.Document.currentSpace;
	this.wiki = a || XWiki.Document.currentWiki
}, getURL: function (c, d, b) {
	c = c || "view";
	var a = XWiki.Document.URLTemplate;
	a = a.replace("__space__", encodeURIComponent(this.space));
	a = a.replace("__page__", (this.page == "WebHome") ? "" : encodeURIComponent(this.page));
	a = a.replace("__action__/", (c == "view") ? "" : (encodeURIComponent(c) + "/"));
	if (d) {
		a += "?" + d
	}
	if (b) {
		a += "#" + b
	}
	return a
}, getRestURL: function (a, c) {
	a = a || "";
	var b = XWiki.Document.RestURLTemplate;
	b = b.replace("__wiki__", this.wiki);
	b = b.replace("__space__", this.space);
	b = b.replace("__page__", this.page);
	if (a) {
		b += "/" + a
	}
	if (c) {
		b += "?" + c
	}
	return b
}});
var htmlElement = $(document.documentElement);
XWiki.Document.currentWiki = XWiki.currentWiki || "xwiki";
if (htmlElement.readAttribute("data-xwiki-wiki")) {
	XWiki.Document.currentWiki = htmlElement.readAttribute("data-xwiki-wiki")
} else {
	if ($$("meta[name=wiki]").length > 0) {
		XWiki.Document.currentWiki = $$("meta[name=wiki]")[0].content
	}
}
XWiki.Document.currentSpace = XWiki.currentSpace || "Main";
if (htmlElement.readAttribute("data-xwiki-space")) {
	XWiki.Document.currentSpace = htmlElement.readAttribute("data-xwiki-space")
} else {
	if ($$("meta[name=space]").length > 0) {
		XWiki.Document.currentSpace = $$("meta[name=space]")[0].content
	}
}
XWiki.Document.currentPage = XWiki.currentPage || "WebHome";
if (htmlElement.readAttribute("data-xwiki-page")) {
	XWiki.Document.currentPage = htmlElement.readAttribute("data-xwiki-page")
} else {
	if ($$("meta[name=page]").length > 0) {
		XWiki.Document.currentPage = $$("meta[name=page]")[0].content
	}
}
XWiki.Document.URLTemplate = "/__action__/__space__/__page__";
XWiki.Document.RestURLTemplate = "/rest/wikis/__wiki__/spaces/__space__/pages/__page__";
XWiki.Document.WikiSearchURLStub = "/rest/wikis/__wiki__/search";
XWiki.Document.SpaceSearchURLStub = "/rest/wikis/__wiki__/spaces/__space__/search";
XWiki.Document.getRestSearchURL = function (d, c, a) {
	a = a || XWiki.Document.currentWiki;
	var b;
	if (c) {
		b = XWiki.Document.SpaceSearchURLStub.replace("__wiki__", a).replace("__space__", c)
	} else {
		b = XWiki.Document.WikiSearchURLStub.replace("__wiki__", a)
	}
	if (d) {
		b += "?" + d
	}
	return b
};
XWiki.currentDocument = new XWiki.Document();
(function () {
	var b;
	if ("placeholder" in document.createElement("input")) {
		b = function (e) {
			var d = e.memo.element;
			if (d.placeholder === "") {
				if (d.hasClassName("useTitleAsTip")) {
					d.placeholder = d.title
				} else {
					d.placeholder = d.defaultValue;
					d.value = ""
				}
			}
		}
	} else {
		var a = function () {
			var d = this.hasClassName("empty");
			this.removeClassName("empty");
			if (d) {
				this.value = ""
			} else {
				this.select()
			}
		};
		var c = function () {
			if (this.value == "") {
				this.value = this.defaultValue;
				this.addClassName("empty")
			}
		};
		b = function (f) {
			var e = f.memo.element;
			var d = e.value;
			if (e.readAttribute("placeholder")) {
				e.defaultValue = e.readAttribute("placeholder")
			} else {
				if (e.hasClassName("useTitleAsTip")) {
					e.defaultValue = e.title
				}
			}
			e.value = d;
			if (e.value == e.defaultValue) {
				e.addClassName("empty")
			}
			e.observe("focus", a.bindAsEventListener(e));
			e.observe("blur", c.bindAsEventListener(e))
		}
	}
	document.observe("xwiki:addBehavior:withTip", b);
	document.observe("xwiki:dom:loaded", function () {
		$$("input.withTip", "textarea.withTip", "[placeholder]").each(function (d) {
			document.fire("xwiki:addBehavior:withTip", {element: d})
		})
	});
	document.observe("xwiki:dom:updated", function (d) {
		d.memo.elements.each(function (e) {
			e.select("input.withTip", "textarea.withTip", "[placeholder]").each(function (f) {
				document.fire("xwiki:addBehavior:withTip", {element: f})
			})
		})
	})
})();
document.observe("xwiki:dom:loaded", function () {
	var b = {documents: {script: XWiki.Document.getRestSearchURL("scope=name&number=10&"), varname: "q", icon: "resources/icons/silk/page_white_text.png", noresults: "Document not found", json: true, resultsParameter: "searchResults", resultId: "id", resultValue: "pageFullName", resultInfo: "pageFullName"}, spaces: {script: XWiki.Document.getRestSearchURL("scope=spaces&number=10&"), varname: "q", icon: "resources/icons/silk/folder.png", noresults: "Space not found", json: true, resultsParameter: "searchResults", resultId: "id", resultValue: "space", resultInfo: "space"}};
	var a = function (f) {
		if (typeof(XWiki.widgets.Suggest) != "undefined") {
			var e = Object.keys(b);
			for (var d = 0; d < e.length; d++) {
				var c = "input.suggest" + e[d].capitalize();
				f.each(function (g) {
					$(g).select(c).each(function (i) {
						if (!i.hasClassName("initialized")) {
							var h = {timeout: 30000};
							Object.extend(h, b[e[d]]);
							var j = new XWiki.widgets.Suggest(i, h);
							i.addClassName("initialized")
						}
					})
				})
			}
		}
	};
	a([$(document.documentElement)]);
	document.observe("xwiki:dom:updated", function (c) {
		a(c.memo.elements)
	})
});
["xwiki:dom:loaded", "xwiki:dom:updated"].each(function (a) {
	document.observe(a, function (b) {
		if (typeof(XWiki.widgets.Suggest) != "undefined") {
			var c = b.memo && b.memo.elements || [document.documentElement];
			c.each(function (d) {
				d.select(".suggested").each(function (e) {
					e.setAttribute("autocomplete", "off");
					if (typeof e.onfocus === "function") {
						e.onfocus();
						e.removeAttribute("onfocus")
					}
				})
			})
		}
	})
});
document.observe("xwiki:dom:loaded", function () {
	var h = $("hierarchy");
	var d = $("breadcrumbs");
	var f = $("editParentTrigger");
	var b = $("parentinput");
	var a = $("xwikidocparentinput");
	var g = $("xwikidoctitleinput");

	function e(j) {
		if (j) {
			j.stop()
		}
		b.removeClassName("active");
		f.addClassName("edit-parent");
		f.removeClassName("hide-edit-parent")
	}

	function i(j) {
		if (j) {
			j.stop()
		}
		b.addClassName("active");
		a.focus();
		f.removeClassName("edit-parent");
		f.addClassName("hide-edit-parent")
	}

	function c(j) {
		j.stop();
		j.element().blur();
		if (f.hasClassName("edit-parent")) {
			i()
		} else {
			e()
		}
	}

	if ($("hideEditParentTrigger")) {
		$("hideEditParentTrigger").style.display = "none"
	}
	if (f) {
		f.observe("click", c)
	}
	if (a) {
		if (h || d) {
			["blur", "change", "xwiki:suggest:selected"].each(function (j) {
				a.observe(j, function () {
					var l = {xpage: "xpart", vm: (h ? "hierarchy.vm" : "space.vm"), parent: a.value};
					if (g) {
						l.title = g.value
					}
					new Ajax.Request(XWiki.currentDocument.getURL("edit"), {parameters: l, onSuccess: function (m) {
						if (h) {
							h.replace(m.responseText);
							h = $("hierarchy")
						} else {
							var n = new Element("div");
							n.update(m.responseText);
							d.replace(n.down("[id=breadcrumbs]"));
							d = $("breadcrumbs")
						}
					}})
				})
			})
		}
		$("body").observe("click", function (j) {
			if (j.element().descendantOf && !j.element().descendantOf(b) && j.element() != b && j.element() != f) {
				e()
			}
		})
	}
});
document.observe("xwiki:dom:loaded", function () {
	if (!$("body").hasClassName("skin-colibri")) {
		return
	}
	var f = $("contentmenu") || $("editmenu");
	var d = $("mainContentArea") || $("mainEditArea");
	if (f && d) {
		e(f);
		Event.observe(window, "resize", function () {
			if (f.style.position == "fixed") {
				f.style.width = d.getWidth() + "px";
				if (typeof(f.__fm_extra) != "undefined") {
					if (f.__fm_extra.getStyle("padding-left").replace(/[^a-z]/g, "") == "px") {
						var g = f.__fm_extra.getStyle("border-left-width").replace(/[^0-9.]/g, "") - 0;
						g += f.__fm_extra.getStyle("padding-left").replace(/[^0-9.]/g, "") - 0;
						g += f.__fm_extra.getStyle("padding-right").replace(/[^0-9.]/g, "") - 0;
						g += f.__fm_extra.getStyle("border-right-width").replace(/[^0-9.]/g, "") - 0
					} else {
						g = 50
					}
					f.__fm_extra.style.width = (d.getWidth() - g) + "px"
				}
			}
		});
		if (!browser.isIE6x) {
			Event.observe(window, "scroll", b);
			document.observe("xwiki:annotations:settings:loaded", b)
		}
	}
	function b() {
		var h = $$(".annotationsettings");
		var g = 0;
		if (h && h.size() > 0) {
			f.__fm_extra = h[0];
			e(f.__fm_extra);
			g = f.__fm_extra.getHeight()
		}
		var m = f.getHeight();
		var l = d.cumulativeOffset().top - g;
		if (document.viewport.getScrollOffsets().top >= l) {
			var j = d.getWidth();
			var i = d.cumulativeOffset().left;
			c(f, 0, i, j);
			if (f.__fm_extra) {
				c(f.__fm_extra, m, i, (j - f.__fm_extra.getStyle("border-left-width").replace(/[^0-9]/g, "") - f.__fm_extra.getStyle("border-right-width").replace(/[^0-9]/g, "") - f.__fm_extra.getStyle("padding-right").replace(/[^0-9]/g, "") - f.__fm_extra.getStyle("padding-left").replace(/[^0-9]/g, "")))
			}
		} else {
			a(f);
			a(f.__fm_extra)
		}
	}

	function e(g) {
		if (typeof(g.__fm_ghost) == "undefined") {
			g.__fm_ghost = new Element("div");
			g.__fm_ghost.hide();
			g.insert({after: g.__fm_ghost})
		}
		g.__fm_ghost.clonePosition(g, {setWidth: false})
	}

	function c(g, j, i, h) {
		if (g) {
			g.addClassName("floating-menu");
			g.style.position = "fixed";
			g.style.top = j + "px";
			g.style.left = i + "px";
			g.style.width = h + "px";
			g.__fm_ghost.show()
		}
	}

	function a(g) {
		if (g) {
			g.removeClassName("floating-menu");
			g.style.position = "";
			g.style.top = "";
			g.style.left = "";
			g.style.width = "";
			g.__fm_ghost.hide()
		}
	}
});
var XWiki = (function (l) {
	var s = 0;
	l.EntityType = {WIKI: s++, SPACE: s++, DOCUMENT: s++, ATTACHMENT: s++, OBJECT: s++, OBJECT_PROPERTY: s++, CLASS_PROPERTY: s++};
	var d = [];
	for (var q in l.EntityType) {
		if (l.EntityType.hasOwnProperty(q)) {
			var f = l.EntityType[q];
			var p = q.toLowerCase().split("_");
			for (var u = 1; u < p.length; u++) {
				p[u] = p[u].substr(0, 1).toUpperCase() + p[u].substr(1)
			}
			d[f] = p.join("")
		}
	}
	l.EntityType.getName = function (i) {
		return d[i]
	};
	l.EntityType.byName = function (A) {
		for (var i = 0; i < d.length; i++) {
			if (d[i] === A) {
				return i
			}
		}
		return -1
	};
	l.EntityReference = Class.create({initialize: function (i, B, A) {
		this.name = i;
		this.type = B;
		this.parent = A
	}, extractReference: function (A) {
		var i = this;
		while (i && i.type != A) {
			i = i.parent
		}
		return i
	}, extractReferenceValue: function (A) {
		var i = this.extractReference(A);
		return i ? i.name : null
	}, relativeTo: function (C) {
		var B = this._extractComponents().reverse();
		var D = C ? C._extractComponents().reverse() : [];
		while (B.length > 0 && D.length > 0 && B[0].type != D[0].type) {
			B[0].type > D[0].type ? D.shift() : B.shift()
		}
		while (B.length > 0 && D.length > 0 && B[0].type == D[0].type && B[0].name == D[0].name) {
			B.shift();
			D.shift()
		}
		if (B.length == 0) {
			return new l.EntityReference("", this.type)
		} else {
			B = B.reverse();
			for (var A = 0; A < B.length; A++) {
				B[A] = new l.EntityReference(B[A].name, B[A].type);
				if (A > 0) {
					B[A - 1].parent = B[A]
				}
			}
			return B[0]
		}
	}, _extractComponents: function () {
		var A = [];
		var i = this;
		while (i) {
			A.push(i);
			i = i.parent
		}
		return A
	}});
	l.WikiReference = Class.create(l.EntityReference, {initialize: function ($super, i) {
		$super(i, l.EntityType.WIKI)
	}});
	l.SpaceReference = Class.create(l.EntityReference, {initialize: function ($super, A, i) {
		$super(i, l.EntityType.SPACE, new l.WikiReference(A))
	}});
	l.DocumentReference = Class.create(l.EntityReference, {initialize: function ($super, B, A, i) {
		$super(i, l.EntityType.DOCUMENT, new l.SpaceReference(B, A))
	}});
	l.AttachmentReference = Class.create(l.EntityReference, {initialize: function ($super, A, i) {
		$super(A, l.EntityType.ATTACHMENT, i)
	}});
	var r = "\\";
	var k = r + r;
	var m = ":";
	var x = ".";
	var h = "@";
	var b = "^";
	var y = x;
	var o = b;
	var n = [
		[],
		[x, m, r],
		[x, r],
		[h, r],
		[b, r],
		[y, r],
		[o, x, r]
	];
	var t = [
		[],
		[r + x, r + m, k],
		[r + x, k],
		[r + h, k],
		[r + b, k],
		[r + y, k],
		[r + o, r + x, k]
	];
	var v = [
		[],
		[m],
		[x, m],
		[h, x, m],
		[b, x, m],
		[y, b, x, m],
		[o, x, m]
	];
	var c = [
		[l.EntityType.WIKI],
		[l.EntityType.SPACE, l.EntityType.WIKI],
		[l.EntityType.DOCUMENT, l.EntityType.SPACE, l.EntityType.WIKI],
		[l.EntityType.ATTACHMENT, l.EntityType.DOCUMENT, l.EntityType.SPACE, l.EntityType.WIKI],
		[l.EntityType.OBJECT, l.EntityType.DOCUMENT, l.EntityType.SPACE, l.EntityType.WIKI],
		[l.EntityType.OBJECT_PROPERTY, l.EntityType.OBJECT, l.EntityType.DOCUMENT, l.EntityType.SPACE, l.EntityType.WIKI],
		[l.EntityType.CLASS_PROPERTY, l.EntityType.DOCUMENT, l.EntityType.SPACE, l.EntityType.WIKI]
	];
	var z = [k, r];
	var e = [r, ""];

	function j(E, A, B) {
		for (var D = 0; D < B.length; D++) {
			var C = A + D;
			if (C >= E.length || E.charAt(C) != B.charAt(D)) {
				return false
			}
		}
		return true
	}

	function a(F, E, D) {
		var A = "", C = -1;
		while (++C < F.length) {
			for (var B = 0; B < E.length; B++) {
				if (j(F, C, E[B])) {
					F = F.substr(0, C) + D[B] + F.substr(C + E[B].length);
					C += D[B].length - 1;
					break
				}
			}
		}
		return F
	}

	l.EntityReferenceResolver = Class.create({resolve: function (C, F) {
		C = C || "";
		F = parseInt(F);
		if (isNaN(F) || F < 0 || F >= v.length) {
			throw"No parsing definition found for Entity Type [" + F + "]"
		}
		var D;
		var B = v[F];
		var H = c[F];
		for (var G = 0; G < B.length && C != null; G++) {
			var E = this._splitAndUnescape(C, B[G]);
			C = E[0];
			var I = new l.EntityReference(E[1], H[G]);
			D = this._appendParent(D, I)
		}
		if (C != null) {
			var A = a(C, z, e);
			var I = new l.EntityReference(A, H[B.length]);
			D = this._appendParent(D, I)
		}
		return D
	}, _appendParent: function (i, B) {
		if (i) {
			var A = i;
			while (A.parent) {
				A = A.parent
			}
			A.parent = B;
			return i
		} else {
			return B
		}
	}, _splitAndUnescape: function (D, G) {
		var C = [];
		var E = D.length;
		while (--E >= 0) {
			var B = D.charAt(E);
			var A = E - 1;
			var H = 0;
			if (A >= 0) {
				H = D.charAt(A)
			}
			if (B == G) {
				var F = this._getNumberOfCharsBefore(r, D, A);
				if (F % 2 == 0) {
					break
				} else {
					--E
				}
			} else {
				if (H == r) {
					--E
				}
			}
			C.push(B)
		}
		return[E < 0 ? null : D.substring(0, E), C.reverse().join("")]
	}, _getNumberOfCharsBefore: function (C, A, B) {
		var i = B;
		while (i >= 0 && A.charAt(i) == C) {
			--i
		}
		return B - i
	}});
	l.EntityReferenceSerializer = Class.create({serialize: function (i) {
		return i ? this.serialize(i.parent) + this._serializeComponent(i) : ""
	}, _serializeComponent: function (B) {
		var i = "";
		var A = n[B.type];
		if (B.parent) {
			i += B.parent.type == l.EntityType.WIKI ? m : A[0]
		}
		if (A.length > 0) {
			i += a(B.name, A, t[B.type])
		} else {
			i += B.name.replace(r, k)
		}
		return i
	}});
	var g = new l.EntityReferenceResolver();
	var w = new l.EntityReferenceSerializer();
	l.Model = {serialize: function (i) {
		return w.serialize(i)
	}, resolve: function (i, A) {
		return g.resolve(i, A)
	}};
	return l
}(XWiki || {}));
var XWiki = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.ModalPopup = Class.create({options: {globalDialog: true, title: "", displayCloseButton: true, extraClassName: false, screenColor: "", borderColor: "", titleColor: "", backgroundColor: "", screenOpacity: "0.5", verticalPosition: "center", horizontalPosition: "center", removeOnClose: false, onClose: Prototype.emptyFunction}, initialize: function (e, c, d) {
		this.shortcuts = {show: {method: this.showDialog, keys: ["Ctrl+G", "Meta+G"]}, close: {method: this.closeDialog, keys: ["Esc"]}}, this.content = e || "Hello world!";
		this.shortcuts = Object.extend(Object.clone(this.shortcuts), c || {});
		this.options = Object.extend(Object.clone(this.options), d || {});
		this.registerShortcuts("show")
	}, createDialog: function (e) {
		this.dialog = new Element("div", {"class": "xdialog-modal-container"});
		var d = new Element("div", {"class": "xdialog-screen"}).setStyle({opacity: this.options.screenOpacity, backgroundColor: this.options.screenColor});
		this.dialog.update(d);
		this.dialogBox = new Element("div", {"class": "xdialog-box"});
		if (this.options.extraClassName) {
			this.dialogBox.addClassName(this.options.extraClassName)
		}
		this.dialogBox._x_contentPlug = new Element("div", {"class": "xdialog-content"});
		this.dialogBox.update(this.dialogBox._x_contentPlug);
		this.dialogBox._x_contentPlug.update(this.content);
		if (this.options.title) {
			var f = new Element("div", {"class": "xdialog-title"}).update(this.options.title);
			f.setStyle({color: this.options.titleColor});
			this.dialogBox.insertBefore(f, this.dialogBox.firstChild)
		}
		if (this.options.displayCloseButton) {
			var c = new Element("div", {"class": "xdialog-close", title: "Close"}).update("&#215;");
			c.observe("click", this.closeDialog.bindAsEventListener(this));
			if (this.options.title) {
				f.insert({bottom: c});
				if (this.options.titleColor) {
					c.setStyle({color: this.options.titleColor})
				}
			} else {
				this.dialogBox.insertBefore(c, this.dialogBox.firstChild)
			}
		}
		this.dialog.appendChild(this.dialogBox);
		this.dialogBox.setStyle({textAlign: "left", borderColor: this.options.borderColor, backgroundColor: this.options.backgroundColor});
		switch (this.options.verticalPosition) {
			case"top":
				this.dialogBox.setStyle({top: "0"});
				break;
			case"bottom":
				this.dialogBox.setStyle({bottom: "0"});
				break;
			default:
				this.dialogBox.setStyle({top: "35%"});
				break
		}
		switch (this.options.horizontalPosition) {
			case"left":
				this.dialog.setStyle({textAlign: "left"});
				break;
			case"right":
				this.dialog.setStyle({textAlign: "right"});
				break;
			default:
				this.dialog.setStyle({textAlign: "center"});
				this.dialogBox.setStyle({margin: "auto"});
				break
		}
		$("body").appendChild(this.dialog);
		this.dialog.hide()
	}, setClass: function (c) {
		this.dialogBox.addClassName("xdialog-box-" + c)
	}, removeClass: function (c) {
		this.dialogBox.removeClassName("xdialog-box-" + c)
	}, setContent: function (c) {
		this.content = c;
		this.dialogBox._x_contentPlug.update(this.content)
	}, showDialog: function (c) {
		if (c) {
			Event.stop(c)
		}
		if (this.options.globalDialog) {
			if (a.ModalPopup.active) {
				return
			} else {
				a.ModalPopup.active = true
			}
		} else {
			if (this.active) {
				return
			} else {
				this.active = true
			}
		}
		if (!this.dialog) {
			this.createDialog()
		}
		this.attachKeyListeners();
		this.dialog.show()
	}, closeDialog: function (c) {
		if (c) {
			Event.stop(c)
		}
		this.options.onClose.call(this);
		this.dialog.hide();
		if (this.options.removeOnClose) {
			this.dialog.remove()
		}
		this.detachKeyListeners();
		if (this.options.globalDialog) {
			a.ModalPopup.active = false
		} else {
			this.active = false
		}
	}, attachKeyListeners: function () {
		for (var c in this.shortcuts) {
			if (c != "show") {
				this.registerShortcuts(c)
			}
		}
	}, detachKeyListeners: function () {
		for (var c in this.shortcuts) {
			if (c != "show") {
				this.unregisterShortcuts(c)
			}
		}
	}, registerShortcuts: function (f) {
		var c = this.shortcuts[f].keys;
		var g = this.shortcuts[f].method.bindAsEventListener(this, f);
		var d = this.shortcuts[f].options;
		for (var e = 0; e < c.size(); ++e) {
			shortcut.add(c[e], g, d)
		}
	}, unregisterShortcuts: function (d) {
		for (var c = 0; c < this.shortcuts[d].keys.size(); ++c) {
			shortcut.remove(this.shortcuts[d].keys[c])
		}
	}, createButton: function (d, f, e, i, h) {
		var g = new Element("span", {"class": "buttonwrapper"});
		var c = new Element("input", {type: d, "class": "button", value: f, title: e, id: i});
		if (h) {
			c.addClassName(h)
		}
		g.update(c);
		return g
	}});
	a.ModalPopup.active = false;
	return b
}(XWiki || {}));
var XWiki = (function (c) {
	var a = c.widgets = c.widgets || {};
	if (!c.widgets.ModalPopup) {
		if (console && console.warn) {
			console.warn("[JumpToPage widget] Required class missing: XWiki.widgets.ModalPopup")
		}
	} else {
		a.JumpToPage = Class.create(a.ModalPopup, {urlTemplate: "/__action__/__space__/__document__", initialize: function ($super) {
			var e = new Element("div");
			this.input = new Element("input", {type: "text", id: "jmp_target", title: "Space.Document"});
			e.appendChild(this.input);
			this.viewButton = this.createButton("button", "View", "View document (Enter, Meta+V)", "jmp_view");
			this.editButton = this.createButton("button", "Edit", "Edit document in the default editor (Meta+E)", "jmp_edit");
			var d = new Element("div", {"class": "buttons"});
			d.appendChild(this.viewButton);
			d.appendChild(this.editButton);
			e.appendChild(d);
			$super(e, {show: {method: this.showDialog, keys: ['Meta+G', 'Ctrl+G', 'Ctrl+/', 'Meta+/']}, view: {method: this.openDocument, keys: ['Enter', 'Meta+V'], options: {propagate: true}}, edit: {method: this.openDocument, keys: ['Meta+E']}}, {title: "Go to:", extraClassName: "jump-dialog", verticalPosition: "top"});
			this.shortcuts.close.options = {propagate: true};
			this.addQuickLinksEntry()
		}, createDialog: function ($super, d) {
			Event.observe(this.viewButton, "click", this.openDocument.bindAsEventListener(this, "view"));
			Event.observe(this.editButton, "click", this.openDocument.bindAsEventListener(this, "edit"));
			$super(d);
			if (typeof(c.widgets.Suggest) != "undefined") {
				new c.widgets.Suggest(this.input, {
					/*!*/
					script: "/rest/wikis/xwiki/search?scope=name&number=10&", varname: "q", noresults: "No documents found", icon: "resources/icons/silk/page_white_text.png", json: true, resultsParameter: "searchResults", resultId: "id", resultValue: "pageFullName", resultInfo: "pageFullName", timeout: 30000, parentContainer: this.dialogBox, propagateEventKeyCodes: [Event.KEY_RETURN]})
			}
		}, showDialog: function ($super) {
			$super();
			this.input.value = "";
			this.input.focus()
		}, closeDialog: function ($super, d) {
			if (!d.type.startsWith("key") || !this.dialogBox.down(".ajaxsuggest")) {
				$super();
				this.input.__x_suggest.clearSuggestions()
			}
		}, openDocument: function (e, f) {
			var g = this.dialogBox.down(".ajaxsuggest .xhighlight");
			if ((!g || g.hasClassName("noSuggestion")) && this.input.value != "") {
				Event.stop(e);
				var d = c.Model.resolve(this.input.value, c.EntityType.DOCUMENT);
				if (d.parent) {
					window.self.location = this.urlTemplate.replace("__space__", d.parent.name).replace("__document__", d.name).replace("__action__", f)
				} else {
					if (typeof(c.widgets.Suggest) != "undefined") {
						new c.widgets.Notification("Invalid page name. Valid names have the following format: Space.Page", "error")
					}
				}
			}
		}, addQuickLinksEntry: function () {
			$$(".panel.QuickLinks .xwikipanelcontents").each(function (e) {
				var d = new Element("span", {"class": "jmp-activator"});
				d.update("Jump to any page in the wiki (Meta+G)");
				Event.observe(d, "click", function (f) {
					this.showDialog(f)
				}.bindAsEventListener(this));
				e.appendChild(d)
			}.bind(this))
		}});
		function b() {
			return new a.JumpToPage()
		}

		(c.domIsLoaded && b()) || document.observe("xwiki:dom:loaded", b)
	}
	return c
}(XWiki || {}));
if (typeof(XWiki) == "undefined" || typeof(XWiki.widgets) == "undefined" || typeof(XWiki.widgets.ModalPopup) == "undefined") {
	if (typeof console != "undefined" && typeof console.warn == "function") {
		console.warn("[ConfirmationBox widget] Required class missing: XWiki.widgets.ModalPopup")
	}
} else {
	XWiki.widgets.ConfirmationBox = Class.create(XWiki.widgets.ModalPopup, {defaultInteractionParameters: {confirmationText: "Are you sure?", yesButtonText: "Yes", noButtonText: "No", cancelButtonText: "Cancel", showCancelButton: false}, initialize: function ($super, b, c) {
		this.interactionParameters = Object.extend(Object.clone(this.defaultInteractionParameters), c || {});
		var a = {show: {method: this.showDialog, keys: []}, yes: {method: this.onYes, keys: ["Enter", "Space", "y"]}, no: {method: this.onNo, keys: ["n"]}, close: {method: this.closeDialog, keys: ["c"]}};
		if (this.interactionParameters.showCancelButton) {
			a.close.keys.push("Esc")
		} else {
			a.no.keys.push("Esc")
		}
		$super(this.createContent(this.interactionParameters), a, {displayCloseButton: false, removeOnClose: true});
		this.showDialog();
		this.setClass("confirmation");
		this.behavior = b || {}
	}, createContent: function (e) {
		var b = new Element("div", {"class": "question"}).update(e.confirmationText);
		var d = new Element("div", {"class": "buttons"});
		var f = this.createButton("button", e.yesButtonText, "(Enter)", "");
		Event.observe(f, "click", this.onYes.bindAsEventListener(this));
		d.insert(f);
		var a = this.createButton("button", e.noButtonText, e.showCancelButton ? "(n)" : "(Esc)", "", "secondary");
		Event.observe(a, "click", this.onNo.bindAsEventListener(this));
		d.insert(a);
		if (e.showCancelButton) {
			var g = this.createButton("button", e.cancelButtonText, "(Esc)", "", "cancel secondary");
			Event.observe(g, "click", this.onCancel.bindAsEventListener(this));
			d.insert(g)
		}
		var c = new Element("div");
		c.insert(b).insert(d);
		return c
	}, onYes: function () {
		this.closeDialog();
		if (typeof(this.behavior.onYes) == "function") {
			this.behavior.onYes()
		}
	}, onNo: function () {
		this.closeDialog();
		if (typeof(this.behavior.onNo) == "function") {
			this.behavior.onNo()
		}
	}, onCancel: function () {
		this.closeDialog();
		if (typeof(this.behavior.onCancel) == "function") {
			this.behavior.onCancel()
		}
	}})
}
;
if (typeof(XWiki) == "undefined" || typeof(XWiki.widgets) == "undefined" || typeof(XWiki.widgets.ConfirmationBox) == "undefined") {
	if (typeof console != "undefined" && typeof console.warn == "function") {
		console.warn("[MessageBox widget] Required class missing: XWiki.widgets.ModalPopup")
	}
} else {
	XWiki.widgets.ConfirmedAjaxRequest = Class.create(XWiki.widgets.ConfirmationBox, {defaultAjaxRequestParameters: {on1223: function (a) {
		a.request.options.onSuccess(a)
	}, on0: function (a) {
		a.request.options.onFailure(a)
	}}, initialize: function ($super, b, a, c) {
		this.interactionParameters = Object.extend({displayProgressMessage: true, progressMessageText: "Sending request...", displaySuccessMessage: true, successMessageText: "Done!", displayFailureMessage: true, failureMessageText: "Failed: "}, c || {});
		this.requestUrl = b;
		this.ajaxRequestParameters = Object.extend(Object.clone(this.defaultAjaxRequestParameters), a || {});
		Object.extend(this.ajaxRequestParameters, {onSuccess: function () {
			if (this.interactionParameters.displaySuccessMessage) {
				if (this.progressNotification) {
					this.progressNotification.replace(new XWiki.widgets.Notification(this.interactionParameters.successMessageText, "done"))
				} else {
					new XWiki.widgets.Notification(this.interactionParameters.successMessageText, "done")
				}
			} else {
				if (this.progressNotification) {
					this.progressNotification.hide()
				}
			}
			if (a.onSuccess) {
				a.onSuccess.apply(this, arguments)
			}
		}.bind(this), onFailure: function (d) {
			if (this.interactionParameters.displayFailureMessage) {
				var e = d.statusText;
				if (d.statusText == "" || d.status == 12031) {
					e = "Server not responding"
				}
				if (this.progressNotification) {
					this.progressNotification.replace(new XWiki.widgets.Notification(this.interactionParameters.failureMessageText + e, "error"))
				} else {
					new XWiki.widgets.Notification(this.interactionParameters.failureMessageText + e, "error")
				}
			} else {
				if (this.progressNotification) {
					this.progressNotification.hide()
				}
			}
			if (a.onFailure) {
				a.onFailure.apply(this, arguments)
			}
		}.bind(this)});
		$super({onYes: function () {
			if (this.interactionParameters.displayProgressMessage) {
				this.progressNotification = new XWiki.widgets.Notification(this.interactionParameters.progressMessageText, "inprogress")
			}
			new Ajax.Request(this.requestUrl, this.ajaxRequestParameters)
		}.bind(this)}, this.interactionParameters)
	}})
}
;
var XWiki = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.Notification = Class.create({text: "Hello world!", defaultOptions: {plain: {timeout: 5}, info: {timeout: 5}, warning: {timeout: 5}, error: {timeout: 10}, inprogress: {timeout: false}, done: {timeout: 2}}, initialize: function (e, d, c) {
		this.text = e || this.text;
		this.type = (typeof this.defaultOptions[d] != "undefined") ? d : "plain";
		this.options = Object.extend(Object.clone(this.defaultOptions[this.type]), c || {});
		this.createElement();
		if (!this.options.inactive) {
			this.show()
		}
	}, createElement: function () {
		if (!this.element) {
			this.element = new Element("div", {"class": "xnotification xnotification-" + this.type}).update(this.text);
			if (this.options.icon) {
				this.element.setStyle({backgroundImage: this.options.icon, paddingLeft: "22px"})
			}
			if (this.options.backgroundColor) {
				this.element.setStyle({backgroundColor: this.options.backgroundColor})
			}
			if (this.options.color) {
				this.element.setStyle({color: this.options.color})
			}
			this.element = this.element.wrap(new Element("div", {"class": "xnotification-wrapper"}));
			Event.observe(this.element, "click", this.hide.bindAsEventListener(this))
		}
	}, show: function () {
		if (!this.element.descendantOf(a.Notification.getContainer())) {
			a.Notification.getContainer().insert({top: this.element})
		}
		this.element.show();
		if (this.options.timeout) {
			this.timer = window.setTimeout(this.hide.bind(this), this.options.timeout * 1000)
		}
	}, hide: function () {
		this.element.hide();
		if (this.element.parentNode) {
			this.element.remove()
		}
		if (this.timer) {
			window.clearTimeout(this.timer);
			this.timer = null
		}
		(typeof this.options.onHide == "function") && this.options.onHide()
	}, replace: function (c) {
		if (this.element.parentNode) {
			this.element.replace(c.element)
		}
		if (this.timer) {
			window.clearTimeout(this.timer);
			this.timer = null
		}
		c.show()
	}});
	a.Notification.container = null;
	a.Notification.getContainer = function () {
		if (!a.Notification.container) {
			a.Notification.container = new Element("div", {"class": "xnotification-container"});
			$("body").insert(a.Notification.container)
		}
		return a.Notification.container
	};
	return b
}(XWiki || {}));
var XWiki = function (b) {
	var a = b.widgets = b.widgets || {};
	a.XList = Class.create({initialize: function (c, d) {
		this.items = c || [];
		this.options = d || {};
		this.listElement = new Element(this.options.ordered ? "ol" : "ul", {"class": "xlist" + (this.options.classes ? (" " + this.options.classes) : "")});
		if (this.items && this.items.length > 0) {
			for (var e = 0; e < this.items.length; e++) {
				this.addItem(this.items[e])
			}
		}
	}, addItem: function (c) {
		if (!c || !(c instanceof b.widgets.XListItem)) {
			c = new b.widgets.XListItem(c)
		}
		var d = c.getElement();
		if (this.options.itemClasses && !this.options.itemClasses.blank()) {
			d.addClassName(this.options.itemClasses)
		}
		this.listElement.insert(d);
		if (typeof this.options.eventListeners == "object") {
			c.bindEventListeners(this.options.eventListeners)
		}
		if (this.options.icon && !this.options.icon.blank()) {
			c.setIcon(this.options.icon, this.options.overrideItemIcon)
		}
		c.list = this
	}, getElement: function () {
		return this.listElement
	}});
	a.XListItem = Class.create({initialize: function (e, c) {
		this.options = c || {};
		var d = "xitem " + (this.options.noHighlight ? "" : "xhighlight ");
		d += this.options.classes ? this.options.classes : "";
		this.containerElement = new Element("div", {"class": "xitemcontainer"}).insert(e || "");
		this.containerElement.addClassName(this.options.containerClasses || "");
		this.containerElement.setStyle({textIndent: "0px"});
		if (this.options.value) {
			this.containerElement.insert(new Element("div", {"class": "hidden value"}).insert(this.options.value))
		}
		this.listItemElement = new Element("li", {"class": d}).update(this.containerElement);
		if (this.options.icon && !this.options.icon.blank()) {
			this.setIcon(this.options.icon);
			this.hasIcon = true
		}
		if (typeof this.options.eventListeners == "object") {
			this.bindEventListeners(this.options.eventListeners)
		}
	}, getElement: function () {
		return this.listItemElement
	}, setIcon: function (d, c) {
		if (!this.hasIcon || c) {
			this.iconImage = new Image();
			this.iconImage.onload = function () {
				this.listItemElement.setStyle({backgroundImage: "url(" + this.iconImage.src + ")", backgroundRepeat: "no-repeat", backgroundPosition: "3px 3px"});
				this.listItemElement.down(".xitemcontainer").setStyle({textIndent: (this.iconImage.width + 6) + "px"})
			}.bind(this);
			this.iconImage.src = d
		}
	}, bindEventListeners: function (e) {
		var d = Object.keys(e);
		for (var c = 0; c < d.length; c++) {
			this.listItemElement.observe(d[c], e[d[c]].bindAsEventListener(this.options.eventCallbackScope ? this.options.eventCallbackScope : this))
		}
	}});
	return b
}(XWiki || {});
var XWiki = (function (b) {
	var a = b.widgets = b.widgets || {};
	if (typeof a.XList == "undefined") {
		if (typeof console != "undefined" && typeof console.warn == "function") {
			console.warn("[Suggest widget] Required class missing: XWiki.widgets.XList")
		}
	} else {
		a.Suggest = Class.create({options: {minchars: 1, method: "get", varname: "input", className: "ajaxsuggest", timeout: 2500, delay: 500, offsety: 0, shownoresults: true, noresults: "No results!", maxheight: 250, cache: false, seps: "", icon: null, resultsParameter: "results", resultId: "id", resultValue: "value", resultInfo: "info", resultIcon: "icon", resultHint: "hint", resultType: "type", parentContainer: "body", highlight: true, fadeOnClear: true, hideButton: {positions: ["top"], text: "hide suggestions"}, insertBeforeSuggestions: null, displayValue: false, displayValueText: "Value: ", align: "left", unifiedLoader: false, loaderNode: null, propagateEventKeyCodes: []}, sInput: "", nInputChars: 0, aSuggestions: {}, iHighlighted: null, isActive: false, initialize: function (c, d) {
			if (!c) {
				return false
			}
			this.setInputField(c);
			this.options = Object.extend(Object.clone(this.options), d || {});
			if (typeof this.options.sources == "object") {
				this.isInMultiSourceMode = true;
				this.sources = this.options.sources
			} else {
				this.sources = this.options
			}
			this.sources = [this.sources].flatten().compact();
			if (this.sources.length == 0) {
				this.sources.push({script: function (e, f) {
					f([])
				}})
			}
			if (!$(this.options.parentContainer)) {
				this.options.parentContainer = $(document.body)
			}
			if (this.options.seps) {
				this.seps = this.options.seps
			} else {
				this.seps = ""
			}
			this.latestRequest = 0
		}, setInputField: function (c) {
			this.detach();
			this.fld = $(c);
			if (this.fld.__x_suggest) {
				this.fld.__x_suggest.detach()
			}
			this.fld.__x_suggest = this;
			this.onKeyUp = this.onKeyUp.bindAsEventListener(this);
			this.fld.observe("keyup", this.onKeyUp);
			this.onKeyPress = this.onKeyPress.bindAsEventListener(this);
			if (Prototype.Browser.IE || Prototype.Browser.WebKit || browser.isIE11up) {
				this.fld.observe("keydown", this.onKeyPress)
			} else {
				this.fld.observe("keypress", this.onKeyPress)
			}
			this.fld.setAttribute("autocomplete", "off");
			this.fld.observe("blur", function (d) {
				this.latestRequest++
			}.bind(this))
		}, onKeyUp: function (f) {
			var d = f.keyCode;
			switch (d) {
				case Event.KEY_RETURN:
				case Event.KEY_ESC:
				case Event.KEY_UP:
				case Event.KEY_DOWN:
					break;
				default:
					if (this.seps) {
						var e = -1;
						for (var c = 0; c < this.seps.length; c++) {
							if (this.fld.value.lastIndexOf(this.seps.charAt(c)) > e) {
								e = this.fld.value.lastIndexOf(this.seps.charAt(c))
							}
						}
						if (e == -1) {
							this.getSuggestions(this.fld.value)
						} else {
							this.getSuggestions(this.fld.value.substring(e + 1))
						}
					} else {
						this.getSuggestions(this.fld.value)
					}
			}
		}, onKeyPress: function (d) {
			if (!$(this.isActive)) {
				return
			}
			var c = d.keyCode;
			var e = true;
			switch (c) {
				case Event.KEY_RETURN:
					if (!this.iHighlighted && (Object.keys(this.aSuggestions).length == 1 && this.aSuggestions[Object.keys(this.aSuggestions)[0]].length == 1)) {
						this.highlightFirst()
					}
					this.setHighlightedValue(d);
					break;
				case Event.KEY_ESC:
					this.clearSuggestions();
					break;
				case Event.KEY_UP:
					this.changeHighlight(c);
					break;
				case Event.KEY_DOWN:
					this.changeHighlight(c);
					break;
				default:
					e = false;
					break
			}
			if (e && this.options.propagateEventKeyCodes && this.options.propagateEventKeyCodes.indexOf(c) == -1) {
				Event.stop(d)
			}
		}, getSuggestions: function (g) {
			g = g.strip().toLowerCase();
			if (g == this.sInput) {
				return false
			}
			if (g.length < this.options.minchars) {
				this.sInput = "";
				this.clearSuggestions();
				return false
			}
			if (g.length > this.nInputChars && Object.keys(this.aSuggestions).length && this.options.cache) {
				var m = {};
				for (var l = 0; l < Object.keys(this.aSuggestions).length; l++) {
					var o = Object.keys(this.aSuggestions)[l];
					var h = [];
					for (var k = 0; k < this.aSuggestions[o].length; k++) {
						var e = this.aSuggestions[o][k];
						if (e.value.substr(0, g.length).toLowerCase() == g) {
							h.push(e)
						}
					}
					if (h.length) {
						m[o] = n
					}
				}
				this.sInput = g;
				this.nInputChars = g.length;
				this.aSuggestions = m;
				for (var l = 0; l < sources.length; l++) {
					var d = sources[l];
					var n = this.aSuggestions[d.id];
					if (n) {
						this.createList(n, d)
					}
				}
				return false
			} else {
				this.sInput = g;
				this.nInputChars = g.length;
				this.prepareContainer();
				this.latestRequest++;
				var c = this;
				var f = this.latestRequest;
				clearTimeout(this.ajID);
				this.container.select(".hide-button-wrapper").invoke("hide");
				this.ajID = setTimeout(function () {
					c.doAjaxRequests(f)
				}, this.options.delay)
			}
			return false
		}, doAjaxRequests: function (f, d) {
			if (this.fld.value.length < this.options.minchars) {
				return
			}
			for (var c = 0; c < this.sources.length; c++) {
				var e = this.sources[c];
				if (typeof e.script == "function") {
					this.fld.addClassName("loading");
					e.script(this.fld.value.strip(), function (g) {
						if (f == this.latestRequest) {
							this.aSuggestions[e.id] = g || [];
							g && this.createList(this.aSuggestions[e.id], e);
							this.fld.removeClassName("loading")
						}
					}.bind(this))
				} else {
					this.doAjaxRequest(e, f, d)
				}
			}
		}, doAjaxRequest: function (f, g, e) {
			var d = f.script + (f.script.indexOf("?") < 0 ? "?" : "&") + f.varname + "=" + encodeURIComponent(this.fld.value.strip());
			var i = f.method || "get";
			var h = {};
			if (f.json) {
				h.Accept = "application/json"
			} else {
				h.Accept = "application/xml"
			}
			var c = {method: i, requestHeaders: h, onCreate: this.fld.addClassName.bind(this.fld, "loading"), onSuccess: this.setSuggestions.bindAsEventListener(this, f, g), onFailure: function (j) {
				new b.widgets.Notification("Failed to retrieve suggestions: " + j.statusText, "error", {timeout: 5})
			}, onComplete: this.fld.removeClassName.bind(this.fld, "loading")};
			c.defaultValues = Object.clone(c);
			new Ajax.Request(d, Object.extend(c, e || {}))
		}, setSuggestions: function (d, e, f) {
			if (f < this.latestRequest) {
				return
			}
			var c = this.parseResponse(d, e);
			this.aSuggestions[e.id] = c || [];
			c && this.createList(this.aSuggestions[e.id], e)
		}, _getNestedProperty: function (e, d) {
			var c = d.split(".");
			while (c.length && (e = e[c.shift()])) {
			}
			return c.length > 0 ? null : e
		}, parseResponse: function (h, j) {
			var d = [];
			if (j.json) {
				var k = h.responseJSON;
				if (!k) {
					return null
				}
				if (Object.isArray(k)) {
					var g = k
				} else {
					var g = this._getNestedProperty(k, j.resultsParameter || this.options.resultsParameter)
				}
				for (var f = 0; f < g.length; f++) {
					var c = g[f];
					d.push({id: this._getNestedProperty(c, j.resultId || this.options.resultId), value: this._getNestedProperty(c, j.resultValue || this.options.resultValue), info: this._getNestedProperty(c, j.resultInfo || this.options.resultInfo), icon: this._getNestedProperty(c, j.resultIcon || this.options.resultIcon), hint: this._getNestedProperty(c, j.resultHint || this.options.resultHint), type: this._getNestedProperty(c, j.resultType || this.options.resultType)})
				}
			} else {
				var e = h.responseXML;
				var g = e.getElementsByTagName(j.resultsParameter || this.options.resultsParameter)[0].childNodes;
				for (var f = 0; f < g.length; f++) {
					if (g[f].hasChildNodes()) {
						d.push({id: g[f].getAttribute("id"), value: g[f].childNodes[0].nodeValue, info: g[f].getAttribute("info"), icon: g[f].getAttribute("icon"), hint: g[f].getAttribute("hint"), type: g[f].getAttribute("type")})
					}
				}
			}
			return d
		}, prepareContainer: function () {
			if (!$(this.options.parentContainer).down(".suggestItems")) {
				var m = new Element("div", {"class": "suggestItems " + this.options.className});
				var g = $(this.options.parentContainer).tagName.toLowerCase() == "body" ? this.fld.cumulativeOffset() : this.fld.positionedOffset();
				var j = this.fld.offsetWidth - 2;
				var l = this.options.width || j;
				var c = this.fld.viewportOffset().left;
				var e = $("body").getWidth();
				if (this.options.align == "left" || (this.options.align == "auto" && c + this.options.width < e)) {
					m.style.left = g.left + "px"
				} else {
					if (this.options.align == "center") {
						m.style.left = g.left + (j - l) / 2 + "px"
					} else {
						m.style.left = (g.left + j - l) + "px"
					}
				}
				m.style.top = (g.top + this.fld.offsetHeight + this.options.offsety) + "px";
				m.style[this.options.width ? "width" : "minWidth"] = l + "px";
				var p = this;
				m.onmouseover = function () {
					p.killTimeout()
				};
				m.onmouseout = function () {
					p.resetTimeout()
				};
				this.resultContainer = new Element("div", {"class": "resultContainer"});
				m.appendChild(this.resultContainer);
				$(this.options.parentContainer).insert(m);
				this.container = m;
				if (this.options.insertBeforeSuggestions) {
					this.resultContainer.insert(this.options.insertBeforeSuggestions)
				}
				document.fire("xwiki:suggest:containerCreated", {container: this.container, suggest: this})
			}
			if (this.isInMultiSourceMode) {
				for (var r = 0; r < this.sources.length; r++) {
					var o = this.sources[r];
					o.id = o.id || r;
					if (this.resultContainer.down(".results" + o.id)) {
						if (this.resultContainer.down(".results" + o.id).down("ul")) {
							this.resultContainer.down(".results" + o.id).down("ul").remove()
						}
						if (!this.options.unifiedLoader) {
							this.resultContainer.down(".results" + o.id).down(".sourceContent").addClassName("loading")
						} else {
							(this.options.loaderNode || this.fld).addClassName("loading");
							this.resultContainer.down(".results" + o.id).addClassName("hidden").addClassName("loading")
						}
					} else {
						var f = new Element("div", {"class": "results results" + o.id}), h = new Element("div", {"class": "sourceName"});
						if (this.options.unifiedLoader) {
							f.addClassName("hidden").addClassName("loading")
						}
						if (typeof o.icon != "undefined") {
							var d = new Image();
							d.onload = function () {
								this.sourceHeader.setStyle({backgroundImage: "url(" + this.iconImage.src + ")"});
								this.sourceHeader.setStyle({textIndent: (this.iconImage.width + 6) + "px"})
							}.bind({sourceHeader: h, iconImage: d});
							d.src = o.icon
						}
						h.insert(o.name);
						f.insert(h);
						var t = "sourceContent " + (this.options.unifiedLoader ? "" : "loading");
						f.insert(new Element("div", {"class": t}));
						if (typeof o.before !== "undefined") {
							this.resultContainer.insert(o.before)
						}
						this.resultContainer.insert(f);
						if (typeof o.after !== "undefined") {
							this.resultContainer.insert(o.after)
						}
					}
				}
			} else {
				if (this.resultContainer.down("ul")) {
					this.resultContainer.down("ul").remove()
				}
			}
			var n = typeof this.options.hideButton !== "undefined" && typeof this.options.hideButton.positions === "object" && this.options.hideButton.positions.length > 0;
			if (n && !this.container.down(".hide-button")) {
				var k = this.options.hideButton.positions;
				for (var r = 0; r < k.length; r++) {
					var u = new Element("span", {"class": "hide-button"}).update(this.options.hideButton.text), q = {};
					q[k[r]] = new Element("div", {"class": "hide-button-wrapper"}).update(u);
					u.observe("click", this.clearSuggestions.bindAsEventListener(this));
					this.container.insert(q)
				}
			}
			var s = this.container.fire("xwiki:suggest:containerPrepared", {container: this.container, suggest: this});
			return this.container
		}, createList: function (c, d) {
			this._createList(c, d);
			if (!this.isInMultiSourceMode || !this.resultContainer.down(".results.loading")) {
				document.fire("xwiki:suggest:updated", {container: this.container, suggest: this})
			}
		}, _createList: function (f, d) {
			this.isActive = true;
			var c = this;
			this.killTimeout();
			if (this.isInMultiSourceMode) {
				var j = this.resultContainer.down(".results" + d.id);
				j.removeClassName("loading");
				j.down(".sourceContent").removeClassName("loading");
				(f.length > 0 || this.options.shownoresults) && j.removeClassName("hidden");
				if (this.options.unifiedLoader && !this.resultContainer.down(".results.loading")) {
					(this.options.loaderNode || this.fld).removeClassName("loading")
				}
			} else {
				var j = this.resultContainer
			}
			if (f.length == 0 && !this.options.shownoresults) {
				return false
			}
			j.down("ul") && j.down("ul").remove();
			this.container.select(".hide-button-wrapper").invoke("show");
			var h = new b.widgets.XList([], {icon: this.options.icon, classes: "suggestList", eventListeners: {click: function (i) {
				c.setHighlightedValue(i);
				return false
			}, mouseover: function () {
				c.setHighlight(this.getElement())
			}}});
			for (var e = 0, g = f.length; e < g; e++) {
				var m = function (i) {
					return((i || "") + "").escapeHTML()
				};
				var k = new Element("div").insert(new Element("span", {"class": "suggestId"}).update(m(f[e].id))).insert(new Element("span", {"class": "suggestValue"}).update(m(f[e].value))).insert(new Element("span", {"class": "suggestInfo"}).update(m(f[e].info)));
				var l = new b.widgets.XListItem(this.createItemDisplay(f[e], d), {containerClasses: "suggestItem " + (f[e].type || ""), value: k, noHighlight: true});
				h.addItem(l)
			}
			if (f.length == 0) {
				h.addItem(new b.widgets.XListItem(this.options.noresults, {classes: "noSuggestion", noHighlight: true}))
			}
			j.appendChild(h.getElement());
			this.suggest = j;
			var c = this;
			if (this.options.timeout > 0) {
				this.toID = setTimeout(function () {
					c.clearSuggestions()
				}, this.options.timeout)
			}
		}, createItemDisplay: function (g, c) {
			var h = this.sInput ? this.sInput.escapeHTML() : this.sInput;
			var k = ((g.value || "") + "").escapeHTML();
			var e = c.highlight ? this.emphasizeMatches(h, k) : k;
			if (g.hint) {
				var d = (g.hint + "").escapeHTML();
				e += "<span class='hint'>" + d + "</span>"
			}
			if (!this.options.displayValue) {
				var j = new Element("span", {"class": "info"}).update(e)
			} else {
				var i = ((g.info || "") + "").escapeHTML();
				var j = new Element("div").insert(new Element("div", {"class": "value"}).update(e)).insert(new Element("div", {"class": "info"}).update("<span class='legend'>" + this.options.displayValueText + "</span>" + i))
			}
			if (g.icon) {
				if (g.icon.indexOf(".") >= 0 || g.icon.indexOf("/") >= 0) {
					var f = new Element("img", {src: g.icon, "class": "icon"})
				} else {
					var f = new Element("i", {"class": "icon " + g.icon})
				}
				j.insert({top: f})
			}
			return j
		}, emphasizeMatches: function (k, m) {
			if (!k) {
				return m
			}
			var c = m, i = k.split(" ").uniq().compact(), d = 0, g = {};
			for (var e = 0, n = i.length; e < n; e++) {
				var h = c.toLowerCase().indexOf(i[e].toLowerCase());
				while (h >= 0) {
					var f = c.substring(h, h + i[e].length), l = "";
					i[e].length.times(function () {
						l += " "
					});
					g[h] = f;
					c = c.substring(0, h) + l + c.substring(h + i[e].length);
					h = c.toLowerCase().indexOf(i[e].toLowerCase())
				}
			}
			Object.keys(g).sortBy(function (j) {
				return parseInt(j)
			}).each(function (j) {
				var o = c.substring(0, parseInt(j) + d);
				var p = c.substring(parseInt(j) + g[j].length + d);
				c = o + "<em>" + g[j] + "</em>" + p;
				d += 9
			});
			return c
		}, changeHighlight: function (c) {
			var f = this.resultContainer;
			if (!f) {
				return false
			}
			var g, d;
			if (this.iHighlighted) {
				if (c == Event.KEY_DOWN) {
					d = this.iHighlighted.next();
					if (!d && this.iHighlighted.up("div.results")) {
						var e = this.iHighlighted.up("div.results").next();
						while (e && !d) {
							d = e.down("li");
							e = e.next()
						}
					}
					if (!d) {
						d = f.down("li")
					}
				} else {
					if (c == Event.KEY_UP) {
						d = this.iHighlighted.previous();
						if (!d && this.iHighlighted.up("div.results")) {
							var e = this.iHighlighted.up("div.results").previous();
							while (e && !d) {
								d = e.down("li:last-child");
								e = e.previous()
							}
						}
						if (!d) {
							d = f.select("ul")[f.select("ul").length - 1].down("li:last-child")
						}
					}
				}
			} else {
				if (c == Event.KEY_DOWN) {
					if (f.down("div.results")) {
						d = f.down("div.results").down("li")
					} else {
						d = f.down("li")
					}
				} else {
					if (c == Event.KEY_UP) {
						if (f.select("li") > 0) {
							d = f.select("li")[f.select("li").length - 1]
						}
					}
				}
			}
			if (d) {
				this.setHighlight(d)
			}
		}, setHighlight: function (c) {
			if (this.iHighlighted) {
				this.clearHighlight()
			}
			c.addClassName("xhighlight");
			this.iHighlighted = c;
			this.killTimeout()
		}, clearHighlight: function () {
			if (this.iHighlighted) {
				this.iHighlighted.removeClassName("xhighlight");
				delete this.iHighlighted
			}
		}, highlightFirst: function () {
			if (this.suggest && this.suggest.down("ul")) {
				var c = this.suggest.down("ul").down("li");
				if (c) {
					this.setHighlight(c)
				}
			}
		}, hasActiveSelection: function () {
			return this.iHighlighted
		}, setHighlightedValue: function (c) {
			if (this.iHighlighted && !this.iHighlighted.hasClassName("noSuggestion")) {
				var m = function (i) {
					return i.textContent || i.innerText
				};
				var j = this.iHighlighted.down("img.icon");
				var f = {suggest: this, id: m(this.iHighlighted.down(".suggestId")), value: m(this.iHighlighted.down(".suggestValue")), info: m(this.iHighlighted.down(".suggestInfo")), icon: j ? j.src : "", originalEvent: c};
				var k, l;
				if (this.sInput == "" && this.fld.value == "") {
					k = l = f.value
				} else {
					if (this.seps) {
						var d = -1;
						for (var g = 0; g < this.seps.length; g++) {
							if (this.fld.value.lastIndexOf(this.seps.charAt(g)) > d) {
								d = this.fld.value.lastIndexOf(this.seps.charAt(g))
							}
						}
						if (d == -1) {
							k = l = f.value
						} else {
							l = this.fld.value.substring(0, d + 1) + f.value;
							k = l.substring(d + 1)
						}
					} else {
						k = l = f.value
					}
				}
				var c = Event.fire(this.fld, "xwiki:suggest:selected", Object.clone(f));
				if (!c.stopped) {
					this.sInput = k;
					this.fld.value = l;
					this.fld.focus();
					this.clearSuggestions();
					typeof this.options.callback == "function" && this.options.callback(Object.clone(f));
					if (this.fld.id.indexOf("_suggest") > 0) {
						var e = this.fld.id.substring(0, this.fld.id.indexOf("_suggest"));
						var h = $(e);
						if (h) {
							h.value = f.info
						}
					}
				}
			}
		}, killTimeout: function () {
			clearTimeout(this.toID)
		}, resetTimeout: function () {
			clearTimeout(this.toID);
			var c = this;
			this.toID = setTimeout(function () {
				c.clearSuggestions()
			}, 1000)
		}, clearSuggestions: function () {
			this.clearHighlight();
			this.killTimeout();
			this.isActive = false;
			var c = $(this.container);
			var e = this;
			if (c && c.parentNode) {
				if (this.options.fadeOnClear) {
					var d = new Effect.Fade(c, {duration: "0.25", afterFinish: function () {
						if ($(e.container)) {
							$(e.container).remove()
						}
					}})
				} else {
					$(this.container).remove()
				}
				document.fire("xwiki:suggest:clearSuggestions", {suggest: this})
			}
		}, detach: function () {
			if (this.fld) {
				Event.stopObserving(this.fld, "keyup", this.onKeyUp);
				if (Prototype.Browser.IE || Prototype.Browser.WebKit) {
					Event.stopObserving(this.fld, "keydown", this.onKeyPress)
				} else {
					Event.stopObserving(this.fld, "keypress", this.onKeyPress)
				}
				this.clearSuggestions();
				this.fld.__x_suggest = null;
				this.fld.setAttribute("autocomplete", "on")
			}
		}})
	}
	return b
})(XWiki || {});
