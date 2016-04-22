// ui.js
// main UI components, including timeline slider and country pop-up


var data_colors = d3.scale.category10();
function GenerateLineData(countryCode) {
  var CountryData  = [],
	  ContinentData=[];

  //Data is represented as an array of {x,y} pairs.
  var continent = list_Continent[countryCode] ; 
  for (var yearindex = 0;yearindex<years_by_index[selected].length;yearindex++)
  {
	yy1 = dataset[selected].where(function(row){return (row.country == countryCode) && (row.yearindex == yearindex);})
                             .select(function(row){return row.value});
	xx1 = yearindex;
	CountryData.push({x: xx1, y: yy1});
	
	yy2 = dataset_Continent[selected].where(function(row){return (row.continent == continent) && (row.yearindex == yearindex);})
                             .select(function(row){return row.value});

	ContinentData.push({x: xx1, y: yy2});
  }


  //Line chart data should be sent as an array of series objects.
  return [
    {
      values: CountryData,      //values - represents the array of {x,y} data points
      key: countryCode, //key  - the name of the series.
      color: data_colors.range()[selected]  //color - optional: choose your own line color.
    }//,
   // {
   //   values: ContinentData,
  //    key: continent,
   //   color: '#2ca02c'
   // }
  ];
}



function GenerateGraph(svg,width,height,countryCode){
    //http://bl.ocks.org/d3noob/38744a17f9c0141bcd04

// Set the ranges
var x = d3.scale.linear().range([0, width]);//.format("04d");
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10).tickFormat(d3.format("d"));
    
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(8);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x((d.year)); })
    .y(function(d) { return y((d.value));})
    .interpolate("linear");

  var country_plotdata  = [];
  var continent_plotdata  = [];
  var continent = list_Continent[countryCode];
  for (var yearindex = 0;yearindex<maxYearIndex() +1 ;yearindex++)
  {
    var datapoint = {value:-1,year:1888,valid:0}; //why we have to do that ?
    datapoint.value = dataset[selected].where(function(row){return (row.country == countryCode) 
                                                                && (row.yearindex == yearindex);})
                             .select(function(row){return row.value});
    
    datapoint.year = yearForYearIndex(yearindex).year;
    if(datapoint.value.length == 0)
    {
        datapoint.valid=0;
        datapoint.value=-1;
    }
    else
    {
        datapoint.valid=1;
        datapoint.value=datapoint.value[0];
        country_plotdata.push(datapoint);
    }
      datapoint = {value:-1,year:1888,valid:0}; //why we have to do that ?
    datapoint.year = yearForYearIndex(yearindex).year;

    datapoint.value = dataset_Continent[selected].where(function(row){return (row.continent == continent) 
                                                                && (row.yearindex == yearindex);})
                             .select(function(row){return row.value});
    

    if(datapoint.value.length == 0)
    {
        datapoint.valid=0;
        datapoint.value=-1;
    }
    else
    {
        datapoint.valid=1;
        datapoint.value=datapoint.value[0];
        continent_plotdata.push(datapoint);
    } 
       
       
    
  }
    // Scale the range of the data
    x.domain([ d3.min(continent_plotdata,function(d) { return d.year; }),d3.max(continent_plotdata,function(d) { return d.year; })]);
    y.domain([ d3.min([d3.min(country_plotdata,function(d) { return d.value;}),d3.min(continent_plotdata,function(d) { return d.value;})]),
               d3.max([d3.max(country_plotdata,function(d) { return d.value;}),d3.max(continent_plotdata,function(d) { return d.value;})])]);


    // Add the paths.
    svg.append("path")
       .attr("d", valueline(country_plotdata))
       .attr("stroke",  data_colors.range()[selected])
       .attr("stroke-width", 2)
       .attr("fill", "none");
       
    svg.append("path")
       .attr("d", valueline(continent_plotdata))
       .attr("stroke",  data_colors.range()[selected])
       .attr("stroke-width", 2)
       .attr("fill", "none")
       .style("stroke-dasharray", ("3, 3"));   

    // Add the scatterplots
    svg.selectAll("dot")
        .data(country_plotdata)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.value); });
    
    svg.selectAll("dot2")
        .data(continent_plotdata)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.value); });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

};


























//functions
var updateUIForYearNum, playFunction, pauseFunction;

var subtypes = [];
var currentSubtypeSet = null;
var subtypeChangeCounter = 0;

