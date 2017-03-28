/*
 * @copyright (c) 2017, Philipp Thuerwaechter & Pattrick Hueper
 * @license BSD-3-Clause (see LICENSE.md in the root directory of this source tree)
 */


export default class Locale {
    constructor(language, country = '') {
        this._language = language;
        this._country = country;
    }

    language() {
        return this._language;
    }

    country() {
        return this._country;
    }

    localeString() {
        if (this._country.length > 0) {
            return `${this._language}_${this._country}`;
        } else {
            return `${this._language}`;
        }
    }

    toString() {
        return this.localeString();
    }
}

export function _init() {
    //some samples/consts
    Locale.ENGLISH = new Locale('en');
    Locale.US = new Locale('en_US');
    Locale.UK = new Locale('en_GB');
    Locale.CANADA = new Locale('en_CA');
    Locale.FRENCH = new Locale('fr');
    Locale.FRANCE = new Locale('fr_FR');
    Locale.GERMAN = new Locale('de');
    Locale.GERMANY = new Locale('de_DE');
}
