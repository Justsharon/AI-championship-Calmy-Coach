import React, { useEffect } from "react";

interface ConfettiProps {
  trigger: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger }) => {
  useEffect(() => {
    if (!trigger) return;

    const root = document.createElement("div");
    root.style.position = "fixed";
    root.style.left = "0";
    root.style.top = "0";
    root.style.width = "100%";
    root.style.height = "100%";
    root.style.pointerEvents = "none";
    root.style.zIndex = "9999";

    const colors = [
      "#06b6d4",
      "#7c3aed",
      "#06b6d4",
      "#f97316",
      "#10b981",
      "#ef4444",
    ];

    for (let i = 0; i < 12; i++) {
      const el = document.createElement("div");
      const size = Math.floor(Math.random() * 10) + 6;
      el.style.width = `${size}px`;
      el.style.height = `${size * 0.6}px`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.position = "absolute";
      el.style.left = `${20 + Math.random() * 60}%`;
      el.style.top = `${40 + Math.random() * 20}%`;
      el.style.opacity = "0.95";
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      el.style.borderRadius = "2px";
      el.style.willChange = "transform, opacity";

      const anim = el.animate(
        [
          {
            transform: `translateY(0px) rotate(${Math.random() * 360}deg)`,
            opacity: 1,
          },
          {
            transform: `translateY(${180 + Math.random() * 180}px) rotate(${
              Math.random() * 720
            }deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 900 + Math.random() * 700,
          easing: "cubic-bezier(.2,.7,.2,1)",
        }
      );

      root.appendChild(el);
      anim.onfinish = () => el.remove();
    }

    document.body.appendChild(root);
    const t = setTimeout(() => {
      root.remove();
    }, 2200);

    return () => {
      clearTimeout(t);
      root.remove();
    };
  }, [trigger]);

  return null;
};
