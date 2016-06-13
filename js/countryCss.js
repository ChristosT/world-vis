// countryCss.js

// determines appropriate bin for each country
/*
    keep in mind that :
    The number of discriminable steps for saturation
    is low: around three bins [Ware 13].
    Moreover, saturation interacts strongly with the size channel:
    it is more difficult to perceive in small regions than in large ones.
    Point and line marks typically occupy small regions, so using just
    two different saturation levels is safer in these cases.
    source Visualization Analysis and Design, Tamara Munzner, AK Peters/CRC Press 2014
*/
function SelectBin(value) {
// we use 3 bins [0,0.3),[0.3,0.6),[0.6,1] and the median of each as representative
                             
    if(value<0.3) return 0.15;
    if(value<0.6) return 0.45;
    return 0.8;
}

//Get min/max for each bin for the current dataset
//uses min/maxPerYear from statistics.js 
function BinBoundaries(binId) {
    var range = maxPerYear[currentYearIndex +1] -minPerYear[currentYearIndex +1];                      
    switch(binId) {
        case 0:
            return [minPerYear[currentYearIndex +1],minPerYear[currentYearIndex +1] + 0.3*range];
        case 1:
            return [minPerYear[currentYearIndex +1] + 0.3*range,minPerYear[currentYearIndex +1]+0.6*range];
        case 2:
            return [ minPerYear[currentYearIndex +1] +0.6*range, maxPerYear[currentYearIndex +1]];
        default:
            console.log("Invalid binId");
            return [];
    }
            
}

    
var countryColorRules = [];
function colorCountry(countryName, color) {
	var countrySelector = "." + countryName.replace(/ /g, "_");
	var countryStyle = $("<style type='text/css'>" + countrySelector + " { fill: " + color + " !important; }</style>");
	countryStyle.appendTo("head");
	countryColorRules.push(countryStyle);
}

function clearCountryColors() {
	while (countryColorRules.length > 0) {
		var styleElement = countryColorRules.pop();
		styleElement.remove();
	}
}

var updateMapStylesForYear = function (year) {
	if(continent_selected == 0)
	{
	var colorFunc = function(row) {
		var fillcolor = $.Color("#FFFFFF");
		var subtype = currentSubtypeSet;

		var scalefactor = (subtype.name in row.scalefactors ? row.scalefactors[subtype.name] : 1.0);

		var value_normalized = SelectBin(row[subtype.name] * scalefactor);

		var tintcolor = $.Color("transparent").transition($.Color(subtype.color), value_normalized);
	    var color = Color_mixer.mix(tintcolor, fillcolor);
		return color;
		
	};
	clearCountryColors();
	
	$.each(dataset[selected].where(function (row) {
		return row.year == year; 
		}), function (index, row) {
		colorCountry(row.country, colorFunc(row).toHexString());
		});
	}
	else
	{	clearCountryColors();
		var scalefactor = dataset_Continent[selected][0].scalefactors;

		for(var country in list_Continent)
		{
		
       
            var fillcolor = $.Color("#FFFFFF");
            var subtype = currentSubtypeSet;
            var tempcontinent = list_Continent[country];
            
            var output = dataset_Continent[selected].where(function(row){return (row.year == year) && (row.continent == tempcontinent) })
                                                    .select(function(row){ return [row.value,row.valid]}) ;
            if(output[1]==0)
                 continue;
                
            var value_normalized = SelectBin(output[0]*scalefactor);
        
            var tintcolor = $.Color("transparent").transition($.Color(subtype.color), value_normalized);
            var color = Color_mixer.mix(tintcolor,fillcolor);
  			colorCountry(country, color.toHexString());
		}
		
		
	}//else
};
