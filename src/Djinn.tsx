import { useEffect, useRef } from "react";
import { getDjinnGifUrls, random, randomVelocity } from "./utils";
import "./Djinn.css";

type Djinni = {
  gif: HTMLImageElement;
  size: number;
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
  nextDirectionChange: number;
};

type Djinn = {
  /** Put the GIF layer behind or above the rest of the page. */
  layer?: "background" | "foreground";
};

const Djinn = ({ layer = "background" }: Djinn) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const djinnGifUrls = getDjinnGifUrls();

  useEffect(() => {
    const container = layerRef.current;
    if (!container) return;

    const djinn: Djinni[] = djinnGifUrls.map((url) => {
      const size = random(42, 84);
      const { velocityX, velocityY } = randomVelocity();
      const gif = document.createElement("img");

      gif.className = "djinn";
      gif.src = url;
      gif.alt = "";
      gif.setAttribute("aria-hidden", "true");
      gif.style.width = `${size}px`;
      gif.style.height = `${size}px`;
      container.appendChild(gif);

      return {
        gif,
        size,
        positionX: random(0, Math.max(0, window.innerWidth - size)),
        positionY: random(0, Math.max(0, window.innerHeight - size)),
        velocityX,
        velocityY,
        nextDirectionChange: performance.now() + random(700, 3500),
      };
    });

    let animationFrameId = 0;
    let previousTime = performance.now();

    const animate = (now: number) => {
      const deltaSeconds = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;

      for (const djinni of djinn) {
        if (now >= djinni.nextDirectionChange) {
          const { velocityX, velocityY } = randomVelocity();
          djinni.velocityX = velocityX;
          djinni.velocityY = velocityY;
          djinni.nextDirectionChange = now + random(700, 3500);
        }

        djinni.positionX += djinni.velocityX * deltaSeconds;
        djinni.positionY += djinni.velocityY * deltaSeconds;

        const maxX = Math.max(0, window.innerWidth - djinni.size);
        const maxY = Math.max(0, window.innerHeight - djinni.size);

        if (djinni.positionX <= 0) {
          djinni.positionX = 0;
          djinni.velocityX = Math.abs(djinni.velocityX);
        } else if (djinni.positionX >= maxX) {
          djinni.positionX = maxX;
          djinni.velocityX = -Math.abs(djinni.velocityX);
        }

        if (djinni.positionY <= 0) {
          djinni.positionY = 0;
          djinni.velocityY = Math.abs(djinni.velocityY);
        } else if (djinni.positionY >= maxY) {
          djinni.positionY = maxY;
          djinni.velocityY = -Math.abs(djinni.velocityY);
        }

        const facingScale = djinni.velocityX < 0 ? -1 : 1;

        djinni.gif.style.transform = `translate3d(${djinni.positionX}px, ${djinni.positionY}px, 0) scaleX(${facingScale})`;
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      container.replaceChildren();
    };
  });

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className={`djinn-layer djinn-layer--${layer}`}
    />
  );
};

export default Djinn;
