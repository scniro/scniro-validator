var chai = require('chai');
var expect = chai.expect;
var v = require('.');

describe('scniro-validator', function () {

    it('should validate email: quick', function () {

        var expected = {valid: true};
        var actual = v.validate('foo@bar.com');
        expect(actual).to.deep.equal(expected);
    });
});

describe('scniro-validator:configuration', function () {

    beforeEach(function () {
        var rules = {
            tld: {
                allowed: ['com'],
                corrections: [
                    {match: 'con', correct: 'com'},
                    {match: 'con.au', correct: 'com'}
                ]
            },
            sld: {
                allowed: ['informz'],
                corrections: []
            }
        }

        v.init(rules);
    });

    it('should validate email: quick', function () {

        var expected1 = {valid: true};
        var expected2 = {valid: false};
        var expected3 = {valid: false};
        var actual1 = v.validate('foo@informz.com');
        var actual2 = v.validate('foo@else.con');
        var actual3 = v.validate('foo@informz.con.au');
        expect(actual1).to.deep.equal(expected1);
        expect(actual2).to.deep.equal(expected2);
        expect(actual3).to.deep.equal(expected3);
    });

    it('should validate email: invalid per allowed TLDs', function () {

        var expected = {valid: false};
        var actual = v.validate('foo@bar.con');
        expect(actual).to.deep.equal(expected);
    });

    it('should fail improperly formatted emails: no correction', function () {

        var improperAddresses = ['xyz@informz.con', 'xyz.informz.con', 'xyz.informz.con.au'];

        improperAddresses.forEach(function (e, i) {

            var expected = {valid: false};
            var actual = v.validate(e);

            expect(actual).to.deep.equal(expected);
        });
    });

    it('should correct incorrect TLD per configuration', function () {

        var expected1 = {valid: false, correction: 'xyz@informz.com'}
        var expected2 = {valid: false, correction: 'xyz@informz.com'}
        var actual1 = v.validate('xyz@informz.con', {tryCorrect: true});
        var actual2 = v.validate('xyz@informz.con.au', {tryCorrect: true});

        expect(actual1).to.deep.equal(expected1);
        expect(actual2).to.deep.equal(expected2);
    });

    it('should correct incorrect TLD per configuration - missing @', function () {

        var expected = {valid: false, correction: 'xyz@informz.com'}
        var actual = v.validate('xyz.informz.con', {tryCorrect: true});

        expect(actual).to.deep.equal(expected);
    });
});