import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Grid, GridHeaderProps } from "./core";
import { InstrumentRow } from "./InstrumentRow";
import { Toolbar } from "./Toolbar";
import { Instrument } from "./FilterModal";
import { getActiveFilter, getFilter } from "../util/localStorage";

import "./InstrumentGrid.css";

const headers: GridHeaderProps[] = [
  {
    text: "Contracts",
  },
  {
    align: "right",
    text: "Price",
  },
  {
    align: "right",
    text: "24h Change",
  },
  {
    align: "right",
    text: "24h Volume",
  },
  {
    key: "action",
    text: "",
  },
];

/**
 * Component containing the grid and the toolbar for the assets to display
 */
export function InstrumentGrid(): JSX.Element {
  const [filteredAssets, setFilteredAssets] = useState<string[]>([]);
  const [data, setData] = useState<Instrument[]>([]);

  useEffect(() => {
    const activeFilter = getActiveFilter();
    const filter = activeFilter ? getFilter(activeFilter) : null;
    setFilteredAssets(filter?.assets ?? []);
  }, []);

  const ws = useMemo(
    () => new WebSocket("wss://www.deribit.com/ws/api/v2"),
    []
  );

  const message = useMemo(
    () => ({
      jsonrpc: "2.0",
      id: 8,
      method: "public/get_book_summary_by_currency",
      params: {
        currency: "USDC",
        kind: "future",
      },
    }),
    []
  );

  // Get the list of instruments
  useEffect(() => {
    ws.onmessage = function (e) {
      try {
        setData(JSON.parse(e.data).result);
      } catch (e) {
        // do nothing for now
      }
    };
    ws.onopen = function () {
      ws.send(JSON.stringify(message));
    };
    ws.onerror = function (e) {
      // TODO - Error handling
      console.error(e);
    };
  }, [message, ws]);

  // Filter the data to display in the grid, based on the filter selected
  const gridData = useMemo(() => {
    const displayData =
      filteredAssets.length > 0
        ? data.filter(
            (asset: Instrument) =>
              filteredAssets.indexOf(asset.instrument_name) > -1
          )
        : data;
    return displayData.sort((a, b) => {
      if (a.instrument_name === b.instrument_name) return 0;
      return a.instrument_name > b.instrument_name ? 1 : -1;
    });
  }, [data, filteredAssets]);

  const updateFilter = useCallback(
    (assets: string[]) => setFilteredAssets(assets),
    []
  );

  return (
    <>
      <Toolbar instruments={data} updateFilter={updateFilter} />
      <Grid className="asset-grid" headers={headers}>
        {gridData.map((asset) => (
          <InstrumentRow key={asset.instrument_name} instrument={asset} />
        ))}
      </Grid>
    </>
  );
}
