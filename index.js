function CorrectiveValidator() {
    var self = this;
    var _config;

    // -- assumption: last character before allowed domain will be replaced with "@" per example => "xyz.informz.con.au <= correct to xyz@informz.com"
    function tryCorrectAddressTo(input) {
        var transformed = null;

        if (input.match(/[@]/i))
            return input;

        _config.sld.allowed.forEach(function (e, i) {

            var match = input.match(new RegExp(e + '\\.', 'i'));

            if (match)
                transformed = input.substr(0, (match.index - 1)) + '@' + input.substr(match.index);
        });

        return transformed;
    }

    function tryCorrectTLD(input) {
        var transformed = null;

        _config.tld.corrections.forEach(function (e, i) {

            var regex = new RegExp(e.match + '$'); // exact end of string via "$"

            if (input.match(regex)) {
                transformed = input.replace(regex, e.correct)
            }
        });

        return transformed;
    }

    self.init = function (config) {
        _config = config;
    }

    self.validate = function (input, options) {

        var result = {};
        var transformed = null;

        // -- default to w3c type="email" regex validation unless restricted to allowed TLDs => https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.multiple
        var quickRegex = _config ?
            new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@' + _config.sld.allowed.join('|') + '+(?:\.(' + _config.tld.allowed.join('|') + '))*$') :
            new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$');

        result.valid = quickRegex.test(input);

        if (!result.valid && (options && options.tryCorrect)) {
            if (!_config)
                throw new Error('configuration required for correction capabilities via .init(``ops``)');

            transformed = tryCorrectTLD(input);

            transformed = tryCorrectAddressTo(transformed || input);

            if (transformed)
                result.correction = transformed;
        }

        return result;
    }
}

module.exports = new CorrectiveValidator();