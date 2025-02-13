const PixelateShader = {
  uniforms: {
    uResolution: { value: { x: 800, y: 600 } }, // Adjust to game resolution
    uPixelSize: { value: 10.0 }
  },
  fragmentShader: `
      precision mediump float;
  
      uniform vec2 uResolution;
      uniform float uPixelSize;
  
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        vec2 pixelatedUV = floor(uv * uPixelSize) / uPixelSize;
        gl_FragColor = texture2D(uSampler, pixelatedUV);
      }
    `
};
