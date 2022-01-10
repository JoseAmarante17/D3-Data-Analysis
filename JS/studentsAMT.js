let margin = {
    top: 100,
    right: 0,
    bottom: 250,
    left: 150
};

//Pre defines dimensions
let height = 520;
let width = 900;

// Selects #viz and appends a svg to it also gives it a pre-defined dimensions
let svg = d3.select('#studentAmt')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

d3.csv('./Dataset/StudentNumber.csv', (d) => {
    // Renames column names
    // +d.sales tells javascript that the column contains integers
    d.Students = +d.Students;
    return d;

}).then((results) => {
    //The scale starts here. An individual scale for the x and y 
    // set band scale on X axis and Linear scale on Y axis
    let x = d3.scaleBand();
    let y = d3.scaleLinear();

    /*
     * We set our Domain and Range 
        .domain = input(dataset)
        .range = output(how data is shown)
        .map maps it to an array.

        [result.map('DataName' => 'DataName.thisColumn')]
    */
    x.domain(results.map(d => d.school))
        .range([0, width])
        .padding(0.1); //grabs all flavors value from csv and sets the range in how it would appear

    y.domain([0, d3.max(results, d => d.Students)]).nice(); // nice rounds up last value it
    y.range([height, 0]); //STARTS AT 0 AND GOES UP TO HEIGHT, THIS IS BACKWARDS


    // Draws AXES
    svg.append('g')
        .call(d3.axisLeft(y))
        .style('font-size', 14);

    svg.append('text')
        .call(d3.axisLeft)
        .text('Number of Students')
        .attr('text-achor', 'start')
        .attr("transform", "rotate(270)")
        .attr('x', 0 - (height / 1.3))
        .attr('y', -100)
        .style('font-size', 35);//postion;


    // SVG are built from the top down. 
    // We create offset on y 
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('x', 60)
        .attr('y',  50)//postion
        .attr('dy', 0)//offset
        .attr("transform", "rotate(50)")
        
        .style('font-size', 13.5);

    svg.append('text')
        .text('Schools')
        .attr('text-achor', 'start')
        .attr('x', 500)
        .attr('y', (height + (margin.bottom - 75)))
        .style('font-size', 45);//postion;

    svg.append('text')
        .text('Amt of Students at each School')
        .attr('x', width / 4)
        .attr('y', -(30))
        .style('font-size', 45);//postion;


    let bar = svg.selectAll('.bar-group')
        .data(results)
        .enter()
        .append('g')
        .attr('class', 'bar-group');

    bar.append('rect') //APENDS ONE RECTANGLE PER GROUP
        .attr('class', 'bar')
        .attr('x', d => x(d.school))
        .attr('y', d => y(d.Students))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.Students))
        .style('fill', 'steelblue');



    bar.append('text')
        .text(d => d.Students)
        .attr('x', d => x(d.school) + (x.bandwidth() / 10))
        .attr('y', d => y(d.Students) - 5)
        .style('font-family', 'sans-serif')
        .style('font-size', 14);



}).catch((err) => {
    // catches the error
    throw err;
})



