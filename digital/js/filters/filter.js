// JavaScript Document
myApp.filter('myFilter', function () {
    // In the return function, we must pass in a single parameter which will be the data we will work on.
    // We have the ability to support multiple other parameters that can be passed into the filter optionally
    return function (input, optional1, optional2) {

        var output;

        // Do filter work here
        return output;
    };

});

myApp.filter('indianCurrency', function () {
    return function (getNumber) {
        if (!isNaN(getNumber)) {
            var numberArr = getNumber.toString().split('.');
            var lastThreeDigits = numberArr[0].substring(numberArr[0].length - 3);
            var otherDigits = numberArr[0].substring(0, numberArr[0].length - 3);
            if (otherDigits != '') {
                lastThreeDigits = ',' + lastThreeDigits;
            }
            var finalNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits;
            if (numberArr.length > 1) {
                var getRoundedDecimal = parseInt(numberArr[1].substring(0, 2)) + 1;
                finalNumber += "." + getRoundedDecimal;
            }
            // return '₹' + finalNumber;
            return finalNumber;
        }
    }
});

// TRUNCATE
myApp.filter('truncate', function () {
    return function (value, limit) {
        if (value) {
            if (value.length < limit) {
                return value;
            } else {
                return value.slice(0, limit) + "...";
            }
        }
    }
});
// TRUNCATE END

// SERVER IMAGE
myApp.filter('serverimage', function () {
    return function (image, width, height, style) {
        var other = "";
        if (width && width !== "") {
            other += "&width=" + width;
        }
        if (height && height !== "") {
            other += "&height=" + height;
        }
        if (style && style !== "") {
            other += "&style=" + style;
        }
        if (image && image !== null) {
            return adminurl + "upload/readFile?file=" + image + other;
        } else {
            return undefined;
        }
    };
});

// SERVER IMAGE  END

myApp.filter('firstcapitalize', function () {
    return function (input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    };
});

myApp.filter('capitalize', function () {
    return function (input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function (txt) {
            return txt.toUpperCase();
        }) : '';
    };
});