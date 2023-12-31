const xfnv1a = str => {
  for (var i = 0, h = 2166136261 >>> 0; i < str.length; i++) {
    // Math.imul() allows for 32-bit integer multiplication with C-like semantics
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return function () {
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    return (h += h << 5) >>> 0;
  };
};

const sfc32 = (a, b, c, d) => {
  return () => {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    var t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};

const modn = (n, m) => {
  return ((n % m) + m) % m;
};

export const PRNGFactory = seedStr => {
  let seed = xfnv1a(seedStr);
  return sfc32(seed(), seed(), seed(), seed());
};

const FractalFunctionFactory = (rng, funcs) => {
  return cfi => {
    return {
      // 1
      Linear: (x, y) => {
        return [x, y];
      },
      // 2
      Sinusoidal: (x, y) => {
        return [Math.sin(x), Math.sin(y)];
      },
      // 3
      Spherical: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return [x / Math.pow(r, 2), y / Math.pow(r, 2)];
      },
      // 4
      Swirl: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return [
          x * Math.sin(Math.pow(r, 2)) - y * Math.cos(Math.pow(r, 2)),
          x * Math.cos(Math.pow(r, 2)) + y * Math.sin(Math.pow(r, 2)),
        ];
      },
      // 5
      Horseshoe: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return [(1 / r) * (x - y) * (x + y), (1 / r) * 2 * x * y];
      },
      // 6
      Polar: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var th = Math.atan2(y, x);
        return [th / Math.PI, r - 1];
      },
      // 7
      Hankerchief: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var th = Math.atan2(y, x);
        return [r * Math.sin(th + r), r * Math.cos(th - r)];
      },
      // 8
      Heart: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var th = Math.atan2(y, x);
        return [r * Math.sin(th * r), r * -Math.cos(th * r)];
      },
      // 9
      Disc: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var th = Math.atan2(y, x);
        return [(th / Math.PI) * Math.sin(Math.PI * r), (th / Math.PI) * Math.cos(Math.PI * r)];
      },
      // 10
      Spiral: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var th = Math.atan2(y, x);
        return [(1 / r) * (Math.cos(th) + Math.sin(r)), (1 / r) * (Math.sin(th) - Math.cos(r))];
      },
      // 11
      Hyperbolic: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var th = Math.atan2(y, x);
        return [Math.sin(th) / r, r * Math.cos(th)];
      },
      // 12
      Diamond: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var th = Math.atan2(y, x);
        return [Math.sin(th) * Math.cos(r), Math.cos(th) * Math.sin(r)];
      },
      // 13
      Ex: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var th = Math.atan2(y, x);
        var p0 = Math.sin(th + r);
        var p1 = Math.cos(th - r);
        return [r * (Math.pow(p0, 3) + Math.pow(p1, 3)), r * (Math.pow(p0, 3) - Math.pow(p1, 3))];
      },
      // 14
      Julia: (x, y) => {
        var rs = Math.sqrt(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
        var th = Math.atan2(y, x);
        var om =
          funcs[cfi].r ||
          funcs[cfi].c[0] + funcs[cfi].c[1] + funcs[cfi].c[2] + funcs[cfi].c[3] + funcs[cfi].c[4] + funcs[cfi].c[5];
        return [rs * Math.cos(th / 2 + om), rs * Math.sin(th / 2 + om)];
      },
      // 15
      JuliaN: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var ph = Math.atan2(x, y);
        var p1 = 1;
        var p2 = 0.75;
        var rnd = funcs[cfi].r || 0.5;
        var p3 = Math.trunc(Math.abs(p1) * rnd);
        var t = (ph + 2 * Math.PI * p3) / p1;
        var rpp = Math.pow(r, p2 / p1);
        return [rpp * Math.cos(t), rpp * Math.sin(t)];
      },
      // 16
      Bent: (x, y) => {
        if (x >= 0 && y >= 0) return [x, y];
        else if (x < 0 && y >= 0) return [2 * x, y];
        else if (x >= 0 && y < 0) return [x, y / 2];
        else return [2 * x, y / 2];
      },
      // 17
      Waves: (x, y) => {
        return [
          // XXX TODO
          x + funcs[cfi].c[1] * Math.sin(y / Math.pow(funcs[cfi].c[2], 2)),
          y + funcs[cfi].c[4] * Math.sin(x / Math.pow(funcs[cfi].c[5], 2)),
        ];
      },
      // 18
      Fisheye: (x, y) => {
        var re = 2 / (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) + 1);
        return [re * y, re * x];
      },
      // 19
      Popcorn: (x, y) => {
        return [
          // XXX TODO
          x + funcs[cfi].c[2] * Math.sin(Math.tan(3 * y)),
          y + funcs[cfi].c[5] * Math.sin(Math.tan(3 * x)),
        ];
      },
      // 20
      Power: (x, y) => {
        var th = Math.atan2(y, x);
        var rsth = Math.pow(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), Math.sin(th));
        return [rsth * Math.cos(th), rsth * Math.sin(th)];
      },
      // 21
      Rings: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var th = Math.atan2(y, x);
        var re =
          modn(r + Math.pow(funcs[cfi].c[2], 2), 2 * Math.pow(funcs[cfi].c[2], 2)) -
          Math.pow(funcs[cfi].c[2], 2) +
          r * (1 - Math.pow(funcs[cfi].c[2], 2));
        return [re * Math.cos(th), re * Math.sin(th)];
      },
      // 22
      Fan: (x, y) => {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var th = Math.atan2(y, x);
        var t = Math.PI * Math.pow(funcs[cfi].c[2], 2);
        if (modn(th + funcs[cfi].c[5], t) > t / 2) {
          return [r * Math.cos(th - t / 2), r * Math.sin(th - t / 2)];
        } else {
          return [r * Math.cos(th + t / 2), r * Math.sin(th + t / 2)];
        }
      },
      // 23
      Eyefish: (x, y) => {
        var re = 2 / (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) + 1);
        return [re * x, re * y];
      },
      // 24
      Bubble: (x, y) => {
        var re = 4 / (Math.pow(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), 2) + 4);
        return [re * x, re * y];
      },
      // 25
      Cylinder: (x, y) => {
        return [Math.sin(x), y];
      },
      // 26
      Tangent: (x, y) => {
        return [Math.sin(x) / Math.cos(y), Math.tan(y)];
      },
      // 27
      Cross: (x, y) => {
        var s = Math.sqrt(1 / Math.pow(Math.pow(x, 2) - Math.pow(y, 2), 2));
        return [s * x, s * y];
      },
      // 28
      Noise: (x, y) => {
        var p1 = rng();
        var p2 = rng();
        return [p1 * x * Math.cos(2 * Math.PI * p2), p1 * y * Math.sin(2 * Math.PI * p2)];
      },
      // 29
      Blur: (x, y) => {
        var p1 = rng();
        var p2 = rng();
        return [p1 * Math.cos(2 * Math.PI * p2), p1 * Math.sin(2 * Math.PI * p2)];
      },
      // 30
      Square: (x, y) => {
        var p1 = rng();
        var p2 = rng();
        return [p1 - 0.5, p2 - 0.5];
      },
    };
  };
};

//const FUNC_LENGTH = 30;
const FractalFlameGenerator = (seedStr, funcList) => {
  let weights = [];
  for (var i = 0; i < funcsList.length; i++) {
    /*
    for (var j = 0; j < funcsList[i].v.length; j++) {
      for (var k = 0; k < FUNC_LENGTH; k++) {
        if (varis[k].name == funcsJSON[i].v[j]) {
          funcsJSON[i].v[j] = k;
        }
      }
    }
    */
    weights.push(funcsJSON[i].weight);
  }
  let rng = PRNGFactory(seedStr);
  let funcs = FractalFunctionFactory(rng, funcList);
};
