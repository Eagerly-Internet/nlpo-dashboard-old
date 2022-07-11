import { AmcatQuery, AmcatUser } from "amcat4react";
import { useState } from "react";
import { Container } from "semantic-ui-react";
import DashboardNLPO from "./nlpo/DashboardNLPO";
import DashboardOmroep from "./omroep/DashboardOmroep";
import TopMenu, { getDate } from "./TopMenu";

export interface DashboardsProps {
  user: AmcatUser;
}

function get_dashboard(
  user: AmcatUser,
  dashboard_name: string,
  showFilters: boolean = false,
  query: AmcatQuery,
  setQuery: (value: AmcatQuery) => void
) {
  if (user == null || dashboard_name == null) return null;
  else if (dashboard_name === "nlpo") {
    return (
      <DashboardNLPO
        user={user}
        showFilters={showFilters}
        query={query}
        setQuery={setQuery}
      />
    );
  } else {
    return (
      <DashboardOmroep
        index={{ ...user, index: dashboard_name }}
        showFilters={showFilters}
        query={query}
        setQuery={setQuery}
      />
    );
  }
}

export default function Dashboards({ user }: DashboardsProps) {
  const [selectedDashboard, setSelectedDashboard] = useState("nlpo");
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState<AmcatQuery>({
    filters: { date: { gte: getDate(90) } },
  });
  const dashboard = get_dashboard(
    user,
    selectedDashboard,
    showFilters,
    query,
    setQuery
  );
  console.log(query);
  return (
    <>
      <TopMenu
        selectedDashboard={selectedDashboard}
        setSelectedDashboard={setSelectedDashboard}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        query={query}
        setQuery={setQuery}
      ></TopMenu>
      <Container style={{ paddingTop: "60px" }}>{dashboard}</Container>
    </>
  );
}
