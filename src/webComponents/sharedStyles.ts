import { css } from "lit";

export const formSelectStyles = css`
  select {
    font: inherit;
    color: inherit;
    line-height: 1.5rem;
    display: block;
    width: 100%;
    margin: 0;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
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
    border-color: var(--color-primary-mint-cream);
    outline: 1px solid var(--color-gray);
  }
`;

export const ButtonStyles = css`
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

    display: inline-block;
    font: inherit;
    line-height: 1.5rem;
    padding: var(--base-padding);
    cursor: pointer;
    border-radius: 1.5rem;
  }
  .primary {
    background-color: var(--primary-background-color);
    border: 1px solid var(--primary-background-color);
    color: var(--primary-color);
  }
  .primary:hover,
  .primary:active {
    color: var(--primary-color-hover);
    background-color: var(--primary-background-color-hover);
    border-color: var(--primary-border-color-hover);
  }
  .primary:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(var(--primary-box-shadow-color-rgb), 0.5);
  }
  .secondary {
    background-color: var(--secondary-background-color);
    border: 2px solid var(--secondary-border-color);
    color: var(--secondary-color);
  }
  .secondary:hover,
  .secondary:active {
    color: var(--secondary-color-hover);
    background-color: var(--secondary-background-color-hover);
    border-color: var(--secondary-border-color-hover);
  }
  .secondary:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(var(--secondary-box-shadow-color-rgb), 0.5);
  }
  .primary:active,
  .secondary:active {
    scale: 95% 95%;
    transition-property: scale;
    transition-timing-function: ease-out;
    transition-duration: 0.3s;
  }
`;
