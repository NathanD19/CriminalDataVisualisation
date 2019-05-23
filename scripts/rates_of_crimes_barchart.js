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

    var height = 520 - margin.top - margin.bottom;

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


    //X AXIS
    svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)
        .selectAll("text")
        .text(function (d) { return d; });


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
            if (d.value > 1500000) {
                return "red";
            } else if (d.value > 100000) {
                return "orange";
            }
            return "yellow";
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
    // X AXIS TEXT
    svg.append("text")
        .attr("class", "xtext")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("font-size", "0.9em")
        .text("Crime Type");

    // Y AXIS TEXT
    svg.append("text")
        .attr("class", "xtext")
        .attr("x", -200)
        .attr("y", -70)
        .attr("fill", "black")
        .attr("font-size", "0.9em")
        .attr("transform", "rotate(-90)")
        .attr("font-weight", "bold")
        .text("Crime Rate");
}

window.onload = init;