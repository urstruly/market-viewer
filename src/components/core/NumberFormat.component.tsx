import React from "react";
import classNames from "classnames";

import "./NumberFormat.css";

const LOCALE_EN_US: string = "en-US";

/**
 * Format a number value to include separators and a maximum of two fraction digits.
 *
 * Note - This can be modified later to have more decimal digits for crypto values.
 */
function formatNumber(value: number) {
  return new Intl.NumberFormat(LOCALE_EN_US, {
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number value to currency format.
 * Default is set to en-US locale for now, but this can
 * be modified to take in other locales for formatting too.
 *
 * Note - This can be modified later to show crypto symbols/icons for positon values.
 */
function formatCurrency(value: number) {
  return new Intl.NumberFormat(LOCALE_EN_US, {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/**
 * Format a number value to percent format.
 * Default is set to two decimal places and en-US locale for now, but
 * this can be modified to take in other locales for formatting too.
 *
 * Note - For crypto assets, the precision may need to be more than 2 and can be modified later.
 */
function formatPercent(amount: number) {
  return new Intl.NumberFormat(LOCALE_EN_US, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

type NumberFormatProps = {
  format?: "currency" | "percent" | null;
  value: number;
};

export function NumberFormat(props: NumberFormatProps): JSX.Element {
  const { format, value } = props;

  switch (format) {
    case "currency":
      return <>{formatCurrency(value)}</>;
    case "percent":
      const prefixSign: string = value > 0 ? "+" : "";

      return (
        <span
          className={classNames({
            "text-color-green": value > 0,
            "text-color-red": value < 0,
          })}
        >
          {prefixSign}
          {formatPercent(value)}
        </span>
      );
    default:
      return <>{formatNumber(value)}</>;
  }
}
