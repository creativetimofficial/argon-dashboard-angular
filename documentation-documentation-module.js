(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["documentation-documentation-module"],{

/***/ "./node_modules/nouislider/distribute/nouislider.js":
/*!**********************************************************!*\
  !*** ./node_modules/nouislider/distribute/nouislider.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! nouislider - 13.1.1 - 2/14/2019 */
(function(factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
})(function() {
    "use strict";

    var VERSION = "13.1.1";

    //region Helper Methods

    function isValidFormatter(entry) {
        return typeof entry === "object" && typeof entry.to === "function" && typeof entry.from === "function";
    }

    function removeElement(el) {
        el.parentElement.removeChild(el);
    }

    function isSet(value) {
        return value !== null && value !== undefined;
    }

    // Bindable version
    function preventDefault(e) {
        e.preventDefault();
    }

    // Removes duplicates from an array.
    function unique(array) {
        return array.filter(function(a) {
            return !this[a] ? (this[a] = true) : false;
        }, {});
    }

    // Round a value to the closest 'to'.
    function closest(value, to) {
        return Math.round(value / to) * to;
    }

    // Current position of an element relative to the document.
    function offset(elem, orientation) {
        var rect = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var docElem = doc.documentElement;
        var pageOffset = getPageOffset(doc);

        // getBoundingClientRect contains left scroll in Chrome on Android.
        // I haven't found a feature detection that proves this. Worst case
        // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
        if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
            pageOffset.x = 0;
        }

        return orientation
            ? rect.top + pageOffset.y - docElem.clientTop
            : rect.left + pageOffset.x - docElem.clientLeft;
    }

    // Checks whether a value is numerical.
    function isNumeric(a) {
        return typeof a === "number" && !isNaN(a) && isFinite(a);
    }

    // Sets a class and removes it after [duration] ms.
    function addClassFor(element, className, duration) {
        if (duration > 0) {
            addClass(element, className);
            setTimeout(function() {
                removeClass(element, className);
            }, duration);
        }
    }

    // Limits a value to 0 - 100
    function limit(a) {
        return Math.max(Math.min(a, 100), 0);
    }

    // Wraps a variable as an array, if it isn't one yet.
    // Note that an input array is returned by reference!
    function asArray(a) {
        return Array.isArray(a) ? a : [a];
    }

    // Counts decimals
    function countDecimals(numStr) {
        numStr = String(numStr);
        var pieces = numStr.split(".");
        return pieces.length > 1 ? pieces[1].length : 0;
    }

    // http://youmightnotneedjquery.com/#add_class
    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += " " + className;
        }
    }

    // http://youmightnotneedjquery.com/#remove_class
    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(
                new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
                " "
            );
        }
    }

    // https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
    function hasClass(el, className) {
        return el.classList
            ? el.classList.contains(className)
            : new RegExp("\\b" + className + "\\b").test(el.className);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
    function getPageOffset(doc) {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
        var x = supportPageOffset
            ? window.pageXOffset
            : isCSS1Compat
                ? doc.documentElement.scrollLeft
                : doc.body.scrollLeft;
        var y = supportPageOffset
            ? window.pageYOffset
            : isCSS1Compat
                ? doc.documentElement.scrollTop
                : doc.body.scrollTop;

        return {
            x: x,
            y: y
        };
    }

    // we provide a function to compute constants instead
    // of accessing window.* as soon as the module needs it
    // so that we do not compute anything if not needed
    function getActions() {
        // Determine the events to bind. IE11 implements pointerEvents without
        // a prefix, which breaks compatibility with the IE10 implementation.
        return window.navigator.pointerEnabled
            ? {
                  start: "pointerdown",
                  move: "pointermove",
                  end: "pointerup"
              }
            : window.navigator.msPointerEnabled
                ? {
                      start: "MSPointerDown",
                      move: "MSPointerMove",
                      end: "MSPointerUp"
                  }
                : {
                      start: "mousedown touchstart",
                      move: "mousemove touchmove",
                      end: "mouseup touchend"
                  };
    }

    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    // Issue #785
    function getSupportsPassive() {
        var supportsPassive = false;

        /* eslint-disable */
        try {
            var opts = Object.defineProperty({}, "passive", {
                get: function() {
                    supportsPassive = true;
                }
            });

            window.addEventListener("test", null, opts);
        } catch (e) {}
        /* eslint-enable */

        return supportsPassive;
    }

    function getSupportsTouchActionNone() {
        return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
    }

    //endregion

    //region Range Calculation

    // Determine the size of a sub-range in relation to a full range.
    function subRangeRatio(pa, pb) {
        return 100 / (pb - pa);
    }

    // (percentage) How many percent is this value of this range?
    function fromPercentage(range, value) {
        return (value * 100) / (range[1] - range[0]);
    }

    // (percentage) Where is this value on this range?
    function toPercentage(range, value) {
        return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0]);
    }

    // (value) How much is this percentage on this range?
    function isPercentage(range, value) {
        return (value * (range[1] - range[0])) / 100 + range[0];
    }

    function getJ(value, arr) {
        var j = 1;

        while (value >= arr[j]) {
            j += 1;
        }

        return j;
    }

    // (percentage) Input a value, find where, on a scale of 0-100, it applies.
    function toStepping(xVal, xPct, value) {
        if (value >= xVal.slice(-1)[0]) {
            return 100;
        }

        var j = getJ(value, xVal);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];

        return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
    }

    // (value) Input a percentage, find where it is on the specified range.
    function fromStepping(xVal, xPct, value) {
        // There is no range group that fits 100
        if (value >= 100) {
            return xVal.slice(-1)[0];
        }

        var j = getJ(value, xPct);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];

        return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
    }

    // (percentage) Get the step that applies at a certain value.
    function getStep(xPct, xSteps, snap, value) {
        if (value === 100) {
            return value;
        }

        var j = getJ(value, xPct);
        var a = xPct[j - 1];
        var b = xPct[j];

        // If 'snap' is set, steps are used as fixed points on the slider.
        if (snap) {
            // Find the closest position, a or b.
            if (value - a > (b - a) / 2) {
                return b;
            }

            return a;
        }

        if (!xSteps[j - 1]) {
            return value;
        }

        return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
    }

    function handleEntryPoint(index, value, that) {
        var percentage;

        // Wrap numerical input in an array.
        if (typeof value === "number") {
            value = [value];
        }

        // Reject any invalid input, by testing whether value is an array.
        if (!Array.isArray(value)) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
        }

        // Covert min/max syntax to 0 and 100.
        if (index === "min") {
            percentage = 0;
        } else if (index === "max") {
            percentage = 100;
        } else {
            percentage = parseFloat(index);
        }

        // Check for correct input.
        if (!isNumeric(percentage) || !isNumeric(value[0])) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
        }

        // Store values.
        that.xPct.push(percentage);
        that.xVal.push(value[0]);

        // NaN will evaluate to false too, but to keep
        // logging clear, set step explicitly. Make sure
        // not to override the 'step' setting with false.
        if (!percentage) {
            if (!isNaN(value[1])) {
                that.xSteps[0] = value[1];
            }
        } else {
            that.xSteps.push(isNaN(value[1]) ? false : value[1]);
        }

        that.xHighestCompleteStep.push(0);
    }

    function handleStepPoint(i, n, that) {
        // Ignore 'false' stepping.
        if (!n) {
            return;
        }

        // Step over zero-length ranges (#948);
        if (that.xVal[i] === that.xVal[i + 1]) {
            that.xSteps[i] = that.xHighestCompleteStep[i] = that.xVal[i];

            return;
        }

        // Factor to range ratio
        that.xSteps[i] =
            fromPercentage([that.xVal[i], that.xVal[i + 1]], n) / subRangeRatio(that.xPct[i], that.xPct[i + 1]);

        var totalSteps = (that.xVal[i + 1] - that.xVal[i]) / that.xNumSteps[i];
        var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
        var step = that.xVal[i] + that.xNumSteps[i] * highestStep;

        that.xHighestCompleteStep[i] = step;
    }

    //endregion

    //region Spectrum

    function Spectrum(entry, snap, singleStep) {
        this.xPct = [];
        this.xVal = [];
        this.xSteps = [singleStep || false];
        this.xNumSteps = [false];
        this.xHighestCompleteStep = [];

        this.snap = snap;

        var index;
        var ordered = []; // [0, 'min'], [1, '50%'], [2, 'max']

        // Map the object keys to an array.
        for (index in entry) {
            if (entry.hasOwnProperty(index)) {
                ordered.push([entry[index], index]);
            }
        }

        // Sort all entries by value (numeric sort).
        if (ordered.length && typeof ordered[0][0] === "object") {
            ordered.sort(function(a, b) {
                return a[0][0] - b[0][0];
            });
        } else {
            ordered.sort(function(a, b) {
                return a[0] - b[0];
            });
        }

        // Convert all entries to subranges.
        for (index = 0; index < ordered.length; index++) {
            handleEntryPoint(ordered[index][1], ordered[index][0], this);
        }

        // Store the actual step values.
        // xSteps is sorted in the same order as xPct and xVal.
        this.xNumSteps = this.xSteps.slice(0);

        // Convert all numeric steps to the percentage of the subrange they represent.
        for (index = 0; index < this.xNumSteps.length; index++) {
            handleStepPoint(index, this.xNumSteps[index], this);
        }
    }

    Spectrum.prototype.getMargin = function(value) {
        var step = this.xNumSteps[0];

        if (step && (value / step) % 1 !== 0) {
            throw new Error("noUiSlider (" + VERSION + "): 'limit', 'margin' and 'padding' must be divisible by step.");
        }

        return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
    };

    Spectrum.prototype.toStepping = function(value) {
        value = toStepping(this.xVal, this.xPct, value);

        return value;
    };

    Spectrum.prototype.fromStepping = function(value) {
        return fromStepping(this.xVal, this.xPct, value);
    };

    Spectrum.prototype.getStep = function(value) {
        value = getStep(this.xPct, this.xSteps, this.snap, value);

        return value;
    };

    Spectrum.prototype.getDefaultStep = function(value, isDown, size) {
        var j = getJ(value, this.xPct);

        // When at the top or stepping down, look at the previous sub-range
        if (value === 100 || (isDown && value === this.xPct[j - 1])) {
            j = Math.max(j - 1, 1);
        }

        return (this.xVal[j] - this.xVal[j - 1]) / size;
    };

    Spectrum.prototype.getNearbySteps = function(value) {
        var j = getJ(value, this.xPct);

        return {
            stepBefore: {
                startValue: this.xVal[j - 2],
                step: this.xNumSteps[j - 2],
                highestStep: this.xHighestCompleteStep[j - 2]
            },
            thisStep: {
                startValue: this.xVal[j - 1],
                step: this.xNumSteps[j - 1],
                highestStep: this.xHighestCompleteStep[j - 1]
            },
            stepAfter: {
                startValue: this.xVal[j],
                step: this.xNumSteps[j],
                highestStep: this.xHighestCompleteStep[j]
            }
        };
    };

    Spectrum.prototype.countStepDecimals = function() {
        var stepDecimals = this.xNumSteps.map(countDecimals);
        return Math.max.apply(null, stepDecimals);
    };

    // Outside testing
    Spectrum.prototype.convert = function(value) {
        return this.getStep(this.toStepping(value));
    };

    //endregion

    //region Options

    /*	Every input option is tested and parsed. This'll prevent
        endless validation in internal methods. These tests are
        structured with an item for every option available. An
        option can be marked as required by setting the 'r' flag.
        The testing function is provided with three arguments:
            - The provided value for the option;
            - A reference to the options object;
            - The name for the option;

        The testing function returns false when an error is detected,
        or true when everything is OK. It can also modify the option
        object, to make sure all values can be correctly looped elsewhere. */

    var defaultFormatter = {
        to: function(value) {
            return value !== undefined && value.toFixed(2);
        },
        from: Number
    };

    function validateFormat(entry) {
        // Any object with a to and from method is supported.
        if (isValidFormatter(entry)) {
            return true;
        }

        throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
    }

    function testStep(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
        }

        // The step option can still be used to set stepping
        // for linear sliders. Overwritten if set in 'range'.
        parsed.singleStep = entry;
    }

    function testRange(parsed, entry) {
        // Filter incorrect input.
        if (typeof entry !== "object" || Array.isArray(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
        }

        // Catch missing start or end.
        if (entry.min === undefined || entry.max === undefined) {
            throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
        }

        // Catch equal start or end.
        if (entry.min === entry.max) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
        }

        parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.singleStep);
    }

    function testStart(parsed, entry) {
        entry = asArray(entry);

        // Validate input. Values aren't tested, as the public .val method
        // will always provide a valid location.
        if (!Array.isArray(entry) || !entry.length) {
            throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
        }

        // Store the number of handles.
        parsed.handles = entry.length;

        // When the slider is initialized, the .val method will
        // be called with the start options.
        parsed.start = entry;
    }

    function testSnap(parsed, entry) {
        // Enforce 100% stepping within subranges.
        parsed.snap = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
        }
    }

    function testAnimate(parsed, entry) {
        // Enforce 100% stepping within subranges.
        parsed.animate = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
        }
    }

    function testAnimationDuration(parsed, entry) {
        parsed.animationDuration = entry;

        if (typeof entry !== "number") {
            throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
        }
    }

    function testConnect(parsed, entry) {
        var connect = [false];
        var i;

        // Map legacy options
        if (entry === "lower") {
            entry = [true, false];
        } else if (entry === "upper") {
            entry = [false, true];
        }

        // Handle boolean options
        if (entry === true || entry === false) {
            for (i = 1; i < parsed.handles; i++) {
                connect.push(entry);
            }

            connect.push(false);
        }

        // Reject invalid input
        else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
            throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
        } else {
            connect = entry;
        }

        parsed.connect = connect;
    }

    function testOrientation(parsed, entry) {
        // Set orientation to an a numerical value for easy
        // array selection.
        switch (entry) {
            case "horizontal":
                parsed.ort = 0;
                break;
            case "vertical":
                parsed.ort = 1;
                break;
            default:
                throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
        }
    }

    function testMargin(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
        }

        // Issue #582
        if (entry === 0) {
            return;
        }

        parsed.margin = parsed.spectrum.getMargin(entry);

        if (!parsed.margin) {
            throw new Error("noUiSlider (" + VERSION + "): 'margin' option is only supported on linear sliders.");
        }
    }

    function testLimit(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
        }

        parsed.limit = parsed.spectrum.getMargin(entry);

        if (!parsed.limit || parsed.handles < 2) {
            throw new Error(
                "noUiSlider (" +
                    VERSION +
                    "): 'limit' option is only supported on linear sliders with 2 or more handles."
            );
        }
    }

    function testPadding(parsed, entry) {
        if (!isNumeric(entry) && !Array.isArray(entry)) {
            throw new Error(
                "noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers."
            );
        }

        if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
            throw new Error(
                "noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers."
            );
        }

        if (entry === 0) {
            return;
        }

        if (!Array.isArray(entry)) {
            entry = [entry, entry];
        }

        // 'getMargin' returns false for invalid values.
        parsed.padding = [parsed.spectrum.getMargin(entry[0]), parsed.spectrum.getMargin(entry[1])];

        if (parsed.padding[0] === false || parsed.padding[1] === false) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option is only supported on linear sliders.");
        }

        if (parsed.padding[0] < 0 || parsed.padding[1] < 0) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number(s).");
        }

        if (parsed.padding[0] + parsed.padding[1] >= 100) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option must not exceed 100% of the range.");
        }
    }

    function testDirection(parsed, entry) {
        // Set direction as a numerical value for easy parsing.
        // Invert connection for RTL sliders, so that the proper
        // handles get the connect/background classes.
        switch (entry) {
            case "ltr":
                parsed.dir = 0;
                break;
            case "rtl":
                parsed.dir = 1;
                break;
            default:
                throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
        }
    }

    function testBehaviour(parsed, entry) {
        // Make sure the input is a string.
        if (typeof entry !== "string") {
            throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
        }

        // Check if the string contains any keywords.
        // None are required.
        var tap = entry.indexOf("tap") >= 0;
        var drag = entry.indexOf("drag") >= 0;
        var fixed = entry.indexOf("fixed") >= 0;
        var snap = entry.indexOf("snap") >= 0;
        var hover = entry.indexOf("hover") >= 0;
        var unconstrained = entry.indexOf("unconstrained") >= 0;

        if (fixed) {
            if (parsed.handles !== 2) {
                throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
            }

            // Use margin to enforce fixed state
            testMargin(parsed, parsed.start[1] - parsed.start[0]);
        }

        if (unconstrained && (parsed.margin || parsed.limit)) {
            throw new Error(
                "noUiSlider (" + VERSION + "): 'unconstrained' behaviour cannot be used with margin or limit"
            );
        }

        parsed.events = {
            tap: tap || snap,
            drag: drag,
            fixed: fixed,
            snap: snap,
            hover: hover,
            unconstrained: unconstrained
        };
    }

    function testTooltips(parsed, entry) {
        if (entry === false) {
            return;
        }

        if (entry === true) {
            parsed.tooltips = [];

            for (var i = 0; i < parsed.handles; i++) {
                parsed.tooltips.push(true);
            }
        } else {
            parsed.tooltips = asArray(entry);

            if (parsed.tooltips.length !== parsed.handles) {
                throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
            }

            parsed.tooltips.forEach(function(formatter) {
                if (
                    typeof formatter !== "boolean" &&
                    (typeof formatter !== "object" || typeof formatter.to !== "function")
                ) {
                    throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
                }
            });
        }
    }

    function testAriaFormat(parsed, entry) {
        parsed.ariaFormat = entry;
        validateFormat(entry);
    }

    function testFormat(parsed, entry) {
        parsed.format = entry;
        validateFormat(entry);
    }

    function testKeyboardSupport(parsed, entry) {
        parsed.keyboardSupport = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'keyboardSupport' option must be a boolean.");
        }
    }

    function testDocumentElement(parsed, entry) {
        // This is an advanced option. Passed values are used without validation.
        parsed.documentElement = entry;
    }

    function testCssPrefix(parsed, entry) {
        if (typeof entry !== "string" && entry !== false) {
            throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
        }

        parsed.cssPrefix = entry;
    }

    function testCssClasses(parsed, entry) {
        if (typeof entry !== "object") {
            throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
        }

        if (typeof parsed.cssPrefix === "string") {
            parsed.cssClasses = {};

            for (var key in entry) {
                if (!entry.hasOwnProperty(key)) {
                    continue;
                }

                parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
            }
        } else {
            parsed.cssClasses = entry;
        }
    }

    // Test all developer settings and parse to assumption-safe values.
    function testOptions(options) {
        // To prove a fix for #537, freeze options here.
        // If the object is modified, an error will be thrown.
        // Object.freeze(options);

        var parsed = {
            margin: 0,
            limit: 0,
            padding: 0,
            animate: true,
            animationDuration: 300,
            ariaFormat: defaultFormatter,
            format: defaultFormatter
        };

        // Tests are executed in the order they are presented here.
        var tests = {
            step: { r: false, t: testStep },
            start: { r: true, t: testStart },
            connect: { r: true, t: testConnect },
            direction: { r: true, t: testDirection },
            snap: { r: false, t: testSnap },
            animate: { r: false, t: testAnimate },
            animationDuration: { r: false, t: testAnimationDuration },
            range: { r: true, t: testRange },
            orientation: { r: false, t: testOrientation },
            margin: { r: false, t: testMargin },
            limit: { r: false, t: testLimit },
            padding: { r: false, t: testPadding },
            behaviour: { r: true, t: testBehaviour },
            ariaFormat: { r: false, t: testAriaFormat },
            format: { r: false, t: testFormat },
            tooltips: { r: false, t: testTooltips },
            keyboardSupport: { r: true, t: testKeyboardSupport },
            documentElement: { r: false, t: testDocumentElement },
            cssPrefix: { r: true, t: testCssPrefix },
            cssClasses: { r: true, t: testCssClasses }
        };

        var defaults = {
            connect: false,
            direction: "ltr",
            behaviour: "tap",
            orientation: "horizontal",
            keyboardSupport: true,
            cssPrefix: "noUi-",
            cssClasses: {
                target: "target",
                base: "base",
                origin: "origin",
                handle: "handle",
                handleLower: "handle-lower",
                handleUpper: "handle-upper",
                touchArea: "touch-area",
                horizontal: "horizontal",
                vertical: "vertical",
                background: "background",
                connect: "connect",
                connects: "connects",
                ltr: "ltr",
                rtl: "rtl",
                draggable: "draggable",
                drag: "state-drag",
                tap: "state-tap",
                active: "active",
                tooltip: "tooltip",
                pips: "pips",
                pipsHorizontal: "pips-horizontal",
                pipsVertical: "pips-vertical",
                marker: "marker",
                markerHorizontal: "marker-horizontal",
                markerVertical: "marker-vertical",
                markerNormal: "marker-normal",
                markerLarge: "marker-large",
                markerSub: "marker-sub",
                value: "value",
                valueHorizontal: "value-horizontal",
                valueVertical: "value-vertical",
                valueNormal: "value-normal",
                valueLarge: "value-large",
                valueSub: "value-sub"
            }
        };

        // AriaFormat defaults to regular format, if any.
        if (options.format && !options.ariaFormat) {
            options.ariaFormat = options.format;
        }

        // Run all options through a testing mechanism to ensure correct
        // input. It should be noted that options might get modified to
        // be handled properly. E.g. wrapping integers in arrays.
        Object.keys(tests).forEach(function(name) {
            // If the option isn't set, but it is required, throw an error.
            if (!isSet(options[name]) && defaults[name] === undefined) {
                if (tests[name].r) {
                    throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
                }

                return true;
            }

            tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
        });

        // Forward pips options
        parsed.pips = options.pips;

        // All recent browsers accept unprefixed transform.
        // We need -ms- for IE9 and -webkit- for older Android;
        // Assume use of -webkit- if unprefixed and -ms- are not supported.
        // https://caniuse.com/#feat=transforms2d
        var d = document.createElement("div");
        var msPrefix = d.style.msTransform !== undefined;
        var noPrefix = d.style.transform !== undefined;

        parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";

        // Pips don't move, so we can place them using left/top.
        var styles = [["left", "top"], ["right", "bottom"]];

        parsed.style = styles[parsed.dir][parsed.ort];

        return parsed;
    }

    //endregion

    function scope(target, options, originalOptions) {
        var actions = getActions();
        var supportsTouchActionNone = getSupportsTouchActionNone();
        var supportsPassive = supportsTouchActionNone && getSupportsPassive();

        // All variables local to 'scope' are prefixed with 'scope_'

        // Slider DOM Nodes
        var scope_Target = target;
        var scope_Base;
        var scope_Handles;
        var scope_Connects;
        var scope_Pips;
        var scope_Tooltips;

        // Override for the 'animate' option
        var scope_ShouldAnimate = true;

        // Slider state values
        var scope_Spectrum = options.spectrum;
        var scope_Values = [];
        var scope_Locations = [];
        var scope_HandleNumbers = [];
        var scope_ActiveHandlesCount = 0;
        var scope_Events = {};

        // Exposed API
        var scope_Self;

        // Document Nodes
        var scope_Document = target.ownerDocument;
        var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
        var scope_Body = scope_Document.body;

        // Pips constants
        var PIPS_NONE = -1;
        var PIPS_NO_VALUE = 0;
        var PIPS_LARGE_VALUE = 1;
        var PIPS_SMALL_VALUE = 2;

        // For horizontal sliders in standard ltr documents,
        // make .noUi-origin overflow to the left so the document doesn't scroll.
        var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;

        // Creates a node, adds it to target, returns the new node.
        function addNodeTo(addTarget, className) {
            var div = scope_Document.createElement("div");

            if (className) {
                addClass(div, className);
            }

            addTarget.appendChild(div);

            return div;
        }

        // Append a origin to the base
        function addOrigin(base, handleNumber) {
            var origin = addNodeTo(base, options.cssClasses.origin);
            var handle = addNodeTo(origin, options.cssClasses.handle);

            addNodeTo(handle, options.cssClasses.touchArea);

            handle.setAttribute("data-handle", handleNumber);

            if (options.keyboardSupport) {
                // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
                // 0 = focusable and reachable
                handle.setAttribute("tabindex", "0");
                handle.addEventListener("keydown", function(event) {
                    return eventKeydown(event, handleNumber);
                });
            }

            handle.setAttribute("role", "slider");
            handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");

            if (handleNumber === 0) {
                addClass(handle, options.cssClasses.handleLower);
            } else if (handleNumber === options.handles - 1) {
                addClass(handle, options.cssClasses.handleUpper);
            }

            return origin;
        }

        // Insert nodes for connect elements
        function addConnect(base, add) {
            if (!add) {
                return false;
            }

            return addNodeTo(base, options.cssClasses.connect);
        }

        // Add handles to the slider base.
        function addElements(connectOptions, base) {
            var connectBase = addNodeTo(base, options.cssClasses.connects);

            scope_Handles = [];
            scope_Connects = [];

            scope_Connects.push(addConnect(connectBase, connectOptions[0]));

            // [::::O====O====O====]
            // connectOptions = [0, 1, 1, 1]

            for (var i = 0; i < options.handles; i++) {
                // Keep a list of all added handles.
                scope_Handles.push(addOrigin(base, i));
                scope_HandleNumbers[i] = i;
                scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
            }
        }

        // Initialize a single slider.
        function addSlider(addTarget) {
            // Apply classes and data to the target.
            addClass(addTarget, options.cssClasses.target);

            if (options.dir === 0) {
                addClass(addTarget, options.cssClasses.ltr);
            } else {
                addClass(addTarget, options.cssClasses.rtl);
            }

            if (options.ort === 0) {
                addClass(addTarget, options.cssClasses.horizontal);
            } else {
                addClass(addTarget, options.cssClasses.vertical);
            }

            return addNodeTo(addTarget, options.cssClasses.base);
        }

        function addTooltip(handle, handleNumber) {
            if (!options.tooltips[handleNumber]) {
                return false;
            }

            return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
        }

        // Disable the slider dragging if any handle is disabled
        function isHandleDisabled(handleNumber) {
            var handleOrigin = scope_Handles[handleNumber];
            return handleOrigin.hasAttribute("disabled");
        }

        function removeTooltips() {
            if (scope_Tooltips) {
                removeEvent("update.tooltips");
                scope_Tooltips.forEach(function(tooltip) {
                    if (tooltip) {
                        removeElement(tooltip);
                    }
                });
                scope_Tooltips = null;
            }
        }

        // The tooltips option is a shorthand for using the 'update' event.
        function tooltips() {
            removeTooltips();

            // Tooltips are added with options.tooltips in original order.
            scope_Tooltips = scope_Handles.map(addTooltip);

            bindEvent("update.tooltips", function(values, handleNumber, unencoded) {
                if (!scope_Tooltips[handleNumber]) {
                    return;
                }

                var formattedValue = values[handleNumber];

                if (options.tooltips[handleNumber] !== true) {
                    formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
                }

                scope_Tooltips[handleNumber].innerHTML = formattedValue;
            });
        }

        function aria() {
            bindEvent("update", function(values, handleNumber, unencoded, tap, positions) {
                // Update Aria Values for all handles, as a change in one changes min and max values for the next.
                scope_HandleNumbers.forEach(function(index) {
                    var handle = scope_Handles[index];

                    var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
                    var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);

                    var now = positions[index];

                    // Formatted value for display
                    var text = options.ariaFormat.to(unencoded[index]);

                    // Map to slider range values
                    min = scope_Spectrum.fromStepping(min).toFixed(1);
                    max = scope_Spectrum.fromStepping(max).toFixed(1);
                    now = scope_Spectrum.fromStepping(now).toFixed(1);

                    handle.children[0].setAttribute("aria-valuemin", min);
                    handle.children[0].setAttribute("aria-valuemax", max);
                    handle.children[0].setAttribute("aria-valuenow", now);
                    handle.children[0].setAttribute("aria-valuetext", text);
                });
            });
        }

        function getGroup(mode, values, stepped) {
            // Use the range.
            if (mode === "range" || mode === "steps") {
                return scope_Spectrum.xVal;
            }

            if (mode === "count") {
                if (values < 2) {
                    throw new Error("noUiSlider (" + VERSION + "): 'values' (>= 2) required for mode 'count'.");
                }

                // Divide 0 - 100 in 'count' parts.
                var interval = values - 1;
                var spread = 100 / interval;

                values = [];

                // List these parts and have them handled as 'positions'.
                while (interval--) {
                    values[interval] = interval * spread;
                }

                values.push(100);

                mode = "positions";
            }

            if (mode === "positions") {
                // Map all percentages to on-range values.
                return values.map(function(value) {
                    return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
                });
            }

            if (mode === "values") {
                // If the value must be stepped, it needs to be converted to a percentage first.
                if (stepped) {
                    return values.map(function(value) {
                        // Convert to percentage, apply step, return to value.
                        return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
                    });
                }

                // Otherwise, we can simply use the values.
                return values;
            }
        }

        function generateSpread(density, mode, group) {
            function safeIncrement(value, increment) {
                // Avoid floating point variance by dropping the smallest decimal places.
                return (value + increment).toFixed(7) / 1;
            }

            var indexes = {};
            var firstInRange = scope_Spectrum.xVal[0];
            var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
            var ignoreFirst = false;
            var ignoreLast = false;
            var prevPct = 0;

            // Create a copy of the group, sort it and filter away all duplicates.
            group = unique(
                group.slice().sort(function(a, b) {
                    return a - b;
                })
            );

            // Make sure the range starts with the first element.
            if (group[0] !== firstInRange) {
                group.unshift(firstInRange);
                ignoreFirst = true;
            }

            // Likewise for the last one.
            if (group[group.length - 1] !== lastInRange) {
                group.push(lastInRange);
                ignoreLast = true;
            }

            group.forEach(function(current, index) {
                // Get the current step and the lower + upper positions.
                var step;
                var i;
                var q;
                var low = current;
                var high = group[index + 1];
                var newPct;
                var pctDifference;
                var pctPos;
                var type;
                var steps;
                var realSteps;
                var stepSize;
                var isSteps = mode === "steps";

                // When using 'steps' mode, use the provided steps.
                // Otherwise, we'll step on to the next subrange.
                if (isSteps) {
                    step = scope_Spectrum.xNumSteps[index];
                }

                // Default to a 'full' step.
                if (!step) {
                    step = high - low;
                }

                // Low can be 0, so test for false. If high is undefined,
                // we are at the last subrange. Index 0 is already handled.
                if (low === false || high === undefined) {
                    return;
                }

                // Make sure step isn't 0, which would cause an infinite loop (#654)
                step = Math.max(step, 0.0000001);

                // Find all steps in the subrange.
                for (i = low; i <= high; i = safeIncrement(i, step)) {
                    // Get the percentage value for the current step,
                    // calculate the size for the subrange.
                    newPct = scope_Spectrum.toStepping(i);
                    pctDifference = newPct - prevPct;

                    steps = pctDifference / density;
                    realSteps = Math.round(steps);

                    // This ratio represents the amount of percentage-space a point indicates.
                    // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-divided.
                    // Round the percentage offset to an even number, then divide by two
                    // to spread the offset on both sides of the range.
                    stepSize = pctDifference / realSteps;

                    // Divide all points evenly, adding the correct number to this subrange.
                    // Run up to <= so that 100% gets a point, event if ignoreLast is set.
                    for (q = 1; q <= realSteps; q += 1) {
                        // The ratio between the rounded value and the actual size might be ~1% off.
                        // Correct the percentage offset by the number of points
                        // per subrange. density = 1 will result in 100 points on the
                        // full range, 2 for 50, 4 for 25, etc.
                        pctPos = prevPct + q * stepSize;
                        indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
                    }

                    // Determine the point type.
                    type = group.indexOf(i) > -1 ? PIPS_LARGE_VALUE : isSteps ? PIPS_SMALL_VALUE : PIPS_NO_VALUE;

                    // Enforce the 'ignoreFirst' option by overwriting the type for 0.
                    if (!index && ignoreFirst) {
                        type = 0;
                    }

                    if (!(i === high && ignoreLast)) {
                        // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
                        indexes[newPct.toFixed(5)] = [i, type];
                    }

                    // Update the percentage count.
                    prevPct = newPct;
                }
            });

            return indexes;
        }

        function addMarking(spread, filterFunc, formatter) {
            var element = scope_Document.createElement("div");

            var valueSizeClasses = [];
            valueSizeClasses[PIPS_NO_VALUE] = options.cssClasses.valueNormal;
            valueSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.valueLarge;
            valueSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.valueSub;

            var markerSizeClasses = [];
            markerSizeClasses[PIPS_NO_VALUE] = options.cssClasses.markerNormal;
            markerSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.markerLarge;
            markerSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.markerSub;

            var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
            var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];

            addClass(element, options.cssClasses.pips);
            addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

            function getClasses(type, source) {
                var a = source === options.cssClasses.value;
                var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
                var sizeClasses = a ? valueSizeClasses : markerSizeClasses;

                return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
            }

            function addSpread(offset, value, type) {
                // Apply the filter function, if it is set.
                type = filterFunc ? filterFunc(value, type) : type;

                if (type === PIPS_NONE) {
                    return;
                }

                // Add a marker for every point
                var node = addNodeTo(element, false);
                node.className = getClasses(type, options.cssClasses.marker);
                node.style[options.style] = offset + "%";

                // Values are only appended for points marked '1' or '2'.
                if (type > PIPS_NO_VALUE) {
                    node = addNodeTo(element, false);
                    node.className = getClasses(type, options.cssClasses.value);
                    node.setAttribute("data-value", value);
                    node.style[options.style] = offset + "%";
                    node.innerHTML = formatter.to(value);
                }
            }

            // Append all points.
            Object.keys(spread).forEach(function(offset) {
                addSpread(offset, spread[offset][0], spread[offset][1]);
            });

            return element;
        }

        function removePips() {
            if (scope_Pips) {
                removeElement(scope_Pips);
                scope_Pips = null;
            }
        }

        function pips(grid) {
            // Fix #669
            removePips();

            var mode = grid.mode;
            var density = grid.density || 1;
            var filter = grid.filter || false;
            var values = grid.values || false;
            var stepped = grid.stepped || false;
            var group = getGroup(mode, values, stepped);
            var spread = generateSpread(density, mode, group);
            var format = grid.format || {
                to: Math.round
            };

            scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));

            return scope_Pips;
        }

        // Shorthand for base dimensions.
        function baseSize() {
            var rect = scope_Base.getBoundingClientRect();
            var alt = "offset" + ["Width", "Height"][options.ort];
            return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
        }

        // Handler for attaching events trough a proxy.
        function attachEvent(events, element, callback, data) {
            // This function can be used to 'filter' events to the slider.
            // element is a node, not a nodeList

            var method = function(e) {
                e = fixEvent(e, data.pageOffset, data.target || element);

                // fixEvent returns false if this event has a different target
                // when handling (multi-) touch events;
                if (!e) {
                    return false;
                }

                // doNotReject is passed by all end events to make sure released touches
                // are not rejected, leaving the slider "stuck" to the cursor;
                if (scope_Target.hasAttribute("disabled") && !data.doNotReject) {
                    return false;
                }

                // Stop if an active 'tap' transition is taking place.
                if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
                    return false;
                }

                // Ignore right or middle clicks on start #454
                if (events === actions.start && e.buttons !== undefined && e.buttons > 1) {
                    return false;
                }

                // Ignore right or middle clicks on start #454
                if (data.hover && e.buttons) {
                    return false;
                }

                // 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
                // iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
                // touch-action: manipulation, but that allows panning, which breaks
                // sliders after zooming/on non-responsive pages.
                // See: https://bugs.webkit.org/show_bug.cgi?id=133112
                if (!supportsPassive) {
                    e.preventDefault();
                }

                e.calcPoint = e.points[options.ort];

                // Call the event handler with the event [ and additional data ].
                callback(e, data);
            };

            var methods = [];

            // Bind a closure on the target for every event type.
            events.split(" ").forEach(function(eventName) {
                element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
                methods.push([eventName, method]);
            });

            return methods;
        }

        // Provide a clean event with standardized offset values.
        function fixEvent(e, pageOffset, eventTarget) {
            // Filter the event to register the type, which can be
            // touch, mouse or pointer. Offset changes need to be
            // made on an event specific basis.
            var touch = e.type.indexOf("touch") === 0;
            var mouse = e.type.indexOf("mouse") === 0;
            var pointer = e.type.indexOf("pointer") === 0;

            var x;
            var y;

            // IE10 implemented pointer events with a prefix;
            if (e.type.indexOf("MSPointer") === 0) {
                pointer = true;
            }

            // The only thing one handle should be concerned about is the touches that originated on top of it.
            if (touch) {
                // Returns true if a touch originated on the target.
                var isTouchOnTarget = function(checkTouch) {
                    return checkTouch.target === eventTarget || eventTarget.contains(checkTouch.target);
                };

                // In the case of touchstart events, we need to make sure there is still no more than one
                // touch on the target so we look amongst all touches.
                if (e.type === "touchstart") {
                    var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);

                    // Do not support more than one touch per handle.
                    if (targetTouches.length > 1) {
                        return false;
                    }

                    x = targetTouches[0].pageX;
                    y = targetTouches[0].pageY;
                } else {
                    // In the other cases, find on changedTouches is enough.
                    var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);

                    // Cancel if the target touch has not moved.
                    if (!targetTouch) {
                        return false;
                    }

                    x = targetTouch.pageX;
                    y = targetTouch.pageY;
                }
            }

            pageOffset = pageOffset || getPageOffset(scope_Document);

            if (mouse || pointer) {
                x = e.clientX + pageOffset.x;
                y = e.clientY + pageOffset.y;
            }

            e.pageOffset = pageOffset;
            e.points = [x, y];
            e.cursor = mouse || pointer; // Fix #435

            return e;
        }

        // Translate a coordinate in the document to a percentage on the slider
        function calcPointToPercentage(calcPoint) {
            var location = calcPoint - offset(scope_Base, options.ort);
            var proposal = (location * 100) / baseSize();

            // Clamp proposal between 0% and 100%
            // Out-of-bound coordinates may occur when .noUi-base pseudo-elements
            // are used (e.g. contained handles feature)
            proposal = limit(proposal);

            return options.dir ? 100 - proposal : proposal;
        }

        // Find handle closest to a certain percentage on the slider
        function getClosestHandle(proposal) {
            var closest = 100;
            var handleNumber = false;

            scope_Handles.forEach(function(handle, index) {
                // Disabled handles are ignored
                if (isHandleDisabled(index)) {
                    return;
                }

                var pos = Math.abs(scope_Locations[index] - proposal);

                if (pos < closest || (pos === 100 && closest === 100)) {
                    handleNumber = index;
                    closest = pos;
                }
            });

            return handleNumber;
        }

        // Fire 'end' when a mouse or pen leaves the document.
        function documentLeave(event, data) {
            if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) {
                eventEnd(event, data);
            }
        }

        // Handle movement on document for handle and range drag.
        function eventMove(event, data) {
            // Fix #498
            // Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
            // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
            // IE9 has .buttons and .which zero on mousemove.
            // Firefox breaks the spec MDN defines.
            if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
                return eventEnd(event, data);
            }

            // Check if we are moving up or down
            var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);

            // Convert the movement into a percentage of the slider width/height
            var proposal = (movement * 100) / data.baseSize;

            moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
        }

        // Unbind move events on document, call callbacks.
        function eventEnd(event, data) {
            // The handle is no longer active, so remove the class.
            if (data.handle) {
                removeClass(data.handle, options.cssClasses.active);
                scope_ActiveHandlesCount -= 1;
            }

            // Unbind the move and end events, which are added on 'start'.
            data.listeners.forEach(function(c) {
                scope_DocumentElement.removeEventListener(c[0], c[1]);
            });

            if (scope_ActiveHandlesCount === 0) {
                // Remove dragging class.
                removeClass(scope_Target, options.cssClasses.drag);
                setZindex();

                // Remove cursor styles and text-selection events bound to the body.
                if (event.cursor) {
                    scope_Body.style.cursor = "";
                    scope_Body.removeEventListener("selectstart", preventDefault);
                }
            }

            data.handleNumbers.forEach(function(handleNumber) {
                fireEvent("change", handleNumber);
                fireEvent("set", handleNumber);
                fireEvent("end", handleNumber);
            });
        }

        // Bind move events on document.
        function eventStart(event, data) {
            // Ignore event if any handle is disabled
            if (data.handleNumbers.some(isHandleDisabled)) {
                return false;
            }

            var handle;

            if (data.handleNumbers.length === 1) {
                var handleOrigin = scope_Handles[data.handleNumbers[0]];

                handle = handleOrigin.children[0];
                scope_ActiveHandlesCount += 1;

                // Mark the handle as 'active' so it can be styled.
                addClass(handle, options.cssClasses.active);
            }

            // A drag should never propagate up to the 'tap' event.
            event.stopPropagation();

            // Record the event listeners.
            var listeners = [];

            // Attach the move and end events.
            var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
                // The event target has changed so we need to propagate the original one so that we keep
                // relying on it to extract target touches.
                target: event.target,
                handle: handle,
                listeners: listeners,
                startCalcPoint: event.calcPoint,
                baseSize: baseSize(),
                pageOffset: event.pageOffset,
                handleNumbers: data.handleNumbers,
                buttonsProperty: event.buttons,
                locations: scope_Locations.slice()
            });

            var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
                target: event.target,
                handle: handle,
                listeners: listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers
            });

            var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
                target: event.target,
                handle: handle,
                listeners: listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers
            });

            // We want to make sure we pushed the listeners in the listener list rather than creating
            // a new one as it has already been passed to the event handlers.
            listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));

            // Text selection isn't an issue on touch devices,
            // so adding cursor styles can be skipped.
            if (event.cursor) {
                // Prevent the 'I' cursor and extend the range-drag cursor.
                scope_Body.style.cursor = getComputedStyle(event.target).cursor;

                // Mark the target with a dragging state.
                if (scope_Handles.length > 1) {
                    addClass(scope_Target, options.cssClasses.drag);
                }

                // Prevent text selection when dragging the handles.
                // In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
                // which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
                // meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
                // The 'cursor' flag is false.
                // See: http://caniuse.com/#search=selectstart
                scope_Body.addEventListener("selectstart", preventDefault, false);
            }

            data.handleNumbers.forEach(function(handleNumber) {
                fireEvent("start", handleNumber);
            });
        }

        // Move closest handle to tapped location.
        function eventTap(event) {
            // The tap event shouldn't propagate up
            event.stopPropagation();

            var proposal = calcPointToPercentage(event.calcPoint);
            var handleNumber = getClosestHandle(proposal);

            // Tackle the case that all handles are 'disabled'.
            if (handleNumber === false) {
                return false;
            }

            // Flag the slider as it is now in a transitional state.
            // Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
            if (!options.events.snap) {
                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            }

            setHandle(handleNumber, proposal, true, true);

            setZindex();

            fireEvent("slide", handleNumber, true);
            fireEvent("update", handleNumber, true);
            fireEvent("change", handleNumber, true);
            fireEvent("set", handleNumber, true);

            if (options.events.snap) {
                eventStart(event, { handleNumbers: [handleNumber] });
            }
        }

        // Fires a 'hover' event for a hovered mouse/pen position.
        function eventHover(event) {
            var proposal = calcPointToPercentage(event.calcPoint);

            var to = scope_Spectrum.getStep(proposal);
            var value = scope_Spectrum.fromStepping(to);

            Object.keys(scope_Events).forEach(function(targetEvent) {
                if ("hover" === targetEvent.split(".")[0]) {
                    scope_Events[targetEvent].forEach(function(callback) {
                        callback.call(scope_Self, value);
                    });
                }
            });
        }

        // Handles keydown on focused handles
        // Don't move the document when pressing arrow keys on focused handles
        function eventKeydown(event, handleNumber) {
            if (isHandleDisabled(handleNumber)) {
                return false;
            }

            var horizontalKeys = ["Left", "Right"];
            var verticalKeys = ["Down", "Up"];

            if (options.dir && !options.ort) {
                // On an right-to-left slider, the left and right keys act inverted
                horizontalKeys.reverse();
            } else if (options.ort && !options.dir) {
                // On a top-to-bottom slider, the up and down keys act inverted
                verticalKeys.reverse();
            }

            // Strip "Arrow" for IE compatibility. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
            var key = event.key.replace("Arrow", "");
            var isDown = key === verticalKeys[0] || key === horizontalKeys[0];
            var isUp = key === verticalKeys[1] || key === horizontalKeys[1];

            if (!isDown && !isUp) {
                return true;
            }

            event.preventDefault();

            var direction = isDown ? 0 : 1;
            var steps = getNextStepsForHandle(handleNumber);
            var step = steps[direction];

            // At the edge of a slider, do nothing
            if (step === null) {
                return false;
            }

            // No step set, use the default of 10% of the sub-range
            if (step === false) {
                step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, 10);
            }

            // Step over zero-length ranges (#948);
            step = Math.max(step, 0.0000001);

            // Decrement for down steps
            step = (isDown ? -1 : 1) * step;

            scope_ShouldAnimate = false;

            valueSetHandle(handleNumber, scope_Values[handleNumber] + step, true);

            scope_ShouldAnimate = true;

            return false;
        }

        // Attach events to several slider parts.
        function bindSliderEvents(behaviour) {
            // Attach the standard drag event to the handles.
            if (!behaviour.fixed) {
                scope_Handles.forEach(function(handle, index) {
                    // These events are only bound to the visual handle
                    // element, not the 'real' origin element.
                    attachEvent(actions.start, handle.children[0], eventStart, {
                        handleNumbers: [index]
                    });
                });
            }

            // Attach the tap event to the slider base.
            if (behaviour.tap) {
                attachEvent(actions.start, scope_Base, eventTap, {});
            }

            // Fire hover events
            if (behaviour.hover) {
                attachEvent(actions.move, scope_Base, eventHover, {
                    hover: true
                });
            }

            // Make the range draggable.
            if (behaviour.drag) {
                scope_Connects.forEach(function(connect, index) {
                    if (connect === false || index === 0 || index === scope_Connects.length - 1) {
                        return;
                    }

                    var handleBefore = scope_Handles[index - 1];
                    var handleAfter = scope_Handles[index];
                    var eventHolders = [connect];

                    addClass(connect, options.cssClasses.draggable);

                    // When the range is fixed, the entire range can
                    // be dragged by the handles. The handle in the first
                    // origin will propagate the start event upward,
                    // but it needs to be bound manually on the other.
                    if (behaviour.fixed) {
                        eventHolders.push(handleBefore.children[0]);
                        eventHolders.push(handleAfter.children[0]);
                    }

                    eventHolders.forEach(function(eventHolder) {
                        attachEvent(actions.start, eventHolder, eventStart, {
                            handles: [handleBefore, handleAfter],
                            handleNumbers: [index - 1, index]
                        });
                    });
                });
            }
        }

        // Attach an event to this slider, possibly including a namespace
        function bindEvent(namespacedEvent, callback) {
            scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
            scope_Events[namespacedEvent].push(callback);

            // If the event bound is 'update,' fire it immediately for all handles.
            if (namespacedEvent.split(".")[0] === "update") {
                scope_Handles.forEach(function(a, index) {
                    fireEvent("update", index);
                });
            }
        }

        // Undo attachment of event
        function removeEvent(namespacedEvent) {
            var event = namespacedEvent && namespacedEvent.split(".")[0];
            var namespace = event && namespacedEvent.substring(event.length);

            Object.keys(scope_Events).forEach(function(bind) {
                var tEvent = bind.split(".")[0];
                var tNamespace = bind.substring(tEvent.length);

                if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
                    delete scope_Events[bind];
                }
            });
        }

        // External event handling
        function fireEvent(eventName, handleNumber, tap) {
            Object.keys(scope_Events).forEach(function(targetEvent) {
                var eventType = targetEvent.split(".")[0];

                if (eventName === eventType) {
                    scope_Events[targetEvent].forEach(function(callback) {
                        callback.call(
                            // Use the slider public API as the scope ('this')
                            scope_Self,
                            // Return values as array, so arg_1[arg_2] is always valid.
                            scope_Values.map(options.format.to),
                            // Handle index, 0 or 1
                            handleNumber,
                            // Un-formatted slider values
                            scope_Values.slice(),
                            // Event is fired by tap, true or false
                            tap || false,
                            // Left offset of the handle, in relation to the slider
                            scope_Locations.slice()
                        );
                    });
                }
            });
        }

        // Split out the handle positioning logic so the Move event can use it, too
        function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue) {
            // For sliders with multiple handles, limit movement to the other handle.
            // Apply the margin option by adding it to the handle positions.
            if (scope_Handles.length > 1 && !options.events.unconstrained) {
                if (lookBackward && handleNumber > 0) {
                    to = Math.max(to, reference[handleNumber - 1] + options.margin);
                }

                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    to = Math.min(to, reference[handleNumber + 1] - options.margin);
                }
            }

            // The limit option has the opposite effect, limiting handles to a
            // maximum distance from another. Limit must be > 0, as otherwise
            // handles would be unmovable.
            if (scope_Handles.length > 1 && options.limit) {
                if (lookBackward && handleNumber > 0) {
                    to = Math.min(to, reference[handleNumber - 1] + options.limit);
                }

                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    to = Math.max(to, reference[handleNumber + 1] - options.limit);
                }
            }

            // The padding option keeps the handles a certain distance from the
            // edges of the slider. Padding must be > 0.
            if (options.padding) {
                if (handleNumber === 0) {
                    to = Math.max(to, options.padding[0]);
                }

                if (handleNumber === scope_Handles.length - 1) {
                    to = Math.min(to, 100 - options.padding[1]);
                }
            }

            to = scope_Spectrum.getStep(to);

            // Limit percentage to the 0 - 100 range
            to = limit(to);

            // Return false if handle can't move
            if (to === reference[handleNumber] && !getValue) {
                return false;
            }

            return to;
        }

        // Uses slider orientation to create CSS rules. a = base value;
        function inRuleOrder(v, a) {
            var o = options.ort;
            return (o ? a : v) + ", " + (o ? v : a);
        }

        // Moves handle(s) by a percentage
        // (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
        function moveHandles(upward, proposal, locations, handleNumbers) {
            var proposals = locations.slice();

            var b = [!upward, upward];
            var f = [upward, !upward];

            // Copy handleNumbers so we don't change the dataset
            handleNumbers = handleNumbers.slice();

            // Check to see which handle is 'leading'.
            // If that one can't move the second can't either.
            if (upward) {
                handleNumbers.reverse();
            }

            // Step 1: get the maximum percentage that any of the handles can move
            if (handleNumbers.length > 1) {
                handleNumbers.forEach(function(handleNumber, o) {
                    var to = checkHandlePosition(
                        proposals,
                        handleNumber,
                        proposals[handleNumber] + proposal,
                        b[o],
                        f[o],
                        false
                    );

                    // Stop if one of the handles can't move.
                    if (to === false) {
                        proposal = 0;
                    } else {
                        proposal = to - proposals[handleNumber];
                        proposals[handleNumber] = to;
                    }
                });
            }

            // If using one handle, check backward AND forward
            else {
                b = f = [true];
            }

            var state = false;

            // Step 2: Try to set the handles with the found percentage
            handleNumbers.forEach(function(handleNumber, o) {
                state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
            });

            // Step 3: If a handle moved, fire events
            if (state) {
                handleNumbers.forEach(function(handleNumber) {
                    fireEvent("update", handleNumber);
                    fireEvent("slide", handleNumber);
                });
            }
        }

        // Takes a base value and an offset. This offset is used for the connect bar size.
        // In the initial design for this feature, the origin element was 1% wide.
        // Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
        // in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
        function transformDirection(a, b) {
            return options.dir ? 100 - a - b : a;
        }

        // Updates scope_Locations and scope_Values, updates visual state
        function updateHandlePosition(handleNumber, to) {
            // Update locations.
            scope_Locations[handleNumber] = to;

            // Convert the value to the slider stepping/range.
            scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);

            var rule = "translate(" + inRuleOrder(transformDirection(to, 0) - scope_DirOffset + "%", "0") + ")";
            scope_Handles[handleNumber].style[options.transformRule] = rule;

            updateConnect(handleNumber);
            updateConnect(handleNumber + 1);
        }

        // Handles before the slider middle are stacked later = higher,
        // Handles after the middle later is lower
        // [[7] [8] .......... | .......... [5] [4]
        function setZindex() {
            scope_HandleNumbers.forEach(function(handleNumber) {
                var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
                var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
                scope_Handles[handleNumber].style.zIndex = zIndex;
            });
        }

        // Test suggested values and apply margin, step.
        function setHandle(handleNumber, to, lookBackward, lookForward) {
            to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);

            if (to === false) {
                return false;
            }

            updateHandlePosition(handleNumber, to);

            return true;
        }

        // Updates style attribute for connect nodes
        function updateConnect(index) {
            // Skip connects set to false
            if (!scope_Connects[index]) {
                return;
            }

            var l = 0;
            var h = 100;

            if (index !== 0) {
                l = scope_Locations[index - 1];
            }

            if (index !== scope_Connects.length - 1) {
                h = scope_Locations[index];
            }

            // We use two rules:
            // 'translate' to change the left/top offset;
            // 'scale' to change the width of the element;
            // As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
            var connectWidth = h - l;
            var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
            var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";

            scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
        }

        // Parses value passed to .set method. Returns current value if not parse-able.
        function resolveToValue(to, handleNumber) {
            // Setting with null indicates an 'ignore'.
            // Inputting 'false' is invalid.
            if (to === null || to === false || to === undefined) {
                return scope_Locations[handleNumber];
            }

            // If a formatted number was passed, attempt to decode it.
            if (typeof to === "number") {
                to = String(to);
            }

            to = options.format.from(to);
            to = scope_Spectrum.toStepping(to);

            // If parsing the number failed, use the current value.
            if (to === false || isNaN(to)) {
                return scope_Locations[handleNumber];
            }

            return to;
        }

        // Set the slider value.
        function valueSet(input, fireSetEvent) {
            var values = asArray(input);
            var isInit = scope_Locations[0] === undefined;

            // Event fires by default
            fireSetEvent = fireSetEvent === undefined ? true : !!fireSetEvent;

            // Animation is optional.
            // Make sure the initial values were set before using animated placement.
            if (options.animate && !isInit && scope_ShouldAnimate) {
                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            }

            // First pass, without lookAhead but with lookBackward. Values are set from left to right.
            scope_HandleNumbers.forEach(function(handleNumber) {
                setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false);
            });

            // Second pass. Now that all base values are set, apply constraints
            scope_HandleNumbers.forEach(function(handleNumber) {
                setHandle(handleNumber, scope_Locations[handleNumber], true, true);
            });

            setZindex();

            scope_HandleNumbers.forEach(function(handleNumber) {
                fireEvent("update", handleNumber);

                // Fire the event only for handles that received a new value, as per #579
                if (values[handleNumber] !== null && fireSetEvent) {
                    fireEvent("set", handleNumber);
                }
            });
        }

        // Reset slider to initial values
        function valueReset(fireSetEvent) {
            valueSet(options.start, fireSetEvent);
        }

        // Set value for a single handle
        function valueSetHandle(handleNumber, value, fireSetEvent) {
            var values = [];

            // Ensure numeric input
            handleNumber = Number(handleNumber);

            if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
                throw new Error("noUiSlider (" + VERSION + "): invalid handle number, got: " + handleNumber);
            }

            for (var i = 0; i < scope_HandleNumbers.length; i++) {
                values[i] = null;
            }

            values[handleNumber] = value;

            valueSet(values, fireSetEvent);
        }

        // Get the slider value.
        function valueGet() {
            var values = scope_Values.map(options.format.to);

            // If only one handle is used, return a single value.
            if (values.length === 1) {
                return values[0];
            }

            return values;
        }

        // Removes classes from the root and empties it.
        function destroy() {
            for (var key in options.cssClasses) {
                if (!options.cssClasses.hasOwnProperty(key)) {
                    continue;
                }
                removeClass(scope_Target, options.cssClasses[key]);
            }

            while (scope_Target.firstChild) {
                scope_Target.removeChild(scope_Target.firstChild);
            }

            delete scope_Target.noUiSlider;
        }

        function getNextStepsForHandle(handleNumber) {
            var location = scope_Locations[handleNumber];
            var nearbySteps = scope_Spectrum.getNearbySteps(location);
            var value = scope_Values[handleNumber];
            var increment = nearbySteps.thisStep.step;
            var decrement = null;

            // If the next value in this step moves into the next step,
            // the increment is the start of the next step - the current value
            if (increment !== false) {
                if (value + increment > nearbySteps.stepAfter.startValue) {
                    increment = nearbySteps.stepAfter.startValue - value;
                }
            }

            // If the value is beyond the starting point
            if (value > nearbySteps.thisStep.startValue) {
                decrement = nearbySteps.thisStep.step;
            } else if (nearbySteps.stepBefore.step === false) {
                decrement = false;
            }

            // If a handle is at the start of a step, it always steps back into the previous step first
            else {
                decrement = value - nearbySteps.stepBefore.highestStep;
            }

            // Now, if at the slider edges, there is no in/decrement
            if (location === 100) {
                increment = null;
            } else if (location === 0) {
                decrement = null;
            }

            // As per #391, the comparison for the decrement step can have some rounding issues.
            var stepDecimals = scope_Spectrum.countStepDecimals();

            // Round per #391
            if (increment !== null && increment !== false) {
                increment = Number(increment.toFixed(stepDecimals));
            }

            if (decrement !== null && decrement !== false) {
                decrement = Number(decrement.toFixed(stepDecimals));
            }

            return [decrement, increment];
        }

        // Get the current step size for the slider.
        function getNextSteps() {
            return scope_HandleNumbers.map(getNextStepsForHandle);
        }

        // Updateable: margin, limit, padding, step, range, animate, snap
        function updateOptions(optionsToUpdate, fireSetEvent) {
            // Spectrum is created using the range, snap, direction and step options.
            // 'snap' and 'step' can be updated.
            // If 'snap' and 'step' are not passed, they should remain unchanged.
            var v = valueGet();

            var updateAble = [
                "margin",
                "limit",
                "padding",
                "range",
                "animate",
                "snap",
                "step",
                "format",
                "pips",
                "tooltips"
            ];

            // Only change options that we're actually passed to update.
            updateAble.forEach(function(name) {
                // Check for undefined. null removes the value.
                if (optionsToUpdate[name] !== undefined) {
                    originalOptions[name] = optionsToUpdate[name];
                }
            });

            var newOptions = testOptions(originalOptions);

            // Load new options into the slider state
            updateAble.forEach(function(name) {
                if (optionsToUpdate[name] !== undefined) {
                    options[name] = newOptions[name];
                }
            });

            scope_Spectrum = newOptions.spectrum;

            // Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
            options.margin = newOptions.margin;
            options.limit = newOptions.limit;
            options.padding = newOptions.padding;

            // Update pips, removes existing.
            if (options.pips) {
                pips(options.pips);
            } else {
                removePips();
            }

            // Update tooltips, removes existing.
            if (options.tooltips) {
                tooltips();
            } else {
                removeTooltips();
            }

            // Invalidate the current positioning so valueSet forces an update.
            scope_Locations = [];
            valueSet(optionsToUpdate.start || v, fireSetEvent);
        }

        // Initialization steps
        function setupSlider() {
            // Create the base element, initialize HTML and set classes.
            // Add handles and connect elements.
            scope_Base = addSlider(scope_Target);

            addElements(options.connect, scope_Base);

            // Attach user events.
            bindSliderEvents(options.events);

            // Use the public value method to set the start values.
            valueSet(options.start);

            if (options.pips) {
                pips(options.pips);
            }

            if (options.tooltips) {
                tooltips();
            }

            aria();
        }

        setupSlider();

        // noinspection JSUnusedGlobalSymbols
        scope_Self = {
            destroy: destroy,
            steps: getNextSteps,
            on: bindEvent,
            off: removeEvent,
            get: valueGet,
            set: valueSet,
            setHandle: valueSetHandle,
            reset: valueReset,
            // Exposed for unit testing, don't use this in your application.
            __moveHandles: function(a, b, c) {
                moveHandles(a, b, scope_Locations, c);
            },
            options: originalOptions, // Issue #600, #678
            updateOptions: updateOptions,
            target: scope_Target, // Issue #597
            removePips: removePips,
            removeTooltips: removeTooltips,
            pips: pips // Issue #594
        };

        return scope_Self;
    }

    // Run the standard initializer
    function initialize(target, originalOptions) {
        if (!target || !target.nodeName) {
            throw new Error("noUiSlider (" + VERSION + "): create requires a single element, got: " + target);
        }

        // Throw an error if the slider was already initialized.
        if (target.noUiSlider) {
            throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
        }

        // Test the options and create the slider environment;
        var options = testOptions(originalOptions, target);
        var api = scope(target, options, originalOptions);

        target.noUiSlider = api;

        return api;
    }

    // Use an object instead of a function for future expandability;
    return {
        // Exposed for unit testing, don't use this in your application.
        __spectrum: Spectrum,
        version: VERSION,
        create: initialize
    };
});


