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
      <Header>Dashboard voor {omroep.label}</Header>
      <Metrics index={index} />
      <text> informatie tekst</text>
      <Grid padded style={{ height: "100vh" }}>
        <Grid.Row stretched>
          <Grid.Column width={16}>
            <InfoHeader
              text="Aantal items per dag per platform"
              info="Hier zit u toby niet"
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
            <Header as="h2">Deze maand vergeleken met verleden maand</Header>
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
            <Header>Recente items</Header>
            <div style={{ textAlign: "left" }}>
              <Articles
                index={index}
                query={query}
                sort={["date"]}
                asSnippets
                perPage={7}
              />
            </div>
          </Grid.Column>
          <Grid.Column width={6}>
            <Locaties index={index} query={query} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={16}>
            <Header>Meeste engagement</Header>
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
                axes: [{ field: "date", interval: "daypart" }],
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
                axes: [{ field: "date", interval: "dayofweek" }],
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
          <Grid.Column width={8}>
            <Header>Journalisten</Header>
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
