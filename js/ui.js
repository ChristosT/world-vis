// ui.js
// main UI components, including timeline slider and country pop-up


var data_colors = d3.scale.category10();
//functions
var updateUIForYearNum, playFunction, pauseFunction;

var subtypes = [];
var currentSubtypeSet = null;
var subtypeChangeCounter = 0;
var currentYearIndex =0;
function GenerateGraph(dialogJQ,svg,width,height,countryCode,dataset_index) {
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
	var datapoint;
	for (var yearindex = 0;yearindex<= years_by_index[dataset_index].length;yearindex++)
	{
    	datapoint =  {value:-1,year:1888};
   		datapoint.value = dataset[dataset_index].where(function(row){return (row.country == countryCode) && (row.yearindex == yearindex);})
			                               .select(function(row){return row.value});
    
	    

	    if(datapoint.value.length != 0)
	    {
       		datapoint.value=datapoint.value[0];
	        datapoint.year = years_by_index[dataset_index][yearindex].year;
	        country_plotdata.push(datapoint);
	    }

	    datapoint =  {value:-1,year:1888};
	    datapoint.value = dataset_Continent[dataset_index].where(function(row){return (row.continent == continent) && (row.yearindex == yearindex) &&(row.valid==1);})
       							                     .select(function(row){return row.value});
    

    
	    if(datapoint.value.length != 0)
	    {
       		datapoint.value=datapoint.value[0];
	        datapoint.year = years_by_index[dataset_index][yearindex].year;
	        continent_plotdata.push(datapoint);
   		} 
	}

    // Scale the range of the data
    maxYear = -1*Number.MAX_VALUE;
    minYear =    Number.MAX_VALUE;
    for(var i=0;i<number_of_loaded_datasets;i++)
    {
        if(years_by_index[i][0].year<minYear)
        {
            minYear = years_by_index[i][0].year;
        }
   
        if(years_by_index[i].slice(-1)[0].year>maxYear)
        {
            maxYear = years_by_index[i].slice(-1)[0].year;
        }
    }

	
    x.domain([ minYear -1,maxYear+1]); 

    var country_ymin   =  d3.min(country_plotdata,function(d) {return d.value;});
    var country_ymax   =  d3.max(country_plotdata,function(d) {return d.value;});
    var continent_ymin =  d3.min([country_ymin,d3.min(continent_plotdata,function(d) { return d.value;})]);
    var continent_ymax =  d3.max([country_ymax,d3.max(continent_plotdata,function(d) { return d.value;})]);
    y.domain([ continent_ymin - 0.5,continent_ymax +0.5]);
   
dialogJQ.find("#continent_checkbox").button();
dialogJQ.find("#continent_checkbox").on("change", function() {
	if(this.checked) {	
    	y.domain([ continent_ymin - 0.5,continent_ymax +0.5]);
        svg.selectAll(".y.axis").transition().duration(300).call(yAxis);
        svg.selectAll(".dot").transition().duration(300).attr("cy", function(d) { return y(d.value); })
		svg.selectAll(".line").transition().duration(300).attr("d", valueline(country_plotdata))
		svg.selectAll(".dot2").transition().duration(300).attr("r", 3.5);
		svg.selectAll(".line2").transition().duration(300).attr("stroke-width", 2);

	} else {
	
    	y.domain([country_ymin -0.5,country_ymax +0.5]);
        svg.selectAll(".y.axis").transition().duration(300).call(yAxis);
        svg.selectAll(".dot").transition().duration(300).attr("cy", function(d) { return y(d.value); })
		svg.selectAll(".line").transition().duration(300).attr("d", valueline(country_plotdata))
		svg.selectAll(".dot2").transition().duration(300).attr("r", 0);
		svg.selectAll(".line2").transition().duration(300).attr("stroke-width", 0);
	}
});
	
    // Add the paths.
    svg.append("path")
       .attr("d", valueline(country_plotdata))
	   .attr("class", "line")
       .attr("stroke",  data_colors.range()[dataset_index])
       .attr("stroke-width", 2)
       .attr("fill", "none");
      

    svg.append("path")
       .attr("d", valueline(continent_plotdata))
	   .attr("class", "line2")
       .attr("stroke",  data_colors.range()[dataset_index])
       .attr("stroke-width", 2)
       .attr("fill", "none")
       .style("stroke-dasharray", ("3, 3"));   

    
    // Add the scatterplots
    svg.selectAll("dot")
        .data(country_plotdata)
        .enter().append("circle")
		.attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.value); })
        .on("mouseover",function(d){
             svg.append("rect")
                .attr("id","tooltip2")
                .style("position", "absolute")
                .attr("x", function() { 
                                         if (x(d.year)<350)
                                         {  
                                               return x(d.year) -12
                                         }
                                         else{
                                               return x(d.year) -170
                                         }
                                       })
                .attr("y", y(d.value) + 10)
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("width", 200)
                .attr("height", 25)
                .style("fill","#999999")  
         
            svg.append("text")
               .attr("id","tooltip")
               .style("position", "absolute")
                .attr("x", function() { 
                                         if (x(d.year)<350)
                                         {  
                                               return x(d.year) -5
                                         }
                                         else{
                                               return x(d.year) -160
                                         }
                                       })
               .attr("y", y(d.value) +25)
               .text("["+ "Value:"+ (d.value).toFixed(2)  +","+"Year:"+d.year+ "]")
        })
        .on("mouseout", function() {d3.select("#tooltip").remove(), d3.select("#tooltip2").remove()}) ;  
    

    svg.selectAll("dot2")
        .data(continent_plotdata)
        .enter().append("circle")
		.attr("class", "dot2")
		.attr("fill", "grey")
		.attr("stroke", "grey")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.value); })
        .on("mouseover",function(d){
             svg.append("rect")
                .attr("id","tooltip2")
                .style("position", "absolute")
                .attr("x", function() { 
                                         if (x(d.year)<350)
                                         {  
                                               return x(d.year) -12
                                         }
                                         else{
                                               return x(d.year) -170
                                         }
                                       })
                .attr("y", y(d.value) + 10)
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("width", 200)
                .attr("height", 25)
                .attr("font-size", 14)
                .style("fill","#999999")  
         
            svg.append("text")
               .attr("id","tooltip")
               .style("position", "absolute")
                .attr("x", function() { 
                                         if (x(d.year)<350)
                                         {  
                                               return x(d.year) -5
                                         }
                                         else{
                                               return x(d.year) -160
                                         }
                                       })
               .attr("y", y(d.value) +25)
               .text("["+ "Value:"+ (d.value).toFixed(2)  +","+"Year:"+d.year+ "]")
        })
        .on("mouseout", function() {d3.select("#tooltip").remove(), d3.select("#tooltip2").remove()}) ;  

	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width/2)
      .attr("y", 40)
      .style("text-anchor", "middle")
	  .style("font-weight","bold")
	  .style("font-size","14px")
      .text("Year");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
	  .attr("y", -50)
	  .attr("x", -height/2)
      .attr("dy", "-.11em")
      .style("text-anchor", "middle")
	  .style("font-weight","bold")
	  .style("font-size","12px")
      .text(subtypes[dataset_index].prettyname);
	  

};




