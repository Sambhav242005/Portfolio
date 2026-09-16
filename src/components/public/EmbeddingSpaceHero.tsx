"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type EmbeddingNode = {
  label: string;
  cluster: number;
};

export type EmbeddingProject = {
  label: string;
  cluster: number;
  href: string;
};

type ClusterDef = {
  name: string;
  light: string;
  dark: string;
};

const CLUSTERS: ClusterDef[] = [
  { name: "Computer Vision", light: "#2563eb", dark: "#5aa2ff" },
  { name: "Agents & NLP", light: "#7c3aed", dark: "#a78bfa" },
  { name: "Deep Learning", light: "#ea580c", dark: "#ff8a4c" },
  { name: "Engineering", light: "#0d9488", dark: "#4dd0a0" },
];

const CLUSTER_CENTERS = [
  new THREE.Vector3(-10, 4, -4),
  new THREE.Vector3(11, 5, 2),
  new THREE.Vector3(0, -8, 4),
  new THREE.Vector3(12, -4, -3),
];

interface EmbeddingSpaceHeroProps {
  nodes: EmbeddingNode[];
  projects: EmbeddingProject[];
  className?: string;
}

function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function isDark() {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.theme === "dark";
}

export function EmbeddingSpaceHero({ nodes, projects, className = "" }: EmbeddingSpaceHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inspectorRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const inspector = inspectorRef.current;
    if (!canvas || !inspector) return;
    const canvasEl: HTMLCanvasElement = canvas;
    const inspectorEl: HTMLElement = inspector;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
    } catch {
      setWebglOk(false);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    camera.position.set(0, 0, 26);

    const clusterColors = CLUSTERS.map((cluster) => new THREE.Color(isDark() ? cluster.dark : cluster.light));

    function glowTexture() {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d");
      if (!ctx) return null;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.85)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    function ringTexture() {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d");
      if (!ctx) return null;
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(32, 32, 24, 0, Math.PI * 2);
      ctx.stroke();
      return new THREE.CanvasTexture(c);
    }

    const glow = glowTexture();
    const ring = ringTexture();

    function buildPoints(items: EmbeddingNode[], size: number, opacity: number, isProject: boolean) {
      const positions = new Float32Array(items.length * 3);
      const colors = new Float32Array(items.length * 3);
      items.forEach((item, i) => {
        const center = CLUSTER_CENTERS[item.cluster] ?? CLUSTER_CENTERS[0];
        const r = 2.6 * Math.cbrt(seeded(i * 3));
        const theta = seeded(i * 3 + 1) * Math.PI * 2;
        const phi = Math.acos(2 * seeded(i * 3 + 2) - 1);
        const spread = 3.2;
        positions[i * 3] = center.x + r * Math.sin(phi) * Math.cos(theta) * spread;
        positions[i * 3 + 1] = center.y + r * Math.sin(phi) * Math.sin(theta) * spread * 0.7;
        positions[i * 3 + 2] = center.z + r * Math.cos(phi) * 2;
        const col = clusterColors[item.cluster] ?? clusterColors[0];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size,
        map: glow ?? undefined,
        vertexColors: true,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      const pts = new THREE.Points(geo, mat);
      pts.userData = { items, isProject };
      return pts;
    }

    function buildLines(pts: THREE.Points) {
      const pos = pts.geometry.attributes.position;
      const count = pts.userData.items.length as number;
      const arr: number[] = [];
      for (let i = 0; i < count; i++) {
        const neighbors: Array<{ j: number; d: number }> = [];
        for (let j = 0; j < count; j++) {
          if (i === j) continue;
          const dx = pos.getX(i) - pos.getX(j);
          const dy = pos.getY(i) - pos.getY(j);
          const dz = pos.getZ(i) - pos.getZ(j);
          neighbors.push({ j, d: dx * dx + dy * dy + dz * dz });
        }
        neighbors.sort((a, b) => a.d - b.d);
        neighbors.slice(0, 2).forEach(({ j }) => {
          arr.push(pos.getX(i), pos.getY(i), pos.getZ(i));
          arr.push(pos.getX(j), pos.getY(j), pos.getZ(j));
        });
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
      return new THREE.LineSegments(g, lineMaterial());
    }

    function lineMaterial() {
      return new THREE.LineBasicMaterial({
        color: isDark() ? 0x3a3a44 : 0xd4d4d8,
        transparent: true,
        opacity: isDark() ? 0.5 : 0.7,
      });
    }

    const group = new THREE.Group();
    const skillPoints = buildPoints(nodes, 0.32, isDark() ? 0.8 : 0.9, false);
    const projectPoints = buildPoints(projects, 0.72, 1, true);
    const skillMaterial = skillPoints.material as THREE.PointsMaterial;
    const projectMaterial = projectPoints.material as THREE.PointsMaterial;
    const lines = buildLines(skillPoints);
    group.add(skillPoints, projectPoints, lines);
    scene.add(group);

    const highlight = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: ring ?? undefined,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    highlight.scale.setScalar(1.8);
    highlight.visible = false;
    scene.add(highlight);

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.55;
    const pointer = new THREE.Vector2();
    let hovered: { pts: THREE.Points; index: number; point: THREE.Vector3 } | null = null;

    const niName = inspectorEl.querySelector<HTMLElement>("[data-role='name']");
    const niKind = inspectorEl.querySelector<HTMLElement>("[data-role='kind']");
    const niCluster = inspectorEl.querySelector<HTMLElement>("[data-role='cluster']");
    const niDot = inspectorEl.querySelector<HTMLElement>("[data-role='dot']");
    const niLink = inspectorEl.querySelector<HTMLAnchorElement>("[data-role='link']");

    function pick(): { pts: THREE.Points; index: number; point: THREE.Vector3 } | null {
      raycaster.setFromCamera(pointer, camera);
      const targets = [projectPoints, skillPoints];
      for (const pts of targets) {
        const found = raycaster.intersectObject(pts);
        if (found.length && found[0].index !== undefined) {
          return { pts, index: found[0].index, point: found[0].point };
        }
      }
      return null;
    }

    function updateHover() {
      hovered = pick();
      if (hovered) {
        const item = hovered.pts.userData.items[hovered.index] as EmbeddingNode | EmbeddingProject;
        const cluster = CLUSTERS[item.cluster] ?? CLUSTERS[0];
        highlight.position.copy(hovered.point);
        highlight.visible = true;
        if (niName) niName.textContent = item.label;
        if (niKind) niKind.textContent = hovered.pts.userData.isProject ? "project" : "skill";
        if (niCluster) niCluster.textContent = cluster.name;
        if (niDot) niDot.style.background = isDark() ? cluster.dark : cluster.light;
        const href = "href" in item ? (item as EmbeddingProject).href : undefined;
        if (niLink) {
          niLink.style.display = href ? "inline-flex" : "none";
          if (href) niLink.href = href;
        }
        inspectorEl.classList.add("visible");
      } else {
        hovered = null;
        highlight.visible = false;
        inspectorEl.classList.remove("visible");
      }
    }

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let rotY = 0;
    let rotX = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    function handlePointerDown(e: PointerEvent) {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvasEl.setPointerCapture(e.pointerId);
      canvasEl.classList.add("dragging");
    }
    function handlePointerUp(e: PointerEvent) {
      dragging = false;
      canvasEl.releasePointerCapture(e.pointerId);
      canvasEl.classList.remove("dragging");
    }
    function handlePointerCancel() {
      dragging = false;
      canvasEl.classList.remove("dragging");
    }
    function handlePointerMove(e: PointerEvent) {
      const rect = canvasEl.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (dragging) {
        targetRotY += (e.clientX - lastX) * 0.005;
        targetRotX += (e.clientY - lastY) * 0.003;
        targetRotX = Math.max(-0.7, Math.min(0.7, targetRotX));
        lastX = e.clientX;
        lastY = e.clientY;
      }
    }

    canvasEl.addEventListener("pointerdown", handlePointerDown);
    canvasEl.addEventListener("pointerup", handlePointerUp);
    canvasEl.addEventListener("pointercancel", handlePointerCancel);
    canvasEl.addEventListener("pointermove", handlePointerMove);

    function scaleForWidth(w: number) {
      if (w < 520) return 0.5;
      if (w < 768) return 0.65;
      if (w < 1120) return 0.85;
      if (w < 1600) return 1.1;
      return 1.3;
    }

    function resize() {
      const w = canvasEl.clientWidth;
      const h = canvasEl.clientHeight;
      if (!w || !h) return;
      const scale = scaleForWidth(w);
      skillMaterial.size = 0.65 * scale;
      projectMaterial.size = 1.4 * scale;
      raycaster.params.Points.threshold = 0.85 * scale;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvasEl);
    resize();

    function recolorPoints(pts: THREE.Points) {
      const colorAttr = pts.geometry.attributes.color as THREE.BufferAttribute;
      const items = pts.userData.items as EmbeddingNode[];
      for (let i = 0; i < items.length; i++) {
        const color = clusterColors[items[i].cluster] ?? clusterColors[0];
        colorAttr.setXYZ(i, color.r, color.g, color.b);
      }
      colorAttr.needsUpdate = true;
    }

    function updateTheme() {
      clusterColors.forEach((color, i) => {
        color.set(isDark() ? CLUSTERS[i].dark : CLUSTERS[i].light);
      });
      recolorPoints(skillPoints);
      recolorPoints(projectPoints);
      (lines.material as THREE.LineBasicMaterial).color.set(isDark() ? 0x3a3a44 : 0xd4d4d8);
      (lines.material as THREE.LineBasicMaterial).opacity = isDark() ? 0.5 : 0.7;
      if (niDot && hovered) {
        const item = hovered.pts.userData.items[hovered.index] as EmbeddingNode;
        const cluster = CLUSTERS[item.cluster] ?? CLUSTERS[0];
        niDot.style.background = isDark() ? cluster.dark : cluster.light;
      }
    }
    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const timer = new THREE.Timer();
    let raf = 0;
    let scrollValue = 0;
    const heroSection = canvasEl.closest(".hero-section") as HTMLElement | null;

    function getScrollProgress() {
      if (!heroSection) return 0;
      const rect = heroSection.getBoundingClientRect();
      const heroH = rect.height;
      if (heroH <= 0) return 0;
      const progress = Math.max(0, Math.min(1, -rect.top / heroH));
      return progress;
    }

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = timer.getElapsed();
      const target = getScrollProgress();
      scrollValue += (target - scrollValue) * 0.12;
      if (!dragging && !reduceMotion) targetRotY += 0.0012;
      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;
      group.rotation.y = rotY + scrollValue * 0.35;
      group.rotation.x = rotX;
      const baseScale = 1 + Math.sin(t * 0.6) * 0.015;
      group.scale.setScalar(baseScale + scrollValue * 0.1);
      group.position.z = -scrollValue * 2;
      updateHover();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      canvasEl.removeEventListener("pointerdown", handlePointerDown);
      canvasEl.removeEventListener("pointerup", handlePointerUp);
      canvasEl.removeEventListener("pointercancel", handlePointerCancel);
      canvasEl.removeEventListener("pointermove", handlePointerMove);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Points || obj instanceof THREE.LineSegments || obj instanceof THREE.Sprite) {
          obj.geometry.dispose();
          const material = obj.material as THREE.Material | THREE.Material[];
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });
    };
  }, [nodes, projects]);

  if (!webglOk) {
    return null;
  }

  return (
    <div ref={containerRef} className={`embedding-space ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="embedding-space__canvas" />
      <aside ref={inspectorRef} className="node-inspector" aria-hidden="true">
        <div className="node-inspector__name" data-role="name" />
        <div className="node-inspector__kind" data-role="kind" />
        <div className="node-inspector__cluster">
          <span className="node-inspector__dot" data-role="dot" />
          <span data-role="cluster" />
        </div>
        <a className="node-inspector__link" data-role="link" href="#" style={{ display: "none" }}>
          Open project
        </a>
      </aside>
    </div>
  );
}
