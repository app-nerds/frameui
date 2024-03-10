/* Copyright © 2024 App Nerds LLC  */
/** @typedef {object & { position: AlertPosition, duration: number, closable: boolean, focusable: boolean }} AlertOptions */

/**
 * Constants for alert position.
 * @enum {AlertPosition}
 */
const AlertPosition = {
	TopLeft: "top-left",
	TopCenter: "top-center",
	TopRight: "top-right",
	BottomLeft: "bottom-left",
	BottomCenter: "bottom-center",
	BottomRight: "bottom-right"
};

const alertPositionIndex = [
	[AlertPosition.TopLeft, AlertPosition.TopCenter, AlertPosition.TopRight],
	[AlertPosition.BottomLeft, AlertPosition.BottomCenter, AlertPosition.BottomRight]
];

const svgs = {
	success: '<svg viewBox="0 0 426.667 426.667" width="18" height="18"><path d="M213.333 0C95.518 0 0 95.514 0 213.333s95.518 213.333 213.333 213.333c117.828 0 213.333-95.514 213.333-213.333S331.157 0 213.333 0zm-39.134 322.918l-93.935-93.931 31.309-31.309 62.626 62.622 140.894-140.898 31.309 31.309-172.203 172.207z" fill="#6ac259"></path></svg>',
	warn: '<svg viewBox="0 0 310.285 310.285" width=18 height=18> <path d="M264.845 45.441C235.542 16.139 196.583 0 155.142 0 113.702 0 74.743 16.139 45.44 45.441 16.138 74.743 0 113.703 0 155.144c0 41.439 16.138 80.399 45.44 109.701 29.303 29.303 68.262 45.44 109.702 45.44s80.399-16.138 109.702-45.44c29.303-29.302 45.44-68.262 45.44-109.701.001-41.441-16.137-80.401-45.439-109.703zm-132.673 3.895a12.587 12.587 0 0 1 9.119-3.873h28.04c3.482 0 6.72 1.403 9.114 3.888 2.395 2.485 3.643 5.804 3.514 9.284l-4.634 104.895c-.263 7.102-6.26 12.933-13.368 12.933H146.33c-7.112 0-13.099-5.839-13.345-12.945L128.64 58.594c-.121-3.48 1.133-6.773 3.532-9.258zm23.306 219.444c-16.266 0-28.532-12.844-28.532-29.876 0-17.223 12.122-30.211 28.196-30.211 16.602 0 28.196 12.423 28.196 30.211.001 17.591-11.456 29.876-27.86 29.876z" fill="#FFDA44" /> </svg>',
	info: '<svg viewBox="0 0 23.625 23.625" width=18 height=18> <path d="M11.812 0C5.289 0 0 5.289 0 11.812s5.289 11.813 11.812 11.813 11.813-5.29 11.813-11.813S18.335 0 11.812 0zm2.459 18.307c-.608.24-1.092.422-1.455.548a3.838 3.838 0 0 1-1.262.189c-.736 0-1.309-.18-1.717-.539s-.611-.814-.611-1.367c0-.215.015-.435.045-.659a8.23 8.23 0 0 1 .147-.759l.761-2.688c.067-.258.125-.503.171-.731.046-.23.068-.441.068-.633 0-.342-.071-.582-.212-.717-.143-.135-.412-.201-.813-.201-.196 0-.398.029-.605.09-.205.063-.383.12-.529.176l.201-.828c.498-.203.975-.377 1.43-.521a4.225 4.225 0 0 1 1.29-.218c.731 0 1.295.178 1.692.53.395.353.594.812.594 1.376 0 .117-.014.323-.041.617a4.129 4.129 0 0 1-.152.811l-.757 2.68a7.582 7.582 0 0 0-.167.736 3.892 3.892 0 0 0-.073.626c0 .356.079.599.239.728.158.129.435.194.827.194.185 0 .392-.033.626-.097.232-.064.4-.121.506-.17l-.203.827zm-.134-10.878a1.807 1.807 0 0 1-1.275.492c-.496 0-.924-.164-1.28-.492a1.57 1.57 0 0 1-.533-1.193c0-.465.18-.865.533-1.196a1.812 1.812 0 0 1 1.28-.497c.497 0 .923.165 1.275.497.353.331.53.731.53 1.196 0 .467-.177.865-.53 1.193z" fill="#006DF0" /> </svg>',
	error: '<svg viewBox="0 0 51.976 51.976" width=18 height=18> <path d="M44.373 7.603c-10.137-10.137-26.632-10.138-36.77 0-10.138 10.138-10.137 26.632 0 36.77s26.632 10.138 36.77 0c10.137-10.138 10.137-26.633 0-36.77zm-8.132 28.638a2 2 0 0 1-2.828 0l-7.425-7.425-7.778 7.778a2 2 0 1 1-2.828-2.828l7.778-7.778-7.425-7.425a2 2 0 1 1 2.828-2.828l7.425 7.425 7.071-7.071a2 2 0 1 1 2.828 2.828l-7.071 7.071 7.425 7.425a2 2 0 0 1 0 2.828z" fill="#D80027" /> </svg>'
};

/**
 * Alerter displays toast-like messages to users. It is inspired by vanilla-toast (
 * https://github.com/mehmetemineker/vanilla-toast)
 * @param {AlertOptions} options
 */
class Alerter {
	constructor(options = {
		position: AlertPosition.TopRight,
		duration: 3000,
		closable: true,
		focusable: true,
	}) {
		this.options = options;

		/*
		 * If the outer container doesn't exist, make it
		 */
		if (!document.getElementsByClassName("alert-container").length) {
			this._setup();
		}
	}

	/**
	 * success displays a success alert. Use this for positive messages.
	 * @param {string} message
	 * @param {function} callback
	 * @returns {void}
	 */
	success(message, callback) {
		this.show(message, "success", callback);
	}

	/**
	 * info displays an info alert. Use this for neutral messages.
	 * @param {string} message
	 * @param {function} callback
	 * @returns {void}
	 */
	info(message, callback) {
		this.show(message, "info", callback);
	}

	/**
	 * warn displays a warning alert. Use this to warn users of something.
	 * @param {string} message
	 * @param {function} callback
	 * @returns {void}
	 */
	warn(message, callback) {
		this.show(message, "warn", callback);
	}

	/**
	 * error displays an error alert. Use this to warn users of something bad.
	 * @param {string} message
	 * @param {function} callback
	 * @returns {void}
	 */
	error(message, callback) {
		this.show(message, "error", callback);
	}

	/**
	 * @param {string} message
	 * @param {string} type
	 * @param {function} callback
	 * @returns {void}
	 */
	show(message, type, callback) {
		const col = document.getElementsByClassName(this.options.position)[0];

		const card = Object.assign(document.createElement("div"), {
			className: `alert-card ${type}`,
			innerHTML: `${svgs[type]}`,
			options: {
				...this.options, ...{
					message,
					type: type,
					yPos: this.options.position.indexOf("top") > -1 ? "top" : "bottom",
					inFocus: false,
				},
			},
		});

		this._setContent(card);
		this._setIntroAnimation(card);
		this._bindEvents(card);
		this._autoDestroy(card, callback);

		col.appendChild(card);
	}

	_setContent(card) {
		let inner = "";

		if (card.options.title) {
			inner += `<h4>${card.options.title}</h4>`;
		}

		inner += `<p>${card.options.message}</p>`;

		const div = Object.assign(document.createElement("div"), {
			className: "text-group",
			innerHTML: inner,
		});

		card.appendChild(div);
	}

	/**
	 * @param {AlertCard} card
	 * @returns {void}
	 */
	_setIntroAnimation(card) {
		card.style.setProperty(`margin-${card.options.yPos}`, "-15px");
		card.style.setProperty(`opacity`, "0");

		setTimeout(() => {
			card.style.setProperty(`margin-${card.options.yPos}`, "15px");
			card.style.setProperty("opacity", "1");
		}, 50);
	}

	/**
	 * @param {AlertCard} card
	 * @returns {void}
	 */
	_bindEvents(card) {
		card.addEventListener("click", () => {
			if (card.options.closable) {
				this._destroy(card);
			}
		});

		card.addEventListener("mouseover", () => {
			card.options.inFocus = card.options.focusable;
		});

		card.addEventListener("mouseout", () => {
			card.options.inFocus = false;
			this._autoDestroy(card);
		});
	}

	/**
	 * @param {AlertCard} card
	 * @returns {void}
	 */
	_autoDestroy(card, callback) {
		if (card.options.duration !== 0) {
			setTimeout(() => {
				if (!card.options.inFocus) {
					this._destroy(card, callback);
				}
			}, card.options.duration);
		}
	}

	/**
	 * @param {AlertCard} card
	 * @returns {void}
	 */
	_destroy(card, callback) {
		card.style.setProperty(`margin-${card.options.yPos}`, `-${card.offsetHeight}px`);
		card.style.setProperty("opacity", "0");

		setTimeout(() => {
			card.remove();

			if (typeof callback === "function") {
				callback();
			}
		}, 500);
	}

	_setup() {
		const container = Object.assign(document.createElement("div"), { className: "alert-container" });

		for (const rowIndex of [0, 1]) {
			const row = Object.assign(document.createElement("div"), { className: "alert-row" });

			for (const colIndex of [0, 1, 2]) {
				const col = Object.assign(document.createElement("div"), { className: `alert-col ${alertPositionIndex[rowIndex][colIndex]}` });
				row.appendChild(col);
			}

			container.appendChild(row);
		}

		document.body.appendChild(container);
	}
}

/** @typedef {object & { closeOnClick: boolean, onShimClick: function }} ShimOptions */

/**
 * Shim displays a full screen shim to cover elements.
 * @param {ShimOptions} options
 */
class Shim {
	constructor(closeOnClick = false, onShimClick) {
		this.closeOnClick = closeOnClick;
		this.onShimClick = onShimClick;

		this.shim = undefined;
	}

	/**
	 * show displays the shim
	 * @returns {void}
	 */
	show() {
		if (!this.shim && !document.getElementsByClassName("shim").length) {
			this.shim = document.createElement("div");
			this.shim.classList.add("shim");

			if (this.closeOnClick) {
				this.shim.addEventListener("click", () => {
					this.hide(this.onShimClick);
				});
			}

			document.body.appendChild(this.shim);
		} else if (document.getElementsByClassName("shim").length) {
			this.shim = document.getElementsByClassName("shim")[0];
		}
	}

	/**
	 * hide removes the shim
	 * @returns {void}
	 */
	hide(callback) {
		this._destroy();

		if (typeof callback === "function") {
			callback();
		}
	}

	_destroy() {
		if (this.shim) {
			this.shim.remove();
			this.shim = undefined;
		}
	}
}

/** @typedef {object & { callback: Function }} ConfirmOptions */

/**
 * Confirmer displays a confirmation dialog. It has two mode: "yesno", "other".
 * "yesno" mode will display two buttons: Yes and No. "other" will only display a Close button.
 * The result of the click will be returned in a promise value.
 *
 * Styling is provided by confirm.css. It relies on variables:
 *   - --dialog-background-color
 *   - --border-color
 *
 * Example:
 *    const confirmer = new Confirmer();
 *    const result = await confirmer.yesNo("Are you sure?");
 */
class Confirmer {
	constructor() {
	}

	/**
	 * confirm displays a confirmation dialog. It shows a message and a Close button.
	 * @param {string} message
	 * @param {function} callback
	 * @returns {void}
	 */
	confirm(message, callback) {
		this.show("confirm", message, callback);
	}

	/**
	 * yesNo displays a confirmation dialog. It shows a message and Yes and No buttons.
	 * @param {string} message
	 * @returns {Promise<boolean>}
	 */
	yesNo(message) {
		return new Promise((resolve) => {
			const cb = (result) => {
				return resolve(result);
			};

			this.show("yesno", message, cb);
		});
	}

	/**
	 * show displays a confirmation dialog. This is a raw function that is normally
	 * used by the yesNo and confirm functions.
	 * @param {string} type
	 * @param {string} message
	 * @param {function} callback
	 * @returns {void}
	 */
	show(type, message, callback) {
		let shim = new Shim(true, () => { this._close(container, callback, false); });

		const container = Object.assign(document.createElement("dialog"), {
			className: "confirm-container",
			innerHTML: `<p>${message}</p>`,
		});

		this._addButtons(container, type, shim, callback);

		shim.show();
		document.body.appendChild(container);
	}

