import React, { useEffect, useMemo, useState } from "react";
import { Button, GridCell, GridCellProps, GridRow, NumberFormat } from "./core";
import { FavoriteIcon } from "./icons";
import { Instrument } from "./FilterModal";

type InstrumentRowProps = {
  instrument: Instrument;
};

/**
 * Grid Row Component to display an instrument in the Grid.
 * Subscribes to ws incremental ticker channel and updates data.
 * Unsubscribes on unmount.
 */
export function InstrumentRow(props: InstrumentRowProps): JSX.Element {
  const { instrument } = props;
  const [data, setData] = useState<Instrument>(instrument);

  const ws = useMemo(
    () => new WebSocket("wss://www.deribit.com/ws/api/v2"),
    []
  );

  const subscribeMsg = useMemo(
    () => ({
      jsonrpc: "2.0",
      method: "public/subscribe",
      id: 42,
      params: {
        channels: [`incremental_ticker.${instrument.instrument_name}`],
      },
    }),
    [instrument.instrument_name]
  );

  const unsubscribeMsg = useMemo(
    () => ({
      method: "public/unsubscribe",
      params: {
        channels: [`incremental_ticker.${instrument.instrument_name}`],
      },
      jsonrpc: "2.0",
      id: 6,
    }),
    [instrument.instrument_name]
  );

  // Subscribe to the incremental ticker for real-time changes
  useEffect(() => {
    ws.onmessage = function (e) {
      try {
        const instrumentData = JSON.parse(e.data).params.data;
        setData((data) => ({
          ...data,
          ...instrumentData,
        }));
      } catch (e) {
        // do nothing for now
      }
    };
    ws.onopen = function () {
      ws.send(JSON.stringify(subscribeMsg));
    };

    // TODO - Error handling, disconnection, re-connection etc.
    ws.onerror = function (e) {
      console.error(e);
    };
  }, [instrument.instrument_name, subscribeMsg, ws]);

  // Unsubscribe from the incremental ticker on unmount
  useEffect(() => {
    return () => {
      ws.onmessage = function (e) {
        // do nothing for now
        // console.log("unsubscribe data: ", JSON.parse(e.data));
      };
      ws.onopen = function () {
        ws.send(JSON.stringify(unsubscribeMsg));
      };

      // TODO - Error handling, disconnection, re-connection etc.
      ws.onerror = function (e) {
        console.error(e);
      };
    };
  }, [instrument.instrument_name, unsubscribeMsg, ws]);

  const instrumentName = useMemo(
    (): React.ReactElement<GridCellProps> => (
      <GridCell className="asset-name">
        <FavoriteIcon fontSize="small" />
        {data.instrument_name}
      </GridCell>
    ),
    [data.instrument_name]
  );

  const price = useMemo(
    (): React.ReactElement<GridCellProps> => (
      <GridCell align="right">
        <NumberFormat format="currency" value={data.mark_price} />
      </GridCell>
    ),
    [data.mark_price]
  );

  const priceChange = useMemo(
    (): React.ReactElement<GridCellProps> => (
      <GridCell align="right">
        <NumberFormat format="percent" value={data.price_change} />
      </GridCell>
    ),
    [data.price_change]
  );

  const volume = useMemo(
    (): React.ReactElement<GridCellProps> => (
      <GridCell align="right">
        <NumberFormat format="currency" value={data.volume_notional} />
      </GridCell>
    ),
    [data.volume_notional]
  );

  const tradeButton = useMemo(
    (): React.ReactElement<GridCellProps> => (
      <GridCell align="right">
        <Button>Trade</Button>
      </GridCell>
    ),
    []
  );

  return (
    <GridRow>
      {instrumentName}
      {price}
      {priceChange}
      {volume}
      {tradeButton}
    </GridRow>
  );
}
