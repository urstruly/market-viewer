import React from "react";
import {
  Table as MuiTable,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
  TableBody as MuiTableBody,
  TableCellProps as MuiTableCellProps,
} from "@mui/material";
import classNames from "classnames";

import "./Grid.css";

// Align properties.
type GridTextAlign = "center" | "left" | "right";

export type GridHeaderProps = {
  align?: GridTextAlign;
  key?: string;
  text: string;
};

type GridRowProps = {
  children:
    | React.ReactElement<GridCellProps>
    | ReadonlyArray<React.ReactElement<GridCellProps> | null>;
};

/**
 * Wrapper for mui's TableRow component
 */
export function GridRow(props: GridRowProps): JSX.Element {
  const { children } = props;
  return <MuiTableRow>{children}</MuiTableRow>;
}

export type GridCellProps = Pick<MuiTableCellProps, "children" | "padding"> & {
  align?: GridTextAlign;
  className?: string;
};

/**
 * Wrapper for mui's TableCell component
 */
export function GridCell(props: GridCellProps): JSX.Element {
  const { align, children, className } = props;
  return (
    <MuiTableCell align={align} className={className}>
      {children}
    </MuiTableCell>
  );
}

type GridProps = {
  className?: string;
  children:
    | React.ReactElement<GridRowProps>
    | ReadonlyArray<React.ReactElement<GridRowProps>>
    | null;
  headers?: ReadonlyArray<GridHeaderProps>;
};

/**
 * Wrapper for mui's Table component to list items in a grid-based card/row format
 */
export function Grid(props: GridProps): JSX.Element {
  const { children, className, headers = [] } = props;

  return (
    <MuiTable className={classNames("mv-table", className)}>
      {headers.length !== 0 ? (
        <MuiTableHead>
          <MuiTableRow>
            {headers.map(({ align, key, text }) => (
              <MuiTableCell align={align} key={key ?? text}>
                {text}
              </MuiTableCell>
            ))}
          </MuiTableRow>
        </MuiTableHead>
      ) : null}
      <MuiTableBody>{children}</MuiTableBody>
    </MuiTable>
  );
}