	_close(container, callback, callbackValue) {
		container.remove();
		if (typeof callback === "function") {
			callback(callbackValue);
		}
	}

	_addButtons(container, type, shim, callback) {
		let buttons = [];

		switch (type) {
			case "yesno":
				const noB = Object.assign(document.createElement("button"), {
					innerText: "No",
					className: "cancel-button",
				});

				noB.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();

					shim.hide(false);
					this._close(container, callback, false);
				});

				const yesB = Object.assign(document.createElement("button"), {
					innerText: "Yes",
					className: "action-button",
				});

				yesB.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();

					shim.hide(false);
					this._close(container, callback, true);
				});

				buttons.push(noB, yesB);
				break;

			default:
				const b = Object.assign(document.createElement("button"), {
					innerText: "Close",
					className: "action-button",
				});

				b.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();

					shim.hide(false);
					this._close(container, callback);
				});

				buttons.push(b);
				break;
		}

		const buttonContainer = Object.assign(document.createElement("div"), { className: "button-row" });
		buttonContainer.append(...buttons);
		container.appendChild(buttonContainer);
	}
}

const DateFormats = {
	"IsoWithTimezone": "yyyy-mm-ddthh:mm:ssz",
	"IsoWithoutTimezone": "yyyy-mm-ddthh:mm:ss",
	"InternationalWithSeconds": "yyyy-mm-dd hh:mm:ss",
	"International": "yyyy-mm-dd hh:mm",
	"UsDateTimeWithSeconds": "mm/dd/yyyy hh:mm:ss am/pm",
	"UsDateTimeWithoutSeconds": "mm/dd/yyyy hh:mm am/pm",
	"IsoDate": "yyyy-mm-dd",
	"UsDate": "mm/dd/yyyy",
};

const formatMap = {
	"yyyy-mm-ddthh:mm:ssz": format1,
	"yyyy-mm-ddthh:mm:ss": format2,
	"yyyy-mm-dd hh:mm:ss": format3,
	"yyyy-mm-dd hh:mm": format4,
	"mm/dd/yyyy hh:mm:ss am/pm": format5,
	"mm/dd/yyyy hh:mm am/pm": format6,
	"yyyy-mm-dd": format7,
	"mm/dd/yyyy": format8,
};

/**
 * parseDateTime parses a date/time string into a Date object.
 * @param {string|number|Date} dt
 * @returns {Date}
 */
function parseDateTime(dt) {
	if (typeof dt === "number") {
		return new Date(dt);
	}

	if (dt instanceof Date) {
		return dt;
	}

	if (typeof dt === "string") {
		return parseDateString(dt);
	}
}

/**
 * formatDateTime formats a Date object into a string using the specified format.
 * @param {string|number|Date} dt
 * @param {string} format
 * @returns {string}
 */
function formatDateTime(dt, format) {
	let date = parseDateTime(dt);
	let formatter = formatMap[format.toLowerCase()];

	if (!formatter) {
		throw new Error(`Invalid date format: ${format}`);
	}

	return formatter(date);
}

/**
 * @param {Date} dt
 * @returns {string}
 */
function format1(dt) {
	let { year, month, day, hour, minute, second } = breakDownDate(dt);
	return `${zeroPad(year)}-${zeroPad(month)}-${zeroPad(day)}T${zeroPad(hour)}:${zeroPad(minute)}:${zeroPad(second)}Z`;
}

/**
 * @param {Date} dt
 * @returns {string}
 */
function format2(dt) {
	let { year, month, day, hour, minute, second } = breakDownDate(dt);
	return `${zeroPad(year)}-${zeroPad(month)}-${zeroPad(day)}T${zeroPad(hour)}:${zeroPad(minute)}:${zeroPad(second)}`;
}

/**
 * @param {Date} dt
 * @returns {string}
 */
function format3(dt) {
	let { year, month, day, hour, minute, second } = breakDownDate(dt);
	return `${zeroPad(year)}-${zeroPad(month)}-${zeroPad(day)} ${zeroPad(hour)}:${zeroPad(minute)}:${zeroPad(second)}`;
}

/**
 * @param {Date} dt
 * @returns {string}
 */
function format4(dt) {
	let { year, month, day, hour, minute } = breakDownDate(dt);
	return `${zeroPad(year)}-${zeroPad(month)}-${zeroPad(day)} ${zeroPad(hour)}:${zeroPad(minute)}`;
}

/**
 * @param {Date} dt
 * @returns {string}
 */
function format5(dt) {
	let { year, month, day, hour, minute, second } = breakDownDate(dt);
	let meridian = "AM";

	if (hour > 12) {
		meridian = "PM";
		hour -= 12;
	}

	if (hour === 0) {
		hour = 12;
	}

	return `${zeroPad(month)}/${zeroPad(day)}/${zeroPad(year)} ${zeroPad(hour)}:${zeroPad(minute)}:${zeroPad(second)} ${meridian}`;
}

/**
 * @param {Date} dt
 * @returns {string}
 */
function format6(dt) {
	let { year, month, day, hour, minute } = breakDownDate(dt);
	let meridian = "AM";

	if (hour > 12) {
		meridian = "PM";
		hour -= 12;
	}

	if (hour === 0) {
		hour = 12;
	}

	return `${zeroPad(month)}/${zeroPad(day)}/${zeroPad(year)} ${zeroPad(hour)}:${zeroPad(minute)} ${meridian}`;
}

/**
 * @param {Date} dt
 * @returns {string}
 */
function format7(dt) {
	let { year, month, day } = breakDownDate(dt);
	return `${zeroPad(year)}-${zeroPad(month)}-${zeroPad(day)}`;
}

/**
 * @param {Date} dt
 * @returns {string}
 */
function format8(dt) {
	let { year, month, day } = breakDownDate(dt);
	return `${zeroPad(month)}/${zeroPad(day)}/${zeroPad(year)}`;
}

/**
 * @param {Date} dt
 * @returns {object}
 */
function breakDownDate(dt) {
	let year = dt.getFullYear();
	let month = dt.getMonth() + 1;
	let day = dt.getDate();
	let hour = dt.getHours();
	let minute = dt.getMinutes();
	let second = dt.getSeconds();

	return {
		year,
		month,
		day,
		hour,
		minute,
		second,
	};
}

/**
 * @param {number} num
 * @returns {string}
 */
function zeroPad(num) {
	return num.toString().padStart(2, "0");
}

/**
 * @param {string} dt
 * @returns {Date}
 */
function parseDateString(dt) {
	const formatRegexes = [
		/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})t(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})z/i,                         /* YYYY-MM-DDTHH-mm-ssZ */
		/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})t(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})/i,                          /* YYYY-MM-DDTHH-mm-ss */
		/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})\s+(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})/i,                        /* YYYY-MM-DD HH-mm-ss */
		/(?<month>\d{2})\/(?<day>\d{2})\/(?<year>\d{4})\s+(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})\s*(?<meridian>am|pm)/i, /* MM/DD/YYYY HH:mm:ss am/pm */
		/(?<month>\d{2})\/(?<day>\d{2})\/(?<year>\d{4})\s+(?<hour>\d{2}):(?<minute>\d{2})\s*(?<meridian>am|pm)/i,                  /* MM/DD/YYYY HH:mm am/pm */
		/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,                                                                            /* YYYY-MM-DD */
		/(?<month>\d{2})\/(?<day>\d{2})\/(?<year>\d{4})/,                                                                          /* MM/DD/YYYY */
	];

	for (let i = 0; i < formatRegexes.length; i++) {
		let match = dt.match(formatRegexes[i]);

		if (match) {
			let year = parseInt(match.groups.year) || new Date().getFullYear();
			let month = parseInt(match.groups.month) || new Date().getMonth();
			let day = parseInt(match.groups.day) || new Date().getDate();
			let hour = parseInt(match.groups.hour) || 0;
			let minute = parseInt(match.groups.minute) || 0;
			let second = parseInt(match.groups.second) || 0;
			let meridian = match.groups.meridian || "";

			if (meridian !== "") {
				if (meridian.toLowerCase() === "pm" && hour < 12) {
					hour += 12;
				}
			}

			return new Date(year, month - 1, day, hour, minute, second);
		}
	}

	throw new Error(`no pattern match for ${dt}`);
}

/**
 * date-time-picker is a custom HTML element that allows the user to select a date and time.
 * It supports custom date formats.
 * @class DateTimePicker
 * @extends HTMLElement
 */
class DateTimePicker extends HTMLElement {
	constructor() {
		super();

		this._daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		this._months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		this.name = this.getAttribute("name") || "dateTime";

		/* Get the date from attributes. If one isn't passed in, use now, but zero out the time. */
		this.date = (this.getAttribute("date")) ? parseDateTime(this.getAttribute("date")) : "";

		this.dateFormat = this.getAttribute("date-format") || DateFormats.IsoWithTimezone;
		this.showTimeSelector = this.dateFormat === DateFormats.IsoWithTimezone || this.dateFormat === DateFormats.IsoWithoutTimezone ||
			this.dateFormat === DateFormats.UsDateTimeWithSeconds || this.dateFormat === DateFormats.UsDateTimeWithoutSeconds ||
			this.dateFormat === DateFormats.InternationalWithSeconds || this.dateFormat === DateFormats.International;
		this.twentyFourHourTime = this.dateFormat === DateFormats.IsoWithTimezone || this.dateFormat === DateFormats.IsoWithoutTimezone ||
			this.dateFormat === DateFormats.InternationalWithSeconds || this.dateFormat === DateFormats.International;
		this.timeIncrement = this.getAttribute("time-increment") || "hour"; // valid values are hour,30minute,15minute,10minute,5minute,1minute
		this.today = new Date();
		this.inputEl = null;
		this.popupEl = null;
		this.headerEl = null;
		this.bodyEl = null;
		this.day = 0;
		this.timeSelectorEl = null;
		this.selectedTimeIndex = 0;
		this.yearBlockStart = this._getYear() - 5;
	}

	connectedCallback() {
		this.setAttribute("name", `${this.name}-datepicker`);
		this.setAttribute("aria-label", "Date Picker");

		this.inputEl = this._createInputEl();
		let formatP = this._createInputLabel();

		if (this.date === "") {
			this.date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
			this.yearBlockStart = this._getYear() - 5;
		}

		this.popupEl = this._createPopupEl();
		this._drawHeaderEl();
		this._drawCalendarBody();

		this.insertAdjacentElement("beforeend", this.inputEl);
		this.insertAdjacentElement("beforeend", formatP);
		this.insertAdjacentElement("beforeend", this.popupEl);

		document.addEventListener("click", e => {
			if (!e.target.contains(this.popupEl) && !e.target.contains(this.inputEl) && !this.popupEl.contains(e.target)) {
				this.hide();
			}
		});
	}

	/****************************************************
	 * PUBLIC METHODS
	 ****************************************************/

	/**
	 * clear clears the date picker value.
	 * @returns {void}
	 */
	clear() {
		this.inputEl.value = "";
	}

	/**
	 * getDate returns the currently selected date.
	 * @returns {string|Date}
	 */
	getDate() {
		return this.date;
	}

	/**
	 * Moves the calendar forward or backward one month. A positive number moves forward, a negative number moves backward.
	 * @param {number} direction
	 */
	moveMonth(e, direction) {
		e.preventDefault();
		e.stopPropagation();

		let newDate = new Date(this.date);
		newDate.setMonth(newDate.getMonth() + direction);

		this.date = newDate;
		this.popupEl.querySelector("header button:nth-child(2)").innerText = this._getMonthName();
		this.popupEl.querySelector("header button:nth-child(3)").innerText = this._getYear().toString();
		this.popupEl.querySelector(".calendar-body").remove();
		this._drawCalendarBody();
	}

	/**
	 * setDate sets the date picker value.
	 * @param {Date} dt
	 * @returns {void}
	 */
	setDate(dt) {
		this.date = dt;
		this.day = dt.getDate();
		this._setInputDate();
	}

	/**
	 * toggle shows or hides the calendar.
	 * @returns {void}
	 */
	toggle() {
		this.popupEl.classList.toggle("calendar-hidden");
		this.inputEl.focus();
	}

	hide() {
		this.popupEl.classList.add("calendar-hidden");
	}

	/****************************************************
	 * PRIVATE METHODS
	 ****************************************************/

