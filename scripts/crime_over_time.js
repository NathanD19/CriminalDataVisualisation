function init() {
    d3.select("svg").remove();
    d3.csv("data/crimes_over_time.csv", function(d) {
        return {
            time: d.time,
            count: d.count 
        }; 
   }).then(function (data) {
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

    xScale = d3.scaleTime()
        .domain([
            d3.min(dataset, function (d) { return d.time; }),
            d3.max(dataset, function (d) { return d.time; })
        ])
        .range([padding * 2, w]);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) { return d.count; })])
        .range([h - padding, 20]);

        
    var margin = { top: 20, right: 10, bottom: 20, left: 30 };


    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "svg_box");
        

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
        .attr("width", function (d) {
            return xScale(d);
        })
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
    var xAxis = d3.axisBottom()
        // .ticks(6)
        .scale(xScale);

    var yAxis = d3.axisLeft()
        // .ticks(5)
        .scale(yScale);

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
            return xScale(d[0]);
        })
        .attr("y", function (d, i) {
            return yScale(d[1]);
        })
        .attr("class", "spot_text");

    svg.append("g")
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + padding * 2 + ", 0 )")
        .call(yAxis);
}


window.onload = init;

// window.onresize = init;