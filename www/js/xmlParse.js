//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

var redColor = 'rgb(242,49,28)';
var blueColor = 'rgb(28,129,212)';
var greyColor = 'rgb(205,205,205)';

function parseLayers(brd){

	var parent = document.getElementById('canvas_container');
	parent.innerHTML = '';
	document.getElementById('layerButtons_div').innerHTML = '';

	////////////
	////////////
	////////////

	function makeCanvas(name){
		var canvas = document.createElement('canvas');
		parent.appendChild(canvas);

		var context = canvas.getContext('2d');

		////////////

		function select(){

			// as a safety measure, set the cut-depth to the default value
			document.getElementById('cutDepth').value = minCutDepth;

			var cans = parent.children;
			for(var i=0;i<cans.length;i++){
				if(cans[i]===canvas){
					cans[i].classList.remove('grayed');
					parent.visibleLayer = cans[i];
					if(cans[i].parent){
						cans[i].parent.button.style.backgroundColor = isMirrored ? blueColor : redColor;
						cans[i].parent.button.style.color = 'white';
					}
				}
				else{
					cans[i].classList.add('grayed');
					if(cans[i].parent){
						cans[i].parent.button.style.color = 'black';
						cans[i].parent.button.style.backgroundColor = greyColor;
					}
				}
			}
		}

		var showButton = document.createElement('button');
		showButton.classList.add('layerButton');
		showButton.innerHTML = name;

		document.getElementById('layerButtons_div').appendChild(showButton);

		showButton.addEventListener('click',select);

		////////////

		function rc(){
			return Math.floor(Math.random()*255);
		}

		////////////

		var drawLayer = function(_w,_h,_pad,_color,_strokeSize,_scale){

			this.canvas.width = Math.round(_w);
			this.canvas.height = Math.round(_h);
			this.canvas.style.width = Math.round(_w);+'px';
			this.canvas.style.height = Math.round(_h)+'px';

			this.context.strokeStyle = _color;
			this.context.fillStyle = _color;
			this.context.lineWidth = _strokeSize;

			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

			this.context.save();

			var xOffset = Math.floor(brd.info.min.x*-1*_scale);
			var yOffset = Math.floor(brd.info.min.y*_scale);

			this.context.translate(xOffset,yOffset);

			for(var i=0;i<this.cuts.length;i++){
				if(this.cuts[i].length>1){
					var prev = {
						'x':this.cuts[i][0].x,
						'y':this.cuts[i][0].y
					};
					for(var m=1;m<this.cuts[i].length;m++) {
						var startX = prev.x;
						var startY = prev.y;
						var endX = this.cuts[i][m].x;
						var endY = this.cuts[i][m].y;

						prev.x = endX;
						prev.y = endY;

						this.context.beginPath();
						this.context.moveTo((startX*_scale)+_pad,_h-((startY*_scale)+_pad));
						this.context.lineTo((endX*_scale)+_pad,_h-((endY*_scale)+_pad));
						this.context.stroke();
					}
				}
				else if(this.cuts[i].length){
					var tempX = this.cuts[i][0].x;
					var tempY = this.cuts[i][0].y;

					this.context.beginPath();
					this.context.arc((tempX*_scale)+_pad,_h-((tempY*_scale)+_pad),4,0,2*Math.PI,false);
					this.context.fill();
				}
			}

			this.context.restore();
		};

		////////////

		return {
			'canvas':canvas,
			'context':context,
			'width':brd.info.width,
			'height':brd.info.height,
			'cuts':[],
			'draw':drawLayer,
			'select':select,
			'button':showButton
		};
	}

	////////////
	////////////
	////////////


	// the WIRES canvas layer

	for(var n in brd.wires){
		var layerWires = brd.wires[n];
		var thisLayerName = currentBoard.info.layers[n];
		var c = makeCanvas(thisLayerName);
		c.canvas.parent = c;

		var currentLine = [];
		var prev = {'x':NaN,'y':NaN};

		for(var i=0;i<layerWires.length;i++){

			var wire = layerWires[i];

			// if it has a different starting point as the previous wire's ending point,
			// then that means it's a new 'cut' array
			if(i===0) {
				currentLine.push({
					'x':wire.x1,
					'y':wire.y1
				});
			}
			else if (prev.x!==wire.x1 || prev.y!==wire.y1) {
				c.cuts.push(currentLine);
				currentLine = [];
				currentLine.push({
					'x':wire.x1,
					'y':wire.y1
				});
			}

			if(wire.x2!==wire.x1 || wire.y1!==wire.y2){
				currentLine.push({
					'x':wire.x2,
					'y':wire.y2
				});
			}

			prev.x = wire.x2;
			prev.y = wire.y2;
		}

		// add the final line we constructed
		c.cuts.push(currentLine);
	}

	

	
	//By MosabWadea 14-7-2015

	//adding circles to the cutlines
	for(var n in brd.circles){
		var layerCircles = brd.circles[n];
		var thisLayerName = currentBoard.info.layers[n];
		var c = makeCanvas(thisLayerName);
		c.canvas.parent = c;

		var currentLine = [];
		var prev = {'x':NaN,'y':NaN};

		for(var i=0;i<layerCircles.length;i++){

			var circle = layerCircles[i];

			// if it has a different starting point as the previous circle's ending point,
			// then that means it's a new 'cut' array
			if(i===0) {
				currentLine.push({
					'x':circle.x1,
					'y':circle.y1
				});
			}
			else if (prev.x!==circle.x1 || prev.y!==circle.y1) {
				c.cuts.push(currentLine);
				currentLine = [];
				currentLine.push({
					'x':circle.x1,
					'y':circle.y1
				});
			}

			if(circle.x2!==circle.x1 || circle.y1!==circle.y2){
				currentLine.push({
					'x':circle.x2,
					'y':circle.y2
				});
			}

			prev.x = circle.x2;
			prev.y = circle.y2;
		}

		// add the final line we constructed
		c.cuts.push(currentLine);
	}
	//MosabWadea
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

function drawAllLayers(){

	var parent = document.getElementById('canvas_container');

	isMirrored = false;

	var button = document.getElementById('mirror_button');
	if(isMirrored){
		button.classList.add('bottom_layer');
		button.classList.remove('top_layer');
		parent.classList.add('mirrored_line');
		button.innerHTML = 'MIRRORED';
	}
	else{
		button.classList.remove('bottom_layer');
		button.classList.add('top_layer');
		parent.classList.remove('mirrored_line');
		button.innerHTML = 'NOT MIRRORED';
	}

	var cans = parent.getElementsByTagName('canvas');

	if(cans.length>0){

		//document.getElementById('container').style.display = 'block';
		//document.getElementById('dragWords').style.display = 'none';

		for(var i=0;i<cans.length;i++){
			var layer = cans[i].parent;

			var theWidth = Math.round(layer.width*vizScale);
			var theHeight = Math.round(layer.height*vizScale);

			var strokeSize = Math.min(theWidth,theHeight)*.01;

			var padding = Math.round(theWidth*vizScale*.1);
			theWidth+=(padding*2);
			theHeight+=(padding*2);

			var drawColor = isMirrored ? 'rgb(28,129,212)' : 'rgb(242,69,28)';

			cans[i].parent.button.style.backgroundColor = isMirrored ? blueColor : redColor;
			cans[i].parent.button.style.color = 'white';

			layer.draw(theWidth,theHeight,padding,drawColor,2,vizScale);
		}

		parent.style.width = theWidth+'px';
		parent.style.height = theHeight+'px';

		var inchesWidth = (layer.width/1016).toFixed(2);
		var inchesHeight = (layer.height/1016).toFixed(2);

		var cmWidth = (inchesWidth*2.54).toFixed(2);
		var cmHeight = (inchesHeight*2.54).toFixed(2);

		var widthString = inchesWidth+' in ('+cmWidth+' cm)';
		var heightString = inchesHeight+' in ('+cmHeight+' cm)';

		document.getElementById('widthLabel').innerHTML = widthString;
		document.getElementById('heightLabel').innerHTML = heightString;
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

var isMirrored = false;

function mirror(){
	var parent = document.getElementById('canvas_container');
	var cans = parent.getElementsByTagName('canvas');

	isMirrored = !isMirrored;

	var button = document.getElementById('mirror_button');
	if(isMirrored){
		button.classList.add('bottom_layer');
		button.classList.remove('top_layer');
		parent.classList.add('mirrored_line');
		button.innerHTML = 'MIRRORED';
	}
	else{
		button.classList.remove('bottom_layer');
		button.classList.add('top_layer');
		parent.classList.remove('mirrored_line');
		button.innerHTML = 'NOT MIRRORED';
	}

	for(var i=0;i<cans.length;i++){
		var can = cans[i];
		var cuts = can.parent.cuts;
		for(var n=0;n<cuts.length;n++){
			var c = cuts[n];
			for(var b=0;b<c.length;b++){
				var coord = c[b];
				coord.x = ((coord.x*-1) + can.parent.width) + (currentBoard.info.min.x * 2);
			}
		}

		var layer = can.parent;

		var theWidth = Math.round(layer.width*vizScale);
		var theHeight = Math.round(layer.height*vizScale);

		var padding = Math.round(theWidth*vizScale*.1);
		theWidth+=(padding*2);
		theHeight+=(padding*2);

		var drawColor = isMirrored ? 'rgb(28,129,212)' : 'rgb(242,69,28)';

		parent.visibleLayer.parent.button.style.backgroundColor = isMirrored ? blueColor : redColor;
		parent.visibleLayer.parent.button.style.color = 'white';

		layer.draw(theWidth,theHeight,padding,drawColor,2,vizScale);

	}

	updateOriginArrow();
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

function createPnP() {

	var CSV_TEXT = [
		'\r\n',
		'%,Distance values are in millimeters (floats)\r\n',
		'%,Lines beginning with % are comments\r\n',
		'\r\n',
		'\r\n',
		'%,Assign the board\'s origin below (found with the PnP\'s laser)\r\n',
		'%,Replace "origin_x" and "origin_y"\r\n',
		'\r\n',
		'65535,0,origin_x,origin_y,\r\n',
		'\r\n',
		'\r\n',
		'%,Put the position of each panelled board below\r\n',
		'%,Replace "panel_x" and "panel_y"\r\n',
		'\r\n',
		'%,Make a new line for each panel\r\n',
		'%,Or just erase them if not panelling\r\n',
		'%,Do not include the first board!!! (the one at origin)\r\n',
		'\r\n',
		'65535,3,panel_x,panel_y,\r\n',
		'65535,3,panel_x,panel_y,\r\n',
		'\r\n',
		'\r\n',
		'%,You must enter three values for each component in the list below\r\n',
		'%,,1) _nozzle_\r\n',
		'%,,2) _stack_\r\n',
		'%,,3) _rotation_\r\n',
		'\r\n',
		'%Order (1-inf),Nozzle (1-2),Stack (1-13),X (mm),Y (mm),R (degrees),H (0),skip (0-1), Label,\r\n'
	];

	var partCount = 0;

	// go through all parts, looking for SMDs
	for(var partName in currentBoard.parts) {
		var thisPart = currentBoard.parts[partName];
		if(!thisPart.holes.length) {
			// it's got no holes, so use it
			partCount++;

			var thisString = '';

			// order
			thisString += partCount;
			thisString += ',';

			// nozzle
			thisString += '_nozzle_';
			thisString += ',';

			// stack
			thisString += '_stack_';
			thisString += ',';

			// X
			thisString += ((thisPart.x/1016) * 25.4).toFixed(2); // to mm
			thisString += ',';

			// Y
			thisString += ((thisPart.y/1016) * 25.4).toFixed(2); // to mm
			thisString += ',';

			// rotation
			thisString += '_rotation_';
			thisString += ',';

			// height
			thisString += '0';
			thisString += ',';

			// skip
			thisString += '0';
			thisString += ',';

			// label
			thisString += thisPart.name+'('+thisPart.value+')';
			thisString += ',';

			thisString += '\r\n';

			CSV_TEXT.push(thisString);
		}
	}

	var blob = new Blob(CSV_TEXT, {type: "text/csv;charset=utf-8"});
	var filename = currentBoard.name;

	saveAs(blob, filename);
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

function printLayer(){
	var parent = document.getElementById('canvas_container');
	if(parent.visibleLayer){
		var layerName = parent.visibleLayer.parent.button.innerHTML;
		var cuts = parent.visibleLayer.parent.cuts;
		Roland_sendCuts(cuts,layerName);
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

window.addEventListener('load',function(){

	window.addEventListener('dragover', function(e){
		e.preventDefault();
	}, false);

	window.addEventListener('dragenter', function(e){
		e.preventDefault();
	}, false);
	window.addEventListener('dragleave', function(e){
		e.preventDefault();
	}, false);

	window.addEventListener('drop', loadFile, false);

	window.addEventListener('resize',function(){
		if(document.getElementById('canvas_container').children.length>0){
			updateOriginArrow();
		}
	});

});

//////////////
//////////////
//////////////

function updateOriginArrow(){

	var obj = document.getElementsByTagName('canvas')[0];
	if(obj){

		var originArrow = document.getElementById('originArrow');
		originArrow.style.display = 'block';

		var originCircle = document.getElementById('originCircle');
		originCircle.style.display = 'block';

		var origin_warning = document.getElementById('origin_warning');
		origin_warning.style.display = 'inline-block';

		var boardOffsetX = Math.floor(currentBoard.info.min.x * vizScale);
		var boardOffsetY = Math.floor(currentBoard.info.min.y * vizScale);

		var arrowY = obj.offsetHeight+boardOffsetY;
		var arrowX = (originArrow.parentNode.offsetWidth/2)+(obj.offsetWidth/2)+boardOffsetX;

		if(isMirrored) {
			arrowX = originArrow.parentNode.offsetWidth - arrowX;
		}

		originArrow.style.top = arrowY+'px';
		originArrow.style.right = arrowX+'px';

		originCircle.style.top = arrowY+'px';
		originCircle.style.right = arrowX+'px';

		origin_warning.style.top = arrowY+'px';
		origin_warning.style.right = arrowX+'px';
	}
}

//////////////
//////////////
//////////////

function loadFile(e){
	e.preventDefault();
	var files = e.dataTransfer.files; // FileList object.

	isMirrored = false;

	if(files.length>0){
		for(var i=0;i<files.length;i++){
			var _F = files[i];

			var reader = new FileReader();

			reader.onload = function(e){

				currentBoard = parseXML(reader.result);

				currentBoard.name = _F.name.split('.')[0];

				displayBoard();
			}

			reader.readAsText(_F);
		}
	}
}

//////////////
//////////////
//////////////

var currentBoard = undefined;
var vizScale = 0.12;

function displayBoard() {

	document.getElementById('widthLabel').style.display = 'inline';
	document.getElementById('heightLabel').style.display = 'inline';
	document.getElementById('mirror_button').style.display = 'inline-block';

	parseLayers(currentBoard);
	drawAllLayers();

	updateOriginArrow();

	var kids = document.getElementById('canvas_container').children;
	kids[0].parent.select();
}

//////////////
//////////////
//////////////

function parseXML(theText){

	// parse the wire elements in an object
	function parseWires(allWires){
		var myWires = {};
		for(var i=0;i<allWires.length;i++){
			var tempWire = allWires[i];
			var tempLayer = Number(tempWire.getAttribute('layer'));



			if(!myWires[tempLayer]){
				myWires[tempLayer] = [];
			}

			var _w = {
				'x1' : makeMill(Number(tempWire.getAttribute('x1'))),
				'x2' : makeMill(Number(tempWire.getAttribute('x2'))),
				'y1' : makeMill(Number(tempWire.getAttribute('y1'))),
				'y2' : makeMill(Number(tempWire.getAttribute('y2'))),
				'layer' : Number(tempWire.getAttribute('layer')),
				'width' : Number(tempWire.getAttribute('width'))
			};

			saveMinMax(_w.x1,_w.y1);
			saveMinMax(_w.x2,_w.y2);

			myWires[tempLayer].push(_w);
		}
		return myWires;
	}

	//By MosabWadea 14-7-2015
	// parse the circle elements in an object
	function parseCircles(allCircles){
		var myCircles = {};
		for(var i=0;i<allCircles.length;i++){
			var tempCircle = allCircles[i];
			var tempLayer = Number(tempCircle.getAttribute('layer'));



			if(!myCircles[tempLayer]){
				myCircles[tempLayer] = [];
			}

			var cx = Number(tempCircle.getAttribute('x'));
			var cy = Number(tempCircle.getAttribute('y'));
			var cr = Number(tempCircle.getAttribute('radius'));

			//find the first pont of the circle
			var x1 = cx + (cr * Math.cos(Math.PI / 180));
			var y1 = cy + (cr * Math.sin(Math.PI / 180));
			//add all the other points
			for(var j=1; j<41; j++){	//this will make the loop to go over the full circle (360 dig) but divided over 40 parts, this is to make it faster
					var x2 = cx + (cr * Math.cos((9*j) * (Math.PI / 180))); // the 9 is to make the 40th digree is the 360th 
					var y2 = cy + (cr * Math.sin((9*j) * (Math.PI / 180)));
					

					var _c = {
						'x1' : makeMill(x1),
						'x2' : makeMill(x2),
						'y1' : makeMill(y1),
						'y2' : makeMill(y2),
						'layer' : Number(tempCircle.getAttribute('layer'))
					};

					saveMinMax(_c.x1,_c.y1);
					saveMinMax(_c.x2,_c.y2);

					myCircles[tempLayer].push(_c);


					x1 = x2;
					y1 = y2;
			}
		}
		return myCircles;
	}
	//MosabWadea
	///////////////

	function parseParts(allElements){
		var myParts = {};
		for(var i=0;i<allElements.length;i++){
			var element = allElements[i];
			var tempPart = {
				'name' : element.getAttribute('name'),
				'value' : element.getAttribute('value'),
				'library' : element.getAttribute('library'),
				'package' : element.getAttribute('package'),
				'rot' : element.getAttribute('rot') || 0,
				'x' : makeMill(Number(element.getAttribute('x'))),
				'y' : makeMill(Number(element.getAttribute('y')))
			};

			saveMinMax(tempPart.x,tempPart.y);

			if(typeof tempPart.rot==='string') {

				// find the first character that's a number
				// and get rid of all previous characters
				var newString = '';

				for(var l=0;l<tempPart.rot.length;l++){

					var thisLetter = tempPart.rot.charAt(l);

					// if it could be a number, save the character
					if(!isNaN(Number(thisLetter))) {
						newString += thisLetter;
					}
				}

				// then turn the new string into a number
				tempPart.rot = Number(newString) || 0;
			}

			myParts[tempPart.name] = tempPart;
		}
		return myParts;
	}

	function parseVias(allSignals){
		var myVias = [];
		for(var i=0;i<allSignals.length;i++){
			var signalVias = allSignals[i].getElementsByTagName('via');
			for(var v=0;v<signalVias.length;v++){
				var thisVia = signalVias[v];
				var tempVia = {
					'x' : makeMill(Number(thisVia.getAttribute('x'))),
					'y' : makeMill(Number(thisVia.getAttribute('y')))
				};

				saveMinMax(tempVia.x,tempVia.y);

				myVias.push(tempVia);
			}
		}
		return myVias;
	}

	function addHoles(allLibraries,parts){
		for(var i=0;i<allLibraries.length;i++){

			// isolate the library to get its packages
			var libraryName = allLibraries[i].getAttribute('name');
			var allPackages = allLibraries[i].getElementsByTagName('package');

			for(var p=0;p<allPackages.length;p++){
				var thisPackage = allPackages[p];
				// get all holes from this package
				var allHoles = thisPackage.getElementsByTagName('pad');
				var packName = thisPackage.getAttribute('name');

				// find x, y, and rotation from the library and package name

				for(var n in parts){
					if(parts[n].library===libraryName && parts[n].package===packName){

						var thisPart = parts[n];

						var rads = ((360-thisPart.rot)/180)*Math.PI;
						thisPart.rads = rads;

						thisPart.holes = [];

						// append each hols to this part's hole list
						for(var h=0;h<allHoles.length;h++){
							var thisHole = allHoles[h];

							var relX = Number(thisHole.getAttribute('x'));
							var relY = Number(thisHole.getAttribute('y'));

							var tempHole = {
								'relX' : makeMill(relX),
								'relY' : makeMill(relY),
								'currentRelX' : makeMill((relY*Math.sin(rads))+(relX*Math.cos(rads))),
								'currentRelY' : makeMill((relY*Math.cos(rads))-(relX*Math.sin(rads)))
							};

							thisPart.holes.push(tempHole);
						}
					}
				}
			}
		}

		return parts;
	}

	var max={'x':-9999999,'y':-9999999};
	var min={'x':0,'y':0};

	function saveMinMax(x,y){
		if(x<min.x) min.x = x;
		if(x>max.x) max.x = x;
		if(y<min.y) min.y = y;
		if(y>max.y) max.y = y;
	}

	var counter = 0;

	function makeMill(num){

		return Math.round(num*millMultiplier);
		//return num;
	}

	var millMultiplier = 1;

	function setUnit(unit){

		var RMLsPerInch = 1016;
		var millimetersPerInch = 25.4;
		var milsPerInch = 1000;
		millMultiplier = RMLsPerInch/millimetersPerInch;
	}

	// start the parsing
	if (window.DOMParser){

		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(theText,"text/xml");

		var theLayers = xmlDoc.getElementsByTagName('layers')[0]; // info about the layers

		var theGrid = xmlDoc.getElementsByTagName('grid')[0]; // holds the unit used
		setUnit(theGrid.getAttribute('unit'));

		var theseLayers = xmlDoc.getElementsByTagName('layers')[0].getElementsByTagName('layer');
		var foundLayers = {};

		for(var l=0;l<theseLayers.length;l++) {
			var layerNumber = theseLayers[l].getAttribute('number');
			var layerName = theseLayers[l].getAttribute('name');
			foundLayers[layerNumber] = layerName;
		}

		var theBoard = xmlDoc.getElementsByTagName('board')[0]; // has everything we'll draw

		if(theBoard){

			// 'plain' holds toolpath wires and circles
			var plain = theBoard.getElementsByTagName('plain')[0];
			var allWires = plain.getElementsByTagName('wire');
			var allCircles = plain.getElementsByTagName('circle'); //By MosabWadea 14-7-2015

			// 'elements' holds a part's name, package, x, y, and rotation
			var elements = theBoard.getElementsByTagName('elements')[0];
			var allElements = elements.getElementsByTagName('element')

			// 'signals' holds a signal-line's containing wires, vias, and pads
			var signals = theBoard.getElementsByTagName('signals')[0];
			var allSignals = signals.getElementsByTagName('signal');

			var libraries = theBoard.getElementsByTagName('libraries')[0];
			var allLibraries = libraries.getElementsByTagName('library');


			// create our parts
			var myBoard = {
				'wires' : parseWires(allWires),
				'circles' : parseCircles(allCircles),  //Ny MosabWadea 14-7-2015
				'parts' : addHoles( allLibraries, parseParts(allElements) ),
				'vias' : parseVias(allSignals)
			};

			myBoard.info = {
				'width' : max.x-min.x,
				'height' : max.y-min.y,
				'min' : min,
				'max' : max,
				'layers' : foundLayers
			};

			return myBoard;
		}
	}
	else{
		console.log('woops, bad browser');
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////