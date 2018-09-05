// @TODO: YOUR CODE HERE!
//set chart
var svgWidth = 960;
var svgHeight = 500;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create SVG group, that hold the chart
var svg = d3
.select('.chart')
.append('svg')
.attr('width', svgWidth)
.attr('height', svgHeight)
.append('g')
.attr('transform', 'translate(' +margin.left + ',' + margin.top + ')');
var chart = svg.append('g');

//append a div to body to create class
d3.select(".chart").append("div").atr("class", "tooltip").style("opacity", 0);

//retrieve data from CSV
d3.csv("../../data/data.csv", function(err, healthData){
    if(err) throw err;

        healthData.forEach(function(data){
            data.pverty = +data.poverty;
            data.phys_act = +data.phys_act;
        });
    })

    //createscale
    var yScaleLinear= d3.scaleLinear().range([height,0]);
    var xScaleLinear= d3.scaleLinear().range([0,width]);

    //create axis
    var bottomAxis = d3.axisBottom(xScaleLinear);
    var leftAxis = d3.axisLeft(yScaleLinear);

    //scale define
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(healthData, function(data){
        return +data.poverty * 0.95;
    });

    xMax = d3.max(healthData,function(data){
        return +data.poverty * 1.05;
    });

    yMin = d3.min(healthData, function(data){
        return +data.phys_act * 0.98;
    });

    yMax = d3.max(healthData,function(data){
        return +data.phys_act *1.02;
    });

    xScaleLinear.domain([xMin,xMax]);
    yScaleLinear.domai([yMin,yMax]);

    //tooltip
    var tooltip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data){
            var stateName = data.state;
            var pov = +data.poverty;
            var physAct = +data.phys_acts;
            return(
                stateName + '<br> Poverty: ' + pov + pov + '% <br> Physically Active: ' + physAct + '%'
            );
        });

        // Create tooltip
    chart.call(toolTip);

    chart.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xScaleLinear(data.poverty)
        })
        .attr("cy", function(data, index) {
            return yScaleLinear(data.phys_act)
        })
        .attr("r", "15")
        .attr("fill", "lightblue")
        // display tooltip on click
        .on("mouseenter", function(data) {
            toolTip.show(data);
        })
        // hide tooltip on mouseout
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

        //append SVG group for xaxis
        chart
         .append("g")
         .attr('transform', 'translate(0, ${height})')
         .call(bottomAxis);

         //append SVG group for yaxis mnand label
         chart
         .append("g")
         .call(leftAxis);

         chart
             .append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 0-margin.left + 40)
             .attr("x", 0 - height/2)
             .attr("dy", "1em")
             .attr("class", "axis-text")
             .text("Physically Active (%)")
 
         chart
          .append("text")
          .attr(
              "transform",
              "translate(" + width / 2 + " , " + (height + margin.top + 30) + ")"
          )

          .attr("class", "axis-text")
          .text("In Poverty (%)");
        