
// Число добавленных объектов класса set-of-objects/complex
var countOfElems = new Array();
var addedObj = new Array();
// Первый выданный на экран объект из списка
var firstElement;
var nameSelect;
var res;

//CouchDB begin
var couchDB_baseURL = "http://hpccloud.ssd.sscc.ru:5984/aka/";
var couchDB_username = "admin";
var couchDB_password = "akaCoachPass19";

$(function(){
	$('#myTab a[href="#app10"]').on('show.bs.tab', function () {

		// Just test for checking gui
		var inputArea = document.getElementById("input_area");
		var divGeneral = document.createElement('div');
		divGeneral.setAttribute("id", "test_gui");

		var div = document.createElement('div');
		var label = document.createElement('label');
		label.htmlFor = "test_select";
		label.innerHTML = "Names of avaliable types: ";
		div.appendChild(label);

		var select = document.createElement('select');
		select.setAttribute("id", "test_select");

		var option;

		// Вызов списка всех типов
		getListOfTypes(function(_types){
			res = _types;
			res.forEach(function (item) {
				// temporary string
				var itemClass = item.value.$id.split(/[/:]+/);

				option = document.createElement('option');
				option.setAttribute("value", item.value.title);
				option.innerHTML = item.value.title + ",  " + itemClass[1];
				select.appendChild(option);
			});
		});

		div.appendChild(select);
		divGeneral.appendChild(div);

		addButton(div, "test_button", "OK", 'go()');

		divGeneral.appendChild(div);
		inputArea.appendChild(divGeneral);
		//countOfElems.push(0);
	})
})

function addSelect(div, id, valList, nameList) {
	// Список доступных объектов
	var select = document.createElement('select');
	select.setAttribute("id", id);
	var option;

	var values = valList;
	var len = values.length;

	for (var i = 0; i < len; i++) {
		option = document.createElement('option');
		option.setAttribute("value", values[i]);
		option.innerHTML = nameList[i];
		select.appendChild(option);
	}

	div.appendChild(select);
}

function addButton(div, id, value, func) {
	var button = document.createElement('input');
	button.setAttribute("type", "button");
	button.setAttribute("id", id);
	button.setAttribute("class", "btn btn-outline-primary");
	button.setAttribute("value", value);
	button.setAttribute('onclick', func);
	div.appendChild(button);
}

function getListOfTypes(fn) {
	var xhr = new XMLHttpRequest();
	var username = "admin";
	var password = "akaCoachPass19";
	var url = couchDB_baseURL + "_design/cms/_view/types";//'http://hpccloud.ssd.sscc.ru:5984/aka/_design/cms/_view/types';

	xhr.open("GET", url, true, couchDB_username, couchDB_password);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			fn(JSON.parse(xhr.response).rows);
		}
	};
	xhr.send();
}

function checkType(div, item) {
	var itemClass = item.value.$id.split(/[/:]+/);
	if (itemClass[1] == "complex") {
		var select = document.getElementById("select_setOfObjects");

		if (select == null) {
			addComplexType(div, item, 0);
		} else {
			var id = select.options.selectedIndex;
			addComplexType(div, item, id);
		}	
	} 
	else if (itemClass[1] == "set-of-objects") {
		addSetOfObjectsType(div, item);	
	} 
	else if (itemClass[1] == "enum") {		
		addEnumType(div, item.value.title);
	} 
	else if (itemClass[1] == "base_type") {
		addBaseTypeElem(div, itemClass[2]);
	}
	else if (itemClass[1] == "inheritance") {
		addInheritanceType(div, item);
	}
}

// Сделать одну ф-ю из двух
function findViewType(nameType) {
	var item;
	// Возможно тут нужно сначала получать список всех типов
	res.forEach(function (items) {
		if (items.value.title == nameType) {
			item = items;			
		}
	});
	return item;
}
function findTypeById(idType) {
	var item;
	// Возможно тут нужно сначала получать список всех типов
	res.forEach(function (items) {
		if (items.value.$id == idType) {
			item = items;			
		}
	});
	return item;
}

function go() {
	var typeName = document.getElementById("test_select").value;
	var item = findViewType(typeName);

	var inputArea = document.getElementById("input_area");
	div = document.createElement('div');

	checkType(div, item);

	inputArea.appendChild(div);
}

