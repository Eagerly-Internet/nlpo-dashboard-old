import { LocationHeatmap } from "amcat4react";
import { useState } from "react";
import { Menu } from "semantic-ui-react";
import { DashboardComponentProp } from "../../lib";

export default function Locaties({ index, query }: DashboardComponentProp) {
  const [view, setView] = useState("Kernen");
  return (
    <>
      <Menu secondary pointing>
        {["Kernen", "Alle locaties"].map((x) => (
          <Menu.Item
            name={x}
            key={x}
            active={view === x}
            onClick={() => {
              setView(x);
            }}
          />
        ))}
      </Menu>
      <LocationHeatmap
        query={query}
        index={index}
        options={{ field: view === "Kernen" ? "kernen_geo" : "location_geo" }}
      />
    </>
  );
}
