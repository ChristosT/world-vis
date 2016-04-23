
var UpdateStats = function UpdateStats(){
    
    var maxPerYear=[];
    var minPerYear=[];
    var meanPerYear=[];
    var medianPerYear=[];
    
    for(i=0;i<=maxYearIndex();++i)
    {
        A = dataset[selected].where(function(row){return row.yearindex == i;})
                             .select(function(row){return row.value});
        maxPerYear.push(A.max());
        minPerYear.push(A.min());
        meanPerYear.push(A.mean());
        medianPerYear.push(A.median());
    }
   
    table ="<table style=\"width:60%\" cellspacing=\"10\" align=\"center\" >"
    table +="<tr> <td> Year </td> <td> Max </td> <td> Min </td>  <td> Mean </td> <td> Median </td> </tr>"
   
    for(i=0;i<=maxYearIndex();++i)
    {
        table+="<tr> <td> " + yearForYearIndex(i).year + " </td>  <td>" + maxPerYear[i].toFixed(2)  + "</td> <td>" + minPerYear[i].toFixed(2)  + "</td> "
              +"<td>" + meanPerYear[i].toFixed(2) + "</td> <td>" + medianPerYear[i].toFixed(2)  + "</td> </tr>";
    }
    
    table+="</table>"
    document.getElementById('summarybox').innerHTML = table;   
    
}
