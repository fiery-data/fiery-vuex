!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.FieryVuex=t():e.FieryVuex=t()}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){e.exports=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=10)}([function(e,t,n){"use strict";function r(e){return"[object Object]"===Object.prototype.toString.call(e)}function o(e){return"function"==typeof e}function a(e){return"string"==typeof e}function i(e){return e&&e instanceof Array}function s(e){return e&&e instanceof Date}function c(e){return void 0!==e}function u(e){return"number"==typeof e&&isFinite(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.isObject=r,t.isFunction=o,t.isString=a,t.isArray=i,t.isDate=s,t.isDefined=c,t.isNumber=u,t.parseDate=function(e){return s(e)?e:e&&o(e.toDate)?e.toDate():u(e)?new Date(e):e},t.coalesce=function(e,t){return c(e)?e:t},t.isCollectionSource=function(e){return!!e.where},t.getFields=function(e,t){return e?a(e)?[e]:e:t},t.forEach=function(e,t){if(i(e)){for(var n=0;n<e.length;n++)t(e[n],n,e);return!0}if(r(e)){for(var o in e)e.hasOwnProperty(o)&&t(e[o],o,e);return!0}return!1},t.isEqual=function e(t,n){if(t===n)return!0;if(!t||!n)return!1;if(typeof t!=typeof n)return!1;if(i(t)&&i(n)){if(t.length!==n.length)return!1;for(var o=0;o<t.length;o++)if(!e(t[o],n[o]))return!1;return!0}if(s(t)&&s(n))return t.getTime()===n.getTime();if(r(t)&&r(n)){for(var a in t)if(!e(t[a],n[a]))return!1;for(var a in n)if(!(a in t))return!1;return!0}return!1}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(5),o=n(6),a=n(8),i=n(3),s=n(2);function c(e,n,o){void 0===o&&(o=!1);var a=e.storeKey+r.UID_SEPARATOR+n.path;if(a in t.globalCache)return d(t.globalCache[a],e,o),t.globalCache[a];var i=e.options.newDocument();i[r.PROP_UID]=a;var c={uid:a,data:i,ref:n,exists:!1,uses:0,sub:{},firstEntry:e,entries:[],removed:!1};return t.globalCache[a]=c,d(c,e,!0),h(i,e),s.callbacks.onCacheCreate(c),c}function u(e){return t.globalCache[e[r.PROP_UID]]}function f(e,t){if(t&&t.uid in e.children){e.options;var n=t.entries,r=n.indexOf(e);-1!==r&&n.splice(r,1),delete e.children[t.uid];for(var a=!1,i=0;i<n.length;i++)if(n[i].instance===e.instance){a=!0;break}if(a||p(t,e.instance,!0),t.uses>0)for(var c in t.sub)l(t,c)||(s.callbacks.onSubDestroy(t.data,c,t),o.closeEntry(t.sub[c],!0))}}function l(e,t){for(var n=e.entries,r=(e.sub,0);r<n.length;r++){var o=n[r].options.sub;if(o&&t in o)return!0}return!1}function d(e,t,n){void 0===n&&(n=!1),e.uid in t.instance.cache||(t.instance.cache[e.uid]=e,e.uses++),e.uid in t.children?n&&v(e,t):(e.entries.push(t),t.children[e.uid]=e,v(e,t))}function p(e,t,n){if(void 0===n&&(n=!0),e.uid in t.cache){e.uses--,delete t.cache[e.uid];for(var r=e.entries,o=r.length-1;o>=0;o--){var a=r[o];a.instance===t&&f(a,e)}n&&e.uses<=0&&y(e)}}function y(e){for(var n=e.entries,r=0;r<n.length;r++)p(e,n[r].instance,!1);for(var a in e.sub)o.closeEntry(e.sub[a],!0);e.uses<=0&&!e.removed&&(s.callbacks.onCacheDestroy(e),delete t.globalCache[e.uid],delete e.ref,delete e.sub,delete e.data,e.entries.length=0,e.removed=!0)}function v(e,t){var n=t.options,i=e.data,c=e.ref;if(n.sub&&c)for(var u in n.sub)if(!g(e,u)){var f=n.sub[u],l=e.uid+r.ENTRY_SEPARATOR+u,d=f.doc?c.parent.doc(e.uid.split(r.PATH_SEPARATOR).pop()+r.PATH_SEPARATOR+u):c.collection(u),p=o.getEntry(t.instance,d,f,l,!1);p.parent=e,e.sub[u]=p,i[u]=a.factory(p),s.callbacks.onSubCreate(i,u,e)}}function g(e,t){return t in e.sub&&e.sub[t].live}function h(e,t){return t.options.record&&Object.defineProperties(e,t.recordProperties),e}t.globalCache={},t.getCacheForReference=c,t.getCacheForDocument=function(e,t,n){return void 0===n&&(n=!1),i.stats.reads++,c(e,t.ref,n)},t.getCacheForData=u,t.removeDataFromEntry=function(e,t){f(e,u(t))},t.removeCacheFromEntry=f,t.isReferencedSub=l,t.addCacheToEntry=d,t.removeCacheFromInstance=p,t.destroyCache=y,t.addSubs=v,t.hasLiveSub=g,t.createRecord=h},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.callbacks={onInvalidOperation:function(e,t){},onUpdate:function(e,t,n){},onSet:function(e,t,n){},onDelete:function(e,t){},onClear:function(e,t){},onGetChanges:function(e,t,n){},onRefresh:function(e,t){},onBuild:function(e,t){},onCacheCreate:function(e){},onCacheDestroy:function(e){},onSubCreate:function(e,t,n){},onSubDestroy:function(e,t,n){},onCollectionAdd:function(e,t,n){},onCollectionRemove:function(e,t,n){},onCollectionModify:function(e,t,n){},onCollectionChanged:function(e,t){},onDocumentUpdate:function(e,t){},onDocumentMissing:function(e,t){},onInstanceCreate:function(e){},onInstanceDestroy:function(e){}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.stats={queries:0,reads:0,deletes:0,updates:0,sets:0,writes:0}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0);function o(e,t,n){for(var r in n)e.setProperty(t,r,n[r]);return t}function a(e,t){if(t.decode)e=t.decode(e);else if(t.decoders)for(var n in t.decoders)n in e&&(e[n]=t.decoders[n](e[n],e));return e}function i(e,t){var n,o=e.data(),a=r.isObject(o)?o:((n={})[t.propValue]=o,n);return a&&t.key&&(a[t.key]=e.id),a}t.refreshData=function(e,t,n){var r=n.instance.system,s=n.options,c=a(i(t,s),s),u=e.data;return o(r,u,c),s.propExists&&r.setProperty(u,s.propExists,t.exists),s.propParent&&n.parent&&r.setProperty(u,s.propParent,n.parent.data),e.exists=t.exists,u},t.copyData=o,t.decodeData=a,t.encodeData=function(e,t,n){var o={},a=r.getFields(n,t.include);if(a)for(var i=0;i<a.length;i++)(s=a[i])in e&&(o[s]=e[s]);else for(var s in e)s in t.exclude||(o[s]=e[s]);if(t.encoders)for(var s in t.encoders)s in o&&(o[s]=t.encoders[s](o[s],e));return o},t.parseDocument=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PROP_VALUE=".value",t.PROP_UID=".uid",t.UID_SEPARATOR="///",t.ENTRY_SEPARATOR="/",t.PATH_SEPARATOR="/",t.RECORD_OPTIONS={refresh:"$refresh",sync:"$sync",update:"$update",save:"$save",remove:"$remove",ref:"$ref",clear:"$clear",build:"$build",create:"$create",getChanges:"$getChanges"}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=n(7),a=n(13),i=n(1),s=n(9);function c(e,t){if(void 0===t&&(t=!1),e&&e.live&&(e.off&&(e.off(),delete e.off),e.live=!1,t)){var n=e.instance;r.isDefined(e.index)&&(n.entryList[e.index]=null,delete e.index),e.name&&e.name in n.entry&&delete n.entry[e.name],r.forEach(e.children,function(t){i.removeCacheFromEntry(e,t)})}}function u(e){return{refresh:function(t){return s.refresh.call(e,this,t)},sync:function(t){return s.sync.call(e,this,t)},update:function(t){return s.update.call(e,this,t)},save:function(t){return s.save.call(e,this,t)},remove:function(t){return void 0===t&&(t=!1),s.remove.call(e,this,t)},ref:function(t){return s.ref.call(e,this,t)},clear:function(t){return s.clear.call(e,this,t)},build:function(t,n){return s.buildSub.call(e,this,t,n)},create:function(t,n){return s.createSub.call(e,this,t,n)},getChanges:function(t,n){return s.getChanges.call(e,this,t,n)}}}function f(e,t){var n={};for(var r in e.recordOptions)n[e.recordOptions[r]]={value:t[r]};return n}t.closeEntry=c,t.getEntry=function(e,t,n,r,i){void 0===i&&(i=!0);var s=o.getOptions(n,e),l=a.getStoreKey(t);if(r&&r in e.entry){var d=e.entry[r];return c(d),s.id!==d.options.id&&o.recycleOptions(d.options),d.source=t,d.options=s,d.storeKey=l,d.live=!0,r&&i&&(e.sources[r]=t),d}var p=u(e),y={name:r,options:s,source:t,instance:e,storeKey:l,children:{},recordFunctions:p,recordProperties:f(s,p),live:!0};return r&&r in e.entry||(y.index=e.entryList.length,e.entryList.push(y)),r&&(e.entry[r]=y),r&&i&&(e.sources[r]=t),y},t.updatePointers=function(e,t){var n=t.docs;e.first=n[0],e.last=n[n.length-1]},t.getChanges=function(e){return r.isFunction(e.docChanges)?e.docChanges():r.isArray(e.docChanges)?e.docChanges:[]},t.getEntryRecordFunctions=u,t.getEntryRecordProperties=f},function(e,t,n){"use strict";var r=this&&this.__assign||Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e};Object.defineProperty(t,"__esModule",{value:!0});var o=n(5),a=n(0);function i(e,n){if(n)for(var r in t.mergeOptions){var o=r,a=t.mergeOptions[o];e[o]=a(e[o],n[o])}}t.globalOptions={defined:{},user:void 0,defaults:{onError:function(e){},onMissing:function(){},onSuccess:function(e){},onRemove:function(){},onMutate:function(e){e()},liveOptions:{},propValue:o.PROP_VALUE,recordOptions:o.RECORD_OPTIONS,newDocument:function(e){return{}}},id:0,map:{}},t.getOptionsByKey=function(e){return t.globalOptions.map[parseInt(e)]},t.getOptions=function e(n,r){if(a.isString(n)){if(!(n in t.globalOptions.defined))throw"The definition "+n+" was not found. You must call define before you use the definition";return e(t.globalOptions.defined[n])}if(n&&a.isObject(n)||(n={}),n.id&&n.id in t.globalOptions.map)return n;if(n.id||(n.id=++t.globalOptions.id,t.globalOptions.map[n.id]=n),n.extends&&i(n,e(n.extends)),i(n,t.globalOptions.user),i(n,t.globalOptions.defaults),r&&!n.shared&&(n.instance=r,r.options[n.id]=n),n.type){var s=n.type;n.newDocument=function(e){return new s}}n.newCollection||(n.newCollection=n.map?function(){return{}}:function(){return[]});var c={};if(n.exclude?a.isArray(n.exclude)?a.forEach(n.exclude,function(e,t){return c[e]=!0}):c=n.exclude:n.key&&(c[n.key]=!0),c[n.propValue]=!0,c[o.PROP_UID]=!0,a.forEach(n.recordOptions,function(e,t){return c[e]=!0}),n.exclude=c,n.sub)for(var u in n.sub){var f=e(n.sub[u],r);f.parent=n,n.sub[u]=f,f.ref||(c[u]=!0)}if(a.isArray(n.timestamps)&&n.timestamps.length){var l=n.decoders||{};a.forEach(n.timestamps,function(e){e in l||(l[e]=a.parseDate)}),n.decoders=l}return n},t.recycleOptions=function(e){var t=e.instance;t&&delete t.options[e.id]},t.define=function(e,n){if(a.isString(e))(o=n).shared=!0,t.globalOptions.defined[e]=o;else for(var r in e){var o;(o=e[r]).shared=!0,t.globalOptions.defined[r]=o}},t.setGlobalOptions=function(e){e&&(e.shared=!0),t.globalOptions.user=e},t.performMerge=i,t.mergeStrategy={ignore:function(e,t){return e},replace:function(e,t){return a.coalesce(e,t)},chain:function(e,t){return a.isDefined(t)?a.isDefined(e)?function(){t.apply(this,arguments)(e).apply(this,arguments)}:t:e},shallow:function(e,t){return a.isDefined(t)?a.isDefined(e)?r({},t,e):t:e},concat:function(e,t){if(!a.isDefined(t))return e;if(!a.isDefined(e))return t;if(a.isArray(e)&&a.isArray(t)){for(var n=e.concat(t),r={},o=n.length-1;o>=0;o--)n[o]in r?n.splice(o,1):r[n[o]]=!0;return n}},exclude:function(e,n){var r=t.mergeStrategy.concat(e,n);if(!r&&e&&n){var o={},i=a.isArray(n),s=a.isArray(e);return a.forEach(n,function(e,t){return e?o[i?e:t]=!0:0}),a.forEach(e,function(e,t){return e?o[s?e:t]=!0:0}),o}return r}},t.mergeOptions={extends:t.mergeStrategy.ignore,id:t.mergeStrategy.ignore,parent:t.mergeStrategy.ignore,shared:t.mergeStrategy.ignore,vm:t.mergeStrategy.ignore,key:t.mergeStrategy.replace,query:t.mergeStrategy.replace,map:t.mergeStrategy.replace,once:t.mergeStrategy.replace,type:t.mergeStrategy.replace,nullifyMissing:t.mergeStrategy.replace,newDocument:t.mergeStrategy.replace,newCollection:t.mergeStrategy.replace,decode:t.mergeStrategy.replace,decoders:t.mergeStrategy.shallow,encoders:t.mergeStrategy.shallow,record:t.mergeStrategy.replace,recordOptions:t.mergeStrategy.replace,recordFunctions:t.mergeStrategy.replace,propValue:t.mergeStrategy.replace,propExists:t.mergeStrategy.replace,propParent:t.mergeStrategy.replace,onceOptions:t.mergeStrategy.replace,liveOptions:t.mergeStrategy.replace,include:t.mergeStrategy.concat,exclude:t.mergeStrategy.exclude,timestamps:t.mergeStrategy.concat,onError:t.mergeStrategy.replace,onSuccess:t.mergeStrategy.replace,onMissing:t.mergeStrategy.replace,onRemove:t.mergeStrategy.replace,onMutate:t.mergeStrategy.replace,sub:t.mergeStrategy.shallow}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(12),o=n(15),a=n(16);function i(e){return(e.source.where?e.options.map?o.default:a.default:r.default)(e)}t.factory=i,t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(4),o=n(0),a=n(1),i=n(3),s=n(2),c=n(14);function u(e,t){var n=this;void 0===t&&(t=!1);var r=a.getCacheForData(e);if(r&&r.ref){var c=r.firstEntry.options;if(!t&&c.sub)for(var f in c.sub)o.forEach(e[f],function(e){u.call(n,e)});return i.stats.deletes++,s.callbacks.onDelete(e,r),r.ref.delete()}return s.callbacks.onInvalidOperation(e,"remove"),Promise.reject("The given data is out of scope and cannot be operated on.")}function f(e,t,n){var r=t.options,i=e.doc(),c=a.getCacheForReference(t,i);return r.defaults&&o.forEach(r.defaults,function(e,t){n&&t in n||(c.data[t]=o.isFunction(e)?e():e)}),n&&o.forEach(n,function(e,t){c.data[t]=e}),s.callbacks.onBuild(c.data,c),c.data}t.pager=function(e){var t=this.entryFor(e);return t?t.pager?t.pager:t.pager=c.getPager(t):null},t.refresh=function(e,t){void 0===t&&(t=!1);var n=a.getCacheForData(e);if(n&&n.ref){var o=n.firstEntry,c=o.options,u=o.instance.system,f={source:t?"cache":"default"};return i.stats.reads++,s.callbacks.onRefresh(e,t),n.ref.get(f).then(function(e){c.onMutate(function(){return e.exists?r.refreshData(n,e,o):(c.propExists&&u.setProperty(n.data,c.propExists,!1),n.exists=!1),n.data})})}return s.callbacks.onInvalidOperation(e,"refresh"),Promise.reject("The given data is out of scope and cannot be operated on.")},t.save=function(e,t){var n=a.getCacheForData(e);if(n&&n.ref){var o=n.firstEntry.options,c=r.encodeData(e,o,t);return n.exists?(i.stats.writes++,i.stats.updates++,s.callbacks.onUpdate(e,c,n),n.ref.update(c)):n.ref.get().then(function(t){if(i.stats.writes++,t.exists)return i.stats.updates++,s.callbacks.onUpdate(e,c,n),n.ref.update(c);var a=r.encodeData(e,o);return i.stats.sets++,s.callbacks.onSet(e,a,n),n.ref.set(a)})}return s.callbacks.onInvalidOperation(e,"save"),Promise.reject("The given data is out of scope and cannot be operated on.")},t.update=function(e,t){var n=a.getCacheForData(e);if(n&&n.ref){var o=n.firstEntry.options,c=r.encodeData(e,o,t);return i.stats.writes++,i.stats.updates++,s.callbacks.onUpdate(e,c,n),n.ref.update(c)}return s.callbacks.onInvalidOperation(e,"update"),Promise.reject("The given data is out of scope and cannot be operated on.")},t.sync=function(e,t){var n=a.getCacheForData(e);if(n&&n.ref){var o=n.firstEntry.options,c=r.encodeData(e,o,t);return i.stats.sets++,i.stats.writes++,s.callbacks.onSet(e,c,n),n.ref.set(c)}return s.callbacks.onInvalidOperation(e,"sync"),Promise.reject("The given data is out of scope and cannot be operated on.")},t.remove=u,t.clear=function(e,t){var n=this,r=a.getCacheForData(e),c=o.getFields(t);if(r&&r.ref){for(var f=r.firstEntry.options,l=r.ref,d=l.firestore,p=[],y={},v=0,g=0,h=c;g<h.length;g++){var b=h[g];if(f.sub&&b in f.sub&&e[b])o.forEach(e[b],function(e){p.push(u.call(n,e))});else if(b in e){var m=d.app.firebase_;m&&(y[b]=m.firestore.FieldValue.delete(),v++)}}return v>0&&(i.stats.updates++,i.stats.writes++,p.push(l.update(y))),s.callbacks.onClear(e,c),Promise.all(p)}return s.callbacks.onInvalidOperation(e,"clear"),Promise.reject("The given data is out of scope and cannot be operated on.")},t.getChanges=function(e,t,n){var c=a.getCacheForData(e);if(c&&c.ref){var u=o.isFunction(t)?void 0:o.getFields(t),f=(u?n:t)||o.isEqual,l=c.firstEntry.options,d=r.encodeData(e,l,u);return i.stats.reads++,s.callbacks.onGetChanges(e,c,u),c.ref.get().then(function(e){var t=r.parseDocument(e,l),n={},o={},a=!1;for(var i in d){var s=t[i],c=d[i];f(s,c)||(a=!0,n[i]=s,o[i]=c)}return Promise.resolve({changed:a,remote:n,local:o})})}return s.callbacks.onInvalidOperation(e,"getChanges"),Promise.reject("The given data is out of scope and cannot be operated on.")},t.ref=function(e,t){var n=a.getCacheForData(e);if(n&&n.ref){var r=n.ref;return t?r.collection(t):r}throw"The given data is out of scope and cannot be referenced."},t.create=function(e,t){var n=this.build(e,t);return n&&this.sync(n),n},t.createSub=function(e,t,n){var r=this.buildSub(e,t,n);return r&&this.sync(r),r},t.build=function(e,t){var n=this.entryFor(e);if(n)return f(n.source,n,t);throw"Cannot build "+e+NaN},t.buildSub=function(e,t,n){var r=a.getCacheForData(e);if(r&&r.ref&&t in r.sub){var o=r.sub[t];return f(r.ref.collection(t),o,n)}throw"Cannot build in the sub collection "+t+NaN},t.buildFromCollection=f},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(11);t.getInstance=r.getInstance,function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(5));var o=n(3);t.stats=o.stats;var a=n(2);t.callbacks=a.callbacks;var i=n(7);t.define=i.define,t.setGlobalOptions=i.setGlobalOptions,t.mergeStrategy=i.mergeStrategy,t.mergeOptions=i.mergeOptions,t.getOptions=i.getOptions;var s=n(1);t.getCacheForData=s.getCacheForData,t.destroyCache=s.destroyCache,t.default=r.getInstance},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=n(8),a=n(6),i=n(1),s=n(7),c=n(2),u=n(9);function f(){var e=this;r.forEach(this.options,function(e){return delete s.globalOptions.map[e.id]}),r.forEach(this.cache,function(t){return i.removeCacheFromInstance(t,e)}),r.forEach(this.entryList,function(e){return a.closeEntry(e,!0)}),this.entry={},this.entryList=[],this.options={},this.sources={},this.cache={},c.callbacks.onInstanceDestroy(this)}function l(e){var t=this.entryFor(e);null!==t&&a.closeEntry(t,!0)}function d(e){if(r.isString(e))return this.entry[e];for(var t=this.entryList,n=0;n<t.length;n++){var o=t[n];if(o&&o.target===e)return o}return null}function p(e){for(var t=this.entryList,n=0;n<t.length;n++){var r=t[n];if(null!==r&&!r.options.parent&&!r.name)for(var o in e)if(e[o]===r.target){r.name=o,this.entry[o]=r,this.sources[o]=r.source;break}}}t.getInstance=function(e){var t=function(e){var t=e||{};for(var n in y){var r=n;r in t||(t[r]=y[r])}return t}(e),n=function(e,t,r){return o.factory(a.getEntry(n,e,t,r))};return n.system=t,n.entry={},n.entryList=[],n.options={},n.sources={},n.cache={},n.pager=u.pager,n.refresh=u.refresh,n.update=u.update,n.save=u.save,n.sync=u.sync,n.remove=u.remove,n.clear=u.clear,n.getChanges=u.getChanges,n.ref=u.ref,n.create=u.create,n.createSub=u.createSub,n.build=u.build,n.buildSub=u.buildSub,n.entryFor=d,n.destroy=f,n.free=l,n.linkSources=p,c.callbacks.onInstanceCreate(n),n};var y={removeNamed:function(e){},setProperty:function(e,t,n){e[t]=n},removeProperty:function(e,t){delete e[t]},arraySet:function(e,t,n){e[t]=n},arrayAdd:function(e,t){e.push(t)},arrayResize:function(e,t){e.length=t}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(4),o=n(1),a=n(3),i=n(2);function s(e){var t=e.source,n=e.options,r=o.getCacheForReference(e,t,!0),i=e.target,s=!1,u=function(){},f=function(){},l=function(t){return n.onMutate(function(){return c(r,e,t),r.data}),s=!t.exists,u(r.data),r.data};return i&&i!==r.data&&o.removeDataFromEntry(e,i),e.target=r.data,a.stats.queries++,n.once?e.promise=t.get(n.onceOptions).then(l).catch(n.onError):(e.promise=new Promise(function(e,t){u=e,f=t}),e.off=t.onSnapshot(n.liveOptions,l,function(e){f(e),n.onError(e)})),s&&n.nullifyMissing?null:e.target}function c(e,t,n){var a=t.options,s=t.instance.system;n.exists?(r.refreshData(e,n,t),a.onSuccess(e.data),i.callbacks.onDocumentUpdate(e.data,t)):(i.callbacks.onDocumentMissing(e.data,t),a.propExists&&s.setProperty(e.data,a.propExists,!1),e.exists=!1,a.nullifyMissing&&(o.destroyCache(e),t.name&&s.removeNamed(t.name)))}t.factory=s,t.handleDocumentUpdate=c,t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.stores={keyNext:0,map:{},idToKey:{}},t.getStoreKey=function(e){var n=e.firestore,r=n.app.name,o=t.stores.idToKey[r];return o||(o=++t.stores.keyNext,t.stores.map[o]=n,t.stores.idToKey[r]=o),o}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0);t.getPager=function(e){var t;return{index:0,hasQuery:function(){return!(!e.query||!e.requery)},hasData:function(){var t=e.target;if(r.isArray(t))return t.length>0;if(r.isObject(t))for(var n in t)return!0;return!1},hasNext:function(){return this.hasQuery()&&this.hasData()},hasPrev:function(){return this.hasQuery()&&this.index>0},next:function(){var n=e.query,r=e.requery,o=e.last,a=e.first,i=e.off;return!!(n&&r&&o&&this.hasData())&&(i&&i(),delete e.off,delete e.last,this.index++,t=a,r(n.startAfter(o)),!0)},prev:function(){var n=e.query,r=e.requery,o=e.first,a=e.off;return!!(n&&r&&(o||t)&&this.index>0)&&(a&&a(),delete e.off,this.index--,o?(delete e.first,r(n.endBefore(o))):(r(n.startAt(t)),t=void 0),!0)}}}},function(e,t,n){"use strict";var r=this&&this.__assign||Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e};Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=n(4),i=n(1),s=n(3),c=n(6),u=n(2);t.default=function(e){var t=e.options,n=t.query?t.query(e.source):e.source;return e.requery=function(n){var f=function(e){var t=e.options,n=e.instance.system;return function(s){var f=e.target,l=r({},f);return t.onMutate(function(){return s.forEach(function(t){var r=i.getCacheForDocument(e,t,!0);a.refreshData(r,t,e),n.setProperty(f,t.id,r.data),delete l[t.id],u.callbacks.onCollectionAdd(r.data,f,e)},t.onError),o.forEach(l,function(e,t){return n.removeProperty(f,t)}),f}),o.forEach(l,function(t){u.callbacks.onCollectionRemove(t,f,e),i.removeDataFromEntry(e,t)}),t.onSuccess(f),c.updatePointers(e,s),u.callbacks.onCollectionChanged(f,e),f}}(e);if(e.target||(e.target=t.newCollection()),s.stats.queries++,t.once)e.promise=n.get(t.onceOptions).then(f).catch(t.onError);else{var l=function(){},d=function(){};e.promise=new Promise(function(e,t){l=e,d=t}),e.off=n.onSnapshot(t.liveOptions,function(e,t,n){var r=function(e){var t=e.options,n=e.instance.system;return function(r){var o=e.target;t.onMutate(function(){var s=c.getChanges(r);return s.forEach(function(r){var s=r.doc,c=i.getCacheForDocument(e,s);switch(r.type){case"modified":var f=a.refreshData(c,s,e);n.setProperty(o,s.id,f),u.callbacks.onCollectionModify(f,o,e);break;case"added":var l=a.refreshData(c,s,e);n.setProperty(o,s.id,l),u.callbacks.onCollectionAdd(l,o,e);break;case"removed":u.callbacks.onCollectionRemove(c.data,o,e),n.removeProperty(o,s.id),s.exists?i.removeCacheFromEntry(e,c):(t.propExists&&n.setProperty(c.data,t.propExists,!1),c.exists=!1,i.destroyCache(c))}},t.onError),o}),t.onSuccess(o),c.updatePointers(e,r),u.callbacks.onCollectionChanged(o,e)}}(e),o=t;return function(t){o(t),n(e.target),o=r}}(e,f,l),function(e){d(e),t.onError(e)})}},e.requery(e.query=n),e.target}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(5),o=n(4),a=n(1),i=n(0),s=n(6),c=n(3),u=n(2);function f(e){var t=e.options,n=t.query?t.query(e.source):e.source;return e.requery=function(n){var f=function(e){var t=e.options,n=e.instance.system,c=e.target;return function(f){var l=e.target,d={};if(c)for(var p=0;p<l.length;p++){var y=l[p];d[y[r.PROP_UID]]=y}return t.onMutate(function(){return n.arrayResize(l,0),f.forEach(function(t){var r=a.getCacheForDocument(e,t,!0);o.refreshData(r,t,e),n.arrayAdd(l,r.data),delete d[r.uid],u.callbacks.onCollectionAdd(r.data,l,e)},t.onError),l}),i.forEach(d,function(t){u.callbacks.onCollectionRemove(t,l,e),a.removeDataFromEntry(e,t)}),t.onSuccess(l),s.updatePointers(e,f),u.callbacks.onCollectionChanged(l,e),l}}(e);if(e.target||(e.target=t.newCollection()),c.stats.queries++,t.once)e.promise=n.get(t.onceOptions).then(f).catch(t.onError);else{var l=function(){},d=function(){};e.promise=new Promise(function(e,t){l=e,d=t}),e.off=n.onSnapshot(t.liveOptions,function(e,t,n){var r=function(e){var t=e.options,n=e.instance.system;return function(r){var i=e.target;t.onMutate(function(){var c=s.getChanges(r);return c.forEach(function(r){var s=r.doc,c=a.getCacheForDocument(e,s);switch(r.type){case"added":var f=o.refreshData(c,s,e);n.arraySet(i,r.newIndex,f),u.callbacks.onCollectionAdd(f,i,e);break;case"removed":u.callbacks.onCollectionRemove(c.data,i,e),s.exists?a.removeCacheFromEntry(e,c):(t.propExists&&n.setProperty(c.data,t.propExists,!1),c.exists=!1,a.destroyCache(c));break;case"modified":var l=o.refreshData(c,s,e);r.oldIndex!==r.newIndex&&n.arraySet(i,r.newIndex,l),u.callbacks.onCollectionModify(l,i,e)}},t.onError),n.arrayResize(i,r.size),i}),t.onSuccess(i),s.updatePointers(e,r),u.callbacks.onCollectionChanged(i,e)}}(e),i=t;return function(t){i(t),n(e.target),i=r}}(e,f,l),function(e){d(e),t.onError(e)})}},e.requery(e.query=n),e.target}t.factory=f,t.default=f}])},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(0);function a(e){return u(e,"fieryMutation can only be passed a function which accepts (state, payload, $fiery)"),function(t,n){e(t,n,r)}}function i(e){return u(e,"fieryAction can only be passed a function which accepts (context, payload, $fiery)"),function(t,n){return e(t,n,r)}}function s(e,t){return f(e,"fieryBinding must be passed the action name as the first argument"),u(t,"fieryBinding can only be passed a function which accepts (context, payload, $fiery)"),function(n,a){var i,s=this,c=!1,u="",l=t(n,a,function(t,a,l){var d=a?o.getOptions(a):void 0;return u=l,i={extends:d,sub:function e(t,n){if(n&&n.sub){var r=n.sub,o={};for(var a in r){var i=r[a];o[a]={extends:i,sub:e(t,i),onMutate:function(e){t._withCommit(e)}}}return o}}(s,d),onMutate:function(e){n.commit(l,e),c=!0}},f(l,"fieryBinding must be passed the mutation as the third argument to $fiery"),r(t,i,e)});!c&&u&&n.commit(u,function(){return l});var d=r.entryFor(e);return d&&d.promise?d.promise:Promise.resolve(l)}}function c(e,t){l(null!==e&&"object"==typeof e,t)}function u(e,t){l("function"==typeof e,t)}function f(e,t){l("string"==typeof e,t)}function l(e,t){if(!e)throw t}!function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(0)),t.default={install:function(e,t){r=o.default({setProperty:function(t,n,r){e.set(t,n,r)},removeProperty:function(t,n){e.delete(t,n)},arraySet:function(e,t,n){e[t]!==n&&e.splice(t,1,n)},arrayResize:function(e,t){e.length>t?e.splice(t,e.length-t):e.length<t&&(e.length=t)}}),this.$fiery=r}},t.fieryMapMutations=function(e){var t={};c(e,"fieryMapMutations can only be passed an object");var n=function(n){var r=e[n];f(r,"fieryMapMutations can only have properties that are strings"),t[n]=function(e,t){e[r]=t()}};for(var r in e)n(r);return t},t.fieryMutations=function(e){var t={};for(var n in c(e,"fieryMutations can only be passed an object"),e)t[n]=a(e[n]);return t},t.fieryMutation=a,t.fieryActions=function(e){var t={};for(var n in c(e,"fieryActions can only be passed an object"),e)t[n]=i(e[n]);return t},t.fieryAction=i,t.fieryBindings=function(e){var t={};for(var n in e)t[n]=s(n,e[n]);return t},t.fieryBinding=s}]).default});