
// Число добавленных объектов класса set-of-objects/complex
var count = 0;
// Число атрибутов внутри объекта; для каждого объекта класса set-of-objects/complex
var countOfElems = new Array();
// Первый выданный на экран объект из списка
var firstElement;
// Список добавленных объектов для определения атрибутов
var addedObj = [];
// Число добавленных значений класса enum
var countValues = 0;
var typeName = "complex";

//CouchDB begin
var couchDB_baseURL = "http://hpccloud.ssd.sscc.ru:number_port/aka/";
var couchDB_username = "*******";
var couchDB_password = "***********";


function addNewTypeObj(){
	var inputArea = document.getElementById("input_area_type");
	var divGeneral = document.createElement('div');
	divGeneral.setAttribute("id", "type" + (count + 1));

	var divName = document.createElement('div');
	var labelName = document.createElement('label');
	if (count == 0) {
		labelName.innerHTML = "Type of object";
	} else {
		labelName.innerHTML = "Type of object" + (count + 1);
	}
	divName.appendChild(labelName);
	divGeneral.appendChild(divName);

	var div = document.createElement('div');
	var label = document.createElement('label');
	label.htmlFor = "name_type_obj";
	label.innerHTML = "Name of type of object: ";
	div.appendChild(label);
	var input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "name_type_obj" + (count + 1));
    div.appendChild(input);
    divGeneral.appendChild(div);

    // button add type elem
    var div = document.createElement('div');
    var button = document.createElement('input');
    button.setAttribute("type", "button");
	button.setAttribute("id", "add_type_elem" + (count + 1));
	button.setAttribute("class", "btn btn-outline-primary");
	button.setAttribute("value", "Add type elem");
	button.setAttribute('onclick', 'addTypeElem()');
	div.appendChild(button);

	// button delete type elem
	var button = document.createElement('input');
    button.setAttribute("type", "button");
	button.setAttribute("id", "del_type_elem" + (count + 1));
	button.setAttribute("class", "btn btn-outline-primary");
	button.setAttribute("value", "Delete type elem");
	button.setAttribute('onclick', 'deleteTypeElem()');
	div.appendChild(button);
    divGeneral.appendChild(div);

    var div = document.createElement('div');
    div.setAttribute("id", "set_of_types" + (count + 1));
    divGeneral.appendChild(div);

    countOfElems.push(0);

    if(count == 0) {
    	inputArea.appendChild(divGeneral);
    	firstElement = divGeneral;
	}
	else {
		inputArea.insertBefore(divGeneral, firstElement);
		firstElement = divGeneral;
		var oldbtnAdd = document.getElementById("add_type_elem" + count);
		oldbtnAdd.setAttribute("disabled", "disabled");
		var oldbtnDel = document.getElementById("del_type_elem" + count);
		oldbtnDel.setAttribute("disabled", "disabled");
	}
    count++;
}

function addTypeElem(){
	var divGeneral = document.getElementById("set_of_types" + count);

	countOfElems[count - 1]++;

	divElem = document.createElement('div');
	divElem.setAttribute("id", "t" + count + "_elem" + countOfElems[count - 1]);

	div = document.createElement('div');
	label = document.createElement('label');
    label.htmlFor = "name_type";
	label.innerHTML = "Name: ";
	div.appendChild(label);
	input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "t" + count + "_name_type" + countOfElems[count - 1]);
	div.appendChild(input);
    divElem.appendChild(div);

    div = document.createElement('div');
    label = document.createElement('label');
    label.htmlFor = "type_";
	label.innerHTML = "Type: ";
	div.appendChild(label);
	input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "t" + count + "_type_" + countOfElems[count - 1]);
	div.appendChild(input);
    divElem.appendChild(div);

    divGeneral.appendChild(divElem);
}

function deleteTypeElem(){
	var divGeneral = document.getElementById("set_of_types" + count);	
	var element = divGeneral.lastChild;
	if (divGeneral.childNodes.length > 0) {
		countOfElems[count - 1]--;
		divGeneral.removeChild(element);
	}
}

