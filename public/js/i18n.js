"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("angular-translate");

require("angular-translate-loader-static-files");

require("angular-translate-storage-cookie");

require("angular-translate-storage-local");

require("date-and-time");

var i18n = angular.module("app.i18n", ["app", "pascalprecht.translate"]);

i18n.config(["$translateProvider", function ($translateProvider) {
  i18n.translateProvider = $translateProvider;
  $translateProvider.useSanitizeValueStrategy("escape").registerAvailableLanguageKeys(["en", "uk"], {
    "en*": "en",
    "uk*": "uk"
  }).useStaticFilesLoader({
    prefix: "/i18n/",
    suffix: ".json"
  }).determinePreferredLanguage().useLocalStorage();
}]);

i18n.run(["$translate", function ($translate) {
  // HACK. $translateProvider.fallbackLanguage Should have been used in i18n.config
  // This caused problems - see
  // https://github.com/angular-translate/angular-translate/issues/1075
  $translate.fallbackLanguage(["en", "uk"]);
}]);

i18n.constant("i18nTemp", {});

i18n.service("i18n", ["$translate", "config", "i18nTemp", "APIProvider", "APIUser", function ($translate, config, i18nTemp, APIProvider, APIUser) {

  date.setLocales("ru", {
    MMMM: ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"],
    MMM: ["янв", "фев", "мар", "апр", "мая", "июня", "июля", "авг", "сен", "окт", "ноя", "дек"],
    dddd: ["Воскресенье", "Понедельник", "Вторник", "Среду", "Четверг", "Пятницу", "Субботу"],
    ddd: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    dd: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    A: ["ночи", "утра", "дня", "вечера"],
    formats: {
      A: function A(d) {
        var h = d.getHours();
        if (h < 4) {
          return this.A[0]; // ночи
        } else if (h < 12) {
          return this.A[1]; // утра
        } else if (h < 17) {
          return this.A[2]; // дня
        }
        return this.A[3]; // вечера
      }
    },
    parsers: {
      h: (function (_h) {
        var _hWrapper = function h(_x, _x2) {
          return _h.apply(this, arguments);
        };

        _hWrapper.toString = function () {
          return _h.toString();
        };

        return _hWrapper;
      })(function (h, a) {
        if (a < 2) {
          // ночи, утра
          return h;
        }
        return h > 11 ? h : h + 12; // дня, вечера
      })
    }
  });

  date.setLocales("uk", {
    MMMM: ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень"],
    MMM: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
    dddd: ["неділя", "понеділок", "вівторок", "середа", "четвер", "п'ятница", "субота"],
    ddd: ["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
    dd: ["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
    A: ["ночі", "ранку", "дня", "вечора"],
    formats: {
      A: function A(d) {
        var h = d.getHours();
        if (h < 4) {
          return this.A[0]; // ночи
        } else if (h < 12) {
          return this.A[1]; // утра
        } else if (h < 17) {
          return this.A[2]; // дня
        }
        return this.A[3]; // вечера
      }
    },
    parsers: {
      h: (function (_h) {
        var _hWrapper = function h(_x, _x2) {
          return _h.apply(this, arguments);
        };

        _hWrapper.toString = function () {
          return _h.toString();
        };

        return _hWrapper;
      })(function (h, a) {
        if (a < 2) {
          // ночи, утра
          return h;
        }
        return h > 11 ? h : h + 12; // дня, вечера
      })
    }
  });

  if (!config.i18n) {
    config.i18n = {};
  }

  for (var locale in config.i18n) {
    i18n.translateProvider.translations(locale, config.i18n[locale]);
  }

  var lang = $translate.use() || "en";
  lang = lang == "ru" ? "en" : lang;
  $translate.use(lang);
  console.log("LOCALE", $translate.use());

  var user = new APIUser();
  user.invokeAll(APIProvider.TRANSLATE_SLOT);

  var localeDef = {
    en_US: {
      decimal: ".",
      thousands: ",",
      grouping: [3],
      currency: ["$", ""],
      dateTime: "%a %b %e %X %Y",
      date: "%m/%d/%Y",
      time: "%H:%M:%S",
      periods: ["AM", "PM"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    en: {
      decimal: ".",
      thousands: ",",
      grouping: [3],
      currency: ["$", ""],
      dateTime: "%a %b %e %X %Y",
      date: "%m/%d/%Y",
      time: "%H:%M:%S",
      periods: ["AM", "PM"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    ru_RU: {
      decimal: ",",
      thousands: " ",
      grouping: [3],
      currency: ["", " руб."],
      dateTime: "%A, %e %B %Y г. %X",
      date: "%d.%m.%Y",
      time: "%H:%M:%S",
      periods: ["AM", "PM"],
      days: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
      shortDays: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
      months: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
      shortMonths: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
    },
    ru: {
      decimal: ",",
      thousands: " ",
      grouping: [3],
      currency: ["", " руб."],
      dateTime: "%A, %e %B %Y г. %X",
      date: "%d.%m.%Y",
      time: "%H:%M:%S",
      periods: ["AM", "PM"],
      days: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
      shortDays: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
      months: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
      shortMonths: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
    },
    uk_UA: {
      decimal: ",",
      thousands: " ",
      grouping: [3],
      currency: ["", " грн."],
      dateTime: "%A, %e %B %Y г. %X",
      date: "%d.%m.%Y",
      time: "%H:%M:%S",
      periods: ["AM", "PM"],
      days: ["неділя", "понеділок", "вівторок", "середа", "четвер", "п'ятница", "субота"],
      shortDays: ["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
      months: ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень"],
      shortMonths: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"]
    },
    uk: {
      decimal: ",",
      thousands: " ",
      grouping: [3],
      currency: ["", " грн."],
      dateTime: "%A, %e %B %Y г. %X",
      date: "%d.%m.%Y",
      time: "%H:%M:%S",
      periods: ["AM", "PM"],
      days: ["неділя", "понеділок", "вівторок", "середа", "четвер", "п'ятница", "субота"],
      shortDays: ["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
      months: ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень"],
      shortMonths: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"]
    }
  };

  var LocalI18n = function LocalI18n(translations) {
    this._table = {};
    if (translations) this._init(translations);
  };

  LocalI18n.prototype = {
    translate: function translate(key) {
      var locale = $translate.use() || "en";
      return this._table[key] ? this._table[key][locale] || this._table[key].en || key : key;
    },
    _init: function _init(translations) {
      for (var i in translations) {
        this._table[translations[i].key] = translations[i].value;
      }
      return this;
    }
  };

  angular.extend(this, {

    locale: function locale() {
      var res = $translate.use() || "en";
      res = res == "ru" ? "en" : res;
      return res;
    },

    translation: function translation(translations) {
      return new LocalI18n()._init(translations);
    },

    localeDef: (function (_localeDef) {
      var _localeDefWrapper = function localeDef() {
        return _localeDef.apply(this, arguments);
      };

      _localeDefWrapper.toString = function () {
        return _localeDef.toString();
      };

      return _localeDefWrapper;
    })(function () {
      var l = this.locale();
      return localeDef[l];
    }),

    formatDate: function formatDate(d, format) {
      if (!format) {
        var locale = $translate.use() || "en";
        d = new Date(d);
        d = d.toLocaleString(locale, { year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        });
        return d;
      }
      date.locale(this.locale());
      return date.format(new Date(d), format);
    },

    timeFormat: function timeFormat(d, format) {
      return this.formatDate(d, format);
    },

    add: function add(locale, translations, nosave) {

      var table = nosave ? i18nTemp : config.i18n;

      table[locale] = table[locale] ? table[locale] : {};
      for (var i in translations) {
        table[locale][i] = translations[i];
      }
      i18n.translateProvider.translations(locale, table[locale]);
      user.invokeAll(APIProvider.TRANSLATE_SLOT);
    },

    remove: function remove(keys) {
      var _this = this;

      for (var i in keys) {
        for (var locale in config.i18n) {
          delete config.i18n[locale][keys[i]];
        }
      }
      $translate.refresh().then(function () {
        _this.refresh();
      });
    },

    refresh: function refresh() {
      for (var locale in config.i18n) {
        i18n.translateProvider.translations(locale, config.i18n[locale]);
      }
      for (var locale in i18nTemp) {
        i18n.translateProvider.translations(locale, i18nTemp[locale]);
      }
      // console.log("BEFORE invokeAll TRANSLATE")
      user.invokeAll(APIProvider.TRANSLATE_SLOT);
    }
  });
}]);
//# sourceMappingURL=i18n.js.map