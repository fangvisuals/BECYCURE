import React from 'react';
import { Link } from 'react-router-dom';

// Reusable animated CTA button: supports internal link, external link, or onClick
export default function CTAButton({
  label = 'Contact',
  to,            // internal route
  href,          // external link
  onClick,       // action handler
  newTab = false,
  className = '',
  variant = 'fluid', // 'original' | 'card' | 'fluid'
  ...rest
}) {
  const commonClasses = [
    'group relative overflow-hidden rounded-lg border font-inter font-bold select-none align-middle',
    'bg-white/5 bg-blur-lg border-white/10 text-grey/90',
    'hover:text-green-300 hover:border-green-300',
    'duration-500 before:duration-500 after:duration-500',
    "before:absolute before:w-12 before:h-12 before:content-[''] before:right-1 before:top-1 before:z-10 before:bg-green-500 before:rounded-full before:blur-lg",
    'hover:before:right-12 hover:before:-bottom-8 hover:before:[box-shadow:_20px_20px_20px_30px_#40ffaa]',
    "after:absolute after:z-10 after:w-20 after:h-20 after:content-[''] after:bg-green-300 after:right-8 after:top-3 after:rounded-full after:blur-lg",
    'hover:after:-right-8',
  ];

  let sizeClasses;
  if (variant === 'original') {
    sizeClasses = ['inline-flex', 'items-center', 'justify-start', 'h-14', 'w-64', 'text-left', 'px-3', 'text-base'];
  } else if (variant === 'card') {
    // Smaller, left-aligned text with extra right padding to showcase gradients
    sizeClasses = ['inline-flex', 'items-center', 'justify-start', 'text-left', 'text-sm', 'px-4', 'pr-14', 'py-2', 'min-w-[18ch]'];
  } else {
    // fluid default: balanced, but still left-aligned with some right space
    sizeClasses = ['inline-flex', 'items-center', 'justify-start', 'text-left', 'text-base', 'px-5', 'pr-12', 'py-3', 'min-w-[14ch]'];
  }

  const baseClasses = [...commonClasses, ...sizeClasses, className].join(' ');
  const textClasses = ['relative', 'z-20', 'leading-none'];
  if (variant === 'original') textClasses.push('underline-anim');

  // Default to contact page if nothing provided
  const defaultTo = '/contact';

  if (href) {
    return (
      <a
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className={baseClasses}
        aria-label={typeof label === 'string' ? label : undefined}
        {...rest}
      >
        <span className={textClasses.join(' ')}>{label}</span>
      </a>
    );
  }

  if (to || (!href && !onClick)) {
    return (
      <Link
        to={to || defaultTo}
        aria-label={typeof label === 'string' ? label : undefined}
        className={baseClasses}
        {...rest}
      >
        <span className={textClasses.join(' ')}>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClasses}
      aria-label={typeof label === 'string' ? label : undefined}
      {...rest}
    >
      <span className={textClasses.join(' ')}>{label}</span>
    </button>
  );
}
