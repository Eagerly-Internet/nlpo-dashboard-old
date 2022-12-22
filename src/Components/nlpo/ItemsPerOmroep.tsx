import { AggregateResult } from "amcat4react";
import { useState } from "react";
import { Header, Menu } from "semantic-ui-react";
import { addFilters, DashboardComponentProp } from "../../lib";
import { KANALEN } from "./DashboardNLPO";
import { InfoHeader } from "../InfoHeader";

export default function ItemsPerOmroep({
  index,
  query,
}: DashboardComponentProp) {
  const [kanaal, setKanaal] = useState(KANALEN[0]);
  return (
    <>
      <InfoHeader text="Aantal items per dag per omroep" info="In deze analyse wordt per omroep het aantal items per dag weergegeven. Klik op de tabbladen om dit te bekijken per platform." />

      <Menu pointing secondary>
        {KANALEN.map((k) => (
          <Menu.Item
            key={k}
            name={k}
            active={k === kanaal}
            onClick={() => {
              setKanaal(k);
            }}
          />
        ))}
      </Menu>
      <AggregateResult
        index={index}
        query={addFilters(query, { platform: { values: [kanaal] } })}
        height={400}
        options={{
          display: "linechart",
          axes: [{ field: "date", interval: "day" }, { field: "omroep" }],
        }}
      />
    </>
  );
}
