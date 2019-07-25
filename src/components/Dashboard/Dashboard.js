import React from "react";
import { useQuery } from "urql";
import gql from "graphql-tag";

const getMetrics = gql`
  query {
    getMetrics
  }
`;

const Dashboard = () => {
  const [res] = useQuery({
    query: getMetrics,
  });

  console.log(res.data);

  let metrics;
  if (res.fetching) {
    metrics = <p>Loading...</p>;
  } else if (res.error) {
    metrics = <p>An error had occured</p>;
  } else {
    metrics = res.data.getMetrics.map((metric, idx) => (
      <li key={idx}>{metric}</li>
    ));
  }

  return (
    <ul>
      {metrics}
    </ul>
  );
};

export default Dashboard;