(function(){
	var _yearnum = null;
	updateUIForYearNum = function(yearnum) {
		_yearnum = yearnum;
		$(document).trigger("flunet-update");
	};
	$(document).on("flunet-update", function(){
		var year = yearForYearNum(_yearnum);
		$("#timelabel").text(year);
		updateMapStylesForYear(year);
        UpdateStats();
	});

	var _playTimeout = null;
	playFunction = function() {
		if (_playTimeout == null) {
			$("#play").button("option", {
				label: "pause",
				icons: {
					primary: "ui-icon-pause"
				}
			});
		}
		_playTimeout = setTimeout(playFunction, 500);
		
		updateUIForYearNum(_yearnum < years_by_index[selected].length-1 ? _yearnum+1 : 0);
	};
	pauseFunction = function() {
		if (_playTimeout != null) {
			clearTimeout(_playTimeout);
			_playTimeout = null;
			$("#play").button("option", {
				label: "play",
				icons: {
					primary: "ui-icon-play"
				}
			});
		}
	};
})();

yellINeedToLoad();

$(function(){
	$("#filename").button();
	$("#filename").change(function(e) {
		var ext = $("input#filename").val().split(".").pop().toLowerCase();
		var filename = $("input#filename").val().split(".")[0].split("\\").pop();

		if($.inArray(ext, ["json"]) == -1) {
			alert('Only JSON files are accepted');
			this.value = null;
			return false;
		}
	
		if(e.target.files != undefined) {
			var reader = new FileReader();
			reader.onload = function(e) {
				selected = subtypes.length;
				var data = $.parseJSON(e.target.result);
				console.log(dataset[selected])	;
				dataset[selected] = data.sort(function(a, b){
					if(a.year != b.year) {
						return a.year - b.year;
					}
				});
				console.log(dataset[selected])	;			
				var firstyear = dataset[selected][0].year;
				years_by_index[selected] = [];
		
				for(var i=0; i<dataset[selected].length; i++) {
					var row = dataset[selected][i];
					//console.log(row)
			
					row.yearnum = years_by_index[selected].length;
					var lastyear = (years_by_index[selected].length > 0 ? years_by_index[selected][maxYearIndex()] : null);
					if(lastyear == null || row.year != lastyear.year) {
						years_by_index[selected].push({year: row.year, yearnum: row.yearnum});
					}
					row.yearindex = maxYearIndex();
					row.scalefactors = {};
					}				
				console.log(JSON.stringify(years_by_index[selected]));
				
				subtypes.push({name: "value", prettyname: filename, color: data_colors(selected), id: selected});
				currentSubtypeSet = subtypes[selected];
				for(var i=0; i<subtypes.length; i++) {
					if(i != selected) {
						$('label[for="'+ i +'"]').css("color", data_colors(i));
						$('label[for="'+ i +'"]').css("background-color", "#eee");
					}
				}
				//Initialize dataset for continents
				dataset_Continent[selected] = [];
				for( var i=0; i<years_by_index[selected].length; i++){
				   for(var j=0; j<continents.length; j++){
					   var row = dataset_Continent[selected].push({continent: continents[j], value: -1, scalefactors:-1, year: yearForYearIndex(i).year,yearindex: i, yearnum: i+1 })
					}
				}
				//console.log(dataset_Continent);
				renormalizeData(currentSubtypeSet);
				
				var r= $('<input type="checkbox" class="datasets" id="' + selected + '" checked="checked"><label for="' + selected + '" style="background-color:' + data_colors(selected) + ';">' + filename + '</label>');
        		$("#input_data").append(r);
        		$("#" + selected).button();
				
				$(".datasets").click(function() {
					if(selected == this.id) {
						$("#"+this.id).prop("checked", true);
						return;
					}
					
					selected = this.id;
					$('label[for="'+ selected +'"]').css("color", "white");
					$('label[for="'+ selected +'"]').css("background-color", data_colors(selected));
					
					for(var i=0; i<subtypes.length; i++) {
						if(i != selected) {
							$('label[for="'+ i +'"]').css("color", data_colors(i));
							$('label[for="'+ i +'"]').css("background-color", "#eee");
							$("#"+i).prop("checked", false);
						}
					}
					
					currentSubtypeSet = subtypes[selected];
					scheduleSubtypeChangeEvent();
				});
        		
				scheduleSubtypeChangeEvent();
			};
			
			reader.readAsText(e.target.files.item(0));
	
		}

		this.value = null;
	});
	
	// Activate tooltips
	$(".country").tooltip({
		position: {
			my: "left+15 center",
			at: "right center"
		}
	});
	
	// Set up map selectors
	$("#mapradio").buttonset();
	$("#mapradio_2d").click(function() {
		   $("#globecontainer").fadeOut(1000, function() {
				   setGlobeVelocity([0, 0, 0]);
		   });
		   $("#mapcontainer").fadeIn(1000);
	});
	$("#mapradio_globe").click(function() {
		   if (!($("#globec7ontainer").is(":visible"))) setGlobeAngle([0, -30, 0]);
		   setGlobeVelocity([0.01, 0, 0]);
		   $("#mapcontainer").fadeOut(1000);
		   $("#globecontainer").fadeIn(1000);
	});
	$("#mapcontainer").fadeIn(1000);
	
	// Set up play/pause button
	$("#play").button({
		text: false,
		icons: {
			primary: "ui-icon-play"
		}
	}).click(function() {
		if ($(this).text() == "play") {
			playFunction();
		} else {
			pauseFunction();
		}
    });
	
	// Set up toolbox buttons
	$("#summarybox").dialog({
		modal: false,
		autoOpen: true,
		resizable: true,
		draggable: true,
		show: true,
		height: 178,
		width: 300,
		position: "right",
		title: "Summary",
        //remove x button
        //http://stackoverflow.com/a/7920871
        open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
	});
	$("#aboutbox").dialog({
		modal: true,
		autoOpen: false,
		resizable: false,
		draggable: false,
		show: true,
		height: 600,
		width: 800,
		position: "center",
		title: "About This Program"
	});
	$("#about").button({
		text:false,
		icons:{
			primary: "ui-icon-help"
		}
	}).click(function(event,ui){
		$("#aboutbox").dialog("open");
	});
	
	var dialogJQ = null;
	$(".country").click(function(){
		if (dialogJQ != null) dialogJQ.dialog("close");
		pauseFunction();
		
		var countryCode = d3.select(this).attr("countryCode");
		var updateChartFunction;
		dialogJQ = $("<div class='countryPopoutDialog'></div>");
		//dialogJQ.append($("<div class='xLabel'>Years</div>"));
        //dialogJQ.append($("<div class='yLabel'>"+currentSubtypeSet.prettyname+"</div>"));
		
        //set up svg fro graph
        var margin = {top: 30, right: 20, bottom: 30, left: 50},
                    width = 600 - margin.left - margin.right,
                    height = 270 - margin.top - margin.bottom;
      
        var svg = d3.select(dialogJQ.get()[0])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");
        GenerateGraph(svg,width,height,countryCode);
        

		var updateChartFunction = function() {};
  
  dialogJQ.on("dialogresize", updateChartFunction);
			$(document).bind("flunet-update", updateChartFunction);
			
			updateChartFunction();
		dialogJQ.dialog({
			title: iso_code_to_name(countryCode),
			minWidth: 850,
			minHeight: 415,
			width: 850,
			height: 415,
			close: function(event, ui) {
				$(document).unbind("flunet-update", updateChartFunction);
				dialogJQ = null;
			}
		});
	});
	
	
	/*document.addEventListener("DOMNodeInserted", function(event) {
		var node = $(event.target);
		if (node.is(".countryPopoutDialog .nvtooltip")){
			node.on("click", function(event){
				event.stopPropagation();
				event.stopImmediatePropagation();
				event.preventDefault();
				return false;
			});
		}
	});*/
		
	var _subtypeChangeCallbacks = [];
	var _subtypeChangeTriggerTimeout = null;
	var _subtypeChangeTriggerFunction = function() {
		var callbacks = _subtypeChangeCallbacks;
		_subtypeChangeCallbacks = [];
		if (_subtypeChangeTriggerTimeout != null) {
			clearTimeout(_subtypeChangeTriggerTimeout);
			_subtypeChangeTriggerTimeout = null;
		}
		
		subtypeChangeCounter++;
		yellINeedToLoad();
		$(document).on("flunet-update", function thisfunc() {
			yellImDoneLoading();
			$(document).off("flunet-update", thisfunc);
			callbacks.forEach(function(item){ item(); });
		});
		setTimeout(function(){
			$(document).trigger("flunet-update");
		}, 100);
	}
	var scheduleSubtypeChangeEvent = function(callback) {
		if (typeof(callback) != "undefined") _subtypeChangeCallbacks.push(callback);
		pauseFunction();
		if (_subtypeChangeTriggerTimeout != null) {
			clearTimeout(_subtypeChangeTriggerTimeout);
			_subtypeChangeTriggerTimeout = null;
		}
		_subtypeChangeTriggerTimeout = setTimeout(_subtypeChangeTriggerFunction, 1000);
	}
		
    	$("#mapradio_2d").trigger("click");
	
	yellImDoneLoading();
});