/***/ }),

/***/ "./src/app/documentation/alerts/alerts.component.html":
/*!************************************************************!*\
  !*** ./src/app/documentation/alerts/alerts.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Alerts</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.</p>\n\n<hr>\n<h3 id=\"examples\"><div>Examples<a class=\"anchorjs-link \" href=\"#examples\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"alert alert-default\" role=\"alert\">\n          <strong>Default!</strong> This is a default alert—check it out!\n        </div>\n        <div class=\"alert alert-primary\" role=\"alert\">\n          <strong>Primary!</strong> This is a primary alert—check it out!\n        </div>\n        <div class=\"alert alert-secondary\" role=\"alert\">\n          <strong>Secondary!</strong> This is a secondary alert—check it out!\n        </div>\n        <div class=\"alert alert-info\" role=\"alert\">\n          <strong>Info!</strong> This is a info alert—check it out!\n        </div>\n        <div class=\"alert alert-success\" role=\"alert\">\n          <strong>Success!</strong> This is a success alert—check it out!\n        </div>\n        <div class=\"alert alert-danger\" role=\"alert\">\n          <strong>Danger!</strong> This is a danger alert—check it out!\n        </div>\n        <div class=\"alert alert-warning\" role=\"alert\">\n          <strong>Warning!</strong> This is a warning alert—check it out!\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"with-icon\"><div>With icon<a class=\"anchorjs-link \" href=\"#with-icon\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"alert alert-warning\" role=\"alert\">\n          <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n          <span class=\"alert-inner--text\"><strong>Warning!</strong> This is a warning alert—check it out that has an icon too!</span>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code1\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"dismissing\"><div>Dismissing<a class=\"anchorjs-link \" href=\"#dismissing\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"alert alert-default alert-dismissible fade show\" role=\"alert\">\n          <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n          <span class=\"alert-inner--text\"><strong>Default!</strong> This is a default alert—check it out!</span>\n          <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">×</span>\n          </button>\n        </div>\n        <div class=\"alert alert-primary alert-dismissible fade show\" role=\"alert\">\n          <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n          <span class=\"alert-inner--text\"><strong>Primary!</strong> This is a primary alert—check it out!</span>\n          <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">×</span>\n          </button>\n        </div>\n        <div class=\"alert alert-secondary alert-dismissible fade show\" role=\"alert\">\n          <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n          <span class=\"alert-inner--text\"><strong>Secondary!</strong> This is a secondary alert—check it out!</span>\n          <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">×</span>\n          </button>\n        </div>\n        <div class=\"alert alert-info alert-dismissible fade show\" role=\"alert\">\n          <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n          <span class=\"alert-inner--text\"><strong>Info!</strong> This is a info alert—check it out!</span>\n          <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">×</span>\n          </button>\n        </div>\n        <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n          <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n          <span class=\"alert-inner--text\"><strong>Success!</strong> This is a success alert—check it out!</span>\n          <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">×</span>\n          </button>\n        </div>\n        <div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n          <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n          <span class=\"alert-inner--text\"><strong>Danger!</strong> This is a danger alert—check it out!</span>\n          <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">×</span>\n          </button>\n        </div>\n        <div class=\"alert alert-warning alert-dismissible fade show\" role=\"alert\">\n          <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n          <span class=\"alert-inner--text\"><strong>Warning!</strong> This is a warning alert—check it out!</span>\n          <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">×</span>\n          </button>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code2\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/alerts/alerts.component.scss":
/*!************************************************************!*\
  !*** ./src/app/documentation/alerts/alerts.component.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vYWxlcnRzL2FsZXJ0cy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/documentation/alerts/alerts.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/documentation/alerts/alerts.component.ts ***!
  \**********************************************************/
/*! exports provided: AlertsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertsComponent", function() { return AlertsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AlertsComponent = /** @class */ (function () {
    function AlertsComponent(toastr) {
        this.toastr = toastr;
        this.code = "<div class=\"alert alert-default\" role=\"alert\">\n    <strong>Default!</strong> This is a default alert\u2014check it out!\n</div>\n\n<div class=\"alert alert-primary\" role=\"alert\">\n    <strong>Primary!</strong> This is a primary alert\u2014check it out!\n</div>\n\n<div class=\"alert alert-secondary\" role=\"alert\">\n    <strong>Secondary!</strong> This is a secondary alert\u2014check it out!\n</div>\n\n<div class=\"alert alert-info\" role=\"alert\">\n    <strong>Info!</strong> This is a info alert\u2014check it out!\n</div>\n\n<div class=\"alert alert-success\" role=\"alert\">\n    <strong>Success!</strong> This is a success alert\u2014check it out!\n</div>\n\n<div class=\"alert alert-danger\" role=\"alert\">\n    <strong>Danger!</strong> This is a danger alert\u2014check it out!\n</div>\n\n<div class=\"alert alert-warning\" role=\"alert\">\n    <strong>Warning!</strong> This is a warning alert\u2014check it out!\n</div>";
        this.code1 = "<div class=\"alert alert-warning\" role=\"alert\">\n    <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n    <span class=\"alert-inner--text\"><strong>Warning!</strong> This is a warning alert\u2014check it out that has an icon too!</span>\n  </div>";
        this.code2 = "<div class=\"alert alert-default alert-dismissible fade show\" role=\"alert\">\n    <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n    <span class=\"alert-inner--text\"><strong>Default!</strong> This is a default alert\u2014check it out!</span>\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n      <span aria-hidden=\"true\">\u00D7</span>\n    </button>\n  </div>\n  <div class=\"alert alert-primary alert-dismissible fade show\" role=\"alert\">\n    <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n    <span class=\"alert-inner--text\"><strong>Primary!</strong> This is a primary alert\u2014check it out!</span>\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n      <span aria-hidden=\"true\">\u00D7</span>\n    </button>\n  </div>\n  <div class=\"alert alert-secondary alert-dismissible fade show\" role=\"alert\">\n    <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n    <span class=\"alert-inner--text\"><strong>Secondary!</strong> This is a secondary alert\u2014check it out!</span>\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n      <span aria-hidden=\"true\">\u00D7</span>\n    </button>\n  </div>\n  <div class=\"alert alert-info alert-dismissible fade show\" role=\"alert\">\n    <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n    <span class=\"alert-inner--text\"><strong>Info!</strong> This is a info alert\u2014check it out!</span>\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n      <span aria-hidden=\"true\">\u00D7</span>\n    </button>\n  </div>\n  <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n    <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n    <span class=\"alert-inner--text\"><strong>Success!</strong> This is a success alert\u2014check it out!</span>\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n      <span aria-hidden=\"true\">\u00D7</span>\n    </button>\n  </div>\n  <div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n    <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n    <span class=\"alert-inner--text\"><strong>Danger!</strong> This is a danger alert\u2014check it out!</span>\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n      <span aria-hidden=\"true\">\u00D7</span>\n    </button>\n  </div>\n  <div class=\"alert alert-warning alert-dismissible fade show\" role=\"alert\">\n    <span class=\"alert-inner--icon\"><i class=\"ni ni-like-2\"></i></span>\n    <span class=\"alert-inner--text\"><strong>Warning!</strong> This is a warning alert\u2014check it out!</span>\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n      <span aria-hidden=\"true\">\u00D7</span>\n    </button>\n  </div>";
    }
    AlertsComponent.prototype.showNotification = function (from, align) {
        var color = Math.floor((Math.random() * 5) + 1);
        switch (color) {
            case 1:
                this.toastr.info('<span class="now-ui-icons ui-1_bell-53"></span> Welcome to <b>Now Ui Dashboard</b> - a beautiful freebie for every web developer.', '', {
                    timeOut: 8000,
                    closeButton: true,
                    enableHtml: true,
                    toastClass: "alert alert-info alert-with-icon",
                    positionClass: 'toast-' + from + '-' + align
                });
                break;
            case 2:
                this.toastr.success('<span class="now-ui-icons ui-1_bell-53"></span> Welcome to <b>Now Ui Dashboard</b> - a beautiful freebie for every web developer.', '', {
                    timeOut: 8000,
                    closeButton: true,
                    enableHtml: true,
                    toastClass: "alert alert-success alert-with-icon",
                    positionClass: 'toast-' + from + '-' + align
                });
                break;
            case 3:
                this.toastr.warning('<span class="now-ui-icons ui-1_bell-53"></span> Welcome to <b>Now Ui Dashboard</b> - a beautiful freebie for every web developer.', '', {
                    timeOut: 8000,
                    closeButton: true,
                    enableHtml: true,
                    toastClass: "alert alert-warning alert-with-icon",
                    positionClass: 'toast-' + from + '-' + align
                });
                break;
            case 4:
                this.toastr.error('<span class="now-ui-icons ui-1_bell-53"></span> Welcome to <b>Now Ui Dashboard</b> - a beautiful freebie for every web developer.', '', {
                    timeOut: 8000,
                    enableHtml: true,
                    closeButton: true,
                    toastClass: "alert alert-danger alert-with-icon",
                    positionClass: 'toast-' + from + '-' + align
                });
                break;
            case 5:
                this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Welcome to <b>Now Ui Dashboard</b> - a beautiful freebie for every web developer.', '', {
                    timeOut: 8000,
                    closeButton: true,
                    enableHtml: true,
                    toastClass: "alert alert-primary alert-with-icon",
                    positionClass: 'toast-' + from + '-' + align
                });
                break;
            default:
                break;
        }
    };
    AlertsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-alerts',
            template: __webpack_require__(/*! ./alerts.component.html */ "./src/app/documentation/alerts/alerts.component.html"),
            styles: [__webpack_require__(/*! ./alerts.component.scss */ "./src/app/documentation/alerts/alerts.component.scss")]
        }),
        __metadata("design:paramtypes", [ngx_toastr__WEBPACK_IMPORTED_MODULE_1__["ToastrService"]])
    ], AlertsComponent);
    return AlertsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/badge/badge.component.html":
/*!**********************************************************!*\
  !*** ./src/app/documentation/badge/badge.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Badges</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Documentation and examples for badges, our small count and labeling component.</p>\n<hr>\n<h2 id=\"example\"><div>Example<a class=\"anchorjs-link \" href=\"#example\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Badges can be used as part of links or buttons to provide a counter.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button type=\"button\" class=\"btn btn-primary\">\n          <span>Notifications</span>\n          <span class=\"badge badge-white\">4</span>\n        </button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"contextual-variations\"><div>Contextual variations<a class=\"anchorjs-link \" href=\"#contextual-variations\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Add any of the below mentioned modifier classes to change the appearance of a badge.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <span class=\"badge badge-default\">Default</span>\n        <span class=\"badge badge-primary\">Primary</span>\n        <span class=\"badge badge-secondary\">Secondary</span>\n        <span class=\"badge badge-info\">Info</span>\n        <span class=\"badge badge-success\">Success</span>\n        <span class=\"badge badge-danger\">Danger</span>\n        <span class=\"badge badge-warning\">Warning</span>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code1\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"pill-badges\"><div>Pill badges<a class=\"anchorjs-link \" href=\"#pill-badges\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Use the <code class=\"highlighter-rouge\">.badge-pill</code> modifier class to make badges more rounded (with a larger <code class=\"highlighter-rouge\">border-radius</code> and additional horizontal <code class=\"highlighter-rouge\">padding</code>). Useful if you miss the badges from v3.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <span class=\"badge badge-pill badge-default\">Default</span>\n        <span class=\"badge badge-pill badge-primary\">Primary</span>\n        <span class=\"badge badge-pill badge-secondary\">Secondary</span>\n        <span class=\"badge badge-pill badge-info\">Info</span>\n        <span class=\"badge badge-pill badge-success\">Success</span>\n        <span class=\"badge badge-pill badge-danger\">Danger</span>\n        <span class=\"badge badge-pill badge-warning\">Warning</span>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code2\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"links\"><div>Links<a class=\"anchorjs-link \" href=\"#links\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Using the contextual <code class=\"highlighter-rouge\">.badge-*</code> classes on an <code class=\"highlighter-rouge\">&lt;a&gt;</code> element quickly provide <em>actionable</em> badges with hover and focus states.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <a href=\"#\" class=\"badge badge-default\">Default</a>\n        <a href=\"#\" class=\"badge badge-primary\">Primary</a>\n        <a href=\"#\" class=\"badge badge-secondary\">Secondary</a>\n        <a href=\"#\" class=\"badge badge-info\">Info</a>\n        <a href=\"#\" class=\"badge badge-success\">Success</a>\n        <a href=\"#\" class=\"badge badge-danger\">Danger</a>\n        <a href=\"#\" class=\"badge badge-warning\">Warning</a>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code3\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/badge/badge.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/documentation/badge/badge.component.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vYmFkZ2UvYmFkZ2UuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/documentation/badge/badge.component.ts":
/*!********************************************************!*\
  !*** ./src/app/documentation/badge/badge.component.ts ***!
  \********************************************************/
/*! exports provided: BadgeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BadgeComponent", function() { return BadgeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var BadgeComponent = /** @class */ (function () {
    function BadgeComponent() {
        this.code = "<button type=\"button\" class=\"btn btn-primary\">\n    <span>Notifications</span>\n    <span class=\"badge badge-white\">4</span>\n  </button>";
        this.code1 = "<span class=\"badge badge-default\">Default</span>\n  <span class=\"badge badge-primary\">Primary</span>\n  <span class=\"badge badge-secondary\">Secondary</span>\n  <span class=\"badge badge-info\">Info</span>\n  <span class=\"badge badge-success\">Success</span>\n  <span class=\"badge badge-danger\">Danger</span>\n  <span class=\"badge badge-warning\">Warning</span>";
        this.code2 = "<span class=\"badge badge-pill badge-default\">Default</span>\n  <span class=\"badge badge-pill badge-primary\">Primary</span>\n  <span class=\"badge badge-pill badge-secondary\">Secondary</span>\n  <span class=\"badge badge-pill badge-info\">Info</span>\n  <span class=\"badge badge-pill badge-success\">Success</span>\n  <span class=\"badge badge-pill badge-danger\">Danger</span>\n  <span class=\"badge badge-pill badge-warning\">Warning</span>";
        this.code3 = "<a href=\"#\" class=\"badge badge-default\">Default</a>\n  <a href=\"#\" class=\"badge badge-primary\">Primary</a>\n  <a href=\"#\" class=\"badge badge-secondary\">Secondary</a>\n  <a href=\"#\" class=\"badge badge-info\">Info</a>\n  <a href=\"#\" class=\"badge badge-success\">Success</a>\n  <a href=\"#\" class=\"badge badge-danger\">Danger</a>\n  <a href=\"#\" class=\"badge badge-warning\">Warning</a>";
    }
    BadgeComponent.prototype.ngOnInit = function () {
    };
    BadgeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-badge',
            template: __webpack_require__(/*! ./badge.component.html */ "./src/app/documentation/badge/badge.component.html"),
            styles: [__webpack_require__(/*! ./badge.component.scss */ "./src/app/documentation/badge/badge.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], BadgeComponent);
    return BadgeComponent;
}());



/***/ }),

