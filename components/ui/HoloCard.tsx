'use client';

import React, { useRef, useState } from 'react';
import './HoloCard.css';

export interface HoloCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tiltMax?: number;
  className?: string;
}

export const HoloCard: React.FC<HoloCardProps> = ({
  children,
  tiltMax = 12,
  className = '',
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -tiltMax;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * tiltMax;

    card.style.setProperty('--mouse-x', `${percentX}%`);
    card.style.setProperty('--mouse-y', `${percentY}%`);
    card.style.setProperty('--holo-pos-x', `${percentX * 1.5}%`);
    card.style.setProperty('--holo-pos-y', `${percentY * 1.5}%`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--glare-opacity', '1');
    card.style.setProperty('--holo-opacity', '0.75');
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--glare-opacity', '0');
    card.style.setProperty('--holo-opacity', '0');
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`holo-card ${className}`.trim()}
      style={style}
      {...props}
    >
      <div className="holo-card__glare" />
      <div className="holo-card__holo" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default HoloCard;
