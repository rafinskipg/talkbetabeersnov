'use strict';

var expect = require('chai').expect;

describe('talk betabeers', function() {
  var sprite = require('../app/scripts/sprite');

  describe('Get current animation', function() {
    it('should return current animation', function() {
      var sp = new sprite({});
      sp.addAnimation('flap', [0,1,2,1,0,1,2], [160,200], 1000);
      sp.playAnimation('flap');
      expect(sp.currentAnimation).to.equal('flap');
    });

  });
  
});