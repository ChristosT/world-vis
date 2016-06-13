// keep min/max global to use it with the legend of the saturation bins 
var maxPerYear=[];
var minPerYear=[];


var UpdateStats = function UpdateStats(){
    var maxPerYearCountryName=[];
    var minPerYearCountryName=[];
    var medianPerYear=[];
    maxPerYear=[];
    minPerYear=[];
    meanPerYear=[];
    
    for(i=0;i<=maxYearIndex();++i)
    {
       var A = dataset[selected].where(function(row){return row.yearindex == i;})
                             .select(function(row){return {"value":row.value, "country":row.country}});
                             
        
       var sortedA = A.sort(function(a,b){ return parseFloat(b.value)-parseFloat(a.value)});
       var countryname;
       
     
        //Max
       maxPerYear.push(sortedA[0].value);
       countryname = sortedA[0].country;
       if(iso_code_to_name(countryname).length !=0)
       {
        countryname =iso_code_to_name(countryname);
        }
       maxPerYearCountryName.push(countryname);
        
       //Min
       minPerYear.push(sortedA[sortedA.length-1].value);
       countryname = sortedA[sortedA.length-1].country;
       if(iso_code_to_name(countryname).length !=0)
       {
        countryname =iso_code_to_name(countryname);
       }
       
       minPerYearCountryName.push(countryname);
        
       
       medianPerYear.push(sortedA[parseInt(sortedA.length/2)].value);
       
       //Mean
       var sum = sortedA.sum("value");
        meanPerYear.push(sum/sortedA.length);
       
       
    }
   
    //table ="<table  class =\"sumtable\" style=\"border-spacing:0; width:60% \"  cellspacing=\"15\" align=\"center\" >"
    table ="<table  class =\"sumtable\"  >"

    table +="<tr> <th> Year </th> <th colspan = \"2\"> Max </th> <th colspan = \"2\" > Min </th>  <th> Mean  </th> <th>  Median </th> </tr>"
   
    for(i=0;i<=maxYearIndex();++i)
    {
        table+="<tr> <td style=\"padding:10px 15px 10px 0;\"> " + yearForYearIndex(i).year + " </td>  <td style=\"padding:10px 5px 10px 15px;\">" + maxPerYear[i].toFixed(2)   +"</td> <td style=\"padding:10px 15px 10px 5px;\">" + maxPerYearCountryName[i] + "</td>"
       table+="<td style=\"padding:10px 5px 10px 15px;\">" + minPerYear[i].toFixed(2)    +"</td> <td style=\"padding:10px 15px 10px 5px;\">" + minPerYearCountryName[i] + "</td> <td style=\"padding:10px 15px 10px 15px;\">" + meanPerYear[i].toFixed(2)  + "</td> <td>" + medianPerYear[i].toFixed(2)  + "</td> </tr>"
    }
    
    table+="</table>"
    document.getElementById('summarybox').innerHTML = table;  
    global_mean[selected] = meanPerYear;
}

