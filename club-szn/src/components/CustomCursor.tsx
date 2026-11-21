import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointedGroupRef = useRef<SVGGElement>(null);
  const hoverGroupRef = useRef<SVGGElement>(null);
  const innerWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const pointedGroup = pointedGroupRef.current;
    const hoverGroup = hoverGroupRef.current;
    const innerWrapper = innerWrapperRef.current;
    if (!cursor || !pointedGroup || !hoverGroup || !innerWrapper) return;

    // Add class to body to hide system cursor only once custom cursor initializes
    document.body.classList.add('custom-cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isHovered = false;
    let isClicking = false;
    let hasMoved = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        currentX = mouseX;
        currentY = mouseY;
        cursor.style.opacity = '1';
      }
    };

    const updatePosition = () => {
      // 0.45 lerp gives an ultra-crisp, snappy follow with zero noticeable lag
      currentX += (mouseX - currentX) * 0.45;
      currentY += (mouseY - currentY) * 0.45;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(updatePosition);
    };
    rafId = requestAnimationFrame(updatePosition);

    const onMouseDown = () => {
      isClicking = true;
      innerWrapper.style.transform = 'scale(0.82)';
    };

    const onMouseUp = () => {
      isClicking = false;
      innerWrapper.style.transform = isHovered ? 'scale(1.15)' : 'scale(1)';
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]), .cursor-pointer, [data-cursor-hover], label, .ticket-card, .event-card'
      );

      const nextHover = Boolean(interactive);
      if (nextHover !== isHovered) {
        isHovered = nextHover;

        if (isHovered) {
          // Pointed corner brackets fade & rotate out
          pointedGroup.style.opacity = '0';
          pointedGroup.style.transform = 'rotate(45deg) scale(0.6)';

          // Hover diagonal X rays rotate & fade in
          hoverGroup.style.opacity = '1';
          hoverGroup.style.transform = 'rotate(0deg) scale(1)';

          if (!isClicking) innerWrapper.style.transform = 'scale(1.15)';
        } else {
          // Pointed corner brackets restore
          pointedGroup.style.opacity = '1';
          pointedGroup.style.transform = 'rotate(0deg) scale(1)';

          // Hover diagonal X rays hide
          hoverGroup.style.opacity = '0';
          hoverGroup.style.transform = 'rotate(-45deg) scale(0.6)';

          if (!isClicking) innerWrapper.style.transform = 'scale(1)';
        }
      }
    };

    const onMouseLeaveDoc = () => {
      cursor.style.opacity = '0';
    };

    const onMouseEnterDoc = () => {
      if (hasMoved) cursor.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveDoc);
    document.addEventListener('mouseenter', onMouseEnterDoc);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeaveDoc);
      document.removeEventListener('mouseenter', onMouseEnterDoc);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        zIndex: 999999,
        opacity: 0,
        transition: 'opacity 0.15s ease',
        willChange: 'transform',
      }}
    >
      <div
        ref={innerWrapperRef}
        className="relative flex items-center justify-center"
        style={{
          width: '32px',
          height: '32px',
          transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          filter: 'drop-shadow(0 0 1.5px #050505) drop-shadow(0 0 6px rgba(208, 0, 255, 0.75))',
        }}
      >
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Always centered precision dot */}
          <circle
            cx="16"
            cy="16"
            r="2"
            fill="#D000FF"
            stroke="#050505"
            strokeWidth="0.5"
          />

          {/* POINTED STATE: 4 Neat Corner Viewfinder Brackets */}
          <g
            ref={pointedGroupRef}
            style={{
              opacity: 1,
              transformOrigin: '16px 16px',
              transform: 'rotate(0deg) scale(1)',
              transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Top-Left Corner */}
            <path
              d="M 5 11 L 5 5 L 11 5"
              stroke="#D000FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Top-Right Corner */}
            <path
              d="M 21 5 L 27 5 L 27 11"
              stroke="#D000FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bottom-Left Corner */}
            <path
              d="M 5 21 L 5 27 L 11 27"
              stroke="#D000FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bottom-Right Corner */}
            <path
              d="M 21 27 L 27 27 L 27 21"
              stroke="#D000FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* HOVERING STATE: Diagonal "X" Reticle Rays */}
          <g
            ref={hoverGroupRef}
            style={{
              opacity: 0,
              transformOrigin: '16px 16px',
              transform: 'rotate(-45deg) scale(0.6)',
              transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Top-Left Diagonal Ray */}
            <line
              x1="6"
              y1="6"
              x2="12"
              y2="12"
              stroke="#D000FF"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Top-Right Diagonal Ray */}
            <line
              x1="26"
              y1="6"
              x2="20"
              y2="12"
              stroke="#D000FF"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Bottom-Left Diagonal Ray */}
            <line
              x1="6"
              y1="26"
              x2="12"
              y2="20"
              stroke="#D000FF"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Bottom-Right Diagonal Ray */}
            <line
              x1="26"
              y1="26"
              x2="20"
              y2="20"
              stroke="#D000FF"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
