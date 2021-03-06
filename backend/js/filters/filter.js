myApp.filter('uploadpath', function () {
    return function (input, width, height, style) {
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
        if (input) {
            if (input.indexOf('https://') == -1) {
                return imgpath + "?file=" + input + other;
            } else {
                return input;
            }
        }
    };
});

myApp.filter('showdate', function () {
    return function (input) {
        return new Date(input);
    };
});
myApp.filter('urlencoder', function () {
    return function (input) {
        return window.encodeURIComponent(input);
    };
});

myApp.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

myApp.filter('serverimage', function () {
    return function (input, width, height, style) {
        if (input) {
            if (input.substr(0, 4) == "http") {
                return input;
            } else {
                image = imgpath + "?file=" + input;
                if (width) {
                    image += "&width=" + width;
                }
                if (height) {
                    image += "&height=" + height;
                }
                if (style) {
                    image += "&style=" + style;
                }
                return image;
            }

        } else {
            return "img/logo.png";
        }
    };
});

myApp.filter('convDate', function () {
    return function (input) {
        return new Date(input);
    };
});

myApp.filter('downloadImage', function () {
    return function (input) {
        if (input) {
            return adminurl + "download/" + input;
        } else {
            return "img/logo.png";
        }
    };
});

myApp.filter('ageFilter', function () {
    function calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return function (birthdate) {
        return calculateAge(birthdate);
    };
});
myApp.filter('momentDate', function () {
    return function (date, format) {
        if (!format) {
            format = "Do MMM YYYY, ddd";
        }
        return moment(date).format(format);
    };
});
myApp.filter('capitalize', function () {
    return function (input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    };
});
myApp.filter('firstcapitalize', function () {
    return function (input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    };
})
myApp.filter('formatDate', function () {
    return function (input, type) {

        if (type == 'date') {
            var returnVal = moment(input).format('D MMM, YYYY');
        } else if (type == 'time') {
            var returnVal = moment(input).format('hh:mm a');
        } else if (type == 'year') {
            var returnVal = moment(input).format('YYYY');
        }
        return returnVal;
    };
});

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
myApp.filter('formatTeam', function () {
    return function (team, sets) {
        // console.log("team,set", team, sets);
        _.each(team, function (n) {
            var obj = _.find(sets, ['sfaId', n.sfaId])
            if (!obj) {
                // console.log(n.fullName);
                n.isPlaying = false;
            }
        });
        return team;
    };
});
myApp.filter('englishNumeralCustomDate', function () {
    return function (value) {
        if (value) {
            return moment(new Date(value)).subtract(1, 'days').format("MMM DD,YYYY");
        }
    };
});