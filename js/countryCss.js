// countryCss.js
// determines appropriate color for each country

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
		var tints = [];
		var subtype = currentSubtypeSet;

		var scalefactor = (subtype.name in row.scalefactors ? row.scalefactors[subtype.name] : 1.0);
		//var scalefactor = (subtype.name in row.continent_scalefactors ? row.continent_scalefactors[subtype.name] : 1.0);
		//dataset[selected][index].continent_avg[subtypeSet.name]
		var value_normalized = (row[subtype.name] * scalefactor);
		//var value_normalized = (row.continent_avg.value * scalefactor);
	
		//console.log(scalefactor);
		var tintcolor = $.Color("transparent").transition($.Color(subtype.color), value_normalized);
		tints.push({
			color: tintcolor,
			valueNormalized: value_normalized
		});
		
		var totalTintValues = fold(function(acc, item) { return acc + item.valueNormalized; }, 0, tints);
		if (totalTintValues == 0) return fillcolor;

		var finalMix = [];
		tints.forEach(function(tint){
			var thisalpha = tint.valueNormalized / totalTintValues;
			var mixedcolor = Color_mixer.mix(tint.color, fillcolor).alpha(thisalpha);
			finalMix.push(mixedcolor);
		});
		return Color_mixer.mix(finalMix);
		
	};
	clearCountryColors();
	
	$.each(dataset[selected].where(function (row) {
		return row.year == year;  //this selects obnly the countries that have a valu change it for the continent option
		}), function (index, row) {
		colorCountry(row.country, colorFunc(row).toHexString());
		});
	}
	else
	{	clearCountryColors();
		var scalefactor = dataset_Continent[selected][0].scalefactors;

		for(var country in list_Continent)
		{
			//var colorFunc = function(country,year) {
			var fillcolor = $.Color("#FFFFFF");
			var tints = [];
			var subtype = currentSubtypeSet;

			//var scalefactor = (subtype.name in row.scalefactors ? row.scalefactors[subtype.name] : 1.0);
			//var scalefactor = (subtype.name in row.continent_scalefactors ? row.continent_scalefactors[subtype.name] : 1.0);
			//dataset[selected][index].continent_avg[subtypeSet.name]
			var tempcontinent = list_Continent[country];
			
			
			var value_normalized = dataset_Continent[selected].where(function(row){return (row.year == year) && (row.continent == tempcontinent) })
															.select(function(row){ return row.value}) ;
			value_normalized*=scalefactor;
		
			
			var tintcolor = $.Color("transparent").transition($.Color(subtype.color), value_normalized);
			tints.push({
				color: tintcolor,
				valueNormalized: value_normalized
			});
			
			var totalTintValues = fold(function(acc, item) { return acc + item.valueNormalized; }, 0, tints);
			if (totalTintValues == 0) return fillcolor;

			var finalMix = [];
			tints.forEach(function(tint){
				var thisalpha = tint.valueNormalized / totalTintValues;
				var mixedcolor = Color_mixer.mix(tint.color, fillcolor).alpha(thisalpha);
				finalMix.push(mixedcolor);
			});
			
			var countrycolor = Color_mixer.mix(finalMix);
			colorCountry(country, countrycolor.toHexString());
		}
		
		
	}//else
};
