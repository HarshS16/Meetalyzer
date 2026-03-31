"use client";

import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { authClient } from "@/lib/auth-client";
import { Session } from "better-auth";

gsap.registerPlugin(SplitText, useGSAP);
extend({ ShaderMaterial: THREE.ShaderMaterial });

// Shader code
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec3 u_resolution;

  vec2 toPolar(vec2 p) {
    float r = length(p);
    float a = atan(p.y, p.x);
    return vec2(r, a);
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = 6.0 * ((fragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y);
    vec2 polar = toPolar(p);
    float r = polar.x;
    vec2 i = p;
    float c = 0.0;
    float rot = r + u_time + p.x * 0.100;
    
    for (float n = 0.0; n < 4.0; n++) {
      float rr = r + 0.15 * sin(u_time * 0.7 + n + r * 2.0);
      p *= mat2(
        cos(rot - sin(u_time / 10.0)), sin(rot),
        -sin(cos(rot) - u_time / 10.0), cos(rot)
      ) * -0.25;
      float t = r - u_time / (n + 30.0);
      i -= p + sin(t - i.y) + rr;
      c += 2.2 / length(vec2(sin(i.x + t) / 0.15, cos(i.y + t) / 0.15));
    }
    c /= 8.0;
    vec3 baseColor = vec3(0.2, 0.7, 0.5);
    fragColor = vec4(baseColor * smoothstep(0.0, 1.0, c * 0.6), 1.0);
  }

  void main() {
    vec4 fragColor;
    mainImage(fragColor, vUv * u_resolution.xy);
    gl_FragColor = fragColor;
  }
`;

// ShaderPlane component
function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector3(1, 1, 1) },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
      material.uniforms.u_resolution.value.set(size.width, size.height, 1.0);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.FrontSide}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

// Badge component
function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {children}
    </div>
  );
}

// Button component
function Button({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return <button className={className}>{children}</button>;
}

// Main Page Component
export default function HomeView({ session }: { session: Session }) {
  //   const { data: session } = authClient.useSession();

  if (!session) {
    return <p>Loading...</p>;
  }

  const sectionRef = useRef<HTMLElement>(null);
  const badgeWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const microRef = useRef<HTMLUListElement>(null);

  const title = "AI Calls. Automatic Insights. Zero Friction.";
  const description =
    "Transform real-time conversations into structured knowledge — with live AI agents, instant summaries, transcripts, and a powerful post-call workspace.";
  const badgeText = "WORKFLOWS";
  const badgeLabel = "SUMMARIES & TRANSCRIPTS";
  const ctaButtons = [
    { text: "Agents", href: "/dashboard/agents", primary: true },
    { text: "Dashboard", href: "/dashboard", primary: false },
  ];
  const microDetails = [
    "Real-time AI agents",
    "Video replay & transcript search",
    "Context-aware AI chat",
  ];

  useGSAP(
    () => {
      if (!headingRef.current) return;

      document.fonts.ready.then(() => {
        const split = new SplitText(headingRef.current!, {
          type: "lines",
          wordsClass: "hero-lines",
        });

        gsap.set(split.lines, {
          filter: "blur(16px)",
          yPercent: 24,
          autoAlpha: 0,
          scale: 1.04,
          transformOrigin: "50% 100%",
        });

        if (badgeWrapperRef.current)
          gsap.set(badgeWrapperRef.current, { autoAlpha: 0, y: -8 });
        if (paragraphRef.current)
          gsap.set(paragraphRef.current, { autoAlpha: 0, y: 8 });
        if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 8 });

        const microItems = microRef.current
          ? Array.from(microRef.current.querySelectorAll("li"))
          : [];
        if (microItems.length > 0) gsap.set(microItems, { autoAlpha: 0, y: 6 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (badgeWrapperRef.current)
          tl.to(
            badgeWrapperRef.current,
            { autoAlpha: 1, y: 0, duration: 0.5 },
            0
          );
        tl.to(
          split.lines,
          {
            filter: "blur(0px)",
            yPercent: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
          },
          0.1
        );
        if (paragraphRef.current)
          tl.to(
            paragraphRef.current,
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.55"
          );
        if (ctaRef.current)
          tl.to(
            ctaRef.current,
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.35"
          );
        if (microItems.length > 0)
          tl.to(
            microItems,
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 },
            "-=0.25"
          );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Canvas>
          <ShaderPlane />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div ref={badgeWrapperRef}>
          <Badge className="mb-6 bg-white/10 hover:bg-white/15 text-emerald-300 backdrop-blur-md border-white/20 uppercase tracking-wider font-medium flex items-center gap-2 px-4 py-1.5">
            <span className="text-[10px] font-light tracking-[0.18em] text-emerald-100/80">
              {badgeLabel}
            </span>
            <span className="h-1 w-1 rounded-full bg-emerald-200/60" />
            <span className="text-xs font-light tracking-tight text-emerald-200">
              {badgeText}
            </span>
          </Badge>
        </div>

        <h1
          ref={headingRef}
          className="text-5xl md:text-7xl max-w-4xl font-light tracking-tight text-white mb-4"
        >
          {title}
        </h1>

        <p
          ref={paragraphRef}
          className="text-emerald-50/80 text-lg max-w-2xl mx-auto mb-10 font-light"
        >
          {description}
        </p>

        <div
          ref={ctaRef}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {ctaButtons.map((button, index) => (
            <Button
              key={index}
              href={button.href}
              className={
                button.primary
                  ? "px-8 py-3 rounded-xl text-base font-medium backdrop-blur-lg bg-emerald-400/80 hover:bg-emerald-300/80 shadow-lg transition-all cursor-pointer"
                  : "px-8 py-3 rounded-xl text-base font-medium border border-white/30 text-white hover:bg-white/10 backdrop-blur-lg transition-all cursor-pointer"
              }
            >
              {button.text}
            </Button>
          ))}
        </div>

        <ul
          ref={microRef}
          className="mt-8 flex flex-wrap justify-center gap-6 text-xs font-light tracking-tight text-emerald-100/70"
        >
          {microDetails.map((detail, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-emerald-200/60" />
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Have to add a sign-out button and functionality here later

// "use client";
// import { Button } from "@/components/ui/button";
// import { authClient } from "@/lib/auth-client";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";

// /**
//  * Root client component that renders session-aware authentication UI with signup and login forms.
//  *
//  * When a session exists, displays the signed-in user's name and a Sign Out button. When no session
//  * exists, displays two panels: a create-user form (name, email, password) and a login form (email,
//  * password), both wired to the authentication client.
//  *
//  * @returns The component's JSX element reflecting the current authentication state
//  */
// export default function Home() {
//   const { data: session } = authClient.useSession();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const onSubmit = () => {
//     authClient.signUp.email(
//       {
//         email,
//         name,
//         password,
//       },
//       {
//         onError: () => {
//           window.alert("Something went wrong!");
//         },
//         onSuccess: () => {
//           window.alert("User created successfully!");
//         },
//       }
//     );
//   };

//   const onLogin = () => {
//     authClient.signIn.email(
//       {
//         email,
//         password,
//       },
//       {
//         onError: () => {
//           window.alert("Something went wrong!");
//         },
//         onSuccess: () => {
//           window.alert("User LoggedIn successfully!");
//         },
//       }
//     );
//   };

//   return (
//     <div className="flex flex-col gap-y-10">
//       <div className="p-4 flex flex-col gap-y-4">
//         <Input
//           placeholder="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <Input
//           placeholder="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <Input
//           placeholder="password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button onClick={onSubmit}>Create User</Button>
//       </div>
//       <div className="p-4 flex flex-col gap-y-4">
//         <Input
//           placeholder="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <Input
//           placeholder="password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button onClick={onLogin}>Log In</Button>
//       </div>
//     </div>
//   );
// }
