(function(){
  var margin = { top: 30, right: 80, bottom: 30, left: 80 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.temperature); });

  var svg = d3.select('#data').append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data/data-annual.csv", function(error, data) {
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== 'Year';
    }));

    var areas = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return { year: d.Year, temperature: +d[name]};
        }),
      }
    });

    x.domain(d3.extent(data, function(d) {
      return d.Year;
    }));

    y.domain([
      d3.min(areas, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
      d3.max(areas, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
    ]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year (1880 - 2014)");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Average Temperature (ºF)");

    /*
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - 5)
      .attr('x', 0 - ( height / 2))
      .attr('dy', '-3em')
      .text('Average Temperature ( ºF )');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom)
      .style('text-anchor', 'middle')
      .text('Year');
    */

    var area = svg.selectAll(".area")
      .data(areas)
      .enter().append("g")
      .attr("class", "area");

    area.append("path")
      .attr("class", "line")
      .attr("d", function(d) { console.log(d.values); return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });
    /*
    area.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
    */

    /* Legend */

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr('y', height - margin.bottom * 4)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr('y', height - margin.bottom * 4 + 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

  });
})();
