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