/***/ "./src/app/documentation/buttons/buttons.component.html":
/*!**************************************************************!*\
  !*** ./src/app/documentation/buttons/buttons.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Buttons</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Use Bootstrap’s custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.</p>\n<hr>\n<h2 id=\"examples\"><div>Examples<a class=\"anchorjs-link \" href=\"#examples\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Bootstrap includes several predefined button styles, each serving its own semantic purpose, with a few extras thrown in for more control.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button class=\"btn btn-primary\" type=\"button\">Button</button>\n        <button class=\"btn btn-icon btn-3 btn-primary\" type=\"button\">\n          <span class=\"btn-inner--icon\"><i class=\"ni ni-bag-17\"></i></span>\n          <span class=\"btn-inner--text\">With icon</span>\n        </button>\n        <button class=\"btn btn-icon btn-2 btn-primary\" type=\"button\">\n          <span class=\"btn-inner--icon\"><i class=\"ni ni-atom\"></i></span>\n        </button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button type=\"button\" class=\"btn btn-default\">Default</button>\n        <button type=\"button\" class=\"btn btn-primary\">Primary</button>\n        <button type=\"button\" class=\"btn btn-secondary\">Secondary</button>\n        <button type=\"button\" class=\"btn btn-info\">Info</button>\n        <button type=\"button\" class=\"btn btn-success\">Success</button>\n        <button type=\"button\" class=\"btn btn-danger\">Danger</button>\n        <button type=\"button\" class=\"btn btn-warning\">Warning</button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code1\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"outline-buttons\"><div>Outline buttons<a class=\"anchorjs-link \" href=\"#outline-buttons\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>In need of a button, but not the hefty background colors they bring? Replace the default modifier classes with the <code class=\"highlighter-rouge\">.btn-outline-*</code> ones to remove all background images and colors on any button.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button type=\"button\" class=\"btn btn-outline-default\">Default</button>\n        <button type=\"button\" class=\"btn btn-outline-primary\">Primary</button>\n        <button type=\"button\" class=\"btn btn-outline-secondary\">Secondary</button>\n        <button type=\"button\" class=\"btn btn-outline-info\">Info</button>\n        <button type=\"button\" class=\"btn btn-outline-success\">Success</button>\n        <button type=\"button\" class=\"btn btn-outline-danger\">Danger</button>\n        <button type=\"button\" class=\"btn btn-outline-warning\">Warning</button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code2\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"sizes\"><div>Sizes<a class=\"anchorjs-link \" href=\"#sizes\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Fancy larger or smaller buttons? Add <code class=\"highlighter-rouge\">.btn-lg</code> or <code class=\"highlighter-rouge\">.btn-sm</code> for additional sizes.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button type=\"button\" class=\"btn btn-primary btn-lg\">Large button</button>\n        <button type=\"button\" class=\"btn btn-secondary btn-lg\">Large button</button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code3\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button type=\"button\" class=\"btn btn-primary btn-sm\">Small button</button>\n        <button type=\"button\" class=\"btn btn-secondary btn-sm\">Small button</button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code4\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<p>Create block level buttons—those that span the full width of a parent—by adding <code class=\"highlighter-rouge\">.btn-block</code>.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button type=\"button\" class=\"btn btn-primary btn-lg btn-block\">Block level button</button>\n        <button type=\"button\" class=\"btn btn-secondary btn-lg btn-block\">Block level button</button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code5\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"active-state\"><div>Active state<a class=\"anchorjs-link \" href=\"#active-state\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Buttons will appear pressed (with a darker background, darker border, and inset shadow) when active. <strong>There’s no need to add a class to <code class=\"highlighter-rouge\">&lt;button&gt;</code>s as they use a pseudo-class</strong>. However, you can still force the same active appearance with <code class=\"highlighter-rouge\">.active</code> (and include the <code>aria-pressed=\"true\"</code> attribute) should you need to replicate the state programmatically.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <a href=\"#\" class=\"btn btn-primary btn-lg active\" role=\"button\" aria-pressed=\"true\">Primary link</a>\n        <a href=\"#\" class=\"btn btn-secondary btn-lg active\" role=\"button\" aria-pressed=\"true\">Link</a>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code6\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"disabled-state\"><div>Disabled state<a class=\"anchorjs-link \" href=\"#disabled-state\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Make buttons look inactive by adding the <code class=\"highlighter-rouge\">disabled</code> boolean attribute to any <code class=\"highlighter-rouge\">&lt;button&gt;</code> element.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button type=\"button\" class=\"btn btn-lg btn-primary\" disabled=\"\">Primary button</button>\n        <button type=\"button\" class=\"btn btn-secondary btn-lg\" disabled=\"\">Button</button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code6\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/buttons/buttons.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/documentation/buttons/buttons.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vYnV0dG9ucy9idXR0b25zLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/documentation/buttons/buttons.component.ts":
/*!************************************************************!*\
  !*** ./src/app/documentation/buttons/buttons.component.ts ***!
  \************************************************************/
/*! exports provided: ButtonsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ButtonsComponent", function() { return ButtonsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ButtonsComponent = /** @class */ (function () {
    function ButtonsComponent() {
        this.code = "<button class=\"btn btn-primary\" type=\"button\">Button</button>\n  <button class=\"btn btn-icon btn-3 btn-primary\" type=\"button\">\n    <span class=\"btn-inner--icon\"><i class=\"ni ni-bag-17\"></i></span>\n    <span class=\"btn-inner--text\">With icon</span>\n  </button>\n  <button class=\"btn btn-icon btn-2 btn-primary\" type=\"button\">\n    <span class=\"btn-inner--icon\"><i class=\"ni ni-atom\"></i></span>\n  </button>";
        this.code1 = "<button type=\"button\" class=\"btn btn-default\">Default</button>\n  <button type=\"button\" class=\"btn btn-primary\">Primary</button>\n  <button type=\"button\" class=\"btn btn-secondary\">Secondary</button>\n  <button type=\"button\" class=\"btn btn-info\">Info</button>\n  <button type=\"button\" class=\"btn btn-success\">Success</button>\n  <button type=\"button\" class=\"btn btn-danger\">Danger</button>\n  <button type=\"button\" class=\"btn btn-warning\">Warning</button>";
        this.code2 = "<button type=\"button\" class=\"btn btn-outline-default\">Default</button>\n  <button type=\"button\" class=\"btn btn-outline-primary\">Primary</button>\n  <button type=\"button\" class=\"btn btn-outline-secondary\">Secondary</button>\n  <button type=\"button\" class=\"btn btn-outline-info\">Info</button>\n  <button type=\"button\" class=\"btn btn-outline-success\">Success</button>\n  <button type=\"button\" class=\"btn btn-outline-danger\">Danger</button>\n  <button type=\"button\" class=\"btn btn-outline-warning\">Warning</button>";
        this.code3 = "<button type=\"button\" class=\"btn btn-primary btn-lg\">Large button</button>\n  <button type=\"button\" class=\"btn btn-secondary btn-lg\">Large button</button>";
        this.code4 = "<button type=\"button\" class=\"btn btn-primary btn-sm\">Small button</button>\n  <button type=\"button\" class=\"btn btn-secondary btn-sm\">Small button</button>";
        this.code5 = "<button type=\"button\" class=\"btn btn-primary btn-lg btn-block\">Block level button</button>\n  <button type=\"button\" class=\"btn btn-secondary btn-lg btn-block\">Block level button</button>";
        this.code6 = "<a href=\"#\" class=\"btn btn-primary btn-lg active\" role=\"button\" aria-pressed=\"true\">Primary link</a>\n  <a href=\"#\" class=\"btn btn-secondary btn-lg active\" role=\"button\" aria-pressed=\"true\">Link</a>";
        this.code7 = "<button type=\"button\" class=\"btn btn-lg btn-primary\" disabled=\"\">Primary button</button>\n  <button type=\"button\" class=\"btn btn-secondary btn-lg\" disabled=\"\">Button</button>";
    }
    ButtonsComponent.prototype.ngOnInit = function () {
    };
    ButtonsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-buttons',
            template: __webpack_require__(/*! ./buttons.component.html */ "./src/app/documentation/buttons/buttons.component.html"),
            styles: [__webpack_require__(/*! ./buttons.component.scss */ "./src/app/documentation/buttons/buttons.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ButtonsComponent);
    return ButtonsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/cards/cards.component.html":
/*!**********************************************************!*\
  !*** ./src/app/documentation/cards/cards.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Card</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">A card provides a flexible and extensible content container with multiple variants and options.</p>\n<hr>\n<h3 id=\"examples\"><div>Examples<a class=\"anchorjs-link \" href=\"#examples\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"card\" style=\"width: 18rem;\">\n          <img class=\"card-img-top\" src=\"assets/img/theme/img-1-1000x900.jpg\" alt=\"Card image cap\">\n          <div class=\"card-body\">\n            <h5 class=\"card-title\">Card title</h5>\n            <p class=\"card-text\">Some quick example text to build on the card title and make up the bulk of the card's content.</p>\n            <a href=\"#\" class=\"btn btn-primary\">Go somewhere</a>\n          </div>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"stats-card\"><div>Stats card<a class=\"anchorjs-link \" href=\"#stats-card\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div style=\"width: 18rem;\">\n          <div class=\"card card-stats mb-4 mb-lg-0\">\n            <div class=\"card-body\">\n              <div class=\"row\">\n                <div class=\"col\">\n                  <h5 class=\"card-title text-uppercase text-muted mb-0\">Total traffic</h5>\n                  <span class=\"h2 font-weight-bold mb-0\">350,897</span>\n                </div>\n                <div class=\"col-auto\">\n                  <div class=\"icon icon-shape bg-danger text-white rounded-circle shadow\">\n                    <i class=\"fas fa-chart-bar\"></i>\n                  </div>\n                </div>\n              </div>\n              <p class=\"mt-3 mb-0 text-muted text-sm\">\n                <span class=\"text-success mr-2\"><i class=\"fa fa-arrow-up\"></i> 3.48%</span>\n                <span class=\"text-nowrap\">Since last month</span>\n              </p>\n            </div>\n          </div>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code1\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n\n\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/cards/cards.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/documentation/cards/cards.component.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vY2FyZHMvY2FyZHMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/documentation/cards/cards.component.ts":
/*!********************************************************!*\
  !*** ./src/app/documentation/cards/cards.component.ts ***!
  \********************************************************/
/*! exports provided: CardsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CardsComponent", function() { return CardsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CardsComponent = /** @class */ (function () {
    function CardsComponent() {
        this.code = "<div class=\"card\" style=\"width: 18rem;\">\n    <img class=\"card-img-top\" src=\"assets/img/theme/img-1-1000x900.jpg\" alt=\"Card image cap\">\n    <div class=\"card-body\">\n      <h5 class=\"card-title\">Card title</h5>\n      <p class=\"card-text\">Some quick example text to build on the card title and make up the bulk of the card's content.</p>\n      <a href=\"#\" class=\"btn btn-primary\">Go somewhere</a>\n    </div>\n  </div>";
        this.code1 = "<div style=\"width: 18rem;\">\n    <div class=\"card card-stats mb-4 mb-lg-0\">\n      <div class=\"card-body\">\n        <div class=\"row\">\n          <div class=\"col\">\n            <h5 class=\"card-title text-uppercase text-muted mb-0\">Total traffic</h5>\n            <span class=\"h2 font-weight-bold mb-0\">350,897</span>\n          </div>\n          <div class=\"col-auto\">\n            <div class=\"icon icon-shape bg-danger text-white rounded-circle shadow\">\n              <i class=\"fas fa-chart-bar\"></i>\n            </div>\n          </div>\n        </div>\n        <p class=\"mt-3 mb-0 text-muted text-sm\">\n          <span class=\"text-success mr-2\"><i class=\"fa fa-arrow-up\"></i> 3.48%</span>\n          <span class=\"text-nowrap\">Since last month</span>\n        </p>\n      </div>\n    </div>\n  </div>";
    }
    CardsComponent.prototype.ngOnInit = function () {
    };
    CardsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-cards',
            template: __webpack_require__(/*! ./cards.component.html */ "./src/app/documentation/cards/cards.component.html"),
            styles: [__webpack_require__(/*! ./cards.component.scss */ "./src/app/documentation/cards/cards.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], CardsComponent);
    return CardsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/charts/charts.component.html":
/*!************************************************************!*\
  !*** ./src/app/documentation/charts/charts.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Charts</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Simple yet flexible Javascript charting for designers &amp; developers</p>\n<hr>\n<h2 id=\"example\">Example</h2>\n<div class=\"ct-example\">\n  <div class=\"card\">\n    <div class=\"card-body\">\n      <div class=\"chart\">\n        <!-- Chart wrapper -->\n        <canvas id=\"chart-orders\" class=\"chart-canvas\"></canvas>\n      </div>\n    </div>\n  </div>\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid3\" title=\"Typescript\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code1\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"dark-card-with-chart\">Dark card with chart</h2>\n<div class=\"ct-example\">\n  <div class=\"card bg-default\">\n    <div class=\"card-body\">\n      <div class=\"chart\">\n        <!-- Chart wrapper -->\n        <canvas id=\"chart-sales\" class=\"chart-canvas\" ></canvas>\n      </div>\n    </div>\n  </div>\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code2\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid3\" title=\"Typescript\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code3\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/charts/charts.component.scss":
/*!************************************************************!*\
  !*** ./src/app/documentation/charts/charts.component.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vY2hhcnRzL2NoYXJ0cy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/documentation/charts/charts.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/documentation/charts/charts.component.ts ***!
  \**********************************************************/
/*! exports provided: ChartsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChartsComponent", function() { return ChartsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chart.js */ "./node_modules/chart.js/src/chart.js");
/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chart_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _variables_charts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../variables/charts */ "./src/app/variables/charts.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// core components

var ChartsComponent = /** @class */ (function () {
    function ChartsComponent() {
        this.code = "<div class=\"card\">\n    <div class=\"card-body\">\n      <div class=\"chart\">\n        <!-- Chart wrapper -->\n        <canvas id=\"chart-orders\" class=\"chart-canvas\"></canvas>\n      </div>\n    </div>\n  </div>";
        this.code1 = "import { Component, OnInit, } from '@angular/core';\n  import Chart from 'chart.js';\n\n  // core components\n  import {\n    chartOptions,\n    parseOptions,\n    chartExample1,\n    chartExample2\n  } from \"../../variables/charts\";\n\n  @Component({\n    selector: 'app-charts',\n    templateUrl: './charts.component.html',\n    styleUrls: ['./charts.component.scss']\n  })\n  export class ChartsComponent implements OnInit {\n    public data: any;\n    public salesChart;\n    public clicked: boolean = true;\n    public clicked1: boolean = false;\n\n    constructor() { }\n\n    ngOnInit() {\n\n      var chartOrders = document.getElementById('chart-orders');\n\n      parseOptions(Chart, chartOptions());\n\n      var ordersChart = new Chart(chartOrders, {\n        type: 'bar',\n        options: chartExample2.options,\n        data: chartExample2.data\n      });\n    }\n\n  }\n";
        this.code2 = "<div class=\"card bg-default\">\n    <div class=\"card-body\">\n      <div class=\"chart\">\n        <!-- Chart wrapper -->\n        <canvas id=\"chart-sales\" class=\"chart-canvas\" ></canvas>\n      </div>\n    </div>\n  </div>";
        this.code3 = "import { Component, OnInit, } from '@angular/core';\n  import Chart from 'chart.js';\n\n  // core components\n  import {\n    chartOptions,\n    parseOptions,\n    chartExample1,\n    chartExample2\n  } from \"../../variables/charts\";\n\n  @Component({\n    selector: 'app-charts',\n    templateUrl: './charts.component.html',\n    styleUrls: ['./charts.component.scss']\n  })\n  export class ChartsComponent implements OnInit {\n    public data: any;\n    public salesChart;\n    public clicked: boolean = true;\n    public clicked1: boolean = false;\n\n    constructor() { }\n\n    ngOnInit() {\n      var chartSales = document.getElementById('chart-sales');\n\n      this.salesChart = new Chart(chartSales, {\n  \t\t\ttype: 'line',\n  \t\t\toptions: chartExample1.options,\n  \t\t\tdata: chartExample1.data\n  \t\t});\n    }\n\n  }\n";
        this.clicked = true;
        this.clicked1 = false;
    }
    ChartsComponent.prototype.ngOnInit = function () {
        var chartOrders = document.getElementById('chart-orders');
        Object(_variables_charts__WEBPACK_IMPORTED_MODULE_2__["parseOptions"])(chart_js__WEBPACK_IMPORTED_MODULE_1___default.a, Object(_variables_charts__WEBPACK_IMPORTED_MODULE_2__["chartOptions"])());
        var ordersChart = new chart_js__WEBPACK_IMPORTED_MODULE_1___default.a(chartOrders, {
            type: 'bar',
            options: _variables_charts__WEBPACK_IMPORTED_MODULE_2__["chartExample2"].options,
            data: _variables_charts__WEBPACK_IMPORTED_MODULE_2__["chartExample2"].data
        });
        var chartSales = document.getElementById('chart-sales');
        this.salesChart = new chart_js__WEBPACK_IMPORTED_MODULE_1___default.a(chartSales, {
            type: 'line',
            options: _variables_charts__WEBPACK_IMPORTED_MODULE_2__["chartExample1"].options,
            data: _variables_charts__WEBPACK_IMPORTED_MODULE_2__["chartExample1"].data
        });
    };
    ChartsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-charts',
            template: __webpack_require__(/*! ./charts.component.html */ "./src/app/documentation/charts/charts.component.html"),
            styles: [__webpack_require__(/*! ./charts.component.scss */ "./src/app/documentation/charts/charts.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ChartsComponent);
    return ChartsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/colors/colors.component.html":
/*!************************************************************!*\
  !*** ./src/app/documentation/colors/colors.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Icons</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Get started with Bootstrap, the world’s most popular framework for building responsive, mobile-first sites, with BootstrapCDN and a template starter page.</p>\n<hr>\n<h2 id=\"primary-colors\"><div>Primary colors<a class=\"anchorjs-link \" href=\"#primary-colors\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Our primary palette is comprised of neutrals, white, and blue. These colors are present across most touch points from marketing to product.</p>\n<div class=\"row\">\n  <div class=\"col-lg-4 col-md-6\">\n    <div class=\"color-swatch\">\n      <div class=\"color-swatch-header bg-default\">\n        <div class=\"pass-fail\">\n          <div class=\"pass-fail-item-wrap\">\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Fail</div>\n              </div>\n            </div>\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item white small\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Pass</div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"color-swatch-body\">\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Name</div>\n            <div class=\"value\">Default</div>\n          </div>\n        </div>\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Hex</div>\n            <div class=\"value\">#172b4d</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-lg-4 col-md-6\">\n    <div class=\"color-swatch\">\n      <div class=\"color-swatch-header bg-primary\">\n        <div class=\"pass-fail\">\n          <div class=\"pass-fail-item-wrap\">\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Fail</div>\n              </div>\n            </div>\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item white small\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Pass</div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"color-swatch-body\">\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Name</div>\n            <div class=\"value\">Primary</div>\n          </div>\n        </div>\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Hex</div>\n            <div class=\"value\">#5e72e4</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-lg-4 col-md-6\">\n    <div class=\"color-swatch\">\n      <div class=\"color-swatch-header bg-secondary\">\n        <div class=\"pass-fail\">\n          <div class=\"pass-fail-item-wrap\">\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Fail</div>\n              </div>\n            </div>\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item white small\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Pass</div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"color-swatch-body\">\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Name</div>\n            <div class=\"value\">Secondary</div>\n          </div>\n        </div>\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Hex</div>\n            <div class=\"value\">#f4f5f7</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-lg-4 col-md-6\">\n    <div class=\"color-swatch\">\n      <div class=\"color-swatch-header bg-info\">\n        <div class=\"pass-fail\">\n          <div class=\"pass-fail-item-wrap\">\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Fail</div>\n              </div>\n            </div>\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item white small\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Pass</div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"color-swatch-body\">\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Name</div>\n            <div class=\"value\">Info</div>\n          </div>\n        </div>\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Hex</div>\n            <div class=\"value\">#11cdef</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-lg-4 col-md-6\">\n    <div class=\"color-swatch\">\n      <div class=\"color-swatch-header bg-success\">\n        <div class=\"pass-fail\">\n          <div class=\"pass-fail-item-wrap\">\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Fail</div>\n              </div>\n            </div>\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item white small\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Pass</div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"color-swatch-body\">\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Name</div>\n            <div class=\"value\">Success</div>\n          </div>\n        </div>\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Hex</div>\n            <div class=\"value\">#2dce89</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-lg-4 col-md-6\">\n    <div class=\"color-swatch\">\n      <div class=\"color-swatch-header bg-danger\">\n        <div class=\"pass-fail\">\n          <div class=\"pass-fail-item-wrap\">\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Fail</div>\n              </div>\n            </div>\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item white small\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Pass</div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"color-swatch-body\">\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Name</div>\n            <div class=\"value\">Danger</div>\n          </div>\n        </div>\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Hex</div>\n            <div class=\"value\">#f5365c</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-lg-4 col-md-6\">\n    <div class=\"color-swatch\">\n      <div class=\"color-swatch-header bg-warning\">\n        <div class=\"pass-fail\">\n          <div class=\"pass-fail-item-wrap\">\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Fail</div>\n              </div>\n            </div>\n            <div class=\"pass-fail-item-group\">\n              <div class=\"pass-fail-item white small\">\n                <div class=\"example\">A</div>\n                <div class=\"lozenge\">Pass</div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"color-swatch-body\">\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Name</div>\n            <div class=\"value\">Warning</div>\n          </div>\n        </div>\n        <div class=\"prop-item-wrap\">\n          <div class=\"prop-item\">\n            <div class=\"label\">Hex</div>\n            <div class=\"value\">#fb6340</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<h2 id=\"light-neutrals\"><div>Light neutrals<a class=\"anchorjs-link \" href=\"#light-neutrals\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Light neutrals are helpful for offsetting content in a primarily white layout without losing warmth and cleanliness, and are therefore often used as a background color for web components.</p>\n<table class=\"table table-colors\">\n  <tbody>\n  </tbody>\n</table>\n"

/***/ }),

/***/ "./src/app/documentation/colors/colors.component.scss":
/*!************************************************************!*\
  !*** ./src/app/documentation/colors/colors.component.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vY29sb3JzL2NvbG9ycy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/documentation/colors/colors.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/documentation/colors/colors.component.ts ***!
  \**********************************************************/
/*! exports provided: ColorsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColorsComponent", function() { return ColorsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ColorsComponent = /** @class */ (function () {
    function ColorsComponent() {
    }
    ColorsComponent.prototype.ngOnInit = function () {
    };
    ColorsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-colors',
            template: __webpack_require__(/*! ./colors.component.html */ "./src/app/documentation/colors/colors.component.html"),
            styles: [__webpack_require__(/*! ./colors.component.scss */ "./src/app/documentation/colors/colors.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ColorsComponent);
    return ColorsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/contents/contents.component.html":
/*!****************************************************************!*\
  !*** ./src/app/documentation/contents/contents.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Contents</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Discover what’s included in Bootstrap, including our precompiled and source code flavors. Remember, Bootstrap’s JavaScript plugins require jQuery.</p>\n<hr>\n<h2 id=\"argon-structure\"><div>Argon structure<a class=\"anchorjs-link \" href=\"#argon-structure\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Once downloaded, unzip the compressed folder and you’ll see something like this:</p>\n<!-- NOTE: This info is intentionally duplicated in the README. Copy any changes made here over to the README too. -->\n<figure class=\"highlight\"><pre class=\" language-plaintext\"><code class=\" language-plaintext\" data-lang=\"plaintext\">\n  argon-dashboard-angular\n  ├── README.md\n  ├── angular.json\n  ├── e2e\n  ├── package.json\n  ├── src\n  │   ├── app\n  │   │   ├── app.component.html\n  │   │   ├── app.component.scss\n  │   │   ├── app.component.spec.ts\n  │   │   ├── app.component.ts\n  │   │   ├── app.module.ts\n  │   │   ├── app.routing.ts\n  │   │   ├── components\n  │   │   │   ├── components.module.spec.ts\n  │   │   │   ├── components.module.ts\n  │   │   │   ├── footer\n  │   │   │   │   ├── footer.component.html\n  │   │   │   │   ├── footer.component.scss\n  │   │   │   │   ├── footer.component.spec.ts\n  │   │   │   │   └── footer.component.ts\n  │   │   │   ├── navbar\n  │   │   │   │   ├── navbar.component.html\n  │   │   │   │   ├── navbar.component.scss\n  │   │   │   │   ├── navbar.component.spec.ts\n  │   │   │   │   └── navbar.component.ts\n  │   │   │   └── sidebar\n  │   │   │       ├── sidebar.component.html\n  │   │   │       ├── sidebar.component.scss\n  │   │   │       ├── sidebar.component.spec.ts\n  │   │   │       └── sidebar.component.ts\n  │   │   ├── layouts\n  │   │   │   ├── admin-layout\n  │   │   │   │   ├── admin-layout.component.html\n  │   │   │   │   ├── admin-layout.component.scss\n  │   │   │   │   ├── admin-layout.component.spec.ts\n  │   │   │   │   ├── admin-layout.component.ts\n  │   │   │   │   ├── admin-layout.module.ts\n  │   │   │   │   └── admin-layout.routing.ts\n  │   │   │   └── auth-layout\n  │   │   │       ├── auth-layout.component.html\n  │   │   │       ├── auth-layout.component.scss\n  │   │   │       ├── auth-layout.component.spec.ts\n  │   │   │       ├── auth-layout.component.ts\n  │   │   │       ├── auth-layout.module.ts\n  │   │   │       └── auth-layout.routing.ts\n  │   │   ├── pages\n  │   │   │   ├── dashboard\n  │   │   │   │   ├── dashboard.component.html\n  │   │   │   │   ├── dashboard.component.scss\n  │   │   │   │   ├── dashboard.component.spec.ts\n  │   │   │   │   └── dashboard.component.ts\n  │   │   │   ├── icons\n  │   │   │   │   ├── icons.component.html\n  │   │   │   │   ├── icons.component.scss\n  │   │   │   │   ├── icons.component.spec.ts\n  │   │   │   │   └── icons.component.ts\n  │   │   │   ├── login\n  │   │   │   │   ├── login.component.html\n  │   │   │   │   ├── login.component.scss\n  │   │   │   │   ├── login.component.spec.ts\n  │   │   │   │   └── login.component.ts\n  │   │   │   ├── maps\n  │   │   │   │   ├── maps.component.html\n  │   │   │   │   ├── maps.component.scss\n  │   │   │   │   ├── maps.component.spec.ts\n  │   │   │   │   └── maps.component.ts\n  │   │   │   ├── register\n  │   │   │   │   ├── register.component.html\n  │   │   │   │   ├── register.component.scss\n  │   │   │   │   ├── register.component.spec.ts\n  │   │   │   │   └── register.component.ts\n  │   │   │   ├── tables\n  │   │   │   │   ├── tables.component.html\n  │   │   │   │   ├── tables.component.scss\n  │   │   │   │   ├── tables.component.spec.ts\n  │   │   │   │   └── tables.component.ts\n  │   │   │   └── user-profile\n  │   │   │       ├── user-profile.component.html\n  │   │   │       ├── user-profile.component.scss\n  │   │   │       ├── user-profile.component.spec.ts\n  │   │   │       └── user-profile.component.ts\n  │   │   └── variables\n  │   │       └── charts.ts\n  │   ├── assets\n  │   │   ├── fonts\n  │   │   ├── img\n  │   │   ├── js\n  │   │   ├── scss\n  │   │   │   ├── angular-differences\n  │   │   │   ├── argon.scss\n  │   │   │   ├── core\n  │   │   │   └── custom\n  │   │   └── vendor\n  │   ├── browserslist\n  │   ├── environments\n  │   ├── favicon.ico\n  │   ├── index.html\n  │   ├── main.ts\n  │   ├── polyfills.ts\n  │   ├── styles.scss\n  │   ├── test.ts\n  │   ├── tsconfig.app.json\n  │   ├── tsconfig.spec.json\n  │   └── tslint.json\n  ├── tsconfig.json\n  └── tslint.json</code></pre>\n</figure>\n<h2 id=\"bootstrap-components\"><div>Bootstrap components<a class=\"anchorjs-link \" href=\"#bootstrap-components\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Here is the list of Bootstrap 4 components that were restyled in Argon:</p>\n<div class=\"row row-grid mt-5\">\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Alerts</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Badge</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Buttons</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Carousel</h6>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"row row-grid\">\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Dropdowns</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Forms</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Modal</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Navs</h6>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"row row-grid\">\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Navbar</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Pagination</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Popover &amp; Tooltip</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Progress</h6>\n      </div>\n    </div>\n  </div>\n</div>\n<h2 id=\"argon-components\"><div>Argon components<a class=\"anchorjs-link \" href=\"#argon-components\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Besides giving the existing Bootstrap elements a new look, we added new ones, so that the interface and consistent and homogenous. Going through them, we added:</p>\n<div class=\"row row-grid mt-5\">\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Datepicker</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Sliders</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Checkboxes</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Radio buttons</h6>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"row row-grid\">\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Toggle buttons</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Font Awesome</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Nucleo icons</h6>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-3\">\n    <div class=\"card shadow-sm\">\n      <div class=\"p-4 text-center\">\n        <h6 class=\"mb-0\">Modals</h6>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/contents/contents.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/documentation/contents/contents.component.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vY29udGVudHMvY29udGVudHMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/documentation/contents/contents.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/documentation/contents/contents.component.ts ***!
  \**************************************************************/
/*! exports provided: ContentsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentsComponent", function() { return ContentsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ContentsComponent = /** @class */ (function () {
    function ContentsComponent() {
    }
    ContentsComponent.prototype.ngOnInit = function () {
    };
    ContentsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-contents',
            template: __webpack_require__(/*! ./contents.component.html */ "./src/app/documentation/contents/contents.component.html"),
            styles: [__webpack_require__(/*! ./contents.component.scss */ "./src/app/documentation/contents/contents.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ContentsComponent);
    return ContentsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/datepicker/datepicker.component.html":
/*!********************************************************************!*\
  !*** ./src/app/documentation/datepicker/datepicker.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = " <div class=\"ct-page-title\">\n   <h1 class=\"ct-title\" id=\"content\">Datepicker</h1>\n   <div class=\"avatar-group mt-3\">\n   </div>\n </div>\n <p class=\"ct-lead\">The datepicker is tied to a standard form input field. Focus on the input (click, or use the tab key) to open an interactive calendar in a small overlay. Choose a date, click elsewhere on the page (blur the input), or hit the Esc key to close. If a date is chosen, feedback is shown as the input’s value.</p>\n <hr>\n <h2 id=\"single-datepicker\">Single datepicker</h2>\n <div class=\"ct-example\">\n   <ngb-tabset>\n     <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n       <ng-template ngbTabContent>\n         <div class=\"form-group\">\n           <div class=\"input-group input-group-alternative\">\n             <div class=\"input-group-prepend\">\n               <span class=\"input-group-text\"><i class=\"ni ni-calendar-grid-58\"></i></span>\n             </div>\n             <input class=\"form-control datepicker\" placeholder=\"Select date\" name=\"dp\" [(ngModel)]=\"model\" ngbDatepicker #d=\"ngbDatepicker\" (click)=\"d.toggle()\" type=\"text\"/>\n           </div>\n         </div>\n       </ng-template>\n     </ngb-tab>\n     <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n       <ng-template ngbTabContent>\n         <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n           <pre><code [highlight]=\"code\"></code></pre>\n         </div>\n       </ng-template>\n     </ngb-tab>\n   </ngb-tabset>\n </div>\n <h2 id=\"range-datepicker\">Range datepicker</h2>\n <div class=\"ct-example\">\n   <ngb-tabset>\n     <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n       <ng-template ngbTabContent>\n         <div class=\"input-daterange datepicker row align-items-center\">\n           <ngb-datepicker #dp (select)=\"onDateSelection($event)\" [displayMonths]=\"2\" [dayTemplate]=\"t\">\n           </ngb-datepicker>\n           <ng-template #t let-date let-focused=\"focused\" >\n            <span class=\"custom-day\"\n                  [class.focused]=\"focused\"\n                  [class.range]=\"isRange(date)\"\n                  [class.faded]=\"isHovered(date) || isInside(date)\"\n                  [class.range-start]=\"date && fromDate && date.day === fromDate.day && date.month === fromDate.month\"\n                  [class.range-end]=\"date && toDate && date.day === toDate.day && date.month === toDate.month\"\n                  (mouseenter)=\"hoveredDate = date\"\n                  (mouseleave)=\"hoveredDate = null\">\n              {{ date.day }}\n            </span>\n          </ng-template>\n         </div>\n       </ng-template>\n     </ngb-tab>\n     <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n       <ng-template ngbTabContent>\n         <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n           <pre><code [highlight]=\"code1\"></code></pre>\n         </div>\n       </ng-template>\n     </ngb-tab>\n     <ngb-tab id=\"tab-selectbyid3\" title=\"Typescript\">\n       <ng-template ngbTabContent>\n         <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n           <pre><code [highlight]=\"code2\"></code></pre>\n         </div>\n       </ng-template>\n     </ngb-tab>\n   </ngb-tabset>\n </div>\n"

/***/ }),

/***/ "./src/app/documentation/datepicker/datepicker.component.scss":
/*!********************************************************************!*\
  !*** ./src/app/documentation/datepicker/datepicker.component.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vZGF0ZXBpY2tlci9kYXRlcGlja2VyLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/documentation/datepicker/datepicker.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/documentation/datepicker/datepicker.component.ts ***!
  \******************************************************************/
/*! exports provided: DatepickerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DatepickerComponent", function() { return DatepickerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DatepickerComponent = /** @class */ (function () {
    function DatepickerComponent(calendar) {
        this.code = "<div class=\"form-group\">\n    <div class=\"input-group input-group-alternative\">\n      <div class=\"input-group-prepend\">\n        <span class=\"input-group-text\"><i class=\"ni ni-calendar-grid-58\"></i></span>\n      </div>\n      <input class=\"form-control datepicker\" placeholder=\"Select date\" name=\"dp\" [(ngModel)]=\"model\" ngbDatepicker #d=\"ngbDatepicker\" (click)=\"d.toggle()\" type=\"text\"/>\n    </div>\n  </div>";
        this.code1 = "<div class=\"input-daterange datepicker row align-items-center\">\n    <ngb-datepicker #dp (select)=\"onDateSelection($event)\" [displayMonths]=\"2\" [dayTemplate]=\"t\">\n    </ngb-datepicker>\n    <ng-template #t let-date let-focused=\"focused\" >\n     <span class=\"custom-day\"\n           [class.focused]=\"focused\"\n           [class.range]=\"isRange(date)\"\n           [class.faded]=\"isHovered(date) || isInside(date)\"\n           [class.range-start]=\"date && fromDate && date.day === fromDate.day && date.month === fromDate.month\"\n           [class.range-end]=\"date && toDate && date.day === toDate.day && date.month === toDate.month\"\n           (mouseenter)=\"hoveredDate = date\"\n           (mouseleave)=\"hoveredDate = null\">\n       {{ date.day }}\n     </span>\n   </ng-template>\n  </div>";
        this.code2 = "import { Component, OnInit } from '@angular/core';\n  import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';\n\n  @Component({\n    selector: 'app-datepicker',\n    templateUrl: './datepicker.component.html',\n    styleUrls: ['./datepicker.component.scss']\n  })\n  export class DatepickerComponent implements OnInit {\n    fromDate: NgbDate;\n    toDate: NgbDate;\n    hoveredDate: NgbDate;\n\n    constructor(calendar: NgbCalendar) {\n      this.fromDate = calendar.getToday();\n      this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);\n    }\n\n    ngOnInit() {\n    }\n\n    onDateSelection(date: NgbDate) {\n      console.log(this.fromDate)\n\n      if (!this.fromDate && !this.toDate) {\n        this.fromDate = date;\n      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {\n        this.toDate = date;\n      } else {\n        this.toDate = null;\n        this.fromDate = date;\n      }\n      console.log(this.toDate)\n\n    }\n    isHovered(date: NgbDate) {\n      return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);\n    }\n\n    isInside(date: NgbDate) {\n      return date.after(this.fromDate) && date.before(this.toDate);\n    }\n\n    isRange(date: NgbDate) {\n      return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);\n    }\n\n  }\n";
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    }
    DatepickerComponent.prototype.ngOnInit = function () {
    };
    DatepickerComponent.prototype.onDateSelection = function (date) {
        console.log(this.fromDate);
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        }
        else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
        }
        else {
            this.toDate = null;
            this.fromDate = date;
        }
        console.log(this.toDate);
    };
    DatepickerComponent.prototype.isHovered = function (date) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    };
    DatepickerComponent.prototype.isInside = function (date) {
        return date.after(this.fromDate) && date.before(this.toDate);
    };
    DatepickerComponent.prototype.isRange = function (date) {
        return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
    };
    DatepickerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-datepicker',
            template: __webpack_require__(/*! ./datepicker.component.html */ "./src/app/documentation/datepicker/datepicker.component.html"),
            styles: [__webpack_require__(/*! ./datepicker.component.scss */ "./src/app/documentation/datepicker/datepicker.component.scss")]
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbCalendar"]])
    ], DatepickerComponent);
    return DatepickerComponent;
}());



/***/ }),

/***/ "./src/app/documentation/documentation.module.ts":
/*!*******************************************************!*\
  !*** ./src/app/documentation/documentation.module.ts ***!
  \*******************************************************/
/*! exports provided: hljsLanguages, DocumentationModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hljsLanguages", function() { return hljsLanguages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentationModule", function() { return DocumentationModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _documentation_routing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./documentation.routing */ "./src/app/documentation/documentation.routing.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_clipboard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-clipboard */ "./node_modules/ngx-clipboard/fesm5/ngx-clipboard.js");
/* harmony import */ var ngx_highlightjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-highlightjs */ "./node_modules/ngx-highlightjs/fesm5/ngx-highlightjs.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _tutorial_tutorial_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./tutorial/tutorial.component */ "./src/app/documentation/tutorial/tutorial.component.ts");
/* harmony import */ var _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./buttons/buttons.component */ "./src/app/documentation/buttons/buttons.component.ts");
/* harmony import */ var _navigation_navigation_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./navigation/navigation.component */ "./src/app/documentation/navigation/navigation.component.ts");
/* harmony import */ var _notifications_notifications_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./notifications/notifications.component */ "./src/app/documentation/notifications/notifications.component.ts");
/* harmony import */ var _tables_tables_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./tables/tables.component */ "./src/app/documentation/tables/tables.component.ts");
/* harmony import */ var _cards_cards_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./cards/cards.component */ "./src/app/documentation/cards/cards.component.ts");
/* harmony import */ var _charts_charts_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./charts/charts.component */ "./src/app/documentation/charts/charts.component.ts");
/* harmony import */ var _license_license_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./license/license.component */ "./src/app/documentation/license/license.component.ts");
/* harmony import */ var _contents_contents_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./contents/contents.component */ "./src/app/documentation/contents/contents.component.ts");
/* harmony import */ var _colors_colors_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./colors/colors.component */ "./src/app/documentation/colors/colors.component.ts");
/* harmony import */ var _grid_grid_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./grid/grid.component */ "./src/app/documentation/grid/grid.component.ts");
/* harmony import */ var _typography_typography_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./typography/typography.component */ "./src/app/documentation/typography/typography.component.ts");
/* harmony import */ var _icons_icons_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./icons/icons.component */ "./src/app/documentation/icons/icons.component.ts");
/* harmony import */ var _alerts_alerts_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./alerts/alerts.component */ "./src/app/documentation/alerts/alerts.component.ts");
/* harmony import */ var _badge_badge_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./badge/badge.component */ "./src/app/documentation/badge/badge.component.ts");
/* harmony import */ var _forms_forms_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./forms/forms.component */ "./src/app/documentation/forms/forms.component.ts");
/* harmony import */ var _pagination_pagination_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./pagination/pagination.component */ "./src/app/documentation/pagination/pagination.component.ts");
/* harmony import */ var _popovers_popovers_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./popovers/popovers.component */ "./src/app/documentation/popovers/popovers.component.ts");
/* harmony import */ var _progress_progress_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./progress/progress.component */ "./src/app/documentation/progress/progress.component.ts");
/* harmony import */ var _tooltips_tooltips_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./tooltips/tooltips.component */ "./src/app/documentation/tooltips/tooltips.component.ts");
/* harmony import */ var _datepicker_datepicker_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./datepicker/datepicker.component */ "./src/app/documentation/datepicker/datepicker.component.ts");
/* harmony import */ var _maps_maps_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./maps/maps.component */ "./src/app/documentation/maps/maps.component.ts");
/* harmony import */ var _sliders_sliders_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./sliders/sliders.component */ "./src/app/documentation/sliders/sliders.component.ts");
/* harmony import */ var highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! highlight.js/lib/languages/xml */ "./node_modules/highlight.js/lib/languages/xml.js");
/* harmony import */ var highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_32___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_32__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

































