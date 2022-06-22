import { AmcatUser } from "amcat4react";
import { useState } from "react";
import { Container, Menu } from "semantic-ui-react";
import { OMROEPEN } from "../omroepen";
import DashboardNLPO from "./nlpo/DashboardNLPO";
import DashboardOmroep from "./omroep/DashboardOmroep";

export interface DashboardsProps {
  user?: AmcatUser;
}

function get_dashboard(user?: AmcatUser, dashboard_name?: string) {
  if (user == null || dashboard_name == null) return null;
  else if (dashboard_name === "nlpo") {
    return <DashboardNLPO user={user} />
  } else {
    return <DashboardOmroep index={{...user, index: dashboard_name}} />
  }

}

export default function Dashboards({ user }: DashboardsProps) {
  const [selected, setSelected] = useState("nlpo");
  const dashboard = get_dashboard(user, selected);
  return (
    <>
      <Menu fixed="top" tabular style={{background: 'white'}}>
      <Menu.Item
            name="NLPO"
            active={!!user && selected === "nlpo"}
            disabled={!user}
            onClick={() => setSelected("nlpo")}
          />
        {
          OMROEPEN.map((o) => <Menu.Item
          key={o.index}
            name={o.label}
          active={!!user && selected === o.index}
          disabled={!user}
          onClick={() => setSelected(o.index)}
        />)
        }
      </Menu>{" "}
      <Container style={{paddingTop: "60px"}}>
      {dashboard}
      </Container>
    </>
  );
}
