
Seq = {};

Seq.init = function() {
    var self = this;
    self.map = L.map('map', {
            center: [-7.9991, 127.18],
            zoom: 11,
            doubleClickZoom: false
        });

    L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
            'subdomains': 'abcd'
        })
        .addTo(self.map);
    
    
    $('.controls_btn').click(function() {
        var $step = $('.controls_step');
        var d = parseInt($(this).data('direction'));
        var index = parseInt($step.text());
        index += d;
        $step.text(index);
        self.drawGraph(index);
    });
    
    self.drawGraph(0);
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
    
    $('g').empty();
    
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
        if (i === index) {
            self.map.panTo(latlngs[0]);
        }
    });
};