function hljsLanguages() {
    return [
        { name: 'xml', func: highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_32___default.a }
    ];
}
var DocumentationModule = /** @class */ (function () {
    function DocumentationModule() {
    }
    DocumentationModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_8__["HttpClientModule"],
                ngx_highlightjs__WEBPACK_IMPORTED_MODULE_7__["HighlightModule"].forRoot({
                    languages: hljsLanguages
                }),
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(_documentation_routing__WEBPACK_IMPORTED_MODULE_3__["DocumentationRoutes"]),
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__["NgbModule"],
                ngx_clipboard__WEBPACK_IMPORTED_MODULE_6__["ClipboardModule"],
            ],
            declarations: [
                _tutorial_tutorial_component__WEBPACK_IMPORTED_MODULE_9__["TutorialComponent"],
                _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_10__["ButtonsComponent"],
                _navigation_navigation_component__WEBPACK_IMPORTED_MODULE_11__["NavigationComponent"],
                _tables_tables_component__WEBPACK_IMPORTED_MODULE_13__["TablesComponent"],
                _notifications_notifications_component__WEBPACK_IMPORTED_MODULE_12__["NotificationsComponent"],
                _cards_cards_component__WEBPACK_IMPORTED_MODULE_14__["CardsComponent"],
                _license_license_component__WEBPACK_IMPORTED_MODULE_16__["LicenseComponent"],
                _contents_contents_component__WEBPACK_IMPORTED_MODULE_17__["ContentsComponent"],
                _colors_colors_component__WEBPACK_IMPORTED_MODULE_18__["ColorsComponent"],
                _grid_grid_component__WEBPACK_IMPORTED_MODULE_19__["GridComponent"],
                _typography_typography_component__WEBPACK_IMPORTED_MODULE_20__["TypographyComponent"],
                _icons_icons_component__WEBPACK_IMPORTED_MODULE_21__["IconsComponent"],
                _alerts_alerts_component__WEBPACK_IMPORTED_MODULE_22__["AlertsComponent"],
                _badge_badge_component__WEBPACK_IMPORTED_MODULE_23__["BadgeComponent"],
                _forms_forms_component__WEBPACK_IMPORTED_MODULE_24__["FormsComponent"],
                _pagination_pagination_component__WEBPACK_IMPORTED_MODULE_25__["PaginationComponent"],
                _popovers_popovers_component__WEBPACK_IMPORTED_MODULE_26__["PopoversComponent"],
                _progress_progress_component__WEBPACK_IMPORTED_MODULE_27__["ProgressComponent"],
                _tooltips_tooltips_component__WEBPACK_IMPORTED_MODULE_28__["TooltipsComponent"],
                _datepicker_datepicker_component__WEBPACK_IMPORTED_MODULE_29__["DatepickerComponent"],
                _maps_maps_component__WEBPACK_IMPORTED_MODULE_30__["MapsComponent"],
                _sliders_sliders_component__WEBPACK_IMPORTED_MODULE_31__["SlidersComponent"],
                _charts_charts_component__WEBPACK_IMPORTED_MODULE_15__["ChartsComponent"],
            ]
        })
    ], DocumentationModule);
    return DocumentationModule;
}());



/***/ }),

/***/ "./src/app/documentation/documentation.routing.ts":
/*!********************************************************!*\
  !*** ./src/app/documentation/documentation.routing.ts ***!
  \********************************************************/
/*! exports provided: DocumentationRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentationRoutes", function() { return DocumentationRoutes; });
/* harmony import */ var _tutorial_tutorial_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tutorial/tutorial.component */ "./src/app/documentation/tutorial/tutorial.component.ts");
/* harmony import */ var _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./buttons/buttons.component */ "./src/app/documentation/buttons/buttons.component.ts");
/* harmony import */ var _navigation_navigation_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navigation/navigation.component */ "./src/app/documentation/navigation/navigation.component.ts");
/* harmony import */ var _notifications_notifications_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./notifications/notifications.component */ "./src/app/documentation/notifications/notifications.component.ts");
/* harmony import */ var _tables_tables_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tables/tables.component */ "./src/app/documentation/tables/tables.component.ts");
/* harmony import */ var _cards_cards_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cards/cards.component */ "./src/app/documentation/cards/cards.component.ts");
/* harmony import */ var _charts_charts_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./charts/charts.component */ "./src/app/documentation/charts/charts.component.ts");
/* harmony import */ var _license_license_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./license/license.component */ "./src/app/documentation/license/license.component.ts");
/* harmony import */ var _contents_contents_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./contents/contents.component */ "./src/app/documentation/contents/contents.component.ts");
/* harmony import */ var _colors_colors_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./colors/colors.component */ "./src/app/documentation/colors/colors.component.ts");
/* harmony import */ var _grid_grid_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./grid/grid.component */ "./src/app/documentation/grid/grid.component.ts");
/* harmony import */ var _typography_typography_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./typography/typography.component */ "./src/app/documentation/typography/typography.component.ts");
/* harmony import */ var _icons_icons_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./icons/icons.component */ "./src/app/documentation/icons/icons.component.ts");
/* harmony import */ var _alerts_alerts_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./alerts/alerts.component */ "./src/app/documentation/alerts/alerts.component.ts");
/* harmony import */ var _badge_badge_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./badge/badge.component */ "./src/app/documentation/badge/badge.component.ts");
/* harmony import */ var _forms_forms_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./forms/forms.component */ "./src/app/documentation/forms/forms.component.ts");
/* harmony import */ var _pagination_pagination_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./pagination/pagination.component */ "./src/app/documentation/pagination/pagination.component.ts");
/* harmony import */ var _popovers_popovers_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./popovers/popovers.component */ "./src/app/documentation/popovers/popovers.component.ts");
/* harmony import */ var _progress_progress_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./progress/progress.component */ "./src/app/documentation/progress/progress.component.ts");
/* harmony import */ var _tooltips_tooltips_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./tooltips/tooltips.component */ "./src/app/documentation/tooltips/tooltips.component.ts");
/* harmony import */ var _datepicker_datepicker_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./datepicker/datepicker.component */ "./src/app/documentation/datepicker/datepicker.component.ts");
/* harmony import */ var _maps_maps_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./maps/maps.component */ "./src/app/documentation/maps/maps.component.ts");
/* harmony import */ var _sliders_sliders_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./sliders/sliders.component */ "./src/app/documentation/sliders/sliders.component.ts");























var DocumentationRoutes = [
    {
        path: 'charts',
        component: _charts_charts_component__WEBPACK_IMPORTED_MODULE_6__["ChartsComponent"]
    }, {
        path: 'cards',
        component: _cards_cards_component__WEBPACK_IMPORTED_MODULE_5__["CardsComponent"]
    }, {
        path: 'tutorial',
        component: _tutorial_tutorial_component__WEBPACK_IMPORTED_MODULE_0__["TutorialComponent"]
    }, {
        path: 'buttons',
        component: _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_1__["ButtonsComponent"]
    }, {
        path: 'tables',
        component: _tables_tables_component__WEBPACK_IMPORTED_MODULE_4__["TablesComponent"]
    }, {
        path: 'navigation',
        component: _navigation_navigation_component__WEBPACK_IMPORTED_MODULE_2__["NavigationComponent"]
    }, {
        path: 'notifications',
        component: _notifications_notifications_component__WEBPACK_IMPORTED_MODULE_3__["NotificationsComponent"]
    }, {
        path: 'license',
        component: _license_license_component__WEBPACK_IMPORTED_MODULE_7__["LicenseComponent"]
    }, {
        path: 'contents',
        component: _contents_contents_component__WEBPACK_IMPORTED_MODULE_8__["ContentsComponent"]
    }, {
        path: 'colors',
        component: _colors_colors_component__WEBPACK_IMPORTED_MODULE_9__["ColorsComponent"]
    }, {
        path: 'grid',
        component: _grid_grid_component__WEBPACK_IMPORTED_MODULE_10__["GridComponent"]
    }, {
        path: 'typography',
        component: _typography_typography_component__WEBPACK_IMPORTED_MODULE_11__["TypographyComponent"]
    }, {
        path: 'icons',
        component: _icons_icons_component__WEBPACK_IMPORTED_MODULE_12__["IconsComponent"]
    }, {
        path: 'alerts',
        component: _alerts_alerts_component__WEBPACK_IMPORTED_MODULE_13__["AlertsComponent"]
    }, {
        path: 'badge',
        component: _badge_badge_component__WEBPACK_IMPORTED_MODULE_14__["BadgeComponent"]
    }, {
        path: 'forms',
        component: _forms_forms_component__WEBPACK_IMPORTED_MODULE_15__["FormsComponent"]
    }, {
        path: 'pagination',
        component: _pagination_pagination_component__WEBPACK_IMPORTED_MODULE_16__["PaginationComponent"]
    }, {
        path: 'popovers',
        component: _popovers_popovers_component__WEBPACK_IMPORTED_MODULE_17__["PopoversComponent"]
    }, {
        path: 'progress',
        component: _progress_progress_component__WEBPACK_IMPORTED_MODULE_18__["ProgressComponent"]
    }, {
        path: 'tooltips',
        component: _tooltips_tooltips_component__WEBPACK_IMPORTED_MODULE_19__["TooltipsComponent"]
    }, {
        path: 'datepicker',
        component: _datepicker_datepicker_component__WEBPACK_IMPORTED_MODULE_20__["DatepickerComponent"]
    }, {
        path: 'maps',
        component: _maps_maps_component__WEBPACK_IMPORTED_MODULE_21__["MapsComponent"]
    }, {
        path: 'sliders',
        component: _sliders_sliders_component__WEBPACK_IMPORTED_MODULE_22__["SlidersComponent"]
    }
];


/***/ }),

/***/ "./src/app/documentation/forms/forms.component.html":
/*!**********************************************************!*\
  !*** ./src/app/documentation/forms/forms.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Forms</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Use Bootstrap’s custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.</p>\n<hr>\n<h2 id=\"form-controls\"><div>Form controls<a class=\"anchorjs-link \" href=\"#form-controls\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <form>\n          <div class=\"row\">\n            <div class=\"col-md-6\">\n              <div class=\"form-group\">\n                <input type=\"email\" class=\"form-control\" id=\"exampleFormControlInput1\" placeholder=\"name@example.com\">\n              </div>\n            </div>\n            <div class=\"col-md-6\">\n              <div class=\"form-group\">\n                <input type=\"text\" placeholder=\"Regular\" class=\"form-control\" disabled=\"\">\n              </div>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-6\">\n              <div class=\"form-group\">\n                <div class=\"input-group mb-4\">\n                  <div class=\"input-group-prepend\">\n                    <span class=\"input-group-text\"><i class=\"ni ni-zoom-split-in\"></i></span>\n                  </div>\n                  <input class=\"form-control\" placeholder=\"Search\" type=\"text\">\n                </div>\n              </div>\n            </div>\n            <div class=\"col-md-6\">\n              <div class=\"form-group\">\n                <div class=\"input-group mb-4\">\n                  <input class=\"form-control\" placeholder=\"Birthday\" type=\"text\">\n                  <div class=\"input-group-append\">\n                    <span class=\"input-group-text\"><i class=\"ni ni-zoom-split-in\"></i></span>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-6\">\n              <div class=\"form-group has-success\">\n                <input type=\"text\" placeholder=\"Success\" class=\"form-control is-valid\">\n              </div>\n            </div>\n            <div class=\"col-md-6\">\n              <div class=\"form-group has-danger\">\n                <input type=\"email\" placeholder=\"Error Input\" class=\"form-control is-invalid\">\n              </div>\n            </div>\n          </div>\n        </form>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"alternative\"><div>Alternative<a class=\"anchorjs-link \" href=\"#alternative\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <form>\n          <div class=\"row\">\n            <div class=\"col-md-6\">\n              <div class=\"form-group\">\n                <input type=\"email\" class=\"form-control form-control-alternative\" id=\"exampleFormControlInput1\" placeholder=\"name@example.com\">\n              </div>\n            </div>\n            <div class=\"col-md-6\">\n              <div class=\"form-group\">\n                <input type=\"text\" placeholder=\"Regular\" class=\"form-control form-control-alternative\" disabled=\"\">\n              </div>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-6\">\n              <div class=\"form-group\">\n                <div class=\"input-group input-group-alternative mb-4\">\n                  <div class=\"input-group-prepend\">\n                    <span class=\"input-group-text\"><i class=\"ni ni-zoom-split-in\"></i></span>\n                  </div>\n                  <input class=\"form-control form-control-alternative\" placeholder=\"Search\" type=\"text\">\n                </div>\n              </div>\n            </div>\n            <div class=\"col-md-6\">\n              <div class=\"form-group\">\n                <div class=\"input-group input-group-alternative mb-4\">\n                  <input class=\"form-control\" placeholder=\"Birthday\" type=\"text\">\n                  <div class=\"input-group-append\">\n                    <span class=\"input-group-text\"><i class=\"ni ni-zoom-split-in\"></i></span>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-6\">\n              <div class=\"form-group has-success\">\n                <input type=\"text\" placeholder=\"Success\" class=\"form-control form-control-alternative is-valid\">\n              </div>\n            </div>\n            <div class=\"col-md-6\">\n              <div class=\"form-group has-danger\">\n                <input type=\"email\" placeholder=\"Error Input\" class=\"form-control form-control-alternative is-invalid\">\n              </div>\n            </div>\n          </div>\n        </form>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code1\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"textarea\"><div>Textarea<a class=\"anchorjs-link \" href=\"#textarea\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <form>\n          <textarea class=\"form-control\" id=\"exampleFormControlTextarea1\" rows=\"3\" placeholder=\"Write a large text here ...\"></textarea>\n        </form>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code2\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"alternative-1\"><div>Alternative<a class=\"anchorjs-link \" href=\"#alternative-1\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <form>\n          <textarea class=\"form-control form-control-alternative\" rows=\"3\" placeholder=\"Write a large text here ...\"></textarea>\n        </form>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code3\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"checkboxes\"><div>Checkboxes<a class=\"anchorjs-link \" href=\"#checkboxes\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"custom-control custom-checkbox mb-3\">\n          <input class=\"custom-control-input\" id=\"customCheck1\" type=\"checkbox\">\n          <label class=\"custom-control-label\" for=\"customCheck1\">Unchecked</label>\n        </div>\n        <div class=\"custom-control custom-checkbox mb-3\">\n          <input class=\"custom-control-input\" id=\"customCheck2\" type=\"checkbox\" checked=\"\">\n          <label class=\"custom-control-label\" for=\"customCheck2\">Checked</label>\n        </div>\n        <div class=\"custom-control custom-checkbox mb-3\">\n          <input class=\"custom-control-input\" id=\"customCheck3\" type=\"checkbox\" disabled=\"\">\n          <label class=\"custom-control-label\" for=\"customCheck3\">Disabled Unchecked</label>\n        </div>\n        <div class=\"custom-control custom-checkbox mb-3\">\n          <input class=\"custom-control-input\" id=\"customCheck4\" type=\"checkbox\" checked=\"\" disabled=\"\">\n          <label class=\"custom-control-label\" for=\"customCheck4\">Disabled Checked</label>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code4\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"alternative-2\"><div>Alternative<a class=\"anchorjs-link \" href=\"#alternative-2\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"custom-control custom-control-alternative custom-checkbox mb-3\">\n          <input class=\"custom-control-input\" id=\"customCheck5\" type=\"checkbox\">\n          <label class=\"custom-control-label\" for=\"customCheck5\">Unchecked</label>\n        </div>\n        <div class=\"custom-control custom-control-alternative custom-checkbox mb-3\">\n          <input class=\"custom-control-input\" id=\"customCheck6\" type=\"checkbox\" checked=\"\">\n          <label class=\"custom-control-label\" for=\"customCheck6\">Checked</label>\n        </div>\n        <div class=\"custom-control custom-control-alternative custom-checkbox mb-3\">\n          <input class=\"custom-control-input\" id=\"customCheck7\" type=\"checkbox\" disabled=\"\">\n          <label class=\"custom-control-label\" for=\"customCheck7\">Disabled Unchecked</label>\n        </div>\n        <div class=\"custom-control custom-control-alternative custom-checkbox mb-3\">\n          <input class=\"custom-control-input\" id=\"customCheck8\" type=\"checkbox\" checked=\"\" disabled=\"\">\n          <label class=\"custom-control-label\" for=\"customCheck8\">Disabled Checked</label>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code5\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"radio-buttons\"><div>Radio buttons<a class=\"anchorjs-link \" href=\"#radio-buttons\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"custom-control custom-radio mb-3\">\n          <input name=\"custom-radio-2\" class=\"custom-control-input\" id=\"customRadio5\" type=\"radio\">\n          <label class=\"custom-control-label\" for=\"customRadio5\">Unchecked</label>\n        </div>\n        <div class=\"custom-control custom-radio mb-3\">\n          <input name=\"custom-radio-2\" class=\"custom-control-input\" id=\"customRadio6\" checked=\"\" type=\"radio\">\n          <label class=\"custom-control-label\" for=\"customRadio6\">Checked</label>\n        </div>\n        <div class=\"custom-control custom-radio mb-3\">\n          <input name=\"custom-radio-2\" class=\"custom-control-input\" id=\"customRadio7\" disabled=\"\" type=\"radio\">\n          <label class=\"custom-control-label\" for=\"customRadio7\">Disabled unchecked</label>\n        </div>\n        <div class=\"custom-control custom-radio mb-3\">\n          <input name=\"custom-radio-2\" class=\"custom-control-input\" id=\"customRadio8\" checked=\"\" disabled=\"\" type=\"radio\">\n          <label class=\"custom-control-label\" for=\"customRadio8\">Disabled checkbox</label>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code6\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"alternative-3\"><div>Alternative<a class=\"anchorjs-link \" href=\"#alternative-3\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"custom-control custom-control-alternative custom-radio mb-3\">\n          <input name=\"custom-radio-1\" class=\"custom-control-input\" id=\"customRadio1\" type=\"radio\">\n          <label class=\"custom-control-label\" for=\"customRadio1\">Unchecked</label>\n        </div>\n        <div class=\"custom-control custom-control-alternative custom-radio mb-3\">\n          <input name=\"custom-radio-1\" class=\"custom-control-input\" id=\"customRadio2\" checked=\"\" type=\"radio\">\n          <label class=\"custom-control-label\" for=\"customRadio2\">Checked</label>\n        </div>\n        <div class=\"custom-control custom-control-alternative custom-radio mb-3\">\n          <input name=\"custom-radio-1\" class=\"custom-control-input\" id=\"customRadio3\" disabled=\"\" type=\"radio\">\n          <label class=\"custom-control-label\" for=\"customRadio3\">Disabled unchecked</label>\n        </div>\n        <div class=\"custom-control custom-control-alternative custom-radio mb-3\">\n          <input name=\"custom-radio-1\" class=\"custom-control-input\" id=\"customRadio4\" checked=\"\" disabled=\"\" type=\"radio\">\n          <label class=\"custom-control-label\" for=\"customRadio4\">Disabled checkbox</label>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code7\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"toggle-buttons\"><div>Toggle buttons<a class=\"anchorjs-link \" href=\"#toggle-buttons\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <label class=\"custom-toggle\">\n          <input type=\"checkbox\">\n          <span class=\"custom-toggle-slider rounded-circle\"></span>\n        </label>\n        <span class=\"clearfix\"></span>\n        <label class=\"custom-toggle\">\n          <input type=\"checkbox\" checked=\"\">\n          <span class=\"custom-toggle-slider rounded-circle\"></span>\n        </label>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code8\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"sliders\"><div>Sliders<a class=\"anchorjs-link \" href=\"#sliders\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <!-- Simple slider -->\n        <div class=\"input-slider-container\">\n          <div id=\"test\" class=\"input-slider\"></div>\n        </div>\n        <div class=\"mt-5\">\n          <!-- Range slider container -->\n          <div id=\"test2\"></div>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code9\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid3\" title=\"Typescript\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code10\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/forms/forms.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/documentation/forms/forms.component.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vZm9ybXMvZm9ybXMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/documentation/forms/forms.component.ts":
/*!********************************************************!*\
  !*** ./src/app/documentation/forms/forms.component.ts ***!
  \********************************************************/
