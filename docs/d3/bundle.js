(function (React$1, ReactDOM, d3$1, topojson) {
  'use strict';

  var React$1__default = 'default' in React$1 ? React$1['default'] : React$1;
  ReactDOM = ReactDOM && Object.prototype.hasOwnProperty.call(ReactDOM, 'default') ? ReactDOM['default'] : ReactDOM;

  const jsonUrl =
    'https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json';

  const useUsaGeo = () => {
    const [data, setData] = React$1.useState(null);

    React$1.useEffect(() => {
      d3$1.json(jsonUrl).then(topology => {
        const { states } = topology.objects;
        setData([
          topojson.feature(topology, states)
        ]);
      });
    }, []);

    return data;
  };

  const dataFilter = (data, year) => {
    return new Map(data.map(obj => [obj.id, +obj['year_' + year]]));
  };

  const projection = d3$1.geoIdentity().reflectY(false);
  const path = d3$1.geoPath(projection);

  const Marks = ({ UsaGeo, data, year, colorScale }) => {
    let dataMap = dataFilter(data, year);
    const states = new Map(UsaGeo[0].features.map(d => [d.id, d.properties.name]));
    
    projection.fitExtent(
      [
        [0, 0],
        [780, 500],
      ],
      UsaGeo[0]
    );
    return (
      React.createElement( 'g', { className: "marks" },
        UsaGeo[0].features.map((feature) => {
          return ( 
          	React.createElement( 'path', { 
              className: "border", d: path(feature), fill: colorScale(dataMap.get(feature.id)) ? 
                   colorScale(dataMap.get(feature.id)) :
                   "grey" },
              React.createElement( 'title', null,
                feature.properties.name, " ", dataMap.get(feature.id)
              )
            )
          )
        }),
        React.createElement( 'path', { className: "interiors", d: path(UsaGeo[1]) })
      )
    );
  };

  const csvUrl = 'https://gist.githubusercontent.com/bopingx2/3da0f8779fb42baa318f8c0008af168f/raw/d7942f8738fc360bf26ade5a08433bfa88010675/year.csv';

  const useData = () => {
  	const [data, setData] = React$1.useState(null);
    
    React$1.useEffect(() => {
      let max = 0;
      let min = 2400;
      
      const row = d => {
        for (const property in d) {
        	if (property === "id")
            continue;
          if (+d[property] > max) {
          	max = +d[property];
          }
          if (+d[property] < min) {
          	min = +d[property];
          }
        }
      	return d;
      };
    	d3$1.csv(csvUrl, row).then((res) => {
        res.max = max;
        res.min = min;
        setData(res);
      });
    }, []);
    
    return data;
  };

  const legendScale = d3.scaleLinear()
      .domain([0, 2700])
      .range([0, 270]);

  const ColorLegend = () => (
    React$1__default.createElement( 'g', { transform: `translate(450, 15)` },
      React$1__default.createElement( 'defs', null,
        React$1__default.createElement( 'linearGradient', { id: "grad1", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
          React$1__default.createElement( 'stop', {
            offset: "0%", style: { stopColor: "grey", stopOpacity: 1 } }),
          React$1__default.createElement( 'stop', {
            offset: "11%", style: { stopColor: "grey", stopOpacity: 1 } }),
          React$1__default.createElement( 'stop', {
            offset: "11.1%", style: { stopColor: d3$1.interpolateTurbo(0), stopOpacity: 1 } }),
          React$1__default.createElement( 'stop', {
            offset: "25%", style: { stopColor: d3$1.interpolateTurbo(0.25), stopOpacity: 1 } }),
          React$1__default.createElement( 'stop', {
            offset: "50%", style: { stopColor: d3$1.interpolateTurbo(0.5), stopOpacity: 1 } }),
          React$1__default.createElement( 'stop', {
            offset: "75%", style: { stopColor: d3$1.interpolateTurbo(0.75), stopOpacity: 1 } }),
          React$1__default.createElement( 'stop', {
            offset: "100%", style: { stopColor: d3$1.interpolateTurbo(1), stopOpacity: 1 } })
        )
      ),
      React$1__default.createElement( 'text', { 'font-size': "12", x: "80" }, "Hate Crime Counts"),
      React$1__default.createElement( 'rect', { width: "270", height: "15", y: "2", fill: "url(#grad1)" }),
      React$1__default.createElement( 'g', { fill: "none", 'font-size': "10", 'font-family': "sans-serif", 'text-anchor': "middle" },
        React$1__default.createElement( 'g', { class: "tick", opacity: "1", transform: `translate(${legendScale(0)},1)` },
          React$1__default.createElement( 'line', { stroke: "black", y2: "24" }),
          React$1__default.createElement( 'text', { fill: "currentColor", y: "26", dy: "0.71em" }, "NA")
        ),
        React$1__default.createElement( 'g', { class: "tick", opacity: "1", transform: `translate(${legendScale(300)},1)` },
          React$1__default.createElement( 'line', { stroke: "black", y2: "24" }),
          React$1__default.createElement( 'text', { fill: "currentColor", y: "26", dy: "0.71em" }, "0")
        ),
        React$1__default.createElement( 'g', { class: "tick", opacity: "1", transform: `translate(${legendScale(600)},1)` },
          React$1__default.createElement( 'line', { stroke: "black", y2: "24" }),
          React$1__default.createElement( 'text', { fill: "currentColor", y: "26", dy: "0.71em" }, "300")
        ),
        React$1__default.createElement( 'g', { class: "tick", opacity: "1", transform: `translate(${legendScale(900)},1)` },
          React$1__default.createElement( 'line', { stroke: "black", y2: "24" }),
          React$1__default.createElement( 'text', { fill: "currentColor", y: "26", dy: "0.71em" }, "600")
        ),
        React$1__default.createElement( 'g', { class: "tick", opacity: "1", transform: `translate(${legendScale(1200)},1)` },
          React$1__default.createElement( 'line', { stroke: "black", y2: "24" }),
          React$1__default.createElement( 'text', { fill: "currentColor", y: "26", dy: "0.71em" }, "900")
        ),
        React$1__default.createElement( 'g', { class: "tick", opacity: "1", transform: `translate(${legendScale(1500)},1)` },
         	React$1__default.createElement( 'line', { stroke: "black", y2: "24" }),
          React$1__default.createElement( 'text', { fill: "currentColor", y: "26", dy: "0.71em" }, "1200")
        ),
        React$1__default.createElement( 'g', { class: "tick", opacity: "1", transform: `translate(${legendScale(1800)},1)` },
          React$1__default.createElement( 'line', { stroke: "black", y2: "24" }),
          React$1__default.createElement( 'text', { fill: "currentColor", y: "26", dy: "0.71em" }, "1500")
        ),
        React$1__default.createElement( 'g', { class: "tick", opacity: "1", transform: `translate(${legendScale(2100)},1)` },
          React$1__default.createElement( 'line', { stroke: "black", y2: "24" }),
          React$1__default.createElement( 'text', { fill: "currentColor", y: "26", dy: "0.71em" }, "1800")
        ),
        React$1__default.createElement( 'g', { class: "tick", opacity: "1", transform: `translate(${legendScale(2400)},1)` },
          React$1__default.createElement( 'line', { stroke: "black", y2: "24" }),
          React$1__default.createElement( 'text', { fill: "currentColor", y: "26", dy: "0.71em" }, "2100")
        ),
        React$1__default.createElement( 'g', { class: "tick", opacity: "1", transform: `translate(${legendScale(2700)},1)` },
          React$1__default.createElement( 'line', { stroke: "black", y2: "24" }),
          React$1__default.createElement( 'text', { fill: "currentColor", y: "26", dy: "0.71em" }, "2400")
        )
      )
    )
  );

  const width = 800;
  const height = 800;
  const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0, 2100]);

  const App = () => {
    const data = useData();
    const UsaGeo = useUsaGeo();
    const [year, setYear] = React$1.useState(1991);

    if (!UsaGeo || !data) {
      return React$1__default.createElement( 'pre', null, "Loading..." );
    }

    const handleSliderChange = (event) => {
      setYear(event.target.value);
    };

    const play = () => {
      console.log(year);
      if (+year === 2020) {
        console.log(2020);
        return;
      }

      let y = year;
      const x = setInterval(() => {
        y++;
        setYear(y);
        console.log(y);
        if (y === 2020) {
          clearInterval(x);
        }
      }, 1000);
    };
    
    const stop = () => {
      var highestTimeoutId = setTimeout(";");
      for (var i = 0 ; i < highestTimeoutId ; i++) {
        clearTimeout(i); 
      }
    };

    return (
      React$1__default.createElement( 'div', { class: "flex-container" },
        React$1__default.createElement( 'div', { class: "slider-wrapper" },
          React$1__default.createElement( 'label', { for: "year" }, "Year ", year),
          React$1__default.createElement( 'div', null,
            React$1__default.createElement( 'input', {
              type: "range", id: "year", name: "year", min: "1991", max: "2020", step: "1", list: "tickmarks", value: year, onChange: (e) => handleSliderChange(e) }),
            React$1__default.createElement( 'datalist', { id: "tickmarks" },
              React$1__default.createElement( 'option', { value: "1991", label: "1991" }),
              React$1__default.createElement( 'option', { value: "1995", label: "1995" }),
              React$1__default.createElement( 'option', { value: "2000", label: "2000" }),
              React$1__default.createElement( 'option', { value: "2005", label: "2005" }),
              React$1__default.createElement( 'option', { value: "2010", label: "2010" }),
              React$1__default.createElement( 'option', { value: "2015", label: "2015" }),
              React$1__default.createElement( 'option', { value: "2020", label: "2020" })
            )
          )
        ),
        React$1__default.createElement( 'div', { class: "button-wrapper" },
        	React$1__default.createElement( 'input', {
            id: "button2", type: "button", value: "play", style: { height: 20, width: 50 }, onClick: play }),
        	React$1__default.createElement( 'input', {
            id: "button1", type: "button", value: "stop", style: { height: 20, width: 50, margingLeft: 5}, onClick: stop })
        ),

        React$1__default.createElement( 'svg', { width: width, height: height },
          React$1__default.createElement( Marks, {
            UsaGeo: UsaGeo, data: data, year: year, colorScale: colorScale }),
          React$1__default.createElement( 'g', null,
            React$1__default.createElement( ColorLegend, null )
          )
        )
      )
    );
  };

  ReactDOM.render(React$1__default.createElement( App, null ), document.getElementById('root'));

}(React, ReactDOM, d3, topojson));
