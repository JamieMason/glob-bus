;var scopedEvent=function(){function a(a){var b=Array.prototype.slice.call(arguments,1);return function(){var c=Array.prototype.slice.call(arguments,0),d=b.concat(c);return a.apply(this,d)}}function b(a){return a.indexOf("*")!==-1}function c(a){return a.replace(/[\.:]?\*/,"")}function d(a){return a.replace(/([\.\]\[\-\}\{\?\+\*])/g,"\\$1")}function e(a,b){var e;return a==="*"?!0:(e=new RegExp("^"+d(c(a))+"(\\.|:|$)"),b.search(e)!==-1)}function f(a,b){return a[b]=a.hasOwnProperty(b)?a[b]:[]}function g(a,b){return a.hasOwnProperty(b)&&a[b].hasOwnProperty("length")}function h(a,b,c){return g(b,c)&&b[c].length===0}function i(a,b,c){h(a,b,c)&&delete b[c]}function j(a,c,d){var f,g=[];for(f in c)if(f===d||b(f)&&e(f,d))g=g.concat(c[f]);return g.length>0?g:null}function k(a,b,c,d){if(a.contains(c,d))return!1;g(b,c)||f(b,c),b[c].push(d)}function l(a,b,c,d){if(g(b,c)){var e,f=b[c],h=f.length;for(e=0;e<h;e++)if(f[e]===d){f.splice(e,1);return}}i(a,b,c)}function m(a,b,c,d){var e;if(g(b,c))for(e=0;e<b[c].length;e++)if(b[c][e]===d)return!0;return!1}function n(){var b={},c={};return c.get=a(j,c,b),c.contains=a(m,c,b),c.add=a(k,c,b),c.remove=a(l,c,b),c}function o(a){var b=a.indexOf(":")!==-1,c=a.split(":");return b?{type:c[0],scope:c[1]}:{type:a,scope:""}}function p(a,b,c,d){if(d!=="*"&&d.search(/^[a-z0-9\-\_]+:(\*|[a-z0-9\-\_]+\.?)+$/i)===-1)throw new TypeError('[ScopeEvent] "'+d+'" is an invalid binding');var e=Array.prototype.slice.call(arguments,0);return e.splice(0,1),a.apply(b,e)}function q(a,b,c,d){b.add(c,d)}function r(a,b,c,d){var e=b.get(c),f=e.length,g;if(e===null)return;for(g=0;g<f;g++)if(d===e[g]){e.slice(g,1);return}}function s(a,b,c,d){d=d||{};var e=b.get(c),f,g=o(c),h;if(e===null)return;f=e.length,d.type=g.type,d.scope=g.scope;for(h=0;h<f;h++)e[h](d)}function t(){var b=n(),c={};return c.bind=a(p,q,c,b),c.unbind=a(p,r,c,b),c.trigger=a(p,s,c,b),c}return t.model=n,t}();
