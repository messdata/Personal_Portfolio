// src/components/welcome/Orb.tsx
import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec3 } from 'ogl';

interface OrbProps {
    hue?: number;
    hoverIntensity?: number;
    rotateOnHover?: boolean;
    forceHoverState?: boolean;
    brightness?: number;
}

export default function Orb({
    hue: initialHue = 140,
    hoverIntensity = 0.5,
    rotateOnHover = true,
    forceHoverState = false,
    brightness = 1.0,
}: OrbProps) {
    const ctnDom = useRef<HTMLDivElement>(null);
    const [currentHue, setCurrentHue] = useState(initialHue);
    const programRef = useRef<any>(null);

    const vert = `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

    const frag = `
    precision highp float;
    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform float brightness;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }

    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }

    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }
    
    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);

      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + vec3(1.0)))
      );
      return dot(vec4(31.316), n);
    }

    vec4 extractAlpha(vec3 colorin) {
      float a = max(max(colorin.r, colorin.g), colorin.b);
      return vec4(colorin, a);
    }
    
    float innerRadius = 0.5; 
    vec3 color1 = vec3(0.1, 0.4, 0.8);
    vec3 color2 = vec3(0.8, 0.4, 0.1);
    vec3 color3 = vec3(0.4, 0.8, 0.1);

    vec4 draw(vec2 uv) {
      float len = length(uv);
      float n0 = snoise3(vec3(uv * 1.5, iTime * 0.5));
      float cl = smoothstep(0.4, 0.8, n0 + len * 0.1);
      float v0 = smoothstep(0.0, 1.0, len * 0.8);
      float v1 = 1.0 - smoothstep(0.1, 0.9, len);
      
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len); 
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      
      vec3 col = mix(color1, color2, cl); 
      col = mix(color3, col, v0); 
      col = (col + v1) * v2 * v3;

      col = adjustHue(col, hue);
      col *= brightness;

      col = clamp(col, 0.0, 1.0); 
      return extractAlpha(col);
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

      uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
      
      return draw(uv);
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;

    useEffect(() => {
        const container = ctnDom.current;
        if (!container) return;

        const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
        container.appendChild(gl.canvas);

        const geometry = new Triangle(gl);
        const initialResolution = new Vec3(
            container.offsetWidth,
            container.offsetHeight,
            container.offsetWidth / container.offsetHeight
        );

        const program = new Program(gl, {
            vertex: vert,
            fragment: frag,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: initialResolution },
                hue: { value: currentHue },
                hover: { value: forceHoverState ? 1 : 0 },
                rot: { value: 0 },
                hoverIntensity: { value: hoverIntensity },
                brightness: { value: brightness },
            },
        });

        programRef.current = program;
        const mesh = new Mesh(gl, { geometry, program });

        const resize = () => {
            if (!container) return;
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            program.uniforms.iResolution.value.set(
                gl.canvas.width,
                gl.canvas.height,
                gl.canvas.width / gl.canvas.height
            );
        };

        window.addEventListener('resize', resize);
        resize();

        let targetHover = forceHoverState ? 1 : 0;
        let currentRot = 0;
        const rotationSpeed = 0.2;
        let lastTime = 0;

        const handleMouseMove = () => {
            targetHover = 1;
        };

        const handleMouseLeave = () => {
            targetHover = 0;
        };

        if (!forceHoverState) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);
        }

        let rafId: number;

        const update = (t: number) => {
            rafId = requestAnimationFrame(update);
            const dt = (t - lastTime) * 0.001;
            lastTime = t;

            program.uniforms.iTime.value = t * 0.001;
            program.uniforms.hue.value = currentHue;
            program.uniforms.hoverIntensity.value = hoverIntensity;

            const effectiveHover = forceHoverState ? 1 : targetHover;
            program.uniforms.hover.value += (effectiveHover - program.uniforms.hover.value) * 0.1;

            if (rotateOnHover && effectiveHover > 0.5) {
                currentRot += dt * rotationSpeed;
                program.uniforms.rot.value = currentRot;
            } else if (!rotateOnHover) {
                program.uniforms.rot.value = 0;
            }

            renderer.render({ scene: mesh });
        };

        rafId = requestAnimationFrame(update);

        // Listen for hue updates
        const handleHueUpdate = (e: CustomEvent) => {
            setCurrentHue(e.detail);
        };

        window.addEventListener('updateOrbHue', handleHueUpdate as EventListener);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('updateOrbHue', handleHueUpdate as EventListener);
            if (!forceHoverState) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
            if (gl.canvas.parentNode === container) {
                container.removeChild(gl.canvas);
            }
        };
    }, [hoverIntensity, rotateOnHover, forceHoverState, brightness]);

    // Update hue in program when currentHue changes
    useEffect(() => {
        if (programRef.current) {
            programRef.current.uniforms.hue.value = currentHue;
        }
    }, [currentHue]);

    return (
        <div
            ref={ctnDom}
            data-orb
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        />
    );
}