	_drawHeaderEl() {
		let previousMonthEl = this._createPreviousMonthButton();
		let nextMonthEl = this._createNextMonthButton();
		let currentMonthEl = this._createCurrentMonthButton();
		let currentYearEl = this._createCurrentYearButton();

		this.headerEl.innerHTML = "";
		this.headerEl.insertAdjacentElement("beforeend", previousMonthEl);
		this.headerEl.insertAdjacentElement("beforeend", currentMonthEl);
		this.headerEl.insertAdjacentElement("beforeend", currentYearEl);
		this.headerEl.insertAdjacentElement("beforeend", nextMonthEl);
	}

	_drawCalendarBody() {
		let bodyDiv = document.createElement("div");
		let weekDiv = this._createCalendarBodyWeekDiv();

		let firstDate = this._getFirstDayOfMonth();
		let firstDayOfWeek = firstDate.getDay();
		let lastDate = this._getLastDayOfMonth();
		let lastDay = lastDate.getDate();
		let started = false;

		bodyDiv.classList.add("calendar-body");

		for (let dayIndex = 0; dayIndex < lastDay + firstDayOfWeek; dayIndex++) {
			/*
			 * Basically we want to not render day numbers until we hit the
			 * first day of the month on the correct day of the week.
			 */
			if (!started) {
				if (dayIndex === firstDayOfWeek) {
					started = true;
				}
			}

			let dayDiv = this._createCalendarBodyDayDiv(started, dayIndex, firstDayOfWeek);
			weekDiv.insertAdjacentElement("beforeend", dayDiv);

			/*
			 * Create a new week div every 7 days.
			 */
			if (!((dayIndex + 1) % 7)) {
				bodyDiv.insertAdjacentElement("beforeend", weekDiv);
				weekDiv = this._createCalendarBodyWeekDiv();
			}
		}

		if (weekDiv.innerHTML !== "") {
			bodyDiv.insertAdjacentElement("beforeend", weekDiv);
		}

		if (this.showTimeSelector) {
			this._createTimeSelector();
			bodyDiv.insertAdjacentElement("beforeend", this.timeSelectorEl);

			let okButton = this._createOkButton();
			bodyDiv.insertAdjacentElement("beforeend", okButton);
		}

		this._replaceBodyEl(bodyDiv);
	}

	_drawMonthListBody() {
		const body = document.createElement("div");
		body.classList.add("month-list-body");

		for (let monthIndex = 0; monthIndex < this._months.length; monthIndex++) {
			let month = this._createMonthButton(monthIndex);
			body.insertAdjacentElement("beforeend", month);
		}

		this._replaceBodyEl(body);
	}

	_drawYearListBody() {
		const body = document.createElement("div");
		body.classList.add("year-list-body");

		const yearList = document.createElement("div");
		yearList.classList.add("year-list");

		const yearUp = this._createYearUpButton();
		const yearDown = this._createYearDownButton();

		body.insertAdjacentElement("beforeend", yearUp);

		for (let yearIndex = this.yearBlockStart; yearIndex < this.yearBlockStart + 10; yearIndex++) {
			let yearButton = this._createYearButton(yearIndex);
			yearList.insertAdjacentElement("beforeend", yearButton);
		}

		body.insertAdjacentElement("beforeend", yearList);
		body.insertAdjacentElement("beforeend", yearDown);

		this._replaceBodyEl(body);
	}

	_getMonth() { return new Date(this.date).getMonth(); }
	_getMonthName() { return this._months[this._getMonth()]; }
	_getYear() { return new Date(this.date).getFullYear(); }
	_getDay() { return new Date(this.date).getDate(); }
	_getFirstDayOfMonth() {
		let result = new Date(this._getYear(), this._getMonth(), 1);
		return result;
	}
	_getLastDayOfMonth() {
		let result = new Date(this._getYear(), this._getMonth() + 1, 0);
		return result;
	}
	_getHour() { return new Date(this.date).getHours(); }
	_getMinute() { return new Date(this.date).getMinutes(); }
	_getSecond() { return new Date(this.date).getSeconds(); }

	/**
	 * @param {number} day
	 */
	_onCalendarDayClick(e, day) {
		e.preventDefault();
		e.stopPropagation();

		this.day = day;
		this._setInputDate();

		if (!this.showTimeSelector) {
			this.toggle();
			this.inputEl.focus();
		} else {
			this._createTimeSelectorOptions();
		}
	}

	_onHeaderMonthClick(e) {
		e.preventDefault();
		e.stopPropagation();
		this._drawMonthListBody();
	}

	/**
	 * @returns {void}
	 */
	_onHeaderYearClick(e) {
		e.preventDefault();
		e.stopPropagation();
		this._drawYearListBody();
	}

	/**
	 * @param {number} monthIndex
	 */
	_onMonthClick(e, monthIndex) {
		e.preventDefault();
		e.stopPropagation();

		this.date = new Date(this._getYear(), monthIndex, 1);
		this._setInputDate();
		this._drawHeaderEl();
		this._drawCalendarBody();
	}

	/**
	 * @param {Event & { target: HTMLSelectElement }} e
	 */
	_onTimeChange(e) {
		let selected = e.target.value;
		this.selectedTimeIndex = e.target.selectedIndex;
		this.date = selected;
		this._setInputDate();
	}

	/**
	 * @param {number} year
	 */
	_onYearClick(e, year) {
		e.preventDefault();
		e.stopPropagation();

		this.date = new Date(year, this._getMonth(), 1);
		this._setInputDate();
		this._drawHeaderEl();
		this._drawCalendarBody();
	}

	_onYearDownClick(e) {
		e.preventDefault();
		e.stopPropagation();

		this.yearBlockStart += 10;
		this._drawYearListBody();
	}

	_onYearUpClick(e) {
		e.preventDefault();
		e.stopPropagation();

		this.yearBlockStart -= 10;
		this._drawYearListBody();
	}

	/**
	 * @param {HTMLDivElement} newBody
	 */
	_replaceBodyEl(newBody) {
		this.bodyEl.innerHTML = "";
		this.bodyEl.insertAdjacentElement("beforeend", newBody);
	}

	_setInputDate() {
		let selected = new Date(this._getYear(), this._getMonth(), this.day, this._getHour(), this._getMinute(), this._getSecond());

		this.inputEl.value = formatDateTime(selected, this.dateFormat);
		this.dispatchEvent(new CustomEvent("change", { detail: { value: selected } }));
	}


	/**********************************************************************
	 * Methods to return invididual elements
	 *********************************************************************/

	/**
	 * @param {boolean} started
	 * @param {number} dayIndex
	 * @param {number} firstDayOfWeek
	 * @returns {HTMLDivElement}
	 */
	_createCalendarBodyDayDiv(started, dayIndex, firstDayOfWeek) {
		const el = Object.assign(document.createElement("div"), { className: "day" });

		if (started) {
			let d = dayIndex - firstDayOfWeek + 1;

			const a = Object.assign(document.createElement("button"), { innerText: `${d}`, type: "button" });
			a.addEventListener("click", e => this._onCalendarDayClick.call(this, e, d));

			let thisDay = new Date(this._getYear(), this._getMonth(), d);
			if (thisDay === this.today) {
				a.classList.add("today");
			}

			el.insertAdjacentElement("beforeend", a);
		} else {
			el.classList.add("disabled");
		}

		return el;
	}

	_createCalendarBodyWeekDiv() {
		return Object.assign(document.createElement("div"), { className: "week" });
	}

	_createCurrentMonthButton() {
		const el = Object.assign(document.createElement("button"), {
			innerHTML: this._getMonthName(),
			type: "button",
		});

		el.addEventListener("click", e => this._onHeaderMonthClick.call(this, e));
		return el;
	}

	_createCurrentYearButton() {
		const el = Object.assign(document.createElement("button"), {
			innerHTML: this._getYear().toString(),
			type: "button",
		});

		el.addEventListener("click", e => this._onHeaderYearClick.call(this, e));
		return el;
	}

	_createInputEl() {
		const el = Object.assign(document.createElement("input"), {
			type: "text",
			name: this.name,
			"aria-describedby": `${this.name}-format`,
			value: this.date instanceof Date ? formatDateTime(this.date, this.dateFormat) : "",
		});

		el.addEventListener("click", () => {
			if (this.date === "") {
				this.date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
				this._drawHeaderEl();
				this._drawCalendarBody();

			}

			this.toggle();
		});

		return el;
	}

	_createInputLabel() {
		const el = Object.assign(document.createElement("p"), { innerText: `(${this.dateFormat})`, id: `${this.name}-format` });
		return el;
	}

	/**
	 * @param {number} monthIndex
	 * @returns {HTMLAnchorElement}
	 */
	_createMonthButton(monthIndex) {
		const month = Object.assign(document.createElement("button"), {
			innerText: this._months[monthIndex],
			type: "button",
		});

		month.addEventListener("click", e => this._onMonthClick.call(this, e, monthIndex));
		return month;
	}

	_createNextMonthButton() {
		const el = Object.assign(document.createElement("button"), {
			innerHTML: `<i class="icon--mdi icon--mdi--arrow-right"></i>`,
			type: "button",
		});

		el.addEventListener("click", e => this.moveMonth.call(this, e, 1));
		return el;
	}

	_createOkButton() {
		const el = Object.assign(document.createElement("button"), {
			innerText: "OK",
			type: "button",
			className: "ok",
		});

		el.addEventListener("click", this.toggle.bind(this));
		return el;
	}

	_createPopupEl() {
		this.headerEl = document.createElement("header");
		this.bodyEl = document.createElement("section");

		const el = Object.assign(document.createElement("div"), {
			className: "date-time-picker-popup calendar-hidden",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": `Choose Date`,
		});

		el.insertAdjacentElement("beforeend", this.headerEl);
		el.insertAdjacentElement("beforeend", this.bodyEl);

		return el;
	}

	_createPreviousMonthButton() {
		const el = Object.assign(document.createElement("button"), {
			innerHTML: `<i class="icon--mdi icon--mdi--arrow-left"></i>`,
			type: "button",
		});

		el.addEventListener("click", e => this.moveMonth.call(this, e, -1));
		return el;
	}

	_createTimeSelector() {
		this.timeSelectorEl = document.createElement("select");
		this._createTimeSelectorOptions();
		this.timeSelectorEl.addEventListener("change", this._onTimeChange.bind(this));
	}

	_createTimeSelectorOptions() {
		this.timeSelectorEl.innerHTML = "";

		let increment = 1;

		if (this.timeIncrement === "5minute") {
			increment = 5;
		}

		if (this.timeIncrement === "10minute") {
			increment = 10;
		}

		if (this.timeIncrement === "15minute") {
			increment = 15;
		}

		if (this.timeIncrement === "30minute") {
			increment = 30;
		}

		if (this.timeIncrement === "hour") {
			increment = 60;
		}

		let start = new Date(this._getYear(), this._getMonth(), this._getDay(), 0, 0, 0);
		let index = 0;

		for (let i = 0; i < 1440; i += increment) {
			let option = document.createElement("option");
			option.value = formatDateTime(start, this.dateFormat);

			let selected = index === this.selectedTimeIndex ? true : false;

			if (selected) {
				option.setAttribute("selected", "selected");
			}

			if (this.twentyFourHourTime) {
				option.innerText = `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")}`;
			} else {
				let hours = start.getHours();
				let ampm = "AM";

				if (hours > 12) {
					hours -= 12;
					ampm = "PM";
				}

				if (hours === 12) {
					ampm = "PM";
				}

				if (hours === 0) {
					hours = 12;
				}

				option.innerText = `${hours.toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")} ${ampm}`;
			}

			this.timeSelectorEl.insertAdjacentElement("beforeend", option);
			start = new Date(start.getTime() + increment * 60000);
			index++;
		}
	}

	/**
	 * @param {number} year
	 * @returns {HTMLAnchorElement}
	 */
	_createYearButton(year) {
		const el = Object.assign(document.createElement("button"), {
			innerText: year.toString(),
			type: "button",
		});

		el.addEventListener("click", e => this._onYearClick.call(this, e, year));
		return el;
	}

	_createYearDownButton() {
		const el = Object.assign(document.createElement("button"), {
			innerHTML: `<i class="icon--mdi icon--mdi--arrow-down"></i>`,
			type: "button",
		});

		el.addEventListener("click", e => this._onYearDownClick.call(this, e));
		return el;
	}