/*! exports provided: FormsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormsComponent", function() { return FormsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nouislider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nouislider */ "./node_modules/nouislider/distribute/nouislider.js");
/* harmony import */ var nouislider__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nouislider__WEBPACK_IMPORTED_MODULE_1__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FormsComponent = /** @class */ (function () {
    function FormsComponent() {
        this.simpleSlider = 40;
        this.doubleSlider = [20, 60];
        this.code = "<form>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"form-group\">\n          <input type=\"email\" class=\"form-control\" id=\"exampleFormControlInput1\" placeholder=\"name@example.com\">\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"form-group\">\n          <input type=\"text\" placeholder=\"Regular\" class=\"form-control\" disabled=\"\">\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"form-group\">\n          <div class=\"input-group mb-4\">\n            <div class=\"input-group-prepend\">\n              <span class=\"input-group-text\"><i class=\"ni ni-zoom-split-in\"></i></span>\n            </div>\n            <input class=\"form-control\" placeholder=\"Search\" type=\"text\">\n          </div>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"form-group\">\n          <div class=\"input-group mb-4\">\n            <input class=\"form-control\" placeholder=\"Birthday\" type=\"text\">\n            <div class=\"input-group-append\">\n              <span class=\"input-group-text\"><i class=\"ni ni-zoom-split-in\"></i></span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"form-group has-success\">\n          <input type=\"text\" placeholder=\"Success\" class=\"form-control is-valid\">\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"form-group has-danger\">\n          <input type=\"email\" placeholder=\"Error Input\" class=\"form-control is-invalid\">\n        </div>\n      </div>\n    </div>\n  </form>";
        this.code1 = "<form>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"form-group\">\n          <input type=\"email\" class=\"form-control form-control-alternative\" id=\"exampleFormControlInput1\" placeholder=\"name@example.com\">\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"form-group\">\n          <input type=\"text\" placeholder=\"Regular\" class=\"form-control form-control-alternative\" disabled=\"\">\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"form-group\">\n          <div class=\"input-group input-group-alternative mb-4\">\n            <div class=\"input-group-prepend\">\n              <span class=\"input-group-text\"><i class=\"ni ni-zoom-split-in\"></i></span>\n            </div>\n            <input class=\"form-control form-control-alternative\" placeholder=\"Search\" type=\"text\">\n          </div>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"form-group\">\n          <div class=\"input-group input-group-alternative mb-4\">\n            <input class=\"form-control\" placeholder=\"Birthday\" type=\"text\">\n            <div class=\"input-group-append\">\n              <span class=\"input-group-text\"><i class=\"ni ni-zoom-split-in\"></i></span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"form-group has-success\">\n          <input type=\"text\" placeholder=\"Success\" class=\"form-control form-control-alternative is-valid\">\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"form-group has-danger\">\n          <input type=\"email\" placeholder=\"Error Input\" class=\"form-control form-control-alternative is-invalid\">\n        </div>\n      </div>\n    </div>\n  </form>";
        this.code2 = "<form>\n    <textarea class=\"form-control\" id=\"exampleFormControlTextarea1\" rows=\"3\" placeholder=\"Write a large text here ...\"></textarea>\n  </form>";
        this.code3 = "<form>\n    <textarea class=\"form-control form-control-alternative\" rows=\"3\" placeholder=\"Write a large text here ...\"></textarea>\n  </form>";
        this.code4 = "<div class=\"custom-control custom-checkbox mb-3\">\n    <input class=\"custom-control-input\" id=\"customCheck1\" type=\"checkbox\">\n    <label class=\"custom-control-label\" for=\"customCheck1\">Unchecked</label>\n  </div>\n  <div class=\"custom-control custom-checkbox mb-3\">\n    <input class=\"custom-control-input\" id=\"customCheck2\" type=\"checkbox\" checked=\"\">\n    <label class=\"custom-control-label\" for=\"customCheck2\">Checked</label>\n  </div>\n  <div class=\"custom-control custom-checkbox mb-3\">\n    <input class=\"custom-control-input\" id=\"customCheck3\" type=\"checkbox\" disabled=\"\">\n    <label class=\"custom-control-label\" for=\"customCheck3\">Disabled Unchecked</label>\n  </div>\n  <div class=\"custom-control custom-checkbox mb-3\">\n    <input class=\"custom-control-input\" id=\"customCheck4\" type=\"checkbox\" checked=\"\" disabled=\"\">\n    <label class=\"custom-control-label\" for=\"customCheck4\">Disabled Checked</label>\n  </div>";
        this.code5 = "<div class=\"custom-control custom-control-alternative custom-checkbox mb-3\">\n    <input class=\"custom-control-input\" id=\"customCheck5\" type=\"checkbox\">\n    <label class=\"custom-control-label\" for=\"customCheck5\">Unchecked</label>\n  </div>\n  <div class=\"custom-control custom-control-alternative custom-checkbox mb-3\">\n    <input class=\"custom-control-input\" id=\"customCheck6\" type=\"checkbox\" checked=\"\">\n    <label class=\"custom-control-label\" for=\"customCheck6\">Checked</label>\n  </div>\n  <div class=\"custom-control custom-control-alternative custom-checkbox mb-3\">\n    <input class=\"custom-control-input\" id=\"customCheck7\" type=\"checkbox\" disabled=\"\">\n    <label class=\"custom-control-label\" for=\"customCheck7\">Disabled Unchecked</label>\n  </div>\n  <div class=\"custom-control custom-control-alternative custom-checkbox mb-3\">\n    <input class=\"custom-control-input\" id=\"customCheck8\" type=\"checkbox\" checked=\"\" disabled=\"\">\n    <label class=\"custom-control-label\" for=\"customCheck8\">Disabled Checked</label>\n  </div>";
        this.code6 = "<div class=\"custom-control custom-radio mb-3\">\n    <input name=\"custom-radio-2\" class=\"custom-control-input\" id=\"customRadio5\" type=\"radio\">\n    <label class=\"custom-control-label\" for=\"customRadio5\">Unchecked</label>\n  </div>\n  <div class=\"custom-control custom-radio mb-3\">\n    <input name=\"custom-radio-2\" class=\"custom-control-input\" id=\"customRadio6\" checked=\"\" type=\"radio\">\n    <label class=\"custom-control-label\" for=\"customRadio6\">Checked</label>\n  </div>\n  <div class=\"custom-control custom-radio mb-3\">\n    <input name=\"custom-radio-2\" class=\"custom-control-input\" id=\"customRadio7\" disabled=\"\" type=\"radio\">\n    <label class=\"custom-control-label\" for=\"customRadio7\">Disabled unchecked</label>\n  </div>\n  <div class=\"custom-control custom-radio mb-3\">\n    <input name=\"custom-radio-2\" class=\"custom-control-input\" id=\"customRadio8\" checked=\"\" disabled=\"\" type=\"radio\">\n    <label class=\"custom-control-label\" for=\"customRadio8\">Disabled checkbox</label>\n  </div>";
        this.code7 = "<div class=\"custom-control custom-control-alternative custom-radio mb-3\">\n    <input name=\"custom-radio-1\" class=\"custom-control-input\" id=\"customRadio1\" type=\"radio\">\n    <label class=\"custom-control-label\" for=\"customRadio1\">Unchecked</label>\n  </div>\n  <div class=\"custom-control custom-control-alternative custom-radio mb-3\">\n    <input name=\"custom-radio-1\" class=\"custom-control-input\" id=\"customRadio2\" checked=\"\" type=\"radio\">\n    <label class=\"custom-control-label\" for=\"customRadio2\">Checked</label>\n  </div>\n  <div class=\"custom-control custom-control-alternative custom-radio mb-3\">\n    <input name=\"custom-radio-1\" class=\"custom-control-input\" id=\"customRadio3\" disabled=\"\" type=\"radio\">\n    <label class=\"custom-control-label\" for=\"customRadio3\">Disabled unchecked</label>\n  </div>\n  <div class=\"custom-control custom-control-alternative custom-radio mb-3\">\n    <input name=\"custom-radio-1\" class=\"custom-control-input\" id=\"customRadio4\" checked=\"\" disabled=\"\" type=\"radio\">\n    <label class=\"custom-control-label\" for=\"customRadio4\">Disabled checkbox</label>\n  </div>";
        this.code8 = "<label class=\"custom-toggle\">\n    <input type=\"checkbox\">\n    <span class=\"custom-toggle-slider rounded-circle\"></span>\n  </label>\n  <span class=\"clearfix\"></span>\n  <label class=\"custom-toggle\">\n    <input type=\"checkbox\" checked=\"\">\n    <span class=\"custom-toggle-slider rounded-circle\"></span>\n  </label>";
        this.code9 = "<!-- Simple slider -->\n  <div class=\"input-slider-container\">\n    <div id=\"test\" class=\"input-slider\"></div>\n  </div>\n  <div class=\"mt-5\">\n    <!-- Range slider container -->\n    <div id=\"test2\"></div>\n  </div>";
        this.code10 = "import { Component, OnInit, AfterViewInit } from '@angular/core';\n  import noUiSlider from \"nouislider\";\n\n  @Component({\n    selector: 'app-forms',\n    templateUrl: './forms.component.html',\n    styleUrls: ['./forms.component.scss']\n  })\n  export class FormsComponent implements OnInit, AfterViewInit {\n\n    constructor() { }\n\n    ngOnInit() {\n\n    }\n    ngAfterViewInit(){\n      var slider = document.getElementById(\"test\");\n\n      noUiSlider.create(slider, {\n        start: 40,\n        connect: [true, false],\n        range: {\n          min: 0,\n          max: 100\n        }\n      });\n\n      var slider2 = document.getElementById(\"test2\");\n\n      noUiSlider.create(slider2, {\n        start: [20, 60],\n        connect: true,\n        range: {\n          min: 0,\n          max: 100\n        }\n      });\n    }\n  }\n";
    }
    FormsComponent.prototype.ngOnInit = function () {
    };
    FormsComponent.prototype.ngAfterViewInit = function () {
        var slider = document.getElementById("test");
        nouislider__WEBPACK_IMPORTED_MODULE_1___default.a.create(slider, {
            start: 40,
            connect: [true, false],
            range: {
                min: 0,
                max: 100
            }
        });
        var slider2 = document.getElementById("test2");
        nouislider__WEBPACK_IMPORTED_MODULE_1___default.a.create(slider2, {
            start: [20, 60],
            connect: true,
            range: {
                min: 0,
                max: 100
            }
        });
    };
    FormsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-forms',
            template: __webpack_require__(/*! ./forms.component.html */ "./src/app/documentation/forms/forms.component.html"),
            styles: [__webpack_require__(/*! ./forms.component.scss */ "./src/app/documentation/forms/forms.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], FormsComponent);
    return FormsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/grid/grid.component.html":
/*!********************************************************!*\
  !*** ./src/app/documentation/grid/grid.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Grid system</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Use our powerful mobile-first flexbox grid to build layouts of all shapes and sizes thanks to a twelve column system, five default responsive tiers, Sass variables and mixins, and dozens of predefined classes.</p>\n<hr>\n<h2 id=\"how-it-works\"><div>How it works<a class=\"anchorjs-link \" href=\"#how-it-works\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Bootstrap’s grid system uses a series of containers, rows, and columns to layout and align content. It’s built with <a href=\"https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox\">flexbox</a> and is fully responsive. Below is an example and an in-depth look at how the grid comes together.</p>\n<p><strong>New to or unfamiliar with flexbox?</strong> <a href=\"https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flexbox-background\">Read this CSS Tricks flexbox guide</a> for background, terminology, guidelines, and code snippets.</p>\n<div class=\"ct-example-row\">\n  <div class=\"ct-example\">\n    <ngb-tabset>\n      <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-component\" class=\"tab-pane tab-example-result fade show active\" role=\"tabpanel\" aria-labelledby=\"grid-component-tab\">\n            <div class=\"container\">\n              <div class=\"row\">\n                <div class=\"col-sm\">\n                  <span>One of three columns</span>\n                </div>\n                <div class=\"col-sm\">\n                  <span>One of three columns</span>\n                </div>\n                <div class=\"col-sm\">\n                  <span>One of three columns</span>\n                </div>\n              </div>\n            </div>\n          </div>\n        </ng-template>\n      </ngb-tab>\n      <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n            <pre><code [highlight]=\"code\"></code></pre>\n          </div>\n        </ng-template>\n      </ngb-tab>\n    </ngb-tabset>\n    </div>\n  </div>\n<p>The above example creates three equal-width columns on small, medium, large, and extra large devices using our predefined grid classes. Those columns are centered in the page with the parent <code class=\"highlighter-rouge\">.container</code>.</p>\n<h2 id=\"grid-options\"><div>Grid options<a class=\"anchorjs-link \" href=\"#grid-options\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>While Bootstrap uses <code class=\"highlighter-rouge\">em</code>s or <code class=\"highlighter-rouge\">rem</code>s for defining most sizes, <code class=\"highlighter-rouge\">px</code>s are used for grid breakpoints and container widths. This is because the viewport width is in pixels and does not change with the <a href=\"https://drafts.csswg.org/mediaqueries-3/#units\">font size</a>.</p>\n<p>See how aspects of the Bootstrap grid system work across multiple devices with a handy table.</p>\n<table class=\"table table-bordered table-striped\">\n  <thead>\n    <tr>\n      <th></th>\n      <th class=\"text-center\">\n        Extra small<br>\n        <small>&lt;576px</small>\n      </th>\n      <th class=\"text-center\">\n        Small<br>\n        <small>≥576px</small>\n      </th>\n      <th class=\"text-center\">\n        Medium<br>\n        <small>≥768px</small>\n      </th>\n      <th class=\"text-center\">\n        Large<br>\n        <small>≥992px</small>\n      </th>\n      <th class=\"text-center\">\n        Extra large<br>\n        <small>≥1200px</small>\n      </th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <th class=\"text-nowrap\" scope=\"row\">Max container width</th>\n      <td>None (auto)</td>\n      <td>540px</td>\n      <td>720px</td>\n      <td>960px</td>\n      <td>1140px</td>\n    </tr>\n    <tr>\n      <th class=\"text-nowrap\" scope=\"row\">Class prefix</th>\n      <td><code>.col-</code></td>\n      <td><code>.col-sm-</code></td>\n      <td><code>.col-md-</code></td>\n      <td><code>.col-lg-</code></td>\n      <td><code>.col-xl-</code></td>\n    </tr>\n    <tr>\n      <th class=\"text-nowrap\" scope=\"row\"># of columns</th>\n      <td colspan=\"5\">12</td>\n    </tr>\n    <tr>\n      <th class=\"text-nowrap\" scope=\"row\">Gutter width</th>\n      <td colspan=\"5\">30px (15px on each side of a column)</td>\n    </tr>\n    <tr>\n      <th class=\"text-nowrap\" scope=\"row\">Nestable</th>\n      <td colspan=\"5\">Yes</td>\n    </tr>\n    <tr>\n      <th class=\"text-nowrap\" scope=\"row\">Column ordering</th>\n      <td colspan=\"5\">Yes</td>\n    </tr>\n  </tbody>\n</table>\n<h2 id=\"auto-layout-columns\"><div>Auto-layout columns<a class=\"anchorjs-link \" href=\"#auto-layout-columns\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Utilize breakpoint-specific column classes for easy column sizing without an explicit numbered class like <code class=\"highlighter-rouge\">.col-sm-6</code>.</p>\n<h3 id=\"equal-width\"><div>Equal-width<a class=\"anchorjs-link \" href=\"#equal-width\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>For example, here are two grid layouts that apply to every device and viewport, from <code class=\"highlighter-rouge\">xs</code> to <code class=\"highlighter-rouge\">xl</code>. Add any number of unit-less classes for each breakpoint you need and every column will be the same width.</p>\n<div class=\"ct-example-row\">\n  <div class=\"ct-example\">\n    <ngb-tabset>\n      <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-equal-width-component\" class=\"tab-pane tab-example-result fade show active\" role=\"tabpanel\" aria-labelledby=\"grid-equal-width-component-tab\">\n            <div class=\"container\">\n              <div class=\"row\">\n                <div class=\"col\">\n                  <span>1 of 2</span>\n                </div>\n                <div class=\"col\">\n                  <span>2 of 2</span>\n                </div>\n              </div>\n              <div class=\"row\">\n                <div class=\"col\">\n                  <span>1 of 3</span>\n                </div>\n                <div class=\"col\">\n                  <span>2 of 3</span>\n                </div>\n                <div class=\"col\">\n                  <span>3 of 3</span>\n                </div>\n              </div>\n            </div>\n          </div>\n        </ng-template>\n      </ngb-tab>\n      <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n            <pre><code [highlight]=\"code1\"></code></pre>\n          </div>\n        </ng-template>\n      </ngb-tab>\n    </ngb-tabset>\n  </div>\n</div>\n<p>Equal-width columns can be broken into multiple lines, but there was a <a href=\"https://github.com/philipwalton/flexbugs#flexbug-11\">Safari flexbox bug</a> that prevented this from working without an explicit <code class=\"highlighter-rouge\">flex-basis</code> or <code class=\"highlighter-rouge\">border</code>. There are workarounds for older browser versions, but they shouldn’t be necessary if you’re up-to-date.</p>\n<div class=\"ct-example-row\">\n  <div class=\"ct-example\">\n    <ngb-tabset>\n      <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-equal-width-broken-component\" class=\"tab-pane tab-example-result fade show active\" role=\"tabpanel\" aria-labelledby=\"grid-equal-width-broken-component-tab\">\n            <div class=\"container\">\n              <div class=\"row\">\n                <div class=\"col\"><span>Column</span></div>\n                <div class=\"col\"><span>Column</span></div>\n                <div class=\"w-100\"></div>\n                <div class=\"col\"><span>Column</span></div>\n                <div class=\"col\"><span>Column</span></div>\n              </div>\n            </div>\n          </div>\n        </ng-template>\n      </ngb-tab>\n      <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n            <pre><code [highlight]=\"code2\"></code></pre>\n          </div>\n        </ng-template>\n      </ngb-tab>\n    </ngb-tabset>\n  </div>\n</div>\n<h3 id=\"setting-one-column-width\"><div>Setting one column width<a class=\"anchorjs-link \" href=\"#setting-one-column-width\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Auto-layout for flexbox grid columns also means you can set the width of one column and have the sibling columns automatically resize around it. You may use predefined grid classes (as shown below), grid mixins, or inline widths. Note that the other columns will resize no matter the width of the center column.</p>\n<div class=\"ct-example-row\">\n  <div class=\"ct-example\">\n    <ngb-tabset>\n      <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-one-col-width-component\" class=\"tab-pane tab-example-result fade show active\" role=\"tabpanel\" aria-labelledby=\"grid-one-col-width-component-tab\">\n            <div class=\"container\">\n              <div class=\"row\">\n                <div class=\"col\">\n                  <span>1 of 3</span>\n                </div>\n                <div class=\"col-6\">\n                  <span>2 of 3 (wider)</span>\n                </div>\n                <div class=\"col\">\n                  <span>3 of 3</span>\n                </div>\n              </div>\n              <div class=\"row\">\n                <div class=\"col\">\n                  <span>1 of 3</span>\n                </div>\n                <div class=\"col-5\">\n                  <span>2 of 3 (wider)</span>\n                </div>\n                <div class=\"col\">\n                  <span>3 of 3</span>\n                </div>\n              </div>\n            </div>\n          </div>\n        </ng-template>\n      </ngb-tab>\n      <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n            <pre><code [highlight]=\"code3\"></code></pre>\n          </div>\n        </ng-template>\n      </ngb-tab>\n    </ngb-tabset>\n  </div>\n</div>\n<h3 id=\"variable-width-content\"><div>Variable width content<a class=\"anchorjs-link \" href=\"#variable-width-content\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Use <code class=\"highlighter-rouge\">col-{{\"{\"}}breakpoint{{\"}\"}}-auto</code> classes to size columns based on the natural width of their content.</p>\n<div class=\"ct-example-row\">\n  <div class=\"ct-example\">\n    <ngb-tabset>\n      <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-variable-width-component\" class=\"tab-pane tab-example-result fade show active\" role=\"tabpanel\" aria-labelledby=\"grid-variable-width-component-tab\">\n            <div class=\"container\">\n              <div class=\"row justify-content-md-center\">\n                <div class=\"col col-lg-2\">\n                  <span>1 of 3</span>\n                </div>\n                <div class=\"col-md-auto\">\n                  <span>Variable width content</span>\n                </div>\n                <div class=\"col col-lg-2\">\n                  <span>3 of 3</span>\n                </div>\n              </div>\n              <div class=\"row\">\n                <div class=\"col\">\n                  <span>1 of 3</span>\n                </div>\n                <div class=\"col-md-auto\">\n                  <span>Variable width content</span>\n                </div>\n                <div class=\"col col-lg-2\">\n                  <span>3 of 3</span>\n                </div>\n              </div>\n            </div>\n          </div>\n        </ng-template>\n      </ngb-tab>\n      <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n            <pre><code [highlight]=\"code4\"></code></pre>\n          </div>\n        </ng-template>\n      </ngb-tab>\n    </ngb-tabset>\n  </div>\n</div>\n<h3 id=\"equal-width-multi-row\"><div>Equal-width multi-row<a class=\"anchorjs-link \" href=\"#equal-width-multi-row\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Create equal-width columns that span multiple rows by inserting a <code class=\"highlighter-rouge\">.w-100</code> where you want the columns to break to a new line. Make the breaks responsive by mixing the <code class=\"highlighter-rouge\">.w-100</code> with some <a href=\"argon-dashboard/docs//utilities/display/\">responsive display utilities</a>.</p>\n<div class=\"ct-example-row\">\n  <div class=\"ct-example\">\n    <ngb-tabset>\n      <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-equal-multirow-component\" class=\"tab-pane tab-example-result fade show active\" role=\"tabpanel\" aria-labelledby=\"grid-equal-multirow-component-tab\">\n            <div class=\"row\">\n              <div class=\"col\"><span>col</span></div>\n              <div class=\"col\"><span>col</span></div>\n              <div class=\"w-100\"></div>\n              <div class=\"col\"><span>col</span></div>\n              <div class=\"col\"><span>col</span></div>\n            </div>\n          </div>\n        </ng-template>\n      </ngb-tab>\n      <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n            <pre><code [highlight]=\"code5\"></code></pre>\n          </div>\n        </ng-template>\n      </ngb-tab>\n    </ngb-tabset>\n\n\n  </div>\n</div>\n<h2 id=\"responsive-classes\"><div>Responsive classes<a class=\"anchorjs-link \" href=\"#responsive-classes\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Bootstrap’s grid includes five tiers of predefined classes for building complex responsive layouts. Customize the size of your columns on extra small, small, medium, large, or extra large devices however you see fit.</p>\n<h3 id=\"all-breakpoints\"><div>All breakpoints<a class=\"anchorjs-link \" href=\"#all-breakpoints\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>For grids that are the same from the smallest of devices to the largest, use the <code class=\"highlighter-rouge\">.col</code> and <code class=\"highlighter-rouge\">.col-*</code> classes. Specify a numbered class when you need a particularly sized column; otherwise, feel free to stick to <code class=\"highlighter-rouge\">.col</code>.</p>\n<div class=\"ct-example-row\">\n  <div class=\"ct-example\">\n    <ngb-tabset>\n      <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-all-breakpoints-component\" class=\"tab-pane tab-example-result fade show active\" role=\"tabpanel\" aria-labelledby=\"grid-all-breakpoints-component-tab\">\n            <div class=\"row\">\n              <div class=\"col\"><span>col</span></div>\n              <div class=\"col\"><span>col</span></div>\n              <div class=\"col\"><span>col</span></div>\n              <div class=\"col\"><span>col</span></div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-8\"><span>col-8</span></div>\n              <div class=\"col-4\"><span>col-4</span></div>\n            </div>\n          </div>\n        </ng-template>\n      </ngb-tab>\n      <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n            <pre><code [highlight]=\"code6\"></code></pre>\n          </div>\n        </ng-template>\n      </ngb-tab>\n    </ngb-tabset>\n\n  </div>\n</div>\n<h3 id=\"stacked-to-horizontal\"><div>Stacked to horizontal<a class=\"anchorjs-link \" href=\"#stacked-to-horizontal\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Using a single set of <code class=\"highlighter-rouge\">.col-sm-*</code> classes, you can create a basic grid system that starts out stacked and becomes horizontal at the small breakpoint (<code class=\"highlighter-rouge\">sm</code>).</p>\n<div class=\"ct-example-row\">\n  <div class=\"ct-example\">\n    <ngb-tabset>\n      <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-stacked-horizontal-component\" class=\"tab-pane tab-example-result fade show active\" role=\"tabpanel\" aria-labelledby=\"grid-stacked-horizontal-component-tab\">\n            <div class=\"row\">\n              <div class=\"col-sm-8\"><span>col-sm-8</span></div>\n              <div class=\"col-sm-4\"><span>col-sm-4</span></div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-sm\"><span>col-sm</span></div>\n              <div class=\"col-sm\"><span>col-sm</span></div>\n              <div class=\"col-sm\"><span>col-sm</span></div>\n            </div>\n          </div>\n        </ng-template>\n      </ngb-tab>\n      <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n            <pre><code [highlight]=\"code7\"></code></pre>\n          </div>\n        </ng-template>\n      </ngb-tab>\n    </ngb-tabset>\n  </div>\n</div>\n<h3 id=\"mix-and-match\"><div>Mix and match<a class=\"anchorjs-link \" href=\"#mix-and-match\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Don’t want your columns to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the example below for a better idea of how it all works.</p>\n<div class=\"ct-example-row\">\n  <div class=\"ct-example\">\n    <ngb-tabset>\n      <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-mix-match-component\" class=\"tab-pane tab-example-result fade show active\" role=\"tabpanel\" aria-labelledby=\"grid-mix-match-component-tab\">\n            <!-- Stack the columns on mobile by making one full-width and the other half-width -->\n            <div class=\"row\">\n              <div class=\"col-12 col-md-8\"><span>.col-12 .col-md-8</span></div>\n              <div class=\"col-6 col-md-4\"><span>.col-6 .col-md-4</span></div>\n            </div>\n            <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->\n            <div class=\"row\">\n              <div class=\"col-6 col-md-4\"><span>.col-6 .col-md-4</span></div>\n              <div class=\"col-6 col-md-4\"><span>.col-6 .col-md-4</span></div>\n              <div class=\"col-6 col-md-4\"><span>.col-6 .col-md-4</span></div>\n            </div>\n            <!-- Columns are always 50% wide, on mobile and desktop -->\n            <div class=\"row\">\n              <div class=\"col-6\"><span>.col-6</span></div>\n              <div class=\"col-6\"><span>.col-6</span></div>\n            </div>\n          </div>\n        </ng-template>\n      </ngb-tab>\n      <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n        <ng-template ngbTabContent>\n          <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n            <pre><code [highlight]=\"code8\"></code></pre>\n          </div>\n        </ng-template>\n      </ngb-tab>\n    </ngb-tabset>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/grid/grid.component.scss":
/*!********************************************************!*\
  !*** ./src/app/documentation/grid/grid.component.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vZ3JpZC9ncmlkLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/documentation/grid/grid.component.ts":
/*!******************************************************!*\
  !*** ./src/app/documentation/grid/grid.component.ts ***!
  \******************************************************/
/*! exports provided: GridComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GridComponent", function() { return GridComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var GridComponent = /** @class */ (function () {
    function GridComponent() {
        this.code = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm\">\n      <span>One of three columns</span>\n    </div>\n    <div class=\"col-sm\">\n      <span>One of three columns</span>\n    </div>\n    <div class=\"col-sm\">\n      <span>One of three columns</span>\n    </div>\n  </div>\n</div>";
        this.code1 = "<div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <span>1 of 2</span>\n      </div>\n      <div class=\"col\">\n        <span>2 of 2</span>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col\">\n        <span>1 of 3</span>\n      </div>\n      <div class=\"col\">\n        <span>2 of 3</span>\n      </div>\n      <div class=\"col\">\n        <span>3 of 3</span>\n      </div>\n    </div>\n  </div>";
        this.code2 = "<div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col\"><span>Column</span></div>\n      <div class=\"col\"><span>Column</span></div>\n      <div class=\"w-100\"></div>\n      <div class=\"col\"><span>Column</span></div>\n      <div class=\"col\"><span>Column</span></div>\n    </div>\n  </div>";
        this.code3 = "<div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <span>1 of 3</span>\n      </div>\n      <div class=\"col-6\">\n        <span>2 of 3 (wider)</span>\n      </div>\n      <div class=\"col\">\n        <span>3 of 3</span>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col\">\n        <span>1 of 3</span>\n      </div>\n      <div class=\"col-5\">\n        <span>2 of 3 (wider)</span>\n      </div>\n      <div class=\"col\">\n        <span>3 of 3</span>\n      </div>\n    </div>\n  </div>";
        this.code4 = "<div class=\"container\">\n    <div class=\"row justify-content-md-center\">\n      <div class=\"col col-lg-2\">\n        <span>1 of 3</span>\n      </div>\n      <div class=\"col-md-auto\">\n        <span>Variable width content</span>\n      </div>\n      <div class=\"col col-lg-2\">\n        <span>3 of 3</span>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col\">\n        <span>1 of 3</span>\n      </div>\n      <div class=\"col-md-auto\">\n        <span>Variable width content</span>\n      </div>\n      <div class=\"col col-lg-2\">\n        <span>3 of 3</span>\n      </div>\n    </div>\n  </div>";
        this.code5 = "<div class=\"row\">\n    <div class=\"col\"><span>col</span></div>\n    <div class=\"col\"><span>col</span></div>\n    <div class=\"w-100\"></div>\n    <div class=\"col\"><span>col</span></div>\n    <div class=\"col\"><span>col</span></div>\n  </div>";
        this.code6 = "<div class=\"row\">\n    <div class=\"col\"><span>col</span></div>\n    <div class=\"col\"><span>col</span></div>\n    <div class=\"col\"><span>col</span></div>\n    <div class=\"col\"><span>col</span></div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-8\"><span>col-8</span></div>\n    <div class=\"col-4\"><span>col-4</span></div>\n  </div>";
        this.code7 = "<div class=\"row\">\n    <div class=\"col-sm-8\"><span>col-sm-8</span></div>\n    <div class=\"col-sm-4\"><span>col-sm-4</span></div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-sm\"><span>col-sm</span></div>\n    <div class=\"col-sm\"><span>col-sm</span></div>\n    <div class=\"col-sm\"><span>col-sm</span></div>\n  </div>";
        this.code8 = "<!-- Stack the columns on mobile by making one full-width and the other half-width -->\n  <div class=\"row\">\n    <div class=\"col-12 col-md-8\"><span>.col-12 .col-md-8</span></div>\n    <div class=\"col-6 col-md-4\"><span>.col-6 .col-md-4</span></div>\n  </div>\n  <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->\n  <div class=\"row\">\n    <div class=\"col-6 col-md-4\"><span>.col-6 .col-md-4</span></div>\n    <div class=\"col-6 col-md-4\"><span>.col-6 .col-md-4</span></div>\n    <div class=\"col-6 col-md-4\"><span>.col-6 .col-md-4</span></div>\n  </div>\n  <!-- Columns are always 50% wide, on mobile and desktop -->\n  <div class=\"row\">\n    <div class=\"col-6\"><span>.col-6</span></div>\n    <div class=\"col-6\"><span>.col-6</span></div>\n  </div>";
    }
    GridComponent.prototype.ngOnInit = function () {
    };
    GridComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-grid',
            template: __webpack_require__(/*! ./grid.component.html */ "./src/app/documentation/grid/grid.component.html"),
            styles: [__webpack_require__(/*! ./grid.component.scss */ "./src/app/documentation/grid/grid.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], GridComponent);
    return GridComponent;
}());



/***/ }),

/***/ "./src/app/documentation/icons/icons.component.html":
/*!**********************************************************!*\
  !*** ./src/app/documentation/icons/icons.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Icons</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Get started with Bootstrap, the world’s most popular framework for building responsive, mobile-first sites, with BootstrapCDN and a template starter page.</p>\n<hr>\n<h2 id=\"nucleo\"><div>Nucleo<a class=\"anchorjs-link \" href=\"#nucleo\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Argon comes with 100 custom icons made by our friends from Nucleo App. The official package contains over 25000 icons which are looking great in combination with Argon. Make sure you check all of them and use those that you like the most.</p>\n<h3 id=\"usage\"><div>Usage<a class=\"anchorjs-link \" href=\"#usage\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>In order to use this icons on your page you will need to include the following script in the <code class=\"highlighter-rouge\">&lt;head&gt;</code> section of your page before the theme’s main style:</p>\n<figure class=\"highlight\"><pre class=\" language-html\"><code class=\" language-html\" data-lang=\"html\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>link</span> <span class=\"token attr-name\">href</span><span class=\"token attr-value\"><span class=\"token punctuation\">=</span><span class=\"token punctuation\">\"</span>/assets/vendor/nucleo/css/nucleo.css<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">rel</span><span class=\"token attr-value\"><span class=\"token punctuation\">=</span><span class=\"token punctuation\">\"</span>stylesheet<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">&gt;</span></span></code></pre>\n</figure>\n<h3 id=\"initialization\"><div>Initialization<a class=\"anchorjs-link \" href=\"#initialization\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Start placing icons in your HTML’s <code class=\"highlighter-rouge\">&lt;body&gt;</code>. We recommend using a consistent HTML element, like <code class=\"highlighter-rouge\">&lt;i&gt;</code>. Find the right icon and learn how to reference it in your markup.</p>\n<p>You need to know two bits of information to reference an icon:</p>\n<ol>\n  <li>its name, prefixed with ni- and</li>\n  <li>the style you want to use’s corresponding prefix.</li>\n</ol>\n<figure class=\"highlight\"><pre class=\" language-html\"><code class=\" language-html\" data-lang=\"html\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>i</span> <span class=\"token attr-name\">class</span><span class=\"token attr-value\"><span class=\"token punctuation\">=</span><span class=\"token punctuation\">\"</span>ni ni-air-baloon<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>i</span><span class=\"token punctuation\">&gt;</span></span></code></pre>\n</figure>\n<h3 id=\"icons\"><div>Icons<a class=\"anchorjs-link \" href=\"#icons\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<div class=\"row icon-examples mb-4\">\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'active-40'\">\n      <div>\n        <i class=\"ni ni-active-40\"></i>\n        <span>active-40</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'air-baloon'\">\n      <div>\n        <i class=\"ni ni-air-baloon\"></i>\n        <span>air-baloon</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'album-2'\">\n      <div>\n        <i class=\"ni ni-album-2\"></i>\n        <span>album-2</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'align-center'\">\n      <div>\n        <i class=\"ni ni-align-center\"></i>\n        <span>align-center</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'align-left-2'\">\n      <div>\n        <i class=\"ni ni-align-left-2\"></i>\n        <span>align-left-2</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'ambulance'\">\n      <div>\n        <i class=\"ni ni-ambulance\"></i>\n        <span>ambulance</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'app'\">\n      <div>\n        <i class=\"ni ni-app\"></i>\n        <span>app</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'archive-2'\">\n      <div>\n        <i class=\"ni ni-archive-2\"></i>\n        <span>archive-2</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'atom'\">\n      <div>\n        <i class=\"ni ni-atom\"></i>\n        <span>atom</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'badge'\">\n      <div>\n        <i class=\"ni ni-badge\"></i>\n        <span>badge</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'bag-17'\">\n      <div>\n        <i class=\"ni ni-bag-17\"></i>\n        <span>bag-17</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'basket'\">\n      <div>\n        <i class=\"ni ni-basket\"></i>\n        <span>basket</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'bell-55'\">\n      <div>\n        <i class=\"ni ni-bell-55\"></i>\n        <span>bell-55</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'bold-down'\">\n      <div>\n        <i class=\"ni ni-bold-down\"></i>\n        <span>bold-down</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'bold-left'\">\n      <div>\n        <i class=\"ni ni-bold-left\"></i>\n        <span>bold-left</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'bold-right'\">\n      <div>\n        <i class=\"ni ni-bold-right\"></i>\n        <span>bold-right</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'bold-up'\">\n      <div>\n        <i class=\"ni ni-bold-up\"></i>\n        <span>bold-up</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'bold'\">\n      <div>\n        <i class=\"ni ni-bold\"></i>\n        <span>bold</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'book-bookmark'\">\n      <div>\n        <i class=\"ni ni-book-bookmark\"></i>\n        <span>book-bookmark</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'books'\">\n      <div>\n        <i class=\"ni ni-books\"></i>\n        <span>books</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'box-2'\">\n      <div>\n        <i class=\"ni ni-box-2\"></i>\n        <span>box-2</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'briefcase-24'\">\n      <div>\n        <i class=\"ni ni-briefcase-24\"></i>\n        <span>briefcase-24</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'building'\">\n      <div>\n        <i class=\"ni ni-building\"></i>\n        <span>building</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'bulb-61'\">\n      <div>\n        <i class=\"ni ni-bulb-61\"></i>\n        <span>bulb-61</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'bullet-list-67'\">\n      <div>\n        <i class=\"ni ni-bullet-list-67\"></i>\n        <span>bullet-list-67</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'bus-front-12'\">\n      <div>\n        <i class=\"ni ni-bus-front-12\"></i>\n        <span>bus-front-12</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'button-pause'\">\n      <div>\n        <i class=\"ni ni-button-pause\"></i>\n        <span>button-pause</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'button-play'\">\n      <div>\n        <i class=\"ni ni-button-play\"></i>\n        <span>button-play</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'button-power'\">\n      <div>\n        <i class=\"ni ni-button-power\"></i>\n        <span>button-power</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'calendar-grid-58'\">\n      <div>\n        <i class=\"ni ni-calendar-grid-58\"></i>\n        <span>calendar-grid-58</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'camera-compact'\">\n      <div>\n        <i class=\"ni ni-camera-compact\"></i>\n        <span>camera-compact</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'caps-small'\">\n      <div>\n        <i class=\"ni ni-caps-small\"></i>\n        <span>caps-small</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'cart'\">\n      <div>\n        <i class=\"ni ni-cart\"></i>\n        <span>cart</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'chart-bar-32'\">\n      <div>\n        <i class=\"ni ni-chart-bar-32\"></i>\n        <span>chart-bar-32</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'chart-pie-35'\">\n      <div>\n        <i class=\"ni ni-chart-pie-35\"></i>\n        <span>chart-pie-35</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'chat-round'\">\n      <div>\n        <i class=\"ni ni-chat-round\"></i>\n        <span>chat-round</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'check-bold'\">\n      <div>\n        <i class=\"ni ni-check-bold\"></i>\n        <span>check-bold</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'circle-08'\">\n      <div>\n        <i class=\"ni ni-circle-08\"></i>\n        <span>circle-08</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'cloud-download-95'\">\n      <div>\n        <i class=\"ni ni-cloud-download-95\"></i>\n        <span>cloud-download-95</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'cloud-upload-96'\">\n      <div>\n        <i class=\"ni ni-cloud-upload-96\"></i>\n        <span>cloud-upload-96</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'compass-04'\">\n      <div>\n        <i class=\"ni ni-compass-04\"></i>\n        <span>compass-04</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'controller'\">\n      <div>\n        <i class=\"ni ni-controller\"></i>\n        <span>controller</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'credit-card'\">\n      <div>\n        <i class=\"ni ni-credit-card\"></i>\n        <span>credit-card</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'curved-next'\">\n      <div>\n        <i class=\"ni ni-curved-next\"></i>\n        <span>curved-next</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'delivery-fast'\">\n      <div>\n        <i class=\"ni ni-delivery-fast\"></i>\n        <span>delivery-fast</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'diamond'\">\n      <div>\n        <i class=\"ni ni-diamond\"></i>\n        <span>diamond</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'email-83'\">\n      <div>\n        <i class=\"ni ni-email-83\"></i>\n        <span>email-83</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'fat-add'\">\n      <div>\n        <i class=\"ni ni-fat-add\"></i>\n        <span>fat-add</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'fat-delete'\">\n      <div>\n        <i class=\"ni ni-fat-delete\"></i>\n        <span>fat-delete</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'fat-remove'\">\n      <div>\n        <i class=\"ni ni-fat-remove\"></i>\n        <span>fat-remove</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'favourite-28'\">\n      <div>\n        <i class=\"ni ni-favourite-28\"></i>\n        <span>favourite-28</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'folder-17'\">\n      <div>\n        <i class=\"ni ni-folder-17\"></i>\n        <span>folder-17</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'glasses-2'\">\n      <div>\n        <i class=\"ni ni-glasses-2\"></i>\n        <span>glasses-2</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'hat-3'\">\n      <div>\n        <i class=\"ni ni-hat-3\"></i>\n        <span>hat-3</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'headphones'\">\n      <div>\n        <i class=\"ni ni-headphones\"></i>\n        <span>headphones</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'html5'\">\n      <div>\n        <i class=\"ni ni-html5\"></i>\n        <span>html5</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'istanbul'\">\n      <div>\n        <i class=\"ni ni-istanbul\"></i>\n        <span>istanbul</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'circle-08'\">\n      <div>\n        <i class=\"ni ni-circle-08\"></i>\n        <span>circle-08</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'key-25'\">\n      <div>\n        <i class=\"ni ni-key-25\"></i>\n        <span>key-25</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'laptop'\">\n      <div>\n        <i class=\"ni ni-laptop\"></i>\n        <span>laptop</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'like-2'\">\n      <div>\n        <i class=\"ni ni-like-2\"></i>\n        <span>like-2</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'lock-circle-open'\">\n      <div>\n        <i class=\"ni ni-lock-circle-open\"></i>\n        <span>lock-circle-open</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'map-big'\">\n      <div>\n        <i class=\"ni ni-map-big\"></i>\n        <span>map-big</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'mobile-button'\">\n      <div>\n        <i class=\"ni ni-mobile-button\"></i>\n        <span>mobile-button</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'money-coins'\">\n      <div>\n        <i class=\"ni ni-money-coins\"></i>\n        <span>money-coins</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'note-03'\">\n      <div>\n        <i class=\"ni ni-note-03\"></i>\n        <span>note-03</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'notification-70'\">\n      <div>\n        <i class=\"ni ni-notification-70\"></i>\n        <span>notification-70</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'palette'\">\n      <div>\n        <i class=\"ni ni-palette\"></i>\n        <span>palette</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'paper-diploma'\">\n      <div>\n        <i class=\"ni ni-paper-diploma\"></i>\n        <span>paper-diploma</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'pin-3'\">\n      <div>\n        <i class=\"ni ni-pin-3\"></i>\n        <span>pin-3</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'planet'\">\n      <div>\n        <i class=\"ni ni-planet\"></i>\n        <span>planet</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'ruler-pencil'\">\n      <div>\n        <i class=\"ni ni-ruler-pencil\"></i>\n        <span>ruler-pencil</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'satisfied'\">\n      <div>\n        <i class=\"ni ni-satisfied\"></i>\n        <span>satisfied</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'scissors'\">\n      <div>\n        <i class=\"ni ni-scissors\"></i>\n        <span>scissors</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'send'\">\n      <div>\n        <i class=\"ni ni-send\"></i>\n        <span>send</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'settings-gear-65'\">\n      <div>\n        <i class=\"ni ni-settings-gear-65\"></i>\n        <span>settings-gear-65</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'settings'\">\n      <div>\n        <i class=\"ni ni-settings\"></i>\n        <span>settings</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'single-02'\">\n      <div>\n        <i class=\"ni ni-single-02\"></i>\n        <span>single-02</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'single-copy-04'\">\n      <div>\n        <i class=\"ni ni-single-copy-04\"></i>\n        <span>single-copy-04</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'sound-wave'\">\n      <div>\n        <i class=\"ni ni-sound-wave\"></i>\n        <span>sound-wave</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'spaceship'\">\n      <div>\n        <i class=\"ni ni-spaceship\"></i>\n        <span>spaceship</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'square-pin'\">\n      <div>\n        <i class=\"ni ni-square-pin\"></i>\n        <span>square-pin</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'support-16'\">\n      <div>\n        <i class=\"ni ni-support-16\"></i>\n        <span>support-16</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'tablet-button'\">\n      <div>\n        <i class=\"ni ni-tablet-button\"></i>\n        <span>tablet-button</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'tag'\">\n      <div>\n        <i class=\"ni ni-tag\"></i>\n        <span>tag</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'tie-bow'\">\n      <div>\n        <i class=\"ni ni-tie-bow\"></i>\n        <span>tie-bow</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'time-alarm'\">\n      <div>\n        <i class=\"ni ni-time-alarm\"></i>\n        <span>time-alarm</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'trophy'\">\n      <div>\n        <i class=\"ni ni-trophy\"></i>\n        <span>trophy</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'tv-2'\">\n      <div>\n        <i class=\"ni ni-tv-2\"></i>\n        <span>tv-2</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'umbrella-13'\">\n      <div>\n        <i class=\"ni ni-umbrella-13\"></i>\n        <span>umbrella-13</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'user-run'\">\n      <div>\n        <i class=\"ni ni-user-run\"></i>\n        <span>user-run</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'vector'\">\n      <div>\n        <i class=\"ni ni-vector\"></i>\n        <span>vector</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'watch-time'\">\n      <div>\n        <i class=\"ni ni-watch-time\"></i>\n        <span>watch-time</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'world'\">\n      <div>\n        <i class=\"ni ni-world\"></i>\n        <span>world</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'zoom-split-in'\">\n      <div>\n        <i class=\"ni ni-zoom-split-in\"></i>\n        <span>zoom-split-in</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'collection'\">\n      <div>\n        <i class=\"ni ni-collection\"></i>\n        <span>collection</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'image'\">\n      <div>\n        <i class=\"ni ni-image\"></i>\n        <span>image</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'shop'\">\n      <div>\n        <i class=\"ni ni-shop\"></i>\n        <span>shop</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'ungroup'\">\n      <div>\n        <i class=\"ni ni-ungroup\"></i>\n        <span>ungroup</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'world-2'\">\n      <div>\n        <i class=\"ni ni-world-2\"></i>\n        <span>world-2</span>\n      </div>\n    </button>\n  </div>\n  <div class=\"col-lg-3 col-md-6\">\n    <button type=\"button\" placement=\"top-center\" ngbPopover=\"Copied!\" ngbTooltip=\"Copy to clipboard\"  class=\"btn-icon-clipboard\" ngxClipboard [cbContent]=\"'ui-04'\">\n      <div>\n        <i class=\"ni ni-ui-04\"></i>\n        <span>ui-04</span>\n      </div>\n    </button>\n  </div>\n</div>\n<p>Want more icons? Increase your collection by choosing more icon examples from Nucleo App website:\n  <a href=\"https://nucleoapp.com/?ref=1712\" target=\"_blank\" class=\"btn btn-primary mt-4\">Go to Nucleo App</a></p>\n<h2 id=\"font-awesome-5\"><div>Font Awesome 5<a class=\"anchorjs-link \" href=\"#font-awesome-5\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Optionally, Argon comes with Font Awesome which means 3000+ more vector icons made for you to use.</p>\n<h3 id=\"usage-1\"><div>Usage<a class=\"anchorjs-link \" href=\"#usage-1\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>In order to use this icons on your page you will need to include the following script in the <code class=\"highlighter-rouge\">&lt;head&gt;</code> section of your page before the theme’s main style:</p>\n<figure class=\"highlight\"><pre class=\" language-html\"><code class=\" language-html\" data-lang=\"html\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>link</span> <span class=\"token attr-name\">href</span><span class=\"token attr-value\"><span class=\"token punctuation\">=</span><span class=\"token punctuation\">\"</span>/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">rel</span><span class=\"token attr-value\"><span class=\"token punctuation\">=</span><span class=\"token punctuation\">\"</span>stylesheet<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">&gt;</span></span></code></pre>\n</figure>\n<h3 id=\"initialization-1\"><div>Initialization<a class=\"anchorjs-link \" href=\"#initialization-1\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Start placing icons in your HTML’s <code class=\"highlighter-rouge\">&lt;body&gt;</code>. We recommend using a consistent HTML element, like <code class=\"highlighter-rouge\">&lt;i&gt;</code>. Find the right icon and learn how to reference it in your markup.</p>\n<p>You need to know two bits of information to reference an icon:</p>\n<ol>\n  <li>its name, prefixed with fa- and</li>\n  <li>the style you want to use’s corresponding prefix.</li>\n</ol>\n<figure class=\"highlight\"><pre class=\" language-html\"><code class=\" language-html\" data-lang=\"html\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>i</span> <span class=\"token attr-name\">class</span><span class=\"token attr-value\"><span class=\"token punctuation\">=</span><span class=\"token punctuation\">\"</span>fas fa-heart<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>i</span><span class=\"token punctuation\">&gt;</span></span></code></pre>\n</figure>\n<h3 id=\"icons-1\"><div>Icons<a class=\"anchorjs-link \" href=\"#icons-1\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Get the icon you need on the official website:</p>\n<p><a href=\"https://fontawesome.com/\" target=\"_blank\" class=\"btn btn-primary\"> Go to Font Awesome</a></p>\n"

/***/ }),

/***/ "./src/app/documentation/icons/icons.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/documentation/icons/icons.component.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vaWNvbnMvaWNvbnMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/documentation/icons/icons.component.ts":
/*!********************************************************!*\
  !*** ./src/app/documentation/icons/icons.component.ts ***!
  \********************************************************/
/*! exports provided: IconsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IconsComponent", function() { return IconsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var IconsComponent = /** @class */ (function () {
    function IconsComponent() {
    }
    IconsComponent.prototype.ngOnInit = function () {
    };
    IconsComponent.prototype.onClick = function (event) {
        var target = event.target;
        target.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
        var ok = target.getAttribute('data-clipboard-text');
        console.log(ok);
        this.copy = ok;
    };
    IconsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-icons',
            template: __webpack_require__(/*! ./icons.component.html */ "./src/app/documentation/icons/icons.component.html"),
            styles: [__webpack_require__(/*! ./icons.component.scss */ "./src/app/documentation/icons/icons.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], IconsComponent);
    return IconsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/license/license.component.html":
/*!**************************************************************!*\
  !*** ./src/app/documentation/license/license.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">License</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Get started with Bootstrap, the world’s most popular framework for building responsive, mobile-first sites, with BootstrapCDN and a template starter page.</p>\n<hr>\n<p>MIT License</p>\n<p>Copyright (c) 2018 <a href=\"https://www.creative-tim.com\">Creative Tim</a></p>\n<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>\n<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>\n<p>THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>\n"

/***/ }),

/***/ "./src/app/documentation/license/license.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/documentation/license/license.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vbGljZW5zZS9saWNlbnNlLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/documentation/license/license.component.ts":
/*!************************************************************!*\
  !*** ./src/app/documentation/license/license.component.ts ***!
  \************************************************************/
/*! exports provided: LicenseComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LicenseComponent", function() { return LicenseComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LicenseComponent = /** @class */ (function () {
    function LicenseComponent() {
    }
    LicenseComponent.prototype.ngOnInit = function () {
    };
    LicenseComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-license',
            template: __webpack_require__(/*! ./license.component.html */ "./src/app/documentation/license/license.component.html"),
            styles: [__webpack_require__(/*! ./license.component.scss */ "./src/app/documentation/license/license.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], LicenseComponent);
    return LicenseComponent;
}());



/***/ }),

/***/ "./src/app/documentation/maps/maps.component.html":
/*!********************************************************!*\
  !*** ./src/app/documentation/maps/maps.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Maps</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Our map component uses the Google Maps API and it comes with a custom interface that matches the theme’s colors</p>\n<hr>\n<h2 id=\"example\">Example</h2>\n<div class=\"ct-example\">\n  <div id=\"map-canvas\" class=\"map-canvas\" data-lat=\"40.748817\" data-lng=\"-73.985428\" style=\"height: 600px;\"></div>\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid3\" title=\"Typescript\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code1\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"usage\">Usage</h2>\n<p>In order to use this plugin on your page you will need to include the following script in the “Optional JS” area from the page’s footer:</p>\n<figure class=\"highlight\"><pre><code class=\"language-html\" data-lang=\"html\"><span class=\"nt\">&lt;script </span><span class=\"na\">src=</span><span class=\"s\">\"https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY\"</span><span class=\"nt\">&gt;&lt;/script&gt;</span></code></pre>\n</figure>\n<h3 id=\"get-your-api-key\">Get your API key</h3>\n<p>In order to get your Google Maps API key navigate to the following page:\n  <a href=\"https://developers.google.com/maps/documentation/javascript/get-api-key\">Google Maps</a></p>\n<h3 id=\"initialization\">Initialization</h3>\n<p>Simply copy one of the code examples demonstrated above and include it in your page. Afterwards, you can modify the lat and long in the <code class=\"highlighter-rouge\">data-lat</code> and <code class=\"highlighter-rouge\">data-lng</code> attributes from the</p>\n"

/***/ }),

/***/ "./src/app/documentation/maps/maps.component.scss":
/*!********************************************************!*\
  !*** ./src/app/documentation/maps/maps.component.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vbWFwcy9tYXBzLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/documentation/maps/maps.component.ts":
/*!******************************************************!*\
  !*** ./src/app/documentation/maps/maps.component.ts ***!
  \******************************************************/
/*! exports provided: MapsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapsComponent", function() { return MapsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MapsComponent = /** @class */ (function () {
    function MapsComponent() {
        this.code = "<div id=\"map-canvas\" class=\"map-canvas\" data-lat=\"40.748817\" data-lng=\"-73.985428\" style=\"height: 600px;\"></div>";
        this.code1 = "import { Component, OnInit } from '@angular/core';\n  declare const google: any;\n\n  @Component({\n    selector: 'app-maps',\n    templateUrl: './maps.component.html',\n    styleUrls: ['./maps.component.scss']\n  })\n  export class MapsComponent implements OnInit {\n    constructor() { }\n\n    ngOnInit() {\n      let map = document.getElementById('map-canvas');\n      let lat = map.getAttribute('data-lat');\n      let lng = map.getAttribute('data-lng');\n\n      var myLatlng = new google.maps.LatLng(lat, lng);\n      var mapOptions = {\n          zoom: 12,\n          scrollwheel: false,\n          center: myLatlng,\n          mapTypeId: google.maps.MapTypeId.ROADMAP,\n          styles: [\n            {\"featureType\":\"administrative\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#444444\"}]},\n            {\"featureType\":\"landscape\",\"elementType\":\"all\",\"stylers\":[{\"color\":\"#f2f2f2\"}]},\n            {\"featureType\":\"poi\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"off\"}]},\n            {\"featureType\":\"road\",\"elementType\":\"all\",\"stylers\":[{\"saturation\":-100},{\"lightness\":45}]},\n            {\"featureType\":\"road.highway\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"simplified\"}]},\n            {\"featureType\":\"road.arterial\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},\n            {\"featureType\":\"transit\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"off\"}]},\n            {\"featureType\":\"water\",\"elementType\":\"all\",\"stylers\":[{\"color\":'#5e72e4'},{\"visibility\":\"on\"}]}]\n      }\n\n      map = new google.maps.Map(map, mapOptions);\n\n      var marker = new google.maps.Marker({\n          position: myLatlng,\n          map: map,\n          animation: google.maps.Animation.DROP,\n          title: 'Hello World!'\n      });\n\n      var contentString = '<div class=\"info-window-content\"><h2>Argon Dashboard</h2>' +\n          '<p>A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.</p></div>';\n\n      var infowindow = new google.maps.InfoWindow({\n          content: contentString\n      });\n\n      google.maps.event.addListener(marker, 'click', function() {\n          infowindow.open(map, marker);\n      });\n    }\n\n  }\n";
    }
    MapsComponent.prototype.ngOnInit = function () {
        var map = document.getElementById('map-canvas');
        var lat = map.getAttribute('data-lat');
        var lng = map.getAttribute('data-lng');
        var myLatlng = new google.maps.LatLng(lat, lng);
        var mapOptions = {
            zoom: 12,
            scrollwheel: false,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] },
                { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
                { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
                { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] },
                { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
                { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
                { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] },
                { "featureType": "water", "elementType": "all", "stylers": [{ "color": '#5e72e4' }, { "visibility": "on" }] }
            ]
        };
        map = new google.maps.Map(map, mapOptions);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            animation: google.maps.Animation.DROP,
            title: 'Hello World!'
        });
        var contentString = '<div class="info-window-content"><h2>Argon Dashboard</h2>' +
            '<p>A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.</p></div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
    };
    MapsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-maps',
            template: __webpack_require__(/*! ./maps.component.html */ "./src/app/documentation/maps/maps.component.html"),
            styles: [__webpack_require__(/*! ./maps.component.scss */ "./src/app/documentation/maps/maps.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], MapsComponent);
    return MapsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/navigation/navigation.component.html":
/*!********************************************************************!*\
  !*** ./src/app/documentation/navigation/navigation.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Navbar</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Documentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse plugin.</p>\n<hr>\n<h2 id=\"example\">Example</h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <nav class=\"navbar navbar-horizontal navbar-expand-lg navbar-dark bg-default\">\n          <div class=\"container\">\n            <a class=\"navbar-brand\" href=\"#\">Default Color</a>\n            <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbar-default\" aria-controls=\"navbar-default\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n              <span class=\"navbar-toggler-icon\"></span>\n            </button>\n            <div class=\"collapse navbar-collapse\" id=\"navbar-default\">\n              <div class=\"navbar-collapse-header\">\n                <div class=\"row\">\n                  <div class=\"col-6 collapse-brand\">\n                    <a href=\"../../index.html\">\n                      <img src=\"assets/img/brand/blue.png\" />\n                    </a>\n                  </div>\n                  <div class=\"col-6 collapse-close\">\n                    <button type=\"button\" class=\"navbar-toggler\" data-toggle=\"collapse\" data-target=\"#navbar-default\" aria-controls=\"navbar-default\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n                      <span></span>\n                      <span></span>\n                    </button>\n                  </div>\n                </div>\n              </div>\n              <ul class=\"navbar-nav ml-lg-auto\">\n                <li class=\"nav-item\">\n                  <a class=\"nav-link nav-link-icon\" href=\"#\">\n                    <i class=\"ni ni-favourite-28\"></i>\n                    <span class=\"nav-link-inner--text d-lg-none\">Discover</span>\n                  </a>\n                </li>\n                <li class=\"nav-item\">\n                  <a class=\"nav-link nav-link-icon\" href=\"#\">\n                    <i class=\"ni ni-notification-70\"></i>\n                    <span class=\"nav-link-inner--text d-lg-none\">Profile</span>\n                  </a>\n                </li>\n                <li class=\"nav-item dropdown\">\n                  <a class=\"nav-link nav-link-icon\" href=\"#\" id=\"navbar-default_dropdown_1\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                    <i class=\"ni ni-settings-gear-65\"></i>\n                    <span class=\"nav-link-inner--text d-lg-none\">Settings</span>\n                  </a>\n                  <div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"navbar-default_dropdown_1\">\n                    <a class=\"dropdown-item\" href=\"#\">Action</a>\n                    <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                    <div class=\"dropdown-divider\"></div>\n                    <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                  </div>\n                </li>\n              </ul>\n            </div>\n          </div>\n        </nav>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"variations\">Variations</h2>\n<!-- Navbar primary -->\n<nav class=\"navbar navbar-horizontal navbar-expand-lg navbar-dark bg-primary mt-4\">\n  <div class=\"container\">\n    <a class=\"navbar-brand\" href=\"#\">Primary Color</a>\n    <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbar-primary\" aria-controls=\"navbar-primary\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n      <span class=\"navbar-toggler-icon\"></span>\n    </button>\n    <div class=\"collapse navbar-collapse\" id=\"navbar-primary\">\n      <div class=\"navbar-collapse-header\">\n        <div class=\"row\">\n          <div class=\"col-6 collapse-brand\">\n            <a href=\"../../index.html\">\n              <img src=\"assets/img/brand/blue.png\" />\n            </a>\n          </div>\n          <div class=\"col-6 collapse-close\">\n            <button type=\"button\" class=\"navbar-toggler\" data-toggle=\"collapse\" data-target=\"#navbar-primary\" aria-controls=\"navbar-primary\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n              <span></span>\n              <span></span>\n            </button>\n          </div>\n        </div>\n      </div>\n      <ul class=\"navbar-nav ml-lg-auto\">\n        <li class=\"nav-item\">\n          <a class=\"nav-link\" href=\"#\">Discover <span class=\"sr-only\">(current)</span></a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link\" href=\"#\">Profile</a>\n        </li>\n        <li class=\"nav-item dropdown\">\n          <a class=\"nav-link\" href=\"#\" id=\"navbar-primary_dropdown_1\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">Settings</a>\n          <div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"navbar-primary_dropdown_1\">\n            <a class=\"dropdown-item\" href=\"#\">Action</a>\n            <a class=\"dropdown-item\" href=\"#\">Another action</a>\n            <div class=\"dropdown-divider\"></div>\n            <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n          </div>\n        </li>\n      </ul>\n    </div>\n  </div>\n</nav>\n<!-- Navbar success -->\n<nav class=\"navbar navbar-horizontal navbar-expand-lg navbar-dark bg-success mt-4\">\n  <div class=\"container\">\n    <a class=\"navbar-brand\" href=\"#\">Success Color</a>\n    <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbar-success\" aria-controls=\"navbar-success\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n      <span class=\"navbar-toggler-icon\"></span>\n    </button>\n    <div class=\"collapse navbar-collapse\" id=\"navbar-success\">\n      <div class=\"navbar-collapse-header\">\n        <div class=\"row\">\n          <div class=\"col-6 collapse-brand\">\n            <a href=\"../../index.html\">\n              <img src=\"assets/img/brand/blue.png\" />\n            </a>\n          </div>\n          <div class=\"col-6 collapse-close\">\n            <button type=\"button\" class=\"navbar-toggler\" data-toggle=\"collapse\" data-target=\"#navbar-success\" aria-controls=\"navbar-success\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n              <span></span>\n              <span></span>\n            </button>\n          </div>\n        </div>\n      </div>\n      <ul class=\"navbar-nav ml-lg-auto\">\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"ni ni-favourite-28\"></i>\n            <span class=\"nav-link-inner--text d-lg-none\">Favorites</span>\n          </a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"ni ni-planet\"></i>\n            <span class=\"nav-link-inner--text d-lg-none\">Another action</span>\n          </a>\n        </li>\n        <li class=\"nav-item dropdown\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\" id=\"navbar-success_dropdown_1\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n            <i class=\"ni ni-settings-gear-65\"></i>\n            <span class=\"nav-link-inner--text d-lg-none\">Settings</span>\n          </a>\n          <div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"navbar-success_dropdown_1\">\n            <a class=\"dropdown-item\" href=\"#\">Action</a>\n            <a class=\"dropdown-item\" href=\"#\">Another action</a>\n            <div class=\"dropdown-divider\"></div>\n            <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n          </div>\n        </li>\n      </ul>\n    </div>\n  </div>\n</nav>\n<!-- Navbar danger -->\n<nav class=\"navbar navbar-horizontal navbar-expand-lg navbar-dark bg-danger mt-4\">\n  <div class=\"container\">\n    <a class=\"navbar-brand\" href=\"#\">Danger Color</a>\n    <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbar-danger\" aria-controls=\"navbar-danger\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n      <span class=\"navbar-toggler-icon\"></span>\n    </button>\n    <div class=\"collapse navbar-collapse\" id=\"navbar-danger\">\n      <div class=\"navbar-collapse-header\">\n        <div class=\"row\">\n          <div class=\"col-6 collapse-brand\">\n            <a href=\"../../index.html\">\n              <img src=\"assets/img/brand/blue.png\" />\n            </a>\n          </div>\n          <div class=\"col-6 collapse-close\">\n            <button type=\"button\" class=\"navbar-toggler\" data-toggle=\"collapse\" data-target=\"#navbar-danger\" aria-controls=\"navbar-danger\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n              <span></span>\n              <span></span>\n            </button>\n          </div>\n        </div>\n      </div>\n      <ul class=\"navbar-nav ml-auto\">\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"fab fa-facebook-square\"></i>\n            <span class=\"nav-link-inner--text d-lg-none\">Facebook</span>\n          </a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"fab fa-twitter\"></i>\n            <span class=\"nav-link-inner--text d-lg-none\">Twitter</span>\n          </a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"fab fa-google-plus\"></i>\n            <span class=\"nav-link-inner--text d-lg-none\">Google +</span>\n          </a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"fab fa-instagram\"></i>\n            <span class=\"nav-link-inner--text d-lg-none\">Instagram</span>\n          </a>\n        </li>\n      </ul>\n    </div>\n  </div>\n</nav>\n<!-- Navbar warning -->\n<nav class=\"navbar navbar-horizontal navbar-expand-lg navbar-dark bg-warning mt-4\">\n  <div class=\"container\">\n    <a class=\"navbar-brand\" href=\"#\">Warning Color</a>\n    <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbar-warning\" aria-controls=\"navbar-warning\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n      <span class=\"navbar-toggler-icon\"></span>\n    </button>\n    <div class=\"collapse navbar-collapse\" id=\"navbar-warning\">\n      <div class=\"navbar-collapse-header\">\n        <div class=\"row\">\n          <div class=\"col-6 collapse-brand\">\n            <a href=\"../../index.html\">\n              <img src=\"assets/img/brand/blue.png\" />\n            </a>\n          </div>\n          <div class=\"col-6 collapse-close\">\n            <button type=\"button\" class=\"navbar-toggler\" data-toggle=\"collapse\" data-target=\"#navbar-warning\" aria-controls=\"navbar-warning\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n              <span></span>\n              <span></span>\n            </button>\n          </div>\n        </div>\n      </div>\n      <ul class=\"navbar-nav align-items-lg-center ml-lg-auto\">\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"fab fa-facebook-square\"></i>\n            <span class=\"nav-link-inner--text d-lg-none\">Share</span>\n          </a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"fab fa-twitter\"></i>\n            <span class=\"nav-link-inner--text d-lg-none\">Tweet</span>\n          </a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"fab fa-pinterest\"></i>\n            <span class=\"nav-link-inner--text d-lg-none\">Pin</span>\n          </a>\n        </li>\n      </ul>\n    </div>\n  </div>\n</nav>\n<!-- Navbar info -->\n<nav class=\"navbar navbar-horizontal navbar-expand-lg navbar-dark bg-info mt-4\">\n  <div class=\"container\">\n    <a class=\"navbar-brand\" href=\"#\">Info Color</a>\n    <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbar-info\" aria-controls=\"navbar-info\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n      <span class=\"navbar-toggler-icon\"></span>\n    </button>\n    <div class=\"collapse navbar-collapse\" id=\"navbar-info\">\n      <div class=\"navbar-collapse-header\">\n        <div class=\"row\">\n          <div class=\"col-6 collapse-brand\">\n            <a href=\"../../index.html\">\n              <img src=\"assets/img/brand/blue.png\" />\n            </a>\n          </div>\n          <div class=\"col-6 collapse-close\">\n            <button type=\"button\" class=\"navbar-toggler\" data-toggle=\"collapse\" data-target=\"#navbar-info\" aria-controls=\"navbar-info\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n              <span></span>\n              <span></span>\n            </button>\n          </div>\n        </div>\n      </div>\n      <ul class=\"navbar-nav ml-auto\">\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"fab fa-facebook-square\"></i>\n            <span class=\"nav-link-inner--text\">Facebook</span>\n          </a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"fab fa-twitter\"></i>\n            <span class=\"nav-link-inner--text\">Twitter</span>\n          </a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link nav-link-icon\" href=\"#\">\n            <i class=\"fab fa-instagram\"></i>\n            <span class=\"nav-link-inner--text\">Instagram</span>\n          </a>\n        </li>\n      </ul>\n    </div>\n  </div>\n</nav>\n"

/***/ }),

/***/ "./src/app/documentation/navigation/navigation.component.scss":
/*!********************************************************************!*\
  !*** ./src/app/documentation/navigation/navigation.component.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/documentation/navigation/navigation.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/documentation/navigation/navigation.component.ts ***!
  \******************************************************************/
/*! exports provided: NavigationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavigationComponent", function() { return NavigationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NavigationComponent = /** @class */ (function () {
    function NavigationComponent() {
        this.code = "<nav class=\"navbar navbar-horizontal navbar-expand-lg navbar-dark bg-default\">\n    <div class=\"container\">\n      <a class=\"navbar-brand\" href=\"#\">Default Color</a>\n      <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbar-default\" aria-controls=\"navbar-default\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n        <span class=\"navbar-toggler-icon\"></span>\n      </button>\n      <div class=\"collapse navbar-collapse\" id=\"navbar-default\">\n        <div class=\"navbar-collapse-header\">\n          <div class=\"row\">\n            <div class=\"col-6 collapse-brand\">\n              <a href=\"../../index.html\">\n                <img src=\"assets/img/brand/blue.png\" />\n              </a>\n            </div>\n            <div class=\"col-6 collapse-close\">\n              <button type=\"button\" class=\"navbar-toggler\" data-toggle=\"collapse\" data-target=\"#navbar-default\" aria-controls=\"navbar-default\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n                <span></span>\n                <span></span>\n              </button>\n            </div>\n          </div>\n        </div>\n        <ul class=\"navbar-nav ml-lg-auto\">\n          <li class=\"nav-item\">\n            <a class=\"nav-link nav-link-icon\" href=\"#\">\n              <i class=\"ni ni-favourite-28\"></i>\n              <span class=\"nav-link-inner--text d-lg-none\">Discover</span>\n            </a>\n          </li>\n          <li class=\"nav-item\">\n            <a class=\"nav-link nav-link-icon\" href=\"#\">\n              <i class=\"ni ni-notification-70\"></i>\n              <span class=\"nav-link-inner--text d-lg-none\">Profile</span>\n            </a>\n          </li>\n          <li class=\"nav-item dropdown\">\n            <a class=\"nav-link nav-link-icon\" href=\"#\" id=\"navbar-default_dropdown_1\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n              <i class=\"ni ni-settings-gear-65\"></i>\n              <span class=\"nav-link-inner--text d-lg-none\">Settings</span>\n            </a>\n            <div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"navbar-default_dropdown_1\">\n              <a class=\"dropdown-item\" href=\"#\">Action</a>\n              <a class=\"dropdown-item\" href=\"#\">Another action</a>\n              <div class=\"dropdown-divider\"></div>\n              <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n            </div>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </nav>";
    }
    NavigationComponent.prototype.ngOnInit = function () {
    };
    NavigationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-navigation',
            template: __webpack_require__(/*! ./navigation.component.html */ "./src/app/documentation/navigation/navigation.component.html"),
            styles: [__webpack_require__(/*! ./navigation.component.scss */ "./src/app/documentation/navigation/navigation.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], NavigationComponent);
    return NavigationComponent;
}());



/***/ }),

/***/ "./src/app/documentation/notifications/notifications.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/documentation/notifications/notifications.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n  <h2> Notifications </h2>\n  <legend></legend>\n  <p class=\"space-top\">\n    The new Now UI Dashboard Pro notifications are looking fresh and clean. They go great with the navbar.\n  </p>\n  <b> For full documentation, see this <a href=\"https://scttcper.github.io/ngx-toastr/\" target=\"_blank\">link</a></b>\n<br><br>\n  <h3>Notifications Style</h3>\n  <div class=\"alert alert-info\">\n    <span>This is a plain notification</span>\n  </div>\n  <div class=\"alert alert-info\">\n    <button type=\"button\" aria-hidden=\"true\" class=\"close\">\n      <i class=\"now-ui-icons ui-1_simple-remove\"></i>\n    </button>\n    <span>This is a notification with close button.</span>\n  </div>\n  <div class=\"alert alert-info alert-with-icon\" data-notify=\"container\">\n    <button type=\"button\" aria-hidden=\"true\" class=\"close\">\n      <i class=\"now-ui-icons ui-1_simple-remove\"></i>\n    </button>\n    <span data-notify=\"icon\" class=\"now-ui-icons ui-1_bell-53\"></span>\n    <span data-notify=\"message\">This is a notification with close button and icon.</span>\n  </div>\n  <div class=\"alert alert-info alert-with-icon\" data-notify=\"container\">\n    <button type=\"button\" aria-hidden=\"true\" class=\"close\">\n      <i class=\"now-ui-icons ui-1_simple-remove\"></i>\n    </button>\n    <span data-notify=\"icon\" class=\"now-ui-icons ui-1_bell-53\"></span>\n    <span data-notify=\"message\">This is a notification with close button and icon and have many lines. You can see that the icon and the close button are always vertically aligned. This is a beautiful notification. So you don't have to worry about the style.</span>\n  </div>\n\n\n  <pre class=\"prettyprint\">\n    &#x3C;div class=&#x22;alert alert-info&#x22;&#x3E;\n      &#x3C;span&#x3E;This is a plain notification&#x3C;/span&#x3E;\n    &#x3C;/div&#x3E;\n    &#x3C;div class=&#x22;alert alert-info&#x22;&#x3E;\n      &#x3C;button type=&#x22;button&#x22; aria-hidden=&#x22;true&#x22; class=&#x22;close&#x22;&#x3E;\n        &#x3C;i class=&#x22;now-ui-icons ui-1_simple-remove&#x22;&#x3E;&#x3C;/i&#x3E;\n      &#x3C;/button&#x3E;\n      &#x3C;span&#x3E;This is a notification with close button.&#x3C;/span&#x3E;\n    &#x3C;/div&#x3E;\n    &#x3C;div class=&#x22;alert alert-info alert-with-icon&#x22; data-notify=&#x22;container&#x22;&#x3E;\n      &#x3C;button type=&#x22;button&#x22; aria-hidden=&#x22;true&#x22; class=&#x22;close&#x22;&#x3E;\n        &#x3C;i class=&#x22;now-ui-icons ui-1_simple-remove&#x22;&#x3E;&#x3C;/i&#x3E;\n      &#x3C;/button&#x3E;\n      &#x3C;span data-notify=&#x22;icon&#x22; class=&#x22;now-ui-icons ui-1_bell-53&#x22;&#x3E;&#x3C;/span&#x3E;\n      &#x3C;span data-notify=&#x22;message&#x22;&#x3E;This is a notification with close button and icon.&#x3C;/span&#x3E;\n    &#x3C;/div&#x3E;\n    &#x3C;div class=&#x22;alert alert-info alert-with-icon&#x22; data-notify=&#x22;container&#x22;&#x3E;\n      &#x3C;button type=&#x22;button&#x22; aria-hidden=&#x22;true&#x22; class=&#x22;close&#x22;&#x3E;\n        &#x3C;i class=&#x22;now-ui-icons ui-1_simple-remove&#x22;&#x3E;&#x3C;/i&#x3E;\n      &#x3C;/button&#x3E;\n      &#x3C;span data-notify=&#x22;icon&#x22; class=&#x22;now-ui-icons ui-1_bell-53&#x22;&#x3E;&#x3C;/span&#x3E;\n      &#x3C;span data-notify=&#x22;message&#x22;&#x3E;This is a notification with close button and icon and have many lines. You can see that the icon and the close button are always vertically aligned. This is a beautiful notification. So you don&#x27;t have to worry about the style.&#x3C;/span&#x3E;\n    &#x3C;/div&#x3E;\n  </pre>\n  <br><br>\n  <h3>Notifications States</h3>\n\n  <div class=\"alert alert-primary\">\n    <button type=\"button\" aria-hidden=\"true\" class=\"close\">\n      <i class=\"now-ui-icons ui-1_simple-remove\"></i>\n    </button>\n    <span>\n      <b> Primary - </b> This is a regular notification made with \".alert-primary\"</span>\n  </div>\n  <div class=\"alert alert-info\">\n    <button type=\"button\" aria-hidden=\"true\" class=\"close\">\n      <i class=\"now-ui-icons ui-1_simple-remove\"></i>\n    </button>\n    <span>\n      <b> Info - </b> This is a regular notification made with \".alert-info\"</span>\n  </div>\n  <div class=\"alert alert-success\">\n    <button type=\"button\" aria-hidden=\"true\" class=\"close\">\n      <i class=\"now-ui-icons ui-1_simple-remove\"></i>\n    </button>\n    <span>\n      <b> Success - </b> This is a regular notification made with \".alert-success\"</span>\n  </div>\n  <div class=\"alert alert-warning\">\n    <button type=\"button\" aria-hidden=\"true\" class=\"close\">\n      <i class=\"now-ui-icons ui-1_simple-remove\"></i>\n    </button>\n    <span>\n      <b> Warning - </b> This is a regular notification made with \".alert-warning\"</span>\n  </div>\n  <div class=\"alert alert-danger\">\n    <button type=\"button\" aria-hidden=\"true\" class=\"close\">\n      <i class=\"now-ui-icons ui-1_simple-remove\"></i>\n    </button>\n    <span>\n      <b> Danger - </b> This is a regular notification made with \".alert-danger\"</span>\n  </div>\n\n  <pre class=\"prettyprint\">\n    &#x3C;div class=&#x22;alert alert-primary&#x22;&#x3E;\n    &#x3C;button type=&#x22;button&#x22; aria-hidden=&#x22;true&#x22; class=&#x22;close&#x22;&#x3E;\n      &#x3C;i class=&#x22;now-ui-icons ui-1_simple-remove&#x22;&#x3E;&#x3C;/i&#x3E;\n    &#x3C;/button&#x3E;\n    &#x3C;span&#x3E;\n      &#x3C;b&#x3E; Primary - &#x3C;/b&#x3E; This is a regular notification made with &#x22;.alert-primary&#x22;&#x3C;/span&#x3E;\n  &#x3C;/div&#x3E;\n  &#x3C;div class=&#x22;alert alert-info&#x22;&#x3E;\n    &#x3C;button type=&#x22;button&#x22; aria-hidden=&#x22;true&#x22; class=&#x22;close&#x22;&#x3E;\n      &#x3C;i class=&#x22;now-ui-icons ui-1_simple-remove&#x22;&#x3E;&#x3C;/i&#x3E;\n    &#x3C;/button&#x3E;\n    &#x3C;span&#x3E;\n      &#x3C;b&#x3E; Info - &#x3C;/b&#x3E; This is a regular notification made with &#x22;.alert-info&#x22;&#x3C;/span&#x3E;\n  &#x3C;/div&#x3E;\n  &#x3C;div class=&#x22;alert alert-success&#x22;&#x3E;\n    &#x3C;button type=&#x22;button&#x22; aria-hidden=&#x22;true&#x22; class=&#x22;close&#x22;&#x3E;\n      &#x3C;i class=&#x22;now-ui-icons ui-1_simple-remove&#x22;&#x3E;&#x3C;/i&#x3E;\n    &#x3C;/button&#x3E;\n    &#x3C;span&#x3E;\n      &#x3C;b&#x3E; Success - &#x3C;/b&#x3E; This is a regular notification made with &#x22;.alert-success&#x22;&#x3C;/span&#x3E;\n  &#x3C;/div&#x3E;\n  &#x3C;div class=&#x22;alert alert-warning&#x22;&#x3E;\n    &#x3C;button type=&#x22;button&#x22; aria-hidden=&#x22;true&#x22; class=&#x22;close&#x22;&#x3E;\n      &#x3C;i class=&#x22;now-ui-icons ui-1_simple-remove&#x22;&#x3E;&#x3C;/i&#x3E;\n    &#x3C;/button&#x3E;\n    &#x3C;span&#x3E;\n      &#x3C;b&#x3E; Warning - &#x3C;/b&#x3E; This is a regular notification made with &#x22;.alert-warning&#x22;&#x3C;/span&#x3E;\n  &#x3C;/div&#x3E;\n  &#x3C;div class=&#x22;alert alert-danger&#x22;&#x3E;\n    &#x3C;button type=&#x22;button&#x22; aria-hidden=&#x22;true&#x22; class=&#x22;close&#x22;&#x3E;\n      &#x3C;i class=&#x22;now-ui-icons ui-1_simple-remove&#x22;&#x3E;&#x3C;/i&#x3E;\n    &#x3C;/button&#x3E;\n    &#x3C;span&#x3E;\n      &#x3C;b&#x3E; Danger - &#x3C;/b&#x3E; This is a regular notification made with &#x22;.alert-danger&#x22;&#x3C;/span&#x3E;\n  &#x3C;/div&#x3E;\n  </pre>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/notifications/notifications.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/documentation/notifications/notifications.component.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vbm90aWZpY2F0aW9ucy9ub3RpZmljYXRpb25zLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/documentation/notifications/notifications.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/documentation/notifications/notifications.component.ts ***!
  \************************************************************************/
/*! exports provided: NotificationsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotificationsComponent", function() { return NotificationsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NotificationsComponent = /** @class */ (function () {
    function NotificationsComponent(toastr) {
        this.toastr = toastr;
    }
    NotificationsComponent.prototype.showNotification = function (from, align) {
        var color = Math.floor((Math.random() * 5) + 1);
        switch (color) {
            case 1:
                this.toastr.info('<span class="now-ui-icons ui-1_bell-53"></span> Welcome to <b>Now Ui Dashboard</b> - a beautiful freebie for every web developer.', '', {
                    timeOut: 8000,
                    closeButton: true,
                    enableHtml: true,
                    toastClass: "alert alert-info alert-with-icon",
                    positionClass: 'toast-' + from + '-' + align
                });
                break;
            case 2:
                this.toastr.success('<span class="now-ui-icons ui-1_bell-53"></span> Welcome to <b>Now Ui Dashboard</b> - a beautiful freebie for every web developer.', '', {
                    timeOut: 8000,
                    closeButton: true,
                    enableHtml: true,
                    toastClass: "alert alert-success alert-with-icon",
                    positionClass: 'toast-' + from + '-' + align
                });
                break;
            case 3:
                this.toastr.warning('<span class="now-ui-icons ui-1_bell-53"></span> Welcome to <b>Now Ui Dashboard</b> - a beautiful freebie for every web developer.', '', {
                    timeOut: 8000,
                    closeButton: true,
                    enableHtml: true,
                    toastClass: "alert alert-warning alert-with-icon",
                    positionClass: 'toast-' + from + '-' + align
                });
                break;
            case 4:
                this.toastr.error('<span class="now-ui-icons ui-1_bell-53"></span> Welcome to <b>Now Ui Dashboard</b> - a beautiful freebie for every web developer.', '', {
                    timeOut: 8000,
                    enableHtml: true,
                    closeButton: true,
                    toastClass: "alert alert-danger alert-with-icon",
                    positionClass: 'toast-' + from + '-' + align
                });
                break;
            case 5:
                this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Welcome to <b>Now Ui Dashboard</b> - a beautiful freebie for every web developer.', '', {
                    timeOut: 8000,
                    closeButton: true,
                    enableHtml: true,
                    toastClass: "alert alert-primary alert-with-icon",
                    positionClass: 'toast-' + from + '-' + align
                });
                break;
            default:
                break;
        }
    };
    NotificationsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-notifications',
            template: __webpack_require__(/*! ./notifications.component.html */ "./src/app/documentation/notifications/notifications.component.html"),
            styles: [__webpack_require__(/*! ./notifications.component.scss */ "./src/app/documentation/notifications/notifications.component.scss")]
        }),
        __metadata("design:paramtypes", [ngx_toastr__WEBPACK_IMPORTED_MODULE_1__["ToastrService"]])
    ], NotificationsComponent);
    return NotificationsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/pagination/pagination.component.html":
