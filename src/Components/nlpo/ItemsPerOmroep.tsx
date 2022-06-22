import { AggregateResult } from "amcat4react";
import { useState } from "react";
import { Header, Menu } from "semantic-ui-react";
import { addFilters, DashboardComponentProp } from "../../lib";
import Tile from "../Tile";
import { KANALEN } from "./DashboardNLPO";



export default function ItemsPerOmroep({index, query} : DashboardComponentProp ) {
    const [kanaal, setKanaal] = useState(KANALEN[0]);
    return <>

    <Header>Aantal items per dag per omroep</Header>
    <Menu pointing secondary>
      {
        KANALEN.map((k) => <Menu.Item
          key={k}
          name={k}
          active={k === kanaal}
          onClick={() => { setKanaal(k) }}
        />)
      }

    </Menu>
    <AggregateResult
      index={index}
      query={addFilters(query, { platform: { values: [kanaal] } })}
      height={400}
      options={{
        display: "linechart",
        axes: [{ field: "date", interval: "week" }, { field: "omroep" }],
      }}
    />
    </>
}