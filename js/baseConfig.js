configIp = "http://192.168.10.1:",
// configIp = "http://192.168.0.100:",
configPort = "9998/",

// 获取表单信息方法
//遍历form表单，获取表单中的信息
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
}; 