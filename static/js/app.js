// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata=data.metadata;
    // console.log(metadata);
    
    // Filter the metadata for the object with the desired sample number
    let filter_metadata=metadata.filter(meta=>meta.id==sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel=d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for(let result in filter_metadata){
      panel.append("h4").text(`${result.toUpperCase()}:${filter_metadata[result]}`);

    }

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples=data.samples;

    // Filter the samples for the object with the desired sample number
    let filter_sample = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    
    let sample_values = filter_sample.sample_values.slice(0, 10).reverse();
    let otu_ids = filter_sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let otu_labels = filter_sample.otu_labels.slice(0, 10).reverse();


    // Build a Bubble Chart
    let buble_trace={
      x:filter_sample.otu_ids,
      y:filter_sample.sample_values,
      text:filter_sample.otu_labels,
      mode:'markers',
      marker:{
        size: filter_sample.sample_values,
        color: filter_sample.otu_ids,
        colorscale: 'Earth'
      }
    };
    let bubble_layout={
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 30, l: 300 },
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      hovermode: 'closest',
      margin: { t: 30 }
    };


    // Render the Bubble Chart
    Plotly.newPlot('bubble',[buble_trace],bubble_layout)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks=otu_ids;

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace={
      x:sample_values,
      y:yticks,
      text:otu_labels,
      type:"bar",
      orientation:"h"
    };
    let layout={
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 30, l: 150 },
      xaxis: { title: "Number of Bacteria" },
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [trace], layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names=data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown=d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      dropdown.append("option")
        .text(names[i])
        .property("value", names[i]);
    }

    // Get the first sample from the list
    let first_sample=names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
    buildCharts(newSample);
}

// Initialize the dashboard
init();
