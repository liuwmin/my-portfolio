"use client";
import { useEffect, useRef } from "react";

/**
 * WebGL 液态金属点缀层。
 * 全屏 absolute canvas，soft-light 混合 + 0.35 透明度，
 * 叠加在 Hero 背景图之上，营造"金属光泽掠过照片"的科幻感。
 * 不支持 WebGL 时静默降级（不影响 Hero 背景图）。
 */
export function MetalAccent({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;
    const ctx = gl;

    const vertSrc = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;
    const fragSrc = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){
        vec2 i=floor(p); vec2 f=fract(p);
        float a=hash(i);
        float b=hash(i+vec2(1.0,0.0));
        float c=hash(i+vec2(0.0,1.0));
        float d=hash(i+vec2(1.0,1.0));
        vec2 u=f*f*(3.0-2.0*f);
        return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
      }
      float fbm(vec2 p){
        float v=0.0; float a=0.5;
        for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; }
        return v;
      }
      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p = uv * 3.0;
        float t = u_time * 0.04;
        float n = fbm(p + vec2(t, t*0.6) + fbm(p*1.5 - t));
        float m = smoothstep(0.25, 0.75, n);
        vec3 col = mix(vec3(0.04), vec3(0.92), m);
        col += 0.08 * sin(n*12.0 + u_time*0.5);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      const s = ctx.createShader(type)!;
      ctx.shaderSource(s, src);
      ctx.compileShader(s);
      return s;
    }
    const prog = ctx.createProgram()!;
    ctx.attachShader(prog, compile(ctx.VERTEX_SHADER, vertSrc));
    ctx.attachShader(prog, compile(ctx.FRAGMENT_SHADER, fragSrc));
    ctx.linkProgram(prog);
    ctx.useProgram(prog);

    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(
      ctx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      ctx.STATIC_DRAW
    );
    const loc = ctx.getAttribLocation(prog, "a_pos");
    ctx.enableVertexAttribArray(loc);
    ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);

    const uTime = ctx.getUniformLocation(prog, "u_time");
    const uRes = ctx.getUniformLocation(prog, "u_res");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        ctx.viewport(0, 0, w, h);
      }
    }

    let raf = 0;
    const start = performance.now();
    function render(now: number) {
      resize();
      ctx.uniform1f(uTime, (now - start) / 1000);
      ctx.uniform2f(uRes, canvas.width, canvas.height);
      ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ mixBlendMode: "soft-light", opacity: 0.35 }}
      aria-hidden="true"
    />
  );
}
