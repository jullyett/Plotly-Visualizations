function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;

  d3.json(url).then(function(data) {
 
  // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");
    //d3.select("#sample-metadata").node().value = "";

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  
      Object.entries(data).forEach(([key, value]) => {
        var row = panel.append("p");
        row.text([`${key} : ${value}`]);
     
    });

});    
}

buildMetadata();

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
   /* data route */
  var url = "/samples/" + sample;

    // @TODO: Build a Bubble Chart using the sample data
  console.log("url", url);
  console.log("sample: ", sample);

  d3.json(url).then(function(data_bubble) {
    console.log(data_bubble);
    
    var x_values = data_bubble.otu_ids;
    var y_values = data_bubble.sample_values;
    var labels = data_bubble.otu_labels;

    var trace1 = {
      x: x_values,
      y: y_values,
      text: labels,
      mode: 'markers',
      marker: {
        size: y_values,
        color: x_values
      }
    };
    
    var data = [trace1];
    
    var layout = {
      showlegend: false,
      height: 500,
      width: 1200,
      xaxis: { title: "OTU ID" }
    };
    
    Plotly.newPlot('bubble', data, layout);

  });   
  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  d3.json(url).then(function(data_pie) {
    console.log(data_pie);

    var pie_values = data_pie.sample_values.slice(0, 10);
    var pie_labels = data_pie.otu_ids.slice(0, 10);
    var pie_hover = data_pie.otu_labels.slice(0, 10);

    var data = [{
      values: pie_values,
      labels: pie_labels,
      hovertext: pie_hover,
      type: 'pie',
    }];
    
    var layout = {
      height: 500,
      width: 500
    };
    
    Plotly.newPlot('pie', data, layout);

  });
}

buildCharts();

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
