function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height,
    p_radius = 1.5,
    max_outer_bounds = 5;
    max_speed = 0.1;

var n = 200;
var particles = new Array(n);
for (var i = 0; i < n; i++) {
  particles[i] = {
    x: getRandomInt(0, width),
    y0: getRandomInt(0, height),
    v: (Math.random() - 0.5) * max_speed
  };
}

var max_dist = 100;
var min_dist = 10;

var tau = 2 * Math.PI;
var t = d3.timer(function(elapsed) {
  // Clear the canvas.
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = 1.0;

  // Move the particles to their new positions.
  for (var i = 0; i < n; i++) {
    var curr_p = particles[i];
    context.beginPath();

    curr_p.y = curr_p.y0 + elapsed * curr_p.v;

    // Make the particles wrap-around if they go out of bounds.
    if (curr_p.y > height + max_outer_bounds) {
      curr_p.y0 -= (height + max_outer_bounds);
    } else if (curr_p.y < -max_outer_bounds) {
      curr_p.y0 += (height - max_outer_bounds);
    }

    context.arc(curr_p.x, curr_p.y, p_radius, 0, tau);
    context.fill();
  }

  // Loop through all the particles, and draw lines to the ones that are somewhat close.
  for (var i = 0; i < n; i++) {
    for(var j = i+1; j < n; j++) {
      var p1 = particles[i],
          p2 = particles[j];

      var dx = p1.x - p2.x,
          dy = p1.y - p2.y;
      var euclid_dist = Math.sqrt(dx*dx + dy*dy);

      if (euclid_dist < max_dist) {
        context.globalAlpha = euclid_dist > min_dist ? (max_dist - euclid_dist) / (max_dist - min_dist) : 1;
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.stroke();
      }
    }
  }
});