function addInheritanceType(div, item) {
	var divGeneral = div;
	divGeneral.setAttribute("id", "div_" + item.value.title);

	var divName = document.createElement('div_name_' + item.value.title);
	var labelName = document.createElement('label');
	labelName.innerHTML = item.value.title;
	divName.appendChild(labelName);
	divGeneral.appendChild(divName);
	
	var label;
	var input;

	var field = item.value.properties;
	var keys = Object.keys(field);
	// т.к. один эл-нт это не атрибут, а наследуемый тип
	for(var i = 0; i < keys.length; i++) {
		if(keys[i] == "inherited_type") {
			keys.splice(i, 1);
		}
	}
	var len = keys.length; 

	// Добавление наследуемого типа
	var inherited = findTypeById(field.inherited_type.$ref);
	var div = document.createElement('div');
	checkType(div, inherited);
	var tmp = field.inherited_type.$ref.split(/[/:]+/);
	if( tmp[1] != "base_type" || tmp[1] != "enum") {
		div.removeChild(div.firstChild);
		div.removeChild(div.lastChild);
	}
	divGeneral.appendChild(div);

	// Добавление атрибутов 
	for(var i = 0; i < len; i++){
		var idType = field[keys[i]].$ref;

		div = document.createElement('div');
		label = document.createElement('label');
		label.htmlFor = keys[i];
		label.innerHTML = keys[i] + ": ";
		div.appendChild(label); 

		var item = findTypeById(idType);
		checkType(div, item);
				    
		divGeneral.appendChild(div);
	}

	label = document.createElement('label');
	label.innerHTML = "";
	div = document.createElement('div');
	div.appendChild(label);
    divGeneral.appendChild(div);
}

function addComplexType(div, item, id) {
	addedObj.push(item.value.title);

	var divGeneral = div;
	divGeneral.setAttribute("id", "div_" + item.value.title);

	var divName = document.createElement('div_name_' + item.value.title);
	var labelName = document.createElement('label');
	if (countOfElems.length == 0) { // было == 1
		labelName.innerHTML = item.value.title;
	} else {
		labelName.innerHTML = item.value.title + (countOfElems[id] + 1);
	}
	divName.appendChild(labelName);
	divGeneral.appendChild(divName);

	var div;
	var label;
	var input;

	var field = item.value.properties;
	var keys = Object.keys(field);
	var len = keys.length;

	for(var i = 0; i < len; i++){
		var idType = field[keys[i]].$ref;

		div = document.createElement('div');
		label = document.createElement('label');
		label.htmlFor = keys[i];
		label.innerHTML = keys[i] + ": ";
		div.appendChild(label); 

		var item = findTypeById(idType);
		checkType(div, item);
				    
		divGeneral.appendChild(div);
	}

	label = document.createElement('label');
	label.innerHTML = "";
	div = document.createElement('div');
	div.appendChild(label);
    divGeneral.appendChild(div);
}

function addSetOfObjectsType(div, item) {
	var divGeneral = div;
	divGeneral.setAttribute("id", "div_setOfObjects");

	// Имя set-of-objects
	var divName = document.createElement('div_name_' + item.value.title);
	var labelName = document.createElement('label');
	labelName.innerHTML = item.value.title;
	divName.appendChild(labelName);
	divGeneral.appendChild(divName);

	var div = document.createElement('div');
	var label = document.createElement('label');
	label.htmlFor = "select_" + item.value.title;
	label.innerHTML = "Choose the object: ";
	div.appendChild(label);

	// Список доступных объектов
	var objects = item.value.items.anyOf;
	var value = [];
	// было len - 1
	for(var i = 0; i < objects.length/* - 1*/; i++){
		var tmp = objects[i].$ref.split(/[/:]+/);
		value[i] = tmp[2];
		countOfElems.push(0);
	}

	addSelect(div, "select_setOfObjects", value, value);

	addButton(div, "button_setOfObjects", "OK", 'addNewObject()');
	addButton(div, "button_del_setOfObjects", "Delete", 'deleteObject()');

	divGeneral.appendChild(div);
}