/*!********************************************************************!*\
  !*** ./src/app/documentation/pagination/pagination.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Pagination</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Documentation and examples for showing pagination to indicate a series of related content exists across multiple pages.</p>\n<hr>\n<h2 id=\"examples\">Examples</h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <nav aria-label=\"Page navigation example\">\n          <ul class=\"pagination\">\n            <li class=\"page-item\">\n              <a class=\"page-link\" href=\"#\" aria-label=\"Previous\">\n                <i class=\"fa fa-angle-left\"></i>\n                <span class=\"sr-only\">Previous</span>\n              </a>\n            </li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">1</a></li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">2</a></li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">3</a></li>\n            <li class=\"page-item\">\n              <a class=\"page-link\" href=\"#\" aria-label=\"Next\">\n                <i class=\"fa fa-angle-right\"></i>\n                <span class=\"sr-only\">Next</span>\n              </a>\n            </li>\n          </ul>\n        </nav>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"disabled-and-active-states\">Disabled and active states</h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <nav aria-label=\"...\">\n          <ul class=\"pagination\">\n            <li class=\"page-item disabled\">\n              <a class=\"page-link\" href=\"#\" tabindex=\"-1\">\n                <i class=\"fa fa-angle-left\"></i>\n                <span class=\"sr-only\">Previous</span>\n              </a>\n            </li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">1</a></li>\n            <li class=\"page-item active\">\n              <a class=\"page-link\" href=\"#\">2 <span class=\"sr-only\">(current)</span></a>\n            </li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">3</a></li>\n            <li class=\"page-item\">\n              <a class=\"page-link\" href=\"#\">\n                <i class=\"fa fa-angle-right\"></i>\n                <span class=\"sr-only\">Next</span>\n              </a>\n            </li>\n          </ul>\n        </nav>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code1\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"sizing\">Sizing</h2>\n<p>Fancy larger or smaller pagination? Add <code class=\"highlighter-rouge\">.pagination-lg</code> or <code class=\"highlighter-rouge\">.pagination-sm</code> for additional sizes.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <nav aria-label=\"...\">\n          <ul class=\"pagination pagination-lg\">\n            <li class=\"page-item disabled\">\n              <a class=\"page-link\" href=\"#\" tabindex=\"-1\">1</a>\n            </li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">2</a></li>\n            <li class=\"page-item active\"><a class=\"page-link\" href=\"#\">3</a></li>\n          </ul>\n        </nav>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code2\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <nav aria-label=\"...\">\n          <ul class=\"pagination pagination-sm\">\n            <li class=\"page-item disabled\">\n              <a class=\"page-link\" href=\"#\" tabindex=\"-1\">1</a>\n            </li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">2</a></li>\n            <li class=\"page-item active\"><a class=\"page-link\" href=\"#\">3</a></li>\n          </ul>\n        </nav>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code3\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"alignment\">Alignment</h2>\n<p>Change the alignment of pagination components with <a href=\"argon-dashboard/docs//utilities/flex/\">flexbox utilities</a>.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <nav aria-label=\"Page navigation example\">\n          <ul class=\"pagination justify-content-center\">\n            <li class=\"page-item disabled\">\n              <a class=\"page-link\" href=\"#\" tabindex=\"-1\">\n                <i class=\"fa fa-angle-left\"></i>\n                <span class=\"sr-only\">Previous</span>\n              </a>\n            </li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">1</a></li>\n            <li class=\"page-item active\"><a class=\"page-link\" href=\"#\">2</a></li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">3</a></li>\n            <li class=\"page-item\">\n              <a class=\"page-link\" href=\"#\">\n                <i class=\"fa fa-angle-right\"></i>\n                <span class=\"sr-only\">Next</span>\n              </a>\n            </li>\n          </ul>\n        </nav>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code4\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <nav aria-label=\"Page navigation example\">\n          <ul class=\"pagination justify-content-end\">\n            <li class=\"page-item disabled\">\n              <a class=\"page-link\" href=\"#\" tabindex=\"-1\">\n                <i class=\"fa fa-angle-left\"></i>\n                <span class=\"sr-only\">Previous</span>\n              </a>\n            </li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">1</a></li>\n            <li class=\"page-item active\"><a class=\"page-link\" href=\"#\">2</a></li>\n            <li class=\"page-item\"><a class=\"page-link\" href=\"#\">3</a></li>\n            <li class=\"page-item\">\n              <a class=\"page-link\" href=\"#\">\n                <i class=\"fa fa-angle-right\"></i>\n                <span class=\"sr-only\">Next</span>\n              </a>\n            </li>\n          </ul>\n        </nav>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code5\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/pagination/pagination.component.scss":
/*!********************************************************************!*\
  !*** ./src/app/documentation/pagination/pagination.component.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/documentation/pagination/pagination.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/documentation/pagination/pagination.component.ts ***!
  \******************************************************************/
