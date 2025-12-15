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

  // Hash function for grain
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy;
    float t = u_time;

    // Dancing organic waves - horizontal drift with randomness
    float hDrift = t * 50.0;
    float n1 = hash(floor(uv * 0.35) + t * 0.08);
    float n2 = hash(floor(uv * 0.5) + t * 0.12 + 50.0);

    float wave1 = sin((uv.x + hDrift + n1 * 100.0) * 0.005 + t * 1.5) * cos(uv.y * 0.004 - t * 1.2);
    float wave2 = sin((uv.x + hDrift * 0.7 + n2 * 80.0) * 0.004 + t * 2.0) * cos((uv.x - uv.y) * 0.003 - t * 0.8);
    float wave3 = sin((uv.x + hDrift * 1.2) * 0.006 + n1 * 2.0 + t * 1.8) * cos(uv.y * 0.005 + t * 1.0);

    float distortion = (wave1 + wave2 * 1.5 + wave3 * 0.8);

    // Softer animated grain
    float grain = (hash(uv * 0.0002 + fract(t * 60.0)) - 0.5) * 0.05;

    // Lower contrast - tighter range around middle gray
    float value = 0.5 + distortion * 0.5 + grain;
    value = clamp(value, 0.1, 0.95);

    gl_FragColor = vec4(vec3(value), 0.7);
  }
`;

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

export default function Home() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

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
		<>
			{/* Blurred background image */}
			<div
				className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-lg scale-110"
				style={{ backgroundImage: "url('/caleb-guy-bg.png')" }}
			/>
			{/* Animated noise overlay */}
			<canvas
				ref={canvasRef}
				className="fixed inset-0 pointer-events-none mix-blend-overlay"
			/>
		</>
	);
}
