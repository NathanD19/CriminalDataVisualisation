function init(params) {
    d3.csv("data/barchart.csv").then(function (data) {
        svgChartCreate(data);

    }).catch(function (error) {
        alert(error);
    });
}


function svgChartCreate(data) {
    // Do proper json waiting etc

    var margin = { top: 20, right: 10, bottom: 90, left: 120 };

    var width = 1100 - margin.left - margin.right;

    var height = 600 - margin.top - margin.bottom;

    var xScale = d3.scaleBand().range([0, width], .03)

    var yScale = d3.scaleLinear()
        .range([height, 0]);

    var barspacing = 7;


    var xAxis = d3.axisBottom(xScale).tickFormat(function (d) { return d.crime_type; });
    var yAxis = d3.axisLeft(yScale);

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("class", "container")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale.domain(data.map(function (d) { return d.crime_type; }));
    yScale.domain([0, d3.max(data, function (d) { return Math.ceil(parseFloat(d.value) / 100000) * 100000; })]);

    var value_total = 0;
    for (let i = 0; i < data.length; i++) {
        value_total += parseInt(data[i].value);

    }

    //X AXIS
    svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)
        .selectAll("text")
        .text(function (d) { return d; })
        .attr("class", "x_axis_text")
        .attr("transform", "translate(5,0)")
        .call(wrap, xScale.bandwidth());


    // Y AXIS
    svg.append("g")
        .attr("class", "y_axis")
        .call(yAxis)
        .append("text");


    var tooltip = d3.select("#chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);



    // Bar Chart
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return barspacing + xScale(d.crime_type); })
        .attr("width", xScale.bandwidth() - barspacing)
        .attr("y", function (d) { return yScale(d.value); })
        .attr("height", function (d) { return height - yScale(d.value); })
        .attr("fill", function (d) {
            icolor = ""
            if (d.value > (value_total / 2)) {
                color = "rgb(153, 0, 13)";
            } else if (d.value < (value_total / 2)) {
                color = "rgb(251, 106, 74)";
            }
            if (d.value < (value_total / 6)) {
                color = "rgb(254, 224, 210)";
            }
            return color;
        })

        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(250)
                .style("opacity", 1);
            tooltip.html(d.details)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(250)
                .style("opacity", 0);
        })
        .on("click", function (d, i) {
            // alert(i);
            d3.csv("data/" + i + ".csv").then(function (data) {
                var exists = true;
                try {
                    var temp = document.getElementById(details_chart);
                } catch (error) {
                    exists = false;
                }
                if (exists != false) {
                    d3.select("#details_chart").remove();
                }

                sub_chart(data, i);
                // document.getElementById("chart_two").style.border = "3px dotted #555";

                $("html, body").animate({ scrollTop: document.body.scrollHeight }, "slow");

            }).catch(function (error) {
                alert(error);
            });
        });



    svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (function (d) { return xScale(d.crime_type) + xScale.bandwidth() / 3; }))
        .attr("y", function (d) { return yScale(d.value) - 2; })
        .text(function (d) { return d.value; });


    // Legend Texts
    // X AXIS TEXT
    svg.append("text")
        .attr("class", "xtext")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("font-size", "0.9em")
        .text("Crime Type");

    // Y AXIS TEXT
    svg.append("text")
        .attr("class", "xtext")
        .attr("x", -200)
        .attr("y", -80)
        .attr("fill", "black")
        .attr("font-size", "0.9em")
        .attr("transform", "rotate(-90)")
        .attr("font-weight", "bold")
        .text("Crime Rate");


    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1,
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));

                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}




// CREATE SECOND CHART

function sub_chart(data, i) {
    var margin = { top: 20, right: 10, bottom: 90, left: 120 };

    var width = 1100 - margin.left - margin.right;

    var height = 600 - margin.top - margin.bottom;

    var xScale = d3.scaleBand().range([0, width], .03)

    var yScale = d3.scaleLinear()
        .range([height, 0]);

    var barspacing = 7;


    var xAxis = d3.axisBottom(xScale).tickFormat(function (d) { return d.crime_type; });
    var yAxis = d3.axisLeft(yScale);

    var svg = d3.select("#chart_two").append("svg")
        .attr("id", "details_chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("class", "container")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale.domain(data.map(function (d) { return d.crime_type; }));
    yScale.domain([0, d3.max(data, function (d) { return Math.ceil(parseFloat(d.value) / 100000) * 100000; })]);


    var value_total = 0;
    for (let i = 0; i < data.length; i++) {
        value_total += parseInt(data[i].value);

    }

    //X AXIS
    svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)
        .selectAll("text")
        .text(function (d) { return d; })
        .attr("class", "x_axis_text")
        .attr("transform", "translate(5,0)")
        .call(wrap, xScale.bandwidth());


    // Y AXIS
    svg.append("g")
        .attr("class", "y_axis")
        .call(yAxis)
        .append("text");


    var tooltip = d3.select("#chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);



    // Bar Chart
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return barspacing + xScale(d.crime_type); })
        .attr("width", xScale.bandwidth() - barspacing)
        .attr("y", function (d) { return yScale(d.value); })
        .attr("height", function (d) { return height - yScale(d.value); })
        .attr("fill", function (d) {
            color = ""
            if (d.value > (value_total / 2)) {
                color = "rgb(153, 0, 13)";
            } else if (d.value < (value_total / 2)) {
                color = "rgb(251, 106, 74)";
            }
            if (d.value < (value_total / 6)) {
                color = "rgb(254, 224, 210)";
            }
            return color;
        })
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(250)
                .style("opacity", 1);
            tooltip.html(d.details)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(250)
                .style("opacity", 0);
        });



    svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (function (d) { return xScale(d.crime_type) + xScale.bandwidth() / 3; }))
        .attr("y", function (d) { return yScale(d.value) - 2; })
        .text(function (d) { return d.value; });


    // Legend Texts
    //Header
    var title;
    switch (i) {
        case 0:
            title = "Crimes against the person"
            break;
        case 1:
            title = "Property and deception offences"
            break;
        case 2:
            title = "Drug offences"
            break;
        case 3:
            title = "Public order and security offences"
            break;
        case 4:
            title = "Justice procedures offences"
            break;
        case 5:
            title = "Other offences"
            break;
        default:
            title = ""
            break;
    }

    svg.append("text")
        .attr("class", "headertext")
        .attr("x", width / 2.5)
        .attr("y", 0)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("font-size", "1.5em")
        .text(title);

    // X AXIS TEXT
    svg.append("text")
        .attr("class", "xtext")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("font-size", "0.9em")
        .text("Crime Type");

    // Y AXIS TEXT
    svg.append("text")
        .attr("class", "xtext")
        .attr("x", -200)
        .attr("y", -80)
        .attr("fill", "black")
        .attr("font-size", "0.9em")
        .attr("transform", "rotate(-90)")
        .attr("font-weight", "bold")
        .text("Crime Rate");

    svg.append("text")
        .attr("class", "xtext")
        .attr("x", -100)
        .attr("y", height + 80)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("font-size", "1em")
        .text("Hover over a bar to see more information on crime subgroups!");



    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1,
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));

                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}


window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

function topFunction() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
}


window.onload = init;