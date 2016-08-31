var PhenoTips = (function (b) {
	var a = b.widgets = b.widgets || {};
	if (typeof XWiki.widgets.XList == "undefined") {
		if (typeof console != "undefined" && typeof console.warn == "function") {
			console.warn("[Suggest widget] Required class missing: XWiki.widgets.XList")
		}
	} else {
		a.XList = XWiki.widgets.XList;
		a.XListItem = XWiki.widgets.XListItem;
		a.Suggest = Class.create({options: {minchars: 1, method: "get", varname: "input", className: "ajaxsuggest", timeout: 2500, delay: 500, offsety: 0, shownoresults: true, noresults: "No results!", maxheight: 250, cache: false, seps: "", icon: null, resultsParameter: "results", resultId: "id", resultValue: "value", resultInfo: "info", resultCategory: "category", resultAltName: "", resultIcon: "icon", resultHint: "hint", tooltip: false, highlight: true, fadeOnClear: true, enableHideButton: true, insertBeforeSuggestions: null, displayId: false, displayValue: false, displayValueText: "Value :", align: "left", unifiedLoader: false, loaderNode: null, filterFunc: null}, sInput: "", nInputChars: 0, aSuggestions: [], iHighlighted: null, isActive: false, initialize: function (c, d) {
			if (!c) {
				return false
			}
			this.setInputField(c);
			this.options = Object.extend(Object.clone(this.options), d || {});
			if (typeof this.options.sources == "object" && this.options.sources.length > 1) {
				this.sources = this.options.sources
			} else {
				this.sources = this.options
			}
			this.sources = [this.sources].flatten().compact();
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
			if (this.fld) {
				this.fld.stopObserving()
			}
			this.fld = $(c);
			this.fld._suggestWidget = this;
			this.fld.observe("keyup", this.onKeyUp.bindAsEventListener(this));
			if (Prototype.Browser.IE || Prototype.Browser.WebKit) {
				this.fld.observe("keydown", this.onKeyPress.bindAsEventListener(this))
			} else {
				this.fld.observe("keypress", this.onKeyPress.bindAsEventListener(this))
			}
			this.fld.observe("paste", this.onPaste.bindAsEventListener(this));
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
		}, onPaste: function (c) {
			setTimeout(function () {
				this.onKeyUp({keyCode: null})
			}.bind(this), 0)
		}, onKeyPress: function (d) {
			if (!$(this.isActive)) {
				if (d.keyCode == Event.KEY_RETURN) {
					Event.stop(d)
				}
				return
			}
			var c = d.keyCode;
			switch (c) {
				case Event.KEY_RETURN:
					this.setHighlightedValue();
					Event.stop(d);
					break;
				case Event.KEY_ESC:
					this.clearSuggestions();
					Event.stop(d);
					break;
				case Event.KEY_UP:
					this.changeHighlight(c);
					Event.stop(d);
					break;
				case Event.KEY_DOWN:
					this.changeHighlight(c);
					Event.stop(d);
					break;
				default:
					break
			}
		}, getSuggestions: function (g) {
			g = g.strip().toLowerCase();
			if (g == this.sInput && g.length > 1) {
				return false
			}
			if (g.length == 0) {
				this.sInput = "";
				this.clearSuggestions();
				return false
			}
			if (g.length < this.options.minchars) {
				this.sInput = "";
				return false
			}
			if (g.length > this.nInputChars && this.aSuggestions.length && this.options.cache) {
				var c = [];
				for (var d = 0; d < this.aSuggestions.length; d++) {
					if (this.aSuggestions[d].value.substr(0, g.length).toLowerCase() == g) {
						c.push(this.aSuggestions[d])
					}
				}
				this.sInput = g;
				this.nInputChars = g.length;
				this.aSuggestions = c;
				this.createList(this.aSuggestions);
				return false
			} else {
				this.sInput = g;
				this.nInputChars = g.length;
				this.prepareContainer();
				this.latestRequest++;
				var f = this;
				var e = this.latestRequest;
				clearTimeout(this.ajID);
				this.ajID = setTimeout(function () {
					f.doAjaxRequests(e)
				}, this.options.delay)
			}
			return false
		}, doAjaxRequests: function (f) {
			if (this.fld.value.length < this.options.minchars) {
				return
			}
			for (var h = 0; h < this.sources.length; h++) {
				var d = this.sources[h];
				var k = this.fld.value.strip();
				var l = {};
				if (this.options.queryProcessor != null && typeof(this.options.queryProcessor.generateParameters) == "function") {
					l = this.options.queryProcessor.generateParameters(k)
				}
				if (this.options.queryProcessor != null && typeof(this.options.queryProcessor.processQuery) == "function") {
					k = this.options.queryProcessor.processQuery(k)
				}
				var e = d.script + d.varname + "=" + encodeURIComponent(k);
				var c = d.method || "get";
				var g = {};
				if (d.json) {
					g.Accept = "application/json"
				} else {
					g.Accept = "application/xml"
				}
				var m = new Ajax.Request(e, {method: c, parameters: l, requestHeaders: g, onCreate: function () {
					this.fld.addClassName("loading")
				}.bind(this), onSuccess: this.setSuggestions.bindAsEventListener(this, d, f), onFailure: function (n) {
					alert("Failed to retrieve suggestions : " + n.statusText)
				}, onComplete: function () {
					if (f < this.latestRequest) {
						return
					}
					this.fld.removeClassName("loading")
				}.bind(this)})
			}
		}, setSuggestions: function (c, d, e) {
			if (e < this.latestRequest) {
				return
			}
			this.aSuggestions = this.getSuggestionList(c, d);
			this.createList(this.aSuggestions, d)
		}, getSuggestionList: function (d, u) {
			var B = [];
			if (u && u.json) {
				var C = d.responseJSON;
				if (!C) {
					return false
				}
				var t = C[u.resultsParameter || this.options.resultsParameter];
				var e = function (k, E) {
					return k && k[E] || ""
				};
				var n = function (k, E) {
					return new Array(k && k[E] || "").flatten()
				}
			} else {
				var h = d.responseXML;
				if (!h) {
					return false
				}
				var t = h.getElementsByTagName((u && u.resultsParameter) || this.options.resultsParameter);
				var e = function (F, k) {
					var E = F && Element.down(F, k);
					return E && E.firstChild && E.firstChild.nodeValue || ""
				};
				var n = function (F, E) {
					var k = new Array();
					if (F) {
						Element.select(F, E).each(function (G) {
							var H = G.firstChild && G.firstChild.nodeValue;
							if (H) {
								k.push(H)
							}
						})
					}
					return k
				}
			}
			var r = function (k) {
				if (k) {
					return"&#x25B8;"
				}
				return"&#x25BE;"
			};
			for (var z = 0; z < t.length; z++) {
				var A = new Element("dl");
				for (var l in this.options.resultInfo) {
					var g = this.options.resultInfo[l];
					sectionClass = l.strip().toLowerCase().replace(/[^a-z0-9 ]/gi, "").replace(/\s+/gi, "-");
					var w = "";
					if (g.collapsed) {
						w = "collapsed"
					}
					var f = g.processor;
					if (g.extern) {
						var p = new Element("a").update(l);
						p._processingFunction = f;
						A.insert({bottom: new Element("dt", {"class": w + " " + sectionClass}).insert({bottom: p})});
						p._processingFunction.call(this, p);
						continue
					}
					var y = g.selector;
					if (!y) {
						continue
					}
					var s = null;
					n(t[z], y).each(function (E) {
						var F = E || "";
						if (typeof(f) == "function") {
							F = f(F)
						}
						if (F == "") {
							return
						}
						if (!s) {
							var k = new Element("a", {"class": "expand-tool"}).update(r(g.collapsed));
							A.insert({bottom: new Element("dt", {"class": w}).insert({top: k}).insert({bottom: l})});
							s = new Element("dd", {"class": "expandable"});
							A.insert({bottom: s});
							k.observe("click", function (G) {
								G.stop();
								k.up().toggleClassName("collapsed");
								k.update(r(k.up().hasClassName("collapsed")))
							}.bindAsEventListener(this))
						}
						s.insert({bottom: new Element("div").update(F)})
					})
				}
				if (!A.hasChildNodes()) {
					A = ""
				}
				if (this.options.resultCategory) {
					var v = new Element("span", {"class": "hidden term-category"});
					n(t[z], this.options.resultCategory).each(function (k) {
						v.insert(new Element("input", {type: "hidden", value: k}))
					})
				}
				if (!this.options.resultCategory || !v.hasChildNodes()) {
					v = ""
				}
				if (this.options.resultAltName) {
					var q = "";
					var D = e(t[z], u.resultValue || this.options.resultValue);
					var o = n(t[z], u.resultAltName || this.options.resultAltName);
					var c = this.computeSimilarity(D, this.sInput);
					for (var x = 0; x < o.length; ++x) {
						var m = this.computeSimilarity(o[x], this.sInput);
						if (m > c) {
							q = o[x];
							c = m
						}
					}
				}
				B.push({id: e(t[z], u.resultId || this.options.resultId), value: e(t[z], u.resultValue || this.options.resultValue), icon: e(t[z], u.resultIcon || this.options.resultIcon), altName: q, info: A, category: v})
			}
			return B
		}, computeSimilarity: function (l, h) {
			var e;
			var g = 0;
			var k = 2;
			var q = l;
			var f = q.length;
			var p = h;
			var c = p.length;
			var o = new Array();
			for (i = 0; i < c; i++) {
				o[i] = new Array();
				e = (q.charAt(i) == p.charAt(0)) ? 1 : -1;
				if (i == 0) {
					o[0][0] = Math.max(0, -k, e)
				} else {
					o[i][0] = Math.max(0, o[i - 1][0] - k, e)
				}
				if (o[i][0] > g) {
					g = o[i][0]
				}
			}
			for (j = 0; j < f; j++) {
				e = (q.charAt(0) == p.charAt(j)) ? 1 : -1;
				if (j == 0) {
					o[0][0] = Math.max(0, -k, e)
				} else {
					o[0][j] = Math.max(0, o[0][j - 1] - k, e)
				}
				if (o[0][j] > g) {
					g = o[0][j]
				}
			}
			for (i = 1; i < c; i++) {
				for (j = 1; j < f; j++) {
					e = (q.charAt(i) == p.charAt(j)) ? 1 : -1;
					o[i][j] = Math.max(0, o[i - 1][j] - k, o[i][j - 1] - k, o[i - 1][j - 1] + e);
					if (o[i][j] > g) {
						g = o[i][j]
					}
				}
			}
			return g
		}, prepareContainer: function () {
			var n = $(this.options.parentContainer).down(".suggestItems");
			if (n && n.__targetField != this.fld) {
				if (n.__targetField) {
					n.__targetField._suggest.clearSuggestions()
				} else {
					n.remove()
				}
				n = false
			}
			if (!n) {
				var e = new Element("div", {"class": "suggestItems " + this.options.className});
				var m = $(this.options.parentContainer).tagName.toLowerCase() == "body" ? this.fld.cumulativeOffset() : this.fld.positionedOffset();
				var p = this.options.width ? this.options.width : (this.fld.offsetWidth - 2);
				if (this.options.align == "left") {
					e.style.left = m.left + "px"
				} else {
					if (this.options.align == "center") {
						e.style.left = m.left + (this.fld.getWidth() - p - 2) / 2 + "px"
					} else {
						e.style.left = (m.left - p + this.fld.offsetWidth - 2) + "px"
					}
				}
				e.style.top = (m.top + this.fld.offsetHeight + this.options.offsety) + "px";
				e.style.width = p + "px";
				var c = this;
				e.onmouseover = function () {
					c.killTimeout()
				};
				e.onmouseout = function () {
					c.resetTimeout()
				};
				this.resultContainer = new Element("div", {"class": "resultContainer"});
				e.appendChild(this.resultContainer);
				$(this.options.parentContainer).insert(e);
				this.container = e;
				if (this.options.insertBeforeSuggestions) {
					this.resultContainer.insert(this.options.insertBeforeSuggestions)
				}
				document.fire("ms:suggest:containerCreated", {container: this.container, suggest: this})
			}
			if (this.sources.length > 1) {
				for (var g = 0; g < this.sources.length; g++) {
					var d = this.sources[g];
					d.id = g;
					if (this.resultContainer.down(".results" + d.id)) {
						if (this.resultContainer.down(".results" + d.id).down("ul")) {
							this.resultContainer.down(".results" + d.id).down("ul").remove()
						}
						if (!this.options.unifiedLoader) {
							this.resultContainer.down(".results" + d.id).down(".sourceContent").addClassName("loading")
						} else {
							(this.options.loaderNode || this.fld).addClassName("loading");
							this.resultContainer.down(".results" + d.id).addClassName("hidden loading")
						}
					} else {
						var q = new Element("div", {"class": "results results" + d.id}), o = new Element("div", {"class": "sourceName"});
						if (this.options.unifiedLoader) {
							q.addClassName("hidden loading")
						}
						if (typeof d.icon != "undefined") {
							var l = new Image();
							l.onload = function () {
								this.sourceHeader.setStyle({backgroundImage: "url(" + this.iconImage.src + ")"});
								this.sourceHeader.setStyle({textIndent: (this.iconImage.width + 6) + "px"})
							}.bind({sourceHeader: o, iconImage: l});
							l.src = d.icon
						}
						o.insert(d.name);
						q.insert(o);
						var f = "sourceContent " + (this.options.unifiedLoader ? "" : "loading");
						q.insert(new Element("div", {"class": f}));
						if (typeof d.before !== "undefined") {
							this.resultContainer.insert(d.before)
						}
						this.resultContainer.insert(q);
						if (typeof d.after !== "undefined") {
							this.resultContainer.insert(d.after)
						}
					}
				}
			} else {
				if (this.resultContainer.down("ul")) {
					this.resultContainer.down("ul").remove()
				}
			}
			var k = this.container.fire("ms:suggest:containerPrepared", {container: this.container, suggest: this});
			this.container.__targetField = this.fld;
			if (this.options.enableHideButton && !this.container.down(".hide-button")) {
				var h = new Element("span", {"class": "hide-button"}).update("hide suggestions");
				h.observe("click", this.clearSuggestions.bindAsEventListener(this));
				this.container.insert({top: new Element("div", {"class": "hide-button-wrapper"}).update(h)});
				h = new Element("span", {"class": "hide-button"}).update("hide suggestions");
				h.observe("click", this.clearSuggestions.bindAsEventListener(this));
				this.container.insert({bottom: new Element("div", {"class": "hide-button-wrapper"}).update(h)})
			}
			return this.container
		}, createList: function (c, e) {
			this.isActive = true;
			var f = this;
			this.killTimeout();
			this.clearHighlight();
			if (this.sources.length > 1) {
				var g = this.resultContainer.down(".results" + e.id);
				if (c.length > 0 || this.options.shownoresults) {
					g.down(".sourceContent").removeClassName("loading");
					this.resultContainer.down(".results" + e.id).removeClassName("hidden loading")
				}
				if (this.options.unifiedLoader && !this.resultContainer.down("loading")) {
					(this.options.loaderNode || this.fld).removeClassName("loading")
				}
			} else {
				var g = this.resultContainer
			}
			if (c.length == 0 && !this.options.shownoresults) {
				return false
			}
			if (g.down("ul")) {
				g.down("ul").remove()
			}
			var d = this.createListElement(c, f);
			g.appendChild(d);
			Event.fire(document, "xwiki:dom:updated", {elements: [d]});
			this.suggest = g;
			var f = this;
			if (this.options.timeout > 0) {
				this.toID = setTimeout(function () {
					f.clearSuggestions()
				}, this.options.timeout)
			}
			this.highlightFirst()
		}, createListElement: function (f, c) {
			var h = new b.widgets.XList([], {icon: this.options.icon, classes: "suggestList", eventListeners: {click: function () {
				c.setHighlightedValue();
				return false
			}, mouseover: function () {
				c.setHighlight(this.getElement())
			}}});
			for (var e = 0, g = f.length; e < g; e++) {
				if (!this.options.filterFunc || this.options.filterFunc(f[e])) {
					h.addItem(this.generateListItem(f[e]))
				}
			}
			if (f.length == 0) {
				h.addItem(new b.widgets.XListItem(this.options.noresults, {classes: "noSuggestion", noHighlight: true}))
			}
			if (this.fld.hasClassName("accept-value")) {
				var m = this.fld.value.replace(/[^a-z0-9_]+/gi, "_");
				var k = this.fld.next('input[name="_category"]');
				var n = k && k.value.split(",") || [];
				var d = new Element("div", {"class": "hidden term-category"});
				var l = this.fld.name + "__" + m + "__category";
				n.each(function (o) {
					if (o) {
						d.insert(new Element("input", {type: "hidden", name: l, value: o}))
					}
				});
				h.addItem(this.generateListItem({id: this.fld.value, value: this.fld.value, category: d, info: new Element("div", {"class": "hint"}).update("(your text, not a standard term)")}, "custom-value", true))
			}
			return h.getElement()
		}, generateListItem: function (k, d, l) {
			var f = new Element("div", {"class": "tooltip-" + this.options.tooltip});
			if (k.icon) {
				f.insert(new Element("img", {src: k.icon, "class": "icon"}))
			}
			if (this.options.displayId) {
				f.insert(new Element("span", {"class": "suggestId"}).update(k.id.escapeHTML()))
			}
			f.insert(new Element("span", {"class": "suggestValue"}).update(k.value.escapeHTML()));
			if (this.options.tooltip && !l) {
				var e = new Element("span", {"class": "fa fa-info-circle xHelpButton " + this.options.tooltip, title: k.id});
				e.observe("click", function (m) {
					m.stop()
				});
				f.insert(" ").insert(e)
			}
			var h = new Element("div", {"class": "suggestInfo"}).update(k.info);
			f.insert(h);
			if (k.altName) {
				h.insert({top: new Element("span", {"class": "matching-alternative-name"}).update(k.altName.escapeHTML())})
			}
			var c = new Element("div").insert(new Element("span", {"class": "suggestId"}).update(k.id.escapeHTML())).insert(new Element("span", {"class": "suggestValue"}).update(k.value.escapeHTML())).insert(new Element("div", {"class": "suggestCategory"}).update(k.category));
			c.store("itemData", k);
			var g = new b.widgets.XListItem(f, {containerClasses: "suggestItem " + (d || ""), value: c, noHighlight: true});
			Event.fire(this.fld, "ms:suggest:suggestionCreated", {element: g.getElement(), suggest: this});
			return g
		}, emphasizeMatches: function (l, n) {
			var c = n, k = l.split(" ").uniq().compact(), d = 0, g = {};
			for (var e = 0, o = k.length; e < o; e++) {
				var h = c.toLowerCase().indexOf(k[e].toLowerCase());
				while (h >= 0) {
					var f = c.substring(h, h + k[e].length), m = "";
					k[e].length.times(function () {
						m += " "
					});
					g[h] = f;
					c = c.substring(0, h) + m + c.substring(h + k[e].length);
					h = c.toLowerCase().indexOf(k[e].toLowerCase())
				}
			}
			Object.keys(g).sortBy(function (p) {
				return parseInt(p)
			}).each(function (p) {
				var q = c.substring(0, parseInt(p) + d);
				var r = c.substring(parseInt(p) + g[p].length + d);
				c = q + "<em>" + g[p] + "</em>" + r;
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
		}, setHighlightedValue: function () {
			if (this.iHighlighted && !this.iHighlighted.hasClassName("noSuggestion")) {
				var e, c;
				if (this.sInput == "" && this.fld.value == "") {
					e = c = this.iHighlighted.down(".suggestValue").innerHTML
				} else {
					if (this.seps) {
						var f = -1;
						for (var d = 0; d < this.seps.length; d++) {
							if (this.fld.value.lastIndexOf(this.seps.charAt(d)) > f) {
								f = this.fld.value.lastIndexOf(this.seps.charAt(d))
							}
						}
						if (f == -1) {
							e = c = this.iHighlighted.down(".suggestValue").innerHTML
						} else {
							c = this.fld.value.substring(0, f + 1) + this.iHighlighted.down(".suggestValue").innerHTML;
							e = c.substring(f + 1)
						}
					} else {
						e = c = this.iHighlighted.down(".suggestValue").innerHTML
					}
				}
				var h = this.iHighlighted.down(".value div").retrieve("itemData");
				var g = {suggest: this, id: h.id || this.iHighlighted.down(".suggestId").innerHTML, value: h.value || this.iHighlighted.down(".suggestValue").innerHTML, info: h.info || this.iHighlighted.down(".suggestInfo").innerHTML, icon: h.icon || (this.iHighlighted.down("img.icon") ? this.iHighlighted.down("img.icon").src : ""), category: this.iHighlighted.down(".suggestCategory").innerHTML};
				this.acceptEntry(g, e, c)
			}
		}, acceptEntry: function (k, g, f, e) {
			var h = Event.fire(this.fld, "ms:suggest:selected", k);
			if (!h.stopped) {
				if (!e) {
					this.sInput = g;
					this.fld.value = f || this.fld.defaultValue || "";
					this.fld.focus();
					this.clearSuggestions()
				}
				if (typeof(this.options.callback) == "function") {
					this.options.callback(k)
				}
				if (this.fld.id.indexOf("_suggest") > 0) {
					var d = this.fld.id.substring(0, this.fld.id.indexOf("_suggest"));
					var c = $(d);
					if (c) {
						c.value = info
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
			}, 1000000)
		}, clearSuggestions: function () {
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
				document.fire("ms:suggest:clearSuggestions", {suggest: this})
			}
		}})
	}
	return b
})(PhenoTips || {});
var PhenoTips = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.SuggestPicker = Class.create({options: {showKey: true, showTooltip: false, showDeleteTool: true, enableSort: true, showClearTool: true, inputType: "hidden", listInsertionElt: null, listInsertionPosition: "after", predefinedEntries: null, acceptFreeText: false}, initialize: function (d, g, c, f) {
		this.options = Object.extend(Object.clone(this.options), c || {});
		this.serializedDataInput = f;
		this.input = d;
		this.suggest = g;
		this.inputName = this.input.name;
		if (!this.options.acceptFreeText) {
			this.input.name = this.input.name + "__suggested"
		} else {
			this.input.addClassName("accept-value")
		}
		this.suggest.options.callback = this.acceptSuggestion.bind(this);
		this.list = new Element("ul", {"class": "accepted-suggestions"});
		var h;
		if (this.options.listInsertionElt) {
			if (typeof(this.options.listInsertionElt) == "string") {
				h = this.input.up().down(this.options.listInsertionElt)
			} else {
				h = this.options.listInsertionElt
			}
		}
		if (!h) {
			h = this.input
		}
		var e = {};
		e[this.options.listInsertionPosition] = this.list;
		h.insert(e);
		this.predefinedEntries = this.options.predefinedEntries ? $(this.options.predefinedEntries) : null;
		if (this.options.showClearTool) {
			this.clearTool = new Element("span", {"class": "clear-tool delete-tool invisible", title: "Clear the list of selected suggestions"}).update("Delete all &#x2716;");
			this.clearTool.observe("click", this.clearAcceptedList.bindAsEventListener(this));
			this.list.insert({after: this.clearTool})
		}
		if (typeof(this.options.onItemAdded) == "function") {
			this.onItemAdded = this.options.onItemAdded
		}
	}, acceptAddItem: function (f, e) {
		var c = 'input[id="' + this.getInputId(f, e).replace(/[^a-zA-Z0-9_-]/g, "\\$&") + '"]';
		var d = this.predefinedEntries ? this.predefinedEntries.down(c) : this.list ? this.list.down(c) : $(this.getInputId(f, e));
		if (d) {
			d.checked = true;
			Event.fire(d, "suggest:change");
			this.synchronizeSelection(d);
			return false
		}
		return true
	}, ensureVisible: function (c, d) {
		if (this.silent || (!d && this.options.silent) || c.up(".hidden")) {
			return
		}
		var e = c.up(".collapsed:not(.force-collapse)");
		while (e) {
			e.removeClassName("collapsed");
			if (e.down(".expand-tool")) {
				e.down(".expand-tool").update("▼")
			}
			e = e.up(".collapsed:not(.force-collapse)")
		}
		if (c.viewportOffset().top > this.input.viewportOffset().top) {
			if (c.viewportOffset().top > document.viewport.getHeight()) {
				if (c.viewportOffset().top - this.input.viewportOffset().top < document.viewport.getHeight()) {
					this.input.scrollTo()
				} else {
					c.scrollTo()
				}
			}
		} else {
			if (c.cumulativeOffset().top < document.viewport.getScrollOffsets().top) {
				c.scrollTo()
			}
		}
	}, acceptSuggestion: function (c) {
		this.input.value = this.input.defaultValue || "";
		if (this.acceptAddItem(c.id || c.value, c.negative)) {
			this.addItem(c.id || c.value, c.value, c.info, c.category)
		}
		return false
	}, addItem: function (m, l, f, e) {
		if (!m) {
			return
		}
		var d = this.getInputId(m);
		var c = new Element("li");
		var n = new Element("label", {"class": "accepted-suggestion", "for": d});
		var g = {type: this.options.inputType, name: this.inputName, id: d, value: m};
		if (this.options.inputType == "checkbox") {
			g.checked = true
		}
		n.insert({bottom: new Element("input", g)});
		if (this.options.showKey) {
			n.insert({bottom: new Element("span", {"class": "key"}).update("[" + m.escapeHTML() + "]")});
			n.insert({bottom: new Element("span", {"class": "sep"}).update(" ")})
		}
		n.insert({bottom: new Element("span", {"class": "value"}).update(l.escapeHTML())});
		c.insert(n);
		if (e && e != "") {
			c.insert(e)
		}
		if (this.options.showDeleteTool) {
			var k = new Element("span", {"class": "delete-tool", title: "Delete this term"}).update("&#x2716;");
			k.observe("click", this.removeItem.bindAsEventListener(this));
			c.appendChild(k)
		}
		if (this.options.showTooltip && f) {
			c.appendChild(new Element("div", {"class": "tooltip"}).update(f));
			c.select(".expand-tool").invoke("observe", "click", function (o) {
				o.stop()
			})
		}
		this.list.insert(c);
		var h = this.list ? this.list.down('input[id="' + d.replace(/[^a-zA-Z0-9_-]/g, "\\$&") + '"]') : $(d);
		this.synchronizeSelection(h);
		h.observe("change", this.synchronizeSelection.bind(this, h));
		this.updateListTools();
		this.onItemAdded(h);
		return h
	}, onItemAdded: function (c) {
	}, removeItem: function (d) {
		var c = d.findElement("li");
		this.synchronizeSelection({value: (c.down("input[type=checkbox]") || c.down("input")).value, checked: false});
		c.remove();
		this.notifySelectionChange(c);
		this.input.value = this.input.defaultValue || "";
		this.updateListTools()
	}, clearAcceptedList: function () {
		var c = this.list.down("li .delete-tool");
		while (c) {
			c.click();
			c = this.list.down("li .delete-tool")
		}
	}, updateListTools: function () {
		if (this.clearTool) {
			if (this.list.select("li .accepted-suggestion").length > 0) {
				this.clearTool.removeClassName("invisible")
			} else {
				this.clearTool.addClassName("invisible")
			}
		}
		if (this.options.enableSort && this.list.select("li .accepted-suggestion").length > 0 && typeof(Sortable) != "undefined") {
			Sortable.create(this.list)
		}
		if (this.serializedDataInput) {
			var c = "";
			this.list.select("li .accepted-suggestion input[type=checkbox]").each(function (d) {
				c += d.value + "|"
			});
			this.serializedDataInput.value = c
		}
	}, getInputId: function (d, c) {
		return(c ? this.inputName.replace(/(_\d+)_/, "$1_negative_") : this.inputName) + "_" + d
	}, synchronizeSelection: function (f) {
		var g = (typeof(f.up) == "function") && f.up("li");
		if (g) {
			if (this.input.hasClassName("generateYesNo") && !f.up(".yes-no-picker")) {
				Element.select(g, 'input[name="fieldName"][type="hidden"]').each(function (o) {
					var m = o.up("li").down('input[type="checkbox"]');
					var l = m.name;
					m.id = m.id.replace(m.name, o.value);
					m.name = o.value;
					m.up("label").addClassName(o.className);
					m.up("label").htmlFor = m.id;
					o.value = l;
					if (o.up(".term-category")) {
						o.up(".term-category").insert({before: o})
					}
				});
				var e = this.input.name.replace(/__suggested$/, "");
				var c = this.input.name.replace(/(_\d+)_/, "$1_negative_").replace(/__suggested$/, "");
				var h = f.value;
				var k = g.down(".value").firstChild.nodeValue;
				var d = YesNoPicker.generatePickerElement([
					{type: "na", selected: !isValueSelected(e, h) && !isValueSelected(c, h)},
					{type: "yes", name: e, selected: isValueSelected(e, h)},
					{type: "no", name: c, selected: isValueSelected(c, h)}
				], h, k, true, f.next());
				f.insert({before: d});
				f.hide();
				f.name = "";
				f.id = "";
				f.value = "";
				enableHighlightChecked(d.down(".yes input"));
				enableHighlightChecked(d.down(".no input"))
			}
		}
		if (g) {
			this.notifySelectionChange(g)
		}
	}, notifySelectionChange: function (c) {
		if (!c.__categoryArray) {
			c.__categoryArray = [];
			Element.select(c, ".term-category input[type=hidden]").each(function (d) {
				c.__categoryArray.push(d.value)
			})
		}
		Event.fire(this.input, "xwiki:form:field-value-changed");
		Event.fire(document, "custom:selection:changed", {categories: c.__categoryArray, trigger: this.input, fieldName: this.inputName, customElement: c})
	}});
	return b
}(PhenoTips || {}));
var PhenoTips = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.ModalPopup = Class.create({options: {idPrefix: "modal-popup-", title: "", displayCloseButton: true, screenColor: "", borderColor: "", titleColor: "", backgroundColor: "", screenOpacity: "0.5", verticalPosition: "center", horizontalPosition: "center", resetPositionOnShow: true, removeOnClose: false, onClose: Prototype.emptyFunction}, initialize: function (e, c, d) {
		this.shortcuts = {show: {method: this.showDialog, keys: []}, close: {method: this.closeDialog, keys: ["Esc"]}}, this.content = e || "Hello world!";
		this.shortcuts = Object.extend(Object.clone(this.shortcuts), c || {});
		this.options = Object.extend(Object.clone(this.options), d || {});
		this.registerShortcuts("show");
		if (typeof(a.ModalPopup.instanceCounter) == "undefined") {
			a.ModalPopup.instanceCounter = 0
		}
		this.id = ++a.ModalPopup.instanceCounter
	}, getBoxId: function () {
		return this.options.idPrefix + this.id
	}, createDialog: function (e) {
		this.dialog = new Element("div", {"class": "msdialog-modal-container"});
		if (this.options.extraDialogClassName) {
			this.dialog.addClassName(this.options.extraDialogClassName)
		}
		this.screen = new Element("div", {"class": "msdialog-screen"}).setStyle({opacity: this.options.screenOpacity, backgroundColor: this.options.screenColor});
		this.dialog.update(this.screen);
		this.dialogBox = new Element("div", {"class": "msdialog-box", id: this.getBoxId()});
		if (this.options.extraClassName) {
			this.dialogBox.addClassName(this.options.extraClassName)
		}
		this.dialogBox._x_contentPlug = new Element("div", {"class": "content"});
		this.dialogBox.update(this.dialogBox._x_contentPlug);
		this.dialogBox._x_contentPlug.update(this.content);
		if (this.options.title) {
			var f = new Element("div", {"class": "msdialog-title"}).update(this.options.title);
			f.setStyle({color: this.options.titleColor, backgroundColor: this.options.borderColor});
			this.dialogBox.insertBefore(f, this.dialogBox.firstChild)
		}
		if (this.options.displayCloseButton) {
			var c = new Element("div", {"class": "msdialog-close", title: "Close"}).update("&#215;");
			c.setStyle({color: this.options.titleColor});
			c.observe("click", this.closeDialog.bindAsEventListener(this));
			this.dialogBox.insertBefore(c, this.dialogBox.firstChild)
		}
		this.dialog.appendChild(this.dialogBox);
		this.dialogBox.setStyle({textAlign: "left", borderColor: this.options.borderColor, backgroundColor: this.options.backgroundColor});
		this.positionDialog();
		document.body.appendChild(this.dialog);
		if (typeof(Draggable) != "undefined") {
			new Draggable(this.getBoxId(), {handle: $(this.getBoxId()).down(".msdialog-title"), scroll: window, change: this.updateScreenSize.bind(this)})
		}
		this.dialog.hide();
		var d = function (g) {
			if (this.dialog.visible()) {
				this.updateScreenSize()
			}
		}.bindAsEventListener(this);
		["resize", "scroll"].each(function (g) {
			Event.observe(window, g, d)
		}.bind(this));
		Event.observe(document, "ms:popup:content-updated", d)
	}, positionDialog: function () {
		switch (this.options.verticalPosition) {
			case"top":
				this.dialogBox.setStyle({top: (document.viewport.getScrollOffsets().top + 6) + "px"});
				break;
			case"bottom":
				this.dialogBox.setStyle({bottom: ".5em"});
				break;
			default:
				this.dialogBox.setStyle({top: "35%"});
				break
		}
		this.dialogBox.setStyle({left: "", right: ""});
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
	}, positionDialogInViewport: function (d, c) {
		this.dialogBox.setStyle({left: (document.viewport.getScrollOffsets().left + d) + "px", top: (document.viewport.getScrollOffsets().top + c) + "px", margin: "0"})
	}, getPositionInViewport: function () {
		return this.dialogBox.viewportOffset()
	}, updateScreenSize: function () {
		var c = function (h, k, e) {
			var l = $(document.documentElement)[k]();
			var g = document.viewport.getScrollOffsets()[e] + document.viewport[k]();
			if (h) {
				var f = h.cumulativeOffset()[e] + h[k]()
			}
			var d = "";
			if (l < g) {
				d = g + "px"
			}
			return d
		};
		this.screen.style.width = c(this.dialogBox, "getWidth", "left");
		this.screen.style.height = c(this.dialogBox, "getHeight", "top")
	}, setClass: function (c) {
		this.dialogBox.addClassName("msdialog-box-" + c)
	}, removeClass: function (c) {
		this.dialogBox.removeClassName("msdialog-box-" + c)
	}, setContent: function (c) {
		this.content = c;
		this.dialogBox._x_contentPlug.update(this.content);
		this.updateScreenSize()
	}, showDialog: function (c) {
		if (c) {
			Event.stop(c)
		}
		if (!this.active) {
			this.active = true;
			if (!this.dialog) {
				this.createDialog()
			}
			this.attachKeyListeners();
			this.dialog.show();
			if (this.options.resetPositionOnShow) {
				this.positionDialog()
			}
			this.updateScreenSize()
		}
	}, onScroll: function (c) {
		this.dialog.setStyle({top: document.viewport.getScrollOffsets().top + "px"})
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
		this.active = false
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
	}, registerShortcuts: function (e) {
		var c = this.shortcuts[e].keys;
		var f = this.shortcuts[e].method;
		for (var d = 0; d < c.size(); ++d) {
			if (Prototype.Browser.IE || Prototype.Browser.WebKit) {
				shortcut.add(c[d], f.bindAsEventListener(this, e), {type: "keyup"})
			} else {
				shortcut.add(c[d], f.bindAsEventListener(this, e), {type: "keypress"})
			}
		}
	}, unregisterShortcuts: function (d) {
		for (var c = 0; c < this.shortcuts[d].keys.size(); ++c) {
			shortcut.remove(this.shortcuts[d].keys[c])
		}
	}, createButton: function (d, f, e, h) {
		var g = new Element("span", {"class": "buttonwrapper"});
		var c = new Element("input", {type: d, "class": "button", value: f, title: e, id: h});
		g.update(c);
		return g
	}, show: function (c) {
		this.showDialog(c)
	}, close: function (c) {
		this.closeDialog(c)
	}});
	a.ModalPopup.active = false;
	return b
}(PhenoTips || {}));
var PhenoTips = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.SolrQueryProcessor = Class.create({initialize: function (d, c) {
		this.queryFields = d;
		this.restriction = c
	}, processQuery: function (c) {
		return this.inflateQuery(c)
	}, generateParameters: function (d) {
		var c = {defType: "edismax", "spellcheck.collate": true, spellcheck: true, lowercaseOperators: false};
		if (this.setupMandatoryQuery(d, c)) {
			return c
		}
		this.restrictQuery(d, c);
		this.setupQueryFields(d, c);
		return c
	}, setupMandatoryQuery: function (h, g) {
		var d = h.strip();
		var c = "";
		var l = false;
		for (var k in this.queryFields) {
			var f = this.queryFields[k];
			var e = f.activationRegex;
			if (!f.mandatory || !e || !d.match(e)) {
				continue
			}
			c += k + ":" + (f.transform ? f.transform(h) : h) + " ";
			l = true
		}
		if (c) {
			g.fq = c.strip()
		}
		return l
	}, restrictQuery: function (h, g) {
		if (!this.restriction) {
			return
		}
		var c = "";
		for (var d in this.restriction) {
			var f = (d.substring(0, 1) == "-" ? "-" : "+") + "(";
			for (var e = 0; e < this.restriction[d].length; ++e) {
				f += d.replace(/^-/, "") + ":" + this.restriction[d][e].replace(/:/g, "\\:") + " "
			}
			f = f.strip() + ") ";
			c += f
		}
		if (c) {
			g.fq = c.strip()
		}
	}, setupQueryFields: function (h, n) {
		var e = h.strip();
		var d = "";
		var f = "";
		var k = "";
		var m = h.replace(/.*\W/g, "");
		for (var l in this.queryFields) {
			var g = this.queryFields[l];
			var c = g.activationRegex;
			if (c && !e.match(c)) {
				continue
			}
			if (g.wordBoost) {
				d += l + "^" + g.wordBoost + " "
			}
			if (g.phraseBoost) {
				f += l + "^" + g.phraseBoost + (g.phraseSlop ? "~" + g.phraseSlop : "") + " "
			}
			if (m && g.stubBoost) {
				k += l + ":" + m.replace(/:/g, "\\:") + "*^" + g.stubBoost + " "
			}
		}
		if (d) {
			n.qf = d.strip()
		}
		if (f) {
			n.pf = f.strip()
		}
		if (k) {
			n.bq = k.strip()
		}
	}, inflateQuery: function (d) {
		var f = d.replace(/.*\W/g, "");
		if (!f) {
			return d
		}
		var c = d;
		for (var e in this.queryFields) {
			if (this.queryFields[e].stubTrigger) {
				c += " " + e + ":" + f.replace(/:/g, "\\:") + "*"
			}
		}
		return c.strip()
	}});
	return b
}(PhenoTips || {}));
var PhenoTips = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.OntologyBrowser = Class.create({options: {script: "/get/PhenoTips/SolrService?sort=nameSort asc&start=0&rows=10000&", varname: "q", method: "post", json: true, responseFormat: "application/json", resultsParameter: "rows", resultId: "id", resultValue: "name", resultCategory: "term_category", resultParent: {selector: "is_a", processingFunction: function (d) {
		var c = {};
		c.id = d.replace(/\s+/gm, " ").replace(/(HP:[0-9]+)\s*!\s*(.*)/m, "$1");
		c.value = d.replace(/\s+/gm, " ").replace(/(HP:[0-9]+)\s*!\s*(.*)/m, "$2");
		return c
	}}, noresults: "No sub-terms", targetQueryProcessor: typeof(b.widgets.SolrQueryProcessor) == "undefined" ? null : new b.widgets.SolrQueryProcessor({id: {activationRegex: /^HP:[0-9]+$/i, mandatory: true, transform: function (c) {
		return c.toUpperCase().replace(/:/g, "\\:")
	}}}), expandQueryProcessor: typeof(b.widgets.SolrQueryProcessor) == "undefined" ? null : new b.widgets.SolrQueryProcessor({is_a: {activationRegex: /^HP:[0-9]+$/i, mandatory: true, transform: function (c) {
		return c.toUpperCase().replace(/:/g, "\\:")
	}}}), showParents: true, showRoot: true, enableSelection: true, enableBrowse: true, isTermSelected: function (c) {
		return false
	}, unselectTerm: function (c) {
	}, defaultEntryAction: "browse"}, initialize: function (e, c, d) {
		this.options = Object.extend(Object.clone(this.options), d || {});
		this.suggest = e;
		this.loadingMessage = new Element("div", {"class": "plainmessage loading"}).update("Loading...");
		if (c) {
			this.container = c
		} else {
			this.container = new b.widgets.ModalPopup(this.loadingMessage, {}, {idPrefix: "ontology-browser-window-", title: "Related terms", backgroundColor: "#ffffff", verticalPosition: "top", extraDialogClassName: "dialog-ontology-browser", removeOnClose: true});
			this.options.modal = true
		}
		this._obrowserExpandEventHandler = this._obrowserExpandEventHandler.bindAsEventListener(this)
	}, load: function (h) {
		this.setContent(this.loadingMessage);
		var f = h;
		var e = {};
		if (this.options.targetQueryProcessor != null && typeof(this.options.targetQueryProcessor.generateParameters) == "function") {
			e = this.options.targetQueryProcessor.generateParameters(f)
		}
		if (this.options.targetQueryProcessor != null && typeof(this.options.targetQueryProcessor.processQuery) == "function") {
			f = this.options.targetQueryProcessor.processQuery(f)
		}
		var d = this.options.script + this.options.varname + "=" + encodeURIComponent(f);
		var g = {};
		g.Accept = this.options.responseFormat;
		var c = new Ajax.Request(d, {method: this.options.method, parameters: e, requestHeaders: g, onSuccess: function (k) {
			this.setContent(this.buildTree(this._getDataFromResponse(k)));
			this.__crtRoot = h;
			if (this.container.content) {
				Event.fire(document, "xwiki:dom:updated", {elements: [this.container.contentContainer || this.container.content]})
			}
		}.bind(this), onFailure: function (k) {
			this.setContent("Failed to retrieve data : " + k.statusText);
			this.__crtRoot = ""
		}.bind(this)})
	}, expandTo: function (c, d) {
		if (d.indexOf(this.__crtRoot) == -1) {
			return
		}
		this._expandToStep(c, d.without(this.__crtRoot, c))
	}, _expandToStep: function (c, e) {
		var g = this;
		var f = this.container.contentContainer.down('li.entry input.select-tool[value="' + c.replace(/"/g, '\\"') + '"]');
		if (f) {
			return
		}
		var d = false;
		e.each(function (k) {
			if (d) {
				return
			}
			var h = g.container.contentContainer.down('li.entry input.select-tool[value="' + k.replace(/"/g, '\\"') + '"]');
			if (h) {
				var l = h.up("li");
				if (l.hasClassName("collapsed") || !l.down(".descendents")) {
					Event.observe(l, "obrowser:expand:finished", function (m) {
						Event.stopObserving(l, "obrowser:expand:finished");
						g._expandToStep(c, e.without(k))
					});
					g._toggleExpandState(l);
					d = true
				}
			}
		})
	}, expand: function (f, d) {
		var h = f.__termId;
		var g = {};
		if (this.options.expandQueryProcessor != null && typeof(this.options.expandQueryProcessor.generateParameters) == "function") {
			g = this.options.expandQueryProcessor.generateParameters(h)
		}
		if (this.options.expandQueryProcessor != null && typeof(this.options.expandQueryProcessor.processQuery) == "function") {
			h = this.options.expandQueryProcessor.processQuery(h)
		}
		var e = this.options.script + this.options.varname + "=" + encodeURIComponent(h);
		var k = {};
		k.Accept = this.options.responseFormat;
		var c = new Ajax.Request(e, {method: this.options.method, requestHeaders: k, parameters: g, onCreate: function () {
			this._lockExpandTool(f)
		}.bind(this), onSuccess: function (n) {
			var m = {};
			if (d) {
				var l = this.buildDescendentsList(this._getDataFromResponse(n));
				f.insert({bottom: l});
				Event.fire(document, "obrowser:content:added", {added: l, obrowser: this});
				Event.fire(f, "obrowser:expand:finished");
				Event.fire(this.container.contentContainer || document, "obrowser:expand:finished");
				Event.fire(document, "xwiki:dom:updated", {elements: [l]})
			} else {
				m.count = this.countDescendents(this._getDataFromResponse(n))
			}
			if ((m.count === 0) || (d && !f.down(".descendents .entry, .error"))) {
				f.addClassName("collapsed");
				var o = f.down(".expand-tool");
				if (o) {
					o.update(this._getExpandCollapseSymbol(true)).addClassName("disabled");
					o.stopObserving("click")
				}
			}
			Event.fire(document, "ms:popup:content-updated", {popup: this.container})
		}.bind(this), onFailure: function (l) {
			Event.fire(f, "obrowser:expand:failed", {data: new Element("div", {"class": "error"}).update("Failed to retrieve data : " + l.statusText), count: -1})
		}, onComplete: function () {
			this._unlockExpandTool(f)
		}.bind(this)})
	}, _getDataFromResponse: function (c) {
		if (this.options.json) {
			return c.responseJSON
		}
		return c.responseXML
	}, _getResultset_json: function (c, d) {
		return c && c[d] || []
	}, _getResultFieldValue_json: function (c, d) {
		return c && c[d] || ""
	}, _getResultFieldValueAsArray_json: function (c, d) {
		return new Array(c && c[d] || "").flatten()
	}, _getResultset_xml: function (e, c) {
		var d = e && e.getElementsByTagName(c);
		return d
	}, _getResultFieldValue_xml: function (e, c) {
		var d = e && Element.down(e, c);
		return d && d.firstChild && d.firstChild.nodeValue || ""
	}, _getResultFieldValueAsArray_xml: function (e, d) {
		var c = new Array();
		if (e) {
			Element.select(e, d).each(function (f) {
				var g = f.firstChild && f.firstChild.nodeValue;
				if (g) {
					c.push(g)
				}
			})
		}
		return c
	}, _getResultset: function (c, d) {
		if (this.options.json) {
			return this._getResultset_json(c, d)
		}
		return this._getResultset_xml(c, d)
	}, _getResultFieldValue: function (c, d) {
		if (this.options.json) {
			return this._getResultFieldValue_json(c, d)
		}
		return this._getResultFieldValue_xml(c, d)
	}, _getResultFieldValueAsArray: function (c, d) {
		if (this.options.json) {
			return this._getResultFieldValueAsArray_json(c, d)
		}
		return this._getResultFieldValueAsArray_xml(c, d)
	}, buildTree: function (h) {
		var g = this._getResultset(h, this.options.resultsParameter);
		if (g.length == 0) {
			return new Element("div", {"class": "error"}).update(this.options.noresults)
		}
		var c = g[0];
		var e = new Element("div");
		if (this.options.showParents) {
			var f = new Element("ul", {"class": "parents"});
			this._getResultFieldValueAsArray(c, this.options.resultParent.selector).each(function (k) {
				var m = k;
				var l = {};
				if (typeof(this.options.resultParent.processingFunction) == "function") {
					l = this.options.resultParent.processingFunction(m)
				}
				f.insert({bottom: this._createParentBranch(l)})
			}.bind(this));
			if (f.hasChildNodes()) {
				e.insert({top: f})
			}
			Event.fire(document, "obrowser:content:added", {added: f, obrowser: this})
		}
		var h = {id: this._getResultFieldValue(c, this.options.resultId), value: this._getResultFieldValue(c, this.options.resultValue), category: this._generateEntryCategory(c)};
		var d = this._createRoot(h);
		e.insert({bottom: d});
		Event.fire(document, "obrowser:content:added", {added: d, obrowser: this});
		return e
	}, countDescendents: function (c) {
		return this._getResultset(c, this.options.resultsParameter).length
	}, buildDescendentsList: function (c) {
		var e = this._getResultset(c, this.options.resultsParameter);
		var g = new Element("ul", {"class": "descendents"});
		for (var d = 0; d < e.length; d++) {
			var f = {id: this._getResultFieldValue(e[d], this.options.resultId), value: this._getResultFieldValue(e[d], this.options.resultValue), category: this._generateEntryCategory(e[d])};
			g.insert({bottom: this._createDescendentBranch(f)})
		}
		if (g.hasChildNodes()) {
			return g
		}
		return new Element("div", {"class": "descendents hint empty"}).update(this.options.noresults)
	}, _createBranch: function (e, l, f, d) {
		var g = new Element(e, {"class": "entry " + l});
		g.__termId = f.id;
		g.__termCategory = f.category;
		var c = new Element("div", {"class": "entry-data"});
		c.insert({bottom: this._generateEntryTitle(f.id, f.value)});
		var k = new Element("span", {"class": "entry-tools"});
		k.observe("click", function (n) {
			n.stop()
		});
		c.insert({bottom: k});
		g.update(c);
		if (!this._isRootEntry(g)) {
			if (this.options.defaultEntryAction == "browse") {
				c.down(".info").observe("click", this._browseEntry.bindAsEventListener(this))
			}
		}
		k.insert(new Element("span", {"class": "fa fa-info-circle phenotype-info xHelpButton", title: f.id}));
		if (this.options.enableSelection) {
			g.__selectTool = new Element("input", {type: "checkbox", name: "term_selector", value: f.id, "class": "select-tool"});
			c.insert({top: g.__selectTool});
			if (this.options.isTermSelected(g.__termId)) {
				g.addClassName("accepted");
				g.__selectTool.checked = "checked"
			}
			g.__selectTool.observe("click", this._toggleEntrySelection.bindAsEventListener(this));
			if (this.options.defaultEntryAction == "select") {
				c.down(".info").observe("click", this._toggleEntrySelection.bindAsEventListener(this))
			}
		}
		if (d) {
			var m = new Element("span", {"class": "expand-tool"}).update(this._getExpandCollapseSymbol(!g.hasClassName("root")));
			m.observe("click", function (o) {
				var n = o.element().up(".entry");
				if (!this._isExpandToolLocked(n)) {
					this._toggleExpandState(n)
				}
			}.bindAsEventListener(this));
			var h = function (n) {
				if (!this._isExpandToolLocked(g) && n.memo.selected == "yes") {
					this._expandEntry(g)
				}
			};
			g.observe("obrowser:entry:selected", h.bindAsEventListener(this));
			g.observe("ynpicker:selectionChanged", h.bindAsEventListener(this));
			c.insert({top: m});
			this.expand(g, g.hasClassName("root"))
		}
		return g
	}, _generateEntryTitle: function (d, c) {
		return new Element("span", {"class": "info"}).insert({bottom: new Element("span", {"class": "key"}).update("[" + d + "]")}).insert({bottom: " "}).insert({bottom: new Element("span", {"class": "value"}).update(c)})
	}, _generateEntryCategory: function (d) {
		var c = new Element("span", {"class": "hidden term-category"});
		if (this.options.resultCategory) {
			this._getResultFieldValueAsArray(d, this.options.resultCategory).each(function (e) {
				c.insert(new Element("input", {type: "hidden", value: e}))
			})
		}
		if (c.hasChildNodes()) {
			return c
		} else {
			return null
		}
	}, _expandEntry: function (c) {
		if (!c) {
			return
		}
		if (!c.down(".descendents")) {
			c.down(".error") && c.down(".error").remove();
			this.expand(c, true)
		} else {
			Event.fire(c, "obrowser:expand:finished")
		}
		c.removeClassName("collapsed");
		c.down(".expand-tool").update(this._getExpandCollapseSymbol(false))
	}, _collapseEntry: function (c) {
		if (!c) {
			return
		}
		c.addClassName("collapsed");
		Event.fire(c, "obrowser:expand:finished");
		c.down(".expand-tool").update(this._getExpandCollapseSymbol(true))
	}, _toggleExpandState: function (c) {
		if (c) {
			if (!c.down(".descendents") || c.hasClassName("collapsed")) {
				this._expandEntry(c)
			} else {
				this._collapseEntry(c)
			}
		}
	}, _obrowserExpandEventHandler: function (d) {
		var c = d.element();
		if (!d.memo) {
			return
		}
		if (d.memo.data) {
			c.insert({bottom: d.memo.data});
			c.stopObserving("obrowser:expand:done", this._obrowserExpandEventHandler)
		} else {
			if (typeof(d.memo.count) != "undefined") {
				c.stopObserving("obrowser:count:done", this._obrowserExpandEventHandler)
			}
		}
		c.stopObserving("obrowser:expand:failed", this._obrowserExpandEventHandler);
		if ((d.memo.count == "0") || (!c.hasClassName("root") && d.memo.data && !c.down(".descendents .entry, .error"))) {
			c.addClassName("collapsed");
			var e = c.down(".expand-tool");
			if (e) {
				e.update(this._getExpandCollapseSymbol(true)).addClassName("disabled");
				e.stopObserving("click")
			}
		}
		this._unlockExpandTool(c);
		Event.fire(document, "ms:popup:content-updated", {popup: this.container});
		if (d.memo.data) {
			Event.fire(c, "obrowser:expand:finished")
		}
	}, _lockExpandTool: function (c) {
		var d = c.down(".expand-tool");
		if (d) {
			d.addClassName("locked")
		}
	}, _unlockExpandTool: function (c) {
		var d = c.down(".expand-tool");
		if (d) {
			d.removeClassName("locked")
		}
	}, _isExpandToolLocked: function (c) {
		if (c.down(".expand-tool.locked")) {
			return true
		}
		return false
	}, _getExpandCollapseSymbol: function (c) {
		if (c) {
			return"&#x25ba;"
		}
		return"&#x25bc;"
	}, _toggleEntrySelection: function (e) {
		var d = e.element();
		if (!d.hasClassName("select-tool")) {
			d.up(".entry").down("input").click();
			return
		}
		var c = d.up(".entry");
		if (d.checked) {
			this._selectEntry(c)
		} else {
			this._unselectEntry(c)
		}
	}, _selectEntry: function (c) {
		if (this.suggest) {
			if (this.options.modal && typeof(this.container.getPositionInViewport) == "function") {
				var e = this.container.getPositionInViewport()
			}
			var d = c.down(".value").firstChild.nodeValue;
			this.suggest.acceptEntry({id: c.__termId, value: d, category: c.__termCategory, negative: c.down(".selected.no")}, d, "", true);
			c.addClassName("accepted");
			if (e && (typeof(this.container.positionDialogInViewport) == "function")) {
				this.container.positionDialogInViewport(e.left, e.top)
			}
			c.fire("obrowser:entry:selected", {selected: (c.down(".selected.no")) ? "no" : "yes"})
		}
	}, _unselectEntry: function (c) {
		this.options.unselectTerm(c.__termId);
		this.options.unselectTerm(c.__termId, true);
		c.removeClassName("accepted")
	}, _browseEntry: function (d) {
		d.stop();
		var c = d.element().up(".entry");
		this.load(c.__termId)
	}, _createParentBranch: function (c) {
		var c = this._createBranch("li", "parent", c, false);
		return c
	}, _createRoot: function (d) {
		var c = this._createBranch("div", "root", d, true);
		if (!this.options.showRoot) {
			c.addClassName("no-root");
			c.down(".entry-data").addClassName("invisible")
		}
		return c
	}, _createDescendentBranch: function (c) {
		return this._createBranch("li", "descendent", c, true)
	}, _isRootEntry: function (c) {
		return c.hasClassName("entry") && c.hasClassName("root")
	}, setContent: function (c) {
		this.container.setContent(new Element("div", {"class": "ontology-tree"}).update(c))
	}, show: function (c) {
		if (c) {
			this.container.show();
			if (this.__crtRoot != c) {
				this.load(c)
			} else {
				Event.fire(this.container.contentContainer || document, "obrowser:expand:finished")
			}
		}
	}, hide: function () {
		this.container.close()
	}});
	return b
}(PhenoTips || {}));
var PhenoTips = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.DropDown = Class.create({options: {}, initialize: function (d) {
		this.element = d;
		this.hasForceOpen = false;
		var c = d.next(".dropdown");
		if (c) {
			this.contentContainer = null;
			this.dropdown = c;
			this.hasForceOpen = true
		} else {
			this.dropdown = new Element("div", {"class": "dropdown"});
			this.contentContainer = new Element("div");
			this.dropdown.update(this.contentContainer)
		}
	}, setContent: function (c) {
		this.contentContainer != null ? this.contentContainer.update(c) : null
	}, show: function (c) {
		if (c && !this.hasForceOpen) {
			return false
		}
		if (this.dropdown.hasClassName("invisible")) {
			this.dropdown.removeClassName("invisible")
		} else {
			this.element.insert({after: this.dropdown})
		}
		return true
	}, close: function (c) {
		if (c && !this.hasForceOpen) {
			return false
		}
		this.dropdown.addClassName("invisible");
		return true
	}});
	return b
}(PhenoTips || {}));
StickyBox = Class.create({options: {offsetTop: 6, offsetBottom: 0, resize: false, isSticky: function (a) {
	return true
}}, initialize: function (b, a, c) {
	this.stickyElement = b;
	this.stickyAreaElement = a;
	if (this.stickyElement && this.stickyAreaElement) {
		this.options = Object.extend(Object.clone(this.options), c || {});
		if (this.options.shadowSize && c.offsetTop === undefined) {
			this.options.offsetTop = this.options.shadowSize
		}
		this.resetPosition = this.resetPosition.bindAsEventListener(this);
		Event.observe(window, "scroll", this.resetPosition);
		Event.observe(window, "resize", this.resetPosition);
		if (typeof(this.options.makeDefault) == "function") {
			this.makeDefault = this.options.makeDefault.bind(this)
		}
		this.resetPosition()
	}
}, resetPosition: function () {
	if (!this.options.isSticky(this.stickyElement) || this.stickyElement.getHeight() >= this.stickyAreaElement.getHeight()) {
		return
	}
	this.stickyElement.style.height = "";
	this.stickyElement.style.overflow = "";
	this.stickyElement.fire("size:changed");
	this.boxHeight = this.stickyElement.getHeight();
	var c = document.viewport.getHeight() - this.options.offsetTop - this.options.offsetBottom;
	if (this.options.resize) {
		var b = {diff: (c - this.boxHeight), original: this.boxHeight};
		this.boxHeight = c;
		this.stickyElement.style.height = this.boxHeight + "px";
		this.stickyElement.style.overflow = "auto";
		this.stickyElement.fire("size:changed", b)
	}
	this.boxWidth = this.stickyElement.getWidth();
	this.boxMinTop = this.stickyAreaElement.cumulativeOffset().top + this.options.offsetTop;
	this.boxMaxTop = this.stickyAreaElement.cumulativeOffset().top + this.stickyAreaElement.getHeight() - this.boxHeight;
	this.boxLeft = this.stickyElement.cumulativeOffset().left;
	this.boxRelativeLeft = this.boxLeft - this.stickyElement.getOffsetParent().viewportOffset().left;
	var a = this.stickyAreaElement.viewportOffset().top;
	this.direction = 0;
	if (this.stickyAreaElement._prevPosition) {
		if (this.stickyAreaElement._prevPosition > a) {
			this.direction = 1
		} else {
			if (this.stickyAreaElement._prevPosition < a) {
				this.direction = -1
			}
		}
	}
	if ((this.options.isSticky(this.stickyElement) || this.direction == 1) && document.viewport.getScrollOffsets().top >= this.boxMinTop && document.viewport.getScrollOffsets().top < this.boxMaxTop) {
		this.makeFixed()
	} else {
		if ((this.options.isSticky(this.stickyElement) || this.direction == -1) && document.viewport.getScrollOffsets().top >= this.boxMaxTop) {
			this.makeAbsolute()
		} else {
			this.makeDefault()
		}
	}
	this.stickyAreaElement._prevPosition = a
}, makeFixed: function () {
	if (this.stickyElement.style.position != "fixed") {
		this.stickyElement.addClassName("sticky");
		this.stickyElement.style.left = this.boxLeft + "px";
		this.stickyElement.style.width = (this.boxWidth) + "px";
		this.stickyElement.style.top = this.options.offsetTop + "px";
		this.stickyElement.style.right = "";
		this.stickyElement.style.position = "fixed"
	}
}, makeAbsolute: function (b) {
	if (this.stickyElement.style.position != "absolute") {
		this.stickyElement.addClassName("sticky");
		b = b || (this.stickyAreaElement.getHeight() - this.stickyElement.getHeight());
		this.stickyElement.style.top = b + "px";
		this.stickyElement.style.right = "";
		var a = this.stickyElement.getStyle("position");
		this.stickyElement.style.position = "absolute";
		if (a == "fixed" && !Prototype.Browser.WebKit) {
			this.stickyElement.style.left = (this.boxRelativeLeft - this.stickyElement.getOffsetParent().viewportOffset().left + 2) + "px"
		} else {
			this.stickyElement.style.left = this.boxRelativeLeft + "px"
		}
	}
}, makeDefault: function () {
	if (this.stickyElement.style.position != "") {
		this.stickyElement.removeClassName("sticky");
		this.stickyElement.style.position = "";
		this.stickyElement.style.top = "";
		this.stickyElement.style.left = "";
		this.stickyElement.style.right = "";
		this.stickyElement.style.width = ""
	}
}, isFixed: function () {
	return(this.stickyElement.style.position == "fixed")
}, isAbsolute: function () {
	return(this.stickyElement.style.position == "absolute")
}, isDefault: function () {
	return(this.stickyElement.style.position == "")
}});
var PhenoTips = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.FreeMultiselect = Class.create({counter: 1, options: {returnKeyNavigation: false, extraClasses: ""}, initialize: function (f, e) {
		this.options = Object.extend(Object.clone(this.options), e || {});
		var k = this;
		var h = f.previous('input[name="xwiki-free-multiselect-suggest-extraclasses"][type="hidden"]');
		if (h) {
			this.options.extraClasses = h.value
		}
		var c = f.previous('input[name="xwiki-free-multiselect-suggest-script"][type="hidden"]');
		if (c && c.value && typeof(XWiki.widgets.Suggest) != "undefined") {
			this.suggestOptions = {script: c.value, shownoresults: false, varname: "input", timeout: 0}
		}
		this.enhanceLine = this.enhanceLine.bind(this);
		var d = f.select("li input.xwiki-free-multiselect-value");
		d.each(this.enhanceLine);
		if (f.down("input.xwiki-free-multiselect-value")) {
			var g = new Element("a", {title: "add", href: "#" + f.id}).update("+...");
			f.insert(g.wrap("li"));
			g.observe("click", function (m) {
				m.stop();
				var n = g.up("li").previous();
				var l = n && n.down("input.xwiki-free-multiselect-value");
				if (l) {
					k.generateInput(l)
				}
			}.bindAsEventListener(this))
		}
	}, enhanceLine: function (c) {
		c.id = this.generateId(c);
		c.up("li").addClassName("xwiki-free-multiselect-line");
		this.attachDeleteTool(c);
		if (this.suggestOptions) {
			new XWiki.widgets.Suggest(c, this.suggestOptions)
		}
		this.enableAddInput(c)
	}, attachDeleteTool: function (d) {
		var e = d.up(".xwiki-free-multiselect-line");
		var c = new Element("a", {title: "delete", href: "#" + d.id}).update("✖");
		e.insert(" ").insert(c);
		c.observe("click", function (f) {
			f.stop();
			var h = f.findElement(".xwiki-free-multiselect-line");
			if (h.previous(".xwiki-free-multiselect-line") || h.next(".xwiki-free-multiselect-line")) {
				h.remove()
			} else {
				var g = h.down("input");
				g.value = "";
				g.focus()
			}
		})
	}, enableAddInput: function (c) {
		var e = c.up(".xwiki-free-multiselect-line");
		var d = this;
		if (!e) {
			return
		}
		c.observe("keypress", function (h) {
			if (h.keyCode == Event.KEY_RETURN) {
				h.stop();
				var f = e.next(".xwiki-free-multiselect-line");
				if (d.options.returnKeyNavigation && f && f.down("input")) {
					f.down("input").focus()
				} else {
					c.next().removeClassName("inactive");
					d.generateInput(c)
				}
			} else {
				if (h.keyCode == Event.KEY_BACKSPACE && c.value == "") {
					h.stop();
					var g = e.previous(".xwiki-free-multiselect-line");
					if (g && g.down("input")) {
						g.down("input").focus();
						c.up(".xwiki-free-multiselect-line").remove()
					}
				}
			}
		})
	}, generateInput: function (d) {
		var c = new Element("input", {name: d.name, id: this.generateId(d), type: d.type, size: d.size, "class": "xwiki-free-multiselect-value " + this.options.extraClasses});
		var e = new Element("li");
		e.insert(c);
		d.up(".xwiki-free-multiselect-line").insert({after: e});
		this.enhanceLine(c);
		c.focus()
	}, generateId: function (c) {
		return c.name + "_" + this.nextIndex()
	}, nextIndex: function () {
		return ++this.counter
	}, lastIndex: function () {
		return this.counter
	}});
	return b
}(PhenoTips || {}));
var init = function (a) {
	((a && a.memo.elements) || [$("body")]).each(function (b) {
		b.select(".xwiki-free-multiselect").each(function (c) {
			new PhenoTips.widgets.FreeMultiselect(c)
		})
	})
};
(XWiki.domIsLoaded && init()) || document.observe("xwiki:dom:loaded", init);
document.observe("xwiki:dom:updated", init);
var XWiki = (function (c) {
	var a = c.widgets = c.widgets || {};
	a.VisibilityController = Class.create({initialize: function (e) {
		this.element = e;
		this.reverse = this.element.hasClassName("exclude");
		this.controller = this.element.select(".controller input[type=checkbox]");
		var d = "change";
		if (this.controller.length == 0) {
			return
		} else {
			if (this.controller.length == 1) {
				this.controller = this.controller[0]
			} else {
				this.controller = this.element.down(".controller .yes input[type=checkbox]");
				d = "picker:change"
			}
		}
		if (!this.controller) {
			return
		}
		this.controlled = this.element.select(".controlled");
		if (this.element.hasClassName("complete-hide")) {
			this.hiddenStyle = {display: "none"};
			this.visibleStyle = {display: ""}
		} else {
			this.hiddenStyle = {visibility: "hidden"};
			this.visibleStyle = {visibility: "visible"}
		}
		this.controlVisibility();
		if (this.element.hasClassName("confirm")) {
			this.controller.observe(d, this.confirm.bindAsEventListener(this))
		} else {
			this.controller.observe(d, this.controlVisibility.bindAsEventListener(this))
		}
	}, controlVisibility: function () {
		if (this.controller.checked ^ this.reverse) {
			this.controlled.invoke("setStyle", this.hiddenStyle);
			this.element.select(".controlled input").invoke("disable")
		} else {
			this.controlled.invoke("setStyle", this.visibleStyle);
			this.element.select(".controlled input").invoke("enable")
		}
	}, confirm: function (d) {
		if (this.element.hasClassName("confirm-yes") && !this.controller.checked || this.element.hasClassName("confirm-no") && this.controller.checked) {
			this.controlVisibility();
			return
		}
		new c.widgets.ConfirmationBox({onYes: function () {
			this.controlVisibility()
		}.bind(this), onNo: function () {
			this.controller.checked = !this.controller.checked
		}.bind(this), }, {confirmationText: "This will remove all table data entered below. Are you sure you want to proceed?", showCancelButton: false})
	}});
	var b = function (d) {
		((d && d.memo.elements) || [$("body")]).each(function (e) {
			e.select(".controlled-group").each(function (f) {
				if (!f.__visibilityController) {
					f.__visibilityController = new c.widgets.VisibilityController(f)
				}
			})
		});
		return true
	};
	(c.domIsLoaded && b()) || document.observe("xwiki:dom:loaded", b);
	document.observe("xwiki:dom:updated", b);
	return c
}(XWiki || {}));
var PhenoTips = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.UnitConverter = Class.create({CONVERSION_META: {weight: {imperial_units: ["lb", "oz"], metric_unit: "kg", inter_unit_scale: 16, inter_system_scale: 0.0283495}, length: {imperial_units: ["ft", "in"], metric_unit: "cm", inter_unit_scale: 12, inter_system_scale: 2.54}}, DEFAULT_UNIT_SYSTEM: "metric", initialize: function (e, c, f, d, g) {
		this._selector = c;
		this._container = e || document.documentElement;
		if (!this._selector || !f) {
			return
		}
		this.crtUnitSystem = g || this.DEFAULT_UNIT_SYSTEM;
		this.initializeElements = this.initializeElements.bind(this);
		this.attachConverter = this.attachConverter.bind(this);
		this.generateTrigger(f, d || "bottom");
		this.initializeElements();
		var h = this;
		document.observe("xwiki:dom:updated", function (k) {
			if (k.memo && k.memo.elements) {
				k.memo.elements.each(h.initializeElements.bind(h))
			}
		})
	}, generateTrigger: function (e, c) {
		this._trigger = new Element("select", {"class": "unit-system-selector"});
		var d = new Element("option", {value: "metric", }).update("Metric units (" + this.CONVERSION_META.weight.metric_unit + ", " + this.CONVERSION_META.length.metric_unit + ")");
		if (this.crtUnitSystem == "metric") {
			d.selected = "selected"
		}
		var f = new Element("option", {value: "imperial", }).update("Imperial units (" + this.CONVERSION_META.weight.imperial_units.join(" / ") + ", " + this.CONVERSION_META.length.imperial_units.join(" / ") + ")");
		if (this.crtUnitSystem == "imperial") {
			f.selected = "selected"
		}
		this._trigger.insert(d).insert(f);
		insertionInfo = {};
		insertionInfo[c] = this._trigger;
		e.insert(insertionInfo);
		var g = this;
		this._trigger.observe("change", function (h) {
			g.crtUnitSystem = g._trigger.options[g._trigger.selectedIndex].value;
			g.switchUnits(g.crtUnitSystem)
		})
	}, initializeElements: function (c) {
		container = c || this._container;
		if (container.__unitSwitcher || (!container.up(".measurements") && !container.hasClassName("measurements"))) {
			return
		}
		container.__unitSwitcher = this;
		container.select(this._selector).each(this.attachConverter);
		this.switchUnits(this.crtUnitSystem, container)
	}, switchUnits: function (d, c) {
		container = c || this._container;
		container.select(".unit-conversion-values .unit-type").each(function (e) {
			if (e.hasClassName(d)) {
				e.show()
			} else {
				e.hide()
			}
		})
	}, attachConverter: function (d) {
		if (d.tagName.toLowerCase() != "input" || d.type != "text") {
			return
		}
		var k = d.next(".unit");
		var h = new Element("div", {"class": "unit-conversion-values"});
		var l;
		var e = (d.up(".weight")) ? "weight" : "length";
		h.addClassName(e);
		h._meta = this.CONVERSION_META[e];
		var c = this.metricToImperial(h._meta, parseFloat(d.value) || 0);
		var g = d.up(".metric");
		if (!g) {
			g = new Element("div", {"class": "unit-type metric"});
			g.insert(d).insert(k || h._meta.metric_unit);
			d.insert({after: h})
		} else {
			g.addClassName("unit-type");
			g.insert({after: h})
		}
		var f = new Element("div", {"class": "unit-type imperial"});
		h.insert(g).insert(f);
		h._meta.imperial_units.each(function (m) {
			f.insert(new Element("label").insert(new Element("input", {style: "width: auto", name: m, type: "text", size: 3, value: (c[m] || "")})).insert(m))
		});
		this.enableSyncValues(h)
	}, enableSyncValues: function (c) {
		var d = this;
		c.select(".imperial input").invoke("observe", "change", function (e) {
			d.syncMetricWithImperial(c)
		});
		c.select(".metric input").invoke("observe", "change", function (e) {
			d.syncImperialWithMetric(c)
		})
	}, syncMetricWithImperial: function (d) {
		var c = d.down(".metric input");
		c.value = this.imperialToMetric(d._meta, parseFloat(d.down('.imperial input[name="' + d._meta.imperial_units[0] + '"]').value) || 0, parseFloat(d.down('.imperial input[name="' + d._meta.imperial_units[1] + '"]').value) || 0) || "";
		Event.fire(c, "phenotips:measurement-updated")
	}, syncImperialWithMetric: function (d) {
		var c = this.metricToImperial(d._meta, parseFloat(d.down(".metric input").value) || 0);
		d._meta.imperial_units.each(function (e) {
			d.down('.imperial input[name="' + e + '"]').value = c[e] || ""
		})
	}, metricToImperial: function (e, g) {
		var c = {};
		var f = g / e.inter_system_scale;
		var d = Math.floor(f / e.inter_unit_scale);
		f = f - d * e.inter_unit_scale;
		if (f) {
			f = f.toFixed(2)
		}
		c[e.imperial_units[0]] = d;
		c[e.imperial_units[1]] = f;
		return c
	}, imperialToMetric: function (d, c, e) {
		return((d.inter_unit_scale * c + e) * d.inter_system_scale).toFixed(2)
	}});
	return b
}(PhenoTips || {}));
var PhenoTips = (function (c) {
	var a = c.widgets = c.widgets || {};
	a.HelpButton = Class.create({infoServices: {xHelpButton: {hint: "How to enter this information", callback: function (d) {
		d.helpBox.content.update(d._information || "")
	}}, "phenotype-info": {hint: "About this phenotype", service: "/get/PhenoTips/PhenotypeInfoService", callback: function (k, h) {
		var n = k.helpBox.content;
		var g = function (o, l, p) {
			return new Element(o, l && {"class": l} || {}).update(p || "")
		};
		n.update(g("span", "info").insert(g("span", "key").update(h.id)).insert(" ").insert(g("span", "value").update(h.label)));
		h.def && n.insert(g("p").update(h.def.replace(/\s*\n\s*/, " ").replace(/`([^`]+)`\s+\(([A-Z]+:[0-9]+)`?\)/g, '<em title="$2">$1</em>')));
		var m = {synonym: "Also known as", is_a: "Is a type of"};
		var d = g("dl");
		for (var e in m) {
			if (h[e]) {
				d.insert(g("dt", "", m[e]));
				h[e].each(function (l) {
					d.insert(g("dd", "", l.label || l))
				})
			}
		}
		if (d.firstDescendant()) {
			n.insert(d)
		}
		if (c.widgets.OntologyBrowser) {
			var f = new Element("a", {"class": "button", href: "#"}).update("Browse related terms...");
			f._id = h.id;
			f.observe("click", function (l) {
				l.stop();
				var p = ($("quick-phenotype-search") || $$("input.suggestHpo")[0])._suggest;
				var o = {};
				if (typeof isPhenotypeSelected !== "undefined") {
					o = {isTermSelected: isPhenotypeSelected, unselectTerm: unselectPhenotype}
				}
				f._obrowser = new c.widgets.OntologyBrowser(p, null, o);
				f._obrowser.show(f._id)
			});
			n.insert(g("div", "term-tools").insert(f.wrap("span", {"class": "buttonwrapper"})))
		}
	}}, "phenotype-qualifier-info": {hint: "About this phenotype qualifier", service: "/get/PhenoTips/PhenotypeInfoService", callback: function (f, e) {
		var g = f.helpBox.content;
		var d = function (k, h, l) {
			return new Element(k, h && {"class": h} || {}).update(l || "")
		};
		g.update(d("span", "info").insert(d("span", "key").update(e.id)).insert(" ").insert(d("span", "value").update(e.label)));
		e.def && g.insert(d("p").update(e.def.replace(/\s*\n\s*/, " ").replace(/`([^`]+)`\s+\(([A-Z]+:[0-9]+)`?\)/g, '<em title="$2">$1</em>')))
	}}, "omim-disease-info": {hint: "About this disease", service: "/get/PhenoTips/OmimInfoService", callback: function (f, n) {
		var k = f.helpBox.content;
		var e = function (p, l, q) {
			return new Element(p, l && {"class": l} || {}).update(q || "")
		};
		k.update(e("span", "info").insert(e("span", "key").update(n.id)).insert(" ").insert(e("span", "value").update(n.label.splice(0, 1)[0])));
		var g = {label: "", symptoms: "This disorder is typically characterized by", not_symptoms: "This disorder does not typically cause"};
		var o = e("dl");
		for (var d in g) {
			if (n[d] && n[d].length > 0) {
				o.insert(e("dt", "", g[d]));
				n[d].each(function (l) {
					o.insert(e("dd", "", l.label || l))
				})
			}
		}
		if (o.firstDescendant()) {
			k.insert(o)
		}
		var m = new Element("a", {"class": "button", href: "http://www.omim.org/entry/" + n.id, target: "_blank"}).update("Read about it on OMIM.org...");
		k.insert(e("div", "term-tools").insert(m.wrap("span", {"class": "buttonwrapper"})));
		m.observe("click", function (l) {
			l.stop();
			window.open(m.href)
		});
		if (n.gene_reviews_link) {
			var h = new Element("a", {"class": "button", href: n.gene_reviews_link, target: "_blank"}).update("Read about it on Gene Reviews...");
			k.insert(e("div", "term-tools").insert(h.wrap("span", {"class": "buttonwrapper"})));
			h.observe("click", function (l) {
				l.stop();
				window.open(h.href)
			})
		}
	}}, "gene-info": {hint: "About this gene", service: "/get/PhenoTips/GeneInfoService", callback: function (f, n) {
		var k = f.helpBox.content;
		var e = function (p, l, q) {
			return new Element(p, l && {"class": l} || {}).update(q || "")
		};
		k.update(e("span", "info").insert(e("span", "key").update(n.symbol)).insert(" ").insert(e("span", "value").update(n.name)));
		var g = {alias_symbol: "Aliases", prev_symbol: "Previous symbols", gene_family: "Gene family"};
		var o = e("dl");
		for (var d in g) {
			if (n[d] && n[d].length > 0) {
				o.insert(e("dt", "", g[d]));
				if (Object.prototype.toString.call(n[d]) === "[object Array]") {
					n[d].each(function (l) {
						o.insert(e("dd", "", l.label || l))
					})
				} else {
					o.insert(e("dd", "", n[d]))
				}
			}
		}
		if (o.firstDescendant()) {
			k.insert(o)
		}
		if (n.external_ids) {
			var h = e("div", "term-tools");
			var m = [
				{name: "GENECARDS", url: "http://www.genecards.org/cgi-bin/carddisp.pl?gene=", field: "genecards_id"},
				{name: "OMIM", url: "http://www.omim.org/entry/", field: "omim_id"},
				{name: "Entrez", url: "http://www.ncbi.nlm.nih.gov/gene/?term=", field: "entrez_id"},
				{name: "RefSeq", url: "http://www.ncbi.nlm.nih.gov/nuccore/", field: "refseq_accession"},
				{name: "Ensembl", url: "http://useast.ensembl.org/Homo_sapiens/Gene/Compara_Tree?g=", field: "ensembl_gene_id"}
			];
			m.each(function (l) {
				var p = n.external_ids[l.field];
				if (p) {
					if (!p.each) {
						p = [p]
					}
					p.each(function (q) {
						h.insert(new Element("a", {href: l.url + q, "class": "button"}).update(l.name + ": " + q).wrap("span", {"class": "buttonwrapper"}))
					})
				}
			});
			h.select("a").each(function (l) {
				l.observe("click", function (p) {
					p.stop();
					window.open(l.href)
				})
			});
			k.insert(h)
		}
	}}}, initialize: function (e) {
		this.icon = e;
		this._information = this.icon._information || this.icon.title;
		for (var d in this.infoServices) {
			if (this.icon.hasClassName(d)) {
				this._builder = this.infoServices[d];
				this.icon.title = this.infoServices[d].hint || ""
			}
		}
		if (!this._builder) {
			return
		}
		this.icon.observe("click", this.toggleHelp.bindAsEventListener(this));
		this.hideAllHelpOnOutsideClick = this.hideAllHelpOnOutsideClick.bindAsEventListener(this)
	}, toggleHelp: function () {
		if (!this.helpBox || this.helpBox.hasClassName("hidden")) {
			this.showHelp();
			document.observe("click", this.hideAllHelpOnOutsideClick)
		} else {
			this.hideHelp()
		}
	}, hideAllHelpOnOutsideClick: function (d) {
		if (!d.findElement(".xTooltip") && !d.findElement(".xHelpButton")) {
			this.hideHelp();
			document.stopObserving("click", this.hideAllHelpOnOutsideClick)
		}
	}, hideHelp: function (d) {
		d && d.stop();
		if (this.helpBox) {
			if (this.helpBox.hasClassName("error")) {
				this.helpBox.remove();
				delete this.helpBox
			} else {
				this.helpBox.addClassName("hidden")
			}
		}
	}, showHelp: function () {
		if (!this.helpBox) {
			this.createHelpBox()
		}
		$$("div.xTooltip:not(.hidden)").invoke("_hideHelp");
		this.helpBox.removeClassName("hidden")
	}, createHelpBox: function () {
		this.helpBox = new Element("div", {"class": "hidden xTooltip"});
		this.helpBox._behavior = this;
		this.helpBox._hideHelp = function () {
			this._behavior.hideHelp()
		}.bind(this.helpBox);
		this.helpBox.content = new Element("div");
		this.helpBox.insert(this.helpBox.content);
		if (this._builder.service) {
			this.createHelpContentFromService()
		} else {
			this._builder.callback && this._builder.callback(this)
		}
		var d = new Element("span", {"class": "hide-tool", title: "Hide"});
		d.update("×");
		d.observe("click", this.hideHelp.bindAsEventListener(this));
		this.helpBox.insert({top: d});
		this.icon.insert({after: this.helpBox})
	}, createHelpContentFromService: function () {
		var d = this;
		new Ajax.Request(d._builder.service, {parameters: {id: d._information}, onCreate: function () {
			d.helpBox.content.update(new Element("span", {"class": "hint temporary"}).update("Loading..."))
		}, onSuccess: function (e) {
			d._builder.callback(d, e.responseJSON)
		}, onFailure: function (e) {
			d.helpBox.addClassName("error");
			d.helpBox.down(".temporary").remove();
			d.helpBox.insert("Failed to retrieve information about __subject__".replace("__subject__", d._information) + " : " + e.statusText)
		}})
	}});
	var b = function (d) {
		((d && d.memo.elements) || [$("body")]).each(function (e) {
			(e.hasClassName("xHelpButton") ? [e] : e.select(".xHelpButton")).each(function (f) {
				if (!f.__helpController) {
					f.__helpController = new c.widgets.HelpButton(f)
				}
			})
		});
		return true
	};
	(XWiki.domIsLoaded && b()) || document.observe("xwiki:dom:loaded", b);
	document.observe("xwiki:dom:updated", b);
	return c
}(PhenoTips || {}));
var PhenoTips = (function (c) {
	var a = c.widgets = c.widgets || {};
	a.FuzzyDatePickerDropdown = Class.create({initialize: function (d) {
		this.span = new Element("span");
		this.options = d;
		this.callback = null
	}, populate: function (e) {
		var d = this.dropdown ? (this.dropdown.selectedIndex || this._tmpSelectedIndex) : 0;
		var f = '<select name="' + this.options.name + '" class="' + (this.options.cssClass || this.options.name || "") + '" placeholder="' + (this.options.hint || this.options.name || "") + '" title="' + (this.options.hint || this.options.name || "") + '">';
		f += '<option value="" class="empty"> </option>';
		e.each(function (g) {
			f += '<option value="' + g.value + '"';
			if (g.cssClass) {
				f += ' class="' + g.cssClass + '"'
			}
			if (g.selected) {
				f += ' selected="selected"'
			}
			f += ">" + (g.text || g.value || "") + "</option>"
		});
		f += "</select>";
		this.span.innerHTML = f;
		this.dropdown = this.span.firstChild;
		this.callback && this.onSelect(this.callback);
		if (this.dropdown.selectedIndex <= 0 && d >= 0 && d < this.dropdown.options.length) {
			this.dropdown.selectedIndex = d
		}
	}, enable: function () {
		this.dropdown.enable();
		if (this.dropdown.selectedIndex <= 0 && this._tmpSelectedIndex < this.dropdown.options.length) {
			this.dropdown.selectedIndex = this._tmpSelectedIndex;
			return(this._tmpSelectedIndex > 0)
		}
		return false
	}, disable: function () {
		this.dropdown.disable();
		this._tmpSelectedIndex = this.dropdown.selectedIndex;
		this.dropdown.selectedIndex = 0
	}, getElement: function () {
		return this.span
	}, onSelect: function (f) {
		var e = this;
		this.callback = f;
		var d = ["change"];
		browser.isGecko && d.push("keyup");
		d.each(function (g) {
			e.dropdown.observe(g, function () {
				f();
				e._tmpSelectedIndex = e.dropdown.selectedIndex
			})
		})
	}, onFocus: function (e) {
		var d = this;
		this.dropdown.observe("focus", function () {
			e();
			if (d.dropdown.selectedIndex == -1 && d._tmpSelectedIndex < d.dropdown.options.size()) {
				d.dropdown.selectedIndex = d._tmpSelectedIndex
			}
		})
	}, onBlur: function (d) {
		this.dropdown.observe("blur", d)
	}, getSelectedValue: function () {
		return(this.dropdown.selectedIndex >= 0) ? this.dropdown.options[this.dropdown.selectedIndex].value : ""
	}, getSelectedClass: function () {
		return(this.dropdown.selectedIndex >= 0) ? this.dropdown.options[this.dropdown.selectedIndex].className : ""
	}, getSelectedOption: function () {
		return(this.dropdown.selectedIndex >= 0) ? this.dropdown.options[this.dropdown.selectedIndex].innerHTML : ""
	}});
	a.FuzzyDatePicker = Class.create({initialize: function (d) {
		if (!d) {
			return
		}
		this.__input = d;
		this.__input.hide();
		this.__fuzzyInput = $(this.__input.name + "_entered");
		if (this.__fuzzyInput) {
			this.__recordBoth = true
		}
		if (this.__fuzzyInput && this.__fuzzyInput.value) {
			this.__date = JSON.parse(this.__fuzzyInput.value || "{}")
		} else {
			if (this.__input.alt) {
				var f = new Date(this.__input.alt);
				this.__date = {year: f.getUTCFullYear(), month: f.getUTCMonth() + 1, day: f.getUTCDate()}
			} else {
				this.__date = {}
			}
		}
		this.container = new Element("div", {"class": "fuzzy-date-picker"});
		this.__input.insert({before: this.container});
		var g = (this.__input.title || "yyyy-MM-dd").split(/\W+/);
		for (var e = 0; e < g.length; ++e) {
			switch (g[e][0]) {
				case"y":
					this.container.insert(this.createYearDropdown());
					break;
				case"M":
					this.container.insert(this.createMonthDropdown());
					break;
				case"d":
					this.container.insert(this.createDayDropdown());
					break
			}
		}
		this.container.observe("datepicker:date:changed", this.onProgrammaticUpdate.bind(this));
		this.onProgrammaticUpdate()
	}, onProgrammaticUpdate: function () {
		this.yearSelected();
		this.monthSelected();
		this.updateDate()
	}, createYearDropdown: function () {
		this.yearSelector = new a.FuzzyDatePickerDropdown({name: "year"});
		var g = new Date();
		var l = g.getYear() + 1900;
		var f = 1900;
		var e = (this.__date.hasOwnProperty("range") && this.__date.range.hasOwnProperty("years")) ? this.__date.range.years : 1;
		var k = this.__date.hasOwnProperty("year") ? this.__date.year : null;
		var d = [];
		if (k > l) {
			d.push({value: k, selected: true})
		}
		for (var m = l; m >= f; --m) {
			d.push({value: m, selected: ((k == m) && (e <= 1))});
			if (m % 10 == 0) {
				d.push({value: (m + "s"), cssClass: "decade", text: (m + "s"), selected: ((k == m) && (e > 1))})
			}
		}
		var h = function (o) {
			var n = o + 100;
			if (k != null && k >= o && k < n && e == 1) {
				d.push({value: k, selected: true})
			}
			var p = (k != null) && (k >= o) && (k < n) && (e > 1);
			d.push({value: o + "s", cssClass: "century", selected: p})
		};
		h(1800);
		h(1700);
		h(1600);
		h(1500);
		if (k != null && k < 1500) {
			d.push({value: k, selected: true})
		}
		this.yearSelector.populate(d);
		this.yearSelector.onSelect(this.yearSelected.bind(this));
		return this.yearSelector.getElement()
	}, yearSelected: function () {
		if (!this.yearSelector) {
			return
		}
		if (this.yearSelector.getSelectedValue() > 0) {
			this.monthSelector && this.monthSelected()
		}
		this.updateDate()
	}, createMonthDropdown: function () {
		this.monthSelector = new a.FuzzyDatePickerDropdown({name: "month"});
		this.monthSelector.populate(this.getZeroPaddedValueRange(1, 12, this.__date.month));
		this.monthSelector.onSelect(this.monthSelected.bind(this));
		return this.monthSelector.getElement()
	}, monthSelected: function () {
		if (!this.monthSelector) {
			return
		}
		if (this.monthSelector.getSelectedValue() > 0) {
			this.daySelector && this.daySelector.populate(this.getAvailableDays())
		}
		this.updateDate()
	}, createDayDropdown: function () {
		this.daySelector = new a.FuzzyDatePickerDropdown({name: "day"});
		this.daySelector.populate(this.getZeroPaddedValueRange(1, 31, this.__date.day));
		this.daySelector.onSelect(this.updateDate.bind(this));
		return this.daySelector.getElement()
	}, getAvailableDays: function () {
		var e = this.yearSelector.getSelectedValue() * 1;
		var f = this.monthSelector.getSelectedValue() * 1;
		var d = 0;
		if ([1, 3, 5, 7, 8, 10, 12].indexOf(f) >= 0) {
			d = 31
		} else {
			if ([4, 6, 9, 11].indexOf(f) >= 0) {
				d = 30
			} else {
				if (f == 2) {
					if (e % 4 == 0 && (e % 100 != 0 || e % 400 == 0)) {
						d = 29
					} else {
						d = 28
					}
				}
			}
		}
		return this.getZeroPaddedValueRange(1, d)
	}, getZeroPaddedValue: function (d) {
		return d ? ("0" + d).slice(-2) : "01"
	}, getZeroPaddedValueRange: function (h, d, g) {
		var f = [];
		if (h <= d) {
			for (var e = h; e <= d; ++e) {
				f.push({value: e, text: ("0" + e).slice(-2), selected: g == e})
			}
		} else {
			for (var e = d; e <= h; --e) {
				f.push({value: e, text: ("0" + e).slice(-2), selected: g == e})
			}
		}
		return f
	}, updateDate: function () {
		var k = {};
		var o = this.yearSelector.getSelectedValue();
		var f = o.match(/(\d\d\d\d)s$/);
		if (f) {
			var g = (this.yearSelector.getSelectedClass() == "century") ? 100 : 10;
			k.range = {years: g};
			k.year = parseInt(f[1])
		} else {
			if (o != "") {
				k.year = parseInt(o)
			}
		}
		if (o > 0) {
			var e = this.monthSelector && this.monthSelector.getSelectedValue();
			if (e > 0) {
				k.month = parseInt(this.monthSelector.getSelectedOption());
				var n = this.daySelector && this.daySelector.getSelectedValue();
				if (n > 0) {
					k.day = parseInt(this.daySelector.getSelectedOption())
				}
			}
		}
		var l = JSON.stringify(k);
		if (this.__recordBoth) {
			var h = this.__fuzzyInput.value;
			if (l != h) {
				this.__fuzzyInput.value = JSON.stringify(k);
				this.__input.value = (o && !o.match(/\d\d\d\ds$/)) ? (o + "-" + this.getZeroPaddedValue(e) + "-" + this.getZeroPaddedValue(n)) : "";
				this.__input.alt = (o && !o.match(/\d\d\d\ds$/)) ? (o + "-" + this.getZeroPaddedValue(e) + "-" + this.getZeroPaddedValue(n) + "T00:00:00Z") : "";
				this.__input.fire("xwiki:date:changed")
			}
		} else {
			var h = this.__input.value;
			if (l != h) {
				this.__input.value = JSON.stringify(k);
				this.__input.alt = (o && !o.match(/\d\d\d\ds$/)) ? (o + "-" + this.getZeroPaddedValue(e) + "-" + this.getZeroPaddedValue(n) + "T00:00:00Z") : "";
				this.__input.fire("xwiki:date:changed")
			}
		}
	}});
	var b = function (d) {
		((d && d.memo.elements) || [$("body")]).each(function (e) {
			(e.hasClassName("fuzzy-date") ? [e] : e.select(".fuzzy-date")).each(function (f) {
				if (!f.__datePicker) {
					f.__datePicker = new c.widgets.FuzzyDatePicker(f)
				}
			})
		});
		return true
	};
	(XWiki.domIsLoaded && b()) || document.observe("xwiki:dom:loaded", b);
	document.observe("xwiki:dom:updated", b);
	return c
}(PhenoTips || {}));
(function () {
	var a = function (b) {
		var c = (b && b.memo.elements) || [$("body")];
		c.each(function (d) {
			d.select("input.suggestWorkgroups").each(function (e) {
				if (!e.hasClassName("initialized")) {
					var f = {script: new XWiki.Document("SuggestWorkgroupsService", "PhenoTips").getURL("get", "outputSyntax=plain&"), noresults: "Group not found"};
					if (e.hasClassName("global")) {
						f.script = f.script + "wiki=global&"
					}
					new XWiki.widgets.UserPicker(e, f);
					e.addClassName("initialized")
				}
			})
		})
	};
	(XWiki.domIsLoaded && a()) || document.observe("xwiki:dom:loaded", a);
	document.observe("xwiki:dom:updated", a)
})();
var PhenoTips = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.SegmentedBar = Class.create({options: {segments: 5, displayValue: true}, initialize: function (d, c) {
		this.value = d;
		this.options = Object.extend(Object.clone(this.options), c || {})
	}, generateSegmentedBar: function () {
		if (this.value > 1 || this.value < 0) {
			console.log("Invalid segmented bar value");
			return
		}
		var g = new Element("div", {"class": "segmented-bar", title: Math.round(this.value * 100) + "%" || ""});
		var d = 1 / this.options.segments;
		for (var e = 0; e < this.options.segments; ++e) {
			var c = 100 * Math.min(Math.max((this.value - e * d) / d, 0), 1);
			var f = new Element("span", {"class": "segmented-unit"});
			var h = new Element("span", {"class": "segmented-unit-fill"});
			h.setStyle({width: c + "%", });
			f.insert(h);
			g.insert(f)
		}
		if (this.options.displayValue) {
			g.insert(" " + Math.round(this.value * 100) + "%")
		}
		return g
	}});
	return b
})(PhenoTips || {});