function addNewObject() {
	var id = document.getElementById("select_setOfObjects").options.selectedIndex;
	var nameObj = document.getElementById("select_setOfObjects").value;

	var item = findViewType(nameObj);
	
	var inputArea = document.getElementById("input_area");
	
	var divGeneral = document.createElement('div');
	divGeneral.setAttribute("id", "div_" + item.value.title);

	checkType(divGeneral, item);

	var flag = false;
    for (var i = 0; i < countOfElems.length; i++) {
    	if (countOfElems[i] > 0) { flag = true; break;}
    }
    if(!flag) {
    	inputArea.appendChild(divGeneral);
    	firstElement = divGeneral;
    } else {
    	inputArea.insertBefore(divGeneral, firstElement);
		firstElement = divGeneral;
    }
    countOfElems[id]++;
}

function deleteObject(){
	var inputArea = document.getElementById("input_area");
	if(inputArea.childNodes.length > 2) {
		var element = inputArea.childNodes[2];

		var lastObj = addedObj.pop();
		var select = document.getElementById("select_setOfObjects");
		if (select == null) {
			countOfElems[0] = 0;
		} else {
			var number;
			for(var i = 0; i < select.options.length; i++) {
				if (lastObj == select.options[i].label) number = i;
			}
			countOfElems[number]--;
		}
		inputArea.removeChild(element);
		firstElement = inputArea.childNodes[2];
	}
	else {
		firstElement = null;
	}
}

function addEnumType(div, namesType) {
	
	var item = findViewType(namesType);
	//var value = item.value.enum;
	addSelect(div, "select_" + namesType, item.value.enum, item.value.enum);
}

function addBaseTypeElem(div, base_type) {
	if (base_type == "int") {
		addIntElement(div);
	} 
	else if (base_type == "bool") {
		addBoolElement(div, base_type);
	} 
	else if (base_type == "string") {		
		addStringElement(div);
	} 
	else if (base_type == "double"){
		addDoubleElement(div);
	}
	else if (base_type == "float"){
		addFloatElement(div);
	}
	else if (base_type == "file"){
		addFileElement(div);
	}
}

function addBoolElement(div, namesType) {

	var select = document.createElement('select');
	select.setAttribute("id", "select_" + namesType);

	var option = document.createElement('option');
	option.setAttribute("value", "true");
	option.innerHTML = "true";
	select.appendChild(option);

	option = document.createElement('option');
	option.setAttribute("value", "false");
	option.innerHTML = "false";
	select.appendChild(option);

	div.appendChild(select);	
}

function addIntElement(div) {
	input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "int");
	input.setAttribute("pattern", "[0-9]{20}");
	div.appendChild(input);
}

function addStringElement(div) {
	input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "string");
	input.setAttribute("pattern", "[0-9]{20}");
	div.appendChild(input);
}

function addDoubleElement(div) {
	
}

function addFloatElement(div) {
	
}

function addFileElement(div) {
	input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "file");
	input.setAttribute("pattern", "[0-9]{20}");
	div.appendChild(input);
}

function saveObjects(){
	
}


