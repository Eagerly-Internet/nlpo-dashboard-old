import {
  AggregateResult,
  AmcatIndex,
  AmcatQuery,
  Articles,
  SimpleQueryForm,
} from "amcat4react";
import { addFilter } from "amcat4react/dist/Amcat";
import { useState } from "react";
import { Container, Grid, Header, Menu } from "semantic-ui-react";
import { addFilters } from "../../lib";
import { FILTERFIELDS, OMROEPEN } from "../../omroepen";
import { InfoHeader } from "../InfoHeader";
import { KANALEN } from "../nlpo/DashboardNLPO";
import Locaties from "./Locaties";
import Metrics from "./Metrics";

interface DashboardProps {
  index: AmcatIndex;
  showFilters: boolean;
  query: AmcatQuery;
  setQuery: (value: AmcatQuery) => void;
}

export default function DashboardOmroep({
  index,
  showFilters,
  query,
  setQuery,
}: DashboardProps) {
  const [kanaal2, setKanaal2] = useState(KANALEN[0]);
  const [kanaal3, setKanaal3] = useState(KANALEN[0]);
  let d = new Date();
  const vergelijk_vanaf = new Date(
    d.getFullYear(),
    d.getMonth() - 1,
    1
  ).toISOString();

  if (index == null) return null;
  const omroep = OMROEPEN.filter((o) => o.index === index.index)[0];

  return (
    <Container>
      {!showFilters ? null : (
        <SimpleQueryForm
          index={index}
          value={query}
          onSubmit={setQuery}
          fieldList={FILTERFIELDS}
          addFilterLabel="Filter toevoegen"
        />
      )}
      <InfoHeader
        text={`Dashboard voor ${omroep.label}`}
        info="In de tiles hieronder wordt het aantal gepubliceerde artikelen van deze week vergeleken met vorige week. Dit geldt ook voor het totaal aantal views en eht aantal Facebookposts en het totaal aantal engaged FB gebruikers"
      />
      <Metrics index={index} />
      <Grid padded style={{ height: "100vh" }}>
        <Grid.Row stretched>
          <Grid.Column width={16}>
            <InfoHeader
              text="Aantal items per dag per platform"
              info="In deze analyse wordt per platform het aantal items per dag weergegeven."
            />
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "linechart",
                axes: [
                  { field: "date", interval: "day" },
                  { field: "platform" },
                ],
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={16}>
            <InfoHeader
              text={"Deze maand vergeleken met verleden maand"}
              info="In deze figuur wordt het aantal artikelen op de website van deze maand vergeleken met de maand ervoor"
            />{" "}
            <AggregateResult
              index={index}
              query={addFilter(query, { date: { gte: vergelijk_vanaf } })}
              height={400}
              options={{
                display: "linechart",
                axes: [
                  { field: "date", interval: "dayofmonth" },
                  { field: "date", interval: "monthnr" },
                ],
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={10}>
            <InfoHeader
              text={"Recente items"}
              info="In dit overzicht zien we de tien meest recente items van de website"
            />
            <div style={{ textAlign: "left" }}>
              <Articles
                index={index}
                query={query}
                sort={[{ date: { order: "desc" } }]}
                asSnippets
                perPage={7}
              />
            </div>
          </Grid.Column>
          <Grid.Column width={6}>
            <InfoHeader
              text={"Locaties"}
              info="Hieronder is een plattegrond te zien waarin alle plaatsen waar het nieuws over gaat worden weergegeven. Het tabblad Kernen geeft weer welke van de kernen die de lokale omroep bedient ook daadwerkelijk genoemd wordt in het nieuws. Het tabblad Alle locaties geeft alle locaties weer die in het nieuws van de lokale omroep genoemd zijn."
            />
            <Locaties index={index} query={query} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={16}>
            <InfoHeader
              text={"Meeste engagement"}
              info="In dit overzicht zien we items die het meeste engagement kennen op website, Twitter en Facebook. Klik op de kolomnaam om de artikelen te sorteren."
            />{" "}
            <Articles
              index={index}
              //query={addFilters(query, {
              //  facebook_engagement: { exists: true },
              //})}
              query={query}
              sort={[{ views: { order: "desc" } }]}
              columns={[
                { name: "date", type: "date" },
                { name: "title", type: "text" },
                { name: "views", type: "long" },
                { name: "twitter_engagement", type: "long" },
                { name: "facebook_engagement", type: "long" },
              ]}
            />
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
                axes: [{ field: "date", interval: "daypart" }],
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
                axes: [{ field: "date", interval: "dayofweek" }],
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
          <Grid.Column width={8}>
            <InfoHeader
              text={"Journalisten"}
              info="Aantal artikelen gepubliceerd door de verschillende journalisten van de lokale omroep."
            />{" "}
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "author" }],
                limit: 10,
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
