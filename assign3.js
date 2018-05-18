/* author : Ashlin */

function initialize() {

    d3.json('data.json', function (data) {
        var scaledAmount = 60;
        var nodes = data['nodes'];
        var links = data['links'];
        var nodeRadius = new Array();
        var nodeConnections = new Array();
        var tradingLines = new Array();

        nodes.forEach(function (node, j) {
            var total_node_amount = 0;
            var count_connection = 0;
            links.forEach(function (link, i) {
                if (nodes[j].id == links[i].node01 || nodes[j].id == links[i].node02) {
                    total_node_amount += links[i].amount;
                    count_connection += 1;
                }
            });
            nodeRadius[nodes[j].id] = (total_node_amount / scaledAmount);//scaled down to %
            nodeConnections[nodes[j].id] = count_connection;
        });

        links.forEach(function (link, i) {
            var line = new Array();
            line['node01'] = getNodePosition(link.node01);
            line['node02'] = getNodePosition(link.node02);
            line['amount'] = link.amount;
            tradingLines.push(line);
        });

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
                return (d.amount/scaledAmount);
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
                    .attr('opacity', '1')
                    .attr('stroke','red');
                canvas.selectAll('.'+classname)
                    .attr('opacity','1')
                    .attr('stroke','red');
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html("<b>"+(d.id).toUpperCase() + "</b><br><b> Trade amount:</b>" + (nodeRadius[d.id] * scaledAmount)+"<br><b>Total Connections:</b>"+nodeConnections[d.id])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on('mouseout', function (d) {
                var classname = d.id;
                canvas.selectAll('.'+classname)
                    .attr('opacity','1')
                    .attr('stroke','#004fff');
                d3.select(this)
                    .attr('stroke','');
                canvas.selectAll('circle,line')
                    .attr('opacity', '1');
                div.transition()
                    .duration(100)
                    .style("opacity", 0);
            });


    });
}