	_createYearUpButton() {
		const el = Object.assign(document.createElement("button"), {
			innerHTML: `<i class="icon--mdi icon--mdi--arrow-up"></i>`,
			type: "button",
		});

		el.addEventListener("click", e => this._onYearUpClick.call(this, e));
		return el;
	}

}

customElements.define("date-time-picker", DateTimePicker);

/**
 * PopupMenu is a Web Component that displays a popup menu. It attaches to a trigger element
 * that, when clicked, will show a list of menu items. It supports icons through the Feather
 * Icons library (https://feathericons.com/).
 *
 * Styling is provided by popup-menu.css. It relies on variables:
 *   - --dialog-background-color
 *   - --prmiary-color (for the hover).
 *   - --border-color
 *
 * Usage example:
 *    <popup-menu trigger="#trigger">
 *       <popup-menu-item id="item1" text="Menu Item 1" icon="log-out"></popup-menu-item>
 *    </popup-menu>
 *
 * @class PopupMenu
 * @extends HTMLElement
 */
class PopupMenu extends HTMLElement {
	constructor() {
		super();
		this._trigger = null;
		this.isVisible = false;
	}

	connectedCallback() {
		this._trigger = this.getAttribute("trigger");

		if (!this._trigger) {
			throw new Error(
				"You must provide a query selector for the element used to trigger this popup."
			);
		}

		this.classList.add("popup-menu-hidden");

		document.addEventListener("click", (e) => {
			if (e.target !== this && !this.contains(e.target)) {
				const t = document.querySelector(this._trigger);

				if (e.target !== t && !t.contains(e.target)) {
					this._hide();
				}
			}
		});

		document.querySelector(this._trigger).addEventListener("click", this.toggle.bind(this));
		const menuItemEls = document.querySelectorAll("popup-menu-item");

		menuItemEls.forEach((el) => {
			el.addEventListener("internal-menu-item-click", (e) => {
				this._hide();
				this.dispatchEvent(new CustomEvent("menu-item-click", {
					detail: {
						id: e.target.id,
						text: e.target.getAttribute("text"),
						data: e.target.getAttribute("data"),
					}
				}));
			});
		});
	}

	disconnectedCallback() {
		let el = document.querySelector(this._trigger);

		if (el) {
			el.removeEventListener("click", this.toggle.bind(this));
		}
	}

	/**
	* Toggles the visibility of the popup menu
	* @param {Event} e The click event
	* @returns {void}
	*/
	toggle(e) {
		if (e) {
			e.preventDefault();
		}

		if (!this.isVisible) {
			this._show();
		} else {
			this._hide();
		}
	}

	_hide() {
		this.isVisible = false;
		this.classList.add("popup-menu-hidden");
	}

	_show() {
		let triggerRect = document
			.querySelector(this._trigger)
			.getBoundingClientRect();
		let thisRect = this.getBoundingClientRect();
		let buffer = 3;

		let left = triggerRect.left;

		if (left + thisRect.width > window.innerWidth) {
			left = triggerRect.left - ((triggerRect.left + thisRect.width) - window.innerWidth) - buffer;
		}

		this.style.left = `${left}px`;
		this.style.top =
			"" + (triggerRect.y + triggerRect.height + buffer) + "px";

		this.isVisible = true;
		this.classList.remove("popup-menu-hidden");
	}
}

/**
 * Represents a popup menu item
 * @class PopupMenuItem
 * @extends HTMLElement
 */
class PopupMenuItem extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this._render();
	}

	_render() {
		let text = this.getAttribute("text");
		let icon = this.getAttribute("icon");
		let inner = "";

		if (icon) {
			inner += `<i class="${icon}"></i> `;
		}

		inner += text;

		const a = Object.assign(document.createElement("a"), {
			href: "javascript:void(0)",
			classList: ["popup-menu-item"],
			innerHTML: inner,
		});

		a.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.dispatchEvent(new CustomEvent("internal-menu-item-click", { detail: e }));
		});

		this.insertAdjacentElement("beforeend", a);
	}
}

/**
 * Shows a popup menu
 * @param {string} el The query selector for the popup menu
 * @returns {void}
 */
const showPopup = (el) => {
	document.querySelector(el)._show();
};

/**
 * Hides a popup menu
 * @param {string} el The query selector for the popup menu
 */
const hidePopup = (el) => {
	document.querySelector(el)._hide();
};

if (!customElements.get("popup-menu")) {
	customElements.define("popup-menu", PopupMenu);
}

if (!customElements.get("popup-menu-item")) {
	customElements.define("popup-menu-item", PopupMenuItem);
}

/**
 * Spinner is a simple library for displaying a loading spinner. It makes use
 * of the whole page to display the spinner. The spinner is pure CSS, SVG, and JavaScript.
 * Copyright © 2022 App Nerds LLC
 * @class Spinner
 */
class Spinner {
	constructor() {
		this.spinnerEl = null;
	}

	hide() {
		if (this.spinnerEl) {
			this.spinnerEl.remove();
			this.spinnerEl = null;
		}
	}