/*
result: {"total_rows":14,"offset":0,"rows":[
{"value":{"_id":"3db1d06f83bc9eeb1407023190031156","_rev":"3-1fb91ed2a2ee72ee1bb93abd685d68ec","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/base_type:int","title":"int","type":"integer","pattern":"[0-9]$"}},
{"value":{"_id":"3db1d06f83bc9eeb140702319003b06e","_rev":"2-4dab8603a54524cc2f8a94b3b6396146","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/base_type:bool","title":"bool","type":"boolean"}},
{"value":{"_id":"3db1d06f83bc9eeb140702319003c493","_rev":"2-cf67840b2b88d513d85fedebd3162146","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/base_type:string","title":"string","type":"string","pattern":"[a-z]$"}},
{"value":{"_id":"3db1d06f83bc9eeb140702319003fb76","_rev":"2-f747abff8efce73bd05b7bb9c0ac7a18","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/base_type:double","title":"double","type":"number","pattern":"[0-9]$"}},
{"value":{"_id":"3db1d06f83bc9eeb1407023190043347","_rev":"2-6abb447d7ef339624f66d8c970770a89","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/base_type:float","title":"float","type":"number","pattern":"[0-9]$"}},
{"value":{"_id":"3db1d06f83bc9eeb1407023190046639","_rev":"2-ca40095eb24bd8f2ee897ad42928a6c2","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/base_type:file","title":"file","type":"string","pattern":"[a-z]$"}},
{"value":{"_id":"3db1d06f83bc9eeb140702319004a5be","_rev":"4-c00d5f557c81e2a20e8690735664c3af","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/complex:test","title":"test","type":"object","properties":{"one":{"type":"integer","$ref":"8c148c57925872f233d11639ea023810/base_type:int"},"bool_var_two":{"type":"boolean","$ref":"8c148c57925872f233d11639ea023810/base_type:bool"},"enum_var_three":{"type":"string","$ref":"8c148c57925872f233d11639ea023810/enum:medvedev_enum","enum":["outlet","inlet","wall"]}},"required":["one","bool_var_two","enum_var_three"]}},
{"value":{"_id":"5b706272bb045ab18f0238199a01ac95","_rev":"6-0bec9d5eeea5cbf1215b3156ff22e00b","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/set-of-objects:medvedev_objs","title":"medvedev_objs","type":"array","items":{"anyOf":[{"$ref":"8c148c57925872f233d11639ea023810/base_type:int"},{"$ref":"8c148c57925872f233d11639ea023810/complex:test"},{"$ref":"8c148c57925872f233d11639ea023810/complex:citizen"},{"$ref":"8c148c57925872f233d11639ea023810/base_type:bool"}]}}},
{"value":{"_id":"5b706272bb045ab18f0238199a01f1b9","_rev":"18-3650e8c27233e8a0b977d3a12e1a4c35","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/complex:citizen","title":"citizen","type":"object","properties":{"tax_payer_number":{"type":"integer","$ref":"8c148c57925872f233d11639ea023810/base_type:int"},"city":{"type":"string","$ref":"8c148c57925872f233d11639ea023810/base_type:string"},"person":{"type":"string","$ref":"8c148c57925872f233d11639ea023810/base_type:file"},"bool_var":{"type":"boolean","$ref":"8c148c57925872f233d11639ea023810/base_type:bool"},"enum_var":{"type":"string","$ref":"8c148c57925872f233d11639ea023810/enum:medvedev_enum","enum":["outlet","inlet","wall"]}},"required":["tax_payer_number","city","person","bool_var","enum_var"]}},
{"value":{"_id":"5b706272bb045ab18f0238199a0e746f","_rev":"4-9ae252cbaca1ef8ee5f2c3c04b33312d","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/enum:medvedev_enum","title":"medvedev_enum","type":"string","enum":["outlet","inlet","wall"]}},
{"value":{"_id":"711f66d208f10a7a17887d0af0015107","_rev":"1-3a14e57703a7d56f26499238ea77788e","$schema":"http://json-schema.org/draft/2019-09/schema#","$id":"8c148c57925872f233d11639ea023810/inheritance:test_inheritance","title":"test_inheritance","type":"object","properties":{"inherited_type":{"$ref":"8c148c57925872f233d11639ea023810/complex:test"},"attr1":{"type":"string","$ref":"8c148c57925872f233d11639ea023810/base_type:string"},"attr2":{"type":"string","$ref":"8c148c57925872f233d11639ea023810/enum:medvedev_enum","enum":["outlet","inlet","wall"]},"attr3":{"type":"integer","$ref":"8c148c57925872f233d11639ea023810/base_type:int"}}}},
{"value":{"_id":"8c148c57925872f233d11639ea7df2e0","_rev":"1-87579896b02b1ca59c64b2db4b7192af","type":{"name":"FHPListOfObstacles","class":"set-of-objects","set_of_possible_object_types":["FHPCircle","FHPBar"]}}},
{"value":{"_id":"8c148c57925872f233d11639ea7df6f7","_rev":"1-5895b7763816df9683b69b010b5721c5","type":{"name":"FHPBar","class":"complex","fields":[{"name":"x1","type":"integer"},{"name":"y1","type":"integer"},{"name":"x2","type":"integer"},{"name":"y2","type":"integer"}]}}},
{"value":{"_id":"8c148c57925872f233d11639ea7dffb1","_rev":"1-8ae8d38cf28eb9e003d8152cd08142f9","type":{"name":"FHPCircle","class":"complex","fields":[{"name":"r","type":"integer"},{"name":"x","type":"integer"},{"name":"y","type":"integer"}]}}}
]}
*/