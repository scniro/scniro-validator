> a small, dependency-free email validator with configurable rules and suggested corrections

### Install

```
npm install scniro-validator --save
```

### Sample usage

```javascript
var v = require('scniro-validator');

var result = v.validate('foo@bar.com');
// {valid: true}
```

### Configuration

validation may be influenced by calling optional `.init` with a configuration object

```javascript
var rules = {
    tld: {
        allowed: ['com']
    sdl: {
        allowed: ['bar']
    }
}

var result = v.validate('foo@baz.com');
// {valid: false}
```

### Corrections

validation will include a suggested correction base on `corrections` defined via `tld` and `sld` supplied `match` objects ([top-level domain](https://en.wikipedia.org/wiki/Top-level_domain) and [second-level domain](https://en.wikipedia.org/wiki/Second-level_domain), respectively). Specify this via `tryCorrect`.

```javascript
var rules = {
    tld: {
        allowed: ['com'],
        corrections: [
            {match: 'con.au', correct: 'com'}
        ]
    }
}

var result = v.validate('foo@bar.con.au', {tryCorrect: true});
// {valid: false, correction: 'foo@bar.com'}
```

or a _really_ barged example

```javascript
var rules = {
    tld: {
        allowed: ['com'],
        corrections: [
            {match: 'con.au', correct: 'com'}
        ]
    },
    sdl: {
        allowed: ['bar']
    }
}

var result = v.validate('foo.bar.con.au', {tryCorrect: true});
// {valid: false, correction: 'foo@bar.com'}
```


### Note

e-mail validation is a [rabbit whole]( http://haacked.com/archive/2007/08/21/i-knew-how-to-validate-an-email-address-until-i.aspx/), and this tool does not aim to be a silver bullet. The capability of this tool is influenced from the [w3c `type="email"`](https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.multiple) validation, ships with some extensibility specific to a business defined problem, and is pessimistic in nature. For a less problem-specific validation tool, check out the awesome [mailcheck.js](https://github.com/mailcheck/mailcheck)