/*! exports provided: PaginationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaginationComponent", function() { return PaginationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PaginationComponent = /** @class */ (function () {
    function PaginationComponent() {
        this.code = "<nav aria-label=\"Page navigation example\">\n    <ul class=\"pagination\">\n      <li class=\"page-item\">\n        <a class=\"page-link\" href=\"#\" aria-label=\"Previous\">\n          <i class=\"fa fa-angle-left\"></i>\n          <span class=\"sr-only\">Previous</span>\n        </a>\n      </li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">1</a></li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">2</a></li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">3</a></li>\n      <li class=\"page-item\">\n        <a class=\"page-link\" href=\"#\" aria-label=\"Next\">\n          <i class=\"fa fa-angle-right\"></i>\n          <span class=\"sr-only\">Next</span>\n        </a>\n      </li>\n    </ul>\n  </nav>";
        this.code1 = "<nav aria-label=\"...\">\n    <ul class=\"pagination\">\n      <li class=\"page-item disabled\">\n        <a class=\"page-link\" href=\"#\" tabindex=\"-1\">\n          <i class=\"fa fa-angle-left\"></i>\n          <span class=\"sr-only\">Previous</span>\n        </a>\n      </li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">1</a></li>\n      <li class=\"page-item active\">\n        <a class=\"page-link\" href=\"#\">2 <span class=\"sr-only\">(current)</span></a>\n      </li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">3</a></li>\n      <li class=\"page-item\">\n        <a class=\"page-link\" href=\"#\">\n          <i class=\"fa fa-angle-right\"></i>\n          <span class=\"sr-only\">Next</span>\n        </a>\n      </li>\n    </ul>\n  </nav>";
        this.code2 = "<nav aria-label=\"...\">\n    <ul class=\"pagination pagination-lg\">\n      <li class=\"page-item disabled\">\n        <a class=\"page-link\" href=\"#\" tabindex=\"-1\">1</a>\n      </li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">2</a></li>\n      <li class=\"page-item active\"><a class=\"page-link\" href=\"#\">3</a></li>\n    </ul>\n  </nav>";
        this.code3 = "<nav aria-label=\"...\">\n    <ul class=\"pagination pagination-sm\">\n      <li class=\"page-item disabled\">\n        <a class=\"page-link\" href=\"#\" tabindex=\"-1\">1</a>\n      </li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">2</a></li>\n      <li class=\"page-item active\"><a class=\"page-link\" href=\"#\">3</a></li>\n    </ul>\n  </nav>";
        this.code4 = "<nav aria-label=\"Page navigation example\">\n    <ul class=\"pagination justify-content-center\">\n      <li class=\"page-item disabled\">\n        <a class=\"page-link\" href=\"#\" tabindex=\"-1\">\n          <i class=\"fa fa-angle-left\"></i>\n          <span class=\"sr-only\">Previous</span>\n        </a>\n      </li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">1</a></li>\n      <li class=\"page-item active\"><a class=\"page-link\" href=\"#\">2</a></li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">3</a></li>\n      <li class=\"page-item\">\n        <a class=\"page-link\" href=\"#\">\n          <i class=\"fa fa-angle-right\"></i>\n          <span class=\"sr-only\">Next</span>\n        </a>\n      </li>\n    </ul>\n  </nav>";
        this.code5 = "<nav aria-label=\"Page navigation example\">\n    <ul class=\"pagination justify-content-end\">\n      <li class=\"page-item disabled\">\n        <a class=\"page-link\" href=\"#\" tabindex=\"-1\">\n          <i class=\"fa fa-angle-left\"></i>\n          <span class=\"sr-only\">Previous</span>\n        </a>\n      </li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">1</a></li>\n      <li class=\"page-item active\"><a class=\"page-link\" href=\"#\">2</a></li>\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">3</a></li>\n      <li class=\"page-item\">\n        <a class=\"page-link\" href=\"#\">\n          <i class=\"fa fa-angle-right\"></i>\n          <span class=\"sr-only\">Next</span>\n        </a>\n      </li>\n    </ul>\n  </nav>";
    }
    PaginationComponent.prototype.ngOnInit = function () {
    };
    PaginationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-pagination',
            template: __webpack_require__(/*! ./pagination.component.html */ "./src/app/documentation/pagination/pagination.component.html"),
            styles: [__webpack_require__(/*! ./pagination.component.scss */ "./src/app/documentation/pagination/pagination.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], PaginationComponent);
    return PaginationComponent;
}());



/***/ }),

/***/ "./src/app/documentation/popovers/popovers.component.html":
/*!****************************************************************!*\
  !*** ./src/app/documentation/popovers/popovers.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Navbar</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Documentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse plugin.</p>\n<hr>\n<h2 id=\"example\">Example</h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button type=\"button\" class=\"btn btn-default\" placement=\"top\"\n        ngbPopover=\"This is a very beautiful popover, show some love.\">\n          Popover on top\n        </button>\n        <button type=\"button\" class=\"btn btn-default\" placement=\"right\"\n        ngbPopover=\"This is a very beautiful popover, show some love.\">\n          Popover on right\n        </button>\n        <button type=\"button\" class=\"btn btn-default\" placement=\"bottom\"\n        ngbPopover=\"This is a very beautiful popover, show some love.\">\n          Popover on bottom\n        </button>\n        <button type=\"button\" class=\"btn btn-default\" placement=\"left\"\n        ngbPopover=\"This is a very beautiful popover, show some love.\">\n          Popover on left\n        </button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"variations\">Variations</h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button type=\"button\" class=\"btn btn-default\" placement=\"top\"\n ngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-default\">\n          Default popover\n        </button>\n        <button type=\"button\" class=\"btn btn-primary\" placement=\"top\"\n ngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-primary\">\n          Primary popover\n        </button>\n        <button type=\"button\" class=\"btn btn-secondary\" placement=\"top\"\n ngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-secondary\">\n          Secondary popover\n        </button>\n        <button type=\"button\" class=\"btn btn-info\" placement=\"top\"\n ngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-info\">\n          Info popover\n        </button>\n        <button type=\"button\" class=\"btn btn-success\" placement=\"top\"\n ngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-success\">\n          Success popover\n        </button>\n        <button type=\"button\" class=\"btn btn-danger\" placement=\"top\"\n ngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-danger\">\n          Danger popover\n        </button>\n        <button type=\"button\" class=\"btn btn-warning\" placement=\"top\"\n ngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-warning\">\n          Warning popover\n        </button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/popovers/popovers.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/documentation/popovers/popovers.component.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vcG9wb3ZlcnMvcG9wb3ZlcnMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/documentation/popovers/popovers.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/documentation/popovers/popovers.component.ts ***!
  \**************************************************************/
/*! exports provided: PopoversComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PopoversComponent", function() { return PopoversComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PopoversComponent = /** @class */ (function () {
    function PopoversComponent() {
        this.code = "<button type=\"button\" class=\"btn btn-default\" placement=\"top\"\n  ngbPopover=\"This is a very beautiful popover, show some love.\">\n    Popover on top\n  </button>\n  <button type=\"button\" class=\"btn btn-default\" placement=\"right\"\n  ngbPopover=\"This is a very beautiful popover, show some love.\">\n    Popover on right\n  </button>\n  <button type=\"button\" class=\"btn btn-default\" placement=\"bottom\"\n  ngbPopover=\"This is a very beautiful popover, show some love.\">\n    Popover on bottom\n  </button>\n  <button type=\"button\" class=\"btn btn-default\" placement=\"left\"\n  ngbPopover=\"This is a very beautiful popover, show some love.\">\n    Popover on left\n  </button>";
        this.code1 = "<button type=\"button\" class=\"btn btn-default\" placement=\"top\"\nngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-default\">\n    Default popover\n  </button>\n  <button type=\"button\" class=\"btn btn-primary\" placement=\"top\"\nngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-primary\">\n    Primary popover\n  </button>\n  <button type=\"button\" class=\"btn btn-secondary\" placement=\"top\"\nngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-secondary\">\n    Secondary popover\n  </button>\n  <button type=\"button\" class=\"btn btn-info\" placement=\"top\"\nngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-info\">\n    Info popover\n  </button>\n  <button type=\"button\" class=\"btn btn-success\" placement=\"top\"\nngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-success\">\n    Success popover\n  </button>\n  <button type=\"button\" class=\"btn btn-danger\" placement=\"top\"\nngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-danger\">\n    Danger popover\n  </button>\n  <button type=\"button\" class=\"btn btn-warning\" placement=\"top\"\nngbPopover=\"This is a very beautiful popover, show some love.\" popoverClass=\"popover-warning\">\n    Warning popover\n  </button>";
    }
    PopoversComponent.prototype.ngOnInit = function () {
    };
    PopoversComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-popovers',
            template: __webpack_require__(/*! ./popovers.component.html */ "./src/app/documentation/popovers/popovers.component.html"),
            styles: [__webpack_require__(/*! ./popovers.component.scss */ "./src/app/documentation/popovers/popovers.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], PopoversComponent);
    return PopoversComponent;
}());



/***/ }),

/***/ "./src/app/documentation/progress/progress.component.html":
/*!****************************************************************!*\
  !*** ./src/app/documentation/progress/progress.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Progress</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Documentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse plugin.</p>\n<hr>\n<h2 id=\"example\">Example</h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"progress-wrapper\">\n          <div class=\"progress-info\">\n            <div class=\"progress-label\">\n              <span>Task completed</span>\n            </div>\n            <div class=\"progress-percentage\">\n              <span>60%</span>\n            </div>\n          </div>\n          <div class=\"progress\">\n            <div class=\"progress-bar bg-default\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n          </div>\n        </div>\n        <div class=\"progress-wrapper\">\n          <div class=\"progress-info\">\n            <div class=\"progress-label\">\n              <span>Task completed</span>\n            </div>\n            <div class=\"progress-percentage\">\n              <span>60%</span>\n            </div>\n          </div>\n          <div class=\"progress\">\n            <div class=\"progress-bar bg-primary\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n          </div>\n        </div>\n        <div class=\"progress-wrapper\">\n          <div class=\"progress-info\">\n            <div class=\"progress-label\">\n              <span>Task completed</span>\n            </div>\n            <div class=\"progress-percentage\">\n              <span>60%</span>\n            </div>\n          </div>\n          <div class=\"progress\">\n            <div class=\"progress-bar bg-secondary\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n          </div>\n        </div>\n        <div class=\"progress-wrapper\">\n          <div class=\"progress-info\">\n            <div class=\"progress-label\">\n              <span>Task completed</span>\n            </div>\n            <div class=\"progress-percentage\">\n              <span>60%</span>\n            </div>\n          </div>\n          <div class=\"progress\">\n            <div class=\"progress-bar bg-info\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n          </div>\n        </div>\n        <div class=\"progress-wrapper\">\n          <div class=\"progress-info\">\n            <div class=\"progress-label\">\n              <span>Task completed</span>\n            </div>\n            <div class=\"progress-percentage\">\n              <span>60%</span>\n            </div>\n          </div>\n          <div class=\"progress\">\n            <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n          </div>\n        </div>\n        <div class=\"progress-wrapper\">\n          <div class=\"progress-info\">\n            <div class=\"progress-label\">\n              <span>Task completed</span>\n            </div>\n            <div class=\"progress-percentage\">\n              <span>60%</span>\n            </div>\n          </div>\n          <div class=\"progress\">\n            <div class=\"progress-bar bg-danger\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n          </div>\n        </div>\n        <div class=\"progress-wrapper\">\n          <div class=\"progress-info\">\n            <div class=\"progress-label\">\n              <span>Task completed</span>\n            </div>\n            <div class=\"progress-percentage\">\n              <span>60%</span>\n            </div>\n          </div>\n          <div class=\"progress\">\n            <div class=\"progress-bar bg-warning\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n          </div>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/progress/progress.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/documentation/progress/progress.component.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vcHJvZ3Jlc3MvcHJvZ3Jlc3MuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/documentation/progress/progress.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/documentation/progress/progress.component.ts ***!
  \**************************************************************/
/*! exports provided: ProgressComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressComponent", function() { return ProgressComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ProgressComponent = /** @class */ (function () {
    function ProgressComponent() {
        this.code = "<div class=\"progress-wrapper\">\n    <div class=\"progress-info\">\n      <div class=\"progress-label\">\n        <span>Task completed</span>\n      </div>\n      <div class=\"progress-percentage\">\n        <span>60%</span>\n      </div>\n    </div>\n    <div class=\"progress\">\n      <div class=\"progress-bar bg-default\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n    </div>\n  </div>\n  <div class=\"progress-wrapper\">\n    <div class=\"progress-info\">\n      <div class=\"progress-label\">\n        <span>Task completed</span>\n      </div>\n      <div class=\"progress-percentage\">\n        <span>60%</span>\n      </div>\n    </div>\n    <div class=\"progress\">\n      <div class=\"progress-bar bg-primary\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n    </div>\n  </div>\n  <div class=\"progress-wrapper\">\n    <div class=\"progress-info\">\n      <div class=\"progress-label\">\n        <span>Task completed</span>\n      </div>\n      <div class=\"progress-percentage\">\n        <span>60%</span>\n      </div>\n    </div>\n    <div class=\"progress\">\n      <div class=\"progress-bar bg-secondary\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n    </div>\n  </div>\n  <div class=\"progress-wrapper\">\n    <div class=\"progress-info\">\n      <div class=\"progress-label\">\n        <span>Task completed</span>\n      </div>\n      <div class=\"progress-percentage\">\n        <span>60%</span>\n      </div>\n    </div>\n    <div class=\"progress\">\n      <div class=\"progress-bar bg-info\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n    </div>\n  </div>\n  <div class=\"progress-wrapper\">\n    <div class=\"progress-info\">\n      <div class=\"progress-label\">\n        <span>Task completed</span>\n      </div>\n      <div class=\"progress-percentage\">\n        <span>60%</span>\n      </div>\n    </div>\n    <div class=\"progress\">\n      <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n    </div>\n  </div>\n  <div class=\"progress-wrapper\">\n    <div class=\"progress-info\">\n      <div class=\"progress-label\">\n        <span>Task completed</span>\n      </div>\n      <div class=\"progress-percentage\">\n        <span>60%</span>\n      </div>\n    </div>\n    <div class=\"progress\">\n      <div class=\"progress-bar bg-danger\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n    </div>\n  </div>\n  <div class=\"progress-wrapper\">\n    <div class=\"progress-info\">\n      <div class=\"progress-label\">\n        <span>Task completed</span>\n      </div>\n      <div class=\"progress-percentage\">\n        <span>60%</span>\n      </div>\n    </div>\n    <div class=\"progress\">\n      <div class=\"progress-bar bg-warning\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n    </div>\n  </div>";
    }
    ProgressComponent.prototype.ngOnInit = function () {
    };
    ProgressComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-progress',
            template: __webpack_require__(/*! ./progress.component.html */ "./src/app/documentation/progress/progress.component.html"),
            styles: [__webpack_require__(/*! ./progress.component.scss */ "./src/app/documentation/progress/progress.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ProgressComponent);
    return ProgressComponent;
}());



/***/ }),

/***/ "./src/app/documentation/sliders/sliders.component.html":
/*!**************************************************************!*\
  !*** ./src/app/documentation/sliders/sliders.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Sliders</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Our customized noUiSlider is a lightweight JavaScript range slider library. It offers a wide selection of options and settings, and is compatible with a ton of (touch) devices, including those running iOS, Android, Windows 8/8.1/10, Windows Phone 8.1 and Windows Mobile 10.</p>\n<hr>\n<h2 id=\"slider\">Slider</h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"input-slider-container\">\n          <div id=\"test\" class=\"input-slider\"></div>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid3\" title=\"Typescript\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code1\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"range-slider\">Range slider</h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"input-slider-container\">\n          <div id=\"test2\" class=\"input-slider\"></div>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code2\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid3\" title=\"Typescript\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code3\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/sliders/sliders.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/documentation/sliders/sliders.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vc2xpZGVycy9zbGlkZXJzLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/documentation/sliders/sliders.component.ts":
/*!************************************************************!*\
  !*** ./src/app/documentation/sliders/sliders.component.ts ***!
  \************************************************************/
/*! exports provided: SlidersComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SlidersComponent", function() { return SlidersComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nouislider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nouislider */ "./node_modules/nouislider/distribute/nouislider.js");
/* harmony import */ var nouislider__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nouislider__WEBPACK_IMPORTED_MODULE_1__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SlidersComponent = /** @class */ (function () {
    function SlidersComponent() {
        this.code = "<div class=\"input-slider-container\">\n    <div id=\"test\" class=\"input-slider\"></div>\n  </div>";
        this.code1 = "import { Component, OnInit, AfterViewInit } from '@angular/core';\n  import noUiSlider from \"nouislider\";\n\n  @Component({\n    selector: 'app-sliders',\n    templateUrl: './sliders.component.html',\n    styleUrls: ['./sliders.component.scss']\n  })\n  export class SlidersComponent implements OnInit, AfterViewInit {\n\n    constructor() { }\n\n    ngOnInit() {\n    }\n\n    ngAfterViewInit(){\n      var slider = document.getElementById(\"test\");\n\n      noUiSlider.create(slider, {\n        start: 40,\n        connect: [true, false],\n        range: {\n          min: 0,\n          max: 100\n        }\n      });\n    }\n\n  }\n";
        this.code2 = "<div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n    <pre><code [highlight]=\"code\"></code></pre>\n  </div>";
        this.code3 = "import { Component, OnInit, AfterViewInit } from '@angular/core';\n  import noUiSlider from \"nouislider\";\n\n  @Component({\n    selector: 'app-sliders',\n    templateUrl: './sliders.component.html',\n    styleUrls: ['./sliders.component.scss']\n  })\n  export class SlidersComponent implements OnInit, AfterViewInit {\n\n    constructor() { }\n\n    ngOnInit() {\n    }\n\n    ngAfterViewInit(){\n      var slider2 = document.getElementById(\"test2\");\n\n      noUiSlider.create(slider2, {\n        start: [20, 60],\n        connect: true,\n        range: {\n          min: 0,\n          max: 100\n        }\n      });\n    }\n  }\n";
    }
    SlidersComponent.prototype.ngOnInit = function () {
    };
    SlidersComponent.prototype.ngAfterViewInit = function () {
        var slider = document.getElementById("test");
        nouislider__WEBPACK_IMPORTED_MODULE_1___default.a.create(slider, {
            start: 40,
            connect: [true, false],
            range: {
                min: 0,
                max: 100
            }
        });
        var slider2 = document.getElementById("test2");
        nouislider__WEBPACK_IMPORTED_MODULE_1___default.a.create(slider2, {
            start: [20, 60],
            connect: true,
            range: {
                min: 0,
                max: 100
            }
        });
    };
    SlidersComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-sliders',
            template: __webpack_require__(/*! ./sliders.component.html */ "./src/app/documentation/sliders/sliders.component.html"),
            styles: [__webpack_require__(/*! ./sliders.component.scss */ "./src/app/documentation/sliders/sliders.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], SlidersComponent);
    return SlidersComponent;
}());



/***/ }),

/***/ "./src/app/documentation/tables/tables.component.css":
/*!***********************************************************!*\
  !*** ./src/app/documentation/tables/tables.component.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "pre.prettyprint {\n    background-color: #eee;\n    border: 0px;\n    margin-bottom: 60px;\n    margin-top: 30px;\n    padding: 20px;\n    text-align: left;\n}\n\n.atv,\n.str {\n    color: #05AE0E;\n}\n\n.tag,\n.pln,\n.kwd {\n    color: #3472F7;\n}\n\n.atn {\n    color: #2C93FF;\n}\n\n.pln {\n    color: #333;\n}\n\n.com {\n    color: #999;\n}\n\n.space-top {\n    margin-top: 50px;\n}\n\n.area-line {\n    border: 1px solid #999;\n    border-left: 0;\n    border-right: 0;\n    color: #666;\n    display: block;\n    margin-top: 20px;\n    padding: 8px 0;\n    text-align: center;\n}\n\n.area-line a {\n    color: #666;\n}\n\n.container-fluid {\n    padding-right: 15px;\n    padding-left: 15px;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZG9jdW1lbnRhdGlvbi90YWJsZXMvdGFibGVzLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxzQkFBc0I7SUFDdEIsV0FBVztJQUNYLG1CQUFtQjtJQUNuQixnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLGdCQUFnQjtBQUNwQjs7QUFFQTs7SUFFSSxjQUFjO0FBQ2xCOztBQUVBOzs7SUFHSSxjQUFjO0FBQ2xCOztBQUVBO0lBQ0ksY0FBYztBQUNsQjs7QUFFQTtJQUNJLFdBQVc7QUFDZjs7QUFFQTtJQUNJLFdBQVc7QUFDZjs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLHNCQUFzQjtJQUN0QixjQUFjO0lBQ2QsZUFBZTtJQUNmLFdBQVc7SUFDWCxjQUFjO0lBQ2QsZ0JBQWdCO0lBQ2hCLGNBQWM7SUFDZCxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxtQkFBbUI7SUFDbkIsa0JBQWtCO0FBQ3RCIiwiZmlsZSI6InNyYy9hcHAvZG9jdW1lbnRhdGlvbi90YWJsZXMvdGFibGVzLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJwcmUucHJldHR5cHJpbnQge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XG4gICAgYm9yZGVyOiAwcHg7XG4gICAgbWFyZ2luLWJvdHRvbTogNjBweDtcbiAgICBtYXJnaW4tdG9wOiAzMHB4O1xuICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbn1cblxuLmF0dixcbi5zdHIge1xuICAgIGNvbG9yOiAjMDVBRTBFO1xufVxuXG4udGFnLFxuLnBsbixcbi5rd2Qge1xuICAgIGNvbG9yOiAjMzQ3MkY3O1xufVxuXG4uYXRuIHtcbiAgICBjb2xvcjogIzJDOTNGRjtcbn1cblxuLnBsbiB7XG4gICAgY29sb3I6ICMzMzM7XG59XG5cbi5jb20ge1xuICAgIGNvbG9yOiAjOTk5O1xufVxuXG4uc3BhY2UtdG9wIHtcbiAgICBtYXJnaW4tdG9wOiA1MHB4O1xufVxuXG4uYXJlYS1saW5lIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjOTk5O1xuICAgIGJvcmRlci1sZWZ0OiAwO1xuICAgIGJvcmRlci1yaWdodDogMDtcbiAgICBjb2xvcjogIzY2NjtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXJnaW4tdG9wOiAyMHB4O1xuICAgIHBhZGRpbmc6IDhweCAwO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLmFyZWEtbGluZSBhIHtcbiAgICBjb2xvcjogIzY2Njtcbn1cblxuLmNvbnRhaW5lci1mbHVpZCB7XG4gICAgcGFkZGluZy1yaWdodDogMTVweDtcbiAgICBwYWRkaW5nLWxlZnQ6IDE1cHg7XG59XG4iXX0= */"

/***/ }),

/***/ "./src/app/documentation/tables/tables.component.html":
/*!************************************************************!*\
  !*** ./src/app/documentation/tables/tables.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Tables</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Documentation and examples for opt-in styling of tables (given their prevalent use in JavaScript plugins) with Bootstrap.</p>\n<hr>\n<h3 id=\"examples\">Examples</h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"table-responsive\">\n          <table class=\"table align-items-center table-flush\">\n            <thead class=\"thead-light\">\n              <tr>\n                <th scope=\"col\">Project</th>\n                <th scope=\"col\">Budget</th>\n                <th scope=\"col\">Status</th>\n                <th scope=\"col\">Users</th>\n                <th scope=\"col\">Completion</th>\n                <th scope=\"col\"></th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr>\n                <th scope=\"row\">\n                  <div class=\"media align-items-center\">\n                    <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/bootstrap.jpg\">\n                    </a>\n                    <div class=\"media-body\">\n                      <span class=\"mb-0 text-sm\">Argon Design System</span>\n                    </div>\n                  </div>\n                </th>\n                <td>\n                  $2,500 USD\n                </td>\n                <td>\n                  <span class=\"badge badge-dot mr-4\">\n                    <i class=\"bg-warning\"></i> pending\n                  </span>\n                </td>\n                <td>\n                  <div class=\"avatar-group\">\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                  </div>\n                </td>\n                <td>\n                  <div class=\"d-flex align-items-center\">\n                    <span class=\"mr-2\">60%</span>\n                    <div>\n                      <div class=\"progress\">\n                        <div class=\"progress-bar bg-warning\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"text-right\">\n                  <div ngbDropdown placement=\"bottom-right\">\n                    <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                      <i class=\"fas fa-ellipsis-v\"></i>\n                    </a>\n                    <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                      <a class=\"dropdown-item\" href=\"#\">Action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n              <tr>\n                <th scope=\"row\">\n                  <div class=\"media align-items-center\">\n                    <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/angular.jpg\">\n                    </a>\n                    <div class=\"media-body\">\n                      <span class=\"mb-0 text-sm\">Angular Now UI Kit PRO</span>\n                    </div>\n                  </div>\n                </th>\n                <td>\n                  $1,800 USD\n                </td>\n                <td>\n                  <span class=\"badge badge-dot\">\n                    <i class=\"bg-success\"></i> completed\n                  </span>\n                </td>\n                <td>\n                  <div class=\"avatar-group\">\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                  </div>\n                </td>\n                <td>\n                  <div class=\"d-flex align-items-center\">\n                    <span class=\"mr-2\">100%</span>\n                    <div>\n                      <div class=\"progress\">\n                        <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%;\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"text-right\">\n                  <div ngbDropdown  placement=\"bottom-right\">\n                    <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                      <i class=\"fas fa-ellipsis-v\"></i>\n                    </a>\n                    <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                      <a class=\"dropdown-item\" href=\"#\">Action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n              <tr>\n                <th scope=\"row\">\n                  <div class=\"media align-items-center\">\n                    <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/sketch.jpg\">\n                    </a>\n                    <div class=\"media-body\">\n                      <span class=\"mb-0 text-sm\">Black Dashboard</span>\n                    </div>\n                  </div>\n                </th>\n                <td>\n                  $3,150 USD\n                </td>\n                <td>\n                  <span class=\"badge badge-dot mr-4\">\n                    <i class=\"bg-danger\"></i> delayed\n                  </span>\n                </td>\n                <td>\n                  <div class=\"avatar-group\">\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                  </div>\n                </td>\n                <td>\n                  <div class=\"d-flex align-items-center\">\n                    <span class=\"mr-2\">72%</span>\n                    <div>\n                      <div class=\"progress\">\n                        <div class=\"progress-bar bg-danger\" role=\"progressbar\" aria-valuenow=\"72\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 72%;\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"text-right\">\n                  <div ngbDropdown  placement=\"top-right\">\n                    <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                      <i class=\"fas fa-ellipsis-v\"></i>\n                    </a>\n                    <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                      <a class=\"dropdown-item\" href=\"#\">Action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n              <tr>\n                <th scope=\"row\">\n                  <div class=\"media align-items-center\">\n                    <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/react.jpg\">\n                    </a>\n                    <div class=\"media-body\">\n                      <span class=\"mb-0 text-sm\">React Material Dashboard</span>\n                    </div>\n                  </div>\n                </th>\n                <td>\n                  $4,400 USD\n                </td>\n                <td>\n                  <span class=\"badge badge-dot\">\n                    <i class=\"bg-info\"></i> on schedule\n                  </span>\n                </td>\n                <td>\n                  <div class=\"avatar-group\">\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                  </div>\n                </td>\n                <td>\n                  <div class=\"d-flex align-items-center\">\n                    <span class=\"mr-2\">90%</span>\n                    <div>\n                      <div class=\"progress\">\n                        <div class=\"progress-bar bg-info\" role=\"progressbar\" aria-valuenow=\"90\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 90%;\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"text-right\">\n                  <div ngbDropdown   placement=\"top-right\">\n                    <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                      <i class=\"fas fa-ellipsis-v\"></i>\n                    </a>\n                    <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                      <a class=\"dropdown-item\" href=\"#\">Action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n              <tr>\n                <th scope=\"row\">\n                  <div class=\"media align-items-center\">\n                    <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/vue.jpg\">\n                    </a>\n                    <div class=\"media-body\">\n                      <span class=\"mb-0 text-sm\">Vue Paper UI Kit PRO</span>\n                    </div>\n                  </div>\n                </th>\n                <td>\n                  $2,200 USD\n                </td>\n                <td>\n                  <span class=\"badge badge-dot mr-4\">\n                    <i class=\"bg-success\"></i> completed\n                  </span>\n                </td>\n                <td>\n                  <div class=\"avatar-group\">\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                  </div>\n                </td>\n                <td>\n                  <div class=\"d-flex align-items-center\">\n                    <span class=\"mr-2\">100%</span>\n                    <div>\n                      <div class=\"progress\">\n                        <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%;\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"text-right\">\n                  <div ngbDropdown   placement=\"top-right\">\n                    <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                      <i class=\"fas fa-ellipsis-v\"></i>\n                    </a>\n                    <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                      <a class=\"dropdown-item\" href=\"#\">Action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"dark-table\">Dark table</h3>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"table-responsive\">\n          <table class=\"table align-items-center table-dark table-flush\">\n            <thead class=\"thead-dark\">\n              <tr>\n                <th scope=\"col\">Project</th>\n                <th scope=\"col\">Budget</th>\n                <th scope=\"col\">Status</th>\n                <th scope=\"col\">Users</th>\n                <th scope=\"col\">Completion</th>\n                <th scope=\"col\"></th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr>\n                <th scope=\"row\">\n                  <div class=\"media align-items-center\">\n                    <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/bootstrap.jpg\">\n                    </a>\n                    <div class=\"media-body\">\n                      <span class=\"mb-0 text-sm\">Argon Design System</span>\n                    </div>\n                  </div>\n                </th>\n                <td>\n                  $2,500 USD\n                </td>\n                <td>\n                  <span class=\"badge badge-dot mr-4\">\n                    <i class=\"bg-warning\"></i> pending\n                  </span>\n                </td>\n                <td>\n                  <div class=\"avatar-group\">\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                  </div>\n                </td>\n                <td>\n                  <div class=\"d-flex align-items-center\">\n                    <span class=\"mr-2\">60%</span>\n                    <div>\n                      <div class=\"progress\">\n                        <div class=\"progress-bar bg-warning\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"text-right\">\n                  <div ngbDropdown placement=\"bottom-right\">\n                    <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                      <i class=\"fas fa-ellipsis-v\"></i>\n                    </a>\n                    <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                      <a class=\"dropdown-item\" href=\"#\">Action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n              <tr>\n                <th scope=\"row\">\n                  <div class=\"media align-items-center\">\n                    <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/angular.jpg\">\n                    </a>\n                    <div class=\"media-body\">\n                      <span class=\"mb-0 text-sm\">Angular Now UI Kit PRO</span>\n                    </div>\n                  </div>\n                </th>\n                <td>\n                  $1,800 USD\n                </td>\n                <td>\n                  <span class=\"badge badge-dot\">\n                    <i class=\"bg-success\"></i> completed\n                  </span>\n                </td>\n                <td>\n                  <div class=\"avatar-group\">\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                  </div>\n                </td>\n                <td>\n                  <div class=\"d-flex align-items-center\">\n                    <span class=\"mr-2\">100%</span>\n                    <div>\n                      <div class=\"progress\">\n                        <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%;\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"text-right\">\n                  <div ngbDropdown placement=\"bottom-right\">\n                    <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                      <i class=\"fas fa-ellipsis-v\"></i>\n                    </a>\n                    <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                      <a class=\"dropdown-item\" href=\"#\">Action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n              <tr>\n                <th scope=\"row\">\n                  <div class=\"media align-items-center\">\n                    <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/sketch.jpg\">\n                    </a>\n                    <div class=\"media-body\">\n                      <span class=\"mb-0 text-sm\">Black Dashboard</span>\n                    </div>\n                  </div>\n                </th>\n                <td>\n                  $3,150 USD\n                </td>\n                <td>\n                  <span class=\"badge badge-dot mr-4\">\n                    <i class=\"bg-danger\"></i> delayed\n                  </span>\n                </td>\n                <td>\n                  <div class=\"avatar-group\">\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                  </div>\n                </td>\n                <td>\n                  <div class=\"d-flex align-items-center\">\n                    <span class=\"mr-2\">72%</span>\n                    <div>\n                      <div class=\"progress\">\n                        <div class=\"progress-bar bg-danger\" role=\"progressbar\" aria-valuenow=\"72\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 72%;\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"text-right\">\n                  <div ngbDropdown placement=\"top-right\">\n                    <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                      <i class=\"fas fa-ellipsis-v\"></i>\n                    </a>\n                    <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                      <a class=\"dropdown-item\" href=\"#\">Action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n              <tr>\n                <th scope=\"row\">\n                  <div class=\"media align-items-center\">\n                    <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/react.jpg\">\n                    </a>\n                    <div class=\"media-body\">\n                      <span class=\"mb-0 text-sm\">React Material Dashboard</span>\n                    </div>\n                  </div>\n                </th>\n                <td>\n                  $4,400 USD\n                </td>\n                <td>\n                  <span class=\"badge badge-dot\">\n                    <i class=\"bg-info\"></i> on schedule\n                  </span>\n                </td>\n                <td>\n                  <div class=\"avatar-group\">\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                  </div>\n                </td>\n                <td>\n                  <div class=\"d-flex align-items-center\">\n                    <span class=\"mr-2\">90%</span>\n                    <div>\n                      <div class=\"progress\">\n                        <div class=\"progress-bar bg-info\" role=\"progressbar\" aria-valuenow=\"90\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 90%;\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"text-right\">\n                  <div ngbDropdown placement=\"top-right\">\n                    <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                      <i class=\"fas fa-ellipsis-v\"></i>\n                    </a>\n                    <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                      <a class=\"dropdown-item\" href=\"#\">Action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n              <tr>\n                <th scope=\"row\">\n                  <div class=\"media align-items-center\">\n                    <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/vue.jpg\">\n                    </a>\n                    <div class=\"media-body\">\n                      <span class=\"mb-0 text-sm\">Vue Paper UI Kit PRO</span>\n                    </div>\n                  </div>\n                </th>\n                <td>\n                  $2,200 USD\n                </td>\n                <td>\n                  <span class=\"badge badge-dot mr-4\">\n                    <i class=\"bg-success\"></i> completed\n                  </span>\n                </td>\n                <td>\n                  <div class=\"avatar-group\">\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                    <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                      <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n                    </a>\n                  </div>\n                </td>\n                <td>\n                  <div class=\"d-flex align-items-center\">\n                    <span class=\"mr-2\">100%</span>\n                    <div>\n                      <div class=\"progress\">\n                        <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%;\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"text-right\">\n                  <div ngbDropdown placement=\"top-right\">\n                    <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                      <i class=\"fas fa-ellipsis-v\"></i>\n                    </a>\n                    <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                      <a class=\"dropdown-item\" href=\"#\">Action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                      <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code1\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/tables/tables.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/documentation/tables/tables.component.ts ***!
  \**********************************************************/