function deleteTypeObj(){
	var inputArea = document.getElementById("input_area_type");
	if(inputArea.childNodes.length > 2) {
		var element = inputArea.childNodes[2];
		count--;
		countOfElems.pop();
		inputArea.removeChild(element);
		firstElement = inputArea.childNodes[2];
	}
	else {
		firstElement = null;
	}
}

// Выбор конструктора типа
function viewType(){
	list_of_types.onblur = function() {
		var inputArea = document.getElementById("input_area_type");
		if(typeName == "complex") {						// it's complex
  			var element = inputArea.firstChild;
			count = 0;
			countOfElems.pop();
			inputArea.removeChild(element);
			firstElement = null;
		} else if(typeName == "set-of-objects") {		// it's set-of-objects
			var len = inputArea.childNodes.length;
			for(var i = 0; i < len; i++) {
  				var element = inputArea.firstChild;
				countOfElems.pop();
				inputArea.removeChild(element);
				firstElement = inputArea.firstChild;
			}
			count = 0;
			firstElement = null;
		} else if(typeName == "enum") { 				// it's enum
			var element = inputArea.firstChild;
			inputArea.removeChild(element);
		} else { 										// it's inheritance
			var element = inputArea.firstChild;
			inputArea.removeChild(element);
			count = 0;
			countOfElems.pop();
		}
	};

	typeName = document.getElementById("list_of_types").value;

	// Вызов нужного конструктора
	if(typeName == "complex") {											// it's complex
		var inputArea = document.getElementById("input_area_type");
		if (inputArea.childNodes.length == 0) {
			addNewTypeObj();
		}
	} else if(typeName == "set-of-objects") {							// it's set-of-objects
		var inputArea = document.getElementById("input_area_type");
		if (inputArea.childNodes.length == 0) {
			addSetOfObjects();
			chooseConstructor();
		}
	} else if(typeName == "enum") { 									// it's enum
		var inputArea = document.getElementById("input_area_type");
		if (inputArea.childNodes.length == 0) {
			addNewEnumType();
		}
	} else {															// it's inheritance
		var inputArea = document.getElementById("input_area_type");
		if (inputArea.childNodes.length == 0) {
			addNewInheritanceType();
		}
	}
}

// Создание типа inheritance
function addNewInheritanceType() {
	var inputArea = document.getElementById("input_area_type");
	var divGeneral = document.createElement('div');
	divGeneral.setAttribute("id", "inheritance_obj");

	var divName = document.createElement('div');
	var labelName = document.createElement('label');
	labelName.innerHTML = "Added a new inheritance type";
	divName.appendChild(labelName);
	divGeneral.appendChild(divName);

	// Имя для inheritance type
	var div = document.createElement('div');
	var label = document.createElement('label');
	label.htmlFor = "general_inheritance_name";
	label.innerHTML = "Name of inheritance type: ";
	div.appendChild(label);
	var input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "general_inheritance_name");
	div.appendChild(input);
	divGeneral.appendChild(div);

	// Имя для наследуемого типа
	div = document.createElement('div');
	label = document.createElement('label');
	label.htmlFor = "inherited_name";
	label.innerHTML = "Inherited type: ";
	div.appendChild(label);
	var input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "inherited_name");
	div.appendChild(input);
	divGeneral.appendChild(div);
	
	// 2 buttons
	var div = document.createElement('div');
	div.setAttribute("id", "buttons");
	div.setAttribute("class", "form-group");
	        
	// button add new object
	var button = document.createElement('input');
	button.setAttribute("type", "button");
	button.setAttribute("id", "add_attribute");
	button.setAttribute("class", "btn btn-outline-primary");
	button.setAttribute("value", "Added attribute");
	button.setAttribute('onclick', 'addTypeElem()');
	div.appendChild(button);

	// button delete object
	var button = document.createElement('input');
	button.setAttribute("type", "button");
	button.setAttribute("id", "del_attribute");
	button.setAttribute("class", "btn btn-outline-primary");
	button.setAttribute("value", "Delete attribute");
	button.setAttribute('onclick', 'deleteTypeElem()');
	div.appendChild(button);

	divGeneral.appendChild(div);

	var div = document.createElement('div');
    div.setAttribute("id", "set_of_types" + (count + 1));
    divGeneral.appendChild(div);

    countOfElems.push(0);

	inputArea.appendChild(divGeneral);
	count++;
}

