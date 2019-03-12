/**
 * @author seoyeonlee
 */
if (!console) {
	var consoleClass = function() {
		this.log = function() {
		}
	}
	var console = new consoleClass();
}
function Stutter(documentRoot, linkBlank, air) {
	this._result = "";
	this._vars = [];
	this._paragraph = false;
	this._listSymbol = [];
	this._list = false;
	this._documentRoot = documentRoot;
	this._galleryID = 0;
	this._headers = [];
	this._padding;
	this._linkBlank = linkBlank;
	this._air = air;
	
	this.tabClear = function(text) {
		return text.replace(/	/g, "    ");
	}
	
	/**
	 * 테이블을 해석해주는 모듈
	 * @param data 테이블 데이터가 배열형태로 들어온다
	 */
	this.table = function(data) {
		var f = -1;
		var s = -1;
		var tr;
		var td;
		var result = "";
		while (++f < data.length) {
			if (f == data.length - 1) result += "</tbody><tfoot>";
			tr = String(data[f]).split("|");
			result += "<tr class=\"row" + (f & 1) + "\">";
			s = -1;
			while (++s < tr.length) {
				td = tr[s];
				if (/^@.+/.test(td)) {
					result += td.replace(/^@(.+)/, "<th>$1</th>");
				} else {
					result += "<td>" + td + "</td>";
				}
			}
			result += "</tr>";
			if (f == 0) result += "</thead><tbody>";
		}
		this._result += "<table><thead>" + result + "</tfoot></table>";
	}
	this.code = function(data) {
		this._result += "<pre class=\"prettyprint\">" + this.tabClear(this.dataToCode(this.removeEnter(data))) + "</pre>";
	}
	this.dataToCode = function(data) {
		return this.parseHTML(data.join("\n"));
	}
	this.parseHTML = function(html) {
		var from = ["<", ">", "&"];
		var to = ["&lt;", "&gt;", "&amp;"];
		var f = from.length;
		while (--f >= 0) {
			try {
				html = html.replace(new RegExp(from[f], "g"), to[f]);
			} catch (e) {
				//console.log([e, html, from[f], to[f]]);
			}
		}
		return html;
	}
	this.removeEnter = function(data) {
		var f = data.length;
		var l;
		while (--f >= 0) {
			l = data[f];
			l = l.replace("\\n", "\\\n");
			l = l.replace("\\r", "\\\r");
			data[f] = l;
		}
		return data;
	}
	this.gallery = function(data) {
		this._galleryID++;
		var f = -1;
		var line;
		var result = "<div class=\"gallery\" id=\"gallery" + this._galleryID + "\"><ul>\n";
		while (++f < data.length) {
			line = String(data[f]).split("|");
			result += "<li><a href=\"" + line[0] + "\" title=\"" + line[1] + "\"><img src=\"" + line[0] + "\" /></a></li>\n";
		}
		this._result += result + "</ul>\n</div>\n";
	}
	this.text = function(data) {
		this._result += "<xmp class=\"plainText\">" + this.tabClear(this.removeEnter(data).join("\n").replace(/\\=/gi, "=")) + "</xmp>\n";
	}
	this.getPadding = function() {
		return "hPadding" + this._padding;
	}
	
	this._headerList;
	this._documentTop;
	
	this.parse = function(stutterDoc, headerList, documentTop) {
		if (headerList == undefined) headerList = true;
		if (documentTop == undefined) documentTop = true;
		this._headerList = headerList;
		this._documentTop = documentTop;
		
		this._padding = 1;
		this._result = "";
		this._vars = [];
		this._listSymbol = [];
		this._headers = [];
		
		var lines = stutterDoc.split("\n");
		var line;
		var exp;
		var expResult;
		var module = false;
		var moduleName = "";
		var moduleData = [];
		
		var lineLength = lines.length;
		var f = -1;
		
		while (++f < lineLength) {
			line = lines[f];
			
			// 모듈 처리
			if (module) {
				exp = /\={3,}\s*$/;
				if (exp.test(line)) {
					//console.log(moduleName);
					this[moduleName](moduleData);
					module = false;
					moduleName = "";
					moduleData = null;
				} else {
					//console.log(line);
					moduleData.push(line);
				}
				continue;
			}
			
			// 모듈 시작
			exp = /\={3,}(\w[^\=]+)\=+$/;
			expResult = exp.exec(line);
			if (expResult) {
				this.endTags();
				module = true;
				moduleName = expResult[1];
				moduleData = new Array();
				//console.log(moduleName);
				continue;
			}
			
			// 주석 처리
			exp = /^\/\//;
			if (exp.test(line)) {
				continue;
			}
			
			// 변수 저장
			exp = /^\$(\w+)\s*=\s*(.+)$/;
			expResult = exp.exec(line);
			if (expResult) {
				this._vars[expResult[1]] = expResult[2];
				continue;
			}
			
			// 공백 라인 처리
			exp = /^\s*$/;
			if (exp.test(line) || line == "") {
				this.lineBreak();
				continue;
			}
			
			// 헤더
			exp = /^\s*(#+)\s*(.+)$/;
			expResult = exp.exec(line);
			if (expResult) {
				this.endTags();
				this.header(String(expResult[1]).length, expResult[2]);
				continue;
			}
			
			// 라인 
			exp = /^\-{4,}$/;
			if (exp.test(line)) {
				this.endTags();
				this.horizontalLine();
				continue;
			}
			
			// 미디어
			exp = /^:{2,}\s*(.+)$/;
			if (exp.test(line)) {
				this.mediaParser(line);
				continue;
			}
			
			// 리스트 
			exp = /^\s*[\*|\+]+\s+.+$/;
			if (exp.test(line)) {
				line = line.replace(/^\s*/, "");
				this.list(line);
				continue;
			}
			
			if (this._paragraph) {
				this.br(line);
			} else {
				this.paragraph(line);
			}
		}
		this.endTags();
		
		var headers = "";
		if (documentTop) headers += "<a name=\"documentTop\"></a>";
		if (headerList && this._headers.length > 0) headers += '<div class="header"><ol class="header">' + this._headers.join("") + '</ol></div>';
		
		return headers + this.hexClear(this._result);
	}
	
	this.lineBreak = function() {
		this.listBreak();
		if (this._paragraph) {
			this._result += "</p>\n";
			this._paragraph = false;
		}
	}
	this.listBreak = function() {
		if (this._list) {
			this._result += "</ol>\n";
			this._list = false;
		}
	}
	this.br = function(line) {
		this._result += "<br />\n" + this.lineParser(line);
	}
	this.paragraph = function(line) {
		this._result += "<p class=\"document " + this.getPadding() + "\">" + this.lineParser(line);
		this._paragraph = true;
	}
	this.properties = function(cmd, d) {
		if (d == undefined) d = ",";
		var items;
		var exp = new RegExp(d, "");
		if (exp.test(cmd)) {
			items = cmd.split(d);
			var itemsLength = items.length;
			var f = -1;
			exp = /^\s*|\s*$/;
			while (++f < itemsLength) {
				items[f] = String(items[f]).replace(exp, "");
			}
		} else {
			items = [cmd];
		}
		return items;
	}
	this.hexClear = function(text) {
		var r = /(%%%open%%%)(.*?)(%%%close%%%)/g;
		var m = text.match(r);
		var v;
		var command;
		var mLength = m ? m["length"] : 0;
		if (mLength > 0) {
			var f = -1;
			while (++f < mLength) {
				command = m[f];
				v = /(%%%open%%%)(.*?)(%%%close%%%)/.exec(command);
				text = text.replace(command, this.base64decode(v[2]));
			}
		}
		return text;
	}
	this.linkParser = function(line) {
		var r = /<(.*?)>/g;
		var m = line.match(r);
		var mLength = m ? m["length"] : 0;
		if (mLength > 0) {
			var f = -1;
			var url;
			var title;
			while (++f < mLength) {
				var command = m[f];
				var prop = this.properties(command.substring(1, command.length - 1), ",");
				
				if (prop.length > 1) {
					url = prop[0];
					title = prop[1];
				} else {
					url = title = prop[0];
					if (/^@/.test(title)) title = title.substring(1);
				}
				
				if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z\._]+$/.test(url)) url = "mailto:" + url;
				
				url = this.rootLink(url);
				url = "%%%open%%%" + this.base64encode(url) + "%%%close%%%";
				title = "%%%open%%%" + this.base64encode(title) + "%%%close%%%";
				
				var propString = " href=\"" + url + "\"";
				if (this._linkBlank) {
					propString += " target=\"blank\"";
				} else if (prop.length > 2) {
					propString += " target=\"" + prop[2] + "\"";
				}
				
				line = line.replace(command, "<a" + propString + ">" + title + "</a>");
			}
		}
		return line;
	}
	this.rootLink = function(url) {
		var reg = /^@/;
		if (reg.test(url)) {
			url = url.substring(1);
			url = this._documentRoot + url;
			if (this._air) url = "file://" + url;
		}
		return url;
	}
	this.hexEncode = function(data) {
		var b16_digits = '0123456789abcdef';
		var b16_map = new Array();
		for (var i = 0; i < 256; i++) {
			b16_map[i] = b16_digits.charAt(i >> 4) + b16_digits.charAt(i & 15);
		}
		
		var result = new Array();
		for (var i = 0; i < data.length; i++) {
			result[i] = b16_map[data.charCodeAt(i)];
		}
		
		return result.join('');
	}
	
	//Decodes Hex(base16) formated data
	this.hexDecode = function(data) {
		var b16_digits = '0123456789abcdef';
		var b16_map = new Array();
		for (var i = 0; i < 256; i++) {
			b16_map[b16_digits.charAt(i >> 4) + b16_digits.charAt(i & 15)] = String.fromCharCode(i);
		}
		if (!data.match(/^[a-f0-9]*$/i)) return false;// return false if input data is not a valid Hex string
		if (data.length % 2) data = '0' + data;
		
		var result = new Array();
		var j = 0;
		for (var i = 0; i < data.length; i += 2) {
			result[j++] = b16_map[data.substr(i, 2)];
		}
		
		return result.join('');
	}
	// private property
	this._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
	// public method for encoding
	this.base64encode = function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = this.base64_utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	}
 
	// public method for decoding
	this.base64decode = function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = this.base64_utf8_decode(output);
 
		return output;
 
	}
 
	// private method for UTF-8 encoding
	this.base64_utf8_encode = function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	}
 
	// private method for UTF-8 decoding
	this.base64_utf8_decode = function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
	
	this.lineParser = function(line) {
		var r;
		var m;
		var v;
		var command;
		var f;
		var url;
		var propString;
		var mLength;
		var prop;
		var title;
		
		r = /\$\{(.*?)\}/g;
		m = line.match(r);
		mLength = m ? m["length"] : 0;
		if (mLength > 0) {
			f = -1;
			while (++f < mLength) {
				command = m[f];
				title = command.substring(2, command.length - 1);
				line = line.replace(command, this._vars[title]);
			}
		}
		
		line = this.linkParser(line);
		
		r = / \-(.*?)\- /g;
		m = line.match(r);
		mLength = m ? m["length"] : 0;
		if (mLength > 0) {
			f = -1;
			while (++f < mLength) {
				command = m[f];
				line = line.replace(command, " <del>" + command.substring(2, command.length - 2) + "</del> ");
			}
		}
		
		r = / \_(.*?)\_ /g;
		m = line.match(r);
		mLength = m ? m["length"] : 0;
		if (mLength > 0) {
			f = -1;
			while (++f < mLength) {
				command = m[f];
				line = line.replace(command, " <em>" + command.substring(2, command.length - 2) + "</em> ");
			}
		}
		
		r = / \*(.*?)\* /g;
		m = line.match(r);
		mLength = m ? m["length"] : 0;
		if (mLength > 0) {
			f = -1;
			while (++f < mLength) {
				command = m[f];
				line = line.replace(command, " <strong>" + command.substring(2, command.length - 2) + "</strong> ");
			}
		}
		
		/*
		 r = /!(.*?)!/g;
		 m = line.match(r);
		 mLength = m ? m["length"] : 0;
		 if (mLength > 0) {
		 f = -1;
		 while (++f < mLength) {
		 command = m[f];
		 line = line.replace(command, "<dfn>" + command.substring(1, command.length - 1) + "</dfn>");
		 }
		 }
		 */
		r = /\[(\w+)\:(.*?)\]/g;
		m = line.match(r);
		mLength = m ? m["length"] : 0;
		if (mLength > 0) {
			f = -1;
			while (++f < mLength) {
				command = m[f];
				v = /\[(\w+)\:(.*?)\]/.exec(command);
				if (v) {
					line = line.replace(command, "<span class=\"" + v[1] + "\">" + v[2] + "<\/span>");
				}
			}
		}
		
		return line;
	}
	this.mediaParser = function(line) {
		var url;
		var width;
		var height;
		var comment;
		var link;
		var target;
		var prop = this.properties(line.replace(/^:{2,}\s*(.+)$/, "$1"), ",");
		var propString;
		var linkString = "";
		url = this.rootLink(prop[0]);
		width = (prop.length > 1 && prop[1] != "") ? Number(prop[1]) : 0;
		height = (prop.length > 2 && prop[2] != "") ? Number(prop[2]) : 0;
		comment = (prop.length > 3 && prop[3] != "") ? prop[3] : "";
		link = (prop.length > 4 && prop[4] != "") ? this.rootLink(prop[4]) : "";
		target = (prop.length > 5 && prop[5] != "") ? prop[5] : "";
		
		if (link != "") {
			linkString = "<a href=\"" + link + "\"";
			if (this._linkBlank) {
				linkString += " target=\"blank\">";
			} else if (target != "") {
				linkString += " target=\"" + target + "\">";
			}
		}
		
		var exp = /\.(png|jpg|gif|swf|ogg|mp4|ogv|wma|wmv|flv|f4v|mp3|youtube)/i;
		var result = "<p class=\"media\">";
		var capture = false;
		if (/\.(png|jpg|gif)$/i.test(url)) {
			propString = " src=\"" + url + "\"";
			if (width > 0) propString += " width=\"" + width + "\"";
			if (height > 0) propString += " height=\"" + height + "\"";
			if (comment != "") propString += " title=\"" + comment + "\"";
			capture = true;
			if (linkString != "") {
				result += linkString + "<img" + propString + " />" + "</a>";
			} else {
				result += "<img" + propString + " />";
			}
		} else if (/\.(swf)/i.test(url)) {
			// TODO
			result += "<object width=\"" + width + "\" height=\"" + height + "\"><param name=\"movie\" value=\"" + url + "\" /><param name=\"base\" value=\"" + this._documentRoot + "\" /><param name=\"allowfullscreen\" value=\"true\" /><embed src=\"" + url + "\" width=\"" + width + "\" height=\"" + height + "\" allowfullscreen=\"true\" base=\""+this._documentRoot+"\"></embed></object>";
			capture = true;
		} else if (/\.mp4$/i.test(url)) {
			result += "<video id=\"video\" width=\"" + width + "\" height=\"" + height + "\" controls=\"controls\"><source src=\"" + url + "\" type=\"video/mp4\" /><object width=\"" + width + "\" height=\"" + height + "\"><param name=\"movie\" value=\"FLVPlay.swf\" /><param name=\"flashvars\" value=\"url=" + url + "\" /><param name=\"allowfullscreen\" value=\"true\" /><embed src=\"FLVPlay.swf\" width=\"" + width + "\" height=\"" + height + "\" flashvars=\"url=" + url + "\" allowfullscreen=\"true\"></embed></object></video>";
			capture = true;
		} else if (/\.(flv|f4v)$/i.test(url)) {
			result += "<object width=\"" + width + "\" height=\"" + height + "\"><param name=\"movie\" value=\"FLVPlay.swf\" /><param name=\"flashvars\" value=\"url=" + url + "\" /><param name=\"allowfullscreen\" value=\"true\" /><embed src=\"FLVPlay.swf\" width=\"" + width + "\" height=\"" + height + "\" flashvars=\"url=" + url + "\" allowfullscreen=\"true\"></embed></object>";
			capture = true;
		} else if (/\.(ogg|mp3)/i.test(url)) {
			result += '<audio src="' + url + '" width="' + width + '" height="' + height + '"></auido>';
		} else if (/\.ogv/i.test(url)) {
			result += "<video id=\"video\" width=\"" + width + "\" height=\"" + height + "\" controls=\"controls\"><source src=\"" + url + "\" type=\"video/mp4\" /></video>";
			capture = true;
		} else if (/\.youtube/i.test(url)) {
			url = url.replace(/\.youtube/, "");
			result += '<object width="' + width + '" height="' + height + '"><param name="movie" value="http://www.youtube.com/v/' + url + '?fs=1&amp;hl=en_US&amp;rel=0"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/' + url + '?fs=1&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="' + width + '" height="' + height + '"></embed></object>';
			capture = true;
		} else {
			//trace("XXX");
		}
		
		if (comment != "" && linkString != "") comment = linkString + comment + "</a>";
		
		if (capture) {
			this._result += result + (comment != "" ? "<br />" + comment : "") + "</p>\n";
		}
	}
	this.endTags = function() {
		this.lineBreak();
	}
	this.list = function(item) {
		var r = /^(\*+|\++)\s(.+)$/;
		var v = r.exec(item);
		var symbol = v[1];
		var depth = symbol.length;
		
		if (!this._list) {
			this._result += "<ol>\n";
			this._list = true;
		}
		
		this._result += this.listParser(symbol.charAt(0), depth, v[2]);
	}
	this.listParser = function(symbol, depth, str) {
		if (depth > 5) depth = 5;
		return "<li class=\"" + ((symbol == "*" ? "unordered" : "ordered") + depth) + "\">" + this.linkParser(str) + "</li>\n";
	}
	this.horizontalLine = function() {
		this._result += "<hr />\n";
	}
	this.header = function(depth, title) {
		if (depth > 3) depth = 3;
		this._padding = depth;
		this._headers.push("<li class=\"header" + depth + "\"><a href=\"#" + depth + "_" + title + "\">" + title + "</a></li>");
		
		if (this._documentTop) {
			this._result += '<h' + depth + ' class="' + this.getPadding() + '"><a name="' + depth + '_' + title + '" href="#documentTop">' + title + '</a></h' + depth + '>\n';
		} else {
			this._result += '<h' + depth + ' class="' + this.getPadding() + '">' + title + '</h' + depth + '>\n';
		}
		
	}
}
