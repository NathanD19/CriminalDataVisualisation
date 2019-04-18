function init() {
    d3.select("svg").remove();
    d3.csv("data/barchart.csv").then(function (data) {
        var dataset = data;
        svgChartCreate(dataset);

    }).catch(function (error) {
        alert(error);
    });

    svgChartCreate(dataset);

}

function svgChartCreate(dataset) {
    var w = window.innerWidth - 150;
    var h = 350;

    var barspacing = 4;

    var margin = { top: 20, right: 10, bottom: 20, left: 30 };

    //import required data


    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([5, w])
        .paddingInner(0.10);

    var yScale = d3.scaleBand()
        .domain(d3.range(d3.max(dataset) + 1))
        .range([0, h]);

    //reversed for scale
    var yScaleAxis = d3.scaleBand()
        .domain(d3.range(d3.max(dataset) + 1))
        .range([h, 0]);

    //svg box
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "svg_box");

    // bar chart code
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(i);
        })
        .attr("y", function (d, i) {
            //return h - d*3;
            return h - yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            //return yScale.bandwidth()+h;
            return yScale(d);
        })
        .attr("fill", "rgb(92, 143, 170)")
        .on("mouseover", function (d) {
            // hover effects
            var xPosition = parseFloat(d3.select(this).attr("x"));
            var yPosition = parseFloat(d3.select(this).attr("y"));

            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition + ((w / window.innerWidth) + 10))
                .attr("y", yPosition + 20)
                .text(d)
                .style("font-weight", "bold");

            d3.select(this)
                .transition()
                .attr("fill", "lightgrey")
                .duration(150);
        })
        .on("mouseout", function (d) {

            d3.select("#tooltip").remove();

            d3.select(this)
                .transition()
                .attr("fill", "rgb(92, 143, 170)")
                .duration(150);
        });




    // Axis Code
    padding = 0;

    var xAxis = d3.axisBottom()
        .scale(xScale);

    var yAxis = d3.axisLeft()
        .tickValues(d3.range(0, 3000000, 50000))
        .scale(yScaleAxis);

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
            return xScale(d[0]);
        })
        .attr("y", function (d, i) {
            return yScaleAxis(d[1]);
        })
        .attr("class", "spot_text");

    svg.append("g")
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .call(xAxis);


    svg.append("g")
        .attr("transform", "translate(" + 5 + ", 0 )")
        .call(yAxis);
}


window.onload = init;

window.onresize = init;