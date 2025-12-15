import { css } from "lit";

// js is used for breakpoints because
// css variables do not work with media queries
export const breakpointsREM = {
  extraSmall: 24, // 384 pixels
  small: 28, // 448 pixels
  medium: 32, // 512 pixels
  large: 40, // 640 pixels
  extraLarge: 48, // 768 pixels
};

export const formControlStyles = css`
  select {
    font: inherit;
    color: inherit;
    line-height: 1.5rem;
    display: block;
    width: 100%;
    margin: 0;
    padding: 0.375rem 2.25rem 0.375rem 0.75rem;
    background-color: var(--color-primary-mint-cream);
    border: 1px solid var(--color-light-gray);
    border-radius: 1.5rem;
    print-color-adjust: exact;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='oklch(55.1%25 0.027 264.364)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
  }
  select:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
  input {
    display: block;
    width: 100%;
    font: inherit;
    color: inherit;
    line-height: 1.5rem;
    padding: 0.375rem 0.75rem;
    background-color: var(--color-primary-mint-cream);
    border: 1px solid var(--color-light-gray);
    border-radius: 1.5rem;
  }
  input:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
  input:-webkit-autofill,
  input:-webkit-autofill:focus {
    transition:
      background-color 0s 600000s,
      color 0s 600000s !important;
  }
`;

export const buttonStyles = css`
  button {
    --base-padding: 0.25rem 1rem;

    --primary-color: var(--color-primary-mint-cream);
    --primary-background-color: var(--color-primary-bright-pink);
    --primary-border-color: var(--color-primary-bright-pink);
    --primary-box-shadow-color-rgb: var(--color-primary-mint-cream-rgb);

    --primary-color-hover: var(--color-primary-mint-cream);
    --primary-background-color-hover: var(
      --color-primary-bright-pink-darker-one
    );
    --primary-border-color-hover: var(--color-primary-bright-pink-darker-two);

    --secondary-color: var(--color-primary-bright-pink);
    --secondary-background-color: var(--color-primary-mint-cream);
    --secondary-border-color: var(--color-primary-bright-pink);
    --secondary-box-shadow-color-rgb: var(--color-primary-mint-cream-rgb);

    --secondary-color-hover: var(--color-primary-bright-pink-darker-two);
    --secondary-background-color-hover: var(
      --color-primary-mint-cream-darker-one
    );
    --secondary-border-color-hover: var(--color-primary-bright-pink-darker-two);

    --svg-icon-container-box-shadow-color-rgb: var(
      --color-primary-mint-cream-rgb
    );

    display: inline-block;
    font: inherit;
    line-height: 1.5rem;
    padding: var(--base-padding);
    cursor: pointer;
    border-radius: 1.5rem;
  }
  button.primary {
    background-color: var(--primary-background-color);
    border: 1px solid var(--primary-background-color);
    color: var(--primary-color);
  }
  button.primary:hover,
  button.primary:active {
    color: var(--primary-color-hover);
    background-color: var(--primary-background-color-hover);
    border-color: var(--primary-border-color-hover);
  }
  button.primary:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(var(--primary-box-shadow-color-rgb), 0.5);
  }
  button.secondary {
    background-color: var(--secondary-background-color);
    border: 2px solid var(--secondary-border-color);
    color: var(--secondary-color);
  }
  button.secondary:hover,
  button.secondary:active {
    color: var(--secondary-color-hover);
    background-color: var(--secondary-background-color-hover);
    border-color: var(--secondary-border-color-hover);
  }
  button.secondary:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(var(--secondary-box-shadow-color-rgb), 0.5);
  }
  button.primary:active,
  button.secondary:active {
    scale: 95% 95%;
    transition-property: scale;
    transition-timing-function: ease-out;
    transition-duration: 0.3s;
  }
  button.svg-icon-container {
    all: initial;
    font: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button.svg-icon-container:focus-visible {
    outline: none;
    box-shadow: 0 0 0 0.2rem
      rgba(var(--svg-icon-container-box-shadow-color-rgb), 0.5);
  }
  button.svg-icon-container svg {
    width: 2rem;
    height: 2rem;
  }
`;

export const hyperlinkStyles = css`
  a {
    color: var(--color-primary-bright-pink);
  }
  a:hover {
    box-shadow: 0 0 0 0.2rem rgba(var(--color-primary-bright-pink-rgb), 0.4);
  }
  a:focus-visible {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(var(--color-primary-bright-pink-rgb), 0.4);
  }
  a:active {
    color: var(--color-primary-bright-pink-darker-one);
  }
  a:visited {
    color: var(--color-primary-bright-pink-darker-two);
  }
`;
