define("bui/uploader",["bui/common","jquery","bui/list","bui/data","bui/swf"],function(e,t,i){var r=e("bui/common"),n=r.namespace("Uploader");r.mix(n,{Uploader:e("bui/uploader/uploader"),Queue:e("bui/uploader/queue"),Theme:e("bui/uploader/theme"),Factory:e("bui/uploader/factory")}),i.exports=n}),define("bui/uploader/uploader",["jquery","bui/common","bui/list","bui/data","bui/swf"],function(e,t,i){function r(e){return f[e]&&f[e]()}function n(e,t,i){u.isFunction(e.set)?e.set(t,i):e[t]=i}var a=e("jquery"),u=e("bui/common"),o=u.Component,s=e("bui/uploader/file"),l=e("bui/uploader/theme"),c=e("bui/uploader/factory"),d=e("bui/uploader/validator"),f={ajax:function(){return!!window.FormData},flash:function(){return!0},iframe:function(){return!0}},p=o.Controller.extend({initializer:function(){var e=this;e._initTheme(),e._initType()},renderUI:function(){var e=this;e._renderButton(),e._renderUploaderType(),e._renderQueue(),e._initValidator()},bindUI:function(){var e=this;e._bindButton(),e._bindUploaderCore(),e._bindQueue()},_initTheme:function(){var e=this,t=l.getTheme(e.get("theme")),i=e.getAttrVals();u.each(t,function(t,r){void 0===i[r]?e.set(r,t):a.isPlainObject(t)&&(u.mix(t,i[r]),e.set(r,t))})},_initType:function(){var e=this,t=e.get("types"),i=e.get("type");i||u.each(t,function(e){return r(e)?(i=e,!1):void 0}),e.set("type",i)},_initValidator:function(){var e=this,t=e.get("validator");t||(t=new d({queue:e.get("queue"),rules:e.get("rules")}),e.set("validator",t))},_renderUploaderType:function(){var e=this,t=e.get("type"),i=e.get("uploaderType"),r=c.createUploadType(t,i);r.set("uploader",e),e.set("uploaderType",r)},_renderButton:function(){var e=this,t=e.get("type"),i=e.get("el"),r=e.get("button");r.isController||(r.render=i,r.autoRender=!0,r=c.createButton(t,r),e.set("button",r)),r.set("uploader",e)},_renderQueue:function(){var e=this,t=e.get("el"),i=e.get("queue");i.isController||(i.render=t,i.autoRender=!0,i=c.createQueue(i),e.set("queue",i)),i.set("uploader",e)},_bindButton:function(){var e=this,t=e.get("button"),i=e.get("queue");t.on("change",function(t){var r=t.files;i.addItems(r),e.fire("change",{items:r})})},_bindQueue:function(){var e=this,t=e.get("queue"),i=(e.get("button"),e.get("validator"));t.on("itemrendered",function(r){var n=r.item,a=t.status(n)||"add";n.isUploaderFile||(n.result=u.cloneObject(n),n=s.create(n)),i.valid(n)||(a="error"),t.updateFileStatus(n,a),e.get("autoUpload")&&e.upload()}),t.on("itemupdated",function(){e.uploadFiles()})},_bindUploaderCore:function(){var e=this,t=e.get("queue"),i=e.get("uploaderType");i.on("start",function(t){var i=t.file;delete i.result,e.fire("start",{item:i})}),i.on("progress",function(i){var r=e.get("curUploadItem"),n=i.loaded,a=i.total;u.mix(r,{total:a,loaded:n,loadedPercent:100*n/a}),t.updateFileStatus(r,"progress"),e.fire("progress",{item:r,total:a,loaded:n})}),i.on("error",function(){var i=e.get("curUploadItem"),r=e.get("error"),n=e.get("complete");t.updateFileStatus(i,"error"),r&&u.isFunction(r)&&r.call(e),e.fire("error",{item:i}),n&&u.isFunction(n)&&n.call(e),e.fire("complete",{item:i}),e.set("curUploadItem",null)}),i.on("complete",function(i){var r=e.get("curUploadItem"),n=i.result,a=e.get("isSuccess"),o=e.get("success"),s=e.get("error"),l=e.get("complete");e.set("curUploadItem",null),r.result=n,a.call(e,n)?(u.mix(r,n),t.updateFileStatus(r,"success"),o&&u.isFunction(o)&&o.call(e,n),e.fire("success",{item:r,result:n})):(t.updateFileStatus(r,"error"),s&&u.isFunction(s)&&s.call(e,n),e.fire("error",{item:r,result:n})),l&&u.isFunction(l)&&l.call(e,n),e.fire("complete",{item:r,result:n})})},uploadFile:function(e){var t=this,i=t.get("queue"),r=t.get("uploaderType"),n=t.get("curUploadItem");e&&!n&&(t.set("curUploadItem",e),i.updateFileStatus(e,"start"),r.upload(e))},uploadFiles:function(){var e=this,t=e.get("queue"),i=t.getItemsByStatus("wait");i&&i.length&&e.uploadFile(i[0])},upload:function(){var e=this,t=e.get("queue"),i=t.getItemsByStatus("add");u.each(i,function(e){t.updateFileStatus(e,"wait")})},cancel:function(e){var t=this;return e?void t._cancel(e):void u.each(t.get("queue").getItemsByStatus("wait"),function(e){t._cancel(e)})},_cancel:function(e){var t=this,i=t.get("queue"),r=t.get("uploaderType"),n=t.get("curUploadItem");n===e&&(r.cancel(),t.set("curUploadItem",null)),i.updateFileStatus(e,"cancel"),t.fire("cancel",{item:e})},isValid:function(){var e=this,t=e.get("queue");return t.getItemsByStatus("success").length===t.getItems().length}},{ATTRS:{types:{value:["ajax","flash","iframe"]},type:{},theme:{value:"default"},button:{value:{},shared:!1},text:{setter:function(e){return n(this.get("button"),"text",e),e}},name:{setter:function(e){return n(this.get("button"),"name",e),n(this.get("uploaderType"),"fileDataName",e),e}},disabled:{value:!1,setter:function(e){return n(this.get("button"),"disabled",e),e}},multiple:{value:!0,setter:function(e){return n(this.get("button"),"multiple",e),e}},filter:{setter:function(e){return n(this.get("button"),"filter",e),e}},uploaderType:{value:{},shared:!1},url:{setter:function(e){return n(this.get("uploaderType"),"url",e),e}},data:{setter:function(e){return n(this.get("uploaderType"),"data",e),e}},queue:{value:{},shared:!1},resultTpl:{setter:function(e){return n(this.get("queue"),"resultTpl",e),e}},autoUpload:{value:!0},uploadStatus:{},isSuccess:{value:function(e){return e&&e.url?!0:!1}},validator:{},events:{value:{change:!1,start:!1,progress:!1,success:!1,error:!1,complete:!1,cancel:!1}}}},{xclass:"uploader"});i.exports=p}),define("bui/uploader/file",["bui/common","jquery"],function(e,t,i){function r(e){return e.replace(/.*(\/|\\)/,"")}function n(e){var t=/\.[^\.]+$/.exec(e)||[];return t.join("").toLowerCase()}function a(e){var t=-1;do e/=1024,t++;while(e>99);return Math.max(e,.1).toFixed(1)+["KB","MB","GB","TB","PB","EB"][t]}var u=e("bui/common");i.exports={create:function(e){return e.id=e.id||u.guid("bui-uploader-file"),e.name=r(e.name),e.ext=n(e.name),e.textSize=a(e.size),e.isUploaderFile=!0,e}}}),define("bui/uploader/theme",["bui/common","jquery"],function(e,t,i){var r=e("bui/common"),n={},a={addTheme:function(e,t){n[e]=t},getTheme:function(e){return r.cloneObject(n[e])}};a.addTheme("default",{elCls:"defaultTheme"}),a.addTheme("imageView",{elCls:"imageViewTheme",queue:{resultTpl:{success:'<div class="success"><img src="{url}" /></div>'}}}),i.exports=a}),define("bui/uploader/factory",["bui/common","jquery","bui/list","bui/data","bui/swf"],function(e,t,i){function r(){}var n=(e("bui/common"),e("bui/uploader/queue")),a=e("bui/uploader/button/htmlButton"),u=e("bui/uploader/button/swfButton"),o=e("bui/uploader/type/ajax"),s=e("bui/uploader/type/flash"),l=e("bui/uploader/type/iframe");r.prototype={createUploadType:function(e,t){return"ajax"===e?new o(t):"flash"===e?new s(t):new l(t)},createButton:function(e,t){return"ajax"===e||"iframe"===e?new a(t):new u(t)},createQueue:function(e){return new n(e)}},i.exports=new r}),define("bui/uploader/queue",["jquery","bui/common","bui/list","bui/data"],function(e,t,i){var r=e("jquery"),n=e("bui/common"),a=e("bui/list").SimpleList,u=n.prefix+"queue",o=u+"-item",s=a.extend({bindUI:function(){var e=this,t=e.get("el"),i=e.get("delCls");t.delegate("."+i,"click",function(t){var i=r(t.target).parents(".bui-queue-item"),n=e.getItemByElement(i);e.fire("beforeremove",{item:n})!==!1&&e.removeItem(n)})},removeItem:function(e){var t=this,i=t.get("uploader");i&&i.cancel&&i.cancel(e),s.superclass.removeItem.call(t,e)},updateFileStatus:function(e,t,i){var r=this,a=r.get("itemStatusFields");i=i||r.findElement(e),n.each(a,function(t,n){r.setItemStatus(e,n,!1,i)}),r.setItemStatus(e,t,!0,i),r._setResultTpl(e,t),r.updateItem(e)},_setResultTpl:function(e,t){var i=this,r=i.get("resultTpl"),a=r[t]||r["default"],u=n.mix(e,e.result);e.resultTpl=n.substitute(a,u)},status:function(e){var t,i=this,r=i.get("itemStatusFields");return n.each(r,function(i){return e[i]?(t=i,!1):void 0}),t}},{ATTRS:{itemTpl:{value:'<li>{resultTpl} <span class="action"><span class="'+o+'-del">\u5220\u9664</span></span></li>'},resultTpl:{value:{"default":'<div class="default">{name}</div>',success:'<div data-url="{url}" class="success">{name}</div>',error:'<div class="error"><span title="{name}">{name}</span><span class="uploader-error">{msg}</span></div>',progress:'<div class="progress"><div class="bar" style="width:{loadedPercent}%"></div></div>'},setter:function(e){return n.mix({},this.get("resultTpl"),e)}},itemCls:{value:o},delCls:{value:o+"-del"},itemStatusFields:{value:{add:"add",wait:"wait",start:"start",progress:"progress",success:"success",cancel:"cancel",error:"error"}}}},{xclass:"queue"});i.exports=s}),define("bui/uploader/button/htmlButton",["jquery","bui/common"],function(e,t,i){var r=e("jquery"),n=e("bui/common"),a=(n.Component,e("bui/uploader/file")),u=e("bui/uploader/button/base"),o=n.UA,s=u.extend({renderUI:function(){var e=this;e._createInput()},_createInput:function(){var e,t=this,i=t.get("buttonCls"),r=t.get("el").find("."+i),a=t.get("inputTpl"),u=t.get("name");a=n.substitute(a,{name:u}),r.append(a),e=r.find("input"),6==o.ie&&e.css("fontSize","400px"),t._bindChangeHandler(e),t.set("fileInput",e),t._uiSetMultiple(t.get("multiple")),t._uiSetDisabled(t.get("disabled")),t._uiSetFilter(t.get("filter"))},_bindChangeHandler:function(e){var t=this;r(e).on("change",function(i){var u=r(this).val(),o=i.target.files,s=[];o?n.each(o,function(t){s.push(a.create({name:t.name,type:t.type,size:t.size,file:t,input:e}))}):s.push(a.create({name:u,input:e})),t.fire("change",{files:s,input:this}),t.reset()})},reset:function(){var e=this,t=e.get("fileInput");return t.parent().remove(),e.set("fileInput",null),e._createInput(),e},_uiSetMultiple:function(e){var t=this,i=t.get("fileInput");return i&&i.length?(e?i.attr("multiple","multiple"):i.removeAttr("multiple"),e):!1},_uiSetDisabled:function(e){var t=this,i=t.get("fileInput");e?i.hide():i.show()},_uiSetFilter:function(e){var t=this,i=t.get("fileInput"),r=t.getFilter(e);return i&&i.length?(r.type&&i.attr("accept",r.type),r):!1},_uiSetName:function(e){r(this.get("fileInput")).attr("name",e)}},{ATTRS:{inputTpl:{view:!0,value:'<div class="file-input-wrapper"><input type="file" name="{name}" hidefocus="true" class="file-input" /></div>'},fileInput:{}}},{xclass:"uploader-htmlButton"});i.exports=s}),define("bui/uploader/button/base",["bui/common","jquery"],function(e,t,i){var r=e("bui/common"),n=r.Component,a=e("bui/uploader/button/filter"),u=r.prefix,o=u+"uploader",s=o+"-button",l=s+"-text",c=n.View.extend({_uiSetText:function(){var e=this,t=e.get("text"),i=e.get("textCls"),r=e.get("el").find("."+i);r.text(t)}},{ATTRS:{}},{xclass:"uploader-button-view"}),d=n.Controller.extend({getFilter:function(e){if(e){var t=[],i=[],r=[];return e.desc&&(t.push(e.desc),i.push(a.getExtByDesc(e.desc)),r.push(a.getTypeByDesc(e.desc))),e.ext&&(i.push(e.ext),r.push(a.getTypeByExt(e.ext))),e.type,{desc:t.join(","),ext:i.join(","),type:r.join(",")}}}},{ATTRS:{buttonCls:{value:s+"-wrap",view:!0},textCls:{value:l,view:!0},text:{view:!0,value:"\u4e0a\u4f20\u6587\u4ef6"},name:{value:"fileData"},tpl:{view:!0,value:'<a href="javascript:void(0);" class="'+s+'-wrap"><span class="'+l+'">{text}</span></a>'},disabled:{value:!1},multiple:{value:!0},filter:{shared:!1,value:[]},events:{value:{change:!1}},xview:{value:c}}},{xclass:"uploader-button"});d.View=c,i.exports=d}),define("bui/uploader/button/filter",["bui/common","jquery"],function(e,t,i){var r=e("bui/common"),n={msexcel:{type:"application/msexcel",ext:".xls,.xlsx"},msword:{type:"application/msword",ext:".doc,.docx"},gif:{type:"image/gif",ext:".gif"},jpeg:{type:"image/jpeg",ext:".jpg"},bmp:{type:"image/x-ms-bmp",ext:".bmp"},png:{type:"image/png",ext:".png"}};i.exports={_getValueByDesc:function(e,t){var i=[];return r.isString(e)&&(e=e.split(",")),r.isArray(e)&&r.each(e,function(e){var r=n[e];r&&r[t]&&i.push(r[t])}),i.join(",")},getTypeByDesc:function(e){return this._getValueByDesc(e,"type")},getExtByDesc:function(e){return this._getValueByDesc(e,"ext")},getTypeByExt:function(e){var t=[];return r.isString(e)&&(e=e.split(",")),r.isArray(e)&&r.each(e,function(e){r.each(n,function(i){r.Array.indexOf(e,i.ext.split(","))>-1&&t.push(i.type)})}),t.join(",")}}}),define("bui/uploader/button/swfButton",["jquery","bui/common","bui/swf"],function(e,t,i){function r(){return window.seajs?seajs.pluginSDK?seajs.pluginSDK.util.loaderDir:seajs.data.paths.bui:window.KISSY?KISSY.Config.packages.bui.base:void 0}var n=e("jquery"),a=e("bui/common"),u=(a.Component,e("bui/uploader/file")),o=e("bui/uploader/button/base"),s=r(),l=e("bui/uploader/button/ajbridge"),c=o.extend({renderUI:function(){var e=this;e._initSwfUploader()},bindUI:function(){var e=this,t=e.get("swfUploader");t.on("contentReady",function(){e.fire("swfReady",{swfUploader:t}),t.on("fileSelect",function(t){var i=t.fileList,r=[];a.each(i,function(e){r.push(u.create(e))}),e.fire("change",{files:r})})})},syncUI:function(){var e=this,t=e.get("swfUploader");t.on("contentReady",function(){e._uiSetMultiple(e.get("multiple")),e._uiSetFilter(e.get("filter"))})},_initSwfUploader:function(){var e,t=this,i=t.get("buttonCls"),r=t.get("el").find("."+i),u=t.get("flash"),o=t.get("flashUrl"),s=t.get("swfTpl"),c=n(s).appendTo(r);a.mix(u,{render:c,src:o}),e=new l(u),t.set("swfEl",c),t.set("swfUploader",e)},_uiSetMultiple:function(e){var t=this,i=t.get("swfUploader");return i&&i.multifile(e),e},_uiSetDisabled:function(e){var t=this,i=t.get("swfEl");return e?i.hide():i.show(),e},_convertFilter:function(e){var t=(e.desc,[]);return a.each(e.ext.split(","),function(e){e&&t.push("*"+e)}),e.ext=t.join(";"),e},_uiSetFilter:function(e){var t=this,i=t.get("swfUploader"),r=t._convertFilter(t.getFilter(e));return i&&i.filter([r]),e}},{ATTRS:{swfEl:{},swfUploader:{},flashUrl:{value:s+"uploader.swf"},flash:{value:{params:{allowscriptaccess:"always",bgcolor:"#fff",wmode:"transparent",flashvars:{hand:!0,btn:!0,jsEntry:"BUI.AJBridge.eventHandler"}}},shared:!1},swfTpl:{view:!0,value:'<div class="uploader-button-swf"></div>'}}},{xclass:"uploader-swfButton"});i.exports=c}),define("bui/uploader/button/ajbridge",["bui/common","jquery","bui/swf"],function(e,t,i){function r(e){r.superclass.constructor.call(this,e)}var n=e("bui/common"),a=e("bui/swf"),u={};n.mix(r,{eventHandler:function(e,t){var i=u[e];i&&i.__eventHandler(e,t)},augment:function(e,t){n.isString(t)&&(t=[t]),n.isArray(t)&&n.each(t,function(t){e.prototype[t]=function(){try{return this.callSWF(t,Array.prototype.slice.call(arguments,0))}catch(e){this.fire("error",{message:e})}}})}}),n.extend(r,a),n.augment(r,{initializer:function(){r.superclass.initializer.call(this);var e=this,t=e.get("attrs"),i=t.id;u[i]=e,e.set("id",i)},__eventHandler:function(e,t){var i=this,r=t.type;switch(t.id=e,r){case"log":n.log(t.message);break;default:i.fire(r,t)}},destroy:function(){r.superclass.destroy.call(this);var e=this.get("id");u[e]&&delete u[e]}}),r.augment(r,["activate","getReady","getCoreVersion","setFileFilters","filter","setAllowMultipleFiles","multifile","browse","upload","uploadAll","cancel","getFile","removeFile","lock","unlock","setBtnMode","useHand","clear"]),n.AJBridge=r,i.exports=r}),define("bui/uploader/type/ajax",["bui/common","jquery"],function(e,t,i){function r(e){var t=this;r.superclass.constructor.call(t,e)}var n="[uploader-Ajax]:",a=e("bui/uploader/type/base");BUI.extend(r,a,{upload:function(e){if(!e||!e.file)return BUI.log(n+"upload()\uff0cfileData\u53c2\u6570\u6709\u8bef\uff01"),!1;var t=this;return t.set("file",e),t.fire("start",{file:e}),t._setFormData(),t._addFileData(e.file),t.send(),t},cancel:function(){var e=this,t=e.get("xhr"),i=e.get("file");return t&&(t.abort(),e.fire("cancel",{file:i})),e.set("file",null),e},send:function(){var e=this,t=e.get("url"),i=e.get("formData"),r=e.get("file"),n=new XMLHttpRequest;return n.upload.addEventListener("progress",function(t){e.fire("progress",{loaded:t.loaded,total:t.total})}),n.onload=function(){var t=e._processResponse(n.responseText);e.fire("complete",{result:t,file:r})},n.onerror=function(){e.fire("error",{file:r})},n.open("POST",t,!0),n.send(i),e._setFormData(),e.set("xhr",n),e},reset:function(){},_setFormData:function(){var e=this;try{e.set("formData",new FormData),e._processData()}catch(t){BUI.log(n+"something error when reset FormData."),BUI.log(t,"dir")}},_processData:function(){var e=this,t=e.get("data"),i=e.get("formData");BUI.each(t,function(e,t){i.append(t,e)}),e.set("formData",i)},_addFileData:function(e){if(!e)return BUI.log(n+"_addFileData()\uff0cfile\u53c2\u6570\u6709\u8bef\uff01"),!1;var t=this,i=t.get("formData"),r=t.get("fileDataName");i.append(r,e),t.set("formData",i)}},{ATTRS:{formData:{},xhr:{},events:{value:{progress:!1}}}}),i.exports=r}),define("bui/uploader/type/base",["bui/common","jquery"],function(e,t,i){function r(e){var t=this;r.superclass.constructor.call(t,e)}var n=e("bui/common");r.ATTRS={file:{},url:{},data:{},fileDataName:{value:"Filedata"},events:{value:{start:!1,cancel:!1,success:!1,error:!1}}},n.extend(r,n.Base,{upload:function(){},cancel:function(){},_processResponse:function(e){{var t,i=this;i.get("file")}if(n.isString(e))try{t=n.JSON.parse(e)}catch(r){t=e}else n.isObject(e)&&(t=i._fromUnicode(e));return n.log("\u670d\u52a1\u5668\u7aef\u8f93\u51fa\uff1a"+n.JSON.stringify(t)),t},_fromUnicode:function(e){function t(e){n.each(e,function(i,r){n.isObject(e[r])?t(e[r]):e[r]=n.isString(i)&&n.fromUnicode(i)||i})}return n.isObject(e)?(t(e),e):e},reset:function(){}}),i.exports=r}),define("bui/uploader/type/flash",["jquery","bui/common"],function(e,t,i){function r(e){var t=this;r.superclass.constructor.call(t,e)}var n=e("jquery"),a=e("bui/uploader/type/base"),u="[uploader-Flash]:",o=new RegExp("^([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$"),s=new RegExp("^(?:([\\w\\d+.-]+):)?(?://([\\w\\d\\-\\u0100-\\uffff.+%]*))?.*$");BUI.extend(r,a,{_initSwfUploader:function(){var e=this,t=e.get("swfUploader");return t?(e.fire("swfReady"),e._hasCrossdomain(),t.on("uploadStart",function(){var t=e.get("file");e.fire("start",{file:t})}),t.on("uploadProgress",function(t){BUI.mix(t,{loaded:t.bytesLoaded,total:t.bytesTotal}),BUI.log(u+"\u5df2\u7ecf\u4e0a\u4f20\u5b57\u8282\u6570\u4e3a\uff1a"+t.bytesLoaded),e.fire("progress",{loaded:t.loaded,total:t.total})}),t.on("uploadCompleteData",function(t){var i=e.get("file"),r=e._processResponse(t.data);e.fire("complete",{result:r,file:i}),e.set("file",null)}),void t.on("uploadError",function(){var t=e.get("file");e.fire("error",{file:t}),e.set("file",null)})):(BUI.log(u+"swfUploader\u5bf9\u8c61\u4e3a\u7a7a\uff01"),!1)},upload:function(e){var t=this,i=t.get("swfUploader"),r=t.get("url"),n="POST",a=t.get("data"),u=t.get("fileDataName");if(e)return t.set("file",e),i.upload(e.id,r,n,a,u),t},cancel:function(){var e=this,t=e.get("swfUploader"),i=e.get("file");return i&&(t.cancel(i.id),e.fire("cancel",{file:i}),e.set("file",null)),e},_hasCrossdomain:function(){var e=this,t=e.get("url").match(s)||[],i=e.get("swfUploader").get("src").match(s)||[],r=t[2],a=i[2];r&&a&&r!==a&&n.ajax({url:t[1]+"://"+r+"/crossdomain.xml",dataType:"xml",error:function(){BUI.log("\u7f3a\u5c11crossdomain.xml\u6587\u4ef6\u6216\u8be5\u6587\u4ef6\u4e0d\u5408\u6cd5\uff01")}})}},{ATTRS:{uploader:{setter:function(e){var t=this;if(e&&e.isController){var i=e.get("button");i.on("swfReady",function(e){t.set("swfUploader",e.swfUploader),t._initSwfUploader()})}}},url:{setter:function(e){var t=/^http/;if(!t.test(e)){var i,r=location.href.match(o)||[],n=r[1]||"",a=n.split("/");i=BUI.Array.filter(a,function(e,t){return t<a.length-1}),e=i.join("/")+"/"+e}return e}},swfUploader:{},uploadingId:{},events:{value:{swfReady:!1,progress:!1}}}}),i.exports=r}),define("bui/uploader/type/iframe",["jquery","bui/common"],function(e,t,i){function r(e){var t=this;r.superclass.constructor.call(t,e)}var n=e("jquery"),a=e("bui/uploader/type/base"),u="bui-uploader-iframe-";BUI.extend(r,a,{upload:function(e){var t,i=this,r=e.input;return e?(i.fire("start",{file:e}),i.set("file",e),i.set("fileInput",r),i._create(),t=i.get("form"),void(t&&t[0].submit())):!1},cancel:function(){{var e=this;e.get("iframe")}return e.reset(),e.fire("cancel"),e},dataToHidden:function(e){if(!n.isPlainObject(e)||n.isEmptyObject(e))return"";var t=this,i=[],r=t.get("tpl"),a=r.HIDDEN_INPUT;if(!BUI.isString(a))return"";for(var u in e)i.push(BUI.substitute(a,{name:u,value:e[u]}));return i.join()},_createIframe:function(){var e,t=this,i=u+BUI.guid(),r=t.get("tpl"),a=(r.IFRAME,t.get("iframe"));return n.isEmptyObject(a)?(e=n(BUI.substitute(r.IFRAME,{id:i})),n("body").append(e),e.on("load",function(e){t._iframeLoadHandler(e)}),t.set("id",i),t.set("iframe",e),e):a},_iframeLoadHandler:function(e){var t,i=this,r=e.target,n=r.contentDocument||window.frames[r.id].document;if(!n||!n.body)return i.fire("error",{msg:"\u670d\u52a1\u5668\u7aef\u8fd4\u56de\u6570\u636e\u6709\u95ee\u9898\uff01"}),!1;var a=n.body.innerHTML;return""==a?void i.fire("error"):(t=i._processResponse(a),i.fire("complete",{result:t,file:i.get("file")}),void i.reset())},_createForm:function(){var e,t,i=this,r=i.get("id"),a=i.get("tpl"),u=a.FORM,o=i.get("data"),s=i.get("url"),l=i.get("fileInput");return BUI.isString(u)&&BUI.isString(s)?(e=i.dataToHidden(o),e+=i.dataToHidden({type:"iframe"}),t=BUI.substitute(u,{action:s,target:r,hiddenInputs:e}),t=n(t).append(l),n("body").append(t),i.set("form",t),t):!1},_create:function(){var e=this,t=e._createIframe(),i=e._createForm();e.fire("create",{iframe:t,form:i})},_remove:function(){var e=this,t=e.get("form");return t?(t.remove(),e.set("form",null),void e.fire("remove",{form:t})):!1},reset:function(){var e=this;e._remove(),e.set("file",null)}},{ATTRS:{tpl:{value:{IFRAME:'<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',FORM:'<form method="post" enctype="multipart/form-data" action="{action}" target="{target}" style="visibility: hidden;">{hiddenInputs}</form>',HIDDEN_INPUT:'<input type="hidden" name="{name}" value="{value}" />'}},id:{value:u+BUI.guid()},iframe:{value:{}},form:{},fileInput:{},events:{value:{create:!1,remove:!1}}}}),i.exports=r}),define("bui/uploader/validator",["jquery","bui/common"],function(e,t,i){function r(e){r.superclass.constructor.call(this,e)}var n=e("jquery"),a=e("bui/common");r.ATTRS={rules:{},queue:{}},a.extend(r,a.Base),a.augment(r,{valid:function(e){return this._validItem(e)},_validItem:function(e){var t=this,i=t.get("rules"),r=!0;return a.each(i,function(i,n){return r=r&&t._validRule(e,n,i)}),r},_validRule:function(e,t,i,n){a.isArray(i)&&(n=a.substitute(i[1],i),i=i[0]);var u=r.getRule(t),o=u&&u.call(this,e,i,n),s=this._getResult(o);return s?(e.result=s,!1):!0},_getResult:function(e){return e?{msg:e}:void 0}});var u={};r.addRule=function(e,t){u[e]=t},r.getRule=function(e){return u[e]},r.addRule("maxSize",function(e,t,i){return e.size>1024*t?i:void 0}),r.addRule("minSize",function(e,t,i){return e.size<1024*t?i:void 0}),r.addRule("max",function(e,t,i){var r=this.get("queue").getCount();return r>t?i:void 0}),r.addRule("min",function(e,t,i){var r=this.get("queue").getCount();return t>r?i:void 0}),r.addRule("ext",function(e,t,i){var r=e.ext,t=t.split(",");return-1===n.inArray(r,t)?i:void 0}),i.exports=r});