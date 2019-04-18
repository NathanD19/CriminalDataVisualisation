function init() {
    d3.select("svg").remove();
    d3.csv("data/crimes_over_time.csv").then(function (data) {
        var dataset = data;
        svgChartCreate(dataset);

    }).catch(function (error) {
        alert(error);
    });



}


function svgChartCreate(dataset) {
    
    var w = 600;
    var h = 300;
    padding = 30;


}


window.onload = init;

window.onresize = init;