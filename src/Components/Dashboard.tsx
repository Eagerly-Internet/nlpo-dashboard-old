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
          <Header>Aantal items per dag per platform</Header>
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "linechart",
                axes: [{ field: "date", interval: "day" }, {field: "omroep"}],
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={8}>
          <Header>Totaal aantal items per omroep</Header>
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "date", interval: "daypart"}, { field: "omroep"}],
                limit: 10
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
          <Header>Totaal aantal items per weekdag</Header>
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "date", interval: "dayofweek"}, {field: "omroep"}],
                limit: 10
              }}
            />
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
        
      </Grid>
    </Container>
  );
}
