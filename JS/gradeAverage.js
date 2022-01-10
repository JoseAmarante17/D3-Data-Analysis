let margin1 = {
    top: 100,
    right: 0,
    bottom: 250,
    left: 150
};

//Pre defines dimensions
let height1 = 520;
let width1 = 900;

// Selects #viz and appends a svg to it also gives it a pre-defined dimensions
let svg1 = d3.select('#gradeAverage')
    .append('svg')
    .attr('width', width1 + margin1.right + margin1.left)
    .attr('height', height1 + margin1.top + margin1.bottom)
    .append('g')
    .attr('transform', `translate(${margin1.left}, ${margin1.top})`);

d3.csv('./Dataset/posttestGrade.csv', (d) => {
    // Renames column names
    // +d.sales tells javascript that the column contains integers
    d.Average = +d.Average;
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
        .range([0, width1])
        .padding(0.1); //grabs all flavors value from csv and sets the range in how it would appear

    y.domain([0, d3.max(results, d => d.Average)]).nice(); // nice rounds up last value it
    y.range([height1, 0]); //STARTS AT 0 AND GOES UP TO HEIGHT, THIS IS BACKWARDS


    // Draws AXES
    svg1.append('g')
        .call(d3.axisLeft(y))
        .style('font-size', 14);

    svg1.append('text')
        .text('Grades')
        .attr('text-achor', 'start')
        .attr("transform", "rotate(270)")
        .attr('x', 0 - (height1 / 1.3))
        .attr('y', -100)
        .style('font-size', 35);//postion;


    // SVG are built from the top down. 
    // We create offset on y 
    svg1.append('g')
        .attr('transform', `translate(0,${height1})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('x', 60)
        .attr('y',  50)//postion
        .attr('dy', 0)//offset
        .attr("transform", "rotate(50)")
        
        .style('font-size', 13.5);

    svg1.append('text')
        .text('Schools')
        .attr('text-achor', 'start')
        .attr('x', 500)
        .attr('y', (height1 + (margin1.bottom - 75)))
        .style('font-size', 45);//postion;

    svg1.append('text')
        .text('Average Grade')
        .attr('x', width1 / 4)
        .attr('y', -(30))
        .style('font-size', 45);//postion;


    let bar1 = svg1.selectAll('.bar-group')
        .data(results)
        .enter()
        .append('g')
        .attr('class', 'bar-group');

    bar1.append('rect') //APENDS ONE RECTANGLE PER GROUP
        .attr('class', 'bar')
        .attr('x', d => x(d.school))
        .attr('y', d => y(d.Average))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.Average))
        .style('fill', 'steelblue');



    bar1.append('text')
        .text(d => d.Average)
        .attr('x', d => x(d.school) + (x.bandwidth() / 10))
        .attr('y', d => y(d.Average) - 5)
        .style('font-family', 'sans-serif')
        .style('font-size', 14);



}).catch((err) => {
    // catches the error
    throw err;
})