//  Создание типа set-of-objects
function addSetOfObjects(){
	var inputArea = document.getElementById("input_area_type");
	var divGeneral = document.createElement('div');
	divGeneral.setAttribute("id", "choose_setting");

	var divName = document.createElement('div');
	var labelName = document.createElement('label');
	labelName.innerHTML = "Added a new set-of-objects type";
	divName.appendChild(labelName);
	divGeneral.appendChild(divName);

	// Имя для set-of-objects
	var div = document.createElement('div');
	var label = document.createElement('label');
	label.htmlFor = "general_name";
	label.innerHTML = "Name of set-of-objects type: ";
	div.appendChild(label);
	var input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "general_name");
	div.appendChild(input);
	divGeneral.appendChild(div);

	// Выбор способа создания set-of-objects (две кнопки)
	var div = document.createElement('div');
	div.setAttribute("class", "form-check");

	var input = document.createElement('input');
	input.setAttribute("type", "radio");
	input.setAttribute("id", "set1");
	input.setAttribute("class", "form-check-input");
	input.setAttribute("name", "setting");
	input.setAttribute("value", "exist");
	input.setAttribute('onclick', 'chooseConstructor()');
	div.appendChild(input);
	var label = document.createElement('label');
	label.htmlFor = "set1";
	label.setAttribute("class", "form-check-label");
	label.innerHTML = " Set the name of exist types ";
	div.appendChild(label);
		
	var input = document.createElement('input');
	input.setAttribute("type", "radio");
	input.setAttribute("id", "set2");
	input.setAttribute("class", "form-check-input");
	input.setAttribute("name", "setting");
	input.setAttribute("value", "new");
	input.setAttribute('onclick', 'chooseConstructor()');
	div.appendChild(input);
	var label = document.createElement('label');
	label.htmlFor = "set2";
	label.setAttribute("class", "form-check-label");
	label.innerHTML = " Define new type ";
	div.appendChild(label);
		
	divGeneral.appendChild(div);
	inputArea.appendChild(divGeneral);
}

// Выбор конструктора для создания типа set-of-objects
function chooseConstructor() {
		
	var val = document.getElementsByName('setting');
	var inputArea = document.getElementById("input_area_type");

	if(val[0].checked) {
		if (inputArea.childNodes.length == 1) {
			addInputList();
		} else {
			for(var i = 0; i < count + 1; i++) {
  				var element = inputArea.lastChild;
				countOfElems.pop();
				inputArea.removeChild(element);
			}
			count = 0;
			firstElement = null;
			addInputList();
		}
	}
	if(val[1].checked) {
		// Так как 1-ый эл-нт это две radiobuttons
		if (inputArea.childNodes.length == 1) {
			addTwoButtons();
		} else {
			var element = inputArea.lastChild;
			inputArea.removeChild(element);
			addTwoButtons();
		}
	}
}

// Введение только имён для существующих сложных типов
function addInputList() {
	var inputArea = document.getElementById("input_area_type");

	var divGeneral = document.createElement('div');
	divGeneral.setAttribute("id", "list_of_name_types");
	divGeneral.setAttribute("class", "form-group");

	var div = document.createElement('div');
	var p = document.createElement('p');
	div.appendChild(p);
	var label = document.createElement('label');
	label.htmlFor = "list_name";
	label.innerHTML = "Enter existing type names with a comma";
	div.appendChild(label);
	divGeneral.appendChild(div);

	var div = document.createElement('div');
	var input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "list_name");
	div.appendChild(input);
	divGeneral.appendChild(div);

	inputArea.appendChild(divGeneral);
}

// Помимо введения создание новых сложных типов внутри set-of-objects
function addTwoButtons() {
	var inputArea = document.getElementById("input_area_type");

	var div = document.createElement('div');
	div.setAttribute("id", "buttons");
	div.setAttribute("class", "form-group");
	        
	// button add new object
	var button = document.createElement('input');
	button.setAttribute("type", "button");
	button.setAttribute("id", "add_new_type_obj");
	button.setAttribute("class", "btn btn-outline-primary");
	button.setAttribute("value", "New type object");
	button.setAttribute('onclick', 'addNewTypeObj()');
	div.appendChild(button);

	// button delete object
	var button = document.createElement('input');
	button.setAttribute("type", "button");
	button.setAttribute("id", "del_type_obj");
	button.setAttribute("class", "btn btn-outline-primary");
	button.setAttribute("value", "Delete type object");
	button.setAttribute('onclick', 'deleteTypeObj()');
	div.appendChild(button);

	inputArea.appendChild(div);
}