(function(){
	var _yearnum = null;
	updateUIForYearNum = function(yearnum) {
		_yearnum = yearnum;
		currentYearIndex = yearnum-1;
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
				
				dataset[selected] = data.sort(function(a, b){
					if(a.year != b.year) {
						return a.year - b.year;
					}
				});
						
				var firstyear = dataset[selected][0].year;
				years_by_index[selected] = [];
		
				for(var i=0; i<dataset[selected].length; i++) {
					var row = dataset[selected][i];

			
					row.yearnum = years_by_index[selected].length;
					var lastyear = (years_by_index[selected].length > 0 ? years_by_index[selected][maxYearIndex()] : null);
					if(lastyear == null || row.year != lastyear.year) {
						years_by_index[selected].push({year: row.year, yearnum: row.yearnum});
					}
					row.yearindex = maxYearIndex();
					row.scalefactors = {};
					}				
				//console.log(JSON.stringify(years_by_index[selected]));
				
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
				for( var i=0; i<=maxYearIndex(); i++){
				   for(var j=0; j<continents.length; j++){
					   var row = dataset_Continent[selected].push({continent: continents[j], value: -1, scalefactors:-1, year: yearForYearIndex(i).year,yearindex: i, yearnum: i+1, valid:0 })
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
	
    		number_of_loaded_datasets++;
		}

		this.value = null;
	});

	$("#continent_radio").buttonset();
	$("#country").click(function() {
		
		  continent_selected=0;
		  updateMapStylesForYear(yearForYearIndex(currentYearIndex).year);
		
		  // $("#globecontainer").fadeOut(1000, function() {
				   //setGlobeVelocity([0, 0, 0]);
		   //});
		   //$("#mapcontainer").fadeIn(1000);
	});
	$("#continent").click(function() {
		
		 continent_selected=1;
		 console.log(yearForYearIndex(currentYearIndex));
		 updateMapStylesForYear(yearForYearIndex(currentYearIndex).year);
		   //if (!($("#globec7ontainer").is(":visible"))) setGlobeAngle([0, -30, 0]);
		  // setGlobeVelocity([0.01, 0, 0]);
		  // $("#mapcontainer").fadeOut(1000);
		  // $("#globecontainer").fadeIn(1000);
	});
	//$("#mapcontainer").fadeIn(1000);
	
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
		dialogClass: "summary_dialog",
		modal: false,
		autoOpen: true,
		resizable: true,
		draggable: true,
		show: true,
		height: 178,
		width: 300,
		title: "Summary",
        position:"right,top",
        //remove x button
        //http://stackoverflow.com/a/7920871
        open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
	});
	$(".summary_dialog").children(".ui-dialog-titlebar").append("<span id='summary_toggle' class='ui-icon ui-icon-circle-minus' style='display:inline-block;float:right;cursor:pointer;'></span>");
	$("#summary_toggle").click(function() {
		if($(this).hasClass("ui-icon-circle-minus")) {
			$("#summarybox").hide();
			$(".summary_dialog").height(32);
			$(this).removeClass("ui-icon-circle-minus").addClass("ui-icon-circle-plus");
		} else {
			$("#summarybox").show();
			$(".summary_dialog").height($("#summarybox").height() +50);
			$(this).removeClass("ui-icon-circle-plus").addClass("ui-icon-circle-minus");
		}
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
		text:true
	}).click(function(event,ui){
		$("#aboutbox").dialog("open");
	});
	
	var dialogJQ = null;
	$(".country").click(function(){
		if (dialogJQ != null) dialogJQ.dialog("close");
		pauseFunction();
		
		var countryCode = d3.select(this).attr("countryCode");
		var updateChartFunction;
		dialogJQ = $("<div class='countryPopoutDialog' id='graphdialog'></div>");
		//dialogJQ.append($("<div class='xLabel'>Years</div>"));
        //dialogJQ.append($("<div class='yLabel'>"+currentSubtypeSet.prettyname+"</div>"));
		
	var continent_checkbox = $("<input type='checkbox' id='continent_checkbox' checked><label for='continent_checkbox'> Show continent average</label>");
		dialogJQ.prepend(continent_checkbox);
        //set up svg for graph
        var margin = {top: 30, right: 20, bottom: 50, left: 70},
                    width = 750 - margin.left - margin.right,
                    height = 315 - margin.top - margin.bottom;
      
        //Create a svg array 
        var svgs = new Array(number_of_loaded_datasets);
        
       //set up continent checkbox only once.
        //Generate first the graph for the selected datasets.
        svgs[0] = d3.select(dialogJQ.get()[0])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");
         
        GenerateGraph(dialogJQ,svgs[0],width,height,countryCode,selected);
        for(var j=0;j<number_of_loaded_datasets;j++)
        {
            if(j==selected)
                continue;


            svgs[j] = d3.select(dialogJQ.get()[0])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");
            GenerateGraph(dialogJQ,svgs[j],width,height,countryCode,j);
       } 
/*
		var updateChartFunction = function() {};
  
 // dialogJQ.on("dialogresize", updateChartFunction);
		//	$(document).bind("flunet-update", updateChartFunction);
			
		//	updateChartFunction();
		*/
		dialogJQ.dialog({
		    resizable: true,
		    draggable: true,
            modal:true,
			title: iso_code_to_name(countryCode),
			minWidth: 850,
			minHeight: 415,
			width: 850,
			height: 415,
			close: function(event, ui) {
				//$(document).unbind("flunet-update", updateChartFunction);
                dialogJQ.find("#continent_checkbox").removeAttr("id");
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
