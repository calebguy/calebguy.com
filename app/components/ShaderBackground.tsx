"use client";

import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;

  #define PI 3.14159265359
  #define ROWS 4.0
  #define COLS 8.0

  // Hash functions
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
                  dot(p, vec2(269.5, 183.3)),
                  dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
  }

  // Smooth noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractal noise
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      sum += noise(p) * amp;
      p *= 2.0;
      amp *= 0.5;
    }
    return sum;
  }

  // Holographic background
  vec3 holographicBg(vec2 uv, float time) {
    float n1 = fbm(uv * 2.5 + time * 0.03);
    float n2 = fbm(uv * 3.0 - time * 0.02 + 50.0);

    vec3 col1 = vec3(0.95, 0.75, 0.85);  // pink
    vec3 col2 = vec3(0.75, 0.88, 0.95);  // cyan
    vec3 col3 = vec3(0.85, 0.78, 0.95);  // purple
    vec3 col4 = vec3(0.8, 0.95, 0.82);   // mint

    vec3 mix1 = mix(col1, col2, n1);
    vec3 mix2 = mix(col3, col4, n2);

    return mix(mix1, mix2, 0.5 + 0.3 * sin(uv.x * 3.0 + uv.y * 2.0 + time * 0.08));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;

    // Background
    vec3 bg = holographicBg(uv, u_time);
    vec3 finalColor = bg;

    // Grid setup
    float cellW = aspect / COLS;
    float cellH = 1.0 / ROWS;
    float radius = min(cellW, cellH) * 0.5;

    // Aspect-corrected UV
    vec2 aUV = vec2(uv.x * aspect, uv.y);

    // Check each sphere
    for (float row = 0.0; row < ROWS; row++) {
      for (float col = 0.0; col < COLS; col++) {
        vec2 center = vec2((col + 0.5) * cellW, (row + 0.5) * cellH);
        vec2 d = aUV - center;
        float dist = length(d);

        if (dist < radius) {
          float normDist = dist / radius;
          float z = sqrt(1.0 - normDist * normDist);
          vec3 normal = normalize(vec3(d / radius, z));

          // Per-sphere randomness
          float seed = hash(vec2(col, row));
          vec3 seedVec = hash3(vec2(col, row));
          vec3 seedVec2 = hash3(vec2(col + 100.0, row + 50.0));

          // Refracted internal UV for "inside the marble" look
          vec3 refr = refract(vec3(0.0, 0.0, -1.0), normal, 0.7);
          vec2 baseUV = refr.xy * 2.0 + seedVec.xy * 8.0;

          // Rotate the UV over time - each sphere rotates at slightly different speed
          float rotSpeed = 0.15 + seed * 0.1;
          float angle = u_time * rotSpeed;
          float cosA = cos(angle);
          float sinA = sin(angle);
          vec2 internalUV = vec2(
            baseUV.x * cosA - baseUV.y * sinA,
            baseUV.x * sinA + baseUV.y * cosA
          );

          // Noise patterns for color blobs
          float n1 = fbm(internalUV * 3.0 + seed * 50.0);
          float n2 = fbm(internalUV * 4.0 + seed * 100.0);
          float n3 = fbm(internalUV * 2.5 + seed * 150.0);

          // Fine grain texture
          vec2 grainUV = gl_FragCoord.xy * 0.5 + seedVec.xy * 100.0;
          float grain = (hash(grainUV) - 0.5) * 0.12;

          // Pearly/golden base - dominant color
          vec3 baseColor = vec3(0.85, 0.78, 0.65);

          // Color blobs - subtle, smaller patches
          vec3 color = baseColor;

          // Pink/magenta patches - subtle
          float pinkAmt = smoothstep(0.55, 0.7, n1) * (0.3 + seedVec2.x * 0.5);
          color = mix(color, vec3(0.95, 0.5, 0.7), pinkAmt * 0.5);

          // Blue patches - subtle
          float blueAmt = smoothstep(0.5, 0.65, n2) * (0.3 + seedVec2.y * 0.5);
          color = mix(color, vec3(0.4, 0.5, 0.9), blueAmt * 0.5);

          // Green/teal patches - subtle
          float greenAmt = smoothstep(0.55, 0.7, n3) * (0.3 + seedVec2.z * 0.5);
          color = mix(color, vec3(0.5, 0.85, 0.6), greenAmt * 0.45);

          // Purple accents - very subtle
          float purpleAmt = smoothstep(0.6, 0.75, n1 * n2) * seedVec.z;
          color = mix(color, vec3(0.7, 0.5, 0.85), purpleAmt * 0.35);

          // Add grain
          color += grain;

          // Lighting
          vec3 lightDir = normalize(vec3(0.5, 0.7, 1.0));
          float diffuse = max(dot(normal, lightDir), 0.0);
          float ambient = 0.4;
          color *= (ambient + diffuse * 0.6);

          // Specular highlight
          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          vec3 halfVec = normalize(lightDir + viewDir);
          float spec = pow(max(dot(normal, halfVec), 0.0), 80.0);
          color += vec3(1.0, 0.98, 0.9) * spec * 0.9;

          // Depth - darker toward edges
          color *= (0.6 + 0.4 * z);

          // Subtle golden rim
          float rimStart = 0.7;
          float rim = smoothstep(rimStart, 0.98, normDist);
          vec3 rimColor = vec3(0.8, 0.65, 0.4);
          color = mix(color, rimColor, rim * 0.5);

          finalColor = color;
        }
      }
    }

    // Mild saturation boost
    float luma = dot(finalColor, vec3(0.299, 0.587, 0.114));
    finalColor = mix(vec3(luma), finalColor, 1.2);

    // Clamp
    finalColor = clamp(finalColor, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
    });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    // Get locations
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    // Create buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Animation loop
    const startTime = Date.now();
    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ display: "block" }}
    />
  );
}
