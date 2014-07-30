
Seq = {};

Seq.init = function() {
    this.map = L.map('map', {
            center: [-7.9991, 127.18],
            zoom: 11,
            doubleClickZoom: false
        });

    L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
            'subdomains': 'abcd'
        })
        .addTo(this.map);
    this.drawGraph();
};


Seq.initData = function(data) {
    this.nodes = [];
    for (var key in data.vertices) {
        var vertice = data.vertices[key];
        var id = parseInt(key);
        this.nodes[id] = {
            x: vertice.X,
            y: vertice.Y
        };
    }
    
    this.edges = [];
    for (var key in data.edges) {
        var edge = data.edges[key];
        var id = edge['Sequence..Far.sighted.sequence'];
        this.edges[id] = {
            from: edge.from,
            to: edge.to
        };
    }
};


Seq.drawGraph = function(index) {
    // Draw grayscale graph
    var self = this;
    self.nodes.forEach(function(node) {
        self.circle = L.circle([node.y, node.x], 100, {className: 'node'})
            .addTo(self.map);
    });
    
    self.edges.forEach(function(edge, i) {
        var from = self.nodes[edge.from];
        var to = self.nodes[edge.to];
        var latlngs = [[from.y, from.x], [to.y, to.x]];
        L.polyline(latlngs, {
            className: i <= index ? 'edge active' : 'edge'
        }).addTo(self.map);
    });
};


Seq.animate = function(sequence) {
    var self = Seq;
    var i = 0;
    sequence.forEach(function(nodes) {
        nodes.forEach(function(node) {
            i++;
            setTimeout(function() {            
                var width = window.innerWidth,
                    height = window.innerHeight;
                self.draw(node);
                if (node.type === 'vertice') {
                    var width = window.innerWidth,
                        height = window.innerHeight;
                    self.projection
                        .translate([width / 2, height / 2]);
                    
                    var center = self.projection([node.x, node.y]);
                    console.log(node, center, self.projection.translate())
                    self.zoom.translate([width - center[0], height - center[1]])
                }
                self.onzoom();
            }, 200 * i);
        });
    });
};


Seq.draw = function(node) {
    var self = Seq;

    if (node.type === 'vertice') {
        self.vector
            .append('circle')
            .datum(node)
            .attr('cx', function(d) { return self.projection([d.x, d.y])[0]; })
            .attr('cy', function(d) { return self.projection([d.x, d.y])[1]; })
            .attr('r', 2)
            .attr('class', 'node')
            .attr('id', function(d) { return d.id; });
    } else if (node.type === 'edge') {
        var from = d3.select('#v' + node.from).data()[0];
        var to = d3.select('#v' + node.to).data()[0];

        if (from && to) {
            self.vector
                .append('path')
                .datum({
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [[from.x, from.y], [to.x, to.y]]
                    }
                })
                .attr('d', self.path)
                .attr('class', 'edge');
        }
    }
};

