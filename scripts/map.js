function init() {
    document.getElementById("date_select").value = __counter__;
    geomap("data/LGA-data-" + __counter__ + ".csv");
}

function geomap(crimedata) {

    var w = 900;
    var h = 600;
    var dataset;

    var projection = d3.geoMercator()
        .center([145, -36.5])
        .translate([w / 2.5, h / 2])
        .scale(5000);

    var path = d3.geoPath().projection(projection);
    //["#d3efff","#99d6ff", "#4db8ff", "#008ae6", "#005c99"]
    //["#d3efff", "#4db8ff", "#005c99"]
    //var color = d3.scaleThreshold().range(d3.schemeBlues[9]);

    //var color = d3.scaleLinear().range(["Orange", "Red"]).interpolate(d3.interpolateLab);

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var tooltip = d3.select("#chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', zoomed);

    svg.call(zoom);


    function zoomed() {
        svg.selectAll('path').attr('transform', d3.event.transform);
    }



    d3.csv(crimedata).then(function (data) {

        console.log(data);
        var color = d3.scaleThreshold()
            .domain([
                0,
                4000,
                8000,
                12000,
                16000,
                20000,
                24000,
                d3.max(data, function (d) { return d.crimes; })
            ])
            .range(d3.schemeReds[8]);

        legend_labels = ["< 4000", "4000 - 8000", "8000 - 12000", "12000 - 16000", "16000 - 20000", "20000 - 24000", "24000 >"];

        var legend = svg.selectAll(".map-legend")
            .data([0, 4000, 8000, 12000, 16000, 20000, 24000])
            .enter().append("g")
            .attr("class", "legend");

        var ls_w = 20, ls_h = 20;

        legend.append("rect")
            .attr("x", w / 1.3)
            .attr("y", function (d, i) { return 250 - (i * ls_h) - 2 * ls_h; })
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function (d, i) { return color(d); });


        legend.append("text")
            .attr("x", w / 1.3)
            .attr("y", 70)
            .text("Legend: Crimes");

        svg.append("text")
            .attr("x", w / 1.25)
            .attr("y", h / 2.35)
            .attr("id","undefined")
            .attr("font-weight", "normal")
            .text("Undefined");

        legend.append("rect")
            .attr("x", w / 1.3)
            .attr("y", h / 2.5)
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", "#ccc");


        legend.append("text")
            .attr("x", w / 1.25)
            .attr("y", function (d, i) { return 250 - (i * ls_h) - ls_h - 4; })
            .text(function (d, i) { return legend_labels[i]; });





        d3.json("data/LGA_VIC.json").then(function (json) {
            console.log(json)
            for (var i = 0; i < data.length; i++) {
                var dataState = data[i].LGA;

                var dataValue = parseFloat(data[i].crimes);

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
                .attr("stroke-width", 0.5)
                .attr("d", path)
                .on("mouseover", function (d) {
                    tooltip.transition()
                        .duration(250)
                        .style("opacity", 1);
                    tooltip.html(d.properties.LGA_name + "<br>Crimes: " + d.properties.value)
                        .style("left", (d3.event.pageX + 15) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(250)
                        .style("opacity", 0);
                })
                .style("fill", function (d) {
                    //get data
                    var value = d.properties.value;

                    if (value) {
                        return color(value);
                    } else {
                        return "#ccc"
                    }
                })

            $("#reset").click(() => {
                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity);
            });

        }).catch(function (error) {
            alert(error);
        });

    }).catch(function (error) {
        alert(error);
    });

}

function UpdateMap() {

    d3.select("svg").remove();
    __counter__ = document.getElementById("date_select").value
    geomap("data/LGA-data-" + __counter__ + ".csv");

}

__counter__ = 2016;

window.onload = init;




// Legacy Functions

function ChangePrev() {
    __counter__ -= 1;
    if (__counter__ == 2008) {
        __counter__ += 1;
        alert("Minimum dataset is 2009");
    } else {
        d3.select("svg").remove();
        document.getElementById('year').innerHTML = __counter__;
        geomap("data/LGA-data-" + __counter__ + ".csv");
    }
}


function ChangeNext() {
    __counter__ += 1;
    if (__counter__ == 2019) {
        __counter__ -= 1;
        alert("Maximum dataset is 2018");
    } else {
        d3.select("svg").remove();
        document.getElementById('year').innerHTML = __counter__;
        geomap("data/LGA-data-" + __counter__ + ".csv");
    }
}
