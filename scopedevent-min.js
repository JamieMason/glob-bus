;var scopedEvent=function(){function c(c,d){return c==="*"||d.search(new RegExp("^"+c.replace(a,"").replace(b,"\\$1")+"(\\.|:|$)"))!==-1}function d(a,b){return a[b]!==void 0}function e(a,b,c){var d,e=a[b],f=e.length;for(d=0;d<f;d++)c(e[d],d,e)}function f(a,b){return e(this.data,a,b)}function g(a,b){return e(this.model,a,b)}function h(){this.data={}}function i(a){var b=a.indexOf(":")!==-1,c=a.split(":");return b?{type:c[0],scope:c[1]}:{type:a,scope:""}}function j(a){if(a!=="*"&&a.search(/^[a-z0-9\-\_]+:(\*|[a-z0-9\-\_]+\.?)+$/i)===-1)throw new TypeError('[scopedEvent] "'+a+'" is an invalid binding');return!0}function k(){this.model=new h}var a=/[\.:]?\*/,b=/([\.\]\[\-\}\{\?\+\*])/g;return h.prototype={add:function(a,b){if(!this.contains(a,b)){var c=this.data;d(c,a)||(c[a]=[]),c[a].push(b)}},remove:function(a,b){var c,e=this.data,f=e[a],g;if(d(e,a)){g=f.length;if(g===1)delete e[a];else for(c=0;c<g;c++)if(f[c]===b){f.splice(c,1);return}}},get:function(a){var b,d=this.data,e=[];for(b in d)if(b===a||b.indexOf("*")!==-1&&c(b,a))e=e.concat(d[b]);return e.length>0?e:null},contains:function(a,b){var c,e=this.data;if(d(e,a))for(c=0;c<e[a].length;c++)if(e[a][c]===b)return!0;return!1}},k.prototype={bind:function(a,b){j(a)&&this.model.add(a,b)},unbind:function(a,b){if(j(a)){var c=this.model.get(a),d,e;if(c&&(d=c.length))for(e=0;e<d;e++)if(b===c[e]){c.slice(e,1);return}}},trigger:function(a,b){var c,d,e,f;if(j(a)&&(c=this.model.get(a))){b=b||{},e=i(a),b.type=e.type,b.scope=e.scope,d=c.length;for(f=0;f<d;f++)c[f](b)}}},function(){return new k}}();
