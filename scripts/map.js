function init() {
    geomap();
}

function geomap() {

    var w = 900;
    var h = 600;
    var dataset;

    var projection = d3.geoMercator()
        .center([145, -36.5])
        .translate([w / 2, h / 2])
        .scale(5000);

    var path = d3.geoPath().projection(projection);
    //["#d3efff","#99d6ff", "#4db8ff", "#008ae6", "#005c99"]
    var color = d3.scaleQuantile().range(["#d3efff","#4db8ff","#005c99"]);

    //var color = d3.scaleLinear().range(["Orange", "Red"]).interpolate(d3.interpolateLab);
  
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    d3.csv("data/LGA-data-2017.csv").then(function (data) {

        console.log(data)
        color.domain([d3.min(data, function (d) { return d.unemployed; }),
        d3.max(data, function (d) { return d.unemployed; })
        ]);

        d3.json("data/LGA_VIC.json").then(function (json) {
            console.log(json)
            for (var i = 0; i < data.length; i++) {
                var dataState = data[i].LGA;

                var dataValue = parseFloat(data[i].unemployed);

                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.LGA_name;

                    if (dataState == jsonState) {
                        json.features[j].properties.value = dataValue;
                        break;
                    }
                }
            }

            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("stroke-width", 1.25)
                .attr("d", path)
                .style("fill", function (d) {
                    //get data
                    var value = d.properties.value;

                    if (value) {
                        return color(value);
                    } else {
                        return "#ccc"
                    }
                });
        }).catch(function (error) {
            alert(error);
        });


    }).catch(function (error) {
        alert(error);
    });

}



window.onload = init;


