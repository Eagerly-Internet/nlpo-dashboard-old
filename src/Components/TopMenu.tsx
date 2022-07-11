import { AmcatQuery } from "amcat4react";
import { Dropdown, Menu } from "semantic-ui-react";
import { OMROEPEN, TOPICS } from "../omroepen";
import "./TopMenu.css";

interface FilterDropdownProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  query: AmcatQuery;
  setQuery: (value: AmcatQuery) => void;
}
interface DashboardDropdownProps {
  selectedDashboard: string;
  setSelectedDashboard: (value: string) => void;
}

interface TopMenuProps extends FilterDropdownProps, DashboardDropdownProps {}

export default function TopMenu({
  selectedDashboard,
  setSelectedDashboard,
  showFilters,
  setShowFilters,
  query,
  setQuery,
}: TopMenuProps) {
  return (
    <Menu inverted fixed="top">
      <Menu.Menu position="left">
        <DashboardDropdown
          selectedDashboard={selectedDashboard}
          setSelectedDashboard={setSelectedDashboard}
        />
        <FilterDropdown
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          query={query}
          setQuery={setQuery}
        />
      </Menu.Menu>
    </Menu>
  );
}

export function getDate(daysago: number): string {
  let d = new Date();
  d.setDate(d.getDate() - daysago);
  return d.toISOString().substring(0, 10);
}

function FilterDropdown({
  showFilters,
  setShowFilters,
  query,
  setQuery,
}: FilterDropdownProps) {
  const d1m = getDate(30);
  const d3m = getDate(90);
  const d1y = getDate(365);
  function setDateFilter(value: string) {
    const newQuery = {
      ...query,
      filters: { ...query.filters, date: { gte: value } },
    };
    console.log(newQuery);
    setQuery(newQuery);
  }
  const topicfilter = query?.filters?.topic?.values || [];
  console.log({ query, topicfilter });
  const datefilter = query?.filters?.date?.gte;
  function setTopicFilter(value: string) {
    const newFilter = topicfilter.includes(value)
      ? topicfilter.filter((v) => v !== value)
      : [...topicfilter, value];
    let newQuery: AmcatQuery = {
      ...query,
      filters: { ...query.filters, topic: { values: newFilter } },
    };
    if (newFilter.length === 0) delete newQuery.filters?.topic;
    setQuery(newQuery);
  }

  return (
    <Dropdown item text="Filters">
      <Dropdown.Menu className="filtermenu">
        <Menu.Item
          active={showFilters}
          onClick={() => setShowFilters(!showFilters)}
        >
          <CheckItem checked={showFilters} text="Filterbalk tonen" />
        </Menu.Item>
        <Dropdown.Divider />
        <Menu.Item
          active={datefilter === d1m}
          onClick={() => setDateFilter(d1m)}
        >
          <CheckItem checked={datefilter === d1m} text="Laatste maand" />
        </Menu.Item>
        <Menu.Item
          active={datefilter === d3m}
          onClick={() => setDateFilter(d3m)}
        >
          <CheckItem checked={datefilter === d3m} text="Laatste drie maanden" />
        </Menu.Item>
        <Menu.Item
          active={datefilter === d1y}
          onClick={() => setDateFilter(d1y)}
        >
          <CheckItem checked={datefilter === d1y} text="Laatste jaar" />
        </Menu.Item>
        <Dropdown.Divider />
        {TOPICS.map((t) => (
          <Menu.Item
            key={t}
            active={topicfilter.includes(t)}
            onClick={() => setTopicFilter(t)}
          >
            <CheckItem checked={topicfilter.includes(t)} text={t} />
          </Menu.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

interface CheckItemProps {
  text: string;
  checked: boolean;
}
function CheckItem(props: CheckItemProps) {
  return (
    <>
      <span style={props.checked ? {} : { color: "white" }}>✓</span>
      {props.text}
    </>
  );
}

function DashboardDropdown({
  selectedDashboard,
  setSelectedDashboard,
}: DashboardDropdownProps) {
  const label =
    selectedDashboard === "nlpo"
      ? "NLPO"
      : OMROEPEN.find((o) => o.index === selectedDashboard)?.label;
  return (
    <Dropdown item text={`Dashboard: ${label}`}>
      <Dropdown.Menu>
        <Menu.Item
          name="NLPO Overzicht"
          active={selectedDashboard === "nlpo"}
          onClick={() => {
            setSelectedDashboard("nlpo");
          }}
        />
        <Dropdown.Divider />

        {OMROEPEN.map((o) => (
          <Menu.Item
            key={o.index}
            name={o.label}
            active={o.index === selectedDashboard}
            onClick={() => {
              setSelectedDashboard(o.index);
            }}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
