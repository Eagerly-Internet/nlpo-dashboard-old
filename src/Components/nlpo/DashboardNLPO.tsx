import { AggregateResult, AmcatQuery, SimpleQueryForm } from "amcat4react";
import { useState } from "react";
import { Grid, Header, Menu } from "semantic-ui-react";
import { addFilters } from "../../lib";
import { FILTERFIELDS, OMROEPEN } from "../../omroepen";
import { DashboardsProps } from "../Dashboards";
import Locaties from "../omroep/Locaties";
import ItemsPerOmroep from "./ItemsPerOmroep";
import { InfoHeader } from "../InfoHeader";

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
        <SimpleQueryForm
          index={index}
          value={query}
          onSubmit={setQuery}
          fieldList={FILTERFIELDS}
          addFilterLabel="Filter toevoegen"
        />
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
            <InfoHeader
              text={"Artikelen per moment van de dag"}
              info="Aantal artikelen gepubliceerd per moment van de dag. Klik op de tabbladen om verschillende platformen te bekijken."
            />
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
            <InfoHeader
              text={"Artikelen per dag van de week"}
              info="Aantal artikelen gepubliceerd per dag van de week. Klik op de tabbladen om verschillende platformen te bekijken."
            />
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
            <InfoHeader
              text={"Onderwerpen in het nieuws"}
              info="Aantal artikelen per onderwerp. Deze onderwerpen zijn gebaseerd op zoektermen rondom een onderwerp, gebaseerd op eerder onderzoek naar het nieuws van lokale omroepen. Een artikel kan hierbij ook over meerdere onderwerpen gaan."
            />
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
            <InfoHeader
              text={"Locaties"}
              info="Hieronder is een plattegrond te zien waarin alle plaatsen waar het nieuws over gaat worden weergegeven. Het tabblad Kernen geeft weer welke van de kernen die de lokale omroep bedient ook daadwerkelijk genoemd wordt in het nieuws. Het tabblad Alle locaties geeft alle locaties weer die in het nieuws van de lokale omroep genoemd zijn."
            />
            <Locaties index={index} query={query} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
