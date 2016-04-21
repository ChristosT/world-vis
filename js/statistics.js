
var UpdateStats = function UpdateStats(){
    var years = dataset[selected].unique("year") //TODO faster we have the years in alist now
    console.log(years);
    
    var maxPerYear=[];
    var minPerYear=[];
    var meanPerYear=[];
    var medianPerYear=[];
    
    for(i=0;i<years.length;++i)
    {
        A = dataset[selected].where(function(item){return item.year == years[i];})
                             .select(function(item){return item.value});
        maxPerYear.push(A.max());
        minPerYear.push(A.min());
        meanPerYear.push(A.mean());
        medianPerYear.push(A.median());
    }
 
   
    table ="<table style=\"width:60%\" cellspacing=\"10\" align=\"center\" >"
    table +="<tr> <td> Year </td> <td> Max </td> <td> Min </td>  <td> Mean </td> <td> Median </td> </tr>"
   
    for(i=0;i<years.length;++i)
    {
        table+="<tr> <td> " + years[i] + " </td>  <td>" + maxPerYear[i] + "</td> <td>" + minPerYear[i] + "</td> "
              +"<td>" + meanPerYear[i].toFixed(2) + "</td> <td>" + medianPerYear[i] + "</td> </tr>";
    }
    
    table+="</table>"
    document.getElementById('summarybox').innerHTML = table;   
    
}