/*! exports provided: TablesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TablesComponent", function() { return TablesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TablesComponent = /** @class */ (function () {
    function TablesComponent() {
        this.code = "<div class=\"table-responsive\">\n    <table class=\"table align-items-center table-flush\">\n      <thead class=\"thead-light\">\n        <tr>\n          <th scope=\"col\">Project</th>\n          <th scope=\"col\">Budget</th>\n          <th scope=\"col\">Status</th>\n          <th scope=\"col\">Users</th>\n          <th scope=\"col\">Completion</th>\n          <th scope=\"col\"></th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <th scope=\"row\">\n            <div class=\"media align-items-center\">\n              <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/bootstrap.jpg\">\n              </a>\n              <div class=\"media-body\">\n                <span class=\"mb-0 text-sm\">Argon Design System</span>\n              </div>\n            </div>\n          </th>\n          <td>\n            $2,500 USD\n          </td>\n          <td>\n            <span class=\"badge badge-dot mr-4\">\n              <i class=\"bg-warning\"></i> pending\n            </span>\n          </td>\n          <td>\n            <div class=\"avatar-group\">\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n            </div>\n          </td>\n          <td>\n            <div class=\"d-flex align-items-center\">\n              <span class=\"mr-2\">60%</span>\n              <div>\n                <div class=\"progress\">\n                  <div class=\"progress-bar bg-warning\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n                </div>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-right\">\n            <div ngbDropdown placement=\"bottom-right\">\n              <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                <i class=\"fas fa-ellipsis-v\"></i>\n              </a>\n              <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                <a class=\"dropdown-item\" href=\"#\">Action</a>\n                <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n              </div>\n            </div>\n          </td>\n        </tr>\n        <tr>\n          <th scope=\"row\">\n            <div class=\"media align-items-center\">\n              <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/angular.jpg\">\n              </a>\n              <div class=\"media-body\">\n                <span class=\"mb-0 text-sm\">Angular Now UI Kit PRO</span>\n              </div>\n            </div>\n          </th>\n          <td>\n            $1,800 USD\n          </td>\n          <td>\n            <span class=\"badge badge-dot\">\n              <i class=\"bg-success\"></i> completed\n            </span>\n          </td>\n          <td>\n            <div class=\"avatar-group\">\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n            </div>\n          </td>\n          <td>\n            <div class=\"d-flex align-items-center\">\n              <span class=\"mr-2\">100%</span>\n              <div>\n                <div class=\"progress\">\n                  <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%;\"></div>\n                </div>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-right\">\n            <div ngbDropdown  placement=\"bottom-right\">\n              <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                <i class=\"fas fa-ellipsis-v\"></i>\n              </a>\n              <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                <a class=\"dropdown-item\" href=\"#\">Action</a>\n                <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n              </div>\n            </div>\n          </td>\n        </tr>\n        <tr>\n          <th scope=\"row\">\n            <div class=\"media align-items-center\">\n              <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/sketch.jpg\">\n              </a>\n              <div class=\"media-body\">\n                <span class=\"mb-0 text-sm\">Black Dashboard</span>\n              </div>\n            </div>\n          </th>\n          <td>\n            $3,150 USD\n          </td>\n          <td>\n            <span class=\"badge badge-dot mr-4\">\n              <i class=\"bg-danger\"></i> delayed\n            </span>\n          </td>\n          <td>\n            <div class=\"avatar-group\">\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n            </div>\n          </td>\n          <td>\n            <div class=\"d-flex align-items-center\">\n              <span class=\"mr-2\">72%</span>\n              <div>\n                <div class=\"progress\">\n                  <div class=\"progress-bar bg-danger\" role=\"progressbar\" aria-valuenow=\"72\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 72%;\"></div>\n                </div>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-right\">\n            <div ngbDropdown  placement=\"top-right\">\n              <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                <i class=\"fas fa-ellipsis-v\"></i>\n              </a>\n              <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                <a class=\"dropdown-item\" href=\"#\">Action</a>\n                <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n              </div>\n            </div>\n          </td>\n        </tr>\n        <tr>\n          <th scope=\"row\">\n            <div class=\"media align-items-center\">\n              <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/react.jpg\">\n              </a>\n              <div class=\"media-body\">\n                <span class=\"mb-0 text-sm\">React Material Dashboard</span>\n              </div>\n            </div>\n          </th>\n          <td>\n            $4,400 USD\n          </td>\n          <td>\n            <span class=\"badge badge-dot\">\n              <i class=\"bg-info\"></i> on schedule\n            </span>\n          </td>\n          <td>\n            <div class=\"avatar-group\">\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n            </div>\n          </td>\n          <td>\n            <div class=\"d-flex align-items-center\">\n              <span class=\"mr-2\">90%</span>\n              <div>\n                <div class=\"progress\">\n                  <div class=\"progress-bar bg-info\" role=\"progressbar\" aria-valuenow=\"90\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 90%;\"></div>\n                </div>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-right\">\n            <div ngbDropdown   placement=\"top-right\">\n              <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                <i class=\"fas fa-ellipsis-v\"></i>\n              </a>\n              <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                <a class=\"dropdown-item\" href=\"#\">Action</a>\n                <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n              </div>\n            </div>\n          </td>\n        </tr>\n        <tr>\n          <th scope=\"row\">\n            <div class=\"media align-items-center\">\n              <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/vue.jpg\">\n              </a>\n              <div class=\"media-body\">\n                <span class=\"mb-0 text-sm\">Vue Paper UI Kit PRO</span>\n              </div>\n            </div>\n          </th>\n          <td>\n            $2,200 USD\n          </td>\n          <td>\n            <span class=\"badge badge-dot mr-4\">\n              <i class=\"bg-success\"></i> completed\n            </span>\n          </td>\n          <td>\n            <div class=\"avatar-group\">\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n            </div>\n          </td>\n          <td>\n            <div class=\"d-flex align-items-center\">\n              <span class=\"mr-2\">100%</span>\n              <div>\n                <div class=\"progress\">\n                  <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%;\"></div>\n                </div>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-right\">\n            <div ngbDropdown   placement=\"top-right\">\n              <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                <i class=\"fas fa-ellipsis-v\"></i>\n              </a>\n              <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                <a class=\"dropdown-item\" href=\"#\">Action</a>\n                <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n              </div>\n            </div>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  </div>";
        this.code1 = "<div class=\"table-responsive\">\n    <table class=\"table align-items-center table-dark table-flush\">\n      <thead class=\"thead-dark\">\n        <tr>\n          <th scope=\"col\">Project</th>\n          <th scope=\"col\">Budget</th>\n          <th scope=\"col\">Status</th>\n          <th scope=\"col\">Users</th>\n          <th scope=\"col\">Completion</th>\n          <th scope=\"col\"></th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <th scope=\"row\">\n            <div class=\"media align-items-center\">\n              <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/bootstrap.jpg\">\n              </a>\n              <div class=\"media-body\">\n                <span class=\"mb-0 text-sm\">Argon Design System</span>\n              </div>\n            </div>\n          </th>\n          <td>\n            $2,500 USD\n          </td>\n          <td>\n            <span class=\"badge badge-dot mr-4\">\n              <i class=\"bg-warning\"></i> pending\n            </span>\n          </td>\n          <td>\n            <div class=\"avatar-group\">\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n            </div>\n          </td>\n          <td>\n            <div class=\"d-flex align-items-center\">\n              <span class=\"mr-2\">60%</span>\n              <div>\n                <div class=\"progress\">\n                  <div class=\"progress-bar bg-warning\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\"></div>\n                </div>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-right\">\n            <div ngbDropdown placement=\"bottom-right\">\n              <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                <i class=\"fas fa-ellipsis-v\"></i>\n              </a>\n              <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                <a class=\"dropdown-item\" href=\"#\">Action</a>\n                <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n              </div>\n            </div>\n          </td>\n        </tr>\n        <tr>\n          <th scope=\"row\">\n            <div class=\"media align-items-center\">\n              <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/angular.jpg\">\n              </a>\n              <div class=\"media-body\">\n                <span class=\"mb-0 text-sm\">Angular Now UI Kit PRO</span>\n              </div>\n            </div>\n          </th>\n          <td>\n            $1,800 USD\n          </td>\n          <td>\n            <span class=\"badge badge-dot\">\n              <i class=\"bg-success\"></i> completed\n            </span>\n          </td>\n          <td>\n            <div class=\"avatar-group\">\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n            </div>\n          </td>\n          <td>\n            <div class=\"d-flex align-items-center\">\n              <span class=\"mr-2\">100%</span>\n              <div>\n                <div class=\"progress\">\n                  <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%;\"></div>\n                </div>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-right\">\n            <div ngbDropdown placement=\"bottom-right\">\n              <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                <i class=\"fas fa-ellipsis-v\"></i>\n              </a>\n              <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                <a class=\"dropdown-item\" href=\"#\">Action</a>\n                <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n              </div>\n            </div>\n          </td>\n        </tr>\n        <tr>\n          <th scope=\"row\">\n            <div class=\"media align-items-center\">\n              <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/sketch.jpg\">\n              </a>\n              <div class=\"media-body\">\n                <span class=\"mb-0 text-sm\">Black Dashboard</span>\n              </div>\n            </div>\n          </th>\n          <td>\n            $3,150 USD\n          </td>\n          <td>\n            <span class=\"badge badge-dot mr-4\">\n              <i class=\"bg-danger\"></i> delayed\n            </span>\n          </td>\n          <td>\n            <div class=\"avatar-group\">\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n            </div>\n          </td>\n          <td>\n            <div class=\"d-flex align-items-center\">\n              <span class=\"mr-2\">72%</span>\n              <div>\n                <div class=\"progress\">\n                  <div class=\"progress-bar bg-danger\" role=\"progressbar\" aria-valuenow=\"72\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 72%;\"></div>\n                </div>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-right\">\n            <div ngbDropdown placement=\"top-right\">\n              <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                <i class=\"fas fa-ellipsis-v\"></i>\n              </a>\n              <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                <a class=\"dropdown-item\" href=\"#\">Action</a>\n                <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n              </div>\n            </div>\n          </td>\n        </tr>\n        <tr>\n          <th scope=\"row\">\n            <div class=\"media align-items-center\">\n              <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/react.jpg\">\n              </a>\n              <div class=\"media-body\">\n                <span class=\"mb-0 text-sm\">React Material Dashboard</span>\n              </div>\n            </div>\n          </th>\n          <td>\n            $4,400 USD\n          </td>\n          <td>\n            <span class=\"badge badge-dot\">\n              <i class=\"bg-info\"></i> on schedule\n            </span>\n          </td>\n          <td>\n            <div class=\"avatar-group\">\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n            </div>\n          </td>\n          <td>\n            <div class=\"d-flex align-items-center\">\n              <span class=\"mr-2\">90%</span>\n              <div>\n                <div class=\"progress\">\n                  <div class=\"progress-bar bg-info\" role=\"progressbar\" aria-valuenow=\"90\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 90%;\"></div>\n                </div>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-right\">\n            <div ngbDropdown placement=\"top-right\">\n              <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                <i class=\"fas fa-ellipsis-v\"></i>\n              </a>\n              <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                <a class=\"dropdown-item\" href=\"#\">Action</a>\n                <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n              </div>\n            </div>\n          </td>\n        </tr>\n        <tr>\n          <th scope=\"row\">\n            <div class=\"media align-items-center\">\n              <a href=\"#\" class=\"avatar rounded-circle mr-3\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/vue.jpg\">\n              </a>\n              <div class=\"media-body\">\n                <span class=\"mb-0 text-sm\">Vue Paper UI Kit PRO</span>\n              </div>\n            </div>\n          </th>\n          <td>\n            $2,200 USD\n          </td>\n          <td>\n            <span class=\"badge badge-dot mr-4\">\n              <i class=\"bg-success\"></i> completed\n            </span>\n          </td>\n          <td>\n            <div class=\"avatar-group\">\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Ryan Tompson\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-1-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Romina Hadid\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-2-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Alexander Smith\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-3-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n              <a href=\"#\" class=\"avatar avatar-sm\" data-toggle=\"tooltip\" data-original-title=\"Jessica Doe\">\n                <img alt=\"Image placeholder\" src=\"assets/img/theme/team-4-800x800.jpg\" class=\"rounded-circle\">\n              </a>\n            </div>\n          </td>\n          <td>\n            <div class=\"d-flex align-items-center\">\n              <span class=\"mr-2\">100%</span>\n              <div>\n                <div class=\"progress\">\n                  <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%;\"></div>\n                </div>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-right\">\n            <div ngbDropdown placement=\"top-right\">\n              <a class=\"btn btn-sm btn-icon-only text-light\"  ngbDropdownToggle>\n                <i class=\"fas fa-ellipsis-v\"></i>\n              </a>\n              <div ngbDropdownMenu class=\" dropdown-menu-right dropdown-menu-arrow\">\n                <a class=\"dropdown-item\" href=\"#\">Action</a>\n                <a class=\"dropdown-item\" href=\"#\">Another action</a>\n                <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n              </div>\n            </div>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  </div>";
    }
    TablesComponent.prototype.ngOnInit = function () {
    };
    TablesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-tables',
            template: __webpack_require__(/*! ./tables.component.html */ "./src/app/documentation/tables/tables.component.html"),
            styles: [__webpack_require__(/*! ./tables.component.css */ "./src/app/documentation/tables/tables.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], TablesComponent);
    return TablesComponent;
}());



/***/ }),

/***/ "./src/app/documentation/tooltips/tooltips.component.html":
/*!****************************************************************!*\
  !*** ./src/app/documentation/tooltips/tooltips.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Tooltips</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Documentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse plugin.</p>\n<hr>\n<h2 id=\"example\">Example</h2>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <button type=\"button\" class=\"btn btn-sm btn-white\" placement=\"top\" ngbTooltip=\"Tooltip on top\">\n          Tooltip on top\n        </button>\n        <button type=\"button\" class=\"btn btn-sm btn-white\" placement=\"right\" ngbTooltip=\"Tooltip on right\">\n          Tooltip on right\n        </button>\n        <button type=\"button\" class=\"btn btn-sm btn-white\" placement=\"bottom\" ngbTooltip=\"Tooltip on bottom\">\n          Tooltip on bottom\n        </button>\n        <button type=\"button\" class=\"btn btn-sm btn-white\" placement=\"left\" ngbTooltip=\"Tooltip on left\">\n          Tooltip on left\n        </button>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/documentation/tooltips/tooltips.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/documentation/tooltips/tooltips.component.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vdG9vbHRpcHMvdG9vbHRpcHMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/documentation/tooltips/tooltips.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/documentation/tooltips/tooltips.component.ts ***!
  \**************************************************************/
/*! exports provided: TooltipsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TooltipsComponent", function() { return TooltipsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TooltipsComponent = /** @class */ (function () {
    function TooltipsComponent() {
        this.code = "  <button type=\"button\" class=\"btn btn-sm btn-white\" placement=\"top\" ngbTooltip=\"Tooltip on top\">\n      Tooltip on top\n    </button>\n    <button type=\"button\" class=\"btn btn-sm btn-white\" placement=\"right\" ngbTooltip=\"Tooltip on right\">\n      Tooltip on right\n    </button>\n    <button type=\"button\" class=\"btn btn-sm btn-white\" placement=\"bottom\" ngbTooltip=\"Tooltip on bottom\">\n      Tooltip on bottom\n    </button>\n    <button type=\"button\" class=\"btn btn-sm btn-white\" placement=\"left\" ngbTooltip=\"Tooltip on left\">\n      Tooltip on left\n    </button>";
    }
    TooltipsComponent.prototype.ngOnInit = function () {
    };
    TooltipsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-tooltips',
            template: __webpack_require__(/*! ./tooltips.component.html */ "./src/app/documentation/tooltips/tooltips.component.html"),
            styles: [__webpack_require__(/*! ./tooltips.component.scss */ "./src/app/documentation/tooltips/tooltips.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], TooltipsComponent);
    return TooltipsComponent;
}());



/***/ }),

/***/ "./src/app/documentation/tutorial/tutorial.component.html":
/*!****************************************************************!*\
  !*** ./src/app/documentation/tutorial/tutorial.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Argon - Design System</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">An user-friendly, open source and beautiful design system based on Bootstrap 4.</p>\n<hr>\n<!-- <div class=\"text-center mb-5\">\n<img src=\"assets/img/docs/getting-started/overview.svg\" class=\"img-fluid img-center\">\n</div> -->\n<p>We at Creative Tim have always wanted to deliver great tools to all the web developers. We want to see better websites and web apps on the internet. Argon design</p>\n<div class=\"row mt-5\">\n  <div class=\"col-md-4\">\n    <div class=\"icon icon-shape bg-gradient-primary rounded-circle text-white mb-3\">\n      <i class=\"ni ni-html5\"></i>\n    </div>\n    <h6>Developer First</h6>\n    <p class=\"description\">Argon Design System is a \"Developer First\" product, with a lot of variables for colors, fonts, sizes and other elements.</p>\n  </div>\n  <div class=\"col-md-4\">\n    <div class=\"icon icon-shape bg-gradient-danger rounded-circle text-white mb-3\">\n      <i class=\"ni ni-paper-diploma\"></i>\n    </div>\n    <h6>High quality before everything</h6>\n    <p class=\"description\">We are following the latest code standards provided by the guys from Bootstrap, so you will love working with this design system.</p>\n  </div>\n  <div class=\"col-md-4\">\n    <div class=\"icon icon-shape bg-gradient-warning rounded-circle text-white mb-3\">\n      <i class=\"ni ni-favourite-28\"></i>\n    </div>\n    <h6>Community helpers</h6>\n    <p class=\"description\">Since all our products are built on top of Open Source also Argon Design System is released under <a href=\"https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md\">MIT License</a>.</p>\n  </div>\n</div>\n<h3 id=\"resources-and-credits\"><div>Resources and credits<a class=\"anchorjs-link \" href=\"#resources-and-credits\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>This Design System is fully coded and built on top of Open Source, more details here:</p>\n<ul>\n  <li><a href=\"https://www.getbootstrap.com\">Bootstrap 4</a> - Open source front end framework</li>\n  <li><a href=\"https://angular.io/\">Angular</a> - One framework. Mobile & desktop.</li>\n  <li><a href=\"https://fonts.google.com/specimen/Open+Sans\">Open Sans Font</a> - Google’s Open Source typefaces</li>\n  <li><a href=\"https://github.com/stripe/elements-examples/#example-1\">Stripe Elements</a> - Forms, Buttons and Elements</li>\n</ul>\n<h3 id=\"learn-more\"><div>Learn more<a class=\"anchorjs-link \" href=\"#learn-more\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Stay up to date on the development journey and connect with us on:</p>\n<ul>\n  <li>Follow <a href=\"https://twitter.com/creativetim\">Creative Tim on Twitter</a>.</li>\n  <li>Read and subscribe to <a href=\"http://blog.creative-tim.com\">The Official Creative Tim Blog</a>.</li>\n  <li>Follow <a href=\"https://www.instagram.com/creativetimofficial\">Creative Tim on Instagram</a>.</li>\n  <li>Follow <a href=\"https://www.facebook.com/creativetim\">Creative Tim on Facebook</a>.</li>\n</ul>\n"

/***/ }),

/***/ "./src/app/documentation/tutorial/tutorial.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/documentation/tutorial/tutorial.component.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vdHV0b3JpYWwvdHV0b3JpYWwuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/documentation/tutorial/tutorial.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/documentation/tutorial/tutorial.component.ts ***!
  \**************************************************************/
/*! exports provided: TutorialComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TutorialComponent", function() { return TutorialComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TutorialComponent = /** @class */ (function () {
    function TutorialComponent() {
    }
    TutorialComponent.prototype.ngOnInit = function () {
    };
    TutorialComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-tutorial',
            template: __webpack_require__(/*! ./tutorial.component.html */ "./src/app/documentation/tutorial/tutorial.component.html"),
            styles: [__webpack_require__(/*! ./tutorial.component.scss */ "./src/app/documentation/tutorial/tutorial.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], TutorialComponent);
    return TutorialComponent;
}());



/***/ }),

/***/ "./src/app/documentation/typography/typography.component.html":
/*!********************************************************************!*\
  !*** ./src/app/documentation/typography/typography.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ct-page-title\">\n  <h1 class=\"ct-title\" id=\"content\">Typography</h1>\n  <div class=\"avatar-group mt-3\">\n  </div>\n</div>\n<p class=\"ct-lead\">Documentation and examples for Bootstrap typography, including global settings, headings, body text, lists, and more.</p>\n<hr>\n<h2 id=\"headings\"><div>Headings<a class=\"anchorjs-link \" href=\"#headings\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>All HTML headings, <code class=\"highlighter-rouge\">&lt;h1&gt;</code> through <code class=\"highlighter-rouge\">&lt;h6&gt;</code>, are available.</p>\n<table>\n  <thead>\n    <tr>\n      <th>Heading</th>\n      <th>Example</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>\n        <p><code class=\"highlighter-rouge\">&lt;h1&gt;&lt;/h1&gt;</code></p>\n      </td>\n      <td><span class=\"h1\">h1. Bootstrap heading</span></td>\n    </tr>\n    <tr>\n      <td>\n        <p><code class=\"highlighter-rouge\">&lt;h2&gt;&lt;/h2&gt;</code></p>\n      </td>\n      <td><span class=\"h2\">h2. Bootstrap heading</span></td>\n    </tr>\n    <tr>\n      <td>\n        <p><code class=\"highlighter-rouge\">&lt;h3&gt;&lt;/h3&gt;</code></p>\n      </td>\n      <td><span class=\"h3\">h3. Bootstrap heading</span></td>\n    </tr>\n    <tr>\n      <td>\n        <p><code class=\"highlighter-rouge\">&lt;h4&gt;&lt;/h4&gt;</code></p>\n      </td>\n      <td><span class=\"h4\">h4. Bootstrap heading</span></td>\n    </tr>\n    <tr>\n      <td>\n        <p><code class=\"highlighter-rouge\">&lt;h5&gt;&lt;/h5&gt;</code></p>\n      </td>\n      <td><span class=\"h5\">h5. Bootstrap heading</span></td>\n    </tr>\n    <tr>\n      <td>\n        <p><code class=\"highlighter-rouge\">&lt;h6&gt;&lt;/h6&gt;</code></p>\n      </td>\n      <td><span class=\"h6\">h6. Bootstrap heading</span></td>\n    </tr>\n  </tbody>\n</table>\n<figure class=\"highlight\"><pre class=\" language-html\"><code class=\" language-html\" data-lang=\"html\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>h1</span><span class=\"token punctuation\">&gt;</span></span>h1. Bootstrap heading<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>h1</span><span class=\"token punctuation\">&gt;</span></span>\n<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>h2</span><span class=\"token punctuation\">&gt;</span></span>h2. Bootstrap heading<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>h2</span><span class=\"token punctuation\">&gt;</span></span>\n<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>h3</span><span class=\"token punctuation\">&gt;</span></span>h3. Bootstrap heading<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>h3</span><span class=\"token punctuation\">&gt;</span></span>\n<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>h4</span><span class=\"token punctuation\">&gt;</span></span>h4. Bootstrap heading<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>h4</span><span class=\"token punctuation\">&gt;</span></span>\n<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>h5</span><span class=\"token punctuation\">&gt;</span></span>h5. Bootstrap heading<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>h5</span><span class=\"token punctuation\">&gt;</span></span>\n<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>h6</span><span class=\"token punctuation\">&gt;</span></span>h6. Bootstrap heading<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>h6</span><span class=\"token punctuation\">&gt;</span></span></code></pre>\n</figure>\n<p><code class=\"highlighter-rouge\">.h1</code> through <code class=\"highlighter-rouge\">.h6</code> classes are also available, for when you want to match the font styling of a heading but cannot use the associated HTML element.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <div class=\"tab-pane tab-example-result fade show active\" role=\"tabpanel\" aria-labelledby=\"-component-tab\">\n          <p class=\"h1\">h1. Bootstrap heading</p>\n          <p class=\"h2\">h2. Bootstrap heading</p>\n          <p class=\"h3\">h3. Bootstrap heading</p>\n          <p class=\"h4\">h4. Bootstrap heading</p>\n          <p class=\"h5\">h5. Bootstrap heading</p>\n          <p class=\"h6\">h6. Bootstrap heading</p>\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"customizing-headings\"><div>Customizing headings<a class=\"anchorjs-link \" href=\"#customizing-headings\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Use the included utility classes to recreate the small secondary heading text from Bootstrap 3.</p>\n<div class=\"bd-example\">\n  <span class=\"h3\">\n    Fancy display heading\n    <small class=\"text-muted\">With faded secondary text</small>\n  </span>\n</div>\n<pre><code [highlight]=\"code1\"></code></pre>\n\n<h2 id=\"display-headings\"><div>Display headings<a class=\"anchorjs-link \" href=\"#display-headings\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Traditional heading elements are designed to work best in the meat of your page content. When you need a heading to stand out, consider using a <strong>display heading</strong>—a larger, slightly more opinionated heading style.</p>\n<div class=\"bd-example bd-example-type\">\n  <table class=\"table\">\n    <tbody>\n      <tr>\n        <td><span class=\"display-1\">Display 1</span></td>\n      </tr>\n      <tr>\n        <td><span class=\"display-2\">Display 2</span></td>\n      </tr>\n      <tr>\n        <td><span class=\"display-3\">Display 3</span></td>\n      </tr>\n      <tr>\n        <td><span class=\"display-4\">Display 4</span></td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n<pre><code [highlight]=\"code2\"></code></pre>\n\n<h2 id=\"lead\"><div>Lead<a class=\"anchorjs-link \" href=\"#lead\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Make a paragraph stand out by adding <code class=\"highlighter-rouge\">.lead</code>.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n          <p class=\"lead\">\n            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.\n          </p>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code3\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"inline-text-elements\"><div>Inline text elements<a class=\"anchorjs-link \" href=\"#inline-text-elements\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Styling for common inline HTML5 elements.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <p>You can use the mark tag to <mark>highlight</mark> text.</p>\n        <p><del>This line of text is meant to be treated as deleted text.</del></p>\n        <p><s>This line of text is meant to be treated as no longer accurate.</s></p>\n        <p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>\n        <p><u>This line of text will render as underlined</u></p>\n        <p><small>This line of text is meant to be treated as fine print.</small></p>\n        <p><strong>This line rendered as bold text.</strong></p>\n        <p><em>This line rendered as italicized text.</em></p>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code4\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<p><code class=\"highlighter-rouge\">.mark</code> and <code class=\"highlighter-rouge\">.small</code> classes are also available to apply the same styles as <code class=\"highlighter-rouge\">&lt;mark&gt;</code> and <code class=\"highlighter-rouge\">&lt;small&gt;</code> while avoiding any unwanted semantic implications that the tags would bring.</p>\n<p>While not shown above, feel free to use <code class=\"highlighter-rouge\">&lt;b&gt;</code> and <code class=\"highlighter-rouge\">&lt;i&gt;</code> in HTML5. <code class=\"highlighter-rouge\">&lt;b&gt;</code> is meant to highlight words or phrases without conveying additional importance while <code class=\"highlighter-rouge\">&lt;i&gt;</code> is mostly for voice, technical terms, etc.</p>\n<h2 id=\"text-utilities\"><div>Text utilities<a class=\"anchorjs-link \" href=\"#text-utilities\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Change text alignment, transform, style, weight, and color with our <a href=\"argon-dashboard/docs//utilities/text/\">text utilities</a> and <a href=\"argon-dashboard/docs//utilities/colors/\">color utilities</a>.</p>\n<h2 id=\"abbreviations\"><div>Abbreviations<a class=\"anchorjs-link \" href=\"#abbreviations\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>Stylized implementation of HTML’s <code class=\"highlighter-rouge\">&lt;abbr&gt;</code> element for abbreviations and acronyms to show the expanded version on hover. Abbreviations have a default underline and gain a help cursor to provide additional context on hover and to users of assistive technologies.</p>\n<p>Add <code class=\"highlighter-rouge\">.initialism</code> to an abbreviation for a slightly smaller font-size.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <p><abbr title=\"attribute\">attr</abbr></p>\n        <p><abbr title=\"HyperText Markup Language\" class=\"initialism\">HTML</abbr></p>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code5\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"blockquotes\"><div>Blockquotes<a class=\"anchorjs-link \" href=\"#blockquotes\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p>For quoting blocks of content from another source within your document. Wrap <code class=\"highlighter-rouge\">&lt;blockquote class=\"blockquote\"&gt;</code> around any <abbr title=\"HyperText Markup Language\">HTML</abbr> as the quote.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <blockquote class=\"blockquote\">\n          <p class=\"mb-0\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>\n        </blockquote>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code6\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"naming-a-source\"><div>Naming a source<a class=\"anchorjs-link \" href=\"#naming-a-source\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Add a <code class=\"highlighter-rouge\">&lt;footer class=\"blockquote-footer\"&gt;</code> for identifying the source. Wrap the name of the source work in <code class=\"highlighter-rouge\">&lt;cite&gt;</code>.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <blockquote class=\"blockquote\">\n          <p class=\"mb-0\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>\n          <footer class=\"blockquote-footer\">Someone famous in <cite title=\"Source Title\">Source Title</cite></footer>\n        </blockquote>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code7\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"alignment\"><div>Alignment<a class=\"anchorjs-link \" href=\"#alignment\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Use text utilities as needed to change the alignment of your blockquote.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <blockquote class=\"blockquote text-center\">\n          <p class=\"mb-0\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>\n          <footer class=\"blockquote-footer\">Someone famous in <cite title=\"Source Title\">Source Title</cite></footer>\n        </blockquote>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code8\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <blockquote class=\"blockquote text-right\">\n          <p class=\"mb-0\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>\n          <footer class=\"blockquote-footer\">Someone famous in <cite title=\"Source Title\">Source Title</cite></footer>\n        </blockquote>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code9\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"lists\"><div>Lists<a class=\"anchorjs-link \" href=\"#lists\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<h3 id=\"unstyled\"><div>Unstyled<a class=\"anchorjs-link \" href=\"#unstyled\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Remove the default <code class=\"highlighter-rouge\">list-style</code> and left margin on list items (immediate children only). <strong>This only applies to immediate children list items</strong>, meaning you will need to add the class for any nested lists as well.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <ul class=\"list-unstyled\">\n          <li>Lorem ipsum dolor sit amet</li>\n          <li>Consectetur adipiscing elit</li>\n          <li>Integer molestie lorem at massa</li>\n          <li>Facilisis in pretium nisl aliquet</li>\n          <li>Nulla volutpat aliquam velit\n            <ul>\n              <li>Phasellus iaculis neque</li>\n              <li>Purus sodales ultricies</li>\n              <li>Vestibulum laoreet porttitor sem</li>\n              <li>Ac tristique libero volutpat at</li>\n            </ul>\n          </li>\n          <li>Faucibus porta lacus fringilla vel</li>\n          <li>Aenean sit amet erat nunc</li>\n          <li>Eget porttitor lorem</li>\n        </ul>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code10\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"inline\"><div>Inline<a class=\"anchorjs-link \" href=\"#inline\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Remove a list’s bullets and apply some light <code class=\"highlighter-rouge\">margin</code> with a combination of two classes, <code class=\"highlighter-rouge\">.list-inline</code> and <code class=\"highlighter-rouge\">.list-inline-item</code>.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <ul class=\"list-inline\">\n          <li class=\"list-inline-item\">Lorem ipsum</li>\n          <li class=\"list-inline-item\">Phasellus iaculis</li>\n          <li class=\"list-inline-item\">Nulla volutpat</li>\n        </ul>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code11\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h3 id=\"description-list-alignment\"><div>Description list alignment<a class=\"anchorjs-link \" href=\"#description-list-alignment\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h3>\n<p>Align terms and descriptions horizontally by using our grid system’s predefined classes (or semantic mixins). For longer terms, you can optionally add a <code class=\"highlighter-rouge\">.text-truncate</code> class to truncate the text with an ellipsis.</p>\n<div class=\"ct-example\">\n  <ngb-tabset>\n    <ngb-tab id=\"tab-selectbyid1\" title=\"Result\">\n      <ng-template ngbTabContent>\n        <dl class=\"row\">\n          <dt class=\"col-sm-3\">Description lists</dt>\n          <dd class=\"col-sm-9\">A description list is perfect for defining terms.</dd>\n          <dt class=\"col-sm-3\">Euismod</dt>\n          <dd class=\"col-sm-9\">\n            <p>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</p>\n            <p>Donec id elit non mi porta gravida at eget metus.</p>\n          </dd>\n          <dt class=\"col-sm-3\">Malesuada porta</dt>\n          <dd class=\"col-sm-9\">Etiam porta sem malesuada magna mollis euismod.</dd>\n          <dt class=\"col-sm-3 text-truncate\">Truncated term is truncated</dt>\n          <dd class=\"col-sm-9\">Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</dd>\n          <dt class=\"col-sm-3\">Nesting</dt>\n          <dd class=\"col-sm-9\">\n            <dl class=\"row\">\n              <dt class=\"col-sm-4\">Nested definition list</dt>\n              <dd class=\"col-sm-8\">Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc.</dd>\n            </dl>\n          </dd>\n        </dl>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab id=\"tab-selectbyid2\" title=\"HTML\">\n      <ng-template ngbTabContent>\n        <div id=\"grid-html\" class=\"tab-pane fade\" role=\"tabpanel\" aria-labelledby=\"grid-html-tab\">\n          <pre><code [highlight]=\"code12\"></code></pre>\n        </div>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</div>\n<h2 id=\"responsive-typography\"><div>Responsive typography<a class=\"anchorjs-link \" href=\"#responsive-typography\" aria-label=\"Anchor\" data-anchorjs-icon=\"#\" style=\"padding-left: 0.375em;\"></a></div></h2>\n<p><em>Responsive typography</em> refers to scaling text and components by simply adjusting the root element’s <code class=\"highlighter-rouge\">font-size</code> within a series of media queries. Bootstrap doesn’t do this for you, but it’s fairly easy to add if you need it.</p>\n<p>Here’s an example of it in practice. Choose whatever <code class=\"highlighter-rouge\">font-size</code>s and media queries you wish.</p>\n<pre><code [highlight]=\"code13\"></code></pre>\n"

/***/ }),

/***/ "./src/app/documentation/typography/typography.component.scss":
/*!********************************************************************!*\
  !*** ./src/app/documentation/typography/typography.component.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RvY3VtZW50YXRpb24vdHlwb2dyYXBoeS90eXBvZ3JhcGh5LmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/documentation/typography/typography.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/documentation/typography/typography.component.ts ***!
  \******************************************************************/
/*! exports provided: TypographyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TypographyComponent", function() { return TypographyComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TypographyComponent = /** @class */ (function () {
    function TypographyComponent() {
        this.code = "<p class=\"h1\">h1. Bootstrap heading</p>\n  <p class=\"h2\">h2. Bootstrap heading</p>\n  <p class=\"h3\">h3. Bootstrap heading</p>\n  <p class=\"h4\">h4. Bootstrap heading</p>\n  <p class=\"h5\">h5. Bootstrap heading</p>\n  <p class=\"h6\">h6. Bootstrap heading</p>";
        this.code1 = "<span class=\"h3\">\n    Fancy display heading\n    <small class=\"text-muted\">With faded secondary text</small>\n  </span>";
        this.code2 = "<h1 class=\"display-1\">Display 1</h1>\n<h1 class=\"display-2\">Display 2</h1>\n<h1 class=\"display-3\">Display 3</h1>\n<h1 class=\"display-4\">Display 4</h1>";
        this.code3 = "<p class=\"lead\">\n    Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.\n  </p>";
        this.code4 = "<p>You can use the mark tag to <mark>highlight</mark> text.</p>\n  <p><del>This line of text is meant to be treated as deleted text.</del></p>\n  <p><s>This line of text is meant to be treated as no longer accurate.</s></p>\n  <p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>\n  <p><u>This line of text will render as underlined</u></p>\n  <p><small>This line of text is meant to be treated as fine print.</small></p>\n  <p><strong>This line rendered as bold text.</strong></p>\n  <p><em>This line rendered as italicized text.</em></p>";
        this.code5 = "<p><abbr title=\"attribute\">attr</abbr></p>\n  <p><abbr title=\"HyperText Markup Language\" class=\"initialism\">HTML</abbr></p>";
        this.code6 = "<blockquote class=\"blockquote\">\n    <p class=\"mb-0\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>\n  </blockquote>";
        this.code7 = "<blockquote class=\"blockquote\">\n    <p class=\"mb-0\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>\n    <footer class=\"blockquote-footer\">Someone famous in <cite title=\"Source Title\">Source Title</cite></footer>\n  </blockquote>";
        this.code8 = "<blockquote class=\"blockquote text-center\">\n    <p class=\"mb-0\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>\n    <footer class=\"blockquote-footer\">Someone famous in <cite title=\"Source Title\">Source Title</cite></footer>\n  </blockquote>";
        this.code9 = "<blockquote class=\"blockquote text-right\">\n    <p class=\"mb-0\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>\n    <footer class=\"blockquote-footer\">Someone famous in <cite title=\"Source Title\">Source Title</cite></footer>\n  </blockquote>";
        this.code10 = "<ul class=\"list-unstyled\">\n    <li>Lorem ipsum dolor sit amet</li>\n    <li>Consectetur adipiscing elit</li>\n    <li>Integer molestie lorem at massa</li>\n    <li>Facilisis in pretium nisl aliquet</li>\n    <li>Nulla volutpat aliquam velit\n      <ul>\n        <li>Phasellus iaculis neque</li>\n        <li>Purus sodales ultricies</li>\n        <li>Vestibulum laoreet porttitor sem</li>\n        <li>Ac tristique libero volutpat at</li>\n      </ul>\n    </li>\n    <li>Faucibus porta lacus fringilla vel</li>\n    <li>Aenean sit amet erat nunc</li>\n    <li>Eget porttitor lorem</li>\n  </ul>";
        this.code11 = "<ul class=\"list-inline\">\n    <li class=\"list-inline-item\">Lorem ipsum</li>\n    <li class=\"list-inline-item\">Phasellus iaculis</li>\n    <li class=\"list-inline-item\">Nulla volutpat</li>\n  </ul>";
        this.code12 = "<dl class=\"row\">\n    <dt class=\"col-sm-3\">Description lists</dt>\n    <dd class=\"col-sm-9\">A description list is perfect for defining terms.</dd>\n    <dt class=\"col-sm-3\">Euismod</dt>\n    <dd class=\"col-sm-9\">\n      <p>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</p>\n      <p>Donec id elit non mi porta gravida at eget metus.</p>\n    </dd>\n    <dt class=\"col-sm-3\">Malesuada porta</dt>\n    <dd class=\"col-sm-9\">Etiam porta sem malesuada magna mollis euismod.</dd>\n    <dt class=\"col-sm-3 text-truncate\">Truncated term is truncated</dt>\n    <dd class=\"col-sm-9\">Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</dd>\n    <dt class=\"col-sm-3\">Nesting</dt>\n    <dd class=\"col-sm-9\">\n      <dl class=\"row\">\n        <dt class=\"col-sm-4\">Nested definition list</dt>\n        <dd class=\"col-sm-8\">Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc.</dd>\n      </dl>\n    </dd>\n  </dl>";
        this.code13 = "html {\n  font-size: 1rem;\n}\n\n@include media-breakpoint-up(sm) {\n  html {\n  font-size: 1.2rem;\n  }\n}\n\n@include media-breakpoint-up(md) {\n  html {\n  font-size: 1.4rem;\n  }\n}\n\n@include media-breakpoint-up(lg) {\n  html {\n  font-size: 1.6rem;\n  }\n}";
    }
    TypographyComponent.prototype.ngOnInit = function () {
    };
    TypographyComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-typography',
            template: __webpack_require__(/*! ./typography.component.html */ "./src/app/documentation/typography/typography.component.html"),
            styles: [__webpack_require__(/*! ./typography.component.scss */ "./src/app/documentation/typography/typography.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], TypographyComponent);
    return TypographyComponent;
}());



/***/ })

}]);
//# sourceMappingURL=documentation-documentation-module.js.map