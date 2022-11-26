(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/semver/internal/constants.js
  var require_constants = __commonJS({
    "node_modules/semver/internal/constants.js"(exports, module) {
      var SEMVER_SPEC_VERSION = "2.0.0";
      var MAX_LENGTH = 256;
      var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
      var MAX_SAFE_COMPONENT_LENGTH = 16;
      module.exports = {
        SEMVER_SPEC_VERSION,
        MAX_LENGTH,
        MAX_SAFE_INTEGER,
        MAX_SAFE_COMPONENT_LENGTH
      };
    }
  });

  // node_modules/semver/internal/debug.js
  var require_debug = __commonJS({
    "node_modules/semver/internal/debug.js"(exports, module) {
      var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
      };
      module.exports = debug;
    }
  });

  // node_modules/semver/internal/re.js
  var require_re = __commonJS({
    "node_modules/semver/internal/re.js"(exports, module) {
      var { MAX_SAFE_COMPONENT_LENGTH } = require_constants();
      var debug = require_debug();
      exports = module.exports = {};
      var re = exports.re = [];
      var src = exports.src = [];
      var t2 = exports.t = {};
      var R = 0;
      var createToken = (name, value, isGlobal) => {
        const index = R++;
        debug(name, index, value);
        t2[name] = index;
        src[index] = value;
        re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      };
      createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
      createToken("NUMERICIDENTIFIERLOOSE", "[0-9]+");
      createToken("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-][a-zA-Z0-9-]*");
      createToken("MAINVERSION", `(${src[t2.NUMERICIDENTIFIER]})\\.(${src[t2.NUMERICIDENTIFIER]})\\.(${src[t2.NUMERICIDENTIFIER]})`);
      createToken("MAINVERSIONLOOSE", `(${src[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src[t2.NUMERICIDENTIFIERLOOSE]})`);
      createToken("PRERELEASEIDENTIFIER", `(?:${src[t2.NUMERICIDENTIFIER]}|${src[t2.NONNUMERICIDENTIFIER]})`);
      createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t2.NUMERICIDENTIFIERLOOSE]}|${src[t2.NONNUMERICIDENTIFIER]})`);
      createToken("PRERELEASE", `(?:-(${src[t2.PRERELEASEIDENTIFIER]}(?:\\.${src[t2.PRERELEASEIDENTIFIER]})*))`);
      createToken("PRERELEASELOOSE", `(?:-?(${src[t2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t2.PRERELEASEIDENTIFIERLOOSE]})*))`);
      createToken("BUILDIDENTIFIER", "[0-9A-Za-z-]+");
      createToken("BUILD", `(?:\\+(${src[t2.BUILDIDENTIFIER]}(?:\\.${src[t2.BUILDIDENTIFIER]})*))`);
      createToken("FULLPLAIN", `v?${src[t2.MAINVERSION]}${src[t2.PRERELEASE]}?${src[t2.BUILD]}?`);
      createToken("FULL", `^${src[t2.FULLPLAIN]}$`);
      createToken("LOOSEPLAIN", `[v=\\s]*${src[t2.MAINVERSIONLOOSE]}${src[t2.PRERELEASELOOSE]}?${src[t2.BUILD]}?`);
      createToken("LOOSE", `^${src[t2.LOOSEPLAIN]}$`);
      createToken("GTLT", "((?:<|>)?=?)");
      createToken("XRANGEIDENTIFIERLOOSE", `${src[t2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
      createToken("XRANGEIDENTIFIER", `${src[t2.NUMERICIDENTIFIER]}|x|X|\\*`);
      createToken("XRANGEPLAIN", `[v=\\s]*(${src[t2.XRANGEIDENTIFIER]})(?:\\.(${src[t2.XRANGEIDENTIFIER]})(?:\\.(${src[t2.XRANGEIDENTIFIER]})(?:${src[t2.PRERELEASE]})?${src[t2.BUILD]}?)?)?`);
      createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:${src[t2.PRERELEASELOOSE]})?${src[t2.BUILD]}?)?)?`);
      createToken("XRANGE", `^${src[t2.GTLT]}\\s*${src[t2.XRANGEPLAIN]}$`);
      createToken("XRANGELOOSE", `^${src[t2.GTLT]}\\s*${src[t2.XRANGEPLAINLOOSE]}$`);
      createToken("COERCE", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:$|[^\\d])`);
      createToken("COERCERTL", src[t2.COERCE], true);
      createToken("LONETILDE", "(?:~>?)");
      createToken("TILDETRIM", `(\\s*)${src[t2.LONETILDE]}\\s+`, true);
      exports.tildeTrimReplace = "$1~";
      createToken("TILDE", `^${src[t2.LONETILDE]}${src[t2.XRANGEPLAIN]}$`);
      createToken("TILDELOOSE", `^${src[t2.LONETILDE]}${src[t2.XRANGEPLAINLOOSE]}$`);
      createToken("LONECARET", "(?:\\^)");
      createToken("CARETTRIM", `(\\s*)${src[t2.LONECARET]}\\s+`, true);
      exports.caretTrimReplace = "$1^";
      createToken("CARET", `^${src[t2.LONECARET]}${src[t2.XRANGEPLAIN]}$`);
      createToken("CARETLOOSE", `^${src[t2.LONECARET]}${src[t2.XRANGEPLAINLOOSE]}$`);
      createToken("COMPARATORLOOSE", `^${src[t2.GTLT]}\\s*(${src[t2.LOOSEPLAIN]})$|^$`);
      createToken("COMPARATOR", `^${src[t2.GTLT]}\\s*(${src[t2.FULLPLAIN]})$|^$`);
      createToken("COMPARATORTRIM", `(\\s*)${src[t2.GTLT]}\\s*(${src[t2.LOOSEPLAIN]}|${src[t2.XRANGEPLAIN]})`, true);
      exports.comparatorTrimReplace = "$1$2$3";
      createToken("HYPHENRANGE", `^\\s*(${src[t2.XRANGEPLAIN]})\\s+-\\s+(${src[t2.XRANGEPLAIN]})\\s*$`);
      createToken("HYPHENRANGELOOSE", `^\\s*(${src[t2.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t2.XRANGEPLAINLOOSE]})\\s*$`);
      createToken("STAR", "(<|>)?=?\\s*\\*");
      createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
      createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
    }
  });

  // node_modules/semver/internal/parse-options.js
  var require_parse_options = __commonJS({
    "node_modules/semver/internal/parse-options.js"(exports, module) {
      var opts = ["includePrerelease", "loose", "rtl"];
      var parseOptions = (options) => !options ? {} : typeof options !== "object" ? { loose: true } : opts.filter((k2) => options[k2]).reduce((o2, k2) => {
        o2[k2] = true;
        return o2;
      }, {});
      module.exports = parseOptions;
    }
  });

  // node_modules/semver/internal/identifiers.js
  var require_identifiers = __commonJS({
    "node_modules/semver/internal/identifiers.js"(exports, module) {
      var numeric = /^[0-9]+$/;
      var compareIdentifiers = (a2, b) => {
        const anum = numeric.test(a2);
        const bnum = numeric.test(b);
        if (anum && bnum) {
          a2 = +a2;
          b = +b;
        }
        return a2 === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a2 < b ? -1 : 1;
      };
      var rcompareIdentifiers = (a2, b) => compareIdentifiers(b, a2);
      module.exports = {
        compareIdentifiers,
        rcompareIdentifiers
      };
    }
  });

  // node_modules/semver/classes/semver.js
  var require_semver = __commonJS({
    "node_modules/semver/classes/semver.js"(exports, module) {
      var debug = require_debug();
      var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
      var { re, t: t2 } = require_re();
      var parseOptions = require_parse_options();
      var { compareIdentifiers } = require_identifiers();
      var SemVer2 = class {
        constructor(version, options) {
          options = parseOptions(options);
          if (version instanceof SemVer2) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
              return version;
            } else {
              version = version.version;
            }
          } else if (typeof version !== "string") {
            throw new TypeError(`Invalid Version: ${version}`);
          }
          if (version.length > MAX_LENGTH) {
            throw new TypeError(
              `version is longer than ${MAX_LENGTH} characters`
            );
          }
          debug("SemVer", version, options);
          this.options = options;
          this.loose = !!options.loose;
          this.includePrerelease = !!options.includePrerelease;
          const m2 = version.trim().match(options.loose ? re[t2.LOOSE] : re[t2.FULL]);
          if (!m2) {
            throw new TypeError(`Invalid Version: ${version}`);
          }
          this.raw = version;
          this.major = +m2[1];
          this.minor = +m2[2];
          this.patch = +m2[3];
          if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError("Invalid major version");
          }
          if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError("Invalid minor version");
          }
          if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError("Invalid patch version");
          }
          if (!m2[4]) {
            this.prerelease = [];
          } else {
            this.prerelease = m2[4].split(".").map((id) => {
              if (/^[0-9]+$/.test(id)) {
                const num = +id;
                if (num >= 0 && num < MAX_SAFE_INTEGER) {
                  return num;
                }
              }
              return id;
            });
          }
          this.build = m2[5] ? m2[5].split(".") : [];
          this.format();
        }
        format() {
          this.version = `${this.major}.${this.minor}.${this.patch}`;
          if (this.prerelease.length) {
            this.version += `-${this.prerelease.join(".")}`;
          }
          return this.version;
        }
        toString() {
          return this.version;
        }
        compare(other) {
          debug("SemVer.compare", this.version, this.options, other);
          if (!(other instanceof SemVer2)) {
            if (typeof other === "string" && other === this.version) {
              return 0;
            }
            other = new SemVer2(other, this.options);
          }
          if (other.version === this.version) {
            return 0;
          }
          return this.compareMain(other) || this.comparePre(other);
        }
        compareMain(other) {
          if (!(other instanceof SemVer2)) {
            other = new SemVer2(other, this.options);
          }
          return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
        }
        comparePre(other) {
          if (!(other instanceof SemVer2)) {
            other = new SemVer2(other, this.options);
          }
          if (this.prerelease.length && !other.prerelease.length) {
            return -1;
          } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
          } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
          }
          let i2 = 0;
          do {
            const a2 = this.prerelease[i2];
            const b = other.prerelease[i2];
            debug("prerelease compare", i2, a2, b);
            if (a2 === void 0 && b === void 0) {
              return 0;
            } else if (b === void 0) {
              return 1;
            } else if (a2 === void 0) {
              return -1;
            } else if (a2 === b) {
              continue;
            } else {
              return compareIdentifiers(a2, b);
            }
          } while (++i2);
        }
        compareBuild(other) {
          if (!(other instanceof SemVer2)) {
            other = new SemVer2(other, this.options);
          }
          let i2 = 0;
          do {
            const a2 = this.build[i2];
            const b = other.build[i2];
            debug("prerelease compare", i2, a2, b);
            if (a2 === void 0 && b === void 0) {
              return 0;
            } else if (b === void 0) {
              return 1;
            } else if (a2 === void 0) {
              return -1;
            } else if (a2 === b) {
              continue;
            } else {
              return compareIdentifiers(a2, b);
            }
          } while (++i2);
        }
        inc(release, identifier) {
          switch (release) {
            case "premajor":
              this.prerelease.length = 0;
              this.patch = 0;
              this.minor = 0;
              this.major++;
              this.inc("pre", identifier);
              break;
            case "preminor":
              this.prerelease.length = 0;
              this.patch = 0;
              this.minor++;
              this.inc("pre", identifier);
              break;
            case "prepatch":
              this.prerelease.length = 0;
              this.inc("patch", identifier);
              this.inc("pre", identifier);
              break;
            case "prerelease":
              if (this.prerelease.length === 0) {
                this.inc("patch", identifier);
              }
              this.inc("pre", identifier);
              break;
            case "major":
              if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
                this.major++;
              }
              this.minor = 0;
              this.patch = 0;
              this.prerelease = [];
              break;
            case "minor":
              if (this.patch !== 0 || this.prerelease.length === 0) {
                this.minor++;
              }
              this.patch = 0;
              this.prerelease = [];
              break;
            case "patch":
              if (this.prerelease.length === 0) {
                this.patch++;
              }
              this.prerelease = [];
              break;
            case "pre":
              if (this.prerelease.length === 0) {
                this.prerelease = [0];
              } else {
                let i2 = this.prerelease.length;
                while (--i2 >= 0) {
                  if (typeof this.prerelease[i2] === "number") {
                    this.prerelease[i2]++;
                    i2 = -2;
                  }
                }
                if (i2 === -1) {
                  this.prerelease.push(0);
                }
              }
              if (identifier) {
                if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                  if (isNaN(this.prerelease[1])) {
                    this.prerelease = [identifier, 0];
                  }
                } else {
                  this.prerelease = [identifier, 0];
                }
              }
              break;
            default:
              throw new Error(`invalid increment argument: ${release}`);
          }
          this.format();
          this.raw = this.version;
          return this;
        }
      };
      module.exports = SemVer2;
    }
  });

  // node_modules/semver/functions/parse.js
  var require_parse = __commonJS({
    "node_modules/semver/functions/parse.js"(exports, module) {
      var { MAX_LENGTH } = require_constants();
      var { re, t: t2 } = require_re();
      var SemVer2 = require_semver();
      var parseOptions = require_parse_options();
      var parse2 = (version, options) => {
        options = parseOptions(options);
        if (version instanceof SemVer2) {
          return version;
        }
        if (typeof version !== "string") {
          return null;
        }
        if (version.length > MAX_LENGTH) {
          return null;
        }
        const r2 = options.loose ? re[t2.LOOSE] : re[t2.FULL];
        if (!r2.test(version)) {
          return null;
        }
        try {
          return new SemVer2(version, options);
        } catch (er) {
          return null;
        }
      };
      module.exports = parse2;
    }
  });

  // node_modules/semver/functions/valid.js
  var require_valid = __commonJS({
    "node_modules/semver/functions/valid.js"(exports, module) {
      var parse2 = require_parse();
      var valid = (version, options) => {
        const v = parse2(version, options);
        return v ? v.version : null;
      };
      module.exports = valid;
    }
  });

  // node_modules/semver/functions/clean.js
  var require_clean = __commonJS({
    "node_modules/semver/functions/clean.js"(exports, module) {
      var parse2 = require_parse();
      var clean = (version, options) => {
        const s2 = parse2(version.trim().replace(/^[=v]+/, ""), options);
        return s2 ? s2.version : null;
      };
      module.exports = clean;
    }
  });

  // node_modules/semver/functions/inc.js
  var require_inc = __commonJS({
    "node_modules/semver/functions/inc.js"(exports, module) {
      var SemVer2 = require_semver();
      var inc = (version, release, options, identifier) => {
        if (typeof options === "string") {
          identifier = options;
          options = void 0;
        }
        try {
          return new SemVer2(
            version instanceof SemVer2 ? version.version : version,
            options
          ).inc(release, identifier).version;
        } catch (er) {
          return null;
        }
      };
      module.exports = inc;
    }
  });

  // node_modules/semver/functions/compare.js
  var require_compare = __commonJS({
    "node_modules/semver/functions/compare.js"(exports, module) {
      var SemVer2 = require_semver();
      var compare = (a2, b, loose) => new SemVer2(a2, loose).compare(new SemVer2(b, loose));
      module.exports = compare;
    }
  });

  // node_modules/semver/functions/eq.js
  var require_eq = __commonJS({
    "node_modules/semver/functions/eq.js"(exports, module) {
      var compare = require_compare();
      var eq = (a2, b, loose) => compare(a2, b, loose) === 0;
      module.exports = eq;
    }
  });

  // node_modules/semver/functions/diff.js
  var require_diff = __commonJS({
    "node_modules/semver/functions/diff.js"(exports, module) {
      var parse2 = require_parse();
      var eq = require_eq();
      var diff = (version1, version2) => {
        if (eq(version1, version2)) {
          return null;
        } else {
          const v1 = parse2(version1);
          const v2 = parse2(version2);
          const hasPre = v1.prerelease.length || v2.prerelease.length;
          const prefix = hasPre ? "pre" : "";
          const defaultResult = hasPre ? "prerelease" : "";
          for (const key in v1) {
            if (key === "major" || key === "minor" || key === "patch") {
              if (v1[key] !== v2[key]) {
                return prefix + key;
              }
            }
          }
          return defaultResult;
        }
      };
      module.exports = diff;
    }
  });

  // node_modules/semver/functions/major.js
  var require_major = __commonJS({
    "node_modules/semver/functions/major.js"(exports, module) {
      var SemVer2 = require_semver();
      var major = (a2, loose) => new SemVer2(a2, loose).major;
      module.exports = major;
    }
  });

  // node_modules/semver/functions/minor.js
  var require_minor = __commonJS({
    "node_modules/semver/functions/minor.js"(exports, module) {
      var SemVer2 = require_semver();
      var minor = (a2, loose) => new SemVer2(a2, loose).minor;
      module.exports = minor;
    }
  });

  // node_modules/semver/functions/patch.js
  var require_patch = __commonJS({
    "node_modules/semver/functions/patch.js"(exports, module) {
      var SemVer2 = require_semver();
      var patch = (a2, loose) => new SemVer2(a2, loose).patch;
      module.exports = patch;
    }
  });

  // node_modules/semver/functions/prerelease.js
  var require_prerelease = __commonJS({
    "node_modules/semver/functions/prerelease.js"(exports, module) {
      var parse2 = require_parse();
      var prerelease = (version, options) => {
        const parsed = parse2(version, options);
        return parsed && parsed.prerelease.length ? parsed.prerelease : null;
      };
      module.exports = prerelease;
    }
  });

  // node_modules/semver/functions/rcompare.js
  var require_rcompare = __commonJS({
    "node_modules/semver/functions/rcompare.js"(exports, module) {
      var compare = require_compare();
      var rcompare = (a2, b, loose) => compare(b, a2, loose);
      module.exports = rcompare;
    }
  });

  // node_modules/semver/functions/compare-loose.js
  var require_compare_loose = __commonJS({
    "node_modules/semver/functions/compare-loose.js"(exports, module) {
      var compare = require_compare();
      var compareLoose = (a2, b) => compare(a2, b, true);
      module.exports = compareLoose;
    }
  });

  // node_modules/semver/functions/compare-build.js
  var require_compare_build = __commonJS({
    "node_modules/semver/functions/compare-build.js"(exports, module) {
      var SemVer2 = require_semver();
      var compareBuild = (a2, b, loose) => {
        const versionA = new SemVer2(a2, loose);
        const versionB = new SemVer2(b, loose);
        return versionA.compare(versionB) || versionA.compareBuild(versionB);
      };
      module.exports = compareBuild;
    }
  });

  // node_modules/semver/functions/sort.js
  var require_sort = __commonJS({
    "node_modules/semver/functions/sort.js"(exports, module) {
      var compareBuild = require_compare_build();
      var sort = (list, loose) => list.sort((a2, b) => compareBuild(a2, b, loose));
      module.exports = sort;
    }
  });

  // node_modules/semver/functions/rsort.js
  var require_rsort = __commonJS({
    "node_modules/semver/functions/rsort.js"(exports, module) {
      var compareBuild = require_compare_build();
      var rsort = (list, loose) => list.sort((a2, b) => compareBuild(b, a2, loose));
      module.exports = rsort;
    }
  });

  // node_modules/semver/functions/gt.js
  var require_gt = __commonJS({
    "node_modules/semver/functions/gt.js"(exports, module) {
      var compare = require_compare();
      var gt = (a2, b, loose) => compare(a2, b, loose) > 0;
      module.exports = gt;
    }
  });

  // node_modules/semver/functions/lt.js
  var require_lt = __commonJS({
    "node_modules/semver/functions/lt.js"(exports, module) {
      var compare = require_compare();
      var lt = (a2, b, loose) => compare(a2, b, loose) < 0;
      module.exports = lt;
    }
  });

  // node_modules/semver/functions/neq.js
  var require_neq = __commonJS({
    "node_modules/semver/functions/neq.js"(exports, module) {
      var compare = require_compare();
      var neq = (a2, b, loose) => compare(a2, b, loose) !== 0;
      module.exports = neq;
    }
  });

  // node_modules/semver/functions/gte.js
  var require_gte = __commonJS({
    "node_modules/semver/functions/gte.js"(exports, module) {
      var compare = require_compare();
      var gte = (a2, b, loose) => compare(a2, b, loose) >= 0;
      module.exports = gte;
    }
  });

  // node_modules/semver/functions/lte.js
  var require_lte = __commonJS({
    "node_modules/semver/functions/lte.js"(exports, module) {
      var compare = require_compare();
      var lte = (a2, b, loose) => compare(a2, b, loose) <= 0;
      module.exports = lte;
    }
  });

  // node_modules/semver/functions/cmp.js
  var require_cmp = __commonJS({
    "node_modules/semver/functions/cmp.js"(exports, module) {
      var eq = require_eq();
      var neq = require_neq();
      var gt = require_gt();
      var gte = require_gte();
      var lt = require_lt();
      var lte = require_lte();
      var cmp = (a2, op, b, loose) => {
        switch (op) {
          case "===":
            if (typeof a2 === "object") {
              a2 = a2.version;
            }
            if (typeof b === "object") {
              b = b.version;
            }
            return a2 === b;
          case "!==":
            if (typeof a2 === "object") {
              a2 = a2.version;
            }
            if (typeof b === "object") {
              b = b.version;
            }
            return a2 !== b;
          case "":
          case "=":
          case "==":
            return eq(a2, b, loose);
          case "!=":
            return neq(a2, b, loose);
          case ">":
            return gt(a2, b, loose);
          case ">=":
            return gte(a2, b, loose);
          case "<":
            return lt(a2, b, loose);
          case "<=":
            return lte(a2, b, loose);
          default:
            throw new TypeError(`Invalid operator: ${op}`);
        }
      };
      module.exports = cmp;
    }
  });

  // node_modules/semver/functions/coerce.js
  var require_coerce = __commonJS({
    "node_modules/semver/functions/coerce.js"(exports, module) {
      var SemVer2 = require_semver();
      var parse2 = require_parse();
      var { re, t: t2 } = require_re();
      var coerce = (version, options) => {
        if (version instanceof SemVer2) {
          return version;
        }
        if (typeof version === "number") {
          version = String(version);
        }
        if (typeof version !== "string") {
          return null;
        }
        options = options || {};
        let match = null;
        if (!options.rtl) {
          match = version.match(re[t2.COERCE]);
        } else {
          let next;
          while ((next = re[t2.COERCERTL].exec(version)) && (!match || match.index + match[0].length !== version.length)) {
            if (!match || next.index + next[0].length !== match.index + match[0].length) {
              match = next;
            }
            re[t2.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
          }
          re[t2.COERCERTL].lastIndex = -1;
        }
        if (match === null) {
          return null;
        }
        return parse2(`${match[2]}.${match[3] || "0"}.${match[4] || "0"}`, options);
      };
      module.exports = coerce;
    }
  });

  // node_modules/yallist/iterator.js
  var require_iterator = __commonJS({
    "node_modules/yallist/iterator.js"(exports, module) {
      "use strict";
      module.exports = function(Yallist) {
        Yallist.prototype[Symbol.iterator] = function* () {
          for (let walker = this.head; walker; walker = walker.next) {
            yield walker.value;
          }
        };
      };
    }
  });

  // node_modules/yallist/yallist.js
  var require_yallist = __commonJS({
    "node_modules/yallist/yallist.js"(exports, module) {
      "use strict";
      module.exports = Yallist;
      Yallist.Node = Node;
      Yallist.create = Yallist;
      function Yallist(list) {
        var self = this;
        if (!(self instanceof Yallist)) {
          self = new Yallist();
        }
        self.tail = null;
        self.head = null;
        self.length = 0;
        if (list && typeof list.forEach === "function") {
          list.forEach(function(item) {
            self.push(item);
          });
        } else if (arguments.length > 0) {
          for (var i2 = 0, l2 = arguments.length; i2 < l2; i2++) {
            self.push(arguments[i2]);
          }
        }
        return self;
      }
      Yallist.prototype.removeNode = function(node) {
        if (node.list !== this) {
          throw new Error("removing node which does not belong to this list");
        }
        var next = node.next;
        var prev = node.prev;
        if (next) {
          next.prev = prev;
        }
        if (prev) {
          prev.next = next;
        }
        if (node === this.head) {
          this.head = next;
        }
        if (node === this.tail) {
          this.tail = prev;
        }
        node.list.length--;
        node.next = null;
        node.prev = null;
        node.list = null;
        return next;
      };
      Yallist.prototype.unshiftNode = function(node) {
        if (node === this.head) {
          return;
        }
        if (node.list) {
          node.list.removeNode(node);
        }
        var head = this.head;
        node.list = this;
        node.next = head;
        if (head) {
          head.prev = node;
        }
        this.head = node;
        if (!this.tail) {
          this.tail = node;
        }
        this.length++;
      };
      Yallist.prototype.pushNode = function(node) {
        if (node === this.tail) {
          return;
        }
        if (node.list) {
          node.list.removeNode(node);
        }
        var tail = this.tail;
        node.list = this;
        node.prev = tail;
        if (tail) {
          tail.next = node;
        }
        this.tail = node;
        if (!this.head) {
          this.head = node;
        }
        this.length++;
      };
      Yallist.prototype.push = function() {
        for (var i2 = 0, l2 = arguments.length; i2 < l2; i2++) {
          push(this, arguments[i2]);
        }
        return this.length;
      };
      Yallist.prototype.unshift = function() {
        for (var i2 = 0, l2 = arguments.length; i2 < l2; i2++) {
          unshift(this, arguments[i2]);
        }
        return this.length;
      };
      Yallist.prototype.pop = function() {
        if (!this.tail) {
          return void 0;
        }
        var res = this.tail.value;
        this.tail = this.tail.prev;
        if (this.tail) {
          this.tail.next = null;
        } else {
          this.head = null;
        }
        this.length--;
        return res;
      };
      Yallist.prototype.shift = function() {
        if (!this.head) {
          return void 0;
        }
        var res = this.head.value;
        this.head = this.head.next;
        if (this.head) {
          this.head.prev = null;
        } else {
          this.tail = null;
        }
        this.length--;
        return res;
      };
      Yallist.prototype.forEach = function(fn, thisp) {
        thisp = thisp || this;
        for (var walker = this.head, i2 = 0; walker !== null; i2++) {
          fn.call(thisp, walker.value, i2, this);
          walker = walker.next;
        }
      };
      Yallist.prototype.forEachReverse = function(fn, thisp) {
        thisp = thisp || this;
        for (var walker = this.tail, i2 = this.length - 1; walker !== null; i2--) {
          fn.call(thisp, walker.value, i2, this);
          walker = walker.prev;
        }
      };
      Yallist.prototype.get = function(n2) {
        for (var i2 = 0, walker = this.head; walker !== null && i2 < n2; i2++) {
          walker = walker.next;
        }
        if (i2 === n2 && walker !== null) {
          return walker.value;
        }
      };
      Yallist.prototype.getReverse = function(n2) {
        for (var i2 = 0, walker = this.tail; walker !== null && i2 < n2; i2++) {
          walker = walker.prev;
        }
        if (i2 === n2 && walker !== null) {
          return walker.value;
        }
      };
      Yallist.prototype.map = function(fn, thisp) {
        thisp = thisp || this;
        var res = new Yallist();
        for (var walker = this.head; walker !== null; ) {
          res.push(fn.call(thisp, walker.value, this));
          walker = walker.next;
        }
        return res;
      };
      Yallist.prototype.mapReverse = function(fn, thisp) {
        thisp = thisp || this;
        var res = new Yallist();
        for (var walker = this.tail; walker !== null; ) {
          res.push(fn.call(thisp, walker.value, this));
          walker = walker.prev;
        }
        return res;
      };
      Yallist.prototype.reduce = function(fn, initial) {
        var acc;
        var walker = this.head;
        if (arguments.length > 1) {
          acc = initial;
        } else if (this.head) {
          walker = this.head.next;
          acc = this.head.value;
        } else {
          throw new TypeError("Reduce of empty list with no initial value");
        }
        for (var i2 = 0; walker !== null; i2++) {
          acc = fn(acc, walker.value, i2);
          walker = walker.next;
        }
        return acc;
      };
      Yallist.prototype.reduceReverse = function(fn, initial) {
        var acc;
        var walker = this.tail;
        if (arguments.length > 1) {
          acc = initial;
        } else if (this.tail) {
          walker = this.tail.prev;
          acc = this.tail.value;
        } else {
          throw new TypeError("Reduce of empty list with no initial value");
        }
        for (var i2 = this.length - 1; walker !== null; i2--) {
          acc = fn(acc, walker.value, i2);
          walker = walker.prev;
        }
        return acc;
      };
      Yallist.prototype.toArray = function() {
        var arr = new Array(this.length);
        for (var i2 = 0, walker = this.head; walker !== null; i2++) {
          arr[i2] = walker.value;
          walker = walker.next;
        }
        return arr;
      };
      Yallist.prototype.toArrayReverse = function() {
        var arr = new Array(this.length);
        for (var i2 = 0, walker = this.tail; walker !== null; i2++) {
          arr[i2] = walker.value;
          walker = walker.prev;
        }
        return arr;
      };
      Yallist.prototype.slice = function(from, to) {
        to = to || this.length;
        if (to < 0) {
          to += this.length;
        }
        from = from || 0;
        if (from < 0) {
          from += this.length;
        }
        var ret = new Yallist();
        if (to < from || to < 0) {
          return ret;
        }
        if (from < 0) {
          from = 0;
        }
        if (to > this.length) {
          to = this.length;
        }
        for (var i2 = 0, walker = this.head; walker !== null && i2 < from; i2++) {
          walker = walker.next;
        }
        for (; walker !== null && i2 < to; i2++, walker = walker.next) {
          ret.push(walker.value);
        }
        return ret;
      };
      Yallist.prototype.sliceReverse = function(from, to) {
        to = to || this.length;
        if (to < 0) {
          to += this.length;
        }
        from = from || 0;
        if (from < 0) {
          from += this.length;
        }
        var ret = new Yallist();
        if (to < from || to < 0) {
          return ret;
        }
        if (from < 0) {
          from = 0;
        }
        if (to > this.length) {
          to = this.length;
        }
        for (var i2 = this.length, walker = this.tail; walker !== null && i2 > to; i2--) {
          walker = walker.prev;
        }
        for (; walker !== null && i2 > from; i2--, walker = walker.prev) {
          ret.push(walker.value);
        }
        return ret;
      };
      Yallist.prototype.splice = function(start, deleteCount, ...nodes) {
        if (start > this.length) {
          start = this.length - 1;
        }
        if (start < 0) {
          start = this.length + start;
        }
        for (var i2 = 0, walker = this.head; walker !== null && i2 < start; i2++) {
          walker = walker.next;
        }
        var ret = [];
        for (var i2 = 0; walker && i2 < deleteCount; i2++) {
          ret.push(walker.value);
          walker = this.removeNode(walker);
        }
        if (walker === null) {
          walker = this.tail;
        }
        if (walker !== this.head && walker !== this.tail) {
          walker = walker.prev;
        }
        for (var i2 = 0; i2 < nodes.length; i2++) {
          walker = insert(this, walker, nodes[i2]);
        }
        return ret;
      };
      Yallist.prototype.reverse = function() {
        var head = this.head;
        var tail = this.tail;
        for (var walker = head; walker !== null; walker = walker.prev) {
          var p2 = walker.prev;
          walker.prev = walker.next;
          walker.next = p2;
        }
        this.head = tail;
        this.tail = head;
        return this;
      };
      function insert(self, node, value) {
        var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);
        if (inserted.next === null) {
          self.tail = inserted;
        }
        if (inserted.prev === null) {
          self.head = inserted;
        }
        self.length++;
        return inserted;
      }
      function push(self, item) {
        self.tail = new Node(item, self.tail, null, self);
        if (!self.head) {
          self.head = self.tail;
        }
        self.length++;
      }
      function unshift(self, item) {
        self.head = new Node(item, null, self.head, self);
        if (!self.tail) {
          self.tail = self.head;
        }
        self.length++;
      }
      function Node(value, prev, next, list) {
        if (!(this instanceof Node)) {
          return new Node(value, prev, next, list);
        }
        this.list = list;
        this.value = value;
        if (prev) {
          prev.next = this;
          this.prev = prev;
        } else {
          this.prev = null;
        }
        if (next) {
          next.prev = this;
          this.next = next;
        } else {
          this.next = null;
        }
      }
      try {
        require_iterator()(Yallist);
      } catch (er) {
      }
    }
  });

  // node_modules/lru-cache/index.js
  var require_lru_cache = __commonJS({
    "node_modules/lru-cache/index.js"(exports, module) {
      "use strict";
      var Yallist = require_yallist();
      var MAX = Symbol("max");
      var LENGTH = Symbol("length");
      var LENGTH_CALCULATOR = Symbol("lengthCalculator");
      var ALLOW_STALE = Symbol("allowStale");
      var MAX_AGE = Symbol("maxAge");
      var DISPOSE = Symbol("dispose");
      var NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet");
      var LRU_LIST = Symbol("lruList");
      var CACHE = Symbol("cache");
      var UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet");
      var naiveLength = () => 1;
      var LRUCache = class {
        constructor(options) {
          if (typeof options === "number")
            options = { max: options };
          if (!options)
            options = {};
          if (options.max && (typeof options.max !== "number" || options.max < 0))
            throw new TypeError("max must be a non-negative number");
          const max = this[MAX] = options.max || Infinity;
          const lc = options.length || naiveLength;
          this[LENGTH_CALCULATOR] = typeof lc !== "function" ? naiveLength : lc;
          this[ALLOW_STALE] = options.stale || false;
          if (options.maxAge && typeof options.maxAge !== "number")
            throw new TypeError("maxAge must be a number");
          this[MAX_AGE] = options.maxAge || 0;
          this[DISPOSE] = options.dispose;
          this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
          this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
          this.reset();
        }
        set max(mL) {
          if (typeof mL !== "number" || mL < 0)
            throw new TypeError("max must be a non-negative number");
          this[MAX] = mL || Infinity;
          trim(this);
        }
        get max() {
          return this[MAX];
        }
        set allowStale(allowStale) {
          this[ALLOW_STALE] = !!allowStale;
        }
        get allowStale() {
          return this[ALLOW_STALE];
        }
        set maxAge(mA) {
          if (typeof mA !== "number")
            throw new TypeError("maxAge must be a non-negative number");
          this[MAX_AGE] = mA;
          trim(this);
        }
        get maxAge() {
          return this[MAX_AGE];
        }
        set lengthCalculator(lC) {
          if (typeof lC !== "function")
            lC = naiveLength;
          if (lC !== this[LENGTH_CALCULATOR]) {
            this[LENGTH_CALCULATOR] = lC;
            this[LENGTH] = 0;
            this[LRU_LIST].forEach((hit) => {
              hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
              this[LENGTH] += hit.length;
            });
          }
          trim(this);
        }
        get lengthCalculator() {
          return this[LENGTH_CALCULATOR];
        }
        get length() {
          return this[LENGTH];
        }
        get itemCount() {
          return this[LRU_LIST].length;
        }
        rforEach(fn, thisp) {
          thisp = thisp || this;
          for (let walker = this[LRU_LIST].tail; walker !== null; ) {
            const prev = walker.prev;
            forEachStep(this, fn, walker, thisp);
            walker = prev;
          }
        }
        forEach(fn, thisp) {
          thisp = thisp || this;
          for (let walker = this[LRU_LIST].head; walker !== null; ) {
            const next = walker.next;
            forEachStep(this, fn, walker, thisp);
            walker = next;
          }
        }
        keys() {
          return this[LRU_LIST].toArray().map((k2) => k2.key);
        }
        values() {
          return this[LRU_LIST].toArray().map((k2) => k2.value);
        }
        reset() {
          if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
            this[LRU_LIST].forEach((hit) => this[DISPOSE](hit.key, hit.value));
          }
          this[CACHE] = /* @__PURE__ */ new Map();
          this[LRU_LIST] = new Yallist();
          this[LENGTH] = 0;
        }
        dump() {
          return this[LRU_LIST].map((hit) => isStale(this, hit) ? false : {
            k: hit.key,
            v: hit.value,
            e: hit.now + (hit.maxAge || 0)
          }).toArray().filter((h2) => h2);
        }
        dumpLru() {
          return this[LRU_LIST];
        }
        set(key, value, maxAge) {
          maxAge = maxAge || this[MAX_AGE];
          if (maxAge && typeof maxAge !== "number")
            throw new TypeError("maxAge must be a number");
          const now = maxAge ? Date.now() : 0;
          const len = this[LENGTH_CALCULATOR](value, key);
          if (this[CACHE].has(key)) {
            if (len > this[MAX]) {
              del(this, this[CACHE].get(key));
              return false;
            }
            const node = this[CACHE].get(key);
            const item = node.value;
            if (this[DISPOSE]) {
              if (!this[NO_DISPOSE_ON_SET])
                this[DISPOSE](key, item.value);
            }
            item.now = now;
            item.maxAge = maxAge;
            item.value = value;
            this[LENGTH] += len - item.length;
            item.length = len;
            this.get(key);
            trim(this);
            return true;
          }
          const hit = new Entry(key, value, len, now, maxAge);
          if (hit.length > this[MAX]) {
            if (this[DISPOSE])
              this[DISPOSE](key, value);
            return false;
          }
          this[LENGTH] += hit.length;
          this[LRU_LIST].unshift(hit);
          this[CACHE].set(key, this[LRU_LIST].head);
          trim(this);
          return true;
        }
        has(key) {
          if (!this[CACHE].has(key))
            return false;
          const hit = this[CACHE].get(key).value;
          return !isStale(this, hit);
        }
        get(key) {
          return get(this, key, true);
        }
        peek(key) {
          return get(this, key, false);
        }
        pop() {
          const node = this[LRU_LIST].tail;
          if (!node)
            return null;
          del(this, node);
          return node.value;
        }
        del(key) {
          del(this, this[CACHE].get(key));
        }
        load(arr) {
          this.reset();
          const now = Date.now();
          for (let l2 = arr.length - 1; l2 >= 0; l2--) {
            const hit = arr[l2];
            const expiresAt = hit.e || 0;
            if (expiresAt === 0)
              this.set(hit.k, hit.v);
            else {
              const maxAge = expiresAt - now;
              if (maxAge > 0) {
                this.set(hit.k, hit.v, maxAge);
              }
            }
          }
        }
        prune() {
          this[CACHE].forEach((value, key) => get(this, key, false));
        }
      };
      var get = (self, key, doUse) => {
        const node = self[CACHE].get(key);
        if (node) {
          const hit = node.value;
          if (isStale(self, hit)) {
            del(self, node);
            if (!self[ALLOW_STALE])
              return void 0;
          } else {
            if (doUse) {
              if (self[UPDATE_AGE_ON_GET])
                node.value.now = Date.now();
              self[LRU_LIST].unshiftNode(node);
            }
          }
          return hit.value;
        }
      };
      var isStale = (self, hit) => {
        if (!hit || !hit.maxAge && !self[MAX_AGE])
          return false;
        const diff = Date.now() - hit.now;
        return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
      };
      var trim = (self) => {
        if (self[LENGTH] > self[MAX]) {
          for (let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null; ) {
            const prev = walker.prev;
            del(self, walker);
            walker = prev;
          }
        }
      };
      var del = (self, node) => {
        if (node) {
          const hit = node.value;
          if (self[DISPOSE])
            self[DISPOSE](hit.key, hit.value);
          self[LENGTH] -= hit.length;
          self[CACHE].delete(hit.key);
          self[LRU_LIST].removeNode(node);
        }
      };
      var Entry = class {
        constructor(key, value, length, now, maxAge) {
          this.key = key;
          this.value = value;
          this.length = length;
          this.now = now;
          this.maxAge = maxAge || 0;
        }
      };
      var forEachStep = (self, fn, node, thisp) => {
        let hit = node.value;
        if (isStale(self, hit)) {
          del(self, node);
          if (!self[ALLOW_STALE])
            hit = void 0;
        }
        if (hit)
          fn.call(thisp, hit.value, hit.key, self);
      };
      module.exports = LRUCache;
    }
  });

  // node_modules/semver/classes/range.js
  var require_range = __commonJS({
    "node_modules/semver/classes/range.js"(exports, module) {
      var Range = class {
        constructor(range, options) {
          options = parseOptions(options);
          if (range instanceof Range) {
            if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
              return range;
            } else {
              return new Range(range.raw, options);
            }
          }
          if (range instanceof Comparator) {
            this.raw = range.value;
            this.set = [[range]];
            this.format();
            return this;
          }
          this.options = options;
          this.loose = !!options.loose;
          this.includePrerelease = !!options.includePrerelease;
          this.raw = range;
          this.set = range.split("||").map((r2) => this.parseRange(r2.trim())).filter((c3) => c3.length);
          if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${range}`);
          }
          if (this.set.length > 1) {
            const first = this.set[0];
            this.set = this.set.filter((c3) => !isNullSet(c3[0]));
            if (this.set.length === 0) {
              this.set = [first];
            } else if (this.set.length > 1) {
              for (const c3 of this.set) {
                if (c3.length === 1 && isAny(c3[0])) {
                  this.set = [c3];
                  break;
                }
              }
            }
          }
          this.format();
        }
        format() {
          this.range = this.set.map((comps) => {
            return comps.join(" ").trim();
          }).join("||").trim();
          return this.range;
        }
        toString() {
          return this.range;
        }
        parseRange(range) {
          range = range.trim();
          const memoOpts = Object.keys(this.options).join(",");
          const memoKey = `parseRange:${memoOpts}:${range}`;
          const cached = cache2.get(memoKey);
          if (cached) {
            return cached;
          }
          const loose = this.options.loose;
          const hr = loose ? re[t2.HYPHENRANGELOOSE] : re[t2.HYPHENRANGE];
          range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
          debug("hyphen replace", range);
          range = range.replace(re[t2.COMPARATORTRIM], comparatorTrimReplace);
          debug("comparator trim", range);
          range = range.replace(re[t2.TILDETRIM], tildeTrimReplace);
          range = range.replace(re[t2.CARETTRIM], caretTrimReplace);
          range = range.split(/\s+/).join(" ");
          let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
          if (loose) {
            rangeList = rangeList.filter((comp) => {
              debug("loose invalid filter", comp, this.options);
              return !!comp.match(re[t2.COMPARATORLOOSE]);
            });
          }
          debug("range list", rangeList);
          const rangeMap = /* @__PURE__ */ new Map();
          const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
          for (const comp of comparators) {
            if (isNullSet(comp)) {
              return [comp];
            }
            rangeMap.set(comp.value, comp);
          }
          if (rangeMap.size > 1 && rangeMap.has("")) {
            rangeMap.delete("");
          }
          const result = [...rangeMap.values()];
          cache2.set(memoKey, result);
          return result;
        }
        intersects(range, options) {
          if (!(range instanceof Range)) {
            throw new TypeError("a Range is required");
          }
          return this.set.some((thisComparators) => {
            return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
              return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
                return rangeComparators.every((rangeComparator) => {
                  return thisComparator.intersects(rangeComparator, options);
                });
              });
            });
          });
        }
        test(version) {
          if (!version) {
            return false;
          }
          if (typeof version === "string") {
            try {
              version = new SemVer2(version, this.options);
            } catch (er) {
              return false;
            }
          }
          for (let i2 = 0; i2 < this.set.length; i2++) {
            if (testSet(this.set[i2], version, this.options)) {
              return true;
            }
          }
          return false;
        }
      };
      module.exports = Range;
      var LRU = require_lru_cache();
      var cache2 = new LRU({ max: 1e3 });
      var parseOptions = require_parse_options();
      var Comparator = require_comparator();
      var debug = require_debug();
      var SemVer2 = require_semver();
      var {
        re,
        t: t2,
        comparatorTrimReplace,
        tildeTrimReplace,
        caretTrimReplace
      } = require_re();
      var isNullSet = (c3) => c3.value === "<0.0.0-0";
      var isAny = (c3) => c3.value === "";
      var isSatisfiable = (comparators, options) => {
        let result = true;
        const remainingComparators = comparators.slice();
        let testComparator = remainingComparators.pop();
        while (result && remainingComparators.length) {
          result = remainingComparators.every((otherComparator) => {
            return testComparator.intersects(otherComparator, options);
          });
          testComparator = remainingComparators.pop();
        }
        return result;
      };
      var parseComparator = (comp, options) => {
        debug("comp", comp, options);
        comp = replaceCarets(comp, options);
        debug("caret", comp);
        comp = replaceTildes(comp, options);
        debug("tildes", comp);
        comp = replaceXRanges(comp, options);
        debug("xrange", comp);
        comp = replaceStars(comp, options);
        debug("stars", comp);
        return comp;
      };
      var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
      var replaceTildes = (comp, options) => comp.trim().split(/\s+/).map((c3) => {
        return replaceTilde(c3, options);
      }).join(" ");
      var replaceTilde = (comp, options) => {
        const r2 = options.loose ? re[t2.TILDELOOSE] : re[t2.TILDE];
        return comp.replace(r2, (_, M, m2, p2, pr) => {
          debug("tilde", comp, _, M, m2, p2, pr);
          let ret;
          if (isX(M)) {
            ret = "";
          } else if (isX(m2)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
          } else if (isX(p2)) {
            ret = `>=${M}.${m2}.0 <${M}.${+m2 + 1}.0-0`;
          } else if (pr) {
            debug("replaceTilde pr", pr);
            ret = `>=${M}.${m2}.${p2}-${pr} <${M}.${+m2 + 1}.0-0`;
          } else {
            ret = `>=${M}.${m2}.${p2} <${M}.${+m2 + 1}.0-0`;
          }
          debug("tilde return", ret);
          return ret;
        });
      };
      var replaceCarets = (comp, options) => comp.trim().split(/\s+/).map((c3) => {
        return replaceCaret(c3, options);
      }).join(" ");
      var replaceCaret = (comp, options) => {
        debug("caret", comp, options);
        const r2 = options.loose ? re[t2.CARETLOOSE] : re[t2.CARET];
        const z = options.includePrerelease ? "-0" : "";
        return comp.replace(r2, (_, M, m2, p2, pr) => {
          debug("caret", comp, _, M, m2, p2, pr);
          let ret;
          if (isX(M)) {
            ret = "";
          } else if (isX(m2)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
          } else if (isX(p2)) {
            if (M === "0") {
              ret = `>=${M}.${m2}.0${z} <${M}.${+m2 + 1}.0-0`;
            } else {
              ret = `>=${M}.${m2}.0${z} <${+M + 1}.0.0-0`;
            }
          } else if (pr) {
            debug("replaceCaret pr", pr);
            if (M === "0") {
              if (m2 === "0") {
                ret = `>=${M}.${m2}.${p2}-${pr} <${M}.${m2}.${+p2 + 1}-0`;
              } else {
                ret = `>=${M}.${m2}.${p2}-${pr} <${M}.${+m2 + 1}.0-0`;
              }
            } else {
              ret = `>=${M}.${m2}.${p2}-${pr} <${+M + 1}.0.0-0`;
            }
          } else {
            debug("no pr");
            if (M === "0") {
              if (m2 === "0") {
                ret = `>=${M}.${m2}.${p2}${z} <${M}.${m2}.${+p2 + 1}-0`;
              } else {
                ret = `>=${M}.${m2}.${p2}${z} <${M}.${+m2 + 1}.0-0`;
              }
            } else {
              ret = `>=${M}.${m2}.${p2} <${+M + 1}.0.0-0`;
            }
          }
          debug("caret return", ret);
          return ret;
        });
      };
      var replaceXRanges = (comp, options) => {
        debug("replaceXRanges", comp, options);
        return comp.split(/\s+/).map((c3) => {
          return replaceXRange(c3, options);
        }).join(" ");
      };
      var replaceXRange = (comp, options) => {
        comp = comp.trim();
        const r2 = options.loose ? re[t2.XRANGELOOSE] : re[t2.XRANGE];
        return comp.replace(r2, (ret, gtlt, M, m2, p2, pr) => {
          debug("xRange", comp, ret, gtlt, M, m2, p2, pr);
          const xM = isX(M);
          const xm = xM || isX(m2);
          const xp = xm || isX(p2);
          const anyX = xp;
          if (gtlt === "=" && anyX) {
            gtlt = "";
          }
          pr = options.includePrerelease ? "-0" : "";
          if (xM) {
            if (gtlt === ">" || gtlt === "<") {
              ret = "<0.0.0-0";
            } else {
              ret = "*";
            }
          } else if (gtlt && anyX) {
            if (xm) {
              m2 = 0;
            }
            p2 = 0;
            if (gtlt === ">") {
              gtlt = ">=";
              if (xm) {
                M = +M + 1;
                m2 = 0;
                p2 = 0;
              } else {
                m2 = +m2 + 1;
                p2 = 0;
              }
            } else if (gtlt === "<=") {
              gtlt = "<";
              if (xm) {
                M = +M + 1;
              } else {
                m2 = +m2 + 1;
              }
            }
            if (gtlt === "<") {
              pr = "-0";
            }
            ret = `${gtlt + M}.${m2}.${p2}${pr}`;
          } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
          } else if (xp) {
            ret = `>=${M}.${m2}.0${pr} <${M}.${+m2 + 1}.0-0`;
          }
          debug("xRange return", ret);
          return ret;
        });
      };
      var replaceStars = (comp, options) => {
        debug("replaceStars", comp, options);
        return comp.trim().replace(re[t2.STAR], "");
      };
      var replaceGTE0 = (comp, options) => {
        debug("replaceGTE0", comp, options);
        return comp.trim().replace(re[options.includePrerelease ? t2.GTE0PRE : t2.GTE0], "");
      };
      var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) => {
        if (isX(fM)) {
          from = "";
        } else if (isX(fm)) {
          from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
        } else if (isX(fp)) {
          from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
        } else if (fpr) {
          from = `>=${from}`;
        } else {
          from = `>=${from}${incPr ? "-0" : ""}`;
        }
        if (isX(tM)) {
          to = "";
        } else if (isX(tm)) {
          to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
          to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
          to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (incPr) {
          to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
          to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
      };
      var testSet = (set, version, options) => {
        for (let i2 = 0; i2 < set.length; i2++) {
          if (!set[i2].test(version)) {
            return false;
          }
        }
        if (version.prerelease.length && !options.includePrerelease) {
          for (let i2 = 0; i2 < set.length; i2++) {
            debug(set[i2].semver);
            if (set[i2].semver === Comparator.ANY) {
              continue;
            }
            if (set[i2].semver.prerelease.length > 0) {
              const allowed = set[i2].semver;
              if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
                return true;
              }
            }
          }
          return false;
        }
        return true;
      };
    }
  });

  // node_modules/semver/classes/comparator.js
  var require_comparator = __commonJS({
    "node_modules/semver/classes/comparator.js"(exports, module) {
      var ANY = Symbol("SemVer ANY");
      var Comparator = class {
        static get ANY() {
          return ANY;
        }
        constructor(comp, options) {
          options = parseOptions(options);
          if (comp instanceof Comparator) {
            if (comp.loose === !!options.loose) {
              return comp;
            } else {
              comp = comp.value;
            }
          }
          debug("comparator", comp, options);
          this.options = options;
          this.loose = !!options.loose;
          this.parse(comp);
          if (this.semver === ANY) {
            this.value = "";
          } else {
            this.value = this.operator + this.semver.version;
          }
          debug("comp", this);
        }
        parse(comp) {
          const r2 = this.options.loose ? re[t2.COMPARATORLOOSE] : re[t2.COMPARATOR];
          const m2 = comp.match(r2);
          if (!m2) {
            throw new TypeError(`Invalid comparator: ${comp}`);
          }
          this.operator = m2[1] !== void 0 ? m2[1] : "";
          if (this.operator === "=") {
            this.operator = "";
          }
          if (!m2[2]) {
            this.semver = ANY;
          } else {
            this.semver = new SemVer2(m2[2], this.options.loose);
          }
        }
        toString() {
          return this.value;
        }
        test(version) {
          debug("Comparator.test", version, this.options.loose);
          if (this.semver === ANY || version === ANY) {
            return true;
          }
          if (typeof version === "string") {
            try {
              version = new SemVer2(version, this.options);
            } catch (er) {
              return false;
            }
          }
          return cmp(version, this.operator, this.semver, this.options);
        }
        intersects(comp, options) {
          if (!(comp instanceof Comparator)) {
            throw new TypeError("a Comparator is required");
          }
          if (!options || typeof options !== "object") {
            options = {
              loose: !!options,
              includePrerelease: false
            };
          }
          if (this.operator === "") {
            if (this.value === "") {
              return true;
            }
            return new Range(comp.value, options).test(this.value);
          } else if (comp.operator === "") {
            if (comp.value === "") {
              return true;
            }
            return new Range(this.value, options).test(comp.semver);
          }
          const sameDirectionIncreasing = (this.operator === ">=" || this.operator === ">") && (comp.operator === ">=" || comp.operator === ">");
          const sameDirectionDecreasing = (this.operator === "<=" || this.operator === "<") && (comp.operator === "<=" || comp.operator === "<");
          const sameSemVer = this.semver.version === comp.semver.version;
          const differentDirectionsInclusive = (this.operator === ">=" || this.operator === "<=") && (comp.operator === ">=" || comp.operator === "<=");
          const oppositeDirectionsLessThan = cmp(this.semver, "<", comp.semver, options) && (this.operator === ">=" || this.operator === ">") && (comp.operator === "<=" || comp.operator === "<");
          const oppositeDirectionsGreaterThan = cmp(this.semver, ">", comp.semver, options) && (this.operator === "<=" || this.operator === "<") && (comp.operator === ">=" || comp.operator === ">");
          return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
        }
      };
      module.exports = Comparator;
      var parseOptions = require_parse_options();
      var { re, t: t2 } = require_re();
      var cmp = require_cmp();
      var debug = require_debug();
      var SemVer2 = require_semver();
      var Range = require_range();
    }
  });

  // node_modules/semver/functions/satisfies.js
  var require_satisfies = __commonJS({
    "node_modules/semver/functions/satisfies.js"(exports, module) {
      var Range = require_range();
      var satisfies = (version, range, options) => {
        try {
          range = new Range(range, options);
        } catch (er) {
          return false;
        }
        return range.test(version);
      };
      module.exports = satisfies;
    }
  });

  // node_modules/semver/ranges/to-comparators.js
  var require_to_comparators = __commonJS({
    "node_modules/semver/ranges/to-comparators.js"(exports, module) {
      var Range = require_range();
      var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c3) => c3.value).join(" ").trim().split(" "));
      module.exports = toComparators;
    }
  });

  // node_modules/semver/ranges/max-satisfying.js
  var require_max_satisfying = __commonJS({
    "node_modules/semver/ranges/max-satisfying.js"(exports, module) {
      var SemVer2 = require_semver();
      var Range = require_range();
      var maxSatisfying2 = (versions, range, options) => {
        let max = null;
        let maxSV = null;
        let rangeObj = null;
        try {
          rangeObj = new Range(range, options);
        } catch (er) {
          return null;
        }
        versions.forEach((v) => {
          if (rangeObj.test(v)) {
            if (!max || maxSV.compare(v) === -1) {
              max = v;
              maxSV = new SemVer2(max, options);
            }
          }
        });
        return max;
      };
      module.exports = maxSatisfying2;
    }
  });

  // node_modules/semver/ranges/min-satisfying.js
  var require_min_satisfying = __commonJS({
    "node_modules/semver/ranges/min-satisfying.js"(exports, module) {
      var SemVer2 = require_semver();
      var Range = require_range();
      var minSatisfying = (versions, range, options) => {
        let min = null;
        let minSV = null;
        let rangeObj = null;
        try {
          rangeObj = new Range(range, options);
        } catch (er) {
          return null;
        }
        versions.forEach((v) => {
          if (rangeObj.test(v)) {
            if (!min || minSV.compare(v) === 1) {
              min = v;
              minSV = new SemVer2(min, options);
            }
          }
        });
        return min;
      };
      module.exports = minSatisfying;
    }
  });

  // node_modules/semver/ranges/min-version.js
  var require_min_version = __commonJS({
    "node_modules/semver/ranges/min-version.js"(exports, module) {
      var SemVer2 = require_semver();
      var Range = require_range();
      var gt = require_gt();
      var minVersion = (range, loose) => {
        range = new Range(range, loose);
        let minver = new SemVer2("0.0.0");
        if (range.test(minver)) {
          return minver;
        }
        minver = new SemVer2("0.0.0-0");
        if (range.test(minver)) {
          return minver;
        }
        minver = null;
        for (let i2 = 0; i2 < range.set.length; ++i2) {
          const comparators = range.set[i2];
          let setMin = null;
          comparators.forEach((comparator) => {
            const compver = new SemVer2(comparator.semver.version);
            switch (comparator.operator) {
              case ">":
                if (compver.prerelease.length === 0) {
                  compver.patch++;
                } else {
                  compver.prerelease.push(0);
                }
                compver.raw = compver.format();
              case "":
              case ">=":
                if (!setMin || gt(compver, setMin)) {
                  setMin = compver;
                }
                break;
              case "<":
              case "<=":
                break;
              default:
                throw new Error(`Unexpected operation: ${comparator.operator}`);
            }
          });
          if (setMin && (!minver || gt(minver, setMin))) {
            minver = setMin;
          }
        }
        if (minver && range.test(minver)) {
          return minver;
        }
        return null;
      };
      module.exports = minVersion;
    }
  });

  // node_modules/semver/ranges/valid.js
  var require_valid2 = __commonJS({
    "node_modules/semver/ranges/valid.js"(exports, module) {
      var Range = require_range();
      var validRange = (range, options) => {
        try {
          return new Range(range, options).range || "*";
        } catch (er) {
          return null;
        }
      };
      module.exports = validRange;
    }
  });

  // node_modules/semver/ranges/outside.js
  var require_outside = __commonJS({
    "node_modules/semver/ranges/outside.js"(exports, module) {
      var SemVer2 = require_semver();
      var Comparator = require_comparator();
      var { ANY } = Comparator;
      var Range = require_range();
      var satisfies = require_satisfies();
      var gt = require_gt();
      var lt = require_lt();
      var lte = require_lte();
      var gte = require_gte();
      var outside = (version, range, hilo, options) => {
        version = new SemVer2(version, options);
        range = new Range(range, options);
        let gtfn, ltefn, ltfn, comp, ecomp;
        switch (hilo) {
          case ">":
            gtfn = gt;
            ltefn = lte;
            ltfn = lt;
            comp = ">";
            ecomp = ">=";
            break;
          case "<":
            gtfn = lt;
            ltefn = gte;
            ltfn = gt;
            comp = "<";
            ecomp = "<=";
            break;
          default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
        }
        if (satisfies(version, range, options)) {
          return false;
        }
        for (let i2 = 0; i2 < range.set.length; ++i2) {
          const comparators = range.set[i2];
          let high = null;
          let low = null;
          comparators.forEach((comparator) => {
            if (comparator.semver === ANY) {
              comparator = new Comparator(">=0.0.0");
            }
            high = high || comparator;
            low = low || comparator;
            if (gtfn(comparator.semver, high.semver, options)) {
              high = comparator;
            } else if (ltfn(comparator.semver, low.semver, options)) {
              low = comparator;
            }
          });
          if (high.operator === comp || high.operator === ecomp) {
            return false;
          }
          if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
            return false;
          } else if (low.operator === ecomp && ltfn(version, low.semver)) {
            return false;
          }
        }
        return true;
      };
      module.exports = outside;
    }
  });

  // node_modules/semver/ranges/gtr.js
  var require_gtr = __commonJS({
    "node_modules/semver/ranges/gtr.js"(exports, module) {
      var outside = require_outside();
      var gtr = (version, range, options) => outside(version, range, ">", options);
      module.exports = gtr;
    }
  });

  // node_modules/semver/ranges/ltr.js
  var require_ltr = __commonJS({
    "node_modules/semver/ranges/ltr.js"(exports, module) {
      var outside = require_outside();
      var ltr = (version, range, options) => outside(version, range, "<", options);
      module.exports = ltr;
    }
  });

  // node_modules/semver/ranges/intersects.js
  var require_intersects = __commonJS({
    "node_modules/semver/ranges/intersects.js"(exports, module) {
      var Range = require_range();
      var intersects = (r1, r2, options) => {
        r1 = new Range(r1, options);
        r2 = new Range(r2, options);
        return r1.intersects(r2);
      };
      module.exports = intersects;
    }
  });

  // node_modules/semver/ranges/simplify.js
  var require_simplify = __commonJS({
    "node_modules/semver/ranges/simplify.js"(exports, module) {
      var satisfies = require_satisfies();
      var compare = require_compare();
      module.exports = (versions, range, options) => {
        const set = [];
        let first = null;
        let prev = null;
        const v = versions.sort((a2, b) => compare(a2, b, options));
        for (const version of v) {
          const included = satisfies(version, range, options);
          if (included) {
            prev = version;
            if (!first) {
              first = version;
            }
          } else {
            if (prev) {
              set.push([first, prev]);
            }
            prev = null;
            first = null;
          }
        }
        if (first) {
          set.push([first, null]);
        }
        const ranges = [];
        for (const [min, max] of set) {
          if (min === max) {
            ranges.push(min);
          } else if (!max && min === v[0]) {
            ranges.push("*");
          } else if (!max) {
            ranges.push(`>=${min}`);
          } else if (min === v[0]) {
            ranges.push(`<=${max}`);
          } else {
            ranges.push(`${min} - ${max}`);
          }
        }
        const simplified = ranges.join(" || ");
        const original = typeof range.raw === "string" ? range.raw : String(range);
        return simplified.length < original.length ? simplified : range;
      };
    }
  });

  // node_modules/semver/ranges/subset.js
  var require_subset = __commonJS({
    "node_modules/semver/ranges/subset.js"(exports, module) {
      var Range = require_range();
      var Comparator = require_comparator();
      var { ANY } = Comparator;
      var satisfies = require_satisfies();
      var compare = require_compare();
      var subset = (sub, dom, options = {}) => {
        if (sub === dom) {
          return true;
        }
        sub = new Range(sub, options);
        dom = new Range(dom, options);
        let sawNonNull = false;
        OUTER:
          for (const simpleSub of sub.set) {
            for (const simpleDom of dom.set) {
              const isSub = simpleSubset(simpleSub, simpleDom, options);
              sawNonNull = sawNonNull || isSub !== null;
              if (isSub) {
                continue OUTER;
              }
            }
            if (sawNonNull) {
              return false;
            }
          }
        return true;
      };
      var simpleSubset = (sub, dom, options) => {
        if (sub === dom) {
          return true;
        }
        if (sub.length === 1 && sub[0].semver === ANY) {
          if (dom.length === 1 && dom[0].semver === ANY) {
            return true;
          } else if (options.includePrerelease) {
            sub = [new Comparator(">=0.0.0-0")];
          } else {
            sub = [new Comparator(">=0.0.0")];
          }
        }
        if (dom.length === 1 && dom[0].semver === ANY) {
          if (options.includePrerelease) {
            return true;
          } else {
            dom = [new Comparator(">=0.0.0")];
          }
        }
        const eqSet = /* @__PURE__ */ new Set();
        let gt, lt;
        for (const c3 of sub) {
          if (c3.operator === ">" || c3.operator === ">=") {
            gt = higherGT(gt, c3, options);
          } else if (c3.operator === "<" || c3.operator === "<=") {
            lt = lowerLT(lt, c3, options);
          } else {
            eqSet.add(c3.semver);
          }
        }
        if (eqSet.size > 1) {
          return null;
        }
        let gtltComp;
        if (gt && lt) {
          gtltComp = compare(gt.semver, lt.semver, options);
          if (gtltComp > 0) {
            return null;
          } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
            return null;
          }
        }
        for (const eq of eqSet) {
          if (gt && !satisfies(eq, String(gt), options)) {
            return null;
          }
          if (lt && !satisfies(eq, String(lt), options)) {
            return null;
          }
          for (const c3 of dom) {
            if (!satisfies(eq, String(c3), options)) {
              return false;
            }
          }
          return true;
        }
        let higher, lower;
        let hasDomLT, hasDomGT;
        let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
        let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
        if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
          needDomLTPre = false;
        }
        for (const c3 of dom) {
          hasDomGT = hasDomGT || c3.operator === ">" || c3.operator === ">=";
          hasDomLT = hasDomLT || c3.operator === "<" || c3.operator === "<=";
          if (gt) {
            if (needDomGTPre) {
              if (c3.semver.prerelease && c3.semver.prerelease.length && c3.semver.major === needDomGTPre.major && c3.semver.minor === needDomGTPre.minor && c3.semver.patch === needDomGTPre.patch) {
                needDomGTPre = false;
              }
            }
            if (c3.operator === ">" || c3.operator === ">=") {
              higher = higherGT(gt, c3, options);
              if (higher === c3 && higher !== gt) {
                return false;
              }
            } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c3), options)) {
              return false;
            }
          }
          if (lt) {
            if (needDomLTPre) {
              if (c3.semver.prerelease && c3.semver.prerelease.length && c3.semver.major === needDomLTPre.major && c3.semver.minor === needDomLTPre.minor && c3.semver.patch === needDomLTPre.patch) {
                needDomLTPre = false;
              }
            }
            if (c3.operator === "<" || c3.operator === "<=") {
              lower = lowerLT(lt, c3, options);
              if (lower === c3 && lower !== lt) {
                return false;
              }
            } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c3), options)) {
              return false;
            }
          }
          if (!c3.operator && (lt || gt) && gtltComp !== 0) {
            return false;
          }
        }
        if (gt && hasDomLT && !lt && gtltComp !== 0) {
          return false;
        }
        if (lt && hasDomGT && !gt && gtltComp !== 0) {
          return false;
        }
        if (needDomGTPre || needDomLTPre) {
          return false;
        }
        return true;
      };
      var higherGT = (a2, b, options) => {
        if (!a2) {
          return b;
        }
        const comp = compare(a2.semver, b.semver, options);
        return comp > 0 ? a2 : comp < 0 ? b : b.operator === ">" && a2.operator === ">=" ? b : a2;
      };
      var lowerLT = (a2, b, options) => {
        if (!a2) {
          return b;
        }
        const comp = compare(a2.semver, b.semver, options);
        return comp < 0 ? a2 : comp > 0 ? b : b.operator === "<" && a2.operator === "<=" ? b : a2;
      };
      module.exports = subset;
    }
  });

  // node_modules/semver/index.js
  var require_semver2 = __commonJS({
    "node_modules/semver/index.js"(exports, module) {
      var internalRe = require_re();
      var constants = require_constants();
      var SemVer2 = require_semver();
      var identifiers = require_identifiers();
      var parse2 = require_parse();
      var valid = require_valid();
      var clean = require_clean();
      var inc = require_inc();
      var diff = require_diff();
      var major = require_major();
      var minor = require_minor();
      var patch = require_patch();
      var prerelease = require_prerelease();
      var compare = require_compare();
      var rcompare = require_rcompare();
      var compareLoose = require_compare_loose();
      var compareBuild = require_compare_build();
      var sort = require_sort();
      var rsort = require_rsort();
      var gt = require_gt();
      var lt = require_lt();
      var eq = require_eq();
      var neq = require_neq();
      var gte = require_gte();
      var lte = require_lte();
      var cmp = require_cmp();
      var coerce = require_coerce();
      var Comparator = require_comparator();
      var Range = require_range();
      var satisfies = require_satisfies();
      var toComparators = require_to_comparators();
      var maxSatisfying2 = require_max_satisfying();
      var minSatisfying = require_min_satisfying();
      var minVersion = require_min_version();
      var validRange = require_valid2();
      var outside = require_outside();
      var gtr = require_gtr();
      var ltr = require_ltr();
      var intersects = require_intersects();
      var simplifyRange = require_simplify();
      var subset = require_subset();
      module.exports = {
        parse: parse2,
        valid,
        clean,
        inc,
        diff,
        major,
        minor,
        patch,
        prerelease,
        compare,
        rcompare,
        compareLoose,
        compareBuild,
        sort,
        rsort,
        gt,
        lt,
        eq,
        neq,
        gte,
        lte,
        cmp,
        coerce,
        Comparator,
        Range,
        satisfies,
        toComparators,
        maxSatisfying: maxSatisfying2,
        minSatisfying,
        minVersion,
        validRange,
        outside,
        gtr,
        ltr,
        intersects,
        simplifyRange,
        subset,
        SemVer: SemVer2,
        re: internalRe.re,
        src: internalRe.src,
        tokens: internalRe.t,
        SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
        compareIdentifiers: identifiers.compareIdentifiers,
        rcompareIdentifiers: identifiers.rcompareIdentifiers
      };
    }
  });

  // node_modules/func-di/dist/container-72bcd834.js
  var e = (e2) => e2;
  var t = e;
  var s = e;
  var n = (e2, n2, r2, o2) => t({ type: "di-injectable", token: e2, dependencies: t(s(n2)), factory: r2, disposer: o2 });
  var r = (e2, t2, s2) => n(e2, {}, t2, s2);
  var o = (e2, t2, s2) => n(e2, { c: d }, ({ c: e3 }) => t2.call(e3, e3), s2);
  var a = (...e2) => {
    const [s2, n2] = e2, r2 = 1 === e2.length ? {} : { default: n2 }, a2 = { type: "di-token", key: Symbol(s2), ...r2, implementAs: (e3, t2) => o(a2, e3, t2) };
    return t(a2);
  };
  var c = (e2) => e2.key.description;
  var i = (e2, s2) => t({ type: "di-impl", token: e2, impl: s2 });
  var d = a("container");
  var l = (e2, n2) => t({ type: "di-consumer", dependencies: t(s(e2)), factory: n2 });
  var u;
  !function(e2) {
    e2.Stateful = "stateful", e2.Stateless = "stateless";
  }(u || (u = {}));
  var p = (e2, s2 = u.Stateful) => t({ type: "di-provider", solution: e2, strategy: s2 });
  var y = t({ stateful: (e2) => p(e2, u.Stateful), stateless: (e2) => p(e2, u.Stateless) });
  var k = (e2) => new Map(e2);
  var h = (e2, t2, s2) => {
    for (const n2 of e2) {
      const { solution: e3 } = n2, { token: r2 } = e3;
      if (t2.has(r2.key) && !s2)
        throw new Error(`Token ${c(r2)} already registered.`);
      t2.set(r2.key, n2);
    }
    return t2;
  };
  var w = (e2) => h(e2 ?? [], /* @__PURE__ */ new Map());
  var m = (e2, s2, n2) => {
    ((e3) => {
      const t2 = /* @__PURE__ */ new Set(), s3 = /* @__PURE__ */ new Set(), n3 = [], r3 = ({ solution: o3 }) => {
        const a3 = o3.token, { key: i3 } = a3;
        if (!t2.has(i3)) {
          if (n3.push(a3), s3.has(i3))
            throw new Error(`Circular dependency detected: ${n3.map((e4) => `[${c(e4)}]`).join(" -> ")}`);
          if ("di-injectable" === o3.type) {
            s3.add(i3);
            const t3 = o3.dependencies;
            for (const { key: s4 } of Object.values(t3)) {
              const t4 = e3.get(s4);
              t4 && r3(t4);
            }
            s3.delete(i3);
          }
          n3.pop(), t2.add(i3);
        }
      };
      for (const t3 of e3.values())
        s3.clear(), r3(t3);
    })(e2);
    const r2 = /* @__PURE__ */ new Set(), o2 = (e3) => r2.delete(e3), a2 = /* @__PURE__ */ new Map(), i2 = (t2) => {
      if (t2.key === d.key)
        return g;
      const n3 = e2.get(t2.key);
      if (!n3) {
        if (s2)
          try {
            return s2.request(t2);
          } catch {
          }
        if (Reflect.has(t2, "default"))
          return t2.default;
        throw new Error(`Cannot find provider for ${c(t2)}`);
      }
      const { solution: r3, strategy: o3 } = n3;
      if (o3 === u.Stateful && a2.has(t2.key))
        return a2.get(t2.key);
      if ("di-impl" === r3.type)
        return r3.impl;
      const { dependencies: i3, factory: p3 } = r3, y3 = f2(l(i3, p3));
      return o3 === u.Stateful && a2.set(r3.token.key, y3), y3;
    }, f2 = (e3) => {
      const { dependencies: s3, factory: n3 } = e3, r3 = t(Object.fromEntries(Object.entries(s3).map(([e4, t2]) => [e4, i2(t2)])));
      return n3.call(r3, r3);
    }, p2 = () => {
      for (const [, t2] of e2) {
        const { solution: e3, strategy: s3 } = t2;
        if ("di-injectable" === e3.type && s3 === u.Stateful) {
          const { token: { key: t3 }, disposer: s4 } = e3;
          if (a2.has(t3))
            try {
              s4?.call(void 0, a2.get(t3)), a2.delete(t3);
            } catch (e4) {
              console.error(e4);
            }
        }
      }
    };
    let y2 = false;
    const S2 = (e3) => (...t2) => {
      if (y2)
        throw new Error("The container has been disposed.");
      return e3(...t2);
    }, g = { register: S2((t2) => {
      const n3 = k(e2);
      return h(t2, n3), m(n3, s2, o2);
    }), override: S2((t2) => {
      const n3 = k(e2);
      return h(t2, n3, true), m(n3, s2, o2);
    }), fork: S2((e3) => {
      return t2 = m(w(e3), g, o2), r2.add(t2), t2;
      var t2;
    }), request: S2(i2), consume: S2(f2), clear: S2(p2), dispose: S2(() => {
      p2(), e2.clear();
      for (const e3 of r2)
        e3.dispose();
      y2 = true, n2?.(g);
    }) };
    return t(g);
  };
  var S = (e2) => m(w(e2));

  // node_modules/func-di/dist/index.browser.esm.min.js
  var c2 = (a2) => t({ type: "di-injection", dependencies: t(s(a2)), with: (e2) => c2({ ...a2, ...e2 }), for: (e2) => l(a2, e2), implements: (e2, s2, n2) => n(e2, a2, s2, n2) });

  // src/constants.ts
  var slash = "/";
  var selfReference = ".";
  var relativeTo = `${selfReference}${slash}`;
  var parentTo = `${selfReference}${relativeTo}`;
  var scopeTag = "@";
  var definitelyTypedLibPrefix = "@types/";
  var latest = "latest";
  var contentTypeHeader = "content-type";
  var globalEvaluatedVariable = "__ES_MODULARIZE_GLOBAL_EVALUATED__";
  var jsExt = ".js";
  var jsonExt = ".json";
  var mjsExt = ".mjs";
  var cjsExt = ".cjs";
  var MODULE = "module";
  var PACKAGE_JSON = "package.json";
  var CONTENT_JSON = "application/json";
  var INDEX = "index";

  // src/deps.ts
  var $fs = a("fs");
  var $net = a("net");
  var $registry = a("registry");
  var $host = a("host");
  var $projectLoader = a("project-loader");
  var $config = a("config");
  var $resolver = a("resolver");

  // src/utils.ts
  var die = (message, ErrorCtor = Error) => {
    throw create(ErrorCtor, message);
  };
  var warn = (message, value) => {
    console.warn(message);
    return value;
  };
  var create = (ctor, ...args) => new ctor(...args);
  var virgin = () => /* @__PURE__ */ Object.create(null);
  var getStringTag = (content) => Object.prototype.toString.call(content);
  var isRelative = (path) => path.startsWith(relativeTo) || path.startsWith(parentTo);
  var toRelative = (base, full) => full.replace(create(RegExp, `^${base}/`), relativeTo);
  var trimSlash = (path) => path.replace(/[\\\/]$/, "");
  var proxyGlobalVariableForCode = (code, env) => {
    const entries = Object.entries(env);
    const keys = entries.map(([key]) => key);
    const values = entries.map(([, value]) => value);
    const func = create(Function, `${keys.join(",")}`, code);
    return () => {
      return func.apply(globalThis, values);
    };
  };

  // src/browser.ts
  var BrowserFSImpl = c2({ config: $config, net: $net }).implements(
    $fs,
    (ctx) => createBrowserFS(ctx.net, ctx.config.cdnRoot)
  );
  var createBrowserFS = (net, cdnRoot) => {
    cdnRoot = trimSlash(cdnRoot);
    const read = (url) => {
      const requestURL = resolveRequestURL(url);
      const response = net.read(requestURL);
      if (!response) {
        return null;
      }
      const { content, contentType } = response;
      if (typeof content !== "string") {
        return null;
      }
      return {
        content,
        contentType,
        redirected: response.url !== requestURL,
        url
      };
    };
    const resolveRequestURL = (url) => {
      return url.url;
    };
    const exists = (file) => {
      if (!file) {
        return false;
      }
      const { contentType, redirected } = file;
      if (redirected) {
        return false;
      }
      if (!contentType) {
        return true;
      }
      return !contentType.match(/html|plain/);
    };
    return {
      root: cdnRoot,
      read,
      exists
    };
  };
  var globalEvaluated = {};
  Object.assign(globalThis, { [globalEvaluatedVariable]: globalEvaluated });
  var createBlob = (text, type = "application/javascript") => URL.createObjectURL(create(Blob, [text], { type }));
  var createESMProxyScript = (module) => {
    const { exports } = module;
    const id = module.id;
    globalEvaluated[id] = exports;
    const expression = `${globalEvaluatedVariable}[${JSON.stringify(id)}]`;
    const exportNames = Object.keys(exports).join(",");
    const code = `let {${exportNames}} = ${expression};
export {${exportNames}};
export default ${expression};`;
    return createBlob(code);
  };

  // src/path.ts
  var join = (base, subPath) => {
    if (!base)
      base = ".";
    const fragments = base.split(slash);
    const commands = subPath.split(slash);
    for (const command of commands) {
      if (command === "." || !command) {
        continue;
      }
      if (command === "..") {
        fragments.pop();
        continue;
      }
      fragments.push(command);
    }
    return fragments.join(slash);
  };
  var parse = (url) => {
    const lastValidIndex = url.endsWith(slash) ? url.length - 1 : url.length;
    const lastSlashIndex = url.lastIndexOf(slash, lastValidIndex - 1);
    const lastIndexOfDot = url.lastIndexOf(selfReference, lastValidIndex - 1);
    if (!~lastSlashIndex) {
      return {
        base: url,
        dir: "",
        ext: ~lastIndexOfDot ? url.slice(lastIndexOfDot) : ""
      };
    } else {
      return {
        dir: url.slice(0, lastSlashIndex),
        base: url.slice(lastSlashIndex + 1, lastValidIndex),
        ext: ~lastIndexOfDot ? url.slice(lastIndexOfDot, lastValidIndex) : ""
      };
    }
  };

  // node_modules/taio/esm/libs/custom/functions/argument.mjs
  var argument = (...args) => args;

  // node_modules/taio/esm/libs/custom/algorithms/recursive.mjs
  var rawRecursive = (factory) => {
    return (...args) => {
      const stack = [];
      const ctx = {
        call: argument,
        stack
      };
      const invoke = (args2) => {
        const iterator2 = factory.apply(ctx, args2);
        const initIteration = iterator2.next();
        stack.push(iterator2);
        return [iterator2, initIteration];
      };
      let [iterator, iteration] = invoke(args);
      while (true) {
        if (iteration.done) {
          stack.pop();
          const nextIterator = stack.at(-1);
          if (!nextIterator) {
            break;
          }
          iterator = nextIterator;
          iteration = iterator.next(iteration.value);
        } else {
          [iterator, iteration] = invoke(iteration.value);
        }
      }
      return iteration.value;
    };
  };
  var rawRecursiveGenerator = (factory) => {
    return function* (...args) {
      const stack = [];
      const ctx = {
        value: (value) => ({
          type: "value",
          payload: value
        }),
        sequence: (...args2) => ({
          type: "seq",
          payload: args2
        }),
        stack
      };
      const invoke = (args2) => {
        const iterator2 = factory.apply(ctx, args2);
        const initIteration = iterator2.next();
        stack.push(iterator2);
        return [iterator2, initIteration];
      };
      let [iterator, iteration] = invoke(args);
      while (true) {
        if (iteration.done) {
          stack.pop();
          const nextIterator = stack.at(-1);
          if (!nextIterator) {
            break;
          }
          iterator = nextIterator;
          iteration = iterator.next({ type: "return", payload: iteration.value });
        } else {
          const request = iteration.value;
          if (request.type === "seq") {
            [iterator, iteration] = invoke(request.payload);
          } else {
            const next = yield request.payload;
            iteration = iterator.next({ type: "next", payload: next });
          }
        }
      }
      return iteration.value;
    };
  };

  // src/core.ts
  var packageId = (name, specifier) => `${name}${scopeTag}${specifier}`;
  var isAliasMapping = (exports) => exports != null && typeof exports === "object" && Object.keys(exports).every((key) => key.startsWith("."));
  var accessExport = (mapping, id) => mapping(id);
  var resolvePackageByName = (packageSpecifier) => {
    let packageName = void 0;
    const invalid = () => die(`Invalid module specifier: ${packageSpecifier}`);
    if (packageSpecifier === "") {
      return invalid();
    }
    const firstSlashIndex = packageSpecifier.indexOf(slash);
    if (!packageSpecifier.startsWith(scopeTag)) {
      packageName = packageSpecifier.slice(0, firstSlashIndex === -1 ? void 0 : firstSlashIndex);
    } else {
      if (!packageSpecifier.includes(slash)) {
        return invalid();
      }
      const secondSlashIndex = packageSpecifier.indexOf(slash, firstSlashIndex + 1);
      packageName = packageSpecifier.slice(0, secondSlashIndex === -1 ? void 0 : secondSlashIndex);
    }
    if (packageName.startsWith(".") || packageName.includes("\\") || packageName.includes("%")) {
      return invalid();
    }
    const packageSubpath = `.${packageSpecifier.slice(packageName.length)}`;
    if (packageSubpath.endsWith(slash)) {
      return invalid();
    }
    return {
      pkg: packageName,
      subpath: packageSubpath || selfReference
    };
  };
  var detectFormat = (json, ext) => {
    const isModule = json.type === MODULE;
    return isModule && ext === jsExt || ext === mjsExt ? "module" /* Module */ : ext === cjsExt ? "script" /* Script */ : ext === jsonExt ? "json" /* JSON */ : null;
  };
  var detectDefaultFormat = (json, ext) => detectFormat(json, ext) ?? "script" /* Script */;

  // src/errors.ts
  var notFound = (id, url) => die(`Cannot find module "${id}" from "${url.url}"`);
  var notSupported = (msg) => die(`Not supported: ${msg}`);
  var noSupport = () => die(`No support.`);

  // src/host.ts
  var exportReferenceNotSupported = (ref) => notSupported(`Cannot find export subpath: ${JSON.stringify(ref)}`);
  var detectIfESM = (subpath, pjson) => {
    if (detectFormat(pjson, parse(subpath).ext) === "module" /* Module */) {
      return true;
    }
    if (subpath.split(slash).some((fragment) => fragment.includes("esm") || fragment === "es")) {
      return true;
    }
    return false;
  };
  var getRefSubpath = (ref, pjson) => {
    if (typeof ref === "string") {
      const { ext } = parse(ref);
      return [ref, detectFormat(pjson, ext)];
    }
    if (Array.isArray(ref)) {
      for (const r2 of ref) {
        return getRefSubpath(r2, pjson);
      }
      return exportReferenceNotSupported(ref);
    }
    const { browser, worker, import: _import, require: require2, default: _default, module, commonjs } = ref;
    const esm = browser ?? worker ?? module ?? _import ?? (_default && detectIfESM(getRefSubpath(_default, pjson)[0], pjson) && _default);
    if (esm) {
      return [getRefSubpath(esm, pjson)[0], "module" /* Module */];
    }
    const cjs = require2 ?? commonjs;
    if (cjs) {
      return [getRefSubpath(cjs, pjson)[0], "script" /* Script */];
    }
    return [getRefSubpath(_default ?? exportReferenceNotSupported(ref), pjson)[0], null];
  };
  var PackageHostImpl = c2({ fs: $fs, registry: $registry }).implements(
    $host,
    (ctx) => createPackageHost(ctx.fs, ctx.registry)
  );
  var createPackageHost = (fs, registry) => {
    const resolveAsFile = (url) => {
      const isModule = url.packageMeta.packageJSON.type === MODULE;
      const targetSuffixes = [
        ["", url.format ?? "script" /* Script */],
        [".js", isModule ? "module" /* Module */ : "script" /* Script */],
        [".json", "json" /* JSON */]
      ];
      for (const [resolvedURL, type] of targetSuffixes.map(([suffix, type2]) => [
        createURL(url.packageMeta, url.subpath + suffix),
        type2
      ])) {
        const file = fs.read(resolvedURL);
        if (fs.exists(file)) {
          return {
            ...file,
            format: type
          };
        }
      }
      return null;
    };
    const resolveAsDirectory = (url) => {
      const x = trimSlash(url.subpath);
      const pjsonSubpath = join(x, PACKAGE_JSON);
      const pjsonFile = fs.read(createURL(url.packageMeta, pjsonSubpath));
      if (!pjsonFile) {
        return resolveIndex(url);
      }
      try {
        const json = JSON.parse(pjsonFile.content);
        const main = json.main;
        if (!main) {
          return resolveIndex(url);
        }
        const m2 = join(x, main);
        const mUrl = createURL(url.packageMeta, m2);
        return resolveAsFile(mUrl) ?? resolveIndex(mUrl) ?? warn(`Deprecated: Resolving package index with "package.json".`, resolveIndex(url));
      } catch (error) {
        return resolveIndex(url);
      }
    };
    const resolveIndex = (url) => {
      const x = trimSlash(url.subpath);
      const indexJS = createURL(url.packageMeta, `${x}/${INDEX}${jsExt}`);
      const indexJSFile = fs.read(indexJS);
      if (fs.exists(indexJSFile)) {
        return {
          ...indexJSFile,
          format: indexJS.format ?? "script" /* Script */
        };
      }
      const indexJSON = createURL(url.packageMeta, `${x}/${INDEX}${jsonExt}`);
      const indexJSONFile = fs.read(indexJSON);
      if (fs.exists(indexJSONFile)) {
        return {
          ...indexJSONFile,
          format: indexJSON.format ?? "json" /* JSON */
        };
      }
      return null;
    };
    const resolveCache = {};
    const resolvePackage = rawRecursive(
      function* (spec) {
        const { name, specifier } = spec;
        const id = packageId(name, specifier);
        const cached = resolveCache[id];
        if (cached) {
          return cached;
        }
        const packageJSON = registry.resolve(spec);
        if (!packageJSON) {
          return null;
        }
        const meta = {
          specifier,
          packageJSON
        };
        resolveCache[id] = meta;
        const withExports = resolveExports(packageJSON, meta);
        const fullDeps = {
          ...packageJSON.peerDependencies,
          ...packageJSON.dependencies
        };
        const depsArray = [];
        for (const [name2, specifier2] of Object.entries(fullDeps)) {
          if (name2.startsWith(definitelyTypedLibPrefix)) {
            continue;
          }
          const meta2 = yield this.call({
            name: name2,
            specifier: specifier2
          });
          if (!meta2) {
            console.warn(
              `Cannot resolve dependency "${packageId(name2, specifier2)}" for ${withExports.packageJSON.name}, skipped.`
            );
            continue;
          }
          depsArray.push([name2, meta2]);
        }
        return Object.assign(withExports, {
          deps: Object.fromEntries(depsArray)
        });
      }
    );
    const requireResolveCache = {};
    const requireResolveCacheKey = (id, url) => `${url.packageMeta.packageJSON.name}@${url.packageMeta.packageJSON.version} | ${url.parsed.dir} => ${id}`;
    const resolve = (id, currentURL) => {
      const key = requireResolveCacheKey(id, currentURL);
      const cache2 = requireResolveCache[key];
      if (cache2) {
        return cache2;
      }
      const resume = (result) => {
        if (result) {
          requireResolveCache[key] = result;
        }
        return result;
      };
      if (isRelative(id)) {
        const { dir } = currentURL.parsed;
        const subpath = join(dir, id);
        const targetUrl = createURL(currentURL.packageMeta, subpath);
        const file = resolveAsFile(targetUrl) ?? resolveAsDirectory(targetUrl);
        return file ? resume(file) : notFound(id, currentURL);
      }
      const { pkg } = resolvePackageByName(id);
      const depMeta = currentURL.packageMeta.deps[pkg];
      const nextSteps = (meta) => {
        if (!meta) {
          return resume(null);
        }
        const exportURL = accessExport(meta.exportMapping, id);
        if (exportURL) {
          return resume(resolveAsFile(exportURL));
        }
        return resume(resolveAsFile(createURL(meta, toRelative(pkg, id))));
      };
      if (depMeta) {
        return nextSteps(depMeta);
      }
      const currentPackage = currentURL.packageMeta.packageJSON.name;
      if (currentPackage === pkg) {
        return nextSteps(currentURL.packageMeta);
      }
      return nextSteps(
        resolvePackage({
          name: pkg,
          specifier: warn(
            `Dependency "${pkg}" is used by "${currentURL.url}" but not specified in ${PACKAGE_JSON}. Using "${latest}" for dependency versioning.`,
            latest
          )
        })
      );
    };
    const resolveExports = (packageJSON, pendingPackageMeta) => {
      const { name, exports, module, main } = packageJSON;
      const staticMapping = {};
      const dynamicMappings = [];
      const exportsEntries = typeof exports === "string" ? [[selfReference, exports, detectDefaultFormat(packageJSON, parse(exports).ext)]] : Array.isArray(exports) ? exports.map((ref) => {
        const [subpath, format] = getRefSubpath(ref, packageJSON);
        return [subpath, subpath, format];
      }) : exports ? isAliasMapping(exports) ? Object.entries(exports).map(([alias, ref]) => {
        const [subpath, format] = getRefSubpath(ref, packageJSON);
        return [alias, subpath, format];
      }) : [[selfReference, ...getRefSubpath(exports, packageJSON)]] : module ? [[selfReference, module, "module" /* Module */]] : [];
      for (const [subpath, ref, format] of exportsEntries) {
        if (subpath.includes("*")) {
          dynamicMappings.push({
            pattern: new RegExp(subpath.replace("*", ".+?")),
            ref
          });
        } else {
          if (subpath.endsWith(slash)) {
            console.warn(`Invalid export path "${subpath}", ignored.`);
            continue;
          }
          const importPath = join(name, subpath);
          if (!(importPath in staticMapping)) {
            const finalMeta = pendingPackageMeta;
            const staticResolvedURL = createURL(finalMeta, ref, format);
            staticMapping[importPath] = staticResolvedURL;
          }
        }
      }
      const mapping = (id) => {
        if (id in staticMapping) {
          return staticMapping[id];
        }
        const relativePath = toRelative(name, id);
        const match = dynamicMappings.find(({ pattern }) => relativePath.match(pattern));
        const finalMeta = pendingPackageMeta;
        if (!match) {
          if (id === name && main) {
            return createURL(finalMeta, main);
          }
          return void 0;
        }
        return createURL(finalMeta, ...getRefSubpath(match.ref, packageJSON));
      };
      return Object.assign(pendingPackageMeta, {
        exportMapping: mapping,
        staticMapping
      });
    };
    const createURL = (pkg, subpath, format) => {
      const parsed = parse(subpath);
      const { ext } = parsed;
      return {
        url: `${fs.root}/${pkg.packageJSON.name}@${pkg.packageJSON.version}/${subpath.replace(/^\.\/?/, "")}`,
        subpath,
        host,
        packageMeta: pkg,
        parsed,
        format: format ?? detectFormat(pkg.packageJSON, ext)
      };
    };
    const createAnonymousURL = (subpath, deps, tag) => createURL(
      {
        specifier: latest,
        exportMapping: () => void 0,
        staticMapping: {},
        packageJSON: {
          name: `<internal: ${tag ?? "the project"}>`,
          version: "0.0.0",
          dependencies: Object.fromEntries(Object.entries(deps).map(([pkg, meta]) => [pkg, meta.packageJSON.version]))
        },
        deps
      },
      subpath
    );
    const host = {
      resolvePackage,
      resolve,
      createURL,
      createAnonymousURL
    };
    return host;
  };

  // src/net.ts
  var createNetReader = () => {
    const read = (url) => {
      const xhr = create(XMLHttpRequest);
      xhr.open("GET", url, false);
      xhr.send();
      const { response, responseURL, status } = xhr;
      if (status !== 200) {
        return null;
      }
      return {
        content: response,
        contentType: xhr.getResponseHeader(contentTypeHeader),
        url: responseURL,
        status
      };
    };
    return {
      read
    };
  };
  var NetReaderImpl = r($net, createNetReader);

  // src/cjs.ts
  var createExport = (esm) => {
    const exports = virgin();
    if (esm) {
      Object.defineProperties(esm, {
        __esModule: {
          value: true
        }
      });
    }
    return exports;
  };
  var createModule = (url, require2, exports) => {
    const id = url.url;
    const module = {
      children: [],
      exports,
      isPreloading: false,
      loaded: false,
      require: require2,
      path: id,
      id,
      paths: [],
      filename: url.parsed.base,
      parent: null
    };
    return module;
  };
  var createResolve = (url, host) => {
    const resolveStatic = {
      paths: notSupported
    };
    const resolve = (id, options) => {
      const file = host.resolve(id, url);
      if (!file) {
        return notFound(id, url);
      }
      const resolved = file.url.url;
      return options ? warn("Options for require.resolve(id, [options]) is not used actually.", resolved) : resolved;
    };
    return Object.assign(resolve, resolveStatic);
  };
  var loadAsCJSModule = (file, host, loader) => {
    const { url } = file;
    const exports = createExport();
    const require2 = createRequire(url, host);
    const module = createModule(url, require2, exports);
    cache[url.url] = module;
    loader(exports, require2, module);
    module.loaded = true;
    return module;
  };
  var loadCJSModule = (file, host) => loadAsCJSModule(file, host, (exports, require2, module) => {
    const { url, content } = file;
    const {
      url: __filename,
      parsed: { base }
    } = url;
    const factory = createCJSFactory(content, {
      __dirname: trimSlash(__filename.replace(base, "")),
      __filename,
      exports,
      module,
      require: require2
    });
    try {
      factory();
    } catch (error) {
      console.warn(
        `Failed to load "${file.url.url}" due to the following error.Code referencing this package may not work currectly.`,
        error
      );
    }
  });
  var loadJSONModule = (file, host) => loadAsCJSModule(file, host, (_exports, _require, module) => {
    module.exports = JSON.parse(file.content);
  });
  var cache = {};
  var createRequire = (url, host) => {
    const resolve = createResolve(url, host);
    const requireStatic = {
      cache,
      main: void 0,
      resolve,
      extensions: {
        ".js": noSupport,
        ".json": noSupport,
        ".node": noSupport
      }
    };
    const require2 = (id) => {
      const file = host.resolve(id, url);
      if (!file) {
        return notFound(id, url);
      }
      const cached = cache[file.url.url];
      if (cached) {
        return cached.exports;
      }
      switch (file.format) {
        case "json" /* JSON */:
          return loadJSONModule(file, host).exports;
        case "script" /* Script */:
          return loadCJSModule(file, host).exports;
        default:
          return notSupported();
      }
    };
    return Object.assign(require2, requireStatic);
  };
  var createCJSFactory = proxyGlobalVariableForCode;

  // src/node-polyfills.ts
  var polyfillProcess = (processPatch) => processPatch ?? {
    env: {
      NODE_ENV: "production"
    }
  };

  // src/project-loader.ts
  var patchConfigWithDefaults = (config) => {
    const result = {
      cdnRoot: trimSlash(config?.cdnRoot ?? "https://unpkg.com"),
      registry: trimSlash(config?.registry ?? "https://registry.npmjs.org"),
      nodeGlobals: config?.nodeGlobals ?? {
        process: polyfillProcess()
      },
      resolvedAt: config?.resolvedAt ?? "./resolved.json"
    };
    return result;
  };
  var ProjectLoaderImpl = c2({ host: $host, config: $config, resolver: $resolver }).implements(
    $projectLoader,
    ({ config, host, resolver }) => createProjectLoader(host, resolver, config)
  );
  var createProjectLoader = (host, resolver, config) => {
    const loadImportMap = (resolvedDependencies, resolvedEntries, loadOnly) => {
      const projectURL = host.createAnonymousURL("./index.js", resolvedDependencies);
      const groups = resolvedEntries.flatMap(([, meta]) => Object.entries(meta.staticMapping)).map(([importPath, url]) => {
        if (loadOnly && !loadOnly.includes(importPath)) {
          return [];
        }
        const file = host.resolve(importPath, projectURL);
        if (!file) {
          return [];
        }
        switch (file.format) {
          case "script" /* Script */: {
            const module = loadCJSModule(file, host);
            const proxyScriptURL = createESMProxyScript(module);
            return [[importPath, proxyScriptURL]];
          }
          case "json" /* JSON */:
            return [[importPath, createBlob(file.content, CONTENT_JSON)]];
          case "module" /* Module */:
            return [[importPath, file.url.url]];
          default:
            return [];
        }
      });
      const mapping = Object.fromEntries(groups.flatMap((group) => group));
      return {
        imports: mapping
      };
    };
    const preload = () => {
      Object.assign(globalThis, config?.nodeGlobals);
    };
    const load = (deps, loadOnly) => {
      preload();
      const resolvedDependencies = resolver.resolveAll(deps);
      const resolvedEntries = Object.entries(resolvedDependencies);
      return loadImportMap(resolvedDependencies, resolvedEntries, loadOnly);
    };
    const loadResolved = () => {
      preload();
      const staticData = resolver.resolveStatic();
      const { deps, loadOnly } = staticData;
      const resolvedDependencies = resolver.resolveAll(deps);
      const resolvedEntries = Object.entries(resolvedDependencies);
      return loadImportMap(resolvedDependencies, resolvedEntries, loadOnly);
    };
    return {
      load,
      loadResolved
    };
  };

  // src/registry.ts
  var import_semver = __toESM(require_semver2(), 1);
  var RegistryImpl = c2({ net: $net, config: $config }).implements(
    $registry,
    (ctx) => createPackageRegistry(ctx.net, ctx.config.registry)
  );
  var createPackageRegistry = (net, registry) => {
    registry = trimSlash(registry);
    const resolveCache = {};
    const resolve = ({ name, specifier }) => {
      let isExact = specifier === latest;
      if (!isExact) {
        try {
          new import_semver.SemVer(specifier);
          isExact = true;
        } catch {
        }
      }
      const target = isExact ? `${name}/${specifier}` : name;
      const url = `${registry}/${target}`;
      const resolved = resolveCache[url];
      if (resolved) {
        return resolved;
      }
      const resolveAs = (packageJSON) => {
        resolveCache[url] = packageJSON;
        return packageJSON;
      };
      const response = net.read(url);
      const content = response?.content;
      if (typeof content !== "string") {
        return die(`Invalid registry response content, got ${getStringTag(content)}`);
      }
      try {
        let data = JSON.parse(content);
        if (isExact) {
          return resolveAs(data);
        }
        if (data.error) {
          return die(`The registry server responded an error: ${JSON.stringify(data.error)}`);
        }
        let version = specifier;
        if (data["dist-tags"][version]) {
          data = data.versions[data["dist-tags"][version]];
        } else if (version) {
          if (!data.versions[version]) {
            const versions = Object.keys(data.versions);
            version = (0, import_semver.maxSatisfying)(versions, version);
            if (!version) {
              return die(`Cannot find version satisfying ${specifier}. Available versions are: ${versions.join(", ")}.`);
            }
          }
          data = data.versions[version];
          if (!data) {
            return die(`Cannot find version info of ${version} in registry versions.`);
          }
        }
        return resolveAs(data);
      } catch (error) {
        console.error(error);
        return null;
      }
    };
    return {
      resolve
    };
  };

  // src/resolved.ts
  var ResolvedRegistryImpl = $registry.implementAs(({ request }) => {
    let data = null;
    const resolve = (spec) => {
      if (!data) {
        data = request($resolver).resolveStatic();
      }
      const id = spec.name;
      const cache2 = data.resolved[id];
      if (!cache2) {
        return null;
      }
      return cache2;
    };
    return {
      resolve
    };
  });

  // src/resolver.ts
  var PackageResolverImpl = $resolver.implementAs(({ request }) => {
    const host = request($host);
    const config = request($config);
    const resolveAll = (deps) => {
      const entries = Object.entries(deps).map(([name, specifier]) => {
        const meta = host.resolvePackage({ name, specifier });
        return [name, meta];
      });
      const visited = create(Set);
      const flattenRecursive = rawRecursiveGenerator(function* ([name, meta]) {
        if (!meta || visited.has(meta)) {
          return;
        }
        visited.add(meta);
        yield this.value([name, meta]);
        for (const entry of Object.entries(meta.deps)) {
          yield this.sequence(entry);
        }
      });
      const resolvedEntries = entries.flatMap((e2) => [...flattenRecursive(e2)]);
      return Object.fromEntries(resolvedEntries);
    };
    const resolveStatic = () => {
      const target = config.resolvedAt;
      const response = request($net).read(target);
      if (!response) {
        throw new Error(`Data file ${target} not found.`);
      }
      const { content, contentType } = response;
      if (!contentType?.includes(CONTENT_JSON) || typeof content !== "string") {
        throw new Error(`Invalid content type, expecting JSON`);
      }
      const staticData = JSON.parse(content);
      return staticData;
    };
    return {
      resolveAll,
      resolveStatic
    };
  });

  // src/index.ts
  var root = S([
    y.stateful(BrowserFSImpl),
    y.stateful(NetReaderImpl),
    y.stateful(RegistryImpl),
    y.stateful(PackageHostImpl),
    y.stateful(ProjectLoaderImpl),
    y.stateful(PackageResolverImpl)
  ]);
  var _ESModularize = {
    createProjectLoader(config) {
      const ioc = root.register([y.stateful(i($config, patchConfigWithDefaults(config)))]);
      const projectLoader = ioc.request($projectLoader);
      return projectLoader;
    },
    createStaticProjectLoader(config) {
      const ioc = root.override([
        y.stateful(ResolvedRegistryImpl),
        y.stateful(i($config, patchConfigWithDefaults(config)))
      ]);
      return ioc.request($projectLoader);
    },
    load(path) {
      const umd = (globalNamespace) => {
        const globalObject = Reflect.get(globalThis, globalNamespace);
        if (!globalObject || typeof globalObject !== "object") {
          return null;
        }
        const exportNames = Object.keys(globalObject).join(",");
        const code = `const{${exportNames}}=globalThis["${globalNamespace}"];export{${exportNames}};export default globalThis["${globalNamespace}"];`;
        return createBlob(code);
      };
      return {
        sync() {
          const xhr = create(XMLHttpRequest);
          xhr.open("GET", path, false);
          xhr.send();
          (0, eval)(xhr.response);
          return {
            umd
          };
        },
        async async() {
          const s2 = document.createElement("script");
          s2.src = path;
          (document.body ?? document.head).appendChild(s2);
          await create(Promise, (resolve) => {
            const handler = () => {
              s2.removeEventListener("load", handler);
              resolve();
            };
            s2.addEventListener("load", handler);
          });
          return {
            umd
          };
        }
      };
    },
    build(map) {
      const importmap = document.createElement("script");
      importmap.type = "importmap";
      importmap.textContent = JSON.stringify(map);
      importmap.nonce = void 0;
      const firstScript = document.currentScript || document.querySelector("script");
      if (firstScript) {
        firstScript.after(importmap);
      } else {
        (document.body ?? document.head).appendChild(importmap);
      }
    }
  };
  Object.assign(globalThis, { ESModularize: _ESModularize });
})();
/**
 * @license package-json
 *
 * MIT License
 *
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
//# sourceMappingURL=index.js.map
