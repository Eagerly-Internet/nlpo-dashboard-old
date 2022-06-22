import { Amcat, AmcatIndex } from "amcat4react";
import { useEffect, useState } from "react";
import Tile from "../Tile";

interface MetricsProps {
    index: AmcatIndex
}

function metricTile(label: string, value?: number, previous?: number) {
    const change = (value == null || previous == null || previous === 0)?undefined:(value-previous)/previous;
    return <Tile label={label} content={value} change={change} />
}

export default function Metrics({index}: MetricsProps) {
    const [views, setViews] = useState<number>();
    const [previousViews, setPreviousViews] = useState<number>();
    const [n, setN] = useState<number>();
    const [previousN, setPreviousN] = useState<number>();

    const [fbviews, setFBViews] = useState<number>();
    const [previousFBViews, setPreviousFBViews] = useState<number>();
    const [fbn, setFBN] = useState<number>();
    const [previousFBN, setPreviousFBN] = useState<number>();

    let maand = new Date();
    maand.setDate(maand.getDate() - 30);
    let maand2 = new Date();
    maand2.setDate(maand2.getDate() - 60);
  
    useEffect(() => {
        setViews(undefined); 
        setN(undefined); 
        Amcat.postAggregate(index, 
            {filters: {date: {gte: maand.toISOString()}, platform: {values: ["Website"]}}}, 
            {display: "list", metrics: [{field: "views", function: "sum"}]})
            .then((response) => {
                setViews(response["data"]["data"][0]["sum_views"]);
                setN(response["data"]["data"][0]["n"]);
            });
    }, [index, setViews, setN])
    useEffect(() => {
        setPreviousN(undefined);
        setPreviousViews(undefined);
        Amcat.postAggregate(index, 
            {filters: {date: {gte: maand2.toISOString(), lt: maand.toISOString()}, platform: {values: ["Website"]}}}, 
            {display: "list", metrics: [{field: "views", function: "sum"}]})
            .then((response) => {
                setPreviousViews(response["data"]["data"][0]["sum_views"]);
                setPreviousN(response["data"]["data"][0]["n"]);
            });
    }, [index, setPreviousViews, setPreviousN])
    useEffect(() => {
        setFBViews(undefined); 
        setFBN(undefined); 
        Amcat.postAggregate(index, 
            {filters: {date: {gte: maand.toISOString()}, platform: {values: ["Facebook"]}}}, 
            {display: "list", metrics: [{field: "engaged_users", function: "sum"}]})
            .then((response) => {
                setFBViews(response["data"]["data"][0]["sum_engaged_users"]);
                setFBN(response["data"]["data"][0]["n"]);
            });
    }, [index, setFBViews, setFBN])
    useEffect(() => {
        setPreviousFBN(undefined);
        setPreviousFBViews(undefined);
        Amcat.postAggregate(index, 
            {filters: {date: {gte: maand2.toISOString(), lt: maand.toISOString()}, platform: {values: ["Facebook"]}}}, 
            {display: "list", metrics: [{field: "engaged_users", function: "sum"}]})
            .then((response) => {
                setPreviousFBViews(response["data"]["data"][0]["sum_engaged_users"]);
                setPreviousFBN(response["data"]["data"][0]["n"]);
            });
    }, [index, setPreviousFBViews, setPreviousFBN])


    return <>
      {metricTile("Gepubliceerde artikelen", n, previousN)}
      {metricTile("Totale Views", views, previousViews)}
      {metricTile("Facebook Posts", fbn, previousFBN)}
      {metricTile("Engaged FB Users", fbviews, previousFBViews)}

    </>;
}