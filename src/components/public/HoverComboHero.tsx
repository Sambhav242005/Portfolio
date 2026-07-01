"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { animate, createDraggable, stagger, type Draggable, type JSAnimation } from "animejs";
import { useReducedMotion } from "motion/react";

interface HoverComboHeroProps {
  className?: string;
}

const DOT_COLS = 28;
const DOT_ROWS = 18;
const CELL_COUNT = 12;

const chips = ["Agents", "Vision", "PyTorch", "FastAPI", "RAG", "WebGPU"];

const chipLayouts = [
  [
    ["12%", "18%"],
    ["64%", "13%"],
    ["28%", "73%"],
    ["76%", "68%"],
    ["43%", "31%"],
    ["52%", "84%"],
  ],
  [
    ["18%", "66%"],
    ["72%", "26%"],
    ["36%", "17%"],
    ["68%", "78%"],
    ["17%", "34%"],
    ["47%", "58%"],
  ],
  [
    ["68%", "16%"],
    ["22%", "24%"],
    ["76%", "58%"],
    ["31%", "79%"],
    ["49%", "38%"],
    ["58%", "73%"],
  ],
];

export function HoverComboHero({ className = "" }: HoverComboHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<HTMLSpanElement[]>([]);
  const cellRefs = useRef<HTMLSpanElement[]>([]);
  const chipRefs = useRef<HTMLSpanElement[]>([]);
  const animationsRef = useRef<JSAnimation[]>([]);
  const draggablesRef = useRef<Draggable[]>([]);
  const layoutIndexRef = useRef(0);
  const waterFrameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const activeCellRef = useRef<number | null>(null);
  const reduce = useReducedMotion();

  const dots = useMemo(
    () => Array.from({ length: DOT_COLS * DOT_ROWS }, (_, index) => index),
    [],
  );

  const setActiveCell = useCallback((index: number | null) => {
    if (activeCellRef.current === index) return;

    const previous = activeCellRef.current;
    if (previous !== null) {
      cellRefs.current[previous]?.classList.remove("is-active");
    }

    if (index !== null) {
      cellRefs.current[index]?.classList.add("is-active");
    }

    activeCellRef.current = index;
  }, []);

  const shuffleChips = useCallback(() => {
    if (reduce) return;

    layoutIndexRef.current = (layoutIndexRef.current + 1) % chipLayouts.length;
    const layout = chipLayouts[layoutIndexRef.current];

    chipRefs.current.forEach((chip, index) => {
      const target = layout[index];
      if (!chip || !target) return;

      animate(chip, {
        left: target[0],
        top: target[1],
        rotate: [-2, 0],
        duration: 720,
        delay: index * 34,
        ease: "outElastic(1, .75)",
      });
    });
  }, [reduce]);

  const renderWaterDrop = useCallback(() => {
    const root = rootRef.current;
    if (!root || reduce) return;

    const rect = root.getBoundingClientRect();
    const radius = Math.min(rect.width, rect.height) * 0.32;
    const pointer = pointerRef.current;

    dotRefs.current.forEach((dot, index) => {
      if (!dot) return;

      const col = index % DOT_COLS;
      const row = Math.floor(index / DOT_COLS);
      const x = ((col + 0.5) / DOT_COLS) * rect.width;
      const y = ((row + 0.5) / DOT_ROWS) * rect.height;
      const distance = pointer.active ? Math.hypot(pointer.x - x, pointer.y - y) : radius;
      const proximity = Math.max(0, 1 - distance / radius);
      const eased = proximity * proximity * (3 - 2 * proximity);
      const scale = 1 + eased * 2.35;
      const opacity = 0.34 + eased * 0.48;

      dot.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      dot.style.opacity = opacity.toFixed(3);
    });

    waterFrameRef.current = null;
  }, [reduce]);

  const scheduleWaterDrop = useCallback((x: number, y: number, active = true) => {
    pointerRef.current = { x, y, active };

    if (waterFrameRef.current !== null) return;
    waterFrameRef.current = window.requestAnimationFrame(renderWaterDrop);
  }, [renderWaterDrop]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;

    const dots = dotRefs.current.filter(Boolean);
    const cells = cellRefs.current.filter(Boolean);
    const chips = chipRefs.current.filter(Boolean);

    animationsRef.current.push(
      animate(dots, {
        opacity: [0, 0.38],
        duration: 850,
        delay: stagger(8, { grid: [DOT_COLS, DOT_ROWS], from: "center" }),
        ease: "outQuad",
      }),
      animate(cells, {
        opacity: [0, 1],
        duration: 700,
        delay: stagger(26, { from: "center" }),
        ease: "outQuad",
      }),
      animate(chips, {
        opacity: [0, 1],
        y: [14, 0],
        duration: 740,
        delay: stagger(55),
        ease: "outElastic(1, .75)",
      }),
      animate(root.querySelectorAll(".combo-hero__orb"), {
        x: ["-4%", "4%"],
        y: ["3%", "-3%"],
        duration: 5200,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      }),
    );

    draggablesRef.current = chips.map((chip) =>
      createDraggable(chip, {
        container: root,
        containerPadding: 14,
        releaseEase: "outElastic(1, .7)",
        releaseContainerFriction: 0.55,
        cursor: { onHover: "grab", onGrab: "grabbing" },
        onGrab: () => {
          animate(chip, { scale: 1.06, duration: 180, ease: "outQuad" });
        },
        onRelease: () => {
          animate(chip, { scale: 1, duration: 420, ease: "outElastic(1, .75)" });
        },
      }),
    );

    const handlePointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      root.style.setProperty("--pointer-x", `${(x / rect.width) * 100}%`);
      root.style.setProperty("--pointer-y", `${(y / rect.height) * 100}%`);
      scheduleWaterDrop(x, y);

      const column = Math.min(3, Math.max(0, Math.floor((x / rect.width) * 4)));
      const row = Math.min(2, Math.max(0, Math.floor((y / rect.height) * 3)));
      setActiveCell(row * 4 + column);
    };

    const handlePointerLeave = () => {
      root.style.removeProperty("--pointer-x");
      root.style.removeProperty("--pointer-y");
      scheduleWaterDrop(0, 0, false);
      setActiveCell(null);
    };

    root.addEventListener("pointermove", handlePointerMove, { capture: true, passive: true });
    root.addEventListener("pointerleave", handlePointerLeave);
    root.addEventListener("pointerenter", shuffleChips);

    const shuffleTimer = window.setInterval(shuffleChips, 5200);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove, { capture: true });
      root.removeEventListener("pointerleave", handlePointerLeave);
      root.removeEventListener("pointerenter", shuffleChips);
      window.clearInterval(shuffleTimer);
      if (waterFrameRef.current !== null) {
        window.cancelAnimationFrame(waterFrameRef.current);
      }
      draggablesRef.current.forEach((draggable) => draggable.revert());
      animationsRef.current.forEach((animation) => animation.revert());
      animationsRef.current = [];
      draggablesRef.current = [];
    };
  }, [reduce, scheduleWaterDrop, setActiveCell, shuffleChips]);

  return (
    <div ref={rootRef} className={`combo-hero ${className}`} aria-hidden="true">
      <span className="combo-hero__orb combo-hero__orb--one" />
      <span className="combo-hero__orb combo-hero__orb--two" />

      <div className="combo-hero__cells">
        {Array.from({ length: CELL_COUNT }, (_, index) => (
          <span
            className="combo-hero__cell"
            key={index}
            ref={(node) => {
              if (node) cellRefs.current[index] = node;
            }}
          />
        ))}
      </div>

      <div className="combo-hero__dots">
        {dots.map((index) => (
          <span
            className="combo-hero__dot"
            data-index={index}
            key={index}
            ref={(node) => {
              if (node) dotRefs.current[index] = node;
            }}
            style={{
              left: `${(((index % DOT_COLS) + 0.5) / DOT_COLS) * 100}%`,
              top: `${((Math.floor(index / DOT_COLS) + 0.5) / DOT_ROWS) * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="combo-hero__core">
        <span />
        <span />
      </div>

      <div className="combo-hero__chips">
        {chips.map((label, index) => (
          <span
            className="combo-hero__chip"
            key={label}
            ref={(node) => {
              if (node) chipRefs.current[index] = node;
            }}
            style={{
              left: chipLayouts[0][index][0],
              top: chipLayouts[0][index][1],
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
