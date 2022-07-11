import { AggregateResult, AmcatQuery, SimpleQueryForm } from "amcat4react";
import { useState } from "react";
import { Grid, Header, Menu } from "semantic-ui-react";
import { addFilters } from "../../lib";
import { OMROEPEN } from "../../omroepen";
import { DashboardsProps } from "../Dashboards";
import Locaties from "../omroep/Locaties";
import ItemsPerOmroep from "./ItemsPerOmroep";

export const KANALEN = ["Website", "Twitter", "Facebook", "Youtube"];

function get_indexname(selectie: string) {
  if (selectie === "Alle omroepen")
    return OMROEPEN.map((o) => o.index).join(",");
  return OMROEPEN.filter((o) => o.cat === selectie)
    .map((o) => o.index)
    .join(",");
}

interface DashboardNLPOProps extends DashboardsProps {
  showFilters: boolean;
  query: AmcatQuery;
  setQuery: (value: AmcatQuery) => void;
}

export default function DashboardNLPO({
  user,
  showFilters,
  query,
  setQuery,
}: DashboardNLPOProps) {
  const [kanaal2, setKanaal2] = useState(KANALEN[0]);
  const [kanaal3, setKanaal3] = useState(KANALEN[0]);
  const [omroepselectie, setOmroepselectie] = useState("Alle omroepen");

  if (user == null) return null;
  const index = { ...user, index: get_indexname(omroepselectie) };
  const omroep_options = [
    "Alle omroepen",
    ...Array.from(new Set(OMROEPEN.map((o) => o.cat))),
  ];
  console.log(query);
  return (
    <>
      {!showFilters ? null : (
        <SimpleQueryForm index={index} value={query} onSubmit={setQuery} />
      )}
      <Menu pointing>
        {omroep_options.map((o) => (
          <Menu.Item
            key={o}
            name={o}
            active={o === omroepselectie}
            onClick={() => {
              setOmroepselectie(o);
            }}
          />
        ))}
      </Menu>
      <Grid padded style={{ height: "100vh" }}>
        <Grid.Row stretched>
          <Grid.Column width={16}>
            <ItemsPerOmroep index={index} query={query} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={8}>
            <Header>Artikelen per moment van de dag</Header>
            <div
              style={{
                marginLeft: "15%",
              }}
            >
              <Menu pointing secondary>
                {KANALEN.map((k) => (
                  <Menu.Item
                    key={k}
                    name={k}
                    active={k === kanaal2}
                    onClick={() => {
                      setKanaal2(k);
                    }}
                  />
                ))}
              </Menu>
            </div>
            <AggregateResult
              index={index}
              query={addFilters(query, { platform: { values: [kanaal2] } })}
              height={400}
              options={{
                display: "barchart",
                axes: [
                  { field: "date", interval: "daypart" },
                  { field: "omroep" },
                ],
                limit: 10,
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header>Artikelen per dag van de week</Header>
            <div
              style={{
                marginLeft: "15%",
              }}
            >
              <Menu pointing secondary>
                {KANALEN.map((k) => (
                  <Menu.Item
                    key={k}
                    name={k}
                    active={k === kanaal3}
                    onClick={() => {
                      setKanaal3(k);
                    }}
                  />
                ))}
              </Menu>
            </div>
            <AggregateResult
              index={index}
              query={addFilters(query, { platform: { values: [kanaal3] } })}
              height={400}
              options={{
                display: "barchart",
                axes: [
                  { field: "date", interval: "dayofweek" },
                  { field: "omroep" },
                ],
                limit: 10,
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={8}>
            <Header>Onderwerpen</Header>
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "topic" }],
                limit: 12,
              }}
            />
          </Grid.Column>
          <Grid.Column width={6}>
            <Locaties index={index} query={query} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