// Создание типа enum
function addNewEnumType() {
	var inputArea = document.getElementById("input_area_type");
	var divGeneral = document.createElement('div');
	divGeneral.setAttribute("id", "enum_general");

	var divName = document.createElement('div');
	var labelName = document.createElement('label');
	labelName.innerHTML = "Added a new enum type";
	divName.appendChild(labelName);
	divGeneral.appendChild(divName);

	var div = document.createElement('div');
	var label = document.createElement('label');
	label.htmlFor = "enum_name";
	label.innerHTML = "Name of enum type: ";
	div.appendChild(label);
	var input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "enum_name");
	div.appendChild(input);
	divGeneral.appendChild(div);

	// button add enum value
	var div = document.createElement('div');
	var button = document.createElement('input');
	button.setAttribute("type", "button");
	button.setAttribute("id", "add_enum_value");
	button.setAttribute("class", "btn btn-outline-primary");
	button.setAttribute("value", "Add enum value");
	button.setAttribute('onclick', 'addEnumValue()');
	div.appendChild(button);

	// button delete enum value
	var button = document.createElement('input');
	button.setAttribute("type", "button");
	button.setAttribute("id", "del_enum_value");
	button.setAttribute("class", "btn btn-outline-primary");
	button.setAttribute("value", "Delete enum value");
	button.setAttribute('onclick', 'deleteEnumValue()');
	div.appendChild(button);
	divGeneral.appendChild(div);

	var div = document.createElement('div');
	div.setAttribute("id", "set_enum_values");
	divGeneral.appendChild(div);

	divGeneral.appendChild(div);
	inputArea.appendChild(divGeneral);
}

// Задание значений для типа enum
function addEnumValue() {
	var divGeneral = document.getElementById("set_enum_values");

	countValues++;

	div = document.createElement('div');
	label = document.createElement('label');
    label.htmlFor = "value" + countValues;
	label.innerHTML = "Value: ";
	div.appendChild(label);
	input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("id", "value" + countValues);
	div.appendChild(input);

    divGeneral.appendChild(div);
}

// Удаление ненужных/некорректных значений типа enum при создании
function deleteEnumValue() {
	var divGeneral = document.getElementById("set_enum_values");	
	var element = divGeneral.lastChild;
	if (divGeneral.childNodes.length > 0) {
		countValues--;
		divGeneral.removeChild(element);
	}
}

function saveTypeObject(){
	typeName = document.getElementById("list_of_types").value;

	// Вызов нужного конструктора
	if(typeName == "complex") {									// it's complex
		saveComplexType(0);
	} else if(typeName == "set-of-objects") {					// it's set-of-objects
		var val = document.getElementsByName('setting');
		if(val[0].checked) {
			var list = document.getElementById("list_name").value;
			var nameObj = list.split(/[\s,]+/);

			saveSetOfObjectType(nameObj);			
		}
		if(val[1].checked) {
			var nameObj = [];
			for(var i = 0; i < count; i++) {
				nameObj[i] = document.getElementById("name_type_obj" + (i + 1)).value;
				saveComplexType(i);
			}

			saveSetOfObjectType(nameObj);
		}
	} else if(typeName == "enum") { 							// it's enum
		saveEnumType();
	} else {													// it's inheritance
		saveInheritanceType();
	}
}

