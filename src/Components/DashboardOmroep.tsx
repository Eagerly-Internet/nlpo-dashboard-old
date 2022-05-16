import {
  AggregateResult,
  AmcatFilters,
  AmcatIndex,
  AmcatQuery,
  Articles,
  LocationHeatmap,
  SimpleQueryForm,
} from "amcat4react";
import { useState } from "react";
import { Container, Grid, Header } from "semantic-ui-react";

interface DashboardProps {
  index?: AmcatIndex;
}

function addFilters(q: AmcatQuery, filters: AmcatFilters) {
  const result = { ...q.filters, ...filters };
  return { ...q, filters: result };
}

export default function DashboardOmroep({ index }: DashboardProps) {
  let d = new Date();
  d.setDate(d.getDate() - 30);

  const [query, setQuery] = useState<AmcatQuery>({
    filters: { date: { gte: d.toISOString().substring(0, 10) } },
  });

  if (index == null) return null;
  return (
    <Container>
      <SimpleQueryForm index={index} value={query} onSubmit={setQuery} />
      <Header>Dashboard voor {index.index}</Header>
      <Grid padded style={{ height: "100vh" }}>
        <Grid.Row stretched>
          <Grid.Column width={16}>
            <Header as="h2">Aantal items per dag per platform</Header>
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
            <LocationHeatmap
              index={index}
              options={{ field: "location_geo" }}
            />
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
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "barchart",
                axes: [
                  { field: "date", interval: "daypart" },
                  { field: "platform" },
                ],
                limit: 10,
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header>Artikelen per dag van de week</Header>
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "barchart",
                axes: [
                  { field: "date", interval: "dayofweek" },
                  { field: "platform" },
                ],
                limit: 10,
              }}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={8}>
            <Header>Populaire categories</Header>
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "categories" }],
                limit: 10,
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
