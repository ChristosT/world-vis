function compareNumbers(a, b) {
  return a - b;
}
var UpdateStats = function UpdateStats(){
    var Final_weeks = flunet.where(function (item){return (item.week == 52 && item.year==2011) ;}) // the filter is arbitary, 
                            .select(function(item){return Number(item.num_total)})
                                
    var sum = Final_weeks.reduce(function(a,b) {return a+b ;});
    var Mean = sum/Final_weeks.length;
    var Median = Final_weeks.sort(compareNumbers)[Final_weeks.length/2] 
    console.log(Final_weeks);
    console.log("MAX " + Final_weeks.max());
    console.log("MIN " + Final_weeks.min());
    console.log("Mean " + Mean);
    console.log("Median " + Median);
    document.getElementById('MAX').innerHTML = Final_weeks.max()
    document.getElementById('MIN').innerHTML = Final_weeks.min()
    document.getElementById('MEAN').innerHTML = Mean.toFixed(3)
    document.getElementById('MEDIAN').innerHTML = Median

}