function saveInheritanceType() {
	// Save new type as a new inheritance type
	var type = new Object();
	type.$schema = "http://json-schema.org/draft/2019-09/schema#";
	var idCM = findIdCM();
	type.$id = idCM + "/inheritance:" + document.getElementById("general_inheritance_name").value;
	type.title = document.getElementById("general_inheritance_name").value;
	type.type = "object";
	var obj = new Object();
	var inheritedName = document.getElementById("inherited_name").value;
	var item = findType(inheritedName);
	obj.inherited_type = {$ref: item.value.$id};

	for(var j = 0; j < countOfElems[0]; j++) {
		var elem = new Object();
		var nameElem = document.getElementById("t1" + "_name_type" + (j + 1)).value;
		var typeElem = document.getElementById("t1" + "_type_" + (j + 1)).value;
		var item = findType(typeElem);
		
		elem.type = item.value.type;
		elem.$ref = item.value.$id;

		var itemClass = item.value.$id.split(/[/:]+/);
		if(itemClass[1] == "enum") {
			elem.enum = item.value.enum;
		}

		obj[nameElem] = elem;	
	}

	type.properties = obj;

	sendSaveRequest(type);
}

function getAllTypes(fn) {
	var xhr = new XMLHttpRequest();
	var url = couchDB_baseURL + "_design/cms/_view/types";

	xhr.open("GET", url, false, couchDB_username, couchDB_password);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			fn(JSON.parse(xhr.response).rows);
		}
	};
	xhr.send();
}

function saveComplexType(id) {
	// Save new type as a new complex type
	var type = new Object();
	type.$schema = "http://json-schema.org/draft/2019-09/schema#";
	var idCM = findIdCM();
	type.$id = idCM + "/complex:" + document.getElementById("name_type_obj" + (id + 1)).value;
	type.title = document.getElementById("name_type_obj" + (id + 1)).value;
	type.type = "object";
	var obj = new Object();
	var mas = [];

	for(var j = 0; j < countOfElems[id]; j++) {
		var elem = new Object();
		var nameElem = document.getElementById("t" + (id + 1) + "_name_type" + (j + 1)).value;
		var typeElem = document.getElementById("t" + (id + 1) + "_type_" + (j + 1)).value;
		var item = findType(typeElem);
		
		elem.type = item.value.type;
		elem.$ref = item.value.$id;

		var itemClass = item.value.$id.split(/[/:]+/);
		if(itemClass[1] == "enum") {
			elem.enum = item.value.enum;
		}

		obj[nameElem] = elem;
		mas[j] = nameElem;	
	}

	type.properties = obj;
	type.required = mas;

	sendSaveRequest(type);
}

function findIdCM() {
	return "8c148c55647642fg5872f233d11653533023810";
}

function findType(nameType) {
	var type;
	// Вызов списка всех типов
	getAllTypes(function(_types){
		_types.forEach(function (items) {
			if (items.value.title == nameType) {
				type = items;
			}
		});
	});
	return type;
}

function saveSetOfObjectType(nameObj) {
	// Save new type as a new set-of-objects type
	var type = new Object();
	type.$schema = "http://json-schema.org/draft/2019-09/schema#";
	var idCM = findIdCM();
	type.$id = idCM + "/set-of-objects:" + document.getElementById("general_name").value;
	type.title = document.getElementById("general_name").value;
	type.type = "array";
	var obj = new Object();
	var mas = [];
	for(var i = 0; i < nameObj.length; i++) { 
		var ref = new Object();
		var item = findType(nameObj[i]);
		ref.$ref = item.value.$id;
		mas[i] = ref;
	}
	obj.anyOf = mas; 
	type.items = obj;

	sendSaveRequest(type);
}

function saveEnumType() {
	// Save new type as a new enum type
	var values = [];
	for(var i = 0; i < countValues; i++) { 
		values[i] = document.getElementById("value" + (i + 1)).value;
	}
	var type = new Object();
	type.$schema = "http://json-schema.org/draft/2019-09/schema#";
	var idCM = findIdCM();
	type.$id = idCM + "/enum:" + document.getElementById("enum_name").value;
	type.title = document.getElementById("enum_name").value;
	type.type = "string";
	type.enum = values;

	sendSaveRequest(type);
}

function sendSaveRequest(data) {
	var xhr = new XMLHttpRequest();
    xhr.open("POST", couchDB_baseURL, true, couchDB_username, couchDB_password);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          var response = JSON.parse(xhr.response);
        	if(response.ok == true){
            	console.log("resp OK: type was saved");
        	}
        }        
    };

    xhr.send(JSON.stringify(data));
}

