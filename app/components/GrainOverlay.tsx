"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_grainScale;
  uniform float u_grainIntensity;
  uniform float u_seed;
  uniform vec2 u_dragPos;
  uniform float u_isDragging;

  // Hash function for grain
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy;
    float t = u_time;

    vec2 grainUV = uv;
    float extraDistortion = 0.0;

    // Ripples emanate from drag position
    if (u_isDragging > 0.001) {
      float dragDist = distance(uv, u_dragPos);

      // Maximum ripple radius in pixels
      float maxRadius = 1000.0;

      // Multiple ripple waves spreading outward
      float ripple = sin(dragDist * 0.015 - t * 4.0) * 0.2;

      // Fade out ripples over distance, clamped to maxRadius
      float normalizedDist = dragDist / maxRadius;
      float fadeOut = 1.0 - smoothstep(0.0, 1.0, normalizedDist);

      extraDistortion = ripple * fadeOut;
    }

    // Dancing organic waves - horizontal drift with randomness
    float hDrift = t * 50.0;
    float n1 = hash(floor(grainUV * 0.35) + t * 0.08 + u_seed);
    float n2 = hash(floor(grainUV * 0.5) + t * 0.12 + 50.0 + u_seed);

    float wave1 = sin((grainUV.x + hDrift + n1 * 100.0) * 0.005 + t * 1.5 + u_seed) * cos(grainUV.y * 0.004 - t * 1.2);
    float wave2 = sin((grainUV.x + hDrift * 0.7 + n2 * 80.0) * 0.004 + t * 2.0) * cos((grainUV.x - grainUV.y) * 0.003 - t * 0.8 + u_seed);
    float wave3 = sin((grainUV.x + hDrift * 1.2) * 0.006 + n1 * 2.0 + t * 1.8) * cos(grainUV.y * 0.005 + t * 1.0);

    float distortion = (wave1 + wave2 * 1.5 + wave3 * 0.8) + extraDistortion;

    // Randomized grain - floor creates chunky blocks, u_grainScale is pixel size of each grain block
    float grain = (hash(floor(grainUV / u_grainScale) + fract(t * 60.0)) - 0.5) * u_grainIntensity;

    // Lower contrast - tighter range around middle gray
    float value = 0.5 + distortion * 0.5 + grain;
    value = clamp(value, 0.1, 0.95);

    gl_FragColor = vec4(vec3(value), 0.7);
  }
`;

export interface DragPosition {
	x: number;
	y: number;
	isDragging: boolean;
}

function createShader(
	gl: WebGLRenderingContext,
	type: number,
	source: string,
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

interface GrainOverlayProps {
	dragPosition: DragPosition | null;
}

export default function GrainOverlay({ dragPosition }: GrainOverlayProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const dragDataRef = useRef({
		pos: [0, 0] as [number, number],
		isDragging: false,
	});

	// Handle drag position updates from parent
	useEffect(() => {
		if (!dragPosition) {
			dragDataRef.current.isDragging = false;
			return;
		}

		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		// Convert to WebGL coordinates (bottom-left origin)
		const x = dragPosition.x * dpr;
		const y = (window.innerHeight - dragPosition.y) * dpr;

		dragDataRef.current.pos = [x, y];
		dragDataRef.current.isDragging = dragPosition.isDragging;
	}, [dragPosition]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const gl = canvas.getContext("webgl", {
			alpha: true,
			premultipliedAlpha: false,
		});
		if (!gl) return;

		const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader);
		const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
		if (!vs || !fs) return;

		const program = gl.createProgram();
		if (!program) return;
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error("Program link error:", gl.getProgramInfoLog(program));
			return;
		}

		const positionLocation = gl.getAttribLocation(program, "a_position");
		const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
		const timeLocation = gl.getUniformLocation(program, "u_time");
		const grainScaleLocation = gl.getUniformLocation(program, "u_grainScale");
		const grainIntensityLocation = gl.getUniformLocation(
			program,
			"u_grainIntensity",
		);
		const seedLocation = gl.getUniformLocation(program, "u_seed");
		const dragPosLocation = gl.getUniformLocation(program, "u_dragPos");
		const isDraggingLocation = gl.getUniformLocation(program, "u_isDragging");

		// Random grain parameters for this page load
		// grainScale is now pixel size of each grain block (1 = per-pixel, 10 = 10x10 blocks)
		const grainScale = 1 + Math.random() * 10;
		const grainIntensity = 0.15 + Math.random() * 0.15;
		const seed = Math.random() * 100;

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
			gl.STATIC_DRAW,
		);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			canvas.style.width = `${window.innerWidth}px`;
			canvas.style.height = `${window.innerHeight}px`;
			gl.viewport(0, 0, canvas.width, canvas.height);
		};
		resize();
		window.addEventListener("resize", resize);

		let animationId: number;
		const startTime = Date.now();

		const render = () => {
			const time = (Date.now() - startTime) / 1000;

			gl.useProgram(program);
			gl.enableVertexAttribArray(positionLocation);
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

			gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
			gl.uniform1f(timeLocation, time);
			gl.uniform1f(grainScaleLocation, grainScale);
			gl.uniform1f(grainIntensityLocation, grainIntensity);
			gl.uniform1f(seedLocation, seed);

			// Drag uniforms
			const dragData = dragDataRef.current;
			gl.uniform2f(dragPosLocation, dragData.pos[0], dragData.pos[1]);
			gl.uniform1f(isDraggingLocation, dragData.isDragging ? 1.0 : 0.0);

			gl.drawArrays(gl.TRIANGLES, 0, 6);
			animationId = requestAnimationFrame(render);
		};

		render();

		return () => {
			window.removeEventListener("resize", resize);
			cancelAnimationFrame(animationId);
			gl.deleteProgram(program);
			gl.deleteShader(vs);
			gl.deleteShader(fs);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 pointer-events-none mix-blend-overlay"
		/>
	);
}
