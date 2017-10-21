additional date-time classes that complement those in js-joda
==============================================

[![npm version](https://badge.fury.io/js/js-joda-locale.svg)](https://badge.fury.io/js/js-joda-locale)
[![Build Status](https://travis-ci.org/js-joda/js-joda-locale.svg?branch=master)](https://travis-ci.org/js-joda/js-joda-locale)
![Sauce Test Status](https://saucelabs.com/buildstatus/js-joda-locale)
[![Coverage Status](https://coveralls.io/repos/js-joda/js-joda-locale/badge.svg?branch=master&service=github)](https://coveralls.io/github/js-joda/js-joda-locale?branch=master)
[![Tested node version](https://img.shields.io/badge/tested_with-current_node_LTS-blue.svg?style=flat)][![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fphueper%2Fjs-joda-locale.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fphueper%2Fjs-joda-locale?ref=badge_shield)
()
[![Greenkeeper badge](https://badges.greenkeeper.io/js-joda/js-joda-locale.svg)](https://greenkeeper.io/)

![Sauce Test Status](https://saucelabs.com/browser-matrix/js-joda-locale.svg)

## Motivation

Implementation of locale specific funtionality for js-joda, providing function not implemented in js-joda core

Especially this implements patterns elements to print and parse locale specific dates

### Usage ###

also see examples in  [examples folder](examples/)

#### Dependencies

The implementation requires cldr data provided by the [cldr-data](https://github.com/rxaviers/cldr-data-npm) package 
and uses [cldrjs](https://github.com/rxaviers/cldrjs) to load the data.
This is necessary to display and parse locale specific data, e.g DayOfWeek or Month Names.

The cldr data is a peer dependency of this package, meaning it must be provided/`npm install`ed by users of `js-joda-locale`

Since the complete cldr-data package can be quite large, the examples and documentation below show ways to dynamically
load or reduce the amount of data needed.

The implementation of `js-joda-locale` also requires `js-joda-timezone` package e.g. to parse and output timezone names and offsets

### Node

Install joda using npm

```shell
    npm install js-joda
    npm install js-joda-timezone
    npm install cldr-data
    npm install cldrjs
    npm install js-joda-locale
```

To enable js-joda-locale you will need to provide it to js-joda as a plugin via the `use` function

```javascript
jsJoda.use('js-joda-locale')
```
since `js-joda-locale` requires `js-joda-timezone` it will also need to be provided, as shown 
in the following examples

NOTE: if you are using a destructuring assignment in ES6, it should only be performed *after* 
the plugin `use` 

### es5

```javascript
    var joda = require('js-joda').use(require('js-joda-timezone')).use(require('../dist/js-joda-locale'));    
    var zdt = joda.ZonedDateTime.of(2016, 1, 1, 0, 0, 0, 0, joda.ZoneId.of('Europe/Berlin'));
    console.log('en_US formatted string:', zdt.format(joda.DateTimeFormatter.ofPattern('eeee MMMM dd yyyy GGGG, hh:mm:ss a zzzz, \'Week \' ww, \'Quarter \' QQQ').withLocale(joda.Locale.US)));
```
also see the [example](examples/usage_node.js)

### es6

```ecmascript 6
   import { use as jsJodaUse } from 'js-joda';
   import jsJodaTimeZone from 'js-joda-timezone';
   import jsJodaLocale from 'js-joda-locale';
   
   const { DateTimeFormatter, Locale, ZonedDateTime, ZoneId } = jsJodaUse(jsJodaTimeZone).use(jsJodaLocale);
   
   const zdt = ZonedDateTime.of(2016, 1, 1, 0, 0, 0, 0, ZoneId.of('Europe/Berlin'));
   console.log('en_US formatted string:', zdt.format(DateTimeFormatter.ofPattern('eeee MMMM dd yyyy GGGG, hh:mm:ss a zzzz, \'Week \' ww, \'Quarter \' QQQ').withLocale(Locale.US)));
```

also see the [example](examples/usage_es6.js)

### Browser
- using requirejs to load
- might also be possible with the bower version of cldr-data
 
see the [example](examples/usage_browser.html)

### Packaging with webpack, minimizing package size
 
Since the cldr-data files can still be quite large, it is possible to only load the files needed for your application

Depending on your usecase it might also be possible to define `cldr-data` as external and dynamically load it. For a 
possible example, see [example/usage_browser.html](examples/usage_browser.html)

Also possible would be to use webpack to reduce the overall size of the cldr-data (similar approaches should work with 
different packaging tools than webpack). 

So the following tips are just one way to get the general idea on how to reduce the size of needed cldr-data, we use this
for our karma testing setup in [karma.conf.js](karma.conf.js)

In `package.json` file define which parts of cldr-data to download and install

(for more information see the [cldr-data-npm docs](https://github.com/rxaviers/cldr-data-npm#locale-coverage))
```
...
"cldr-data-coverage": "core",
"cldr-data-urls-filter": "(cldr-core|cldr-numbers-modern|cldr-dates-modern)"
...
```
(data-coverage `core` only downloads data for the most popular languages / locales, while the urls-filter defines 
which parts of cldr-data are required for `js-joda-locale` to work)

In e.g. webpack.config.js, define which parts/locales of the cldr-data files should end up in the final package

You can for example use the `null-loader` plugin to disable loading cldr-data except for the absolutely required parts/locales

```js
use: [{ loader: 'null-loader' }],
resource: {
    // don't load everything in cldr-data
    test: path.resolve(__dirname, 'node_modules/cldr-data'),
    // except the actual data we need (supplemental and de, en, fr locales from main)
    exclude: [
        path.resolve(__dirname, 'node_modules/cldr-data/main/de'),
        path.resolve(__dirname, 'node_modules/cldr-data/main/en'),
        path.resolve(__dirname, 'node_modules/cldr-data/main/fr'),
        path.resolve(__dirname, 'node_modules/cldr-data/supplemental'),
    ],
}
``` 

These are the minimum reuired parts for js-joda-locale 

- point to the karma webpack config

## Implementation details

provides methods for the following pattern letters of the [DateTimeFormatterBuilder](https://js-joda.github.io/js-joda/esdoc/class/src/format/DateTimeFormatterBuilder.js~DateTimeFormatterBuilder.html#instance-method-appendPattern~DateTimeFormatter.html#static-method-ofPattern) 
and [DateTimeFormatter](https://js-joda.github.io/js-joda/esdoc/class/src/format/DateTimeFormatter.js~DateTimeFormatter.html#static-method-ofPattern) 
classes of js-joda

Localized Text
- `a` for am/pm of day
- `G` for era
- `q`/`Q` for localized quarter of year

Zone Text
- `z` for time zone name
- `Z` for localized ZoneOffsets
- `O` for localized ZoneOffsets

Week Information
- `w` for week-of-year
- `W` for week-of-month
- `Y` for week-based-year
- `e` for localized day-of-week
- `c` for localized day-of-week

some of these are only partially localized, e.g. `Q` only if three or more `Q` are used, one or the `Q` also 
work with plain `js-joda` without using `js-joda-locale`

## License

* js-joda-locale is released under the [BSD 3-clause license](LICENSE)
* The author of joda time and the lead architect of the JSR-310 is Stephen Colebourne.



[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fphueper%2Fjs-joda-locale.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fphueper%2Fjs-joda-locale?ref=badge_large)