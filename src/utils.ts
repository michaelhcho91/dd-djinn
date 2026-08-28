import djinnData from "../resources/djinnData.json";

export const matchPathElement = (path: string) => {
  const elements = Object.keys(djinnData);
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (path.includes(element)) return element;
  }
};

export const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const randomVelocity = (minSpeed = 40, maxSpeed = 60) => {
  const angle = random(0, Math.PI * 2);
  const speed = random(minSpeed, maxSpeed);

  return {
    velocityX: Math.cos(angle) * speed,
    velocityY: Math.sin(angle) * speed,
  };
};

export const getDjinnGifUrls = () => {
  const gifModules = import.meta.glob("./assets/gifs/*.{gif,GIF}", {
    eager: true,
    query: "?url",
    import: "default",
  });

  return Object.values(gifModules) as string[];
};