	show() {
		if (!this.spinnerEl) {
			this.spinnerEl = document.createElement("div");
			this.spinnerEl.classList.add("spinner");
			this.spinnerEl.innerHTML = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			 <circle cx="50" cy="50" r="45" />
		  </svg>
		`;

			document.body.appendChild(this.spinnerEl);
		}
	}
}

/**
 * A wrapper around fetch that will show a spinner
 * while the request is being made. This is useful for
 * long running requests.
 * @param {string} url The URL to fetch
 * @param {object} options The fetch options
 * @param {object} spinner The spinner element to show
 * @param {number} msBeforeShowSpinner The number of milliseconds to wait before showing the spinner. Default is 1000
 * @returns {Promise<object>} A promise that resolves to the fetch response
 */
async function fetcher(url, options, spinner, msBeforeShowSpinner = 1000) {
	let timerID;
	let response;

	if (spinner) {
		timerID = setTimeout(() => {
			spinner.show();
		}, msBeforeShowSpinner);
	}

	try {
		response = await fetch(url, options);
	} finally {
		if (spinner) {
			clearTimeout(timerID);
			spinner.hide();
		}
	}

	return response;
}

/** @typedef { object & { http: fetcher, tokenGetterFunction: function, expiredTokenCallback: function, spinner: object, navigateTo: function } } GraphQLOptions */

/**
 * This class is a wrapper around the fetcher function
 * that makes it easy to execute GraphQL queries and mutations.
 * It also handles expired tokens.
 * @class GraphQL
 * @param {string} queryURL The URL to the GraphQL API
 * @param {GraphQLOptions} options Options for the GraphQL class
 */
class GraphQL {
	constructor(queryURL, options = {
		http: fetcher,
		tokenGetterFunction: null,
		expiredTokenCallback: null,
		spinner: null,
		navigateTo: null,
	}) {
		options = {
			http: fetcher,
			tokenGetterFunction: null,
			expiredTokenCallback: null,
			spinner: null,
			navigateTo: null,
			...options,
		};

		this.queryURL = queryURL;
		this.http = options.http;
		this.tokenGetterFunction = options.tokenGetterFunction;
		this.expiredTokenCallback = options.expiredTokenCallback;
		this.spinner = options.spinner;
		this.navigateTo = options.navigateTo;
	}

	/**
	 * Executes a query against a GraphQL API
	 * @param query string A graphql query. Omit the "query {}" portion.
	 * @returns {Promise<object>} A promise that resolves to the fetch response
	 */
	async query(query) {
		if (this.expiredTokenCallback && !this.expiredTokenCallback(null, "/", this.navigateTo)) {
			return;
		}

		const token = (this.tokenGetterFunction) ? this.tokenGetterFunction() : "";

		query = `query {
			${query}
		}`;

		let options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ query }),
		};

		if (token) {
			options.headers["Authorization"] = `Bearer ${token}`;
		}

		let response = await this.http(this.queryURL, options, this.spinner);

		if (response.status === 400 || response.status === 401) {
			if (this.expiredTokenCallback) {
				this.expiredTokenCallback(response, "/", this.navigateTo);
			}
			return;
		}

		let result = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	}

	/**
	 * Executes a mutation against a GraphQL API
	 * @param query string A graphql mutation. Omit the "mutation {}" portion
	 * @returns {Promise<object>} A promise that resolves to the fetch response
	 */
	async mutation(query) {
		if (this.expiredTokenCallback && !this.expiredTokenCallback(null, "/", this.navigateTo)) {
			return;
		}

		const token = (this.tokenGetterFunction) ? this.tokenGetterFunction() : "";

		query = `mutation {
			${query}
		}`;

		let options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ query }),
		};

		if (token) {
			options.headers["Authorization"] = `Bearer ${token}`;
		}

		let response = await this.http(this.queryURL, options, this.spinner);

		if (response.status === 400 || response.status === 401) {
			if (this.expiredTokenCallback) {
				this.expiredTokenCallback(response, "/", this.navigateTo);
			}

			return;
		}

		let result = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	}
}

/**
 * Debounces a function call. This is useful for things like
 * search boxes where you don't want to make a call to the
 * server for every keystroke.
 * Copyright © 2023 App Nerds LLC
 * @param {function} fn The function to debounce
 * @param {number} delay The delay in milliseconds. Default is 400
 * @returns {function} The debounced function
 */
const debounce = (fn, delay = 400) => {
	let id = null;

	return function() {
		let args = arguments;

		clearTimeout(id);

		id = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
};

/**
 * Converts a classic JS object to a Map
 * Copyright © 2023 App Nerds LLC
 * @param o object The object to convert
 * @returns {Map} A Map
 */
const objectToMap = (o = {}) => {
	let result = new Map();

	for (const key in o) {
		result.set(key, o[key]);
	}

	return result;
};

/**
 * Callback used to validate the values entered into a Prompter
 * @callback ValidatorFunc
 * @param {Object} promptValues - The values entered into the prompter
 * @return {Object} { validationErrors: Array, isValid: boolean }
 */

/**
 * Prompter displays a modal dialog using the contents provided in the web component slots.
 * It allows you to put whatever elements you want into the dialog, and then retrieve the
 * contents of the dialog when the user clicks the confirm button.
 * @class Prompter
 * @extends {HTMLElement}
 */
class Prompter extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });

		this.windowEl = null;
		this.shim = new Shim(false);
		this.width = this.getAttribute("width") || "";
		this.height = this.getAttribute("height") || "";
		this.actionButtonID = this.getAttribute("action-button") || "";
		this.cancelButtonID = this.getAttribute("cancel-button") || "";
		/** @type {ValidatorFunc} */ this.validatorFunc = null;

		if (!this.actionButtonID) {
			throw new Error("Prompter requires an action button ID");
		}

		if (!this.cancelButtonID) {
			throw new Error("Prompter requires a cancel button ID");
		}

		this.classList.add("hidden");

		this.shadowRoot.innerHTML = `
			<div id="window" part="prompter" role="dialog" aria-modal="true" aria-label="Prompt" style="width: ${this.width}; height: ${this.height};">
				<slot name="title"></slot>
				<slot name="body"></slot>
				<nav part="buttons">
					<slot name="buttons"></slot>
				</nav>
			</div>
		`;

	}

	connectedCallback() {
		this.querySelector(this.cancelButtonID).addEventListener("click", this._onCancelClick.bind(this));
		this.querySelector(this.actionButtonID).addEventListener("click", this._onConfirmClick.bind(this));
	}

	hide() {
		this.classList.add("hidden");
		this.shim.hide();
		this._clearAllInputs();
	}

	show() {
		this.shim.show();
		this.classList.remove("hidden");
		this.querySelector(`div[slot="body"]>input, div[slot="body"]>select, div[slot="body"]>textarea, div[slot="body"]>form>input,div[slot="body"]>form>select,div[slot="body"]>form>textarea`).focus();
	}

	/**
	 * Add a validation function to the prompter. This function will be called when
	 * the confirm button is clicked.
	 * @param {ValidatorFunc} f
	 * @returns {void}
	 */
	addValidatorFunc(f) {
		this.validatorFunc = f;
	}

	_onCancelClick() {
		this.hide();
		this.dispatchEvent(new CustomEvent("cancel"));
	}

	_onConfirmClick() {
		let result = {};

		this.querySelectorAll("input, select, textarea").forEach((el) => {
			let key = "";

			if (el.hasAttribute("name")) {
				key = el.getAttribute("name");
			} else if (el.hasAttribute("id")) {
				key = el.getAttribute("id");
			}

			result[key] = el.value;
		});

		if (this.validatorFunc) {
			const { validationErrors, isValid } = this.validatorFunc(result);

			if (!isValid) {
				this.dispatchEvent(new CustomEvent("validation-failed", {
					detail: {
						result,
						validationErrors,
					}
				}));

				return;
			}
		}

		this.hide();
		this.dispatchEvent(new CustomEvent("confirm", { detail: result }));
	}

	_renderWindow() {
		this.windowEl = document.createElement("div");
		this.windowEl.classList.add("prompter");
		this.windowEl.setAttribute("role", "dialog");
		this.windowEl.setAttribute("aria-modal", "true");
		this.windowEl.setAttribute("aria-label", "Prompt");
		this.windowEl.style.width = this.width;
		this.windowEl.style.height = this.height;

		this.windowEl.innerHTML = `
			<slot name="title"></slot>
			<slot name="body"></slot>
		`;
	}

	_clearAllInputs() {
		this.querySelectorAll("input, select, textarea").forEach((el) => {
			el.value = "";
		});
	}
}

if (!customElements.get("prompter-ui")) {
	customElements.define("prompter-ui", Prompter);
}

const ErrTokenExpired = "token expired";

/**
 * SessionService is a service used to manage session data. It makes use
 * of the browser's sessionStorage object. This class provides
 * only static methods.
 * @class SessionService
 */
class SessionService {
	/**
	 * Clears the member from session storage.
	 * @static
	 * @memberof SessionService
	 * @returns {void}
	 */
	static clearMember() {
		window.sessionStorage.removeItem("member");
	}

	/**
	 * Clears the token from session storage.
	 * @static
	 * @memberof SessionService
	 * @returns {void}
	 */
	static clearToken() {
		window.sessionStorage.removeItem("token");
	}

	/**
	 * Gets the member from session storage.
	 * @static
	 * @memberof SessionService
	 * @returns {object} The member object
	 */
	static getMember() {
		return JSON.parse(window.sessionStorage.getItem("member"));
	}

	/**
	 * Gets the token from session storage.
	 * @static
	 * @memberof SessionService
	 * @returns {object} The token object
	 */
	static getToken() {
		return JSON.parse(window.sessionStorage.getItem("token"));
	}

	/**
	 * Determines if the session has a member.
	 * @static
	 * @memberof SessionService
	 * @returns {boolean} True if the session has a member, otherwise false.
	 */
	static hasMember() {
		return window.sessionStorage.getItem("member") !== null;
	}

	/**
	 * Determines if the session has a token.
	 * @static
	 * @memberof SessionService
	 * @returns {boolean} True if the session has a token, otherwise false.
	 */
	static hasToken() {
		return window.sessionStorage.getItem("token") !== null;
	}

	/**
	 * Navigates to the specified path if the token has expired.
	 * This is determined by examing the error message. If the
	 * error message is "token expired", the user is navigated
	 * to the specified path.
	 * @static
	 * @param {object} e The error object
	 * @param {string} path The path to navigate to
	 * @param {function} navigateTo The function to use to navigate
	 * @memberof SessionService
	 */
	static navigateOnTokenExpired(e, path, navigateTo) {
		if (e.message === ErrTokenExpired) {
			SessionService.clearToken();
			navigateTo(path);
		}
	}

	/**
	 * Sets the member in session storage.
	 * @static
	 * @param {object} member The member object
	 * @memberof SessionService
	 * @returns {void}
	 */
	static setMember(member) {
		window.sessionStorage.setItem("member", JSON.stringify(member));
	}

	/**
	 * Sets the token in session storage.
	 * @static
	 * @param {object} token The token object
	 * @memberof SessionService
	 * @returns {void}
	 */
	static setToken(token) {
		window.sessionStorage.setItem("token", JSON.stringify(token));
	}

	/**
	 * This is a function that can be used as a callback for the fetcher
	 * class. It will check the response for a 401 status code. If it
	 * finds one, it will clear the token and navigate to the specified
	 * path.
	 * @static
	 * @param {object} httpResponse The HTTP response object
	 * @param {string} path The path to navigate to
	 * @param {function} navigateTo The function to use to navigate
	 * @memberof SessionService
	 * @returns {boolean} True if the token is valid, otherwise false.
	 */
	static tokenExpireFunc(httpResponse, path, navigateTo) {
		if (httpResponse && httpResponse.status === 401) {
			SessionService.clearToken();
			SessionService.navigateOnTokenExpired({ message: ErrTokenExpired }, path, navigateTo);
			return false;
		}

		if (!SessionService.hasToken()) {
			SessionService.navigateOnTokenExpired({ message: ErrTokenExpired }, path, navigateTo);
			return false;
		}

		return true;
	};
}

/**
 * BaseView is the base class for all views in the application. It provides
 * a common set of functionality that all views can use. Your view JavaScript
 * components should extend this class and register themselves as custom elements.
 * @class BaseView
 * @extends {HTMLElement}
 * @property {string} title The title of the view. This is used to set the document title.
 * @property {object} params The parameters passed to the view.
 * @property {object} state The state of the view.
 */
class BaseView extends HTMLElement {
	constructor(params, _onRenderComplete) {
		super();

		this._title = "";
		this.params = params;
		this._state = {};
		this._onRenderComplete = window._router.onRenderComplete || null;

		this.router = window._router;
	}

	async connectedCallback() {
		await this.beforeRender();
		await this.render();
		this._setDocumentTitle();
		await this.afterRender();

		if (this._onRenderComplete) {
			this._onRenderComplete(this);
		}
	}

	disconnectedCallback() {
		this.onUnload();
	}

	/**
	 * This method is called before the view is rendered. Override this method
	 * to perform any actions before the view is rendered.
	 * @returns {Promise<void>}
	 */
	async beforeRender() { }

	/**
	 * This method is called after the view is rendered. Override this method
	 * to perform any actions after the view is rendered.
	 * @returns {Promise<void>}
	 */
	async afterRender() { }

	/**
	 * This method is called when the view is unloaded. Override this method
	 * to perform any actions when the view is unloaded.
	 * @returns {Promise<void>}
	 */
	async onUnload() { }

	/**
	 * This method is called when the view is navigated to. Override this method
	 * render your page contents.
	 * @returns {Promise<void>}
	 */
	async render() {
		throw new Error("not implemented");
	}

	/**
	 * Get the title for the current view.
	 * @returns {string}
	 */
	get title() {
		return this._title;
	}

	/**
	 * Get the HTML for the current view.
	 * @returns {string}
	 */
	get html() {
		return this._html;
	}

	/**
	 * Get the state for the current view.
	 * @returns {object}
	 */
	get state() {
		return this._state;
	}

	/**
	 * Set the state for the current view.
	 * @param {object} newState The new state for the view.
	 * @returns {void}
	 */
	set state(newState) {
		this._state = newState;
	}

	/**
	 * Get the value of a query parameter.
	 * @param {string} paramName The name of the query parameter.
	 * @returns {string}
	 */
	getQueryParam(paramName) {
		return this.router.getQueryParam(paramName);
	}

	/**
	 * Navigate to a new URL.
	 * @param {string} url The URL to navigate to.
	 * @param {object} queryParams Query parameters to add to the URL.
	 * @param {object} state The state to pass to the new view.
	 * @returns {void}
	 */
	navigateTo(url, queryParams = {}, state = {}) {
		this.router.navigateTo(url, queryParams, state);
	}

	_setDocumentTitle() {
		let titles = this.querySelectorAll("title");

		if (titles && titles.length > 0) {
			this._title = titles[0].innerText;
			document.title = this._title;
			this.removeChild(titles[0]);
			return;
		}
	}
}

/**
 * DefaultPageNotFound is the default view to display when a page is not found.
 * @class DefaultPageNotFound
 * @extends {BaseView}
 */
class DefaultPageNotFound extends BaseView {
	constructor(params) {
		super(params);
	}

	async render() {
		return `
			<title>Page Not Found</title>
			<p>The page ${this.params.path} could not be found.</p>
		`;
	}
}

if (!customElements.get("default-page-not-found")) {
	customElements.define("default-page-not-found", DefaultPageNotFound);
}

/** @typedef {object & { path: string, view: BaseView }} Route */

/**
 * Router is responsible for routing requests to the correct view.
 * @class Router
 */
class Router {
	/**
	 * Creates a new instance of Router.
	 * @param {string} targetEl The element to render the SPA into.
	 * @param {Array<Route>} routes The routes to use for the SPA.
	 * @param {BaseView} pageNotFoundView The view to use when a route is not found.
	 */
	constructor(targetEl, routes, pageNotFoundView = null) {
		this.targetEl = targetEl;
		this.routes = routes;
		this.pageNotFoundView = pageNotFoundView;

		this.beforeRoute = null;
		this.afterRoute = null;
		this.injectParams = null;
		this.onRenderComplete = null;

		if (this.pageNotFoundView) {
			this.routes.push({
				path: "/404notfound/:path",
				view: this.pageNotFoundView,
			});
		} else {
			this.routes.push({
				path: "/404notfound/:path",
				view: DefaultPageNotFound,
			});
		}
	}

	/**
	 * Retrieves a query parameter from the URL by name.
	 * @param {string} paramName The name of the query parameter to retrieve.
	 * @returns {string}
	 */
	getQueryParam(paramName) {
		let params = new URLSearchParams(location.search);
		return params.get(paramName);
	}

	/**
	 * Navigates to a URL.
	 * @param {string} url The URL to navigate to.
	 * @param {object} queryParams Query parameters to add to the URL.
	 * @param {object} state The state to pass to the new view.
	 * @returns {void}
	 */
	navigateTo(url, queryParams = {}, state = {}) {
		let q = "";

		if (Object.keys(queryParams).length > 0) {
			let m = objectToMap(queryParams);
			q += "?";

			for (const [key, value] of m) {
				let encodedKey = encodeURIComponent(key);
				let jsonValue = value;

				if (typeof value === "object") {
					jsonValue = JSON.stringify(value);
				}

				let encodedValue = encodeURIComponent(jsonValue);

				q += `${encodedKey}=${encodedValue}&`;
			}
		}

		history.pushState(state, null, `${url}${q}`);
		this._route({
			state: state,
		});
	}

	_pathToRegex(path) {
		return new RegExp(
			"^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"
		);
	}

	_getParams(match) {
		let index = 0;

		const values = match.result.slice(1);
		const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
			(result) => result[1]
		);

		let result = {};

		for (index = 0; index < values.length; index++) {
			result[keys[index]] = values[index];
		}

		if (this.injectParams) {
			const whatToInject = this.injectParams(match);

			for (const key in whatToInject) {
				result[key] = whatToInject[key];
			}
		}

		return result;
	}

	async _route(e) {
		let state = {};

		if (e.state) {
			state = e.state;
		}

		const potentialMatches = this.routes.map((route) => {
			return {
				route,
				result: location.pathname.match(this._pathToRegex(route.path)),
			};
		});

		let match = potentialMatches.find(
			(potentialMatch) => potentialMatch.result !== null
		);

		/*
		 * Route not found - return first route
		 */
		if (!match) {
			this.navigateTo(`/404notfound${location.pathname}`);
			return;
		}

		if (this.beforeRoute) {
			if (this.beforeRoute.apply(this, match.route) === false) {
				return;
			}
		}

		/*
		 * Get parameters, then initialie the view and render.
		 */
		const params = this._getParams(match);
		const view = new match.route.view(params);
		view.state = state;

		const el = document.querySelector(this.targetEl);
		el.innerHTML = "";
		el.appendChild(view);

		if (this.afterRoute) {
			this.afterRoute(match.route);
		}
	}
}

/** @typedef {import("./router.js").Route} Route */
/** @typedef {object & {routes: Array<Route>, targetElement: HTMLElement, router: Router, afterRoute: function, beforeRoute: function, injectParams: function, onRenderComplete: function, go: function }} Application */

/**
 * Creates a new single-page application.
 * @param {HTMLElement} targetElement The element to render the SPA into.
 * @param {Array<Route>} routes The routes to use for the SPA.
 * @param {BaseView} pageNotFoundView The view to use when a route is not found.
 * @returns {Application}
 */
const application = (
	targetElement,
	routes,
	pageNotFoundView = DefaultPageNotFound
) => {
	window._router = new Router(targetElement, routes, pageNotFoundView);
	window.navigateTo = window._router.navigateTo.bind(window._router);

	window.addEventListener("popstate", (e) => {
		window._router._route({
			state: e.state,
		});
	});

	return {
		routes: routes,
		targetElement: targetElement,
		router: window._router,

		afterRoute: (f) => {
			window._router.afterRoute = f.bind(window._router);
		},

		beforeRoute: (f) => {
			window._router.beforeRoute = f.bind(window._router);
		},

		injectParams: (f) => {
			window._router.injectParams = f.bind(window._router);
		},

		onRenderComplete: (f) => {
			window._router.onRenderComplete = f.bind(window._router);
		},

		go: () => {
			window._router._route({});
		},
	};
};

class MemberService {
  spinnerEl;

  constructor(spinnerEl) {
    this.spinnerEl = spinnerEl;
  }

  async getCurrentMember() {
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    let response = await fetcher(`/api/member/current`, options, this.spinnerEl);
    let result = await response.json();
    return result;
  }
}

/*
 * MemberLoginBar is a component used to display a member dropdown in the header of websites. 
 * It displays either a user-uploaded image or the letter of the first initial of the user's name. 
 * When logged in the menu provides links to the user's account and log off. If the user is not logged 
 * in then a log in link is displayed.
 *
 * To work with member data this component requires service component that provides the following.
 *   - getCurrentMember - Must return an object with fields memberID, firstName, lastName, profilePictureURL
 *
 * This component uses Feather Icons. https://feathericons.com/
 * 
 * Copyright © 2022 App Nerds LLC
*/

class MemberLoginBar extends HTMLElement {
  memberService;
  loginPath;

  constructor() {
    super();

    this.loginPath = this.getAttribute("login-path") || "/member/login";
    const spinner = this.getAttribute("spinner") || null;
    let spinnerEl = null;

    if (spinner) {
      spinnerEl = document.querySelector(spinner);
    }

    this.memberService = new MemberService(spinnerEl);
  }

  static get observedAttributes() {
    return ["login-path"];
  }

  set memberService(/** @type {any} */ service) {
    this.memberService = service;
  }

  attributedChangedCallback(name, _, newValue) {
    if (name === "login-path") {
      this.loginPath = newValue;
    }
  }

  async connectedCallback() {
    let member = null;

    member = await this.memberService.getCurrentMember();

    const containerEl = this.createContainerEl();
    this.createAvatarEl(containerEl, member);
    this.createTextEl(containerEl, member);
    this.createPopupMenu(containerEl, member);

    this.insertAdjacentElement("beforeend", containerEl);
    feather.replace();
  }

  /*******************************************************************************
   * Event methods
   ******************************************************************************/

  /*******************************************************************************
   * UI elements
   ******************************************************************************/

  createContainerEl() {
    const el = document.createElement("div");
    return el;
  }

  createAvatarEl(container, member) {
    let el;

    if (member && member.avatarURL) {
      el = document.createElement("img");
      el.classList.add("avatar");
      el.setAttribute("role", "img");
      el.src = member.avatarURL;
    } else {
      el = document.createElement("div");
      el.classList.add("avatar");
      el.setAttribute("role", "img");
      el.innerHTML = `<i data-feather="user"></i>`;
    }

    container.insertAdjacentElement("beforeend", el);
  }

  createTextEl(container, member) {
    let markup;

    const el = document.createElement("a");
    el.id = "member-link";

    if (member && member.email) {
      let name = "";

      el.href = "#";

      if (member.firstName) {
        name += member.firstName;
      }

      if (member.lastName) {
        name += ` ${member.lastName}`;
      }

      if (name === "") {
        name = "User";
      }

      markup = `${name} <i data-feather="chevron-down"></i>`;
    } else {
      el.href = this.loginPath;
      markup = "Log In";
    }

    el.innerHTML = markup;
    container.insertAdjacentElement("beforeend", el);
  }

  createPopupMenu(container, member) {
    if (member && member.email) {
      const el = document.createElement("popup-menu");
      el.setAttribute("trigger", "#member-link");

      const menuItems = [
        { id: "member-my-account-link", text: "My Account", icon: "home", handler: this.onMyAccountClick.bind(this) },
        { id: "member-log-out-link", text: "Log Out", icon: "log-out", handler: this.onLogOutClick.bind(this) },
      ];

      menuItems.forEach(data => {
        const menuItem = document.createElement("popup-menu-item");
        menuItem.setAttribute("id", data.id);
        menuItem.setAttribute("text", data.text);
        menuItem.setAttribute("icon", data.icon);
        menuItem.addEventListener("click", data.handler);

        el.insertAdjacentElement("beforeend", menuItem);
      });

      container.insertAdjacentElement("beforeend", el);
    }
  }

  /*******************************************************************************
   * Private methods
   ******************************************************************************/

  onMyAccountClick() {
    window.location = "/member/profile";
  }

  onLogOutClick() {
    window.location = "/api/member/logout";
  }
}

if (!customElements.get("member-login-bar")) {
  customElements.define("member-login-bar", MemberLoginBar);
}

/*
 * Copyright © 2022 App Nerds LLC
 */

class GoogleLoginForm extends HTMLElement {
  loginPath;
  createAccountPath;
  signInButtonURL;

  constructor() {
    super();

    this.loginPath = this.getAttribute("login-path") || "/auth/google";
    this.createAccountPath = this.getAttribute("create-account-path") || "/create-account";
    this.signInButtonURL = this.getAttribute("sign-in-button-url") || "/static/images/sign-in-with-google.jpg";
  }

  connectedCallback() {
    const sectionEl = document.createElement("section");
    sectionEl.classList.add("google-login-form");

    const footerEl = document.createElement("div");
    footerEl.classList.add("sign-up-footer");

    sectionEl.innerHTML = `
      <a href="${this.loginPath}"><img src="${this.signInButtonURL}" alt="Sign in with Google" style="width:100%;" /></a>
    `;

    footerEl.innerHTML = `
      <p>
        Don't have an account? Click <a href="${this.createAccountPath}">here</a> to create one.
      </p>
    `;

    sectionEl.insertAdjacentElement("beforeend", footerEl);
    this.insertAdjacentElement("beforeend", sectionEl);
  }
}

if (!customElements.get("google-login-form")) {
  customElements.define("google-login-form", GoogleLoginForm);
}

/**
 * MessageBar is a component used to display a message on the screen.
 * @class MessageBar
 * @extends {HTMLElement}
 * @property {string} messageType The type of message to display. Valid values are "error", "warn", "info", and "success".
 * @property {string} message The message to display.
 */
class MessageBar extends HTMLElement {
	constructor() {
		super();

		this.messageType = this.getAttribute("message-type") || "info";
		this.message = this.getAttribute("message") || "";

		this.containerEl = null;
	}

	connectedCallback() {
		this.containerEl = this._createContainerEl();
		const closeButtonEl = this._createCloseButtonEl();
		const textEl = this._createTextEl();

		this.containerEl.insertAdjacentElement("beforeend", closeButtonEl);
		this.containerEl.insertAdjacentElement("beforeend", textEl);

		this.insertAdjacentElement("beforeend", this.containerEl);
	}

	_createContainerEl() {
		const el = document.createElement("div");
		el.classList.add("message-bar");

		switch (this.messageType) {
			case "error":
				el.classList.add("message-bar-error");
				break;

			case "warn":
				el.classList.add("message-bar-warn");
				break;

			case "info":
				el.classList.add("message-bar-info");
				break;

			case "success":
				el.classList.add("message-bar-success");
				break;
		}

		return el;
	}

	_createCloseButtonEl() {
		const el = document.createElement("span");
		el.innerHTML = "&times;";

		el.addEventListener("click", () => {
			if (this.containerEl) {
				this.containerEl.remove();
			}
		});

		return el;
	}

	_createTextEl() {
		const el = document.createElement("p");
		el.setAttribute("role", "alert");
		el.innerHTML = this.message;

		return el;
	}
}

if (!customElements.get("message-bar")) {
	customElements.define("message-bar", MessageBar);
}

/**
 * ColorPicker is a component used to display a color picker on the screen.
 * If the color the user wants is not there, they can type a hex code into the box to get
 * the color they want.
 * @class ColorPicker
 * @extends {HTMLElement}
 * @property {string} color The currently selected color.
 * @property {string} colors A comma-separated list of colors to display in the grid. These must be valid hex codes.
 * @property {string} name The name of the input field.
 */
class ColorPicker extends HTMLElement {
	constructor() {
		super();

		this._color = this.getAttribute("color") || "";
		this._colors = this.getAttribute("colors") || "#ffffff,#858585,#000000,#fc1303,#8f0b01,#fc5e03,#943701,#fcc600,#8f7000,#37fc00,#1e8701,#03fcdf,#018778,#05c5fa,#017291,#0349fc,#002582,#7e00fc,#47018c,#fc03f4,#8a0085,#fa009a,#8a0055";
		this._name = this.getAttribute("name") || "color";

		const colorOptions = this._colors.split(",");

		const outerContainer = this._createOuterContainer();
		const colorGrid = this._createColorGrid(colorOptions, this._color);
		this.input = this._createInput(this._name, this._color);

		outerContainer.insertAdjacentElement("beforeend", colorGrid);
		outerContainer.insertAdjacentElement("beforeend", this.input);
		this.appendChild(outerContainer);
	}

	_createOuterContainer() {
		return Object.assign(document.createElement("div"), { className: "color-picker" });
	}

	_createColorGrid(colors, selectedColor) {
		const grid = Object.assign(document.createElement("div"), { className: "grid" });

		colors.forEach(color => {
			const el = this._createColorItem(color, selectedColor);
			grid.insertAdjacentElement("beforeend", el);
		});

		return grid;
	}

	_createColorItem(color, selectedColor) {
		const el = Object.assign(document.createElement("div"), {
			className: "grid-item",
			style: `background-color: ${color}`,
		});

		el.setAttribute("data-color", color);

		if (selectedColor === color) {
			el.classList.add("grid-item-selected");
		}

		el.addEventListener("click", this._onColorItemClicked.bind(this));
		return el;
	}

	_createInput(name, color) {
		const el = Object.assign(document.createElement("input"), {
			type: "text",
			name: name,
			"aria-label": "Selected color hexidecimal value",
			autocomplete: "on",
			className: "color-input",
			value: color,
		});

		return el;
	}

	_onColorItemClicked(e) {
		this._clearGridSelectedClasses();

		const color = e.target.getAttribute("data-color");
		e.target.classList.add("grid-item-selected");

		this.input.value = color;
		this.dispatchEvent(new CustomEvent("color-selected", { detail: color }));
	}

	_clearGridSelectedClasses() {
		const gridItems = document.querySelectorAll(".grid-item");

		for (let i = 0; i < gridItems.length; i++) {
			gridItems[i].classList.remove("grid-item-selected");
		}
	}
}

if (!customElements.get("color-picker")) {
	customElements.define("color-picker", ColorPicker);
}

/**
 * TagCloud is a web component that displays a list of tags.
 *
 * Styling is provided by autocomplete.css. It relies on variables:
 *   - --tagcloud-background-color
 *   - --tagcloud-text-color
 *
 * Usage example:
 *    <tag-cloud id="tagCloud"></tag-cloud>
 *
 *    <script>
 *       const tagCloud = document.getElementById("tagCloud");
 *
 *       tagCloud.addTags([
 *          { id: 1, label: "JavaScript", data: { id: 1, name: "JavaScript" } },
 *       ]);
 *
 *       tagCloud.addEventListener("tag-click", (e) => {
 *          console.log(e.detail.label);
 *          console.log(e.detail.data);
 *       };
 *
 *       tagCloud.addEventListener("tag-remove", (e) => {
 *          console.log(`Removed tag: ${e.detail.label}, ${e.detail.data}`);
 *       });
 *
 *       tagCloud.addEventListener("tag-add", (e) => {
 *          console.log(`Added tag: ${e.detail.label}, ${e.detail.data}`);
 *       });
 *
 *    </script>
 *
 * @class TagCloud
 * @extends HTMLElement
 */
class TagCloud extends HTMLElement {
	constructor() {
		super();

      this._tags = [];

      this._container = document.createElement("div");
      this._container.classList.add("tag-cloud-container");
	}

	connectedCallback() {
      this._render();
      this.appendChild(this._container);
   }

   addTags(tags) {
      // Only add unique tags
      tags.forEach((tag) => {
         if (!this._tags.find((t) => t.id === tag.id)) {
            this._tags.push(tag);
         }
      });

      this._render();
   }

   _render() {
      this._container.innerHTML = "";

      this._tags.forEach((tag) => {
         this._container.appendChild(this._renderTag(tag));
      });
   }

   _renderTag(tag) {
      const tagEl = document.createElement("div");
      tagEl.classList.add("tag-cloud-tag");
      tagEl.textContent = tag.label;
      tagEl.addEventListener("click", () => {
         this.dispatchEvent(new CustomEvent("tag-click", {
            detail: tag,
         }));
      });

      const removeEl = document.createElement("i");
      removeEl.classList.add("tag-cloud-icon");
      removeEl.classList.add("tag-cloud-icon-close");
      removeEl.addEventListener("click", (e) => {
         e.stopPropagation();
         this._removeTag(tag);
      });
      tagEl.appendChild(removeEl);

      return tagEl;
   }

   _removeTag(tag) {
      this._tags = this._tags.filter((t) => t.id !== tag.id);
      this._render();
      this.dispatchEvent(new CustomEvent("tag-remove", {
         detail: tag,
      }));
   }
}

if (!customElements.get("tag-cloud")) {
	customElements.define("tag-cloud", TagCloud);
}

/**
 * AutoComplete is a Web Component that provides a list of suggestions based on user input.
 *
 * Styling is provided by autocomplete.css. It relies on variables:
 *   - --autocomplete-background-color
 *   - --autocomplete-border-color
 *   - --autocomplete-border-radius
 *   - --autocomplete-item-hover-background-color
 *   - --autocomplete-item-hover-color
 *   - --autocomplete-max-width
 *   - --autocomplete-max-height
 *
 * Attributes:
 *   - id: The id of the element
 *   - name: The name of the element 
 *   - placeholder: The placeholder text for the input field
 *   - label: The label for the input field
 *   - multiple: Whether or not the input should accept multiple values. true or false
 *   - submission-style: How the values should be submitted. Options are "delimited", 
 *       "json", "multiple". Only applicable with "multiple" is true
 *   - "delimited" will submit the values as a comma-separated list in a hidden field 
 *       named by "name"
 *   - "json" will submit the values as a JSON array in a hidden field named by "name"
 *   - "multiple" will submit the values as multiple hidden fields named by "name<N>". 
 *       Each hidden field's name will be suffixed with an incrementing number.
 *   - delimiter: The delimiter to use when submission-style is "delimited". Only 
 *       applicable with "multiple" is true and the submission style is set to "delimited"
 *   - debouce: The number of milliseconds to wait before calling the options function 
 *       when the user types in the input field
 *
 * Usage example:
 *    <auto-complete id="autoComplete" name="country" placeholder="Search for a country" label="Country" multiple="true" submission-style="delimited" delimiter=","></auto-complete>
 *
 *    <script>
 *       const autoComplete = document.getElementById("autoComplete");
 *       
 *       autoComplete.addEventListener("select", (e) => {
 *          console.log(e.detail);
 *       });
 *
 *       autoComplete.options = [
 *          { value: "US", label: "United States", data: { id: 1, name: "United States", code: "US" } },
 *       ];
 *
 *       // OR
 *
 *       autoComplete.options = async (searchTerm) => {
 *          const response = await fetch(`https://restcountries.eu/rest/v2/name/${searchTerm}`);
 *          const data = await response.json();
 *
 *          return data.map((country) => {
 *             return {
 *                value: country.code,
 *                label: country.name,
 *                data: country,
 *             };
 *          };
 *       };
 *
 *    </script>
 *
 * @class AutoComplete
 * @extends HTMLElement
 */
class AutoComplete extends HTMLElement {
	constructor() {
		super();

      this._options = [];
      this._isVisible = false;

      // Attributes
      this._placeholder = this.getAttribute("placeholder") || "";
      this._label = this.getAttribute("label");
      this._name = this.getAttribute("name") || "autocomplete";
      this._multiple = this.getAttribute("multiple") === "true" ? true : false;
      this._submissionStyle = this.getAttribute("submission-style") || "delimited";
      this._delimiter = this.getAttribute("delimiter") || ",";
      this._debounce = this.getAttribute("debounce") ? parseInt(this.getAttribute("debounce")) : 300;

      /*
       * Elements
       */
      this._textFieldID = `autoCompleteTextField${Math.floor(Math.random() * 100000)}`;
      this._textField = null;                                                             /* The text field a user types in to search */
      this._hiddenFields = [];                                                            /* One or more hidden fields to hold selected values */
      this._optionsContainer = null;                                                      /* Element used to show found options*/
      this._tagCloud = null;                                                              /* Selected values when multiple is true */
      this._foundOptions = [];                                                            /* When a user searches, these are the options we find */
      this._highlightOption = -1;                                                         /* Index of the selected value if using the keyboard */

      this._createComponents();
	}

	connectedCallback() {
      this._textField.addEventListener("input", this._onTextFieldInput.bind(this));

      /*
       * Re-open the container if we click the trigger and there is text in the trigger box
       */
      this._textField.addEventListener("click", () => {
         if (this._textField.value) {
            this._onTextFieldInput({
               target: {
                  value: this._textField.value,
               },
            });
         }
      });

      /*
       * Close the container if we click outside of it or the trigger
       */
      document.addEventListener("click", (e) => {
         if (e.target !== this._textField && !this.contains(e.target)) {
            this._hide();
         }
      });
   }

   get onChange() {
      return this._onChange;
   }

   set onChange(fn) {
      this._onChange = fn;
   }

   get options() {
      return this._options;
   }

   set options(value) {
      this._options = value;
   }

   /**
    * _appendValue is used when multiple is true. Here are the scenarios:
    *    - submission-style == "delimited": A single hidden field represents a
    *      delimited list of selections.
    *    - submission-style == "json": The selections are converted to a JSON array
    *    - submission-style == "multiple": Multiple hidden inputs are maintained
    */
   _appendValue(data) {
      console.log(`appending new selection: `, data);
      this._tagCloud.addTags([
         {
            id: data.value,
            label: data.label,
            data: data.data,
         },
      ]);

      /*
       * If multiple style, add another hidden element.
       */
      if (this._submissionStyle === "multiple") {
         const newHiddenField = document.createElement("hidden");
         newHiddenField.type = "hidden";
         newHiddenField.name = `${this._name}${this._hiddenFields.length+1}`;
         newHiddenField.value = data.value;

         this._hiddenFields.push(newHiddenField);
         this.appendChild(newHiddenField);
         return;
      }

      /*
       * If we are using delimited style, pull the value, push a new one
       * in, and join it together with the specified delimiter.
       */
      if (this._submissionStyle === "delimited") {
         const currentValues = this._hiddenFields[0].value;
         const deconstructed = currentValues.split(this._delimiter);
         deconstructed.push(`${data.value}`);

         this._hiddenFields[0].value = this._removeBlankEntries(deconstructed).join(this._delimiter);
         return;
      }

      /*
       * JSON is similar. Pull the value out, deserialize it, add it,
       * and serialize it back.
       */
      if (this._submissionStyle === "json") ;
   }

   /**
    * Create the components for the AutoComplete. This creates the label, text field, hidden field, and options container.
    */
   _createComponents() {
      /*
       * Create a label if a label value is provided.
       */
      if (this._label) {
         const label = document.createElement("label");
         label.setAttribute("for", this._textFieldID);
         label.textContent = this._label;

         this.appendChild(label);
      }

      /*
       * Text field used to search for values.
       */
      this._textField = document.createElement("input");
      this._textField.type = "text";
      this._textField.id = this._textFieldID;
      this._textField.placeholder = this._placeholder;
      this._textField.autocomplete = "off";
      this._textField.addEventListener("keydown", this._onNavigation.bind(this));
      this._textField.style.marginBottom = "0.24rem";

      this.appendChild(this._textField);

      /*
       * Create hidden fields to store user selections. The rules are this:
       *    - If multiple is true, and submission-style is multiple, we'll 
       *      create many hidden inputs. In this scenario, hidden fields are
       *      added during selection.
       *    - All other cases create a single hidden input field which is
       *      created right away.
       */
      if (!this._multiple || (this._multiple && this._submissionStyle !== "multiple")) {
         const newHiddenField = document.createElement("input");
         newHiddenField.type = "hidden";
         newHiddenField.name = this._name;

         this._hiddenFields.push(newHiddenField);
         this.appendChild(newHiddenField);
      }

      /*
       * If we are selecting multiple, we will display a tag cloud 
       * beneath our control.
       */
      if (this._multiple) {
         // this._tagCloud = document.createElement("<tag-cloud>");
         this._tagCloud = new TagCloud();
         this._tagCloud.addEventListener("tag-remove", this._onRemoveSelection.bind(this));  

         this.appendChild(this._tagCloud);
      }

      /*
       * The options container
       */
      this._optionsContainer = document.createElement("ul");
      this._optionsContainer.classList.add("autocomplete-options-container");
      this._optionsContainer.classList.add("autocomplete-options-hidden");

      this.appendChild(this._optionsContainer);
   }

   /**
    * Hide the options container
    */
   _hide() {
      this._isVisible = false;
      this._optionsContainer.classList.add("autocomplete-options-hidden");
   }

   _highlightNextOption() {
      if (this._foundOptions.length === 0) {
         this._highlightOption = -1;
         return;
      }

      this._highlightOption++;

      if (this._highlightOption >= this._foundOptions.length) {
         this._highlightOption = 0;
      }
   }

   _highlightPreviousOption() {
      if (this._foundOptions.length === 0) {
         this._highlightOption = -1;
         return;
      }

      this._highlightOption--;

      if (this._highlightOption < 0) {
         this._highlightOption = this._foundOptions.length - 1;
      }
   }

   /**
    * Called when the user navigates using up and down arrow keypresses. 
    * This function will essentially highlight the next or previous option
    * allowing the user to press Enter to select.
    */
   _onNavigation(e) {
      console.group(`_onNavigation`);
      console.log(`in keydown: `, e);
      if (!this._isVisible) {
         console.log(`returning because we aren't visible`);
         console.groupEnd();
         return;
      }

      if (e.key === "ArrowDown") {
         console.log(`arrow down`);
         e.preventDefault();
         this._highlightNextOption();

         this._renderOptions();
         console.groupEnd();
         return
      } 

      if (e.key === "ArrowUp") {
         e.preventDefault();
         this._highlightPreviousOption();

         this._renderOptions();
         return;
      } 

      if (e.key === "Enter") {
         e.preventDefault();
         this._selectHighlightedOption();
      }
   }

   /** 
    * Event handler for when a user clicks to remove a selection (tag). This will
    * adjust the hidden field(s) to remove the selected item.
    */
   _onRemoveSelection(e) {
      console.log(`removing ${e.detail.label}`);
   }

   /**
   * When an option is selected, we want to set the value of the text field and hidden field(s).
   * If this control is set to multiple, the style and delimiters will dictate how hidden fields
   * are populated and created.
   */
   _onSelectOption(data) {
      if (this._multiple) {
         this._appendValue(data);
      } else {
         this._setValue(data);
      }

      this._hide();
   }

   /**
    * When the text field input event is triggered, we want to search the options and display them in the options container.
    * @param {Event} e 
    */
   async _onTextFieldInput(e) {
      if (e.target.value === "") {
         this._hide();
         return;
      }

      this._foundOptions = await this._searchOptions(e.target.value);

      if (this._foundOptions.length === 0) {
         if (this._isVisible) {
            this._hide();
         }

         return;
      }

      this._renderOptions();
      this._trigger();
   }

   _removeBlankEntries(values) {
      return values.filter(v => !!v && v !== "");
   }

   /**
    * Render the options in the options container.
    */
   _renderOptions() {
      this._optionsContainer.innerHTML = "";

      this._foundOptions.forEach((option, index) => {
         const optionEl = document.createElement("li");
         optionEl.classList.add("autocomplete-option");
         optionEl.addEventListener("click", (e) => { 
            e.stopPropagation(); 
            this._onSelectOption(option); 
         });
         
         const a = document.createElement("a");
         a.textContent = option.label;
         a.href = "javascript:void(0)";
         a.dataset.id = option.value;

         if (option.data) {
            a.dataset.data = JSON.stringify(option.data);
         }

         /*
         * If the user has navigated using the keyboard, _highlightOption will be set to the 
         * index of the option. Add a class for it. Moving the mouse will remove the class.
         */
         if (this._highlightOption === index) {
            a.classList.add("hover");
         }

         a.addEventListener("click", (e) => { 
            e.stopPropagation(); 
            this._onSelectOption(option); 
         });

         optionEl.appendChild(a);

         /*
          * When the mouse over the container, remove any anchors with a hover class.
          */
         optionEl.addEventListener("mouseover", () => {
            this._optionsContainer.querySelectorAll("a").forEach((anchor) => {
               anchor.classList.remove("hover");
            });
         });

         this._optionsContainer.appendChild(optionEl);
      });
   }

   /**
    * Search the options based on the search term. If the options are a function, call the function and pass the search term.
    * If the options are an array, filter the array based on the search term. The result MUST be in the format of
    *    { "value": "value here", "label": "this is displayed", "data": { "this": "is optional" } }
    * @param {String} searchTerm 
    * @returns {Promise<Array>}
    */
   async _searchOptions(searchTerm) {
      return new Promise((resolve) => {
         if (typeof this._options === "function") {
            debounce(async () => {
               const result = await this._options(searchTerm);
               resolve(result);
            }, this._debounce);

            return;
         }

         /*
          * If this is not a function, it's an array. Filter the array based on the search term
          */
         const result = this._options.filter((option) => {
            return option.label.toLowerCase().includes(searchTerm.toLowerCase());
         });

         resolve(result);
      });
   }

   /**
    * _setValue is only used when multiple is false. It is designed for single
    * selection.
    */
   _setValue(data) {
      this._textField.value = data.label;
      this._hiddenFields[0].value = data.value;

      this.dispatchEvent(new CustomEvent("select", {
         detail: data,
      }));
   }

   /**
    * Show the the options container. It's position is based on the position of the text field
    * and is adjusted based on if the window goes past the browser window's rectangle.
    */
   _trigger() {
		let triggerRect = document
			.getElementById(this._textFieldID)
			.getBoundingClientRect();

      let containerRect = this._optionsContainer.getBoundingClientRect();
		let buffer = 3;

		let left = triggerRect.left;
      this._optionsContainer.style.left = `${left}px`;

		if (left + containerRect.width > window.innerWidth) {
         left = window.innerWidth - containerRect.width - buffer;
         this._optionsContainer.style.left = `${left}px`;
		}

      let top = triggerRect.y + triggerRect.height + buffer;
		this._optionsContainer.style.top = `${top}px`;

      if (top + containerRect.height > window.innerHeight) {
         top = triggerRect.y - containerRect.height - buffer;
         this._optionsContainer.style.top = `${top}px`;
      }

		this._isVisible = true;
		this._optionsContainer.classList.remove("autocomplete-options-hidden");
   }

}

if (!customElements.get("auto-complete")) {
	customElements.define("auto-complete", AutoComplete);
}

/**
 * AjaxTable
 *
 * Usage:
 *
 *   // Simple
 *   <ajax-table 
 *     id="myTable" 
 *     fetch-on-load="true"
 *     url="/api/contacts"
 *   >
 *     <table>
 *       <thead>
 *         <tr>
 *           <th data-key="name">Name</th>
 *           <th data-key="email">Email</th>
 *         </tr>
 *       </thead>
 *     </table>
 *   </ajax-table>
 *
 *   // Complex
 *   <ajax-table id="myTable" fetch-on-load="true">
 *     <table>
 *       <thead>
 *         <tr>
 *           <th>Column 1</th>
 *           <th>Column 2</th>
 *         </tr>
 *       </thead>
 *       <tbody></tbody>
 *     </table>
 *   </ajax-table>
 *
 *   <script>
 *     const t = document.querySelector("#myTable");
 *
 *     t.columnMapping = [
 *       "key1",
 *       (record, index) => {
 *         return `Key 2 is ${record.key2}`;
 *       },
 *     ];
 *
 *     t.fetcher = async () => {
 *       const options = {
 *         method: "GET",
 *         headers: {
 *           "Content-Type": "application/json",
 *         },
 *       };
 *
 *       const response = await fetch(`/api/getdata`, options);
 *       const json = await response.json();
 *       return json;
 *     };
 *     
 *     t.addEventListener("before-fetch", () => {
 *       console.log("before fetch");
 *     });
 *
 *     t.addEventListener("after-fetch", (e) => {
 *       console.log(`after fetch: `, e.detail);
 *     });
 *
 *     // you can refresh data by calling reload
 *     t.reload();
 *
 *   </script>
 */
class AjaxTable extends HTMLElement {
   constructor() {
      super();

      this._data = [];
      this._totalCount = 0;
      this._page = 0;

      /*
       * Elements
       */
      this._tbody = null;
      this._previousButtonEl = null;
      this._pageInfoEl = null;
      this._nextButtonEl = null;

      /*
       * Attributes
       */
      this._fetchOnLoad = (this.getAttribute("fetch-on-load") === "false") ? false : true;
      this._url = this.getAttribute("url");
      this._recordsKey = this.getAttribute("records-key");
      this._totalCountKey = this.getAttribute("total-count-key");
      this._pageKey = this.getAttribute("page-key");
      this._pageSize = (this.getAttribute("page-size")) ? parseInt(this.getAttribute("page-size")) : 10;
      this._previousButton = this.getAttribute("previous-button");
      this._pageInfo = this.getAttribute("page-info");
      this._nextButton = this.getAttribute("next-button");

      /*
       * Settings
       */
      this._fetcher = null;
      this._columnMapping = [];
      this._noPagesText = "No pages";
   }

   /***********************************************************
    * Getters and setters
    **********************************************************/
   get fetcher() {
      return this._fetcher;
   }

   set fetcher(value) {
      if (typeof value !== "function") {
         throw new Error("'fetcher' must be a function");
      }

      this._fetcher = value;

      if (this._fetchOnLoad) {
         this._fetch();
      }
   }

   get columnMapping() {
      return this._columnMapping;
   }

   set columnMapping(value) {
      this._columnMapping = value;
   }

   get data() {
      return this._data;
   }

   set data(value) {
      this._data = value;
      this._fetch();
   }

   /***********************************************************
    * Public methods
    **********************************************************/
   reload() {
      this._fetch();
   }

   setColumnMapping(index, mapping) {
      this._columnMapping[index] = mapping;
   }

   /***********************************************************
    * Private methods
    **********************************************************/
   connectedCallback() {
      if (!this.querySelector("table")) {
         throw new Error("You must provide a table element inside of this control");
      }

      this._tbody = this.querySelector("table").querySelector("tbody");

      if (!this._tbody) {
         throw new Error("You must provide a tbody element inside of the table");
      }

      /*
       * If the user has provided paging configuration, ensure they 
       * have paging elements.
       */
      if (this._usePagingInfo()) {
         this._previousButtonEl = this.querySelector(this._previousButton);
         this._nextButtonEl = this.querySelector(this._nextButton);
         this._pageInfoEl = this.querySelector(this._pageInfo);

         if (!this._previousButtonEl || !this._nextButtonEl || !this._pageInfoEl) {
            throw new Error("You must provide previousButton, nextButton, and pageInfo elements when paging keys are provided");
         }

         this._noPagesText = this._pageInfo.innerHTML;
         this._previousButtonEl.addEventListener("click", this._goToPreviousPage.bind(this));
         this._nextButtonEl.addEventListener("click", this._goToNextPage.bind(this));
      }

      /*
       * Build first part of column mapping from the markup. We
       * are looking for "key" data items in the header. Any header
       * column with out a key will need to be provided by calling
       * setColumnMapping().
       */
      const thEls = this.querySelectorAll("table thead th");

      thEls.forEach((el) => {
         const key = el.dataset.key;

         if (!key) {
            this._columnMapping.push(null);
            return;
         }

         this._columnMapping.push(key);
      });

      /*
       * If we have a URL and fetch on load is true, call the fetch function.
       * If a fetcher was already provided, it will be called by virtue
       * of setting the fetcher function.
       */
      if (this._url && this._fetchOnLoad) {
         this._fetch();
      }
   }

   /*
    * Fetches data and re-renders the body. It will dispatch events
    * before and after the fetch.
    */
   async _fetch() {
      if (!this._columnMapping || !this._columnMapping.length) {
         throw new Error("You must provide a columnMapping");
      }

      this.dispatchEvent(new CustomEvent("before-fetch", {}));
      await this._getDataAndPagingInfo();

      this._renderTable();
      this.dispatchEvent(new CustomEvent("after-fetch", { detail: this._data }));
   }

   async _getDataAndPagingInfo() {
      let result = {};

      if (this._url) {
         result = await this._getDataFromURL();
      } else if (this._fetcher) {
         result = await this._fetcher(this._page || 1);
      }

      if (this._recordsKey in result) {
         this._data = result[this._recordsKey];
      }

      if (this._usePagingInfo() && this._responseHasPagingInfo(result)) {
         this._page = result[this._pageKey];
      }

      if (this._totalCountKey in result) {
         this._totalCount = result[this._totalCountKey];
      }
   }

   async _getDataFromURL() {
      const page = this._page || 1;

      const options = {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      };

      const response = await fetcher(`${this._url}?page=${page}`, options);
      const result = await response.json();
      return result;
   }

   /*
    * Draws table rows and columns from fetched data.
    */
   _renderTable() {
      this._tbody.innerHTML = "";

      this._data.forEach(record => {
         const tr = document.createElement("tr");
            
         this._columnMapping.forEach((columnMapping, index) => {
            const content = this._renderColumnData(columnMapping, record, index);
            const td = this._createColumn(content);

            tr.appendChild(td);
         });

         this._tbody.appendChild(tr);
      });

      this._previousButtonEl.disabled = !this._hasPreviousPage();
      this._nextButtonEl.disabled = !this._hasNextPage();

      if (this._data.length <= 0) {
         this._pageInfoEl.innerHTML = this._noPagesText;
      } else {
         this._pageInfoEl.innerHTML = `Page ${this._page} of ${this._calculateNumPages()}`;
      }
   }

   /*
    * Creates a single column. If the content is a string the inner HTML
    * is set, otherwise if it is an object, it is assumed to be an HTML
    * element that can be appended.
    */
   _createColumn(content) {
      const td = document.createElement("td");

      if (typeof content === "string") {
         td.innerHTML = content;
      } else if (typeof content === "object") {
         td.appendChild(content);
      } 

      return td;
   }

   /*
    * Uses the column mapping to retrieve a specific key of data. If
    * the column mapping is a function, call it passing in the record.
    * A function should return either HTML string or an element.
    */
   _renderColumnData(columnMapping, record, index) {
      if (typeof columnMapping === "string") {
         return record[columnMapping];
      } else if (typeof columnMapping === "function") {
         return columnMapping(record, index);
      }

      return "";
   }

   _usePagingInfo() {
      return this._pageKey && this._totalCountKey;
   }

   _responseHasPagingInfo(response) {
      return (this._pageKey in response) && (this._totalCountKey in response);
   }

   _calculateNumPages() {
      return Math.ceil(this._totalCount / this._pageSize);
   }

   _hasNextPage() {
      return (this._page - 1) * this._pageSize + this._pageSize < this._totalCount;
   }

   _hasPreviousPage() {
      return this._page > 1;
   }

   _goToNextPage() {
      if (this._hasNextPage()) {
         this._page++;

         this.dispatchEvent(new CustomEvent("page-change", { detail: this._page }));
         this._fetch();
      }
   }

   _goToPreviousPage() {
      if (this._hasPreviousPage()) {
         this._page--;

         this.dispatchEvent(new CustomEvent("page-change", { detail: this._page }));
         this._fetch();
      }
   }
}

if (!customElements.get("ajax-table")) {
   customElements.define("ajax-table", AjaxTable);
}

export { AjaxTable, AlertPosition, Alerter, AutoComplete, BaseView, ColorPicker, Confirmer, DateFormats, DateTimePicker, ErrTokenExpired, GoogleLoginForm, GraphQL, MemberLoginBar, MemberService, MessageBar, PopupMenu, PopupMenuItem, Prompter, SessionService, Shim, Spinner, TagCloud, application, debounce, fetcher, formatDateTime, hidePopup, objectToMap, parseDateTime, showPopup };
