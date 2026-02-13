import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GoArrowUpRight } from 'react-icons/go';
import { Link } from 'react-router-dom';

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
  external?: boolean;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo?: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  onContactClick?: () => void;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;


const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  menuColor = '#E63946',
  buttonBgColor = '#E63946',
  buttonTextColor = '#fff',
  onContactClick,
  buttonLabel = 'Contáctame',
  onButtonClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef      = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement[]>([]);
  const tlRef       = useRef<any>(null);
  const [mobile]    = useState(() => isMobile());

  useEffect(() => {
    if (mobile) return;

    const init = async () => {
      const { gsap } = await import('gsap');
      const navEl = navRef.current;
      if (!navEl) return;

      gsap.set(navEl, { height: 60, overflow: 'hidden' });
      gsap.set(cardsRef.current, { y: 50, opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(navEl,            { height: 260, duration: 0.4, ease });
      tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');
      tlRef.current = tl;
    };

    init();

    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, [mobile, ease]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;

      if (!mobile && tlRef.current) {
        if (next) {
          tlRef.current.play(0);
        } else {
          tlRef.current.reverse();
        }
      }

      return next;
    });
  }, [mobile]);

  const handleLinkClick = useCallback((href: string, e: React.MouseEvent) => {
    if (href === '/contacto' && onContactClick) {
      e.preventDefault();
      onContactClick();
      toggleMenu();
      return;
    }
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      toggleMenu();
      return;
    }
    if (href.startsWith('http') || href.startsWith('mailto:')) {
      toggleMenu();
    }
  }, [onContactClick, toggleMenu]);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`card-nav-container absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[99] top-[1.2em] md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`
          block p-0 rounded-xl relative
          bg-white/5 backdrop-blur-lg
          ${mobile
            ? 'overflow-hidden'
            : 'will-change-[height]'
          }
        `}
        style={mobile ? undefined : { height: 60, overflow: 'hidden' }}
      >
        {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
        <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">

          {/* Hamburger */}
          <div
            className="group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2 md:order-none"
            onClick={toggleMenu}
            role="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && toggleMenu()}
            style={{ color: menuColor }}
          >
            <div
              className={`w-[30px] h-[2px] bg-current transition-transform duration-300 origin-center ${
                isOpen ? 'translate-y-[4px] rotate-45' : ''
              }`}
            />
            <div
              className={`w-[30px] h-[2px] bg-current transition-transform duration-300 origin-center ${
                isOpen ? '-translate-y-[4px] -rotate-45' : ''
              }`}
            />
          </div>

          {/* Logo */}
          <div className="flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none">
            {logo ? (
              <img src={logo} alt={logoAlt} className="h-[28px]" />
            ) : (
              <Link
                to="/"
                onClick={() => isOpen && toggleMenu()}
                className="text-white/90 font-bold text-lg tracking-tight"
              >
                JE<span style={{ color: menuColor }}>.</span>
              </Link>
            )}
          </div>

          {/* CTA desktop */}
          <button
            type="button"
            onClick={onButtonClick || onContactClick}
            className="hidden md:inline-flex border-0 rounded-[calc(0.75rem-0.2rem)] px-4 items-center h-full font-medium cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,57,70,0.4)]"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            {buttonLabel}
          </button>
        </div>

        {/* ── CARDS CONTENT ────────────────────────────────────────────────── */}
        {mobile ? (
          <div
            ref={contentRef}
            className="transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden"
            style={{
              maxHeight: isOpen ? '600px' : '0px',
              opacity:   isOpen ? 1 : 0,
              marginTop: '60px',
            }}
            aria-hidden={!isOpen}
          >
            <div className="flex flex-col gap-2 p-2">
              {items.slice(0, 3).map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className="flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-h-[60px]"
                  style={{ backgroundColor: item.bgColor, color: item.textColor }}
                >
                  <div className="font-normal tracking-[-0.5px] text-[18px]">
                    {item.label}
                  </div>
                  <div className="mt-auto flex flex-col gap-[2px]">
                    {item.links?.map((lnk, i) => (
                      <a
                        key={`${lnk.label}-${i}`}
                        className="inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-200 hover:opacity-75 active:opacity-60 text-[15px]"
                        href={lnk.href}
                        onClick={e => handleLinkClick(lnk.href, e)}
                        aria-label={lnk.ariaLabel}
                        target={lnk.href.startsWith('http') ? '_blank' : undefined}
                        rel={lnk.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        <GoArrowUpRight className="shrink-0" aria-hidden="true" />
                        {lnk.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className={`absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-row items-end gap-[12px] z-[1] ${
              isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
            }`}
            aria-hidden={!isOpen}
          >
            {items.slice(0, 3).map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] flex-[1_1_0%] h-full transition-transform duration-300 hover:scale-[1.02]"
                ref={setCardRef(idx)}
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
              >
                <div className="font-normal tracking-[-0.5px] text-[22px]">
                  {item.label}
                </div>
                <div className="mt-auto flex flex-col gap-[2px]">
                  {item.links?.map((lnk, i) => (
                    <a
                      key={`${lnk.label}-${i}`}
                      className="inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[16px]"
                      href={lnk.href}
                      onClick={e => handleLinkClick(lnk.href, e)}
                      aria-label={lnk.ariaLabel}
                      target={lnk.href.startsWith('http') ? '_blank' : undefined}
                      rel={lnk.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <GoArrowUpRight className="shrink-0" aria-hidden="true" />
                      {lnk.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
};

export default CardNav;