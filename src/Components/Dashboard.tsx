import { AggregateResult, AmcatFilters, AmcatIndex, AmcatQuery, Articles, LocationHeatmap, SimpleQueryForm } from "amcat4react";
import { useState } from "react";
import { Container, Grid, GridColumn, Header } from "semantic-ui-react";

interface DashboardProps {
  index?: AmcatIndex;
}

function addFilters(q: AmcatQuery, filters: AmcatFilters) {
  const result = {...q.filters, ...filters}
  return {...q, filters: result}
}

export default function Dashboard({ index }: DashboardProps) {
  const [query, setQuery] = useState<AmcatQuery>({})

  if (index == null) return null;
  return (
    <Container>
    <SimpleQueryForm index={index} value={query} onSubmit={setQuery} />
      <Grid padded style={{ height: "100vh" }}>
        <Grid.Row stretched>
          <Grid.Column width={16}>
          <Header>Aantal items per week per platform</Header>
            <AggregateResult
              index={index}
              query={addFilters(query, {platform: {values: ["Website", "YouTube", "Twitter"]}})}
              height={400}
              options={{
                display: "linechart",
                axes: [{ field: "date", interval: "week" }, {field: "platform"}],
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={8}>
          <Header>Totaal aantal items per platform</Header>
            <AggregateResult
              index={index}
              query={addFilters(query, {platform: {values: ["Website", "YouTube", "Twitter"]}})}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "platform"}],
                limit: 10
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header>Locaties in het nieuws</Header>
            <LocationHeatmap
              index={index}
              query={{filters: {platform: {values: ["Website"]}}}}
              options={{field: "location_geo", width: "100%"}}
            />
          </Grid.Column>
          </Grid.Row>
        <Grid.Row stretched>
        <Grid.Column width={8}>
          <Header>Gemiddelde likes op twitter per artikel op de website</Header>
            <AggregateResult
              index={index}
              query={{filters: {platform: {values: ["Website"]}}}}
              height={400}
              options={{
                display: "linechart",
                axes: [{ field: "date", interval:"week"}],
                metrics: [{function: "avg", field: "twitter_like_count"}],
                limit: 10
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header>Artikelen met meeste likes op Twitter </Header>
            <Articles index={index} query={query} columns={[{name:"title"}, {name:"twitter_like_count"}]} asSnippets perPage={5} allColumns={false} sort={{twitter_like_count: {order: "desc"}}}/>
          </Grid.Column>
        </Grid.Row>
          <Grid.Row stretched>
          <Grid.Column width={8}>
          <Header>Populaire categories</Header>
            <AggregateResult
              index={index}
              query ={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "tags"}],
                limit: 10
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
          <Header>Journalisten</Header>
            <AggregateResult
              index={index}
              query ={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "author"}],
                limit: 10
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={8}>
          <Header>Gemiddeld aantal tweets per categorie</Header>
            <AggregateResult
              index={index}
              query ={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "categories"}],
                metrics: [{function: "avg", field: "n_tweets"}],
                limit: 10
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
          <Header>Gemiddeld aantal tweets per journalist</Header>
            <AggregateResult
              index={index}
              query ={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "author"}],
                metrics: [{function: "avg", field: "n_tweets"}],
                limit: 10
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={8}>
          <Header>Gemiddeld aantal views op YouTube</Header>
            <AggregateResult
              index={index}
              query={{filters: {platform: {values: ["YouTube"]}}}}
              height={400}
              options={{
                display: "linechart",
                axes: [{ field: "date", interval:"week"}],
                metrics: [{function: "avg", field: "yt_views"}]
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
          <Header>Gemiddeld aantal likes op YouTube</Header>
            <AggregateResult
              index={index}
              query={{filters: {platform: {values: ["YouTube"]}}}}
              height={400}
              options={{
                display: "linechart",
                axes: [{ field: "date", interval:"week"}],
                metrics: [{function: "avg", field: "yt_likes"}]
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
