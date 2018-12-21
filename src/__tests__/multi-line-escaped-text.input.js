module.exports = pug`div.\n    foo\n    bar${'123\n\'abc\n'.split('\n').join('"').split("'").join('@')}`;
