Date.CultureInfo = {name: "en-US", englishName: "English (United States)", nativeName: "English (United States)", dayNames: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], abbreviatedDayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], shortestDayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], firstLetterDayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], amDesignator: "AM", pmDesignator: "PM", firstDayOfWeek: 0, dateElementOrder: "mdy", formatPatterns: {shortDate: "M/d/yyyy", longDate: "dddd, MMMM dd, yyyy", shortTime: "h:mm tt", longTime: "h:mm:ss tt", fullDateTime: "dddd, MMMM dd, yyyy h:mm:ss tt", sortableDateTime: "yyyy-MM-ddTHH:mm:ss", universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ", rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT", monthDay: "MMMM dd", yearMonth: "MMMM, yyyy"}, regexPatterns: {jan: /^(January)|(Jan)/i, feb: /^(February)|(Feb)/i, mar: /^(March)|(Mar)/i, apr: /^(April)|(Apr)/i, may: /^(May)|(May)/i, jun: /^(June)|(Jun)/i, jul: /^(July)|(Jul)/i, aug: /^(August)|(Aug)/i, sep: /^(September)|(Sep)/i, oct: /^(October)|(Oct)/i, nov: /^(November)|(Nov)/i, dec: /^(December)|(Dec)/i, sun: /^(Monday)|(Mon)|(Mon)|(Mon)/i, mon: /^(Tuesday)|(Tue)|(Tue)|(Tue)/i, tue: /^(Wednesday)|(Wed)|(Wed)|(Wed)/i, wed: /^(Thursday)|(Thu)|(Thu)|(Thu)/i, thu: /^(Friday)|(Fri)|(Fri)|(Fri)/i, fri: /^(Saturday)|(Sat)|(Sat)|(Sat)/i, sat: /^(Sunday)|(Sun)|(Sun)|(Sun)/i, future: /^next/i, past: /^last|past|prev(ious)?/i, add: /^(\+|aft(er)?|from|hence)/i, subtract: /^(\-|bef(ore)?|ago)/i, yesterday: /^yes(terday)?/i, today: /^t(od(ay)?)?/i, tomorrow: /^tom(orrow)?/i, now: /^n(ow)?/i, millisecond: /^ms|milli(second)?s?/i, second: /^sec(ond)?s?/i, minute: /^mn|min(ute)?s?/i, hour: /^h(our)?s?/i, week: /^w(eek)?s?/i, month: /^m(onth)?s?/i, day: /^d(ay)?s?/i, year: /^y(ear)?s?/i, shortMeridian: /^(a|p)/i, longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i, timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i, ordinalSuffix: /^\s*(st|nd|rd|th)/i, timeContext: /^\s*(\:|a(?!u|p)|p)/i}, timezones: [
	{name: "UTC", offset: "-000"},
	{name: "GMT", offset: "-000"},
	{name: "EST", offset: "-0500"},
	{name: "EDT", offset: "-0400"},
	{name: "CST", offset: "-0600"},
	{name: "CDT", offset: "-0500"},
	{name: "MST", offset: "-0700"},
	{name: "MDT", offset: "-0600"},
	{name: "PST", offset: "-0800"},
	{name: "PDT", offset: "-0700"}
]};
_translations = {OK: "OK", Now: "Now", Today: "Today", Clear: "Clear"};
Date.getMonthNumberFromName = function (b) {
	var e = Date.CultureInfo.monthNames, a = Date.CultureInfo.abbreviatedMonthNames, d = b.toLowerCase();
	for (var c = 0; c < e.length; c++) {
		if (e[c].toLowerCase() == d || a[c].toLowerCase() == d) {
			return c
		}
	}
	return -1
};
Date.getDayNumberFromName = function (b) {
	var f = Date.CultureInfo.dayNames, a = Date.CultureInfo.abbreviatedDayNames, e = Date.CultureInfo.shortestDayNames, d = b.toLowerCase();
	for (var c = 0; c < f.length; c++) {
		if (f[c].toLowerCase() == d || a[c].toLowerCase() == d) {
			return c
		}
	}
	return -1
};
Date.isLeapYear = function (a) {
	return(((a % 4 === 0) && (a % 100 !== 0)) || (a % 400 === 0))
};
Date.getDaysInMonth = function (a, b) {
	return[31, (Date.isLeapYear(a) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][b]
};
Date.getTimezoneOffset = function (a, b) {
	return(b || false) ? Date.CultureInfo.abbreviatedTimeZoneDST[a.toUpperCase()] : Date.CultureInfo.abbreviatedTimeZoneStandard[a.toUpperCase()]
};
Date.getTimezoneAbbreviation = function (b, d) {
	var c = (d || false) ? Date.CultureInfo.abbreviatedTimeZoneDST : Date.CultureInfo.abbreviatedTimeZoneStandard, a;
	for (a in c) {
		if (c[a] === b) {
			return a
		}
	}
	return null
};
Date.prototype.clone = function () {
	return new Date(this.getTime())
};
Date.prototype.compareTo = function (a) {
	if (isNaN(this)) {
		throw new Error(this)
	}
	if (a instanceof Date && !isNaN(a)) {
		return(this > a) ? 1 : (this < a) ? -1 : 0
	} else {
		throw new TypeError(a)
	}
};
Date.prototype.equals = function (a) {
	return(this.compareTo(a) === 0)
};
Date.prototype.between = function (c, a) {
	var b = this.getTime();
	return b >= c.getTime() && b <= a.getTime()
};
Date.prototype.addMilliseconds = function (a) {
	this.setMilliseconds(this.getMilliseconds() + a);
	return this
};
Date.prototype.addSeconds = function (a) {
	return this.addMilliseconds(a * 1000)
};
Date.prototype.addMinutes = function (a) {
	return this.addMilliseconds(a * 60000)
};
Date.prototype.addHours = function (a) {
	return this.addMilliseconds(a * 3600000)
};
Date.prototype.addDays = function (a) {
	return this.addMilliseconds(a * 86400000)
};
Date.prototype.addWeeks = function (a) {
	return this.addMilliseconds(a * 604800000)
};
Date.prototype.addMonths = function (a) {
	var b = this.getDate();
	this.setDate(1);
	this.setMonth(this.getMonth() + a);
	this.setDate(Math.min(b, this.getDaysInMonth()));
	return this
};
Date.prototype.addYears = function (a) {
	return this.addMonths(a * 12)
};
Date.prototype.add = function (b) {
	if (typeof b == "number") {
		this._orient = b;
		return this
	}
	var a = b;
	if (a.millisecond || a.milliseconds) {
		this.addMilliseconds(a.millisecond || a.milliseconds)
	}
	if (a.second || a.seconds) {
		this.addSeconds(a.second || a.seconds)
	}
	if (a.minute || a.minutes) {
		this.addMinutes(a.minute || a.minutes)
	}
	if (a.hour || a.hours) {
		this.addHours(a.hour || a.hours)
	}
	if (a.month || a.months) {
		this.addMonths(a.month || a.months)
	}
	if (a.year || a.years) {
		this.addYears(a.year || a.years)
	}
	if (a.day || a.days) {
		this.addDays(a.day || a.days)
	}
	return this
};
Date._validate = function (d, c, a, b) {
	if (typeof d != "number") {
		throw new TypeError(d + " is not a Number.")
	} else {
		if (d < c || d > a) {
			throw new RangeError(d + " is not a valid value for " + b + ".")
		}
	}
	return true
};
Date.validateMillisecond = function (a) {
	return Date._validate(a, 0, 999, "milliseconds")
};
Date.validateSecond = function (a) {
	return Date._validate(a, 0, 59, "seconds")
};
Date.validateMinute = function (a) {
	return Date._validate(a, 0, 59, "minutes")
};
Date.validateHour = function (a) {
	return Date._validate(a, 0, 23, "hours")
};
Date.validateDay = function (c, a, b) {
	return Date._validate(c, 1, Date.getDaysInMonth(a, b), "days")
};
Date.validateMonth = function (a) {
	return Date._validate(a, 0, 11, "months")
};
Date.validateYear = function (a) {
	return Date._validate(a, 1, 9999, "seconds")
};
Date.prototype.set = function (b) {
	var a = b;
	if (!a.millisecond && a.millisecond !== 0) {
		a.millisecond = -1
	}
	if (!a.second && a.second !== 0) {
		a.second = -1
	}
	if (!a.minute && a.minute !== 0) {
		a.minute = -1
	}
	if (!a.hour && a.hour !== 0) {
		a.hour = -1
	}
	if (!a.day && a.day !== 0) {
		a.day = -1
	}
	if (!a.month && a.month !== 0) {
		a.month = -1
	}
	if (!a.year && a.year !== 0) {
		a.year = -1
	}
	if (a.millisecond != -1 && Date.validateMillisecond(a.millisecond)) {
		this.addMilliseconds(a.millisecond - this.getMilliseconds())
	}
	if (a.second != -1 && Date.validateSecond(a.second)) {
		this.addSeconds(a.second - this.getSeconds())
	}
	if (a.minute != -1 && Date.validateMinute(a.minute)) {
		this.addMinutes(a.minute - this.getMinutes())
	}
	if (a.hour != -1 && Date.validateHour(a.hour)) {
		this.addHours(a.hour - this.getHours())
	}
	if (a.month !== -1 && Date.validateMonth(a.month)) {
		this.addMonths(a.month - this.getMonth())
	}
	if (a.year != -1 && Date.validateYear(a.year)) {
		this.addYears(a.year - this.getFullYear())
	}
	if (a.day != -1 && Date.validateDay(a.day, this.getFullYear(), this.getMonth())) {
		this.addDays(a.day - this.getDate())
	}
	if (a.timezone) {
		this.setTimezone(a.timezone)
	}
	if (a.timezoneOffset) {
		this.setTimezoneOffset(a.timezoneOffset)
	}
	return this
};
Date.prototype.clearTime = function () {
	this.setHours(0);
	this.setMinutes(0);
	this.setSeconds(0);
	this.setMilliseconds(0);
	return this
};
Date.prototype.isLeapYear = function () {
	var a = this.getFullYear();
	return(((a % 4 === 0) && (a % 100 !== 0)) || (a % 400 === 0))
};
Date.prototype.isWeekday = function () {
	return !(this.is().sat() || this.is().sun())
};
Date.prototype.getDaysInMonth = function () {
	return Date.getDaysInMonth(this.getFullYear(), this.getMonth())
};
Date.prototype.moveToFirstDayOfMonth = function () {
	return this.set({day: 1})
};
Date.prototype.moveToLastDayOfMonth = function () {
	return this.set({day: this.getDaysInMonth()})
};
Date.prototype.moveToDayOfWeek = function (a, b) {
	var c = (a - this.getDay() + 7 * (b || +1)) % 7;
	return this.addDays((c === 0) ? c += 7 * (b || +1) : c)
};
Date.prototype.moveToMonth = function (c, a) {
	var b = (c - this.getMonth() + 12 * (a || +1)) % 12;
	return this.addMonths((b === 0) ? b += 12 * (a || +1) : b)
};
Date.prototype.getDayOfYear = function () {
	return Math.floor((this - new Date(this.getFullYear(), 0, 1)) / 86400000)
};
Date.prototype.getWeekOfYear = function (a) {
	var i = this.getFullYear(), c = this.getMonth(), f = this.getDate();
	var k = a || Date.CultureInfo.firstDayOfWeek;
	var e = 7 + 1 - new Date(i, 0, 1).getDay();
	if (e == 8) {
		e = 1
	}
	var b = ((Date.UTC(i, c, f, 0, 0, 0) - Date.UTC(i, 0, 1, 0, 0, 0)) / 86400000) + 1;
	var j = Math.floor((b - e + 7) / 7);
	if (j === k) {
		i--;
		var g = 7 + 1 - new Date(i, 0, 1).getDay();
		if (g == 2 || g == 8) {
			j = 53
		} else {
			j = 52
		}
	}
	return j
};
Date.prototype.isDST = function () {
	console.log("isDST");
	return this.toString().match(/(E|C|M|P)(S|D)T/)[2] == "D"
};
Date.prototype.getTimezone = function () {
	return Date.getTimezoneAbbreviation(this.getUTCOffset, this.isDST())
};
Date.prototype.setTimezoneOffset = function (b) {
	var a = this.getTimezoneOffset(), c = Number(b) * -6 / 10;
	this.addMinutes(c - a);
	return this
};
Date.prototype.setTimezone = function (a) {
	return this.setTimezoneOffset(Date.getTimezoneOffset(a))
};
Date.prototype.getUTCOffset = function () {
	var b = this.getTimezoneOffset() * -10 / 6, a;
	if (b < 0) {
		a = (b - 10000).toString();
		return a[0] + a.substr(2)
	} else {
		a = (b + 10000).toString();
		return"+" + a.substr(1)
	}
};
Date.prototype.getDayName = function (a) {
	return a ? Date.CultureInfo.abbreviatedDayNames[this.getDay()] : Date.CultureInfo.dayNames[this.getDay()]
};
Date.prototype.getMonthName = function (a) {
	return a ? Date.CultureInfo.abbreviatedMonthNames[this.getMonth()] : Date.CultureInfo.monthNames[this.getMonth()]
};
Date.prototype._toString = Date.prototype.toString;
Date.prototype.toString = function (c) {
	var a = this.toUTC();
	var b = function b(d) {
		return(d.toString().length == 1) ? "0" + d : d
	};
	return c ? c.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g, function (d) {
		switch (d) {
			case"hh":
				return b(a.getHours() < 13 ? a.getHours() : (a.getHours() - 12));
			case"h":
				return a.getHours() < 13 ? a.getHours() : (a.getHours() - 12);
			case"HH":
				return b(a.getHours());
			case"H":
				return a.getHours();
			case"mm":
				return b(a.getMinutes());
			case"m":
				return a.getMinutes();
			case"ss":
				return b(a.getSeconds());
			case"s":
				return a.getSeconds();
			case"yyyy":
				return a.getFullYear();
			case"yy":
				return a.getFullYear().toString().substring(2, 4);
			case"dddd":
				return a.getDayName();
			case"ddd":
				return a.getDayName(true);
			case"dd":
				return b(a.getDate());
			case"d":
				return a.getDate().toString();
			case"MMMM":
				return a.getMonthName();
			case"MMM":
				return a.getMonthName(true);
			case"MM":
				return b((a.getMonth() + 1));
			case"M":
				return a.getMonth() + 1;
			case"t":
				return a.getHours() < 12 ? Date.CultureInfo.amDesignator.substring(0, 1) : Date.CultureInfo.pmDesignator.substring(0, 1);
			case"tt":
				return a.getHours() < 12 ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
			case"zzz":
			case"zz":
			case"z":
				return"Z"
		}
	}) : this._toString()
};
TimeSpan = function (f, a, d, e, c) {
	this.days = 0;
	this.hours = 0;
	this.minutes = 0;
	this.seconds = 0;
	this.milliseconds = 0;
	if (arguments.length == 5) {
		this.days = f;
		this.hours = a;
		this.minutes = d;
		this.seconds = e;
		this.milliseconds = c
	} else {
		if (arguments.length == 1 && typeof f == "number") {
			var b = (f < 0) ? -1 : +1;
			this.milliseconds = Math.abs(f);
			this.days = Math.floor(this.milliseconds / (24 * 60 * 60 * 1000)) * b;
			this.milliseconds = this.milliseconds % (24 * 60 * 60 * 1000);
			this.hours = Math.floor(this.milliseconds / (60 * 60 * 1000)) * b;
			this.milliseconds = this.milliseconds % (60 * 60 * 1000);
			this.minutes = Math.floor(this.milliseconds / (60 * 1000)) * b;
			this.milliseconds = this.milliseconds % (60 * 1000);
			this.seconds = Math.floor(this.milliseconds / 1000) * b;
			this.milliseconds = this.milliseconds % 1000;
			this.milliseconds = this.milliseconds * b;
			return this
		} else {
			return null
		}
	}
};
TimeSpan.prototype.compare = function (c) {
	var b = new Date(1970, 1, 1, this.hours(), this.minutes(), this.seconds()), a;
	if (c === null) {
		a = new Date(1970, 1, 1, 0, 0, 0)
	} else {
		a = new Date(1970, 1, 1, c.hours(), c.minutes(), c.seconds())
	}
	return(b > a) ? 1 : (b < a) ? -1 : 0
};
TimeSpan.prototype.add = function (a) {
	return(a === null) ? this : this.addSeconds(a.getTotalMilliseconds() / 1000)
};
TimeSpan.prototype.subtract = function (a) {
	return(a === null) ? this : this.addSeconds(-a.getTotalMilliseconds() / 1000)
};
TimeSpan.prototype.addDays = function (a) {
	return new TimeSpan(this.getTotalMilliseconds() + (a * 24 * 60 * 60 * 1000))
};
TimeSpan.prototype.addHours = function (a) {
	return new TimeSpan(this.getTotalMilliseconds() + (a * 60 * 60 * 1000))
};
TimeSpan.prototype.addMinutes = function (a) {
	return new TimeSpan(this.getTotalMilliseconds() + (a * 60 * 1000))
};
TimeSpan.prototype.addSeconds = function (a) {
	return new TimeSpan(this.getTotalMilliseconds() + (a * 1000))
};
TimeSpan.prototype.addMilliseconds = function (a) {
	return new TimeSpan(this.getTotalMilliseconds() + a)
};
TimeSpan.prototype.getTotalMilliseconds = function () {
	return(this.days() * (24 * 60 * 60 * 1000)) + (this.hours() * (60 * 60 * 1000)) + (this.minutes() * (60 * 1000)) + (this.seconds() * (1000))
};
TimeSpan.prototype.get12HourHour = function () {
	return((h = this.hours() % 12) ? h : 12)
};
TimeSpan.prototype.getDesignator = function () {
	return(this.hours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator
};
TimeSpan.prototype.toString = function (c) {
	function d() {
		if (this.days() !== null && this.days() > 0) {
			return this.days() + "." + this.hours() + ":" + b(this.minutes()) + ":" + b(this.seconds())
		} else {
			return this.hours() + ":" + b(this.minutes()) + ":" + b(this.seconds())
		}
	}

	function b(e) {
		return(e.toString().length < 2) ? "0" + e : e
	}

	var a = this;
	return c ? c.replace(/d|dd|HH|H|hh|h|mm|m|ss|s|tt|t/g, function (e) {
		switch (e) {
			case"d":
				return a.days();
			case"dd":
				return b(a.days());
			case"H":
				return a.hours();
			case"HH":
				return b(a.hours());
			case"h":
				return a.get12HourHour();
			case"hh":
				return b(a.get12HourHour());
			case"m":
				return a.minutes();
			case"mm":
				return b(a.minutes());
			case"s":
				return a.seconds();
			case"ss":
				return b(a.seconds());
			case"t":
				return((this.hours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator).substring(0, 1);
			case"tt":
				return(this.hours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator
		}
	}) : this._toString()
};
var TimePeriod = function (e, a, m, g, c, j, b) {
	this.years = 0;
	this.months = 0;
	this.days = 0;
	this.hours = 0;
	this.minutes = 0;
	this.seconds = 0;
	this.milliseconds = 0;
	if (arguments.length == 2 && arguments[0] instanceof Date && arguments[1] instanceof Date) {
		var n = e.clone();
		var l = a.clone();
		var k = n.clone();
		var d = (n > l) ? -1 : +1;
		this.years = l.getFullYear() - n.getFullYear();
		k.addYears(this.years);
		if (d == +1) {
			if (k > l) {
				if (this.years !== 0) {
					this.years--
				}
			}
		} else {
			if (k < l) {
				if (this.years !== 0) {
					this.years++
				}
			}
		}
		n.addYears(this.years);
		if (d == +1) {
			while (n < l && n.clone().addDays(n.getDaysInMonth()) < l) {
				n.addMonths(1);
				this.months++
			}
		} else {
			while (n > l && n.clone().addDays(-n.getDaysInMonth()) > l) {
				n.addMonths(-1);
				this.months--
			}
		}
		var i = l - n;
		if (i !== 0) {
			var f = new TimeSpan(i);
			this.days = f.days;
			this.hours = f.hours;
			this.minutes = f.minutes;
			this.seconds = f.seconds;
			this.milliseconds = f.milliseconds
		}
		return this
	}
};
Date.now = function () {
	return new Date()
};
Date.today = function () {
	return Date.now().clearTime()
};
Date.prototype._orient = +1;
Date.prototype.next = function () {
	this._orient = +1;
	return this
};
Date.prototype.last = Date.prototype.prev = Date.prototype.previous = function () {
	this._orient = -1;
	return this
};
Date.prototype._is = false;
Date.prototype.is = function () {
	this._is = true;
	return this
};
Number.prototype._dateElement = "day";
Number.prototype.fromNow = function () {
	var a = {};
	a[this._dateElement] = this;
	return Date.now().add(a)
};
Number.prototype.ago = function () {
	var a = {};
	a[this._dateElement] = this * -1;
	return Date.now().add(a)
};
(function () {
	var g = Date.prototype, a = Number.prototype;
	var q = ("sunday monday tuesday wednesday thursday friday saturday").split(/\s/), p = ("january february march april may june july august september october november december").split(/\s/), o = ("Millisecond Second Minute Hour Day Week Month Year").split(/\s/), n;
	var m = function (i) {
		return function () {
			if (this._is) {
				this._is = false;
				return this.getDay() == i
			}
			return this.moveToDayOfWeek(i, this._orient)
		}
	};
	for (var f = 0; f < q.length; f++) {
		g[q[f]] = g[q[f].substring(0, 3)] = m(f)
	}
	var l = function (i) {
		return function () {
			if (this._is) {
				this._is = false;
				return this.getMonth() === i
			}
			return this.moveToMonth(i, this._orient)
		}
	};
	for (var d = 0; d < p.length; d++) {
		g[p[d]] = g[p[d].substring(0, 3)] = l(d)
	}
	var e = function (i) {
		return function () {
			if (i.substring(i.length - 1) != "s") {
				i += "s"
			}
			return this["add" + i](this._orient)
		}
	};
	var b = function (i) {
		return function () {
			this._dateElement = i;
			return this
		}
	};
	for (var c = 0; c < o.length; c++) {
		n = o[c].toLowerCase();
		g[n] = g[n + "s"] = e(o[c]);
		a[n] = a[n + "s"] = b(n)
	}
}());
Date.prototype.toJSONString = function () {
	return this.toString("yyyy-MM-ddThh:mm:ssZ")
};
Date.prototype.toShortDateString = function () {
	return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern)
};
Date.prototype.toLongDateString = function () {
	return this.toString(Date.CultureInfo.formatPatterns.longDatePattern)
};
Date.prototype.toShortTimeString = function () {
	return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern)
};
Date.prototype.toLongTimeString = function () {
	return this.toString(Date.CultureInfo.formatPatterns.longTimePattern)
};
Date.prototype.getOrdinal = function () {
	switch (this.getDate()) {
		case 1:
		case 21:
		case 31:
			return"st";
		case 2:
		case 22:
			return"nd";
		case 3:
		case 23:
			return"rd";
		default:
			return"th"
	}
};
Date.ISO8601Format = "yyyy-MM-ddTHH:mm:ssZ";
Date.prototype.toISO8601 = function () {
	var a = this.toString(Date.ISO8601Format);
	if (a.indexOf("NaN") > -1) {
		a = ""
	}
	return a
};
Date.prototype.toUTC = function () {
	return new Date(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), 0, 0)
};
Date.prototype.setAsUTC = function () {
	var b = this.getDate();
	var e = this.getMonth();
	var d = this.getFullYear();
	var a = this.getHours();
	var c = this.getMinutes();
	this.setUTCDate(b);
	this.setUTCMonth(e);
	this.setUTCFullYear(d);
	this.setUTCHours(a);
	this.setUTCMinutes(c)
};
Date.prototype.toFormattedString = function (e) {
	var c, f;
	var b = e.format_mask;
	var d = e.convert_to_UTC ? this.toUTC() : this;
	var a = new SimpleDateFormat(b);
	f = a.format(d);
	return f
};
Date.parseISO_8601 = function (a) {
	var b = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(([+-](\d{2})([:]?(\d{2}))?)|Z)$/.exec(a);
	if (b) {
		if (b[8] == "Z") {
			return new Date(Date.UTC(parseInt(b[1], 10), parseInt(b[2], 10) - 1, parseInt(b[3], 10), parseInt(b[4], 10), parseInt(b[5], 10), parseInt(b[6], 10)))
		} else {
			return new Date(parseInt(b[1], 10), parseInt(b[2], 10) - 1, parseInt(b[3], 10), parseInt(b[4], 10), parseInt(b[5], 10), parseInt(b[6], 10))
		}
	}
};
if (typeof Prototype == "undefined") {
	alert("CalendarDateSelect Error: Prototype could not be found. Please make sure that your application's layout includes prototype.js *before* it includes calendar_date_select.js")
}
if (Prototype.Version < "1.6") {
	alert("Prototype > 1.6.0 is required.")
}
DateUtils = Class.create({weekdays: [], months: $A(Date.CultureInfo.monthNames), firstDayOfWeek: Date.CultureInfo.firstDayOfWeek, msecondsInOneDay: 24 * 60 * 60 * 1000, initialize: function () {
	var c = $A(Date.CultureInfo.firstLetterDayNames);
	this.weekdays = [];
	var b = (this.firstDayOfWeek + 6) % 7;
	for (var a = b; a >= 0 && a < c.length; ++a) {
		this.weekdays.push(c[a])
	}
	for (var a = 0; a < c.length && a < b; ++a) {
		this.weekdays.push(c[a])
	}
}, daysDistance: function (b, a) {
	return Math.round((a - b) / this.msecondsInOneDay)
}, getAMPMHour: function (b) {
	var a = b.getHours();
	return(a == 0) ? 12 : (a > 12 ? a - 12 : a)
}, getAMPM: function () {
	return(this.getHours() < 12) ? "AM" : "PM"
}});
SelectBox = Class.create({initialize: function (d, c, b, a) {
	this.element = new Element("select", {"class": b || ""});
	this.populate(c);
	Element.insert(d, this.element);
	this.element.observe("change", a)
}, populate: function (b) {
	var a = this.element;
	a.update("");
	$A(b).each(function (c) {
		if (typeof(c) != "object") {
			c = [c, c]
		}
		a.insert(new Element("option", {value: c[1]}).update(c[0]))
	})
}, setValue: function (b) {
	var c = this.element;
	var a = false;
	$R(0, c.options.length - 1).each(function (d) {
		if (c.options[d].value == b.toString()) {
			c.selectedIndex = d;
			a = true
		}
	});
	return a
}, getValue: function () {
	return $F(this.element)
}});
CalendarDateSelect = Class.create({options: {hour_format_12: false, default_format_mask: "dd/MM/yyyy", format_mask: null, convert_to_UTC: false, embedded: false, popup: null, time: false, buttons: true, clear_button: true, year_range: 10, close_on_click: null, minute_interval: 5, month_year: "dropdowns", valid_date_check: null}, initialize: function (c, b) {
	this.target_element = $(c);
	if (!this.target_element) {
		alert("Target element " + c + " not found!");
		return false
	}
	if (this.target_element.tagName != "INPUT") {
		this.target_element = this.target_element.down("INPUT")
	}
	this.target_element.calendar_date_select = this;
	this.last_click_at = 0;
	this.options = Object.extend(Object.clone(this.options), b || {});
	this.options.popup_by = this.target_element, this.options.onchange = this.options.onchange || this.target_element.onchange;
	var a = this.target_element.title || this.options.format_mask || this.options.default_format_mask;
	if (this.options.time && !a.toLowerCase().include("h") && !a.include("m") && !a.include("a")) {
		if (this.options.hour_format_12) {
			this.options.format_mask = a + " hh:mm tt"
		} else {
			this.options.format_mask = a + " HH:mm"
		}
	} else {
		this.options.format_mask = a
	}
	this.dateUtils = new DateUtils();
	this.use_time = this.options.time;
	this.parseDate();
	this.callback("before_show");
	this.initCalendarDiv();
	if (!this.options.embedded) {
		this.positionCalendarDiv();
		Event.observe(document, "mousedown", this.closeIfClickedOut_handler = this.closeIfClickedOut.bindAsEventListener(this));
		Event.observe(document, "keypress", this.keyPress_handler = this.keyPress.bindAsEventListener(this))
	}
	this.callback("after_show")
}, newElement: function (d, b) {
	b = b || {};
	var c = new Element(d, b.attrs || {}).update(b.content || "");
	if (b.style) {
		c.setStyle(b.style)
	}
	if (b.parent) {
		Element.insert(b.parent, c)
	}
	if (b.events) {
		for (var a in b.events) {
			Event.observe(c, a, b.events[a])
		}
	}
	if (b.customData) {
		for (var e in b.customData) {
			c[e] = b.customData[e]
		}
	}
	return c
}, positionCalendarDiv: function () {
	var n = false;
	var j = this.calendar_div.cumulativeOffset(), l = j[0], i = j[1], c = this.calendar_div.getDimensions(), o = c.height, b = c.width;
	var m = document.viewport.getScrollOffsets().top, d = document.viewport.getHeight();
	var p = $(this.options.popup_by).cumulativeOffset(), f = p[1], q = p[0], g = $(this.options.popup_by).getDimensions().height, k = f + g;
	if (((k + o) > (m + d)) && (k - o > m)) {
		n = true
	}
	var a = q.toString() + "px", e = (n ? (f - o) : (f + g)).toString() + "px";
	this.calendar_div.style.left = a;
	this.calendar_div.style.top = e;
	this.calendar_div.setStyle({visibility: ""});
	if (navigator.appName == "Microsoft Internet Explorer") {
		this.iframe = this.newElement("iframe", {parent: $(document.body), attrs: {src: "javascript:false", "class": "ie6_blocker"}, style: {left: a, top: e, height: o.toString() + "px", width: b.toString() + "px", border: "0px"}})
	}
}, initCalendarDiv: function () {
	if (this.options.embedded) {
		var parent = this.target_element.parentNode;
		var style = {}
	} else {
		var parent = document.body;
		var style = {position: "absolute", visibility: "hidden", left: 0, top: 0}
	}
	this.calendar_div = this.newElement("div", {parent: $(parent), attrs: {"class": "calendar_date_select"}, style: style});
	var context = this;
	$w("top header body buttons footer bottom").each(function (name) {
		eval("context." + name + "_div = context.newElement('div', {parent : context.calendar_div, attrs : { 'class': 'cds_part cds_" + name + "' } }); ")
	});
	this.initHeaderDiv();
	this.initButtonsDiv();
	this.initCalendarGrid();
	this.updateFooter("&#160;");
	this.refresh();
	this.setUseTime(this.use_time)
}, initHeaderDiv: function () {
	this.close_button = this.newElement("a", {attrs: {href: "#", "class": "close"}, content: "x", parent: this.header_div, events: {click: function (b) {
		b.stop();
		this.close()
	}.bindAsEventListener(this)}});
	this.next_month_button = this.newElement("a", {attrs: {href: "#", "class": "next"}, content: "&raquo;", parent: this.header_div, events: {click: function (b) {
		b.stop();
		this.navMonth(b, this.date.getMonth() + 1)
	}.bindAsEventListener(this)}});
	this.prev_month_button = this.newElement("a", {attrs: {href: "#", "class": "prev"}, content: "&laquo;", parent: this.header_div, events: {click: function (b) {
		b.stop();
		this.navMonth(b, this.date.getMonth() - 1)
	}.bindAsEventListener(this)}});
	var a = this.dateUtils;
	if (this.options.month_year == "dropdowns") {
		this.month_select = new SelectBox(this.header_div, $R(0, 11).map(function (b) {
			return[a.months[b], b]
		}), "month", this.navMonth.bindAsEventListener(this));
		this.year_select = new SelectBox(this.header_div, [], "year", this.navYear.bindAsEventListener(this));
		this.populateYearRange()
	} else {
		this.month_year_label = this.newElement("span", {parent: this.header_div})
	}
}, initCalendarGrid: function () {
	var a = this.body_div;
	this.calendar_day_grid = [];
	var i = this.newElement("table", {parent: a});
	var b = this.newElement("tr", {parent: this.newElement("thead", {parent: i})});

	function d(k) {
		var j = k.charCodeAt(0);
		if (64 <= j && j <= 7929) {
			return true
		}
		return false
	}

	this.dateUtils.weekdays.each(function (j) {
		Element.insert(b, new Element("th").update(d(j) ? j.substring(0, 2) : j))
	});
	var f = this.newElement("tbody", {parent: i});
	var c = 0, e;
	for (var g = 0; g < 42; g++) {
		e = (g) % 7;
		if (g % 7 == 0) {
			days_row = this.newElement("tr", {parent: f, attrs: {"class": "row_" + c++}})
		}
		this.calendar_day_grid[g] = this.newElement("td", {content: new Element("div"), parent: days_row, attrs: {"class": ((e == (7 - this.dateUtils.firstDayOfWeek) % 7) || (e == (13 - this.dateUtils.firstDayOfWeek) % 7)) ? "weekend" : ""}, events: {mouseover: function () {
			this.calendar_date_select.dayHover(this)
		}, mouseout: function () {
			this.calendar_date_select.dayHoverOut(this)
		}, click: function () {
			this.calendar_date_select.updateSelectedDate(this, true)
		}}, customData: {calendar_date_select: this}})
	}
}, initButtonsDiv: function () {
	var i = function (k) {
		var j = parseInt(k, 10);
		if (k < 10) {
			j = "0" + j
		}
		return j
	};
	var g = this.buttons_div;
	var e = this.newElement("div", {parent: g, attrs: {"class": "timediv"}});
	if (this.options.time) {
		var d = $A(this.options.time == "mixed" ? [
			[" - ", ""]
		] : []);
		e.update(new Element("span", {"class": "at_sign"}).update("@"));
		if (this.options.hour_format_12) {
			var c = new Date();
			d = d.concat($R(0, 23).map(function (j) {
				c.setHours(j);
				return $A([this.dateUtils.getAMPMHour(c) + " " + this.dateUtils.getAMPM(c), j])
			}))
		} else {
			d = d.concat($R(0, 23).map(function (j) {
				return $A([i(j), j])
			}))
		}
		this.hour_select = new SelectBox(e, d, "hour", this.calendar_date_select.updateSelectedDate.bind(this, {hour: this.value}));
		this.hour_select.calendar_date_select = this;
		e.insert(new Element("span", {"class": "separator"}).update(":"));
		var b = this;
		d = $A([]);
		this.minute_select = new SelectBox(e, d.concat($R(0, 59).select(function (j) {
			return(j % b.options.minute_interval == 0)
		}).map(function (j) {
			return $A([i(j), j])
		})), "minute", this.calendar_date_select.updateSelectedDate.bind(this, {minute: this.value}));
		this.minute_select.calendar_date_select = this
	} else {
		if (!this.options.buttons) {
			g.remove()
		}
	}
	if (this.options.buttons) {
		var a = function (k, l, j) {
			this.newElement("a", {parent: k, content: _translations[l], attrs: {href: "#"}, events: {click: j}})
		}.bind(this);
		var f = function (j) {
			this.newElement("span", {parent: j, content: "&#160;|&#160;", attrs: {"class": "button_separator"}})
		}.bind(this);
		this.newElement("span", {parent: g, content: "&#160;"});
		if (this.options.time == "mixed" || !this.options.time) {
			a(g, "Today", function (j) {
				this.today(false);
				j.stop();
				return false
			}.bindAsEventListener(this))
		}
		if (this.options.time == "mixed") {
			f(g)
		}
		if (this.options.time) {
			a(g, "Now", function (j) {
				this.today(true);
				j.stop();
				return false
			}.bindAsEventListener(this))
		}
		if (!this.options.embedded && !this.closeOnClick()) {
			f(g);
			a(g, "OK", function (j) {
				this.close();
				j.stop();
				return false
			}.bindAsEventListener(this))
		}
		if (this.options.clear_button) {
			f(g);
			a(g, "Clear", function (j) {
				this.clearDate();
				if (!this.options.embedded) {
					this.close()
				}
				j.stop();
				return false
			}.bindAsEventListener(this))
		}
	}
}, refresh: function () {
	this.refreshMonthYear();
	this.refreshCalendarGrid();
	this.setSelectedClass();
	this.updateFooter()
}, refreshCalendarGrid: function () {
	this.beginning_date = new Date(this.date).clearTime();
	this.beginning_date.setDate(1);
	this.beginning_date.setHours(12);
	var b = this.beginning_date.getDay();
	if (b < 3) {
		b += 7
	}
	this.beginning_date.setDate(1 - b + this.dateUtils.firstDayOfWeek);
	var d = new Date(this.beginning_date);
	var a = new Date().clearTime();
	var c = this.date.getMonth();
	vdc = this.options.valid_date_check;
	for (var e = 0; e < 42; e++) {
		day = d.getDate();
		month = d.getMonth();
		cell = this.calendar_day_grid[e];
		cell.update(new Element("div", {"class": (month != c) ? "other" : ""}).update(day));
		cell.day = day;
		cell.month = month;
		cell.year = d.getFullYear();
		if (vdc) {
			if (vdc(d.clearTime())) {
				cell.removeClassName("disabled")
			} else {
				cell.addClassName("disabled")
			}
		}
		d.setDate(day + 1)
	}
	if (this.today_cell) {
		this.today_cell.removeClassName("today")
	}
	if ($R(0, 41).include(days_until = this.dateUtils.daysDistance(this.beginning_date.clearTime(), (a)))) {
		this.today_cell = this.calendar_day_grid[days_until];
		this.today_cell.addClassName("today")
	}
}, refreshMonthYear: function () {
	var a = this.date.getMonth();
	var c = this.date.getFullYear();
	if (this.options.month_year == "dropdowns") {
		this.month_select.setValue(a, false);
		var b = this.year_select.element;
		if (this.flexibleYearRange() && (!(this.year_select.setValue(c, false)) || b.selectedIndex <= 1 || b.selectedIndex >= b.options.length - 2)) {
			this.populateYearRange()
		}
		this.year_select.setValue(c)
	} else {
		this.month_year_label.update(this.dateUtils.months[a] + " " + c.toString())
	}
}, populateYearRange: function () {
	this.year_select.populate(this.yearRange().toArray())
}, yearRange: function () {
	if (!this.flexibleYearRange()) {
		return $R(this.options.year_range[0], this.options.year_range[1])
	}
	var a = this.date.getFullYear();
	return $R(a - this.options.year_range, a + this.options.year_range)
}, flexibleYearRange: function () {
	return(typeof(this.options.year_range) == "number")
}, validYear: function (a) {
	if (this.flexibleYearRange()) {
		return true
	} else {
		return this.yearRange().include(a)
	}
}, dayHover: function (a) {
	var b = new Date(this.selected_date);
	b.setFullYear(a.year, a.month, a.day);
	this.updateFooter(b.toFormattedString(this.options))
}, dayHoverOut: function (a) {
	this.updateFooter()
}, clearSelectedClass: function () {
	if (this.selected_cell) {
		this.selected_cell.removeClassName("selected")
	}
}, setSelectedClass: function () {
	if (!this.selection_made) {
		return
	}
	this.clearSelectedClass();
	if ($R(0, 42).include(days_until = this.dateUtils.daysDistance(this.beginning_date.clearTime(), this.selected_date.clearTime()))) {
		this.selected_cell = this.calendar_day_grid[days_until];
		this.selected_cell.addClassName("selected")
	}
}, reparse: function () {
	this.parseDate();
	this.refresh()
}, dateString: function () {
	return(this.selection_made) ? this.selected_date.toFormattedString(this.options) : "&#160;"
}, parseDate: function () {
	var b = this.target_element.readAttribute("alt").strip();
	var a = this.options.default_time;
	this.selection_made = (b != "" || a);
	this.date = b == "" ? NaN : Date.parseISO_8601(b);
	if (isNaN(this.date) && !a) {
		this.date = new Date()
	} else {
		if (isNaN(this.date) && a) {
			this.date = (Object.prototype.toString.apply(a) === "[object Function]") ? a() : a
		}
	}
	if (!this.validYear(this.date.getFullYear())) {
		this.date.setYear((this.date.getFullYear() < this.yearRange().start) ? this.yearRange().start : this.yearRange().end)
	}
	this.selected_date = new Date(this.date);
	this.use_time = /[0-9]:[0-9]{2}/.exec(b) ? true : false;
	this.date.setDate(1)
}, updateFooter: function (a) {
	this.footer_div.update(new Element("span").update(a || this.dateString()))
}, clearDate: function () {
	if ((this.target_element.disabled || this.target_element.readOnly) && this.options.popup != "force") {
		return false
	}
	var a = this.target_element.value;
	this.target_element.value = "";
	this.target_element.writeAttribute("alt", "");
	this.clearSelectedClass();
	this.updateFooter("&#160;");
	if (a != this.target_element.value) {
		this.callback("onchange")
	}
}, updateSelectedDate: function (b, a) {
	var e = $H(b);
	if ((this.target_element.disabled || this.target_element.readOnly) && this.options.popup != "force") {
		return false
	}
	if (e.get("day")) {
		var d = this.selected_date, c = this.options.valid_date_check;
		d.setFullYear(e.get("year"), e.get("month"), e.get("day"));
		if (c && !c(d.clearTime())) {
			return false
		}
		this.selected_date = d;
		this.selection_made = true
	}
	if (!isNaN(e.get("hour"))) {
		this.selected_date.setHours(e.get("hour"))
	}
	if (!isNaN(e.get("minute"))) {
		this.selected_date.setMinutes(this.alignMinutesToInterval(e.get("minute")))
	}
	if (e.get("hour") === "" || e.get("minute") === "") {
		this.setUseTime(false)
	} else {
		if (!isNaN(e.get("hour")) || !isNaN(e.get("minute"))) {
			this.setUseTime(true)
		}
	}
	this.updateFooter();
	this.setSelectedClass();
	if (this.selection_made) {
		this.updateValue()
	}
	if (a && this.closeOnClick()) {
		this.close()
	}
	if (a && !this.options.embedded) {
		if ((new Date() - this.last_click_at) < 333) {
			this.close()
		}
		this.last_click_at = new Date()
	}
}, closeOnClick: function () {
	if (this.options.embedded) {
		return false
	}
	if (this.options.close_on_click === null) {
		return(this.options.time) ? false : true
	} else {
		return(this.options.close_on_click)
	}
}, navMonth: function (a, b) {
	(target_date = new Date(this.date)).setMonth(typeof(b) == "number" ? b : this.month_select.getValue());
	return(this.navTo(target_date))
}, navYear: function (b, a) {
	(target_date = new Date(this.date)).setYear(typeof(a) == "number" ? a : this.year_select.getValue());
	return(this.navTo(target_date))
}, navTo: function (a) {
	if (!this.validYear(a.getFullYear())) {
		return false
	}
	this.date = a;
	this.date.setDate(1);
	this.refresh();
	this.callback("after_navigate", this.date);
	return true
}, alignMinutesToInterval: function (b) {
	var a = this.options.minute_interval;
	return Math.floor(b / a) * a
}, setUseTime: function (b) {
	this.use_time = this.options.time && (this.options.time == "mixed" ? b : true);
	if (this.use_time && this.selected_date) {
		var c = this.alignMinutesToInterval(this.selected_date.getMinutes());
		var a = this.selected_date.getHours();
		this.hour_select.setValue(a);
		this.minute_select.setValue(c)
	} else {
		if (this.options.time == "mixed") {
			this.hour_select.setValue("");
			this.minute_select.setValue("")
		}
	}
}, updateValue: function () {
	var a = this.target_element.value;
	this.target_element.value = this.dateString();
	this.target_element.writeAttribute("alt", this.selected_date.toISO8601());
	if (a != this.target_element.value) {
		this.callback("onchange")
	}
}, today: function (a) {
	var c = new Date();
	this.date = new Date();
	var b = $H({day: c.getDate(), month: c.getMonth(), year: c.getFullYear(), hour: c.getHours(), minute: c.getMinutes()});
	if (!a) {
		b = b.merge({hour: "", minute: ""})
	}
	this.updateSelectedDate(b, true);
	this.refresh()
}, close: function () {
	if (this.closed) {
		return false
	}
	this.callback("before_close");
	this.target_element.calendar_date_select = null;
	Event.stopObserving(document, "mousedown", this.closeIfClickedOut_handler);
	Event.stopObserving(document, "keypress", this.keyPress_handler);
	this.calendar_div.remove();
	this.closed = true;
	if (this.iframe) {
		this.iframe.remove()
	}
	if (this.target_element.type != "hidden" && !this.target_element.disabled) {
		this.target_element.focus()
	}
	this.callback("after_close")
}, closeIfClickedOut: function (a) {
	if (!($(Event.element(a)).descendantOf && $(Event.element(a)).descendantOf(this.calendar_div))) {
		this.close()
	}
}, keyPress: function (a) {
	if (a.keyCode == Event.KEY_ESC) {
		this.close()
	}
}, callback: function (a, b) {
	if (this.options[a]) {
		this.options[a].bind(this.target_element)(b)
	}
}});
var XWiki = (function (b) {
	var a = b.widgets = b.widgets || {};
	a.DateTimePicker = Class.create({selector: "input.xwiki-date:not(.initialized)", options: {year_range: 10, time: false, convert_to_UTC: false, hour_format_12: false, minute_interval: 1, popup: "force"}, initialize: function (c) {
		this.options = Object.extend(Object.clone(this.options), c || {});
		this.attachPickers();
		document.observe("xwiki:dom:updated", function (d) {
			this.attachPickers(d.memo.elements && d.memo.elements[0])
		}.bindAsEventListener(this))
	}, attachPickers: function (c) {
		var d = c && c.select(this.selector) || $$(this.selector);
		d.invoke("observe", "click", this.onClick.bindAsEventListener(this));
		d.each(function (e) {
			e.readOnly = true;
			e.addClassName("initialized")
		})
	}, onClick: function (c) {
		this.showCalendar(c.element())
	}, showCalendar: function (d) {
		var c = Object.clone(this.options);
		c.time = c.time || d.hasClassName("withTime");
		c.convert_to_UTC = c.convert_to_UTC || d.hasClassName("withUTC");
		c.onchange = function () {
			Event.fire(d, "xwiki:date:changed");
			Event.fire(d, "xwiki:form:field-value-changed")
		};
		d._selector = new CalendarDateSelect(d, c)
	}});
	return b
}(XWiki || {}));
document.observe("xwiki:dom:loaded", function () {
	var a = new Date().getFullYear();
	window.dateTimePicker = new XWiki.widgets.DateTimePicker({year_range: [a - 99, a + 1]})
});
var SimpleDateFormat;
(function () {
	function g(q) {
		return typeof q == "undefined"
	}

	var p = /('[^']*')|(G+|y+|M+|w+|W+|D+|d+|F+|E+|a+|H+|k+|K+|h+|m+|s+|S+|Z+)|([a-zA-Z]+)|([^a-zA-Z']+)/;
	var k = Date.CultureInfo.monthNames;
	var c = Date.CultureInfo.dayNames;
	var j = 0, i = 1, f = 2, m = 3, e = 4, n = 5;
	var l = {G: j, y: m, M: e, w: f, W: f, D: f, d: f, F: f, E: i, a: j, H: f, k: f, K: f, h: f, m: f, s: f, S: f, Z: n};
	var d = 24 * 60 * 60 * 1000;
	var a = 7 * d;
	var b = 1;
	var o = function (r, s, q) {
		var t = new Date(r, s, q, 0, 0, 0);
		t.setMilliseconds(0);
		return t
	};
	Date.prototype.getDifference = function (q) {
		return this.getTime() - q.getTime()
	};
	Date.prototype.isBefore = function (q) {
		return this.getTime() < q.getTime()
	};
	Date.prototype.getUTCTime = function () {
		return Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds())
	};
	Date.prototype.getTimeSince = function (q) {
		return this.getUTCTime() - q.getUTCTime()
	};
	Date.prototype.getPreviousSunday = function () {
		var r = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 12, 0, 0);
		var q = new Date(r.getTime() - this.getDay() * d);
		return o(q.getFullYear(), q.getMonth(), q.getDate())
	};
	Date.prototype.getWeekInYear = function (v) {
		if (g(this.minimalDaysInFirstWeek)) {
			v = b
		}
		var t = this.getPreviousSunday();
		var r = o(this.getFullYear(), 0, 1);
		var u = t.isBefore(r) ? 0 : 1 + Math.floor(t.getTimeSince(r) / a);
		var q = 7 - r.getDay();
		var s = u;
		if (q < v) {
			s--
		}
		return s
	};
	Date.prototype.getWeekInMonth = function (v) {
		if (g(this.minimalDaysInFirstWeek)) {
			v = b
		}
		var r = this.getPreviousSunday();
		var u = o(this.getFullYear(), this.getMonth(), 1);
		var t = r.isBefore(u) ? 0 : 1 + Math.floor((r.getTimeSince(u)) / a);
		var q = 7 - u.getDay();
		var s = t;
		if (q >= v) {
			s++
		}
		return s
	};
	Date.prototype.getDayInYear = function () {
		var q = o(this.getFullYear(), 0, 1);
		return 1 + Math.floor(this.getTimeSince(q) / d)
	};
	SimpleDateFormat = function (q) {
		this.formatString = q
	};
	SimpleDateFormat.prototype.setMinimalDaysInFirstWeek = function (q) {
		this.minimalDaysInFirstWeek = q
	};
	SimpleDateFormat.prototype.getMinimalDaysInFirstWeek = function (q) {
		return g(this.minimalDaysInFirstWeek) ? b : this.minimalDaysInFirstWeek
	};
	SimpleDateFormat.prototype.format = function (J) {
		if (J == "Invalid Date") {
			return""
		}
		var q = "";
		var A;
		var u = function (M, L) {
			while (M.length < L) {
				M = "0" + M
			}
			return M
		};
		var s = function (N, M, L) {
			return(M >= 4) ? N : N.substr(0, Math.max(L, M))
		};
		var y = function (N, M) {
			var L = "" + N;
			return u(L, M)
		};
		var x = this.formatString;
		while ((A = p.exec(x))) {
			var E = A[0];
			var z = A[1];
			var B = A[2];
			var w = A[3];
			var v = A[4];
			if (z) {
				if (z == "''") {
					q += "'"
				} else {
					q += z.substring(1, z.length - 1)
				}
			} else {
				if (w) {
				} else {
					if (v) {
						q += v
					} else {
						if (B) {
							var r = B.charAt(0);
							var K = B.length;
							var C = "";
							switch (r) {
								case"G":
									C = "AD";
									break;
								case"y":
									C = J.getFullYear();
									break;
								case"M":
									C = J.getMonth();
									break;
								case"w":
									C = J.getWeekInYear(this.getMinimalDaysInFirstWeek());
									break;
								case"W":
									C = J.getWeekInMonth(this.getMinimalDaysInFirstWeek());
									break;
								case"D":
									C = J.getDayInYear();
									break;
								case"d":
									C = J.getDate();
									break;
								case"F":
									C = 1 + Math.floor((J.getDate() - 1) / 7);
									break;
								case"E":
									C = c[J.getDay()];
									break;
								case"a":
									C = (J.getHours() >= 12) ? "PM" : "AM";
									break;
								case"H":
									C = J.getHours();
									break;
								case"k":
									C = J.getHours() || 24;
									break;
								case"K":
									C = J.getHours() % 12;
									break;
								case"h":
									C = (J.getHours() % 12) || 12;
									break;
								case"m":
									C = J.getMinutes();
									break;
								case"s":
									C = J.getSeconds();
									break;
								case"S":
									C = J.getMilliseconds();
									break;
								case"Z":
									C = J.getTimezoneOffset();
									break
							}
							switch (l[r]) {
								case j:
									q += s(C, K, 2);
									break;
								case i:
									q += s(C, K, 3);
									break;
								case f:
									q += y(C, K);
									break;
								case m:
									if (K <= 3) {
										var t = "" + C;
										q += t.substr(2, 2)
									} else {
										q += y(C, K)
									}
									break;
								case e:
									if (K >= 3) {
										q += s(k[C], K, K)
									} else {
										q += y(C + 1, K)
									}
									break;
								case n:
									var I = (C > 0);
									var F = I ? "-" : "+";
									var H = Math.abs(C);
									var G = "" + Math.floor(H / 60);
									G = u(G, 2);
									var D = "" + (H % 60);
									D = u(D, 2);
									q += F + G + D;
									break
							}
						}
					}
				}
			}
			x = x.substr(A.index + A[0].length)
		}
		return q
	}
})();