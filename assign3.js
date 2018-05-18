/* author : Ashlin */

function initialize() {

    d3.json('data.json', function (data) {
        var nodes = data['nodes'];
        var links = data['links'];
        var nodeRadius = new Array();
        var tradingLines = new Array();

        nodes.forEach(function (node, j) {
            var total_node_amount = 0;
            links.forEach(function (link, i) {
                if (nodes[j].id == links[i].node01 || nodes[j].id == links[i].node02) {
                    total_node_amount += links[i].amount;
                }
            });
            nodeRadius[nodes[j].id] = (total_node_amount / 100);//scaled down to %
        });

        links.forEach(function (link, i) {
            var line = new Array();
            line['node01'] = getNodePosition(link.node01);
            line['node02'] = getNodePosition(link.node02);
            line['amount'] = link.amount;
            tradingLines.push(line);
        });

        console.log(tradingLines);

        function getNodePosition(site) {
            var sitedetails = new Array();
            nodes.forEach(function (node, j) {
                if (site == node.id) {
                    sitedetails = node;
                    return;
                }
            });
            return sitedetails;
        }

        var canvas = d3.select('#graphContainer')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var line = canvas.selectAll('line')
            .data(tradingLines)
            .enter()
            .append('line')
            .attr('x1', function (d) {
                return d.node01.x;
            })
            .attr('y1', function (d) {
                return d.node01.y;
            })
            .attr('x2', function (d) {
                return d.node02.x;
            })
            .attr('y2', function (d) {
                return d.node02.y;
            })
            .attr('stroke','#004fff')
            .attr('stroke-width',function(d){
                return (d.amount/100);
            })
            .attr('class',function(d){
                return d.node01.id+" "+d.node02.id;
            });

        var circle = canvas.selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })
            .attr('r', function (d) {
                return nodeRadius[d.id];
            })
            .on('mouseover', function (d) {
                var classname = d.id;
                canvas.selectAll('circle')
                    .attr('opacity', '0.4');
                canvas.selectAll('line')
                    .attr('opacity', '0.1');
                d3.select(this)
                    .attr('opacity', '1');
                canvas.selectAll('.'+classname)
                    .attr('opacity','1')
                    .attr('stroke','red');
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html(d.id + "<br> Trade Amount:" + (nodeRadius[d.id] * 100))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on('mouseout', function (d) {
                var classname = d.id;
                canvas.selectAll('.'+classname)
                    .attr('opacity','1')
                    .attr('stroke','#004fff');
                canvas.selectAll('circle,line')
                    .attr('opacity', '1');
                div.transition()
                    .duration(100)
                    .style("opacity", 0);
            });


    });
}