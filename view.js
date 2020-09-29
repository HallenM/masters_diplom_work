
// Число добавленных объектов класса set-of-objects/complex
var countOfElems = new Array();
var addedObj = new Array();
// Первый выданный на экран объект из списка
var firstElement;
var nameSelect;
var res;

//CouchDB begin
var couchDB_baseURL = "http://hpccloud.ssd.sscc.ru:numb_port/aka/";
var couchDB_username = "*****";
var couchDB_password = "***********";

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

function findViewType(nameType) {
	var item;
	res.forEach(function (items) {
		if (items.value.title == nameType) {
			item = items;			
		}
	});
	return item;
}

function findTypeById(idType) {
	var item;
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
	if (countOfElems.length == 0) {
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
