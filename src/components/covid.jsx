import React, { Component } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import Select from "react-select";

const api_url = "https://staging-chile-coronapi.herokuapp.com/api/v3";
const nation_historical = "/historical/nation";
const region_historical = "/historical/regions";
const models_regions = "/models/regions";
const commune_historical = "/historical/communes";
const models_communes = "/models/communes";

class Covid extends Component {
  state = {
    data: "nothing yet",
    cases: { "03/07/2020": { confirmed: "none", fecha: "none" } },
    regions: {},
    region: { _id: 1, region: "Tarapacá" },
    regionCases: { "03/07/2020": { confirmed: "none", fecha: "none" } },
    commune: { _id: 1101, commune: "Iquique" },
    communeCases: { confirmed: "none" },
  };

  componentDidMount() {
    fetch(api_url + nation_historical)
      .then((response) => response.json())
      .then((cases) => this.setState({ cases }));
    fetch(api_url + models_regions)
      .then((response) => response.json())
      .then((regions) => Object.values(regions))
      .then((regions) => this.setState({ regions }));
    fetch(api_url + models_communes)
      .then((response) => response.json())
      .then((communes) => Object.values(communes))
      .then((communes) => this.setState({ communes }));
    fetch(api_url + region_historical + "?id=" + this.state.region._id)
      .then((response) => response.json())
      .then((response) => response["regionData"])
      .then((regionCases) => {
        return this.setState({ regionCases });
      });
    fetch(api_url + commune_historical + "?id=" + this.state.commune._id)
      .then((response) => response.json())
      .then((response) => response["confirmed"])
      .then((communeCases) => {
        return this.setState({ communeCases });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.region != this.state.region) {
      fetch(api_url + region_historical + "?id=" + this.state.region._id)
        .then((response) => response.json())
        .then((response) => response["regionData"])
        .then((regionCases) => {
          return this.setState({ regionCases });
        });
    }
    if (prevState.commune != this.state.commune) {
      fetch(api_url + commune_historical + "?id=" + this.state.commune._id)
        .then((response) => response.json())
        .then((response) => response["confirmed"])
        .then((communeCases) => {
          return this.setState({ communeCases });
        });
    }
  }

  render() {
    return (
      <div>
        <h1>Nacional</h1>
        {this.covidChart(this.formatData(this.state.cases))}
        <h1>Regional</h1>
        <Select
          placeholder={this.state.region.region}
          options={this.state.regions}
          getOptionLabel={(option) => option.region}
          getOptionValue={(option) => option.region}
          onChange={(region) => {
            this.setState({ region });
          }}
        />
        {this.covidChart(this.formatData(this.state.regionCases))}
        <h1>Comunal</h1>
        <Select
          placeholder={this.state.commune.commune}
          options={this.state.communes}
          getOptionLabel={(option) => option.commune}
          getOptionValue={(option) => option.commune}
          onChange={(commune) => {
            this.setState({ commune });
          }}
        />
        {this.covidChartCommunes(this.state.communeCases)}
      </div>
    );
  }

  covidChart = (data) => {
    return (
      <ResponsiveContainer width="95%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorConfirmados" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMuertes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="color47*muertes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ed503b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ed503b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCasos+10días" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e8e838" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#e8e838" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="fecha" />
          {/* <YAxis type="number" domain={[0, "dataMax+30000"]} /> */}
          <YAxis type="number" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="confirmados"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorConfirmados)"
          />
          <Area
            type="monotone"
            dataKey="muertes"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorMuertes)"
          />
          <Area
            type="monotone"
            dataKey="47*muertes"
            stroke="#ed503b"
            fillOpacity={1}
            fill="url(#color47*muertes)"
          />
          <Area
            type="monotone"
            dataKey="casos + 10 días"
            stroke="#e8e838"
            fillOpacity={1}
            fill="url(#colorCasos+10días)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };
  covidChartCommunes = (data) => {
    let keys = Object.keys(data);
    let values = keys.map((k) => {
      return { confirmed: data[k], fecha: k };
    });

    return (
      <ResponsiveContainer width="95%" height={400}>
        <AreaChart
          data={values}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="fecha" />
          {/* <YAxis type="number" domain={[0, "dataMax+30000"]} /> */}
          <YAxis type="number" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="confirmed"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorConfirmed)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };
  renameKeys = (keysMap, obj) =>
    Object.keys(obj).reduce(
      (acc, key) => ({
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] },
      }),
      {}
    );

  formatData = (data) => {
    Object.keys(data).map((key) => (data[key]["fecha"] = key));
    data = Object.values(data);

    data.map((d) => (d["47*muertes"] = d.deaths * 47));
    data.map((d, index) => {
      if (index < 10) {
        d["casos + 10 días"] = 0;
      } else {
        d["casos + 10 días"] = data[index - 10]["confirmed"];
      }
    });
    let values = [];
    data.map((d) => {
      values.push(
        this.renameKeys({ confirmed: "confirmados", deaths: "muertes" }, d)
      );
    });
    return values;
  };
}

export default